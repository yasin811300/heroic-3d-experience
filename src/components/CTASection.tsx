import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container"
      >
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-card to-secondary" />
          
          {/* Animated orbs */}
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-black text-foreground mb-6"
            >
              وقتشه کسب‌وکارت رو{" "}
              <span className="text-gradient-gold">طلایی</span> کنی
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              همین حالا برای دریافت مشاوره رایگان و آنالیز پیج یا سایتت با ما تماس
              بگیر. اولین جلسه ۱ ساعته، کاملاً رایگان.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button variant="hero" size="xl" className="gap-3">
                شروع همکاری
                <Rocket className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
