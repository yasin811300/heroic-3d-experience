import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Shield, Zap, Globe, Lock, Eye, EyeOff, Server, Wifi, Download, MessageCircle, CheckCircle, XCircle, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const freeConfigs = [
  {
    id: 1,
    name: "سرور آلمان 🇩🇪",
    protocol: "VLESS",
    speed: "نامحدود",
    expiry: "۷ روز",
    config: "به‌زودی اضافه می‌شود",
  },
  {
    id: 2,
    name: "سرور هلند 🇳🇱",
    protocol: "VMess",
    speed: "نامحدود",
    expiry: "۷ روز",
    config: "به‌زودی اضافه می‌شود",
  },
  {
    id: 3,
    name: "سرور فنلاند 🇫🇮",
    protocol: "Trojan",
    speed: "نامحدود",
    expiry: "۳ روز",
    config: "به‌زودی اضافه می‌شود",
  },
];

const vpnBenefits = [
  { icon: Shield, title: "امنیت بالا", desc: "رمزنگاری نظامی AES-256 برای محافظت از اطلاعات شما" },
  { icon: Zap, title: "سرعت بالا", desc: "سرورهای پرسرعت بدون افت کیفیت اتصال" },
  { icon: Globe, title: "دسترسی جهانی", desc: "دسترسی به تمام وب‌سایت‌ها و سرویس‌های بین‌المللی" },
  { icon: Lock, title: "حریم خصوصی", desc: "بدون ذخیره لاگ و فعالیت‌های کاربران" },
  { icon: EyeOff, title: "ناشناس ماندن", desc: "مخفی کردن IP واقعی شما از دید سایت‌ها" },
  { icon: Server, title: "سرورهای متنوع", desc: "سرورهای متعدد در کشورهای مختلف جهان" },
];

const vpnDrawbacks = [
  { title: "VPN رایگان نامطمئن", desc: "اکثر VPN‌های رایگان اطلاعات شما را می‌فروشند" },
  { title: "کاهش سرعت", desc: "VPN‌های بی‌کیفیت سرعت اینترنت را به شدت کاهش می‌دهند" },
  { title: "قطعی مکرر", desc: "سرورهای ضعیف باعث قطع شدن مداوم اتصال می‌شوند" },
  { title: "عدم پشتیبانی", desc: "بدون پشتیبانی فنی در صورت بروز مشکل" },
];

const pricingPlans = [
  {
    name: "پلن ماهانه",
    price: "۴۹,۰۰۰",
    duration: "۱ ماه",
    features: ["ترافیک نامحدود", "۱ کاربر همزمان", "سرورهای آلمان و هلند", "پشتیبانی تلگرام"],
    popular: false,
  },
  {
    name: "پلن سه ماهه",
    price: "۱۱۹,۰۰۰",
    duration: "۳ ماه",
    features: ["ترافیک نامحدود", "۲ کاربر همزمان", "تمام سرورها", "پشتیبانی ۲۴/۷", "۲۰٪ تخفیف"],
    popular: true,
  },
  {
    name: "پلن شش ماهه",
    price: "۱۹۹,۰۰۰",
    duration: "۶ ماه",
    features: ["ترافیک نامحدود", "۳ کاربر همزمان", "تمام سرورها", "پشتیبانی اختصاصی", "۳۵٪ تخفیف"],
    popular: false,
  },
];

