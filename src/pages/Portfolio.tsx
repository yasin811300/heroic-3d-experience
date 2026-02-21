import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { supabase } from "@/integrations/supabase/client";

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ id: "all", label: "همه" }]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (data) {
      setProjects(data);
      
      // Extract unique categories
      const uniqueCats = Array.from(new Set(data.map(item => item.category))).filter(Boolean);
      const newCategories = [
        { id: "all", label: "همه" },
        ...uniqueCats.map(cat => ({ id: cat, label: cat }))
      ];
      setCategories(newCategories);
    }
  };

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const openLightbox = (project: any) => {
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
                        src={project.image_url}
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
                        {project.category}
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
                        <span className="text-xs text-muted-foreground">{project.client_name}</span>
                        {/* Assuming year isn't in DB */}
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
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-primary font-bold mb-2">{selectedProject.category}</span>
                    <h2 className="text-3xl font-black mb-4">{selectedProject.title}</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {selectedProject.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       {selectedProject.client_name && (
                        <div>
                           <span className="block text-xs text-muted-foreground mb-1">مشتری</span>
                           <span className="font-bold">{selectedProject.client_name}</span>
                        </div>
                       )}
                    </div>

                    {selectedProject.project_url && (
                        <Button className="w-full gap-2" asChild>
                          <a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer">
                            مشاهده پروژه
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <ChatWidget />
        <Footer />
      </div>
    </>
  );
};

export default Portfolio;