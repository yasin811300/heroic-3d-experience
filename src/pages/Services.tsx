import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Brush, Code, Search, Smartphone, Video, PenTool, 
  Printer, CreditCard, Radio, BarChart3, Globe, Shield, 
  Zap, Users, Check, ArrowLeft, Star, Clock, Award, Target
} from "lucide-react";
import { Link } from "react-router-dom";

const allServices = [
  {
    icon: Brush,
    title: "طراحی لوگو و هویت بصری",
    description: "لوگو 3D طلایی، سبک فلات مدرن، امضای لوکس با طلاکوب و نقره‌کوب.",
    features: [
      "لوگو 3D با انیمیشن ورودی",
      "هویت بصری کامل",
      "آیکون اختصاصی و پانتون",
      "دستورالعمل برند",
      "طلاکوب و چاپ VIP",
      "رندر حرفه‌ای"
    ],
    price: "از ۲ میلیون تومان",
    duration: "۷ تا ۱۴ روز",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Video,
    title: "پوستر و استوری موشن",
    description: "استوری موشن 3D، پوستر نوروز و یلدا، افکت‌های حرفه‌ای با موسیقی.",
    features: [
      "استوری موشن ۱۵ ثانیه‌ای",
      "افکت‌های 3D جذاب",
      "موسیقی رویالتی‌فری",
      "پوستر چاپ افست",
      "طراحی نوروز و یلدا",
      "رنگ‌بندی پانتون"
    ],
    price: "از ۱.۵ میلیون تومان",
    duration: "۳ تا ۷ روز",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Code,
    title: "طراحی سایت و سئو",
    description: "فروشگاه آنلاین، سایت شرکتی، ریسپانسیو با انیمیشن اسکرول و درگاه پرداخت.",
    features: [
      "طراحی UI/UX مدرن",
      "سایت فروشگاهی ووکامرس",
      "درگاه پرداخت آنلاین",
      "انیمیشن‌های SVG",
      "فرم هوشمند",
      "پنل مدیریت اختصاصی"
    ],
    price: "از ۵ میلیون تومان",
    duration: "۱۵ تا ۳۰ روز",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Search,
    title: "سئو محلی",
    description: "رتبه ۱ گوگل برای کلمات کلیدی هدف، گوگل مپ و ریویو حرفه‌ای.",
    features: [
      "سئو تکنیکال کامل",
      "ثبت در گوگل مپ",
      "جمع‌آوری ریویو",
      "لینک‌سازی حرفه‌ای",
      "گزارش ماهانه",
      "رقابت با رقبا"
    ],
    price: "از ۳ میلیون تومان/ماه",
    duration: "۳ تا ۶ ماه",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Smartphone,
    title: "مدیریت اینستاگرام",
    description: "از ۲k به ۴۵k فالوور واقعی، استوری موشن روزانه، ریلز و افزایش فروش.",
    features: [
      "تولید محتوای هدفمند",
      "افزایش فالوور واقعی",
      "استوری موشن روزانه",
      "ریلز حرفه‌ای",
      "مدیریت کامنت و دایرکت",
      "گزارش عملکرد هفتگی"
    ],
    price: "از ۴ میلیون تومان/ماه",
    duration: "همیشگی",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: CreditCard,
    title: "کارت ویزیت NFC",
    description: "کارت ویزیت هوشمند لمسی با چیپ قوی و طراحی اختصاصی.",
    features: [
      "چیپ NFC قوی",
      "طراحی اختصاصی",
      "لمسی و هوشمند",
      "پروفایل دیجیتال",
      "اتصال به شبکه‌ها",
      "بدون نیاز به اپ"
    ],
    price: "از ۵۰۰ هزار تومان",
    duration: "۳ تا ۵ روز",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Radio,
    title: "سامانه USSD",
    description: "منوی ستاره‌ای اختصاصی برای کسب‌وکار شما بدون نیاز به اینترنت.",
    features: [
      "کد اختصاصی *xxx#",
      "منوی چند سطحی",
      "بدون نیاز به اینترنت",
      "پنل مدیریت",
      "گزارش تماس‌ها",
      "پشتیبانی ۲۴/۷"
    ],
    price: "از ۲ میلیون تومان",
    duration: "۷ تا ۱۰ روز",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Printer,
    title: "خدمات چاپ",
    description: "چاپ افست، طلاکوب، UV موضعی، کاتالوگ و بسته‌بندی محصولات.",
    features: [
      "چاپ افست حرفه‌ای",
      "طلاکوب و نقره‌کوب",
      "UV موضعی",
      "کاتالوگ و بروشور",
      "بسته‌بندی محصولات",
      "کارت ویزیت لوکس"
    ],
    price: "از ۵۰۰ هزار تومان",
    duration: "۳ تا ۷ روز",
    color: "from-orange-500 to-red-500"
  }
];

