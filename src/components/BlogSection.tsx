import { motion } from "framer-motion";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    category: "سئو",
    title: "۱۰ راهکار طلایی برای افزایش رتبه سایت در گوگل",
    excerpt: "با این ترفندها سایت خود را به صفحه اول گوگل برسانید...",
    author: "علی احمدی",
    date: "۱۴۰۲/۰۹/۱۵",
    readTime: "۵ دقیقه",
  },
  {
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    category: "اینستاگرام",
    title: "چطور فالوور واقعی جذب کنیم؟",
    excerpt: "راز افزایش فالوور بدون خرید و استفاده از روش‌های غیرقانونی...",
    author: "سارا محمدی",
    date: "۱۴۰۲/۰۹/۱۰",
    readTime: "۷ دقیقه",
  },
  {
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
    category: "طراحی سایت",
    title: "ترندهای طراحی سایت در سال ۲۰۲۴",
    excerpt: "جدیدترین استایل‌ها و تکنولوژی‌های طراحی وب را بشناسید...",
    author: "محمد حسینی",
    date: "۱۴۰۲/۰۹/۰۵",
    readTime: "۶ دقیقه",
  },
];

const BlogSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
              آخرین <span className="text-gradient-gold">مقالات</span>
            </h2>
            <p className="text-muted-foreground">دانش رایگان برای موفقیت شما</p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            همه مقالات
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="group glass rounded-3xl overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                
                {/* Category Badge */}
                <span className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded-full text-primary-foreground text-xs font-bold">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 md:hidden">
          <Button variant="outline" className="w-full gap-2">
            همه مقالات
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
