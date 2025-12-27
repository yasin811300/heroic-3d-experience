-- Fix site_settings RLS: Remove public read access for sensitive keys
-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

-- Create a new policy that only allows reading non-sensitive keys publicly
CREATE POLICY "Anyone can read non-sensitive site settings" 
ON public.site_settings 
FOR SELECT 
USING (
  key NOT IN ('sms_api_token', 'admin_phone', 'api_key', 'secret_key', 'private_key', 'password')
);

-- Keep admin full access (already exists but let's make sure)
-- Admins can still read ALL settings including sensitive ones