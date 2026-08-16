GRANT SELECT ON public.editable_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editable_content TO authenticated;
GRANT ALL ON public.editable_content TO service_role;

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;