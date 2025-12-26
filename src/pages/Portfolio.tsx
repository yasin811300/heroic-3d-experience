import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Eye, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  { id: "all", label: "همه" },
  { id: "web", label: "طراحی سایت" },
  { id: "branding", label: "هویت بصری" },
  { id: "social", label: "شبکه‌های اجتماعی" },
  { id: "app", label: "اپلیکیشن" },
  { id: "seo", label: "سئو" },
];

const projects = [
  {
    id: 1,
    title: "فروشگاه آنلاین دیجی‌استایل",
    category: "web",
    categoryLabel: "طراحی سایت",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: "طراحی و توسعه فروشگاه آنلاین با بیش از ۱۰,۰۰۰ محصول، سیستم پرداخت آنلاین و پنل مدیریت پیشرفته.",
    client: "شرکت دیجی‌استایل",
    year: "۱۴۰۲",
    results: ["افزایش ۳۵۰٪ فروش آنلاین", "کاهش ۶۰٪ نرخ پرش"],
    technologies: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "ریبرندینگ کافه لاته",
    category: "branding",
    categoryLabel: "هویت بصری",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop",
    description: "طراحی کامل هویت بصری شامل لوگو، ست اداری، منو و دکوراسیون داخلی کافه.",
    client: "کافه لاته",
    year: "۱۴۰۲",
    results: ["افزایش ۲۰۰٪ مشتریان جدید", "برنده جایزه بهترین کافه"],
    technologies: ["Figma", "Illustrator", "Photoshop"],
  },
  {
    id: 3,
    title: "مدیریت اینستاگرام فشن‌لند",
    category: "social",
    categoryLabel: "شبکه‌های اجتماعی",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    description: "مدیریت کامل اینستاگرام شامل تولید محتوا، استراتژی رشد و کمپین‌های تبلیغاتی.",
    client: "فروشگاه فشن‌لند",
    year: "۱۴۰۲",
    results: ["از ۵k به ۱۲۰k فالوور", "افزایش ۵۰۰٪ فروش از اینستا"],
    technologies: ["Meta Business", "Canva", "Later"],
  },
  {
    id: 4,
    title: "اپلیکیشن سفارش غذا",
    category: "app",
    categoryLabel: "اپلیکیشن",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    description: "طراحی و توسعه اپلیکیشن سفارش آنلاین غذا با سیستم ردیابی زنده و پرداخت آنلاین.",
    client: "زود فود",
    year: "۱۴۰۲",
    results: ["۵۰,۰۰۰+ دانلود", "امتیاز ۴.۸ از ۵"],
    technologies: ["React Native", "Firebase", "Stripe"],
  },
  {
    id: 5,
    title: "سئو فروشگاه لوازم خانگی",
    category: "seo",
    categoryLabel: "سئو",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    description: "بهینه‌سازی کامل سایت برای موتورهای جستجو و افزایش ترافیک ارگانیک.",
    client: "هومی‌لند",
    year: "۱۴۰۲",
    results: ["رتبه ۱ گوگل برای ۲۵+ کلمه", "افزایش ۴۰۰٪ ترافیک"],
    technologies: ["Ahrefs", "Google Analytics", "Search Console"],
  },
  {
    id: 6,
    title: "وبسایت شرکت حقوقی",
    category: "web",
    categoryLabel: "طراحی سایت",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=600&fit=crop",
    description: "طراحی سایت حرفه‌ای با سیستم رزرو آنلاین مشاوره و بلاگ حقوقی.",
    client: "موسسه حقوقی دادوران",
    year: "۱۴۰۱",
    results: ["افزایش ۲۰۰٪ مشاوره‌های آنلاین", "کاهش هزینه تبلیغات"],
    technologies: ["WordPress", "Elementor", "PHP"],
  },
  {
    id: 7,
    title: "برندینگ استارتاپ فین‌تک",
    category: "branding",
    categoryLabel: "هویت بصری",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description: "طراحی هویت بصری مدرن برای استارتاپ پرداخت دیجیتال.",
    client: "پی‌نو",
    year: "۱۴۰۲",
    results: ["جذب سرمایه ۲ میلیارد تومان", "رشد ۳۰۰٪ کاربران"],
    technologies: ["Figma", "After Effects", "Blender"],
  },
  {
    id: 8,
    title: "کمپین اینستاگرام برند پوشاک",
    category: "social",
    categoryLabel: "شبکه‌های اجتماعی",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    description: "اجرای کمپین تبلیغاتی با اینفلوئنسرها و افزایش فروش فصلی.",
    client: "مودا",
    year: "۱۴۰۲",
    results: ["۲ میلیون ریچ", "فروش ۱ میلیارد تومان"],
    technologies: ["Meta Ads", "Influence Marketing"],
  },
  {
    id: 9,
    title: "اپلیکیشن رزرو هتل",
    category: "app",
    categoryLabel: "اپلیکیشن",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    description: "توسعه اپلیکیشن رزرو هتل با سیستم مقایسه قیمت و نظرات کاربران.",
    client: "تریپ‌یار",
    year: "۱۴۰۱",
    results: ["۱۰۰,۰۰۰+ رزرو موفق", "امتیاز ۴.۶ از ۵"],
    technologies: ["Flutter", "Django", "PostgreSQL"],
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const openLightbox = (project: typeof projects[0], index: number) => {
    setSelectedProject(project);
    setLightboxIndex(index);
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
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              بازگشت به صفحه اصلی
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              نمونه‌کارهای <span className="text-gradient-gold">درخشان</span> ما
            </h1>
            <p className="text-xl text-muted-foreground">
              پروژه‌هایی که با عشق و تخصص انجام دادیم
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
                    ? "bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-lg"
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
                  onClick={() => openLightbox(project, index)}
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
                    <p className="text-xs text-muted-foreground mb-2">تکنولوژی‌ها</p>
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
                  <Button className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    مشاهده پروژه
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Portfolio;
