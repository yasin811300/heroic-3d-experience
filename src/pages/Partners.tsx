import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Building2, ShoppingCart, Gem, Utensils, Shirt, Briefcase,
  ArrowLeft, Star, TrendingUp, Users, Award, Heart,
  Phone, Instagram, Globe, MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const partners = [
  {
    name: "شرکت آریا فود",
    category: "صنایع غذایی",
    service: "مدیریت سوشال مدیا",
    icon: Utensils,
    description: "همکاری در زمینه دیجیتال مارکتینگ و افزایش ۲۰۰٪ فروش آنلاین",
    results: ["۴۵K فالوور جدید", "۳۰۰٪ افزایش تعامل", "۲۰۰٪ رشد فروش"],
    color: "from-orange-500 to-red-500",
  },
  {
    name: "فروشگاه موبایل پلاس",
    category: "خرده‌فروشی",
    service: "طراحی سایت فروشگاهی",
    icon: ShoppingCart,
    description: "طراحی و توسعه فروشگاه آنلاین با سیستم پرداخت یکپارچه",
    results: ["۱۵۰۰ سفارش ماهانه", "۹۸٪ رضایت مشتری", "SEO رتبه ۱"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "جواهری نور",
    category: "لوکس و جواهرات",
    service: "عکاسی و تیزر تبلیغاتی",
    icon: Gem,
    description: "تولید محتوای حرفه‌ای و کمپین‌های تبلیغاتی لوکس",
    results: ["۵۰+ ویدیو تولید شده", "۱M+ بازدید", "برندینگ لوکس"],
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "رستوران سنتی باران",
    category: "هتلداری و پذیرایی",
    service: "کمپین تبلیغاتی",
    icon: Utensils,
    description: "افزایش حضور آنلاین و جذب مشتریان جدید",
    results: ["۲۵۰٪ رشد رزرو", "۶۰K فالوور", "Google ۵ ستاره"],
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "بوتیک شیک‌پوشان",
    category: "پوشاک و فشن",
    service: "ادمین اینستاگرام",
    icon: Shirt,
    description: "مدیریت کامل صفحه اینستاگرام و تولید محتوا",
    results: ["۸۰K فالوور واقعی", "۴۰۰٪ رشد فروش", "۱۰+ کلکسیون"],
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "بازرگانی سپهر",
    category: "تجارت و واردات",
    service: "برندینگ و لوگو",
    icon: Briefcase,
    description: "طراحی هویت بصری کامل و سایت شرکتی",
    results: ["برندینگ کامل", "سایت ۵ زبانه", "رشد صادرات"],
    color: "from-purple-500 to-violet-500",
  },
];

const stats = [
  { icon: Building2, value: "۱۰۰+", label: "شرکت همکار" },
  { icon: Users, value: "۵۰۰+", label: "پروژه موفق" },
  { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
  { icon: Award, value: "۶+", label: "سال تجربه" },
];

const Partners = () => {
  return (
    <>
      <Helmet>
        <title>شرکای تجاری | آژانس ازما - همکاران و مشتریان ما</title>
        <meta name="description" content="معرفی شرکای تجاری و مشتریان آژانس ازما. بیش از ۱۰۰ کسب‌وکار به ما اعتماد کرده‌اند. به خانواده بزرگ ازما بپیوندید." />
        <meta name="keywords" content="شرکای تجاری, مشتریان ازما, همکاران, کسب‌وکارهای همکار, دیجیتال مارکتینگ همدان" />
        <link rel="canonical" href="https://azmamarkteng.ir/partners" />
        <meta property="og:title" content="شرکای تجاری آژانس ازما" />
        <meta property="og:description" content="معرفی شرکای تجاری و مشتریان موفق آژانس ازما" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "شرکای تجاری آژانس ازما",
            "url": "https://azmamarkteng.ir/partners",
            "description": "معرفی شرکای تجاری و مشتریان آژانس ازما",
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
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                شرکای تجاری ما
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                خانواده بزرگ <span className="text-gradient-gold">ازما</span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground mb-8 leading-relaxed px-4">
                افتخار داریم که در کنار این کسب‌وکارهای موفق، مسیر رشد را طی کرده‌ایم
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

        {/* Partners Grid */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {partners.map((partner, index) => (
                <motion.article
                  key={partner.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group glass rounded-3xl overflow-hidden"
                >
                  {/* Header */}
                  <div className={`relative h-28 md:h-32 bg-gradient-to-r ${partner.color} p-4 md:p-6 flex items-center justify-between`}>
                    <div>
                      <span className="text-white/80 text-[10px] md:text-xs font-medium">{partner.category}</span>
                      <h3 className="text-lg md:text-xl font-bold text-white">{partner.name}</h3>
                    </div>
                    <partner.icon className="w-10 h-10 md:w-12 md:h-12 text-white/30" />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-medium mb-3">
                      {partner.service}
                    </div>
                    
                    <p className="text-muted-foreground text-xs md:text-sm mb-4">
                      {partner.description}
                    </p>
                    
                    {/* Results */}
                    <div className="space-y-2 mb-4">
                      {partner.results.map((result, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs text-foreground">
                          <Star className="w-3 h-3 text-primary" />
                          {result}
                        </div>
                      ))}
                    </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />
              
              <div className="relative z-10">
                <Building2 className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                  به جمع خانواده ازما بپیوندید
                </h2>
                <p className="text-muted-foreground text-sm md:text-lg mb-8 max-w-2xl mx-auto">
                  ما به موفقیت کسب‌وکار شما متعهدیم
                </p>
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/contact">
                    شروع همکاری
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

export default Partners;
