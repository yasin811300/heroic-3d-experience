import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Contact, Leaf, Radio, RefreshCw, ShieldCheck, Sparkles, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";

const advantages = [
  "انتقال اطلاعات با یک لمس و بدون نصب اپلیکیشن",
  "امکان ویرایش شماره، لینک‌ها و نمونه‌کار بدون چاپ مجدد",
  "صفحه معرفی اختصاصی برای ساخت اعتبار و پرستیژ حرفه‌ای",
  "ذخیره سریع شماره تماس و دسترسی به شبکه‌های اجتماعی",
  "قابل استفاده بارها و دوستدار محیط زیست",
];

const comparison = [
  ["به‌روزرسانی اطلاعات", "فوری و بدون تعویض کارت", "نیازمند طراحی و چاپ دوباره"],
  ["محتوای قابل ارائه", "نامحدود؛ تماس، شبکه‌ها، نقشه و نمونه‌کار", "محدود به فضای روی کاغذ"],
  ["ماندگاری", "قابل استفاده برای سال‌ها", "آسیب‌پذیر و دورریختنی"],
  ["اثرگذاری", "تعاملی، مدرن و به‌یادماندنی", "معمول و کم‌تعامل"],
];

const SmartCard = () => (
  <div className="min-h-screen bg-background [overflow-x:clip]" dir="rtl">
    <Helmet>
      <title>کارت ویزیت هوشمند NFC | آژانس ازما</title>
      <meta name="description" content="کارت ویزیت هوشمند NFC ازما؛ شناسنامه دیجیتال حرفه‌ای با انتقال اطلاعات در یک لمس، قابل ویرایش و ماندگار." />
      <link rel="canonical" href="https://azmamarkteng.ir/smart-card" />
      <meta property="og:title" content="کارت ویزیت هوشمند NFC | آژانس ازما" />
      <meta property="og:description" content="اعتبار و پرستیژ حرفه‌ای شما در یک کارت هوشمند و ماندگار." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org", "@type": "Product", name: "کارت ویزیت هوشمند NFC ازما",
        description: "کارت ویزیت NFC با صفحه معرفی دیجیتال قابل ویرایش", brand: { "@type": "Brand", name: "ازما" },
      })}</script>
    </Helmet>
    <div className="noise-overlay" />
    <Header />
    <main>
      <section className="relative flex min-h-[86vh] items-center overflow-hidden pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
        <div className="container relative z-10 grid items-center gap-12 pb-16 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary"><Radio className="h-4 w-4" /> نسل تازه معرفی حرفه‌ای</span>
            <h1 className="mb-6 text-4xl font-black leading-tight text-foreground md:text-6xl">کارت ویزیت هوشمند <span className="text-gradient-gold">NFC</span></h1>
            <p className="mb-4 text-xl font-bold leading-9 text-foreground">فقط یک کارت نیست؛ شناسنامه دیجیتال و امضای حرفه‌ای شماست.</p>
            <p className="mb-8 max-w-xl text-lg leading-8 text-muted-foreground">مخاطب با نزدیک‌کردن گوشی، وارد صفحه اختصاصی شما می‌شود و شماره تماس، شبکه‌های اجتماعی، آدرس و نمونه‌کارهایتان را همان لحظه می‌بیند.</p>
            <div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/contact">سفارش و مشاوره <ArrowLeft /></Link></Button><Button asChild size="lg" variant="outline"><Link to="/services">مشاهده خدمات</Link></Button></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, rotateY: -16 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ duration: 0.8 }} className="relative mx-auto w-full max-w-lg [perspective:1200px]">
            <div className="glass relative aspect-[1.58/1] overflow-hidden rounded-3xl border-primary/30 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/70" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between"><span className="text-2xl font-black text-gradient-gold">AZMA</span><Radio className="h-8 w-8 text-primary" /></div>
                <div><p className="text-2xl font-black text-foreground">هویت حرفه‌ای شما</p><p className="mt-2 text-sm text-muted-foreground">Tap to connect · NFC Smart Card</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24"><div className="container grid gap-12 lg:grid-cols-2">
        <div><span className="text-sm font-bold text-primary">چرا حکم شناسنامه دارد؟</span><h2 className="my-4 text-3xl font-black text-foreground">هر چیزی که مخاطب برای شناخت و اعتماد به شما نیاز دارد</h2><p className="leading-8 text-muted-foreground">کارت NFC به صفحه اختصاصی و همیشه قابل‌ویرایش شما متصل است. به همین دلیل هویت، تخصص، راه‌های تماس و اعتبار کاری شما را یکجا ارائه می‌کند و در جلسات، نمایشگاه‌ها و ملاقات‌های روزمره تصویری منظم و معتبر می‌سازد.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">{advantages.map((item) => <div key={item} className="glass flex gap-3 rounded-2xl p-5"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" /><span className="leading-7 text-foreground">{item}</span></div>)}</div>
      </div></section>

      <section className="bg-secondary/10 py-24"><div className="container"><div className="mb-12 text-center"><h2 className="text-3xl font-black text-foreground">هوشمند یا کاغذی؟</h2><p className="mt-3 text-muted-foreground">تفاوتی که از اولین معرفی احساس می‌شود</p></div>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/60"><div className="grid grid-cols-3 bg-card/60 p-4 text-sm font-bold sm:text-base"><span>معیار</span><span className="text-primary">کارت NFC</span><span>کارت کاغذی</span></div>{comparison.map(([label, smart, paper]) => <div key={label} className="grid grid-cols-3 gap-2 border-t border-border/60 p-4 text-xs leading-6 sm:text-sm"><strong>{label}</strong><span>{smart}</span><span className="text-muted-foreground">{paper}</span></div>)}</div>
      </div></section>

      <section className="py-24"><div className="container"><div className="grid gap-6 md:grid-cols-3">{[
        [Sparkles, "مزیت اصلی", "اثرگذاری، پرستیژ و دسترسی سریع به اطلاعات کامل شما"],
        [RefreshCw, "انعطاف بالا", "ویرایش صفحه و لینک‌ها در هر زمان بدون تعویض کارت"],
        [Leaf, "معایب و ملاحظات", "نیاز به گوشی سازگار یا استفاده از QR جایگزین و هزینه اولیه بیشتر از یک کارت کاغذی"],
      ].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof Contact; return <article key={String(title)} className="glass rounded-2xl p-7"><ItemIcon className="mb-5 h-7 w-7 text-primary" /><h3 className="mb-3 text-xl font-bold">{String(title)}</h3><p className="leading-7 text-muted-foreground">{String(text)}</p></article>; })}</div></div></section>

      <section className="pb-24"><div className="container"><div className="glass mx-auto max-w-4xl rounded-3xl p-8 text-center md:p-12"><ShieldCheck className="mx-auto mb-5 h-10 w-10 text-primary" /><h2 className="mb-4 text-3xl font-black">برای معرفی متفاوت آماده‌اید؟</h2><p className="mx-auto mb-7 max-w-2xl leading-8 text-muted-foreground">کارت هوشمندتان را با طراحی اختصاصی و صفحه دیجیتال متناسب با برند خود سفارش دهید.</p><Button asChild size="lg"><Link to="/contact">دریافت مشاوره رایگان <ArrowLeft /></Link></Button></div></div></section>
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

export default SmartCard;