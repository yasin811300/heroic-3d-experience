import { motion } from "framer-motion";
import { Award, ExternalLink, CheckCircle } from "lucide-react";

const certifications = [
  {
    name: "Google AI Certification",
    issuer: "Google",
    image: "/cert-google.jpg",
    description: "گواهی هوش مصنوعی گوگل",
    year: "۲۰۲۴",
    badge: "🏆",
  },
  {
    name: "IBM IT Specialist",
    issuer: "IBM",
    image: "/cert-ibm.jpg",
    description: "متخصص فناوری اطلاعات IBM",
    year: "۲۰۲۳",
    badge: "🎖️",
  },
  {
    name: "All-in-One Digital Marketing",
    issuer: "Google & HubSpot",
    image: "/cert-aio.jpg",
    description: "دوره جامع دیجیتال مارکتینگ",
    year: "۲۰۲۴",
    badge: "🎨",
  },
];

const CertificationsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="certifications">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-secondary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            گواهی‌نامه‌های بین‌المللی
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            تأیید شده توسط <span className="text-gradient-gold">غول‌های تکنولوژی</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            افتخار داریم که با اخذ معتبرترین گواهی‌نامه‌های جهانی، کیفیت خدمات خود را تضمین می‌کنیم
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {certifications.map((cert, index) => (
            <motion.article
              key={cert.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group glass rounded-3xl overflow-hidden relative"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              
              {/* Certificate Image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 right-4 text-3xl md:text-4xl">
                  {cert.badge}
                </div>
                
                {/* Year Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold">
                  {cert.year}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 relative z-20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  <span className="text-muted-foreground text-xs md:text-sm">{cert.issuer}</span>
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-tight">
                  {cert.name}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4">
                  {cert.description}
                </p>
                
                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-primary text-sm font-medium group/btn"
                >
                  مشاهده گواهی
                  <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-6"
        >
          {["Google Partner", "IBM Certified", "Adobe Expert", "Meta Blueprint"].map((badge, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 md:px-6 py-2 md:py-3 rounded-full glass border-primary/20 text-foreground text-xs md:text-sm font-medium"
            >
              ✓ {badge}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
