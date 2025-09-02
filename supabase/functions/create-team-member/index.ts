import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateMemberRequest {
  email: string;
  password: string;
  nome: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando criação de membro da equipe...');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create regular Supabase client for RLS checks
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {}
      }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('Current user:', user.id);

    // Check if current user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
      console.error('Permission error. User role:', profile?.role);
      return new Response(
        JSON.stringify({ error: 'Access denied. Only admins can create team members.' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const { email, password, nome, role }: CreateMemberRequest = await req.json();
    console.log('Creating user with email:', email, 'role:', role);

    // Create user in auth.users using admin client
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        nome: nome
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('User created successfully:', newUser.user.id);

    // Update the profile role (the trigger should have created a basic profile)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: role })
      .eq('id', newUser.user.id);

    if (updateError) {
      console.error('Error updating profile role:', updateError);
    }

    // Also create entry in usuarios table for team management
    const { error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        user_id: newUser.user.id,
        nome: nome,
        email: email,
        role: role
      });

    if (usuarioError) {
      console.error('Error creating usuario entry:', usuarioError);
    }

    console.log('Team member created successfully:', {
      id: newUser.user.id,
      email: email,
      nome: nome,
      role: role
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: newUser.user.id,
        message: `Membro ${nome} criado com sucesso. Login: ${email}, Senha: ${password}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in create-team-member function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);