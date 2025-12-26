import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "استارتاپ",
    icon: Zap,
    price: "۲,۹۰۰,۰۰۰",
    description: "برای کسب‌وکارهای تازه‌کار",
    features: [
      "طراحی لوگو",
      "۵ صفحه سایت",
      "هاست و دامنه یکساله",
      "پشتیبانی ۳ ماهه",
    ],
    popular: false,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    name: "حرفه‌ای",
    icon: Star,
    price: "۷,۹۰۰,۰۰۰",
    description: "محبوب‌ترین انتخاب",
    features: [
      "هویت بصری کامل",
      "سایت نامحدود صفحه",
      "سئو پایه",
      "مدیریت اینستا ۳ ماه",
      "پشتیبانی ۶ ماهه",
      "اپلیکیشن موبایل",
    ],
    popular: true,
    gradient: "from-primary to-gold-light",
  },
  {
    name: "سازمانی",
    icon: Crown,
    price: "۱۴,۹۰۰,۰۰۰",
    description: "برای برندهای بزرگ",
    features: [
      "همه امکانات حرفه‌ای",
      "سئو پیشرفته",
      "کمپین تبلیغاتی",
      "مشاور اختصاصی",
      "پشتیبانی ۱ ساله",
      "گزارش‌های ماهانه",
      "تولید محتوا",
    ],
    popular: false,
    gradient: "from-purple-500 to-pink-500",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            تعرفه‌های <span className="text-gradient-gold">ویژه</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            بسته مناسب خودتان را انتخاب کنید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: plan.popular ? 1.02 : 1.02 }}
              className={`relative glass rounded-3xl p-8 ${
                plan.popular ? "border-primary/50 md:scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-gold-light rounded-full text-primary-foreground text-sm font-bold"
                >
                  پرفروش‌ترین
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}
              >
                <plan.icon className="w-7 h-7 text-white" />
              </div>

              {/* Name & Description */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-black text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm mr-2">تومان</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "gradient-gold" : "outline"}
                className="w-full"
              >
                انتخاب بسته
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
