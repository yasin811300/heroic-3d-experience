import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { 
  Award, Users, Target, Heart, Lightbulb, Rocket,
  ArrowLeft, Star, CheckCircle, Gem, Handshake,
  TrendingUp, Globe, Shield, Zap, Clock, Coffee,
  Code, GitBranch, Copy, Check
} from "lucide-react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "سارا احمدی",
    role: "طراح ارشد گرافیک",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    description: "۱۲ سال سابقه | متخصص برندینگ",
    color: "text-primary"
  },
  {
    name: "علی کریمی",
    role: "توسعه دهنده ارشد",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "۱۰ سال سابقه | متخصص Laravel",
    color: "text-cyan-400"
  },
  {
    name: "زهرا محمدی",
    role: "ادمین سوشال مدیا",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    description: "۸ سال سابقه | متخصص اینستاگرام",
    color: "text-pink-400"
  },
  {
    name: "محمد رضایی",
    role: "متخصص سئو",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "۶ سال سابقه | رتبه‌بندی گوگل",
    color: "text-green-400"
  },
  {
    name: "نازنین کریمی",
    role: "طراح UI/UX",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    description: "۵ سال سابقه | تجربه کاربری",
    color: "text-purple-400"
  },
  {
    name: "امیر حسینی",
    role: "متخصص چاپ و NFC",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    description: "۷ سال سابقه | کارت هوشمند",
    color: "text-orange-400"
  },
  {
    name: "نگین سلمانی",
    role: "طراح سایت و سئو کار",
    image: "/team/negin-salmani.jpg",
    description: "۴ سال سابقه | ملکه کدنویسی ازما 👑",
    color: "text-primary"
  }
];

const values = [
  { icon: Gem, title: "کیفیت طلایی", description: "استانداردهای جهانی در هر پروژه" },
  { icon: Lightbulb, title: "نوآوری مداوم", description: "استفاده از آخرین تکنولوژی‌ها" },
  { icon: Handshake, title: "صداقت کامل", description: "شفافیت در تمام مراحل کار" },
  { icon: Users, title: "تمرکز بر انسان", description: "ارزش‌آفرینی برای مشتری" },
  { icon: Target, title: "نتیجه‌محور", description: "تمرکز بر نتایج قابل اندازه‌گیری" },
  { icon: Rocket, title: "رشد مستمر", description: "کمک به رشد کسب‌وکارها" }
];

const stats = [
  { icon: Award, value: "۵۰۰+", label: "پروژه موفق" },
  { icon: Users, value: "۴۲+", label: "نفر تیم" },
  { icon: TrendingUp, value: "۹۸٪", label: "رضایت مشتری" },
  { icon: Globe, value: "۶+", label: "سال تجربه" },
  { icon: Coffee, value: "۱۰۰۰۰+", label: "فنجان قهوه" },
  { icon: Clock, value: "۲۴/۷", label: "پشتیبانی" }
];

const certifications = [
  { name: "Google AI", icon: "🏆" },
  { name: "IBM IT", icon: "🎖️" },
  { name: "Adobe Creative", icon: "🎨" }
];

// پس از اتصال GitHub در Lovable، این URL را با لینک واقعی ریپازیتوری خود جایگزین کنید
const GITHUB_REPO_URL = "https://github.com/your-username/your-repo";

