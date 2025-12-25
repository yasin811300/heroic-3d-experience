import { motion } from "framer-motion";
import { Brush, Code, Search, Smartphone } from "lucide-react";

const services = [
  {
    icon: Brush,
    title: "طراحی هویت بصری",
    description: "لوگو، ست اداری، بنر، کاتالوگ و همه چیز برای برندینگ حرفه‌ای شما.",
    features: ["طراحی لوگو منحصربه‌فرد", "کارت ویزیت و سربرگ", "بسته‌بندی محصولات"],
  },
  {
    icon: Code,
    title: "طراحی سایت",
    description: "سایت‌های مدرن، سریع و واکنش‌گرا با بهترین تکنولوژی‌های روز دنیا.",
    features: ["سایت فروشگاهی", "سایت شرکتی", "سایت شخصی"],
  },
  {
    icon: Search,
    title: "بهینه‌سازی SEO",
    description: "سایت شما را به صفحه اول گوگل می‌رسانیم. تضمینی!",
    features: ["تحلیل کلمات کلیدی", "بهینه‌سازی تکنیکال", "لینک‌سازی داخلی و خارجی"],
  },
  {
    icon: Smartphone,
    title: "مدیریت اینستاگرام",
    description: "پیج شما را به یک برند موفق تبدیل می‌کنیم. فالوور واقعی، فروش واقعی.",
    features: ["تولید محتوای هدفمند", "افزایش فالوور واقعی", "مدیریت کامنت و دایرکت"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            خدمات <span className="text-gradient-gold">طلایی</span> ما
          </h2>
          <p className="text-muted-foreground text-lg">
            از صفر تا صد کسب‌وکار خود را به ما بسپارید
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group glass rounded-3xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-xs text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
