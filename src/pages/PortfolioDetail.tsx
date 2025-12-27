import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Calendar, Building2, TrendingUp } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const projectsData: Record<string, {
  title: string;
  category: string;
  client: string;
  date: string;
  image: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  services: string[];
}> = {
  "restaurant-website": {
    title: "طراحی سایت رستوران طعم خاص",
    category: "طراحی سایت + سئو",
    client: "رستوران طعم خاص",
    date: "آذر ۱۴۰۲",
    image: portfolio1,
    description: "طراحی و توسعه وب‌سایت حرفه‌ای برای رستوران طعم خاص با امکان رزرو آنلاین و منوی دیجیتال.",
    challenge: "رستوران نیاز به یک سیستم رزرو آنلاین داشت که بتواند ترافیک مشتریان را مدیریت کند و همچنین نمایش منوی غذا به صورت جذاب.",
    solution: "طراحی یک وب‌سایت ریسپانسیو با سیستم رزرو هوشمند، منوی دیجیتال با عکس‌های حرفه‌ای و بهینه‌سازی سئو برای جستجوهای محلی.",
    results: ["افزایش ۳۰۰٪ رزرو آنلاین در ۲ ماه", "رتبه ۱ گوگل برای «رستوران همدان»", "کاهش ۵۰٪ تماس‌های تلفنی", "افزایش ۱۵۰٪ بازدید سایت"],
    services: ["طراحی UI/UX", "توسعه وب", "سئو محلی", "سیستم رزرو"],
  },
  "fashion-instagram": {
    title: "مدیریت اینستاگرام فروشگاه مردانه",
    category: "مدیریت سوشال مدیا",
    client: "فروشگاه مردانه",
    date: "مهر ۱۴۰۲",
    image: portfolio2,
    description: "مدیریت کامل صفحه اینستاگرام فروشگاه پوشاک مردانه با تولید محتوای حرفه‌ای و استراتژی رشد.",
    challenge: "صفحه اینستاگرام فروشگاه فقط ۲ هزار فالوور داشت و تعامل بسیار پایین بود.",
    solution: "تدوین استراتژی محتوا، تولید ریلز و عکاسی حرفه‌ای، کمپین‌های تعاملی و همکاری با اینفلوئنسرها.",
    results: ["رشد از ۲K به ۴۵K فالوور در ۶ ماه", "افزایش ۵۰۰٪ تعامل", "فروش مستقیم از اینستاگرام", "۱۰۰+ ریلز وایرال"],
    services: ["مدیریت اینستاگرام", "تولید محتوا", "عکاسی محصول", "اینفلوئنسر مارکتینگ"],
  },
  "travel-campaign": {
    title: "کمپین تبلیغاتی آژانس گردشگری",
    category: "تبلیغات دیجیتال",
    client: "آژانس گردشگری",
    date: "اسفند ۱۴۰۲",
    image: portfolio3,
    description: "طراحی و اجرای کمپین تبلیغاتی نوروزی برای آژانس گردشگری با هدف افزایش فروش تورها.",
    challenge: "آژانس نیاز به افزایش فروش تورهای نوروزی در رقابت شدید بازار داشت.",
    solution: "کمپین تبلیغاتی چند کاناله شامل گوگل ادز، اینستاگرام ادز و ایمیل مارکتینگ با لندینگ پیج اختصاصی.",
    results: ["فروش ۲۵۰٪ بیشتر نسبت به سال قبل", "ROI بیش از ۴۰۰٪", "۱۰۰۰+ لید جدید", "کاهش ۳۰٪ هزینه جذب مشتری"],
    services: ["گوگل ادز", "اینستاگرام ادز", "لندینگ پیج", "ایمیل مارکتینگ"],
  },
};

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">پروژه یافت نشد</h1>
          <Button asChild>
            <Link to="/portfolio">بازگشت به نمونه‌کارها</Link>
          </Button>
        </div>
      </div>
    );
  }

  const projectKeys = Object.keys(projectsData);
  const currentIndex = projectKeys.indexOf(slug || "");
  const prevProject = currentIndex > 0 ? projectKeys[currentIndex - 1] : null;
  const nextProject = currentIndex < projectKeys.length - 1 ? projectKeys[currentIndex + 1] : null;

  return (
    <>
      <Helmet>
        <title>{project.title} | نمونه‌کار آژانس ازما</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="noise-overlay" />
        <Header />

        {/* Hero */}
        <section className="pt-28 md:pt-32 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowRight className="w-4 h-4" />
                بازگشت به نمونه‌کارها
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {project.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  {project.title}
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{project.date}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative rounded-3xl overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4">چالش پروژه</h2>
                  <p className="text-muted-foreground">{project.challenge}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4">راه‌حل ما</h2>
                  <p className="text-muted-foreground">{project.solution}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    نتایج
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.results.map((result, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">{result}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4">خدمات ارائه شده</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-6 text-center"
                >
                  <h3 className="text-lg font-bold text-foreground mb-3">پروژه مشابه می‌خواید؟</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    با ما تماس بگیرید تا درباره پروژه شما صحبت کنیم
                  </p>
                  <Button variant="gradient-gold" className="w-full gap-2" asChild>
                    <Link to="/contact">
                      درخواست مشاوره
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 border-t border-border">
          <div className="container">
            <div className="flex justify-between items-center">
              {prevProject ? (
                <Link
                  to={`/portfolio/${prevProject}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  پروژه قبلی
                </Link>
              ) : (
                <div />
              )}
              {nextProject && (
                <Link
                  to={`/portfolio/${nextProject}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  پروژه بعدی
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
};

export default PortfolioDetail;
