
-- Criar tabela para gerenciar membros da equipe (usuarios)
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios
CREATE POLICY "Users can view team members" ON public.usuarios FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid())
);

CREATE POLICY "Admins can create team members" ON public.usuarios FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM usuarios WHERE usuarios.user_id = auth.uid() AND usuarios.role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins can update team members" ON public.usuarios FOR UPDATE USING (
  EXISTS (SELECT 1 FROM usuarios WHERE usuarios.user_id = auth.uid() AND usuarios.role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins can delete team members" ON public.usuarios FOR DELETE USING (
  EXISTS (SELECT 1 FROM usuarios WHERE usuarios.user_id = auth.uid() AND usuarios.role IN ('admin', 'super_admin'))
);

-- Criar tabela para canais de competidores
CREATE TABLE public.competitor_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  link TEXT NOT NULL,
  nicho TEXT,
  subscribers_count INTEGER,
  avg_views INTEGER,
  upload_frequency TEXT,
  content_style TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para competitor_channels
ALTER TABLE public.competitor_channels ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para competitor_channels
CREATE POLICY "Users can view their own competitor channels" ON public.competitor_channels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own competitor channels" ON public.competitor_channels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own competitor channels" ON public.competitor_channels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own competitor channels" ON public.competitor_channels FOR DELETE USING (auth.uid() = user_id);

-- Criar tabela para configurações de usuário
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Criar função para autenticação de membros (para MemberAuth)
CREATE OR REPLACE FUNCTION public.authenticate_member(p_username TEXT, p_password TEXT)
RETURNS TABLE(
  member_id UUID,
  member_name TEXT,
  session_token TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Por enquanto, retorna dados simulados para teste
  -- Em produção, implementar verificação real de credenciais
  IF p_username = 'admin' AND p_password = 'admin123' THEN
    RETURN QUERY SELECT 
      gen_random_uuid() as member_id,
      'Administrador' as member_name,
      encode(gen_random_bytes(32), 'base64') as session_token;
  ELSE
    RETURN;
  END IF;
END;
$$;

-- Adicionar triggers para updated_at em todas as novas tabelas
CREATE TRIGGER update_usuarios_updated_at 
  BEFORE UPDATE ON public.usuarios 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitor_channels_updated_at 
  BEFORE UPDATE ON public.competitor_channels 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON public.user_settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais para o primeiro usuário admin (opcional)
-- Esta inserção só funcionará se houver um usuário autenticado
-- INSERT INTO public.usuarios (user_id, nome, email, role) 
-- SELECT auth.uid(), 'Admin Principal', 'admin@exemplo.com', 'super_admin'
-- WHERE auth.uid() IS NOT NULL 
-- ON CONFLICT (email) DO NOTHING;
