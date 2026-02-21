import { motion } from "framer-motion";
import { Linkedin, Instagram, Twitter, Send } from "lucide-react";

const team = [
  {
    name: "یاسین سالارناظم",
    role: "مدیرعامل و بنیان‌گذار",
    image: "/yasin.jpg",
    bio: "بنیان‌گذار آژانس ازما با تجربه در دیجیتال مارکتینگ",
    telegram: "https://t.me/yasin_salarnazem",
    instagram: "https://instagram.com/yasin_salarnazem",
  },
  {
    name: "سارا محمدی",
    role: "مدیر خلاقیت",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    bio: "طراح برنده جوایز بین‌المللی",
  },
  {
    name: "محمد حسینی",
    role: "توسعه‌دهنده ارشد",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "متخصص React و Node.js",
  },
  {
    name: "مریم رضایی",
    role: "متخصص سئو",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "۵۰+ پروژه موفق سئو",
  },
  {
    name: "نگین سلمانی",
    role: "طراح سایت و سئو کار",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    bio: "متخصص طراحی وب و بهینه‌سازی موتورهای جستجو",
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            تیم <span className="text-gradient-gold">حرفه‌ای</span> ما
          </h2>
          <p className="text-muted-foreground text-lg">
            افرادی که رویاهای شما رو به واقعیت تبدیل می‌کنند
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group glass rounded-3xl p-6 text-center relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-28 h-28 mx-auto mb-4"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-gold-light p-1">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                
                {/* Online Indicator */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background"
                />
              </motion.div>

              {/* Info */}
              <h3 className="text-lg font-bold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-primary text-sm font-medium mb-2">
                {member.role}
              </p>
              <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                {member.telegram && (
                  <motion.a
                    href={member.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </motion.a>
                )}
                {member.instagram && (
                  <motion.a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </motion.a>
                )}
                {!member.telegram && !member.instagram && [Linkedin, Instagram, Twitter].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
