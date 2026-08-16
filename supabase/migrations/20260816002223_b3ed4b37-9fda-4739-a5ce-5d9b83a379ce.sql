GRANT SELECT ON public.builder_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.builder_pages TO authenticated;
GRANT ALL ON public.builder_pages TO service_role;

GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

DROP POLICY IF EXISTS builder_admin_all ON public.builder_pages;
CREATE POLICY builder_admin_all
ON public.builder_pages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS builder_public_read ON public.builder_pages;
CREATE POLICY builder_public_read
ON public.builder_pages
FOR SELECT
TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS team_admin_all ON public.team_members;
CREATE POLICY team_admin_all
ON public.team_members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS team_public_read ON public.team_members;
CREATE POLICY team_public_read
ON public.team_members
FOR SELECT
TO anon, authenticated
USING (is_active = true);