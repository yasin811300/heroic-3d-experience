import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Brain, Cpu, Rocket, Zap, ArrowLeft, Calendar, User, Clock, 
  TrendingUp, Globe, Sparkles, Bot, Newspaper 
} from "lucide-react";
import { Link } from "react-router-dom";

const newsItems = [
  {
    id: 1,
    title: "نسل جدید مدل‌های زبانی GPT-5",
    excerpt: "غول‌های تکنولوژی مدل‌هایی را عرضه کرده‌اند که قدرت پردازش تصویر و ویدیو را به طور همزمان دارند.",
    category: "ترند جهانی",
    date: "۲۵ دی ۱۴۰۳",
    author: "تیم ازما",
    readTime: "۵ دقیقه",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "AI در قلب استراتژی‌های فروش",
    excerpt: "ابزارهای جدید هوش مصنوعی اکنون می‌توانند کمپین‌های بازاریابی را به طور خودکار مدیریت کنند.",
    category: "اتوماسیون بازاریابی",
    date: "۲۰ دی ۱۴۰۳",
    author: "تیم ازما",
    readTime: "۴ دقیقه",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    color: "from-primary/20 to-orange-500/20",
  },
  {
    id: 3,
    title: "رویدادهای بزرگ هوش مصنوعی در ایران",
    excerpt: "کنفرانس‌های اخیر با حضور متخصصان داخلی و بین‌المللی بر نقش AI در صنعت تمرکز داشتند.",
    category: "نوآوری در ایران",
    date: "۱۵ دی ۱۴۰۳",
    author: "تیم ازما",
    readTime: "۶ دقیقه",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
    color: "from-green-500/20 to-cyan-500/20",
  },
  {
    id: 4,
    title: "چگونه AI تجربه مشتری را متحول می‌کند",
    excerpt: "چت‌بات‌های هوشمند و سیستم‌های توصیه‌گر، آینده خدمات مشتریان را شکل می‌دهند.",
    category: "تجربه مشتری",
    date: "۱۰ دی ۱۴۰۳",
    author: "تیم ازما",
    readTime: "۷ دقیقه",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 5,
    title: "آینده طراحی گرافیک با هوش مصنوعی",
    excerpt: "ابزارهای AI مانند Midjourney و DALL-E صنعت طراحی را دگرگون کرده‌اند.",
    category: "طراحی و خلاقیت",
    date: "۵ دی ۱۴۰۳",
    author: "تیم ازما",
    readTime: "۵ دقیقه",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=400&fit=crop",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: 6,
    title: "سئو در عصر جستجوی هوشمند",
    excerpt: "الگوریتم‌های جدید گوگل با AI، نحوه رتبه‌بندی سایت‌ها را تغییر داده‌اند.",
    category: "سئو و دیجیتال",
    date: "۱ دی ۱۴۰۳",
    author: "تیم ازما",
    readTime: "۸ دقیقه",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    color: "from-amber-500/20 to-yellow-500/20",
  },
];

const stats = [
  { icon: Brain, value: "۹۵٪", label: "شرکت‌ها از AI استفاده می‌کنند" },
  { icon: TrendingUp, value: "۳۰۰٪", label: "رشد بازار AI در ۲۰۲۴" },
  { icon: Globe, value: "۱.۵T$", label: "ارزش بازار جهانی AI" },
  { icon: Zap, value: "۲۴/۷", label: "اتوماسیون هوشمند" },
];

const AINews = () => {
  return (
    <>
      <Helmet>
        <title>اخبار هوش مصنوعی | آژانس ازما - آخرین تحولات AI و فناوری</title>
        <meta name="description" content="جدیدترین اخبار هوش مصنوعی، ترندها و پیشرفت‌های AI برای کسب‌وکار شما. آژانس ازما آینده را امروز به کسب‌وکار شما می‌آورد." />
        <meta name="keywords" content="اخبار هوش مصنوعی, AI, ChatGPT, GPT-5, دیجیتال مارکتینگ, اتوماسیون بازاریابی, فناوری" />
        <link rel="canonical" href="https://azmamarkteng.ir/ai-news" />
        <meta property="og:title" content="اخبار هوش مصنوعی | آژانس ازما" />
        <meta property="og:description" content="جدیدترین اخبار و تحولات جهانی هوش مصنوعی" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "اخبار هوش مصنوعی آژانس ازما",
            "url": "https://azmamarkteng.ir/ai-news",
            "description": "جدیدترین اخبار و تحولات جهانی هوش مصنوعی",
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
        <section className="pt-28 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                به‌روزترین اخبار AI
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                تحولات جهانی <span className="text-gradient-gold">هوش مصنوعی</span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground mb-8 leading-relaxed px-4">
                جدیدترین اخبار، ترندها و پیشرفت‌های AI برای کسب‌وکار شما
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 md:py-12 relative">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-4 md:p-6 text-center"
                >
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
                  <div className="text-xl md:text-2xl font-black text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-[10px] md:text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {newsItems.map((news, index) => (
                <motion.article
                  key={news.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group glass rounded-3xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${news.color} to-transparent`} />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] md:text-xs font-bold">
                      {news.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {news.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {news.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-4 line-clamp-2">
                      {news.excerpt}
                    </p>
                    
                    <motion.div
                      whileHover={{ x: -5 }}
                      className="flex items-center gap-2 text-primary text-sm font-medium cursor-pointer"
                    >
                      ادامه مطلب
                      <ArrowLeft className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10" />
              
              <div className="relative z-10">
                <Bot className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                  آینده را امروز به کسب‌وکار شما می‌آوریم
                </h2>
                <p className="text-muted-foreground text-sm md:text-lg mb-8 max-w-2xl mx-auto">
                  با استفاده از هوش مصنوعی، کسب‌وکار خود را متحول کنید
                </p>
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/contact">
                    مشاوره تخصصی AI
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

export default AINews;
