import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Brush, Code, Search, Smartphone, Video, PenTool, 
  Megaphone, BarChart3, Globe, Shield, Zap, Users,
  Check, ArrowLeft, Star, Clock, Award, Target
} from "lucide-react";
import { Link } from "react-router-dom";

const allServices = [
  {
    icon: Code,
    title: "طراحی و توسعه وب‌سایت",
    description: "سایت‌های مدرن، سریع و واکنش‌گرا با جدیدترین تکنولوژی‌های دنیا. از فروشگاهی تا شرکتی.",
    features: [
      "طراحی UI/UX حرفه‌ای",
      "سایت فروشگاهی با درگاه پرداخت",
      "سایت شرکتی و معرفی",
      "پنل مدیریت اختصاصی",
      "سرعت بالا و بهینه‌سازی",
      "پشتیبانی ۲۴ ساعته"
    ],
    price: "از ۵ میلیون تومان",
    duration: "۱۵ تا ۳۰ روز",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brush,
    title: "طراحی هویت بصری و برندینگ",
    description: "لوگو، ست اداری، بنر، کاتالوگ و همه چیز برای برندینگ حرفه‌ای و متمایز شما.",
    features: [
      "طراحی لوگو منحصربه‌فرد",
      "کارت ویزیت و سربرگ",
      "بسته‌بندی محصولات",
      "طراحی کاتالوگ",
      "بنر و پوستر تبلیغاتی",
      "راهنمای برند"
    ],
    price: "از ۲ میلیون تومان",
    duration: "۷ تا ۱۴ روز",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Search,
    title: "بهینه‌سازی موتور جستجو (SEO)",
    description: "سایت شما را به صفحه اول گوگل می‌رسانیم. رتبه‌بندی تضمینی و افزایش ترافیک ارگانیک.",
    features: [
      "تحلیل کلمات کلیدی",
      "بهینه‌سازی تکنیکال سایت",
      "لینک‌سازی داخلی و خارجی",
      "تولید محتوای سئو شده",
      "گزارش ماهانه عملکرد",
      "رقابت با رقبا"
    ],
    price: "از ۳ میلیون تومان/ماه",
    duration: "۳ تا ۶ ماه",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Smartphone,
    title: "مدیریت شبکه‌های اجتماعی",
    description: "پیج شما را به یک برند موفق تبدیل می‌کنیم. فالوور واقعی، تعامل بالا، فروش واقعی.",
    features: [
      "تولید محتوای هدفمند",
      "افزایش فالوور واقعی",
      "مدیریت کامنت و دایرکت",
      "طراحی پست و استوری",
      "تقویم محتوایی",
      "گزارش عملکرد هفتگی"
    ],
    price: "از ۴ میلیون تومان/ماه",
    duration: "همیشگی",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Video,
    title: "تولید محتوای ویدیویی",
    description: "ویدیوهای حرفه‌ای تبلیغاتی، معرفی محصول، موشن گرافیک و ریلز اینستاگرام.",
    features: [
      "تیزر تبلیغاتی",
      "ویدیو معرفی محصول",
      "موشن گرافیک",
      "ریلز و استوری ویدیویی",
      "تدوین حرفه‌ای",
      "صداگذاری و افکت"
    ],
    price: "از ۱.۵ میلیون تومان",
    duration: "۳ تا ۷ روز",
    color: "from-red-500 to-rose-500"
  },
  {
    icon: Megaphone,
    title: "تبلیغات دیجیتال",
    description: "کمپین‌های تبلیغاتی هدفمند در گوگل، اینستاگرام و سایر پلتفرم‌ها با بازدهی بالا.",
    features: [
      "تبلیغات گوگل ادز",
      "تبلیغات اینستاگرام",
      "تبلیغات بنری",
      "ریتارگتینگ",
      "بهینه‌سازی نرخ تبدیل",
      "گزارش ROI"
    ],
    price: "از ۵ میلیون تومان/ماه",
    duration: "ماهانه",
    color: "from-yellow-500 to-amber-500"
  },
  {
    icon: PenTool,
    title: "تولید محتوای متنی",
    description: "محتوای سئو شده، کپی‌رایتینگ حرفه‌ای و متن‌های تبلیغاتی که می‌فروشند.",
    features: [
      "مقاله سئو شده",
      "کپی‌رایتینگ فروش",
      "متن صفحات سایت",
      "پست شبکه‌های اجتماعی",
      "ایمیل مارکتینگ",
      "اسکریپت ویدیو"
    ],
    price: "از ۵۰۰ هزار تومان",
    duration: "۱ تا ۳ روز",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Globe,
    title: "طراحی اپلیکیشن موبایل",
    description: "اپلیکیشن‌های iOS و Android با رابط کاربری زیبا و عملکرد روان.",
    features: [
      "طراحی UI/UX موبایل",
      "توسعه React Native",
      "اتصال به API",
      "پوش نوتیفیکیشن",
      "پرداخت درون‌برنامه‌ای",
      "انتشار در مارکت‌ها"
    ],
    price: "از ۱۵ میلیون تومان",
    duration: "۴۵ تا ۹۰ روز",
    color: "from-indigo-500 to-purple-500"
  }
];

