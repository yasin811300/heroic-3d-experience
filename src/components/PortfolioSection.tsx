import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PortfolioSection = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6);
      
      if (data) {
        setProjects(data);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
              پروژه‌های <span className="text-gradient-gold">موفق</span> ما
            </h2>
            <p className="text-muted-foreground">نتیجه کار ما را ببینید</p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2" asChild>
            <Link to="/portfolio">
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="columns-1 md:columns-3 gap-6 space-y-6">
          {projects.map((project, index) => (
            <Link to="/portfolio" key={project.id} className="break-inside-avoid block">
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ rotateY: -4, rotateX: 3, scale: 1.02 }}
                style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer bg-background/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <motion.img
                  src={project.image_url}
                  alt={`${project.title} - ${project.category} | نمونه کار آژانس ازما`}
                  title={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                  <span className="text-primary text-sm font-bold mb-1">{project.category}</span>
                  <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                </div>

                {/* Always visible bottom info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/70 to-transparent p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-primary text-xs font-bold">{project.category}</span>
                  <h3 className="text-sm font-bold text-foreground">{project.title}</h3>
                </div>

                {/* Glass reflection */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
              </motion.article>
            </Link>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 md:hidden">
          <Button variant="outline" className="w-full gap-2" asChild>
            <Link to="/portfolio">
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;