const About = () => {
  const [copied, setCopied] = useState(false);
  const cloneCommand = `git clone ${GITHUB_REPO_URL}.git`;

  const handleCopyClone = async () => {
    try {
      await navigator.clipboard.writeText(cloneCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>درباره ما | آژانس دیجیتال مارکتینگ ازما – طلایی کردن برندها</title>
        <meta name="description" content="آشنایی با تیم بزرگ و حرفه‌ای ازما مارکتینگ | بیش از ۴۲ متخصص در حوزه‌های گرافیک، وب، سوشال، سئو، چاپ و ابزارهای هوشمند" />
        <meta name="keywords" content="درباره ما, تیم ازما, آژانس دیجیتال مارکتینگ, اعضای مجموعه, طراح گرافیست, توسعه دهنده, ادمین اینستاگرام, متخصص سئو" />
        <link rel="canonical" href="https://azmamarkteng.ir/about" />
        <meta property="og:title" content="درباره آژانس ازما | تیم حرفه‌ای دیجیتال مارکتینگ" />
        <meta property="og:description" content="بیش از ۶ سال تجربه، همراه مطمئن کسب‌وکارهای ایرانی در همدان" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "درباره آژانس ازما",
            "url": "https://azmamarkteng.ir/about",
            "publisher": {
              "@type": "DigitalMarketingAgency",
              "name": "آژانس دیجیتال مارکتینگ ازما",
              "telephone": "09914601322",
              "founder": {
                "@type": "Person",
                "name": "یاسین سالارناظم",
                "certification": ["Google AI", "IBM IT"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "همدان",
                "addressRegion": "همدان",
                "addressCountry": "IR"
              }
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
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          
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
                داستان <span className="text-gradient-gold">ازما</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                از ایده‌ای ساده در دل همدان تا بنایی بزرگ در دنیای دیجیتال؛ اینجا نقطه‌ای است که برندها طلایی می‌شوند.
              </p>
              <Button size="lg" className="gap-2" asChild>
                <a href="#founder">
                  ملاقات با بنیان‌گذار
                  <ArrowLeft className="w-5 h-5" />
                </a>
              </Button>
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

        {/* About Company */}
        <section className="py-20 relative">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-foreground text-center mb-12"
            >
              ازما مارکتینگ <span className="text-gradient-gold">چیست؟</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Target className="w-8 h-8 text-primary" />
                  ماموریت ما
                </h3>
                <p className="text-muted-foreground leading-8">
                  ما در ازما مارکتینگ باور داریم که هر برند ایرانی شایسته درخشش در سطح جهانی است. ماموریت ما این است که با ترکیب هنر، تکنولوژی و استراتژی، کسب‌وکارهای ایرانی را به بالاترین سطح استاندارد‌های بین‌المللی برسانیم.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Globe className="w-8 h-8 text-cyan-400" />
                  چشم‌انداز ۱۴۰۴
                </h3>
                <p className="text-muted-foreground leading-8">
                  تبدیل شدن به بزرگ‌ترین و معتبرترین آژانس دیجیتال مارکتینگ غرب کشور با بیش از ۱۰۰ متخصص حرفه‌ای و ارائه خدمات به برندهای ملی و بین‌المللی.
                </p>
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
                ارزش‌های <span className="text-gradient-gold">اصلی ما</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section id="founder" className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                    <img 
                      src="https://azmamarkteng.ir/yasin.jpg" 
                      alt="یاسین سالارناظم - بنیان‌گذار آژانس ازما"
                      className="w-full h-full object-cover rounded-3xl shadow-2xl"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-foreground text-background px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Founder & CEO
                    </div>
                  </div>
                  
                  {/* Certifications */}
                  <div className="flex justify-center gap-4 mt-8">
                    {certifications.map((cert) => (
                      <div key={cert.name} className="glass rounded-full px-4 py-2 flex items-center gap-2">
                        <span>{cert.icon}</span>
                        <span className="text-sm text-foreground">{cert.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-black text-foreground mb-2">
                    یاسین سالارناظم
                  </h2>
                  <h3 className="text-lg md:text-xl text-primary mb-6 font-bold tracking-wide border-b border-border pb-4">
                    بنیان‌گذار آژانس دیجیتال مارکتینگ ازما
                  </h3>
                  
                  <p className="text-muted-foreground text-lg leading-9 mb-6">
                    در دنیایی که همه به دنبال دیده‌شدن هستند، تنها کسانی ماندگار می‌شوند که <strong className="text-foreground">هویت</strong> داشته باشند. من، <strong className="text-foreground">یاسین سالارناظم</strong>، فعالیت حرفه‌ای خود را ۶ سال پیش با یک چشم‌انداز بزرگ آغاز کردم: <span className="text-primary font-bold">ارتقای استانداردهای دیجیتال مارکتینگ در ایران به سطح جهانی.</span>
                  </p>
                  
                  <p className="text-muted-foreground leading-8 mb-8">
                    با تکیه بر دانش روز و اخذ معتبرترین گواهینامه‌های بین‌المللی از غول‌های تکنولوژی دنیا (Google و IBM)، مجموعه‌ای را پایه‌گذاری کردم که امروز نماد کیفیت و نوآوری در غرب کشور است.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="gap-2" asChild>
                      <a href="https://instagram.com/yasinsalarnazm" target="_blank" rel="noopener noreferrer">
                        اینستاگرام من
                      </a>
                    </Button>
                    <div className="hidden md:flex items-center text-muted-foreground text-sm border-r border-border pr-4">
                      Certified by Google & IBM
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
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
                تیم حرفه‌ای <span className="text-gradient-gold">ازما</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                ۴۲ متخصص در کنار شما
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group glass rounded-3xl p-6 text-center hover:border-primary/30 transition-all"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-4 border-secondary group-hover:border-primary transition-all"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className={`${member.color} font-medium mb-2`}>{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-6">
                و ۳۶ متخصص دیگر در بخش‌های مختلف...
              </p>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact" className="gap-2">
                  همکاری با تیم ما
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
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
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  آماده همکاری با ما هستید؟
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  پروژه شما می‌تواند داستان موفقیت بعدی ما باشد
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="gap-2" asChild>
                    <Link to="/contact">
                      شروع همکاری
                      <Rocket className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/portfolio">
                      مشاهده نمونه‌کارها
                    </Link>
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

export default About;
