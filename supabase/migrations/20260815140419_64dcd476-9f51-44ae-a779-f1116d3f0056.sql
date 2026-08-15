CREATE TABLE public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  title text,
  bio text default '',
  image_url text default '',
  telegram text,
  instagram text,
  linkedin text,
  twitter text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team_public_read" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "team_admin_all" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.builder_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  bio text default '',
  avatar_url text default '',
  theme jsonb not null default '{}'::jsonb,
  blocks jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.builder_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.builder_pages TO authenticated;
GRANT ALL ON public.builder_pages TO service_role;
ALTER TABLE public.builder_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "builder_public_read" ON public.builder_pages FOR SELECT USING (is_published = true);
CREATE POLICY "builder_admin_all" ON public.builder_pages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER builder_pages_updated_at BEFORE UPDATE ON public.builder_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.team_members (name, role, title, bio, image_url, telegram, instagram, display_order) VALUES
('یاسین سالارناظم','مدیرعامل و بنیان‌گذار',null,'بنیان‌گذار آژانس ازما با تجربه در دیجیتال مارکتینگ','https://azmamarkteng.ir/yasin.jpg','https://t.me/yasin_salarnazem','https://instagram.com/yasin_salarnazem',1),
('نگین سلمانی','طراح سایت و سئو کار','ملکه کدنویسی ازما 👑','۴ سال تجربه در طراحی وب و سئو','/team/negin-salmani.jpg',null,null,2);