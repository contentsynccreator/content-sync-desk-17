-- Atualizar usuário existente para super admin
UPDATE public.profiles 
SET role = 'super_admin', nome = 'Super Admin'
WHERE email = 'fdobtc@gmail.com';

-- Corrigir política RLS recursiva
DROP POLICY IF EXISTS "Super admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Criar função segura para verificar super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT CASE 
    WHEN auth.uid() = 'b748d521-8030-459c-bfaf-5632a71600e1'::uuid THEN true
    ELSE false
  END;
$$;

-- Política simplificada sem recursão
CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR 
  auth.uid() = 'b748d521-8030-459c-bfaf-5632a71600e1'::uuid
);

-- Verificar se as configurações do usuário existem
INSERT INTO public.user_settings (user_id, notifications_enabled, timezone, theme, language, email_notifications)
SELECT 
  'b748d521-8030-459c-bfaf-5632a71600e1'::uuid,
  true,
  'America/Sao_Paulo',
  'light',
  'pt-BR',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_settings 
  WHERE user_id = 'b748d521-8030-459c-bfaf-5632a71600e1'::uuid
);

SELECT 'Super admin configurado com sucesso!' as status;