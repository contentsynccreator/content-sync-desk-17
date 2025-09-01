-- Add google_drive_link to videos table
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS google_drive_link text;

-- Add alert configuration to canais table
ALTER TABLE public.canais ADD COLUMN IF NOT EXISTS alerta_7_dias boolean DEFAULT true;
ALTER TABLE public.canais ADD COLUMN IF NOT EXISTS alerta_3_dias boolean DEFAULT true;
ALTER TABLE public.canais ADD COLUMN IF NOT EXISTS alerta_1_dia boolean DEFAULT true;

-- Update members table to add password hashing functionality
CREATE OR REPLACE FUNCTION public.encrypt_member_password()
RETURNS trigger AS $$
BEGIN
  IF NEW.password_hash IS NOT NULL AND NEW.password_hash != OLD.password_hash THEN
    NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for password encryption
DROP TRIGGER IF EXISTS encrypt_member_password_trigger ON public.members;
CREATE TRIGGER encrypt_member_password_trigger
  BEFORE INSERT OR UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_member_password();

-- Create competitor channels table
CREATE TABLE IF NOT EXISTS public.canais_concorrentes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  nome character varying NOT NULL,
  endereco_canal text NOT NULL,
  nicho character varying NOT NULL,
  observacao text,
  detalhes text,
  favorito boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on canais_concorrentes
ALTER TABLE public.canais_concorrentes ENABLE ROW LEVEL SECURITY;

-- Create policies for canais_concorrentes
CREATE POLICY "Usuários podem ver apenas seus próprios canais" 
ON public.canais_concorrentes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar canais para si mesmos" 
ON public.canais_concorrentes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios canais" 
ON public.canais_concorrentes 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar apenas seus próprios canais" 
ON public.canais_concorrentes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  admin_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Admins can view their projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = admin_id);

CREATE POLICY "Admins can insert their projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update their projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = admin_id);

CREATE POLICY "Admins can delete their projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = admin_id);

-- Add project_id to videos table (optional)
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS project_id uuid;

-- Create trigger for updating updated_at on projects
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update member_project_assignments to make project_id optional
ALTER TABLE public.member_project_assignments ALTER COLUMN project_id DROP NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_canais_concorrentes_user_id ON public.canais_concorrentes(user_id);
CREATE INDEX IF NOT EXISTS idx_canais_concorrentes_favorito ON public.canais_concorrentes(favorito);
CREATE INDEX IF NOT EXISTS idx_videos_google_drive_link ON public.videos(google_drive_link) WHERE google_drive_link IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_admin_id ON public.projects(admin_id);

-- Add avatar_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Functions for competitor channels management
CREATE OR REPLACE FUNCTION public.get_competitor_channels(user_uuid uuid)
RETURNS TABLE(
  id uuid,
  nome character varying,
  endereco_canal text,
  nicho character varying,
  observacao text,
  detalhes text,
  favorito boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id,
    cc.nome,
    cc.endereco_canal,
    cc.nicho,
    cc.observacao,
    cc.detalhes,
    cc.favorito,
    cc.created_at,
    cc.updated_at
  FROM public.canais_concorrentes cc
  WHERE cc.user_id = user_uuid
  ORDER BY cc.favorito DESC, cc.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_competitor_channel(user_uuid uuid, channel_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_channel_id uuid;
BEGIN
  INSERT INTO public.canais_concorrentes (
    user_id,
    nome,
    endereco_canal,
    nicho,
    observacao,
    detalhes,
    favorito
  ) VALUES (
    user_uuid,
    (channel_data->>'nome')::character varying,
    channel_data->>'endereco_canal',
    (channel_data->>'nicho')::character varying,
    channel_data->>'observacao',
    channel_data->>'detalhes',
    COALESCE((channel_data->>'favorito')::boolean, false)
  ) RETURNING id INTO new_channel_id;
  
  RETURN new_channel_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_competitor_channel(channel_id uuid, channel_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.canais_concorrentes
  SET 
    nome = (channel_data->>'nome')::character varying,
    endereco_canal = channel_data->>'endereco_canal',
    nicho = (channel_data->>'nicho')::character varying,
    observacao = channel_data->>'observacao',
    detalhes = channel_data->>'detalhes',
    favorito = COALESCE((channel_data->>'favorito')::boolean, false),
    updated_at = now()
  WHERE id = channel_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_competitor_channel(channel_id uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.canais_concorrentes
  WHERE id = channel_id AND user_id = user_uuid;
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_competitor_favorite(channel_id uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.canais_concorrentes
  SET 
    favorito = NOT favorito,
    updated_at = now()
  WHERE id = channel_id AND user_id = user_uuid;
  
  RETURN FOUND;
END;
$$;