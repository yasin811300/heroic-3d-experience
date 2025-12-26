import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const categories = [
  { id: "all", label: "همه" },
  { id: "logo", label: "طراحی لوگو" },
  { id: "poster", label: "پوستر و موشن" },
  { id: "web", label: "طراحی سایت" },
  { id: "instagram", label: "اینستاگرام" },
  { id: "seo", label: "سئو و گوگل مپ" },
];

const projects = [
  {
    id: 1,
    title: "کافه طلایی",
    category: "logo",
    categoryLabel: "طراحی لوگو",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop",
    description: "لوگو مینیمال + رنگ‌بندی طلایی + انیمیشن 3D ورودی برای کافی‌شاپ مدرن.",
    client: "کافه طلایی همدان",
    year: "۱۴۰۲",
    results: ["افزایش ۲۰۰٪ مشتریان", "برند شناخته‌شده شهر"],
    technologies: ["Illustrator", "After Effects", "Blender"],
  },
  {
    id: 2,
    title: "استارتاپ تکنولوژی",
    category: "logo",
    categoryLabel: "طراحی لوگو",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description: "سبک فلات + آیکون هوش مصنوعی + موشن اینترو برای استارتاپ فناوری.",
    client: "تک‌نو",
    year: "۱۴۰۲",
    results: ["جذب سرمایه ۲ میلیارد", "رشد ۳۰۰٪ کاربران"],
    technologies: ["Figma", "After Effects", "Cinema 4D"],
  },
  {
    id: 3,
    title: "برند پوشاک لیلی",
    category: "logo",
    categoryLabel: "طراحی لوگو",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    description: "امضای لوکس + طلاکوب + استوری موشن معرفی برای برند پوشاک زنانه.",
    client: "برند لیلی",
    year: "۱۴۰۲",
    results: ["فروش ۲۵۰٪ افزایش", "۱۲۰k فالوور اینستا"],
    technologies: ["Illustrator", "Photoshop", "After Effects"],
  },
  {
    id: 4,
    title: "کمپین یلدا",
    category: "poster",
    categoryLabel: "پوستر و موشن",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    description: "استوری موشن 15 ثانیه‌ای با افکت‌های 3D و موسیقی رویالتی‌فری.",
    client: "رستوران طعم خاص",
    year: "۱۴۰۲",
    results: ["افزایش ۳۲۰٪ فروش", "۲ میلیون ریچ"],
    technologies: ["After Effects", "Premiere", "Audition"],
  },
  {
    id: 5,
    title: "پوستر نوروز ۱۴۰۴",
    category: "poster",
    categoryLabel: "پوستر و موشن",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
    description: "سبک ایرانی-مدرن + چاپ افست + طلاکوب برای کمپین نوروزی.",
    client: "مجموعه فروشگاهی آرا",
    year: "۱۴۰۳",
    results: ["۵۰۰۰ نسخه چاپ", "بهترین کمپین نوروز"],
    technologies: ["Photoshop", "Illustrator", "InDesign"],
  },
  {
    id: 6,
    title: "فروشگاه آنلاین",
    category: "web",
    categoryLabel: "طراحی سایت",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: "فروشگاه ووکامرس با درگاه پرداخت + انیمیشن اسکرول + UI/UX مدرن.",
    client: "فروشگاه مردانه",
    year: "۱۴۰۲",
    results: ["افزایش ۳۵۰٪ فروش", "۱۰,۰۰۰+ محصول"],
    technologies: ["WordPress", "WooCommerce", "PHP"],
  },
  {
    id: 7,
    title: "سایت شرکتی",
    category: "web",
    categoryLabel: "طراحی سایت",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=600&fit=crop",
    description: "ریسپانسیو + انیمیشن‌های SVG + فرم هوشمند برای موسسه حقوقی.",
    client: "موسسه حقوقی دادوران",
    year: "۱۴۰۱",
    results: ["۲۰۰٪ افزایش مشاوره", "رتبه ۱ گوگل"],
    technologies: ["React", "Tailwind", "Node.js"],
  },
  {
    id: 8,
    title: "رستوران طعم خاص",
    category: "instagram",
    categoryLabel: "مدیریت اینستاگرام",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    description: "از ۲k به ۴۵k فالوور واقعی در ۶ ماه با استوری موشن روزانه.",
    client: "رستوران طعم خاص",
    year: "۱۴۰۲",
    results: ["۴۵k فالوور واقعی", "۵۰۰٪ افزایش فروش"],
    technologies: ["Meta Business", "Canva", "Later"],
  },
  {
    id: 9,
    title: "برند پوشاک",
    category: "instagram",
    categoryLabel: "مدیریت اینستاگرام",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    description: "استوری موشن روزانه + ریلز + فروش ۲۵۰٪ با کمپین اینفلوئنسر.",
    client: "فشن‌لند",
    year: "۱۴۰۲",
    results: ["از ۵k به ۱۲۰k فالوور", "فروش ۱ میلیارد"],
    technologies: ["Meta Ads", "Influence Marketing"],
  },
  {
    id: 10,
    title: "سئو فروشگاه لوازم خانگی",
    category: "seo",
    categoryLabel: "سئو و گوگل مپ",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    description: "رتبه ۱ گوگل برای ۲۵+ کلمه کلیدی و ثبت در گوگل مپ با ۱۵۰+ ریویو.",
    client: "هومی‌لند",
    year: "۱۴۰۲",
    results: ["رتبه ۱ گوگل", "۴۰۰٪ ترافیک"],
    technologies: ["Ahrefs", "Search Console", "Analytics"],
  },
  {
    id: 11,
    title: "رستوران در گوگل مپ",
    category: "seo",
    categoryLabel: "سئو و گوگل مپ",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    description: "ثبت و بهینه‌سازی گوگل مپ با ۲۰۰+ ریویو ۵ ستاره واقعی.",
    client: "رستوران سنتی باران",
    year: "۱۴۰۲",
    results: ["۲۰۰+ ریویو ۵ ستاره", "۳۰۰٪ رزرو بیشتر"],
    technologies: ["Google My Business", "Local SEO"],
  },
  {
    id: 12,
    title: "آژانس املاک",
    category: "web",
    categoryLabel: "طراحی سایت",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    description: "سایت با نقشه گوگل + فیلتر قیمت + اسکن مدارک برای آژانس املاک.",
    client: "آژانس املاک سبز",
    year: "۱۴۰۱",
    results: ["۵۰۰+ ملک ثبت شده", "۳x فروش بیشتر"],
    technologies: ["Laravel", "Vue.js", "MySQL"],
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const openLightbox = (project: typeof projects[0]) => {
    setSelectedProject(project);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
  };

  const nextProject = () => {
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject?.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  };

  const prevProject = () => {
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject?.id);
    const prevIndex = currentIndex === 0 ? filteredProjects.length - 1 : currentIndex - 1;
    setSelectedProject(filteredProjects[prevIndex]);
  };

  return (
    <>
      <Helmet>
        <title>نمونه کارها | آژانس دیجیتال مارکتینگ ازما – طلایی کردن برندها</title>
        <meta name="description" content="طراحی لوگو، هویت بصری، پوستر، استوری موشن، مدیریت اینستاگرام، طراحی سایت و سئو | نمونه‌کارهای حرفه‌ای با 3D Animation در همدان" />
        <meta name="keywords" content="نمونه کار طراحی لوگو, نمونه پوستر, استوری موشن, طراحی سایت همدان, سئو, اینستاگرام, هویت بصری" />
        <link rel="canonical" href="https://azmamarkteng.ir/portfolio" />
        <meta property="og:title" content="نمونه‌کارهای آژانس ازما" />
        <meta property="og:description" content="نمونه‌کارهای حرفه‌ای با انیمیشن‌های سه‌بعدی" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "نمونه کارها",
            "description": "گالری نمونه‌کارهای آژانس ازما",
            "url": "https://azmamarkteng.ir/portfolio"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                گالری پروژه‌ها
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                طلایی‌ترین <span className="text-gradient-gold">نمونه‌کارها</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                طراحی لوگو، هویت بصری، پوستر، استوری موشن، مدیریت اینستاگرام، طراحی سایت و سئو – همه‌چیز را با استاندارد‌های جهانی به شما تحویل می‌دهیم.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="pb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                      : "glass hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-24">
          <div className="container">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                    onClick={() => openLightbox(project)}
                    className="group glass rounded-3xl overflow-hidden cursor-pointer relative"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Eye className="w-6 h-6 text-primary-foreground" />
                        </motion.div>
                      </div>

                      {/* Category Badge */}
                      <span className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded-full text-primary-foreground text-xs font-bold">
                        {project.categoryLabel}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{project.client}</span>
                        <span className="text-xs text-primary">{project.year}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="text-muted-foreground mb-6">
                می‌خواهید پروژه شما هم اینجا باشد؟
              </p>
              <Button size="lg" className="gap-2" asChild>
                <Link to="/contact">
                  شروع همکاری
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 left-6 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-foreground/10 transition-colors z-10"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); prevProject(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-foreground/10 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextProject(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-foreground/10 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>

              {/* Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-full min-h-[300px]">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:bg-gradient-to-r" />
                  </div>

                  {/* Info */}
                  <div className="p-8">
                    <span className="inline-block px-3 py-1 bg-primary/20 rounded-full text-primary text-xs font-bold mb-4">
                      {selectedProject.categoryLabel}
                    </span>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                      {selectedProject.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {selectedProject.description}
                    </p>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">مشتری</p>
                        <p className="text-foreground font-medium">{selectedProject.client}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">سال</p>
                        <p className="text-foreground font-medium">{selectedProject.year}</p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-2">نتایج</p>
                      <div className="space-y-2">
                        {selectedProject.results.map((result, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-foreground text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-2">ابزارها</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button className="w-full gap-2" asChild>
                      <Link to="/contact">
                        <ExternalLink className="w-4 h-4" />
                        سفارش پروژه مشابه
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
        <ChatWidget />
      </div>
    </>
  );
};

export default Portfolio;
