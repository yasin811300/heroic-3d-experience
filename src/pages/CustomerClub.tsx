import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Gift, 
  Users, 
  Star, 
  Percent, 
  Mail, 
  Crown,
  Sparkles,
  TrendingUp,
  Store,
  ChevronLeft,
  Zap,
  Diamond,
  Trophy,
  Heart
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
  const [loading, setLoading] = useState(true);
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const { toast } = useToast();
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    fetchData();
  }, []);

  // Animated counter effect
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
      const { data: businessData, error: businessError } = await supabase
        .from('club_businesses')
        .select('*')
        .eq('is_active', true);

      if (businessError) throw businessError;
      setBusinesses(businessData || []);

      const { data: statsData, error: statsError } = await supabase
        .from('club_stats')
        .select('*');

      if (statsError) throw statsError;
      
      const statsObj: ClubStats = { total_users: 0, active_businesses: 0 };
      statsData?.forEach(stat => {
        if (stat.key === 'total_users') statsObj.total_users = stat.value || 0;
        if (stat.key === 'active_businesses') statsObj.active_businesses = stat.value || 0;
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
    if (!email) {
      toast({
        title: "خطا",
        description: "لطفاً ایمیل خود را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "خوش آمدید! 🎉",
      description: "شما با موفقیت عضو باشگاه مشتریان شدید"
    });
    setEmail("");
  };

  const handleGetDiscount = async (business: Business) => {
    await supabase.from('club_discount_usage').insert({
      business_id: business.id
    });

    toast({
      title: `تخفیف ${business.name} 🎁`,
      description: `کد تخفیف: AZMA${business.discount_percent}OFF`
    });
  };

  const benefits = [
    { icon: Percent, title: "تخفیف‌های اختصاصی", description: "تا ۳۰٪ تخفیف در کسب‌وکارهای منتخب", color: "from-sky-400 to-blue-600" },
    { icon: Star, title: "امتیاز برای خرید بعدی", description: "با هر خرید امتیاز کسب کنید", color: "from-amber-400 to-orange-500" },
    { icon: Mail, title: "خبرنامه ویژه", description: "اولین نفری باشید که از تخفیف‌ها باخبر می‌شوید", color: "from-emerald-400 to-green-600" },
    { icon: Crown, title: "اولویت VIP", description: "دسترسی زودتر به پیشنهادات خاص", color: "from-purple-400 to-pink-500" }
  ];

  const categoryIcons: Record<string, string> = {
    'رستوران': '🍽️',
    'کافه': '☕',
    'زیبایی': '💄',
    'ورزشی': '🏋️',
    'فروشگاه': '🛒',
    'آموزش': '📚'
  };

  // 3D floating elements
  const FloatingElement = ({ delay, children, className }: { delay: number, children: React.ReactNode, className?: string }) => (
    <motion.div
      initial={{ y: 0, rotateX: 0, rotateY: 0 }}
      animate={{ 
        y: [0, -20, 0],
        rotateX: [0, 10, 0],
        rotateY: [0, -10, 0]
      }}
      transition={{ 
        duration: 4 + delay, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay * 0.5
      }}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>باشگاه مشتریان ویژه | Azma Marketing</title>
        <meta name="description" content="با تخفیف‌های اختصاصی Azma Marketing، هر خریدت تجربه‌ای خاص میشه! عضو باشگاه مشتریان شوید." />
      </Helmet>

      <Header />

      <main className="min-h-screen overflow-hidden" dir="rtl">
        {/* Epic Hero Section with 3D Effects */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Sky Blue Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
            {/* Animated gradient overlay */}
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 20% 30%, rgba(125, 211, 252, 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 70%, rgba(125, 211, 252, 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 30%, rgba(125, 211, 252, 0.4) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0"
            />
          </div>

          {/* 3D Floating Geometric Shapes */}
          <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
            {/* Large 3D Diamond */}
            <FloatingElement delay={0} className="absolute top-20 right-20">
              <div className="w-32 h-32 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl rotate-45 shadow-2xl border border-white/20" 
                   style={{ transform: "rotateX(20deg) rotateY(-20deg)" }} />
            </FloatingElement>

            {/* Floating Spheres */}
            <FloatingElement delay={1} className="absolute bottom-40 left-20">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-300/50 to-blue-500/30 backdrop-blur-xl rounded-full shadow-2xl border border-white/30" />
            </FloatingElement>

            <FloatingElement delay={2} className="absolute top-40 left-1/3">
              <div className="w-16 h-16 bg-gradient-to-br from-white/40 to-sky-200/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20" 
                   style={{ transform: "rotateX(30deg) rotateY(30deg)" }} />
            </FloatingElement>

            <FloatingElement delay={1.5} className="absolute bottom-1/4 right-1/4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400/30 to-purple-500/20 backdrop-blur-xl rounded-full shadow-2xl border border-white/20" />
            </FloatingElement>

            {/* Floating Icons */}
            <FloatingElement delay={0.5} className="absolute top-1/3 right-1/4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </FloatingElement>

            <FloatingElement delay={2.5} className="absolute bottom-1/3 left-1/4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <Diamond className="w-7 h-7 text-white" />
              </div>
            </FloatingElement>

            <FloatingElement delay={1.8} className="absolute top-1/2 right-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-2xl border border-white/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </FloatingElement>

            {/* Sparkle particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 container mx-auto px-4 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              {/* Glowing Badge */}
              <motion.div
                initial={{ scale: 0, rotateZ: -10 }}
                animate={{ scale: 1, rotateZ: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-8 py-3 mb-8 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <span className="text-white font-bold text-lg">Azma Marketing</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-6 h-6 text-yellow-300" />
                </motion.div>
              </motion.div>

              {/* 3D Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white drop-shadow-2xl"
                style={{
                  textShadow: "0 10px 30px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.2)"
                }}
              >
                باشگاه مشتریان
                <br />
                <span className="bg-gradient-to-l from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  ویژه
                </span>
              </motion.h1>

              {/* Subtitle with glow */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl md:text-3xl text-white/90 mb-12 font-light"
                style={{ textShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                با تخفیف‌های اختصاصی ما، هر خریدت تجربه‌ای خاص میشه! 
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block ml-2"
                >
                  🎁
                </motion.span>
              </motion.p>

              {/* 3D Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col md:flex-row gap-6 justify-center items-center"
              >
                {/* Active Businesses Card */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                      <Store className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">کسب‌وکارهای فعال</p>
                      <p className="text-3xl font-bold text-white">{stats.active_businesses}</p>
                    </div>
                  </div>
                  <Progress value={(stats.active_businesses / 100) * 100} className="h-3 bg-white/20" />
                  <p className="text-xs text-white/60 mt-2 text-right">هدف: ۱۰۰ کسب‌وکار فعال</p>
                </motion.div>

                {/* Users Card */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">کاربران فعال</p>
                      <p className="text-3xl font-bold text-white">{animatedUsers.toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-emerald-300">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">در حال رشد...</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
                >
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-24 fill-background">
              <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* Stats Counter Section - Enhanced */}
        <section className="py-20 relative bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-3xl mx-auto"
            >
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-l from-sky-400/20 to-blue-500/20 blur-3xl" />
              
              <Card className="relative bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-950/50 dark:to-blue-900/30 border-sky-200 dark:border-sky-800 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-transparent to-blue-400/10" />
                <CardContent className="p-10 md:p-14 text-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl mb-8 shadow-lg"
                    style={{ boxShadow: "0 20px 40px rgba(56, 189, 248, 0.3)" }}
                  >
                    <Users className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="text-7xl md:text-9xl font-black bg-gradient-to-l from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {animatedUsers.toLocaleString('fa-IR')}
                  </motion.div>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </motion.span>
                    نفر تا الان از تخفیف‌های ویژه استفاده کردند
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Businesses Grid - Enhanced 3D Cards */}
        <section className="py-20 bg-gradient-to-b from-background via-sky-50/50 dark:via-sky-950/20 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 rounded-full px-6 py-2 mb-6"
              >
                <Store className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span className="text-sky-700 dark:text-sky-300 font-medium">همکاران ما</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-l from-sky-500 to-blue-600 bg-clip-text text-transparent">
                کسب‌وکارهای همکار
              </h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                از تخفیف‌های ویژه در بهترین کسب‌وکارها بهره‌مند شوید
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 bg-gradient-to-br from-sky-100 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/10 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businesses.map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -12, rotateY: 5, scale: 1.02 }}
                    className="group"
                    style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                  >
                    <Card className="h-full bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-900 dark:to-sky-950/30 border-sky-100 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-2xl group-hover:shadow-sky-200/50 dark:group-hover:shadow-sky-900/30">
                      <CardContent className="p-8 relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-blue-500/0 group-hover:from-sky-400/10 group-hover:to-blue-500/10 transition-all duration-500" />
                        
                        {/* Discount Badge */}
                        {business.discount_percent && (
                          <motion.div
                            initial={{ rotate: -12, scale: 0 }}
                            animate={{ rotate: -12, scale: 1 }}
                            whileHover={{ scale: 1.1, rotate: -6 }}
                            className="absolute top-4 left-4 bg-gradient-to-l from-rose-500 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg"
                            style={{ boxShadow: "0 8px 20px rgba(251, 113, 133, 0.4)" }}
                          >
                            {business.discount_percent}% تخفیف
                          </motion.div>
                        )}

                        {/* Business Logo/Icon */}
                        <motion.div 
                          whileHover={{ scale: 1.1, rotateZ: 5 }}
                          className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg transition-all duration-300"
                          style={{ boxShadow: "0 10px 30px rgba(56, 189, 248, 0.3)" }}
                        >
                          {business.logo_url ? (
                            <img src={business.logo_url} alt={business.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <span className="text-4xl">
                              {categoryIcons[business.category || ''] || '🏪'}
                            </span>
                          )}
                        </motion.div>

                        {/* Business Info */}
                        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {business.name}
                        </h3>
                        
                        {business.category && (
                          <Badge variant="secondary" className="mb-4 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
                            {business.category}
                          </Badge>
                        )}
                        
                        <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                          {business.description}
                        </p>

                        {/* Get Discount Button */}
                        <Button
                          onClick={() => handleGetDiscount(business)}
                          className="w-full bg-gradient-to-l from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg font-bold rounded-2xl"
                          style={{ boxShadow: "0 8px 25px rgba(56, 189, 248, 0.3)" }}
                        >
                          <Gift className="w-5 h-5 ml-2" />
                          دریافت تخفیف
                          <ChevronLeft className="w-5 h-5 mr-2 group-hover:translate-x-[-6px] transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section - 3D Cards */}
        <section className="py-20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/50 via-blue-50/30 to-background dark:from-sky-950/30 dark:via-blue-950/20 dark:to-background" />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-full px-6 py-2 mb-6"
              >
                <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-300 font-medium">مزایای VIP</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-l from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                مزایای عضویت در باشگاه
              </h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                با عضویت در باشگاه مشتریان از امکانات ویژه بهره‌مند شوید
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -15, scale: 1.05, rotateY: 10 }}
                  style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                >
                  <Card className="h-full bg-white dark:bg-slate-900 border-border/50 hover:border-sky-300 dark:hover:border-sky-700 transition-all text-center shadow-xl hover:shadow-2xl overflow-hidden">
                    <CardContent className="p-8 relative">
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-br ${benefit.color} transition-opacity duration-500`} />
                      
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                        style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}
                      >
                        <benefit.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="font-bold text-xl mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Form Section - Enhanced */}
        <section className="py-20 relative overflow-hidden">
          {/* 3D Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px"
            }} />
          </div>
          
          {/* Floating elements */}
          <FloatingElement delay={0} className="absolute top-10 right-10 opacity-30">
            <Heart className="w-16 h-16 text-white" />
          </FloatingElement>
          <FloatingElement delay={1} className="absolute bottom-10 left-10 opacity-30">
            <Zap className="w-20 h-20 text-white" />
          </FloatingElement>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-10">
                  <div className="text-center mb-10">
                    <motion.div
                      animate={{ y: [0, -10, 0], rotateY: [0, 360, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl mb-6 shadow-lg"
                      style={{ boxShadow: "0 15px 40px rgba(56, 189, 248, 0.4)" }}
                    >
                      <Crown className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black mb-3 bg-gradient-to-l from-sky-500 to-blue-600 bg-clip-text text-transparent">
                      همین الان عضو شو!
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      از تخفیف‌های اختصاصی بهره‌مند شوید
                    </p>
                  </div>

                  <form onSubmit={handleJoinClub} className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="ایمیل شما"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-12 py-7 text-lg bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 focus:border-sky-400 rounded-2xl"
                        dir="ltr"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full py-7 text-xl font-bold bg-gradient-to-l from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-2xl shadow-lg"
                      style={{ boxShadow: "0 10px 30px rgba(56, 189, 248, 0.4)" }}
                    >
                      <Sparkles className="w-6 h-6 ml-3" />
                      عضو باشگاه شو
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    با عضویت، شرایط و قوانین را می‌پذیرید
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CustomerClub;