const VPN = () => {
  const { toast } = useToast();

  const copyConfig = (config: string) => {
    navigator.clipboard.writeText(config);
    toast({ title: "کپی شد!", description: "کانفیگ در کلیپ‌بورد کپی شد." });
  };

  return (
    <>
      <Helmet>
        <title>خرید VPN امن و پرسرعت | کانفیگ رایگان V2Ray | آژانس ازما</title>
        <meta name="description" content="خرید VPN امن و پرسرعت با سرورهای آلمان، هلند و فنلاند. کانفیگ رایگان V2Ray، VLESS و VMess. پشتیبانی ۲۴ ساعته تلگرام. بهترین VPN ایران با قیمت مناسب." />
        <meta name="keywords" content="خرید VPN, کانفیگ رایگان, V2Ray, VLESS, VMess, Trojan, VPN پرسرعت, VPN امن, فیلترشکن, خرید فیلترشکن, VPN ارزان, کانفیگ V2Ray رایگان" />
        <link rel="canonical" href="https://azmamarkteng.ir/vpn" />
        <meta property="og:title" content="خرید VPN امن و پرسرعت | کانفیگ رایگان | آژانس ازما" />
        <meta property="og:description" content="بهترین سرویس VPN با سرورهای اختصاصی و کانفیگ رایگان. پشتیبانی ۲۴/۷ تلگرام." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://azmamarkteng.ir/vpn" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "سرویس VPN ازما",
            "description": "سرویس VPN امن و پرسرعت با سرورهای اختصاصی",
            "brand": { "@type": "Brand", "name": "آژانس ازما" },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "49000",
              "highPrice": "199000",
              "priceCurrency": "IRR",
              "offerCount": "3"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="noise-overlay" />
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <motion.div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl bg-primary" animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 6, repeat: Infinity }} />
            <motion.div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl bg-accent" animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }} />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">امنیت و آزادی اینترنت</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-foreground leading-tight">
                <span className="text-gradient-gold">VPN</span> امن و پرسرعت
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                با سرورهای اختصاصی آلمان، هلند و فنلاند، اینترنت آزاد و امن را تجربه کنید. کانفیگ رایگان + پلن‌های ویژه
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://t.me/Azmamarketing" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    <MessageCircle className="w-5 h-5" />
                    خرید از تلگرام
                  </Button>
                </a>
                <a href="#free-configs">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Download className="w-5 h-5" />
                    کانفیگ رایگان
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
                مزایای <span className="text-gradient-gold">VPN خوب</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">چرا باید از یک VPN حرفه‌ای و مطمئن استفاده کنید؟</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vpnBenefits.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="glass-strong border-border/30 hover:border-primary/50 transition-all duration-300 h-full group hover:scale-[1.02]">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Drawbacks of bad VPN */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
                معایب <span className="text-destructive">VPN بد</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">خطرات استفاده از VPN‌های نامطمئن و رایگان</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {vpnDrawbacks.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="border-destructive/20 bg-destructive/5 hover:border-destructive/40 transition-all h-full">
                    <CardContent className="p-6 flex items-start gap-4">
                      <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
                <span className="text-gradient-gold">پلن‌های</span> اشتراک
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">پلن مناسب خود را انتخاب کنید</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <Card className={`relative h-full transition-all duration-300 hover:scale-105 ${plan.popular ? "border-primary shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] scale-105" : "border-border/30 glass-strong"}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        پرفروش‌ترین
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-black text-gradient-gold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm mr-1">تومان</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.duration}</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a href="https://t.me/Azmamarketing" target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full gap-2" variant={plan.popular ? "default" : "outline"}>
                          <MessageCircle className="w-4 h-4" />
                          خرید از تلگرام
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Configs */}
        <section id="free-configs" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
                کانفیگ‌های <span className="text-gradient-gold">رایگان</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">کانفیگ‌های رایگان برای تست سرویس ما</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {freeConfigs.map((cfg, i) => (
                <motion.div key={cfg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="glass-strong border-border/30 hover:border-primary/50 transition-all h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-primary" />
                        {cfg.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                        <p>پروتکل: <span className="text-foreground font-medium">{cfg.protocol}</span></p>
                        <p>حجم: <span className="text-foreground font-medium">{cfg.speed}</span></p>
                        <p>اعتبار: <span className="text-foreground font-medium">{cfg.expiry}</span></p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => copyConfig(cfg.config)}>
                        <Copy className="w-4 h-4" />
                        کپی کانفیگ
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <p className="text-muted-foreground mb-4">برای دریافت کانفیگ‌های بیشتر و پشتیبانی:</p>
              <a href="https://t.me/Azmamarketing" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  عضویت در کانال تلگرام
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">سوالات متداول</h2>
            </motion.div>
            {[
              { q: "آیا VPN شما امن است؟", a: "بله، ما از رمزنگاری AES-256 و پروتکل‌های مدرن مانند VLESS و Trojan استفاده می‌کنیم. هیچ لاگی از فعالیت کاربران ذخیره نمی‌شود." },
              { q: "کانفیگ رایگان تا چه مدت اعتبار دارد؟", a: "کانفیگ‌های رایگان بین ۳ تا ۷ روز اعتبار دارند و به‌صورت هفتگی به‌روزرسانی می‌شوند." },
              { q: "چطور VPN را روی گوشی نصب کنم؟", a: "کافیه اپلیکیشن V2RayNG (اندروید) یا Streisand (آیفون) رو نصب کنید و کانفیگ رو وارد کنید. برای راهنمایی بیشتر از تلگرام پیام بدید." },
              { q: "آیا می‌تونم روی چند دستگاه استفاده کنم؟", a: "بله، بسته به پلن انتخابی شما بین ۱ تا ۳ دستگاه همزمان پشتیبانی می‌شود." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="mb-4 glass-strong border-border/30">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">{item.q}</h3>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
};

export default VPN;
