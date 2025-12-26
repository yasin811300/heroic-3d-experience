import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Award, Users, Target, Heart, Lightbulb, Rocket,
  ArrowLeft, Star, CheckCircle, Quote, Building2,
  TrendingUp, Globe, Shield, Zap, Clock, Coffee
} from "lucide-react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "محمد رضایی",
    role: "مدیرعامل و بنیان‌گذار",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "۱۵ سال تجربه در دیجیتال مارکتینگ"
  },
  {
    name: "سارا احمدی",
    role: "مدیر خلاقیت",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    description: "طراح ارشد با سابقه بین‌المللی"
  },
  {
    name: "علی محمدی",
    role: "مدیر فنی",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "متخصص توسعه وب و موبایل"
  },
  {
    name: "نازنین کریمی",
    role: "مدیر سئو",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    description: "کارشناس ارشد بهینه‌سازی"
  },
  {
    name: "امیر حسینی",
    role: "مدیر پروژه",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    description: "متخصص مدیریت پروژه‌های بزرگ"
  },
  {
    name: "مریم نوری",
    role: "مدیر محتوا",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    description: "نویسنده و استراتژیست محتوا"
  }
];

const values = [
  { icon: Heart, title: "تعهد به کیفیت", description: "هر پروژه با بالاترین استانداردهای کیفی انجام می‌شود" },
  { icon: Lightbulb, title: "نوآوری مداوم", description: "همیشه در حال یادگیری و به‌روزرسانی دانش خود هستیم" },
  { icon: Users, title: "مشتری‌مداری", description: "موفقیت مشتریان ما اولویت اصلی ماست" },
  { icon: Target, title: "نتیجه‌محور", description: "تمرکز بر نتایج قابل اندازه‌گیری و واقعی" },
  { icon: Shield, title: "صداقت و شفافیت", description: "ارتباط صادقانه و شفاف در تمام مراحل" },
  { icon: Rocket, title: "رشد مستمر", description: "کمک به رشد کسب‌وکارها در فضای دیجیتال" }
];

const milestones = [
  { year: "۱۳۹۲", title: "تأسیس آژانس", description: "شروع کار با تیم ۳ نفره" },
  { year: "۱۳۹۵", title: "۱۰۰ پروژه موفق", description: "رسیدن به اولین ۱۰۰ پروژه" },
  { year: "۱۳۹۸", title: "گسترش تیم", description: "افزایش تیم به ۲۰ نفر" },
  { year: "۱۴۰۰", title: "جایزه برتر", description: "کسب جایزه بهترین آژانس دیجیتال" },
  { year: "۱۴۰۲", title: "۵۰۰+ پروژه", description: "عبور از مرز ۵۰۰ پروژه موفق" },
  { year: "۱۴۰۳", title: "توسعه بین‌المللی", description: "شروع همکاری‌های بین‌المللی" }
];

