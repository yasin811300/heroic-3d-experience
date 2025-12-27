import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, User, ArrowLeft, ArrowRight, Tag, 
  Eye, Share2, BookOpen, Facebook, Twitter, Linkedin
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  author_name: string | null;
  is_published: boolean;
  published_at: string | null;
  views_count: number;
  read_time: number;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate("/blog");
        return;
      }

      setPost(data);

      // Increment view count
      await supabase
        .from("blog_posts")
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq("id", data.id);

      // Fetch related posts
      if (data.category) {
        const { data: related } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("is_published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);

        setRelatedPosts(related || []);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | بلاگ آژانس ازما</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="keywords" content={post.tags?.join(", ") || "دیجیتال مارکتینگ"} />
        <link rel="canonical" href={`https://azmamarkteng.ir/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:image" content={post.featured_image || ""} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at || ""} />
        <meta property="article:author" content={post.author_name || "تیم ازما"} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featured_image,
            "datePublished": post.published_at,
            "author": {
              "@type": "Person",
              "name": post.author_name || "تیم ازما"
            },
            "publisher": {
              "@type": "Organization",
              "name": "آژانس دیجیتال مارکتینگ ازما"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="noise-overlay" />
        <Header />

        {/* Hero Image */}
        <section className="pt-20 relative">
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <img
              src={post.featured_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=800&fit=crop"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        </section>

        {/* Article Content */}
        <article className="relative -mt-32 z-10">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 md:p-10"
            >
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {post.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {post.category}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.read_time} دقیقه مطالعه
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views_count} بازدید
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-black text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{post.author_name || "تیم ازما"}</div>
                  <div className="text-sm text-muted-foreground">نویسنده</div>
                </div>
              </div>

              {/* Content - Sanitized to prevent XSS */}
              <div 
                className="prose prose-invert prose-lg max-w-none mb-8
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-p:text-muted-foreground prose-p:leading-8
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                  prose-blockquote:border-primary prose-blockquote:text-muted-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(post.content, {
                    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 
                      'ul', 'ol', 'li', 'a', 'strong', 'b', 'em', 'i', 'u', 
                      'blockquote', 'pre', 'code', 'img', 'table', 'thead', 'tbody', 
                      'tr', 'th', 'td', 'span', 'div'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel']
                  })
                }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 pt-8 border-t border-border">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full glass text-sm text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="flex items-center gap-4 pt-8 border-t border-border">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  اشتراک‌گذاری:
                </span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/blog">
                  <ArrowRight className="w-4 h-4" />
                  بازگشت به بلاگ
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <h2 className="text-2xl font-black text-foreground mb-8 text-center">
                مقالات <span className="text-gradient-gold">مرتبط</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related, index) => (
                  <motion.article
                    key={related.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group glass rounded-3xl overflow-hidden"
                  >
                    <Link to={`/blog/${related.slug}`}>
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={related.featured_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop"}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
};

export default BlogPost;
