import { motion } from "framer-motion";

const technologies = [
  { name: "React", icon: "⚛️", color: "from-cyan-400 to-blue-500" },
  { name: "Node.js", icon: "🟢", color: "from-green-400 to-emerald-500" },
  { name: "TypeScript", icon: "📘", color: "from-blue-400 to-blue-600" },
  { name: "Next.js", icon: "▲", color: "from-gray-400 to-gray-600" },
  { name: "Figma", icon: "🎨", color: "from-pink-400 to-purple-500" },
  { name: "AI/ML", icon: "🤖", color: "from-primary to-gold-light" },
  { name: "Python", icon: "🐍", color: "from-yellow-400 to-green-500" },
  { name: "WordPress", icon: "📝", color: "from-blue-500 to-cyan-400" },
];

const TechSection = () => {
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
            تکنولوژی‌های <span className="text-gradient-gold">پیشرفته</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            با جدیدترین ابزارها کار می‌کنیم
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                rotateY: 10,
                rotateX: 10,
              }}
              className="glass rounded-3xl p-6 text-center group cursor-pointer relative overflow-hidden"
            >
              {/* Background Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Floating Icon */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                className="text-5xl mb-4"
              >
                {tech.icon}
              </motion.div>

              {/* Name */}
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </h3>

              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
