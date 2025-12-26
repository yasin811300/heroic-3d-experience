import { motion } from "framer-motion";

const clients = [
  { name: "دیجی‌کالا", logo: "🛒" },
  { name: "اسنپ", logo: "🚗" },
  { name: "تپسی", logo: "🚕" },
  { name: "دیوار", logo: "📋" },
  { name: "کافه‌بازار", logo: "📱" },
  { name: "فیلیمو", logo: "🎬" },
  { name: "نماوا", logo: "📺" },
  { name: "آپارات", logo: "▶️" },
];

const ClientsSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            اعتماد <span className="text-gradient-gold">برندهای بزرگ</span>
          </h2>
          <p className="text-muted-foreground">همراهان افتخاری ما</p>
        </motion.div>

        {/* Infinite Scroll */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12"
          >
            {[...clients, ...clients].map((client, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="glass rounded-2xl px-8 py-6 flex flex-col items-center gap-3 min-w-[140px] hover:border-primary/50 transition-all"
              >
                <span className="text-4xl">{client.logo}</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {client.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
