import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Gift, 
  Users, 
  Star, 
  Percent, 
  Crown,
  Sparkles,
  TrendingUp,
  Store,
  Zap,
  Diamond,
  Trophy,
  Heart,
  Rocket,
  Shield,
  Timer,
  ArrowLeft
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  logo_url: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  description: string | null;
  category: string | null;
  website_url: string | null;
}

interface ClubStats {
  total_users: number;
  active_businesses: number;
}

const CustomerClub = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<ClubStats>({ total_users: 0, active_businesses: 0 });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (stats.total_users > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = stats.total_users / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stats.total_users) {
          setAnimatedUsers(stats.total_users);
          clearInterval(timer);
        } else {
          setAnimatedUsers(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [stats.total_users]);

  const fetchData = async () => {
    try {
      const { data: businessData } = await supabase
        .from('club_businesses')
        .select('*')
        .eq('is_active', true);

      setBusinesses(businessData || []);

      const { data: statsData } = await supabase
        .from('club_stats')
        .select('*');
      
      const statsObj: ClubStats = { total_users: 1250, active_businesses: 15 };
      statsData?.forEach(stat => {
        if (stat.key === 'total_users') statsObj.total_users = stat.value || 1250;
        if (stat.key === 'active_businesses') statsObj.active_businesses = stat.value || 15;
      });
      setStats(statsObj);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "خطا", description: "لطفاً ایمیل و رمز عبور را وارد کنید", variant: "destructive" });
      return;
    }
    
    setJoining(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      toast({ title: "خوش آمدید! 🎉", description: "با موفقیت عضو باشگاه شدید" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } finally {
      setJoining(false);
    }
  };

  const benefits = [
    { icon: Percent, title: "تخفیف‌های اختصاصی", description: "تا ۵۰٪ تخفیف در خدمات", gradient: "from-rose-500 to-pink-600" },
    { icon: Star, title: "امتیاز VIP", description: "کسب امتیاز با هر خرید", gradient: "from-amber-500 to-orange-600" },
    { icon: Gift, title: "هدایا ویژه", description: "هدیه در مناسبت‌های خاص", gradient: "from-emerald-500 to-teal-600" },
    { icon: Crown, title: "دسترسی زودتر", description: "اولین نفر از تخفیف‌ها باخبر شوید", gradient: "from-violet-500 to-purple-600" }
  ];

  const FloatingShape = ({ delay, children, className }: { delay: number, children: React.ReactNode, className?: string }) => (
    <motion.div
      animate={{ 
        y: [0, -30, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>باشگاه مشتریان VIP | Azma Marketing</title>
        <meta name="description" content="عضو باشگاه مشتریان Azma شوید و از تخفیف‌های ویژه بهره‌مند شوید" />
      </Helmet>

      <Header />

      <main className="min-h-screen overflow-hidden" dir="rtl">
        {/* Epic Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900" />
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(139,92,246,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(236,72,153,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(139,92,246,0.3) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute inset-0"
            />
          </div>

          {/* Floating 3D Elements */}
          <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1500px" }}>
            <FloatingShape delay={0} className="absolute top-20 right-[10%]">
              <div className="w-40 h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/20 backdrop-blur-xl rounded-3xl rotate-12 border border-white/20 shadow-2xl" />
            </FloatingShape>

            <FloatingShape delay={1} className="absolute bottom-32 left-[15%]">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl" />
            </FloatingShape>

            <FloatingShape delay={2} className="absolute top-1/3 left-[20%]">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400/30 to-orange-500/20 backdrop-blur-xl rounded-2xl rotate-45 border border-white/20" />
            </FloatingShape>

            <FloatingShape delay={0.5} className="absolute top-1/4 right-[25%]">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                <Crown className="w-8 h-8 text-yellow-300" />
              </div>
            </FloatingShape>

            <FloatingShape delay={1.5} className="absolute bottom-1/4 right-[20%]">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30">
                <Diamond className="w-7 h-7 text-cyan-300" />
              </div>
            </FloatingShape>

            {/* Sparkle particles */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <motion.div style={{ y: heroY }} className="relative z-10 container mx-auto px-4 text-center py-32">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4 mb-10 shadow-2xl"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <span className="text-white font-bold text-lg">باشگاه مشتریان VIP</span>
                <Trophy className="w-6 h-6 text-yellow-300" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white"
                style={{ textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
              >
                تجربه‌ای
                <br />
                <span className="bg-gradient-to-l from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                  بی‌نظیر
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl md:text-2xl text-white/80 mb-14 max-w-2xl mx-auto"
              >
                با عضویت در باشگاه مشتریان، از تخفیف‌های ویژه و امتیازات اختصاصی بهره‌مند شوید! 🎁
              </motion.p>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col md:flex-row gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-xs shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-sm">اعضای فعال</p>
                      <p className="text-4xl font-black text-white">{animatedUsers.toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: -10 }}
                  className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-xs shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-sm">کسب‌وکار فعال</p>
                      <p className="text-4xl font-black text-white">{stats.active_businesses}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center pt-2"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5], y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-32 fill-background">
              <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <Zap className="w-4 h-4 ml-2" />
                مزایای عضویت
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                چرا باشگاه{" "}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  مشتریان؟
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-0 bg-gradient-to-br from-card to-secondary/30 shadow-xl hover:shadow-2xl transition-all overflow-hidden">
                    <CardContent className="p-8 text-center relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                        <benefit.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                <CardContent className="p-10">
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30"
                    >
                      <Rocket className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-3">همین الان عضو شوید!</h3>
                    <p className="text-muted-foreground">ثبت‌نام سریع و آسان</p>
                  </div>

                  <form onSubmit={handleJoinClub} className="space-y-5">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ایمیل شما"
                      className="h-14 text-lg bg-secondary/50 border-0 rounded-xl"
                      dir="ltr"
                    />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور"
                      className="h-14 text-lg bg-secondary/50 border-0 rounded-xl"
                      dir="ltr"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={joining}
                      className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/30"
                    >
                      {joining ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          عضویت رایگان
                          <ArrowLeft className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      امن و رایگان
                    </span>
                    <span className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-primary" />
                      فعال‌سازی فوری
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Businesses Grid */}
        {businesses.length > 0 && (
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  کسب‌وکارهای{" "}
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    همکار
                  </span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businesses.map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="h-full border-0 bg-card shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Store className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{business.name}</h3>
                            {business.category && (
                              <Badge variant="secondary" className="text-xs">{business.category}</Badge>
                            )}
                          </div>
                        </div>
                        {business.description && (
                          <p className="text-muted-foreground mb-4">{business.description}</p>
                        )}
                        {business.discount_percent && (
                          <div className="flex items-center gap-2 text-2xl font-bold text-green-500">
                            <Percent className="w-6 h-6" />
                            {business.discount_percent}٪ تخفیف
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default CustomerClub;