const whyChooseUs = [
  { icon: Award, title: "تجربه ۱۰+ ساله", description: "بیش از یک دهه تجربه در صنعت دیجیتال" },
  { icon: Users, title: "تیم متخصص", description: "تیمی از بهترین متخصصان حوزه دیجیتال" },
  { icon: Target, title: "نتیجه‌محور", description: "تمرکز بر نتایج قابل اندازه‌گیری" },
  { icon: Shield, title: "گارانتی کیفیت", description: "ضمانت کیفیت و رضایت مشتری" },
  { icon: Clock, title: "تحویل به‌موقع", description: "احترام به زمان و تحویل سر موعد" },
  { icon: Zap, title: "پشتیبانی ۲۴/۷", description: "پشتیبانی همیشگی و پاسخگویی سریع" }
];

const stats = [
  { value: "۵۰۰+", label: "پروژه موفق" },
  { value: "۹۸٪", label: "رضایت مشتری" },
  { value: "۱۰+", label: "سال تجربه" },
  { value: "۲۴/۷", label: "پشتیبانی" }
];

const Services = () => {
  return (
    <>
      <Helmet>
        <title>خدمات آژانس ازما | طراحی سایت، سئو، برندینگ و دیجیتال مارکتینگ</title>
        <meta name="description" content="خدمات حرفه‌ای طراحی سایت، سئو، برندینگ، مدیریت شبکه‌های اجتماعی، تولید محتوا و دیجیتال مارکتینگ با بهترین کیفیت و قیمت مناسب." />
        <meta name="keywords" content="طراحی سایت, سئو, برندینگ, دیجیتال مارکتینگ, تولید محتوا, مدیریت اینستاگرام" />
        <link rel="canonical" href="https://azma.ir/services" />
        <meta property="og:title" content="خدمات آژانس ازما | طراحی سایت و دیجیتال مارکتینگ" />
        <meta property="og:description" content="خدمات حرفه‌ای طراحی سایت، سئو، برندینگ و دیجیتال مارکتینگ" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Digital Marketing Agency",
            "provider": {
              "@type": "Organization",
              "name": "آژانس ازما",
              "url": "https://azma.ir"
            },
            "areaServed": "Iran",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "خدمات دیجیتال",
              "itemListElement": allServices.map(service => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.title
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="noise-overlay" />
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                خدمات حرفه‌ای دیجیتال
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                همه چیز برای <span className="text-gradient-gold">موفقیت دیجیتال</span> شما
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                از طراحی سایت و برندینگ تا سئو و دیجیتال مارکتینگ، ما همراه شما هستیم
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  مشاوره رایگان
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline">
                  مشاهده نمونه‌کارها
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="glass rounded-2xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* All Services Grid */}
        <section className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                خدمات <span className="text-gradient-gold">تخصصی</span> ما
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                هر آنچه برای رشد کسب‌وکار دیجیتال خود نیاز دارید
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allServices.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group glass rounded-3xl p-6 hover:border-primary/50 transition-all duration-300 flex flex-col"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-border/50 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">قیمت:</span>
                      <span className="text-primary font-bold">{service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">زمان:</span>
                      <span className="text-foreground">{service.duration}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    درخواست مشاوره
                  </Button>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 relative bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                چرا <span className="text-gradient-gold">ازما</span>؟
              </h2>
              <p className="text-muted-foreground text-lg">
                دلایلی که ما را متفاوت می‌کند
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 glass rounded-2xl hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                فرآیند <span className="text-gradient-gold">همکاری</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                قدم به قدم تا موفقیت
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "۰۱", title: "مشاوره رایگان", description: "بررسی نیازها و اهداف شما" },
                { step: "۰۲", title: "تحلیل و برنامه‌ریزی", description: "طراحی استراتژی اختصاصی" },
                { step: "۰۳", title: "اجرا و توسعه", description: "پیاده‌سازی حرفه‌ای پروژه" },
                { step: "۰۴", title: "تحویل و پشتیبانی", description: "تحویل نهایی و پشتیبانی مداوم" }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center relative"
                >
                  <div className="text-7xl font-black text-primary/10 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-l from-primary/30 to-transparent -z-10" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-gold/10 to-primary/20" />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto"
            >
              <Star className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                آماده شروع هستید؟
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                همین الان با ما تماس بگیرید و مشاوره رایگان دریافت کنید. تیم ما آماده کمک به شماست.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="gap-2">
                    درخواست مشاوره رایگان
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  تماس: ۰۹۹۱۴۶۰۱۳۲۲
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

export default Services;
