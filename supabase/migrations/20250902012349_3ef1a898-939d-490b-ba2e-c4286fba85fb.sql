-- Primeiro, vamos remover o trigger existente e recriar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Criar função melhorada para criar perfil automático
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Inserir perfil básico na tabela profiles
  INSERT INTO public.profiles (id, nome, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'  -- Sempre criar como usuário comum
  );

  -- Inserir configurações padrão do usuário
  INSERT INTO public.user_settings (user_id, notifications_enabled, timezone, theme, language, email_notifications)
  VALUES (
    NEW.id,
    true,
    'America/Sao_Paulo',
    'light',
    'pt-BR',
    true
  );

  RETURN NEW;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Garantir que o super admin existe
INSERT INTO public.profiles (id, nome, email, role)
SELECT 
  gen_random_uuid(),
  'Super Admin',
  'fdobtc@gmail.com',
  'super_admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'fdobtc@gmail.com'
);

-- Inserir configurações para o super admin se não existir
INSERT INTO public.user_settings (user_id, notifications_enabled, timezone, theme, language, email_notifications)
SELECT 
  p.id,
  true,
  'America/Sao_Paulo',
  'light',
  'pt-BR',
  true
FROM public.profiles p 
WHERE p.email = 'fdobtc@gmail.com' 
AND NOT EXISTS (
  SELECT 1 FROM public.user_settings WHERE user_id = p.id
);