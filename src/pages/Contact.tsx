import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  Instagram, ArrowLeft, CheckCircle,
  Building2, Headphones, Globe, Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    title: "تلفن تماس",
    value: "۰۹۹۱۴۶۰۱۳۲۲",
    subValue: "۰۹۳۰۰۸۸۱۴۱۳",
    link: "tel:09914601322"
  },
  {
    icon: MessageCircle,
    title: "تلگرام",
    value: "@yasinsalarnazm",
    subValue: "پاسخگویی سریع",
    link: "https://t.me/yasinsalarnazm"
  },
  {
    icon: MapPin,
    title: "آدرس دفتر",
    value: "همدان، شهرک مدنی",
    subValue: "بلوار امام خمینی",
    link: "#"
  },
  {
    icon: Clock,
    title: "ساعات کاری",
    value: "شنبه تا چهارشنبه: ۹-۱۸",
    subValue: "پنج‌شنبه: ۹-۱۴ | جمعه: آنلاین",
    link: "#"
  }
];

const socialLinks = [
  { icon: Instagram, label: "اینستاگرام", href: "https://instagram.com/yasinsalarnazm", color: "from-pink-500 to-purple-500" },
  { icon: MessageCircle, label: "تلگرام", href: "https://t.me/yasinsalarnazm", color: "from-blue-400 to-cyan-400" },
  { icon: Phone, label: "واتساپ", href: "https://wa.me/989914601322", color: "from-green-400 to-emerald-500" },
];

const services = [
  "طراحی سایت",
  "سئو و بهینه‌سازی",
  "طراحی لوگو",
  "مدیریت اینستاگرام",
  "پوستر و استوری موشن",
  "چاپ و طلاکوب",
  "کارت NFC",
  "سامانه USSD",
  "سایر خدمات"
];

const features = [
  { icon: Headphones, title: "پشتیبانی ۲۴/۷", description: "همیشه در دسترس شما هستیم" },
  { icon: Zap, title: "پاسخ سریع", description: "حداکثر ۲ ساعت پاسخگویی" },
  { icon: Globe, title: "مشاوره رایگان", description: "اولین جلسه مشاوره رایگان" },
  { icon: Building2, title: "ملاقات حضوری", description: "امکان جلسه در دفتر ما" }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید.");
      return;
    }
    
    if (!/^09[0-9]{9}$/.test(formData.phone)) {
      toast.error("شماره موبایل معتبر نیست. (مثال: 09123456789)");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>تماس با ما | آژانس دیجیتال مارکتینگ ازما – همدان</title>
        <meta name="description" content="راه‌های ارتباطی با آژانس ازما | تلفن: ۰۹۹۱۴۶۰۱۳۲۲ | آدرس: همدان، شهرک مدنی | مشاوره رایگان دیجیتال مارکتینگ" />
        <meta name="keywords" content="تماس با ازما, مشاوره رایگان, طراحی سایت همدان, آژانس دیجیتال همدان" />
        <link rel="canonical" href="https://azmamarkteng.ir/contact" />
        <meta property="og:title" content="تماس با آژانس ازما | مشاوره رایگان" />
        <meta property="og:description" content="با ما تماس بگیرید و مشاوره رایگان دریافت کنید" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "تماس با آژانس ازما",
            "url": "https://azmamarkteng.ir/contact",
            "mainEntity": {
              "@type": "DigitalMarketingAgency",
              "name": "آژانس دیجیتال مارکتینگ ازما",
              "telephone": "+989914601322",
              "email": "info@azmamarkteng.ir",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "شهرک مدنی، بلوار امام خمینی",
                "addressLocality": "همدان",
                "addressRegion": "همدان",
                "addressCountry": "IR"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Thursday",
                  "opens": "09:00",
                  "closes": "14:00"
                }
              ]
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
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                ارتباط با ما
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                ارتباط با <span className="text-gradient-gold">ما</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                آماده‌ایم تا پروژه شما را به واقعیت تبدیل کنیم 🚀
              </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-4 text-center"
                >
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-foreground text-sm mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-20 relative">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  راه‌های ارتباطی
                </h2>
                
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: -5 }}
                    className="flex items-start gap-4 p-4 glass rounded-2xl hover:border-primary/30 transition-all block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{info.title}</h3>
                      <p className="text-primary font-medium">{info.value}</p>
                      <p className="text-muted-foreground text-sm">{info.subValue}</p>
                    </div>
                  </motion.a>
                ))}

                {/* Social Links */}
                <div className="pt-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">ما را دنبال کنید</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -3 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Quick Call */}
                <motion.a
                  href="tel:09914601322"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="block"
                >
                  <Button size="lg" className="w-full gap-2">
                    <Phone className="w-5 h-5" />
                    تماس فوری
                  </Button>
                </motion.a>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2"
              >
                <div className="glass rounded-3xl p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Mail className="w-6 h-6 text-primary" />
                    ارسال پیام
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    فرم زیر را تکمیل کنید تا در اسرع وقت پاسخ دهیم
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          نام و نام خانوادگی *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="نام شما"
                          className="bg-secondary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          شماره موبایل *
                        </label>
                        <Input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="۰۹xxxxxxxxx"
                          className="bg-secondary/50"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          ایمیل (اختیاری)
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="bg-secondary/50"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          موضوع پیام
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-input bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">انتخاب کنید</option>
                          {services.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        پیام شما *
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="پیام شما..."
                        rows={5}
                        className="bg-secondary/50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>در حال ارسال...</>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          ارسال درخواست
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 relative bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-black text-foreground mb-4">
                موقعیت <span className="text-gradient-gold">ما</span>
              </h2>
              <p className="text-muted-foreground">
                همدان، شهرک مدنی، بلوار امام خمینی
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl overflow-hidden h-96"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.9999999999995!2d48.5146!3d34.7991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ3JzU2LjgiTiA0OMKwMzAnNTIuNiJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقعیت آژانس ازما"
              />
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-black text-foreground mb-4">
                سوالات <span className="text-gradient-gold">متداول</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "چقدر طول می‌کشد تا پروژه تکمیل شود؟",
                  answer: "زمان تکمیل بسته به نوع پروژه متفاوت است. یک لوگو ۷ تا ۱۴ روز، سایت ۱۵ تا ۳۰ روز و مدیریت اینستاگرام به صورت ماهانه انجام می‌شود."
                },
                {
                  question: "آیا پشتیبانی بعد از تحویل پروژه دارید؟",
                  answer: "بله! ما ۳ ماه پشتیبانی رایگان بعد از تحویل پروژه ارائه می‌دهیم و پلن‌های پشتیبانی سالانه نیز داریم."
                },
                {
                  question: "نحوه پرداخت چگونه است؟",
                  answer: "معمولاً ۵۰٪ پیش‌پرداخت و ۵۰٪ پس از تحویل نهایی. برای پروژه‌های بزرگ امکان پرداخت مرحله‌ای وجود دارد."
                },
                {
                  question: "آیا امکان ملاقات حضوری وجود دارد؟",
                  answer: "بله! دفتر ما در همدان، شهرک مدنی قرار دارد و از ملاقات حضوری استقبال می‌کنیم. جلسات آنلاین هم برگزار می‌کنیم."
                }
              ].map((faq, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 group"
                >
                  <summary className="font-bold text-foreground cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <ArrowLeft className="w-5 h-5 text-primary transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
};

export default Contact;
