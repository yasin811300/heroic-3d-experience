import { motion } from "framer-motion";
import { Phone, MapPin, Instagram, Send, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "صفحه اصلی", href: "/" },
    { label: "خدمات ما", href: "/services" },
    { label: "نمونه‌کارها", href: "/portfolio" },
    { label: "تماس با ما", href: "/contact" },
    { label: "ورود / ثبت‌نام", href: "/auth" },
    { label: "پنل مدیریت", href: "/admin/login", icon: Shield },
  ];

  return (
    <footer className="relative mt-20 pt-16 border-t border-border/30">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-background pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-black text-xl">آ</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                آژانس ازما
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              ما با تکیه بر دانش روز و تجربه ۴ ساله، بهترین راهکارها را برای رشد
              کسب‌وکار شما ارائه می‌دهیم.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/yasinsalarnazm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/yasinsalarnazm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-6 pb-2 border-b border-border/30 inline-block">
              دسترسی سریع
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary hover:pr-2 transition-all text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-6 pb-2 border-b border-border/30 inline-block">
              اطلاعات تماس
            </h3>
            <address className="not-italic space-y-4">
              <p className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:09914601322" className="hover:text-foreground transition-colors">
                  ۰۹۹۱۴۶۰۱۳۲۲
                </a>
              </p>
              <p className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:09300881413" className="hover:text-foreground transition-colors">
                  ۰۹۳۰۰۸۸۱۴۱۳
                </a>
              </p>
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>همدان، شهرک مدنی، بلوار امام خمینی</span>
              </p>
            </address>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/30 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} تمامی حقوق برای آژانس دیجیتال مارکتینگ ازما محفوظ است.
            | طراحی و توسعه توسط{" "}
            <span className="text-primary font-bold">یاسین سالارناظم</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