const stats = [
  { icon: Building2, value: "۵۰۰+", label: "پروژه موفق" },
  { icon: Users, value: "۲۰+", label: "نفر تیم" },
  { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
  { icon: Globe, value: "۱۰+", label: "سال تجربه" },
  { icon: Coffee, value: "۱۰۰۰۰+", label: "فنجان قهوه" },
  { icon: Clock, value: "۲۴/۷", label: "پشتیبانی" }
];

const testimonials = [
  {
    name: "رضا صادقی",
    company: "مدیرعامل شرکت آرکا",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    text: "همکاری با آژانس ازما بهترین تصمیم کاری ما بود. فروش آنلاین ما ۳۰۰٪ افزایش یافت."
  },
  {
    name: "مریم عباسی",
    company: "بنیان‌گذار برند زیبا",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    text: "حرفه‌ای‌ترین تیمی که تا به حال باهاشون کار کردم. نتایج فوق‌العاده بود."
  },
  {
    name: "احمد کریمی",
    company: "مدیر مارکتینگ دیجی‌کالا",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    text: "استراتژی‌های سئو آن‌ها ترافیک ارگانیک ما را ۵ برابر کرد."
  }
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>درباره ما | آژانس دیجیتال مارکتینگ ازما</title>
        <meta name="description" content="آژانس ازما با بیش از ۱۰ سال تجربه در زمینه طراحی سایت، سئو، برندینگ و دیجیتال مارکتینگ، همراه مطمئن کسب‌وکارهای ایرانی." />
        <meta name="keywords" content="آژانس دیجیتال مارکتینگ, تیم حرفه‌ای, طراحی سایت, سئو, برندینگ" />
        <link rel="canonical" href="https://azma.ir/about" />
        <meta property="og:title" content="درباره آژانس ازما | تیم حرفه‌ای دیجیتال مارکتینگ" />
        <meta property="og:description" content="با بیش از ۱۰ سال تجربه، همراه مطمئن کسب‌وکارهای ایرانی" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "آژانس ازما",
            "url": "https://azma.ir",
            "logo": "https://azma.ir/logo.png",
            "description": "آژانس دیجیتال مارکتینگ حرفه‌ای",
            "foundingDate": "2013",
            "numberOfEmployees": "20+",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "تهران",
              "addressCountry": "IR"
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
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                داستان ما
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                بیش از یک دهه <span className="text-gradient-gold">تجربه طلایی</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                ما یک تیم متشکل از متخصصان با تجربه هستیم که عاشق کارمان هستیم و برای موفقیت شما تلاش می‌کنیم
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 relative">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all"
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-black text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 relative">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
                  داستان <span className="text-gradient-gold">ازما</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    آژانس ازما در سال ۱۳۹۲ با یک رویا شروع به کار کرد: کمک به کسب‌وکارهای ایرانی برای درخشش در دنیای دیجیتال. ما با تیمی کوچک اما پرانرژی شروع کردیم و امروز افتخار می‌کنیم که یکی از معتبرترین آژانس‌های دیجیتال کشور هستیم.
                  </p>
                  <p>
                    در طول این سال‌ها، بیش از ۵۰۰ پروژه موفق انجام داده‌ایم و با صدها برند همکاری کرده‌ایم. از استارتاپ‌های کوچک گرفته تا شرکت‌های بزرگ، ما همراه همه بوده‌ایم.
                  </p>
                  <p>
                    فلسفه ما ساده است: هر پروژه یک فرصت جدید برای خلق چیزی استثنایی است. ما فقط کار نمی‌کنیم، ما داستان موفقیت می‌سازیم.
                  </p>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="mt-8 gap-2">
                    با ما آشنا شوید
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="glass rounded-2xl p-6 h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                        <p className="text-sm text-foreground font-bold">جایزه بهترین آژانس</p>
                        <p className="text-xs text-muted-foreground">۱۴۰۰</p>
                      </div>
                    </div>
                    <div className="glass rounded-2xl overflow-hidden h-64">
                      <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop" 
                        alt="تیم ازما"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="glass rounded-2xl overflow-hidden h-64">
                      <img 
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop" 
                        alt="محیط کار ازما"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="glass rounded-2xl p-6 h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Star className="w-12 h-12 text-gold mx-auto mb-3" />
                        <p className="text-sm text-foreground font-bold">۹۸٪ رضایت مشتری</p>
                        <p className="text-xs text-muted-foreground">امتیاز ۴.۹ از ۵</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 relative bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                ارزش‌های <span className="text-gradient-gold">ما</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                اصولی که ما را هدایت می‌کنند
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl p-8 text-center hover:border-primary/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                مسیر <span className="text-gradient-gold">پیشرفت</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                نگاهی به رشد و توسعه ما در طول سال‌ها
              </p>
            </motion.div>

            <div className="relative">
              <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gold to-primary hidden md:block" />
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <div className="glass rounded-2xl p-6 hover:border-primary/30 transition-all">
                        <span className="text-primary font-bold">{milestone.year}</span>
                        <h3 className="text-xl font-bold text-foreground mt-2">{milestone.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 flex-shrink-0" />
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 relative bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                تیم <span className="text-gradient-gold">طلایی</span> ما
              </h2>
              <p className="text-muted-foreground text-lg">
                افرادی که رویاها را به واقعیت تبدیل می‌کنند
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass rounded-3xl p-6 text-center hover:border-primary/30 transition-all group"
                >
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/50 transition-all"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-xs">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                مشتریان <span className="text-gradient-gold">راضی</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                نظرات کسانی که به ما اعتماد کردند
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-8 relative"
                >
                  <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                  <p className="text-muted-foreground mb-6 relative z-10">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-gold/10 to-primary/20" />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                آماده همکاری هستید؟
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                بیایید با هم داستان موفقیت شما را بسازیم
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="gap-2">
                    شروع همکاری
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button size="lg" variant="outline">
                    مشاهده نمونه‌کارها
                  </Button>
                </Link>
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

export default About;
