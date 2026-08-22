import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LatestPost {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  featured_image: string | null;
  read_time: number | null;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<LatestPost[]>([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, category, featured_image, read_time")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      setPosts(data ?? []);
    };

    fetchLatestPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-12 md:py-16 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6 gap-4"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              آخرین <span className="text-gradient-gold">مقالات</span>
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link to="/blog">همه مقالات <ArrowLeft className="w-4 h-4" /></Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group glass rounded-lg overflow-hidden"
            >
              <Link to={`/blog/${post.slug}`} className="flex h-28 md:h-32">
                {post.featured_image && (
                  <div className="w-28 md:w-32 shrink-0 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1 p-4 flex flex-col justify-between">
                  <div>
                    {post.category && <span className="text-[11px] font-bold text-primary">{post.category}</span>}
                    <h3 className="mt-1 text-sm md:text-base font-bold leading-6 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {post.read_time ?? 5} دقیقه مطالعه
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
