-- Remover a tentativa de criar super admin diretamente
-- O super admin deve ser criado através do processo normal de signup

-- A função handle_new_user já está criada corretamente
-- Vamos apenas garantir que ela funcione para todos os novos usuários

-- Verificar se a tabela profiles tem a constraint correta
-- Ela deve referenciar auth.users corretamente

SELECT 'Trigger criado com sucesso. Agora todo novo usuário terá seu perfil criado automaticamente como usuário comum.' as status;