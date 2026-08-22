DROP POLICY IF EXISTS "Anyone can insert usage" ON public.club_discount_usage;
REVOKE INSERT ON public.club_discount_usage FROM PUBLIC, anon;
GRANT INSERT ON public.club_discount_usage TO authenticated;
GRANT ALL ON public.club_discount_usage TO service_role;
CREATE POLICY "Authenticated users can record own usage"
ON public.club_discount_usage
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

ALTER FUNCTION public.has_role(uuid, public.app_role) SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role, supabase_auth_admin;

DROP POLICY IF EXISTS "Users can view own azma files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own azma files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own azma files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own azma files" ON storage.objects;

CREATE POLICY "Users can view own azma files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'azma' AND owner_id = (SELECT auth.uid()::text));

CREATE POLICY "Users can upload own azma files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'azma' AND owner_id = (SELECT auth.uid()::text));

CREATE POLICY "Users can update own azma files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'azma' AND owner_id = (SELECT auth.uid()::text))
WITH CHECK (bucket_id = 'azma' AND owner_id = (SELECT auth.uid()::text));

CREATE POLICY "Users can delete own azma files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'azma' AND owner_id = (SELECT auth.uid()::text));