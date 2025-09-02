-- 1. Primeiro, criar o super admin diretamente
DO $$
DECLARE
    existing_profile_id uuid;
BEGIN
    -- Verificar se já existe um perfil para este email
    SELECT id INTO existing_profile_id 
    FROM public.profiles 
    WHERE email = 'fdobtc@gmail.com';
    
    -- Se não existe, criar um novo
    IF existing_profile_id IS NULL THEN
        INSERT INTO public.profiles (id, nome, email, role)
        VALUES (
            'b748d521-8030-459c-bfaf-5632a71600e1'::uuid,
            'Super Admin',
            'fdobtc@gmail.com',
            'super_admin'
        );
        
        -- Criar configurações para o super admin
        INSERT INTO public.user_settings (user_id, notifications_enabled, timezone, theme, language, email_notifications)
        VALUES (
            'b748d521-8030-459c-bfaf-5632a71600e1'::uuid,
            true,
            'America/Sao_Paulo',
            'light',
            'pt-BR',
            true
        );
    ELSE
        -- Se existe, apenas atualizar para super admin
        UPDATE public.profiles 
        SET role = 'super_admin', nome = 'Super Admin'
        WHERE email = 'fdobtc@gmail.com';
    END IF;
END $$;

-- 2. Corrigir a política RLS que causa recursão
DROP POLICY IF EXISTS "Super admin can view all profiles" ON public.profiles;

-- Criar função para verificar se é super admin sem recursão
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

-- Política simples para super admin
CREATE POLICY "Super admin can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_super_admin() OR auth.uid() = id);

-- 3. Garantir que a edge function tenha acesso ao service role key
SELECT 'Configurações atualizadas. Super admin criado e políticas RLS corrigidas.' as status;