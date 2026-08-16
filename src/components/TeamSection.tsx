import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Twitter, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  name: string;
  role: string;
  title?: string | null;
  image: string;
  bio: string;
  telegram?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
}

const fallbackTeam: Member[] = [
  {
    name: "یاسین سالارناظم",
    role: "مدیرعامل و بنیان‌گذار",
    image: "https://azmamarkteng.ir/yasin.jpg",
    bio: "بنیان‌گذار آژانس ازما با تجربه در دیجیتال مارکتینگ",
    telegram: "https://t.me/yasin_salarnazem",
    instagram: "https://instagram.com/yasin_salarnazem",
  },
  {
    name: "نگین سلمانی",
    role: "طراح سایت و سئو کار",
    title: "ملکه کدنویسی ازما 👑",
    image: "/team/negin-salmani.jpg",
    bio: "۴ سال تجربه در طراحی وب و سئو",
  },
];

const TeamSection = () => {
  const [team, setTeam] = useState<Member[]>(fallbackTeam);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any)
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (data && data.length) {
        setTeam(
          data.map((m: any) => ({
            name: m.name,
            role: m.role,
            title: m.title,
            image: m.image_url || "/placeholder.svg",
            bio: m.bio || "",
            telegram: m.telegram,
            instagram: m.instagram,
            linkedin: m.linkedin,
            twitter: m.twitter,
          }))
        );
      }
    };
    load();
  }, []);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="text-primary text-sm font-medium mb-1">
                {member.role}
              </p>
              {member.title && (
                <p className="text-xs text-muted-foreground/80 italic mb-2">{member.title}</p>
              )}
              <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                {member.telegram && (
                  <motion.a
                    href={member.telegram.startsWith("http") ? member.telegram : `https://t.me/${member.telegram.replace("@", "")}`}
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
                    href={member.instagram.startsWith("http") ? member.instagram : `https://instagram.com/${member.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </motion.a>
                )}
                {member.linkedin && (
                  <motion.a
                    href={member.linkedin.startsWith("http") ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                )}
                {member.twitter && (
                  <motion.a
                    href={member.twitter.startsWith("http") ? member.twitter : `https://twitter.com/${member.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
