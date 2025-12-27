import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const adminEmail = "ali09016512309@gmail.com";
    const adminPassword = "Yasin@811300";

    console.log("Creating admin user...");

    // Create the user using admin API
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
    });

    if (createError) {
      // If user already exists, try to get their ID
      if (createError.message.includes('already been registered')) {
        console.log("User already exists, fetching user...");
        
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          throw listError;
        }

        const existingUser = existingUsers.users.find(u => u.email === adminEmail);
        
        if (existingUser) {
          // Check if already has admin role
          const { data: existingRole } = await supabaseAdmin
            .from('user_roles')
            .select('*')
            .eq('user_id', existingUser.id)
            .eq('role', 'admin')
            .single();

          if (existingRole) {
            return new Response(JSON.stringify({ 
              success: true, 
              message: "Admin user already exists with admin role",
              user_id: existingUser.id 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          // Assign admin role
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: existingUser.id, role: 'admin' });

          if (roleError) {
            throw roleError;
          }

          return new Response(JSON.stringify({ 
            success: true, 
            message: "Admin role assigned to existing user",
            user_id: existingUser.id 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
      throw createError;
    }

    console.log("User created successfully:", userData.user?.id);

    // Assign admin role to the new user
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userData.user!.id, role: 'admin' });

    if (roleError) {
      console.error("Error assigning admin role:", roleError);
      throw roleError;
    }

    console.log("Admin role assigned successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin user created and role assigned successfully",
      user_id: userData.user?.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in create-admin function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
