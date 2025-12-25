import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "محمدرضا شریفی",
    role: "صاحب رستوران",
    content: "بعد از ۳ ماه همکاری، مشتری‌های آنلاین من ۳ برابر شد. تیم ازما واقعاً حرفه‌ایه.",
    rating: 5,
  },
  {
    name: "زهرا احمدی",
    role: "مدیر فروشگاه",
    content: "سایتی که طراحی کردن فوق‌العاده بود. سرعت لود بالا و رابط کاربری عالی.",
    rating: 5,
  },
  {
    name: "علی کریمی",
    role: "مدیر آژانس مسافرتی",
    content: "کمپین تبلیغاتی‌شون فوق‌العاده بود. فروش نوروز ما ۲۵۰٪ افزایش پیدا کرد.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />

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
            نظرات <span className="text-gradient-gold">مشتریان</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            صداقت در کار، راز موفقیت ماست
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-6"
            >
              {/* Avatar & Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{testimonial.content}"
              </blockquote>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
