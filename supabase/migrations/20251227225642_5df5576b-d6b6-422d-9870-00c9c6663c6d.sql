-- Create businesses table for customer club
CREATE TABLE public.club_businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  discount_percent INTEGER,
  discount_amount NUMERIC,
  description TEXT,
  category TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking discount usage
CREATE TABLE public.club_discount_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.club_businesses(id) ON DELETE CASCADE,
  user_id UUID,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create club stats table for dynamic numbers
CREATE TABLE public.club_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.club_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_discount_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for club_businesses
CREATE POLICY "Anyone can view active businesses" 
ON public.club_businesses 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage businesses" 
ON public.club_businesses 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for club_discount_usage
CREATE POLICY "Anyone can insert usage" 
ON public.club_discount_usage 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all usage" 
ON public.club_discount_usage 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for club_stats
CREATE POLICY "Anyone can view stats" 
ON public.club_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage stats" 
ON public.club_stats 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial stats
INSERT INTO public.club_stats (key, value) VALUES 
('total_users', 3200),
('active_businesses', 50);

-- Insert sample businesses
INSERT INTO public.club_businesses (name, discount_percent, description, category) VALUES 
('رستوران آرامش', 20, 'تخفیف ویژه برای اعضای باشگاه', 'رستوران'),
('کافه لانژ', 15, 'تخفیف روی تمام نوشیدنی‌ها', 'کافه'),
('آرایشگاه زیبا', 25, 'تخفیف خدمات زیبایی', 'زیبایی'),
('باشگاه ورزشی قهرمان', 30, 'تخفیف اشتراک ماهانه', 'ورزشی'),
('فروشگاه دیجیتال', 10, 'تخفیف لوازم الکترونیکی', 'فروشگاه'),
('آموزشگاه زبان پارس', 20, 'تخفیف دوره‌های زبان', 'آموزش');