const whyChooseUs = [
  { icon: Award, title: "تجربه ۶+ ساله", description: "بیش از ۶ سال تجربه در صنعت دیجیتال همدان" },
  { icon: Users, title: "تیم ۴۲ نفره", description: "تیمی از بهترین متخصصان غرب کشور" },
  { icon: Target, title: "نتیجه‌محور", description: "تمرکز بر نتایج قابل اندازه‌گیری و واقعی" },
  { icon: Shield, title: "گارانتی کیفیت", description: "ضمانت کیفیت و رضایت مشتری" },
  { icon: Clock, title: "تحویل به‌موقع", description: "احترام به زمان و تحویل سر موعد" },
  { icon: Zap, title: "پشتیبانی ۲۴/۷", description: "پشتیبانی همیشگی و پاسخگویی سریع" }
];

const stats = [
  { value: "۵۰۰+", label: "پروژه موفق" },
  { value: "۹۸٪", label: "رضایت مشتری" },
  { value: "۶+", label: "سال تجربه" },
  { value: "۲۴/۷", label: "پشتیبانی" }
];

const Services = () => {
  return (
    <>
      <Helmet>
        <title>خدمات حرفه‌ای | آژانس دیجیتال مارکتینگ ازما – طلایی کردن برندها</title>
        <meta name="description" content="طراحی سایت، مدیریت اینستاگرام، سئو، طراحی لوگو، پوستر، استوری موشن، چاپ، NFC، USSD | بهترین خدمات دیجیتال مارکتینگ در همدان" />
        <meta name="keywords" content="خدمات دیجیتال مارکتینگ, طراحی سایت همدان, مدیریت اینستاگرام, سئو, طراحی لوگو, پوستر, استوری موشن, چاپ, NFC, USSD" />
        <link rel="canonical" href="https://azmamarkteng.ir/services" />
        <meta property="og:title" content="خدمات آژانس ازما | طراحی سایت و دیجیتال مارکتینگ" />
        <meta property="og:description" content="خدمات حرفه‌ای طراحی سایت، سئو، برندینگ و دیجیتال مارکتینگ در همدان" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "خدمات آژانس ازما",
            "description": "خدمات حرفه‌ای دیجیتال مارکتینگ",
            "url": "https://azmamarkteng.ir/services",
            "publisher": {
              "@type": "DigitalMarketingAgency",
              "name": "آژانس دیجیتال مارکتینگ ازما",
              "telephone": "09914601322"
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
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          
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
                خدمات <span className="text-gradient-gold">طلایی</span> ما
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                از صفر تا صد دنیای دیجیتال و فیزیکی برند شما را می‌سازیم: طراحی سایت، مدیریت اینستاگرام، سئو، طراحی لوگو، پوستر، استوری موشن، چاپ، NFC و USSD.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/contact">
                    مشاوره رایگان
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/portfolio">
                    مشاهده نمونه‌کارها
                  </Link>
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

                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link to="/contact">درخواست مشاوره</Link>
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
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-6 text-3xl font-black text-primary-foreground shadow-lg shadow-primary/30">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 -left-4 w-8 h-0.5 bg-gradient-to-l from-primary to-transparent" />
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-cyan-500/10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <Star className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  آماده شروع هستید؟
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  همین الان مشاوره رایگان دریافت کنید و اولین قدم را به سوی موفقیت بردارید
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="gap-2" asChild>
                    <Link to="/contact">
                      درخواست مشاوره رایگان
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:09914601322">
                      تماس فوری: ۰۹۹۱۴۶۰۱۳۲۲
                    </a>
                  </Button>
                </div>
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
