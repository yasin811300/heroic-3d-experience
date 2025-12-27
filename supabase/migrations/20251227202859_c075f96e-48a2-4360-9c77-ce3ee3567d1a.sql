-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Anyone can read published posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

-- Policy: Admins can manage all posts
CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);