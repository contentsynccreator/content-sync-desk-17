-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create canais table
CREATE TABLE public.canais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  link TEXT NOT NULL,
  lingua TEXT NOT NULL,
  nicho TEXT NOT NULL,
  sub_nicho TEXT NOT NULL,
  micro_nicho TEXT NOT NULL,
  freq_postagem TEXT NOT NULL,
  cor TEXT NOT NULL,
  logo_url TEXT,
  dias_postagem TEXT[] DEFAULT '{}',
  horarios_postagem TEXT[] DEFAULT '{}',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alarme_urgente_dias INTEGER DEFAULT 3,
  alarme_alerta_dias INTEGER DEFAULT 7,
  alarme_minimo_videos INTEGER DEFAULT 5,
  alarme_tipo TEXT DEFAULT 'dias' CHECK (alarme_tipo IN ('dias', 'quantidade')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ideias' CHECK (status IN ('ideias', 'roteiro', 'audio', 'edicao', 'pronto')),
  canal_id UUID NOT NULL REFERENCES public.canais(id) ON DELETE CASCADE,
  responsavel_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_agendada TIMESTAMP WITH TIME ZONE,
  hora_agendada TEXT,
  thumbnail_pronta BOOLEAN DEFAULT FALSE,
  google_drive_link TEXT,
  google_drive_folder_link TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ideias table
CREATE TABLE public.ideias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  canal_id UUID NOT NULL REFERENCES public.canais(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_videos table
CREATE TABLE public.scheduled_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  canal_id UUID NOT NULL REFERENCES public.canais(id) ON DELETE CASCADE,
  data_agendada TIMESTAMP WITH TIME ZONE NOT NULL,
  hora_agendada TEXT NOT NULL,
  link_youtube TEXT,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'publicado')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile and team members" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()
));

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create RLS policies for canais
CREATE POLICY "Users can view their own canais" 
ON public.canais FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own canais" 
ON public.canais FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canais" 
ON public.canais FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own canais" 
ON public.canais FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for videos
CREATE POLICY "Users can view their own videos" 
ON public.videos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own videos" 
ON public.videos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
ON public.videos FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
ON public.videos FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for ideias
CREATE POLICY "Users can view their own ideias" 
ON public.ideias FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideias" 
ON public.ideias FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideias" 
ON public.ideias FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideias" 
ON public.ideias FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for scheduled_videos
CREATE POLICY "Users can view their own scheduled videos" 
ON public.scheduled_videos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled videos" 
ON public.scheduled_videos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled videos" 
ON public.scheduled_videos FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled videos" 
ON public.scheduled_videos FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_canais_updated_at
  BEFORE UPDATE ON public.canais
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ideias_updated_at
  BEFORE UPDATE ON public.ideias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_videos_updated_at
  BEFORE UPDATE ON public.scheduled_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();