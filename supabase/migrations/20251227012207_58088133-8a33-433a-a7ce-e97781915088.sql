
-- جدول تنظیمات سایت
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- فعال‌سازی RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- سیاست‌های RLS برای site_settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- جدول محتوای قابل ویرایش
CREATE TABLE public.editable_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name text NOT NULL,
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  content text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_name, section_key)
);

ALTER TABLE public.editable_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage editable content"
ON public.editable_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read editable content"
ON public.editable_content
FOR SELECT
USING (true);

-- جدول نمونه کارها
CREATE TABLE public.portfolio_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  category text,
  client_name text,
  project_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage portfolio"
ON public.portfolio_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active portfolio"
ON public.portfolio_items
FOR SELECT
USING (is_active = true);

-- جدول تاریخچه AI
CREATE TABLE public.ai_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  prompt text,
  result text,
  image_url text,
  video_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all AI history"
ON public.ai_history
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own AI history"
ON public.ai_history
FOR SELECT
USING (auth.uid() = user_id);

-- جدول سفارشات
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  status text DEFAULT 'pending',
  total_amount numeric DEFAULT 0,
  items jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage orders"
ON public.orders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Triggers برای updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_editable_content_updated_at
BEFORE UPDATE ON public.editable_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- داده‌های اولیه
INSERT INTO public.site_settings (key, value) VALUES
('admin_phone', '09914601322'),
('sms_api_token', 'lIVrNnbcGYGDXqWNLmWjcDq66ssrE5xs'),
('sms_provider', 'inoti'),
('shop_open', 'true'),
('site_name', 'آژانس طراحی آزما');
