import { motion } from "framer-motion";
import { ArrowLeft, Contact, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Sparkles, title: "پرستیژ ماندگار", text: "اولین برخورد حرفه‌ای و متفاوت در هر جلسه" },
  { icon: Contact, title: "شناسنامه دیجیتال", text: "همه راه‌های ارتباطی و هویت حرفه‌ای در یک صفحه" },
  { icon: Radio, title: "انتقال با یک لمس", text: "بدون نصب برنامه؛ فقط نزدیک‌کردن کارت به گوشی" },
];

const SmartCardSection = () => (
  <section className="relative overflow-hidden py-24" aria-labelledby="smart-card-heading">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
    <div className="container relative z-10">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ShieldCheck className="h-4 w-4" /> کارت ویزیت هوشمند NFC
          </span>
          <h2 id="smart-card-heading" className="mb-5 text-3xl font-black leading-tight text-foreground md:text-5xl">
            کارت شما، <span className="text-gradient-gold">شناسنامه حرفه‌ای</span> شماست
          </h2>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            با یک لمس، معرفی کامل شما روی گوشی مخاطب باز می‌شود؛ تجربه‌ای ماندگار که نسبت به کارت کاغذی اعتبار، پرستیژ و دسترسی بیشتری می‌سازد.
          </p>
          <Button asChild size="lg">
            <Link to="/smart-card">مشاهده کارت هوشمند <ArrowLeft className="h-5 w-5" /></Link>
          </Button>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass flex items-start gap-4 rounded-2xl p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div><h3 className="mb-1 font-bold text-foreground">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{text}</p></div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SmartCardSection;