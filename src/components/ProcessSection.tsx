import { motion } from "framer-motion";
import { MessageSquare, Search, Palette, Rocket, Sparkles } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "۰۱",
    title: "مشاوره رایگان",
    description: "اول از همه، نیازها و اهداف شما رو می‌فهمیم. مشاوره ما کاملاً رایگانه!",
  },
  {
    icon: Search,
    number: "۰۲",
    title: "تحقیق و تحلیل",
    description: "بازار، رقبا و مخاطبان هدف شما رو بررسی می‌کنیم تا بهترین استراتژی رو پیدا کنیم.",
  },
  {
    icon: Palette,
    number: "۰۳",
    title: "طراحی و توسعه",
    description: "با جدیدترین تکنولوژی‌ها، پروژه شما رو طراحی و اجرا می‌کنیم.",
  },
  {
    icon: Rocket,
    number: "۰۴",
    title: "راه‌اندازی",
    description: "پروژه شما آماده‌ست! حالا وقتشه که بازار رو تسخیر کنید.",
  },
];

const ProcessSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            چطور <span className="text-gradient-gold">کار می‌کنیم</span>؟
          </h2>
          <p className="text-muted-foreground text-lg">فرآیند ساده و شفاف ما</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center gap-8 md:gap-16 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col md:flex-row`}
              >
                {/* Content */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex-1 glass rounded-3xl p-8 relative overflow-hidden group ${
                    index % 2 === 0 ? "md:text-left" : "md:text-right"
                  } text-center`}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  {/* Number Badge */}
                  <span className="absolute top-4 left-4 text-6xl font-black text-primary/10">
                    {step.number}
                  </span>

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Center Circle */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center shadow-lg glow-gold z-10 hidden md:flex"
                >
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </motion.div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
