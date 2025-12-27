import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  ChevronLeft
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
      // Fetch businesses
      const { data: businessData, error: businessError } = await supabase
        .from('club_businesses')
        .select('*')
        .eq('is_active', true);

      if (businessError) throw businessError;
      setBusinesses(businessData || []);

      // Fetch stats
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
    // Track usage
    await supabase.from('club_discount_usage').insert({
      business_id: business.id
    });

    toast({
      title: `تخفیف ${business.name} 🎁`,
      description: `کد تخفیف: AZMA${business.discount_percent}OFF`
    });
  };

  const benefits = [
    { icon: Percent, title: "تخفیف‌های اختصاصی", description: "تا ۳۰٪ تخفیف در کسب‌وکارهای منتخب" },
    { icon: Star, title: "امتیاز برای خرید بعدی", description: "با هر خرید امتیاز کسب کنید" },
    { icon: Mail, title: "خبرنامه ویژه", description: "اولین نفری باشید که از تخفیف‌ها باخبر می‌شوید" },
    { icon: Crown, title: "اولویت VIP", description: "دسترسی زودتر به پیشنهادات خاص" }
  ];

  const categoryIcons: Record<string, string> = {
    'رستوران': '🍽️',
    'کافه': '☕',
    'زیبایی': '💄',
    'ورزشی': '🏋️',
    'فروشگاه': '🛒',
    'آموزش': '📚'
  };

  return (
    <>
      <Helmet>
        <title>باشگاه مشتریان ویژه | Azma Marketing</title>
        <meta name="description" content="با تخفیف‌های اختصاصی Azma Marketing، هر خریدت تجربه‌ای خاص میشه! عضو باشگاه مشتریان شوید." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background" dir="rtl">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Logo & Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-6"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Azma Marketing</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-l from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                باشگاه مشتریان ویژه
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                با تخفیف‌های اختصاصی ما، هر خریدت تجربه‌ای خاص میشه! 🎁
              </p>

              {/* Progress Bar - Active Businesses */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    کسب‌وکارهای فعال
                  </span>
                  <span className="text-primary font-bold">{stats.active_businesses}</span>
                </div>
                <Progress value={(stats.active_businesses / 100) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  هدف: ۱۰۰ کسب‌وکار فعال
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-primary/10 blur-3xl" />
              <Card className="relative bg-card/80 backdrop-blur-xl border-primary/20 overflow-hidden">
                <CardContent className="p-8 md:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6"
                  >
                    <Users className="w-10 h-10 text-primary" />
                  </motion.div>
                  
                  <motion.div
                    className="text-6xl md:text-8xl font-bold text-primary mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {animatedUsers.toLocaleString('fa-IR')}
                  </motion.div>
                  
                  <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    نفر تا الان از تخفیف‌های ویژه استفاده کردند
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Businesses Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                کسب‌وکارهای همکار
              </h2>
              <p className="text-muted-foreground text-lg">
                از تخفیف‌های ویژه در بهترین کسب‌وکارها بهره‌مند شوید
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                      <CardContent className="p-6 relative">
                        {/* Discount Badge */}
                        {business.discount_percent && (
                          <motion.div
                            initial={{ rotate: -12, scale: 0 }}
                            animate={{ rotate: -12, scale: 1 }}
                            className="absolute top-4 left-4 bg-gradient-to-l from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                          >
                            {business.discount_percent}% تخفیف
                          </motion.div>
                        )}

                        {/* Business Logo/Icon */}
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          {business.logo_url ? (
                            <img src={business.logo_url} alt={business.name} className="w-10 h-10 object-contain" />
                          ) : (
                            <span className="text-3xl">
                              {categoryIcons[business.category || ''] || '🏪'}
                            </span>
                          )}
                        </div>

                        {/* Business Info */}
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {business.name}
                        </h3>
                        
                        {business.category && (
                          <Badge variant="secondary" className="mb-3">
                            {business.category}
                          </Badge>
                        )}
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {business.description}
                        </p>

                        {/* Get Discount Button */}
                        <Button
                          onClick={() => handleGetDiscount(business)}
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                          variant="outline"
                        >
                          <Gift className="w-4 h-4 ml-2" />
                          دریافت تخفیف
                          <ChevronLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                مزایای عضویت در باشگاه
              </h2>
              <p className="text-muted-foreground text-lg">
                با عضویت در باشگاه مشتریان از امکانات ویژه بهره‌مند شوید
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-full bg-gradient-to-b from-card to-card/50 border-border/50 hover:border-primary/30 transition-all text-center">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <benefit.icon className="w-8 h-8 text-primary" />
                      </motion.div>
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Form Section */}
        <section className="py-16 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <Card className="bg-card/90 backdrop-blur-xl border-primary/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4"
                    >
                      <Crown className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">عضو باشگاه شوید</h2>
                    <p className="text-muted-foreground">
                      با ثبت‌نام، از تمام تخفیف‌ها و پیشنهادات ویژه بهره‌مند شوید
                    </p>
                  </div>

                  <form onSubmit={handleJoinClub} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="ایمیل یا شماره موبایل"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 h-12 text-right"
                        dir="ltr"
                      />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full h-12 text-lg">
                      <Sparkles className="w-5 h-5 ml-2" />
                      عضو شو
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    با عضویت، شرایط و قوانین باشگاه را می‌پذیرید
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
