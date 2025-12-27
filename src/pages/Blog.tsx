import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, User, ArrowLeft, Search, Tag, 
  Eye, BookOpen, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };

  return (
    <>
      <Helmet>
        <title>بلاگ | آژانس ازما - مقالات دیجیتال مارکتینگ و فناوری</title>
        <meta name="description" content="مقالات تخصصی در زمینه دیجیتال مارکتینگ، سئو، طراحی سایت، هوش مصنوعی و فناوری. آخرین اخبار و آموزش‌های حرفه‌ای." />
        <meta name="keywords" content="بلاگ دیجیتال مارکتینگ, مقالات سئو, آموزش طراحی سایت, اخبار فناوری, هوش مصنوعی" />
        <link rel="canonical" href="https://azmamarkteng.ir/blog" />
        <meta property="og:title" content="بلاگ آژانس ازما" />
        <meta property="og:description" content="مقالات تخصصی دیجیتال مارکتینگ و فناوری" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "بلاگ آژانس ازما",
            "url": "https://azmamarkteng.ir/blog",
            "description": "مقالات تخصصی دیجیتال مارکتینگ و فناوری",
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

        {/* Hero Section */}
        <section className="pt-28 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                بلاگ و مقالات
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                دانش <span className="text-gradient-gold">طلایی</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed px-4">
                آخرین مقالات، آموزش‌ها و اخبار دنیای دیجیتال مارکتینگ
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-6 md:py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در مقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory 
                      ? "bg-primary text-primary-foreground" 
                      : "glass hover:border-primary/50"
                  }`}
                >
                  همه
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat 
                        ? "bg-primary text-primary-foreground" 
                        : "glass hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-secondary/50" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-secondary/50 rounded w-1/3" />
                      <div className="h-6 bg-secondary/50 rounded" />
                      <div className="h-4 bg-secondary/50 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  مقاله‌ای یافت نشد
                </h3>
                <p className="text-muted-foreground">
                  به زودی مقالات جدید منتشر خواهد شد
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group glass rounded-3xl overflow-hidden"
                  >
                    {/* Image */}
                    <Link to={`/blog/${post.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featured_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                        {post.category && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold">
                            {post.category}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time} دقیقه
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views_count}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`}>
                        <h3 className="text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author_name || "تیم ازما"}
                        </span>
                        <Link to={`/blog/${post.slug}`}>
                          <motion.span
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-1 text-primary text-sm font-medium"
                          >
                            ادامه مطلب
                            <ArrowLeft className="w-4 h-4" />
                          </motion.span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10" />
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                  می‌خواهید بیشتر یاد بگیرید؟
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  برای دریافت آخرین مقالات و آموزش‌ها با ما در تماس باشید
                </p>
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/contact">
                    تماس با ما
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
};

export default Blog;
