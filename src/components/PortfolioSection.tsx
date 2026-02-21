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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link to={`/portfolio`} key={project.id}>
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-3xl overflow-hidden h-80 cursor-pointer"
              >
                {/* Image */}
                <motion.img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex flex-col justify-end p-6"
                >
                  <span className="text-primary text-sm font-bold mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                </motion.div>

                {/* Always visible gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 left-4 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-primary text-sm font-bold">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {project.title}
                  </h3>
                </div>
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