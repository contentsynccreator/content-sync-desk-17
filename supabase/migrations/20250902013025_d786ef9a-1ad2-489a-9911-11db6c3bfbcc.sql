-- Corrigir política RLS recursiva na tabela profiles
DROP POLICY IF EXISTS "Users can view their own profile and team members" ON public.profiles;

-- Criar política simples sem recursão
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Política para super admin ver todos os perfis
CREATE POLICY "Super admin can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);

-- Criar função para criar usuário com senha
CREATE OR REPLACE FUNCTION public.create_team_member(
  p_email text,
  p_password text,
  p_nome text,
  p_role text DEFAULT 'editor'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem criar membros da equipe.';
  END IF;

  -- Criar usuário no auth.users via admin API
  -- Isso será feito via edge function
  -- Por enquanto, vamos simular criando apenas na tabela usuarios
  
  new_user_id := gen_random_uuid();
  
  -- Inserir na tabela usuarios (sistema interno de membros)
  INSERT INTO public.usuarios (user_id, nome, email, role)
  VALUES (new_user_id, p_nome, p_email, p_role);
  
  RETURN new_user_id;
END;
$$;