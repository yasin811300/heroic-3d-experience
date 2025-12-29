import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  User as UserIcon, 
  Settings, 
  FileText, 
  LogOut, 
  Edit3, 
  Save,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Crown,
  Gift,
  Star,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Heart,
  Bell,
  Shield
} from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  status: string | null;
  total_amount: number | null;
  created_at: string;
  items: any;
}

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10)
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFormData({
          full_name: profileRes.data.full_name || "",
          phone: profileRes.data.phone || ""
        });
      }

      setOrders(ordersRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, full_name: formData.full_name, phone: formData.phone } : null);
      setIsEditing(false);
      toast({ title: "پروفایل به‌روزرسانی شد", description: "اطلاعات شما با موفقیت ذخیره شد" });
    } catch (error: any) {
      toast({ title: "خطا", description: "مشکلی در ذخیره اطلاعات پیش آمد", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatPrice = (amount: number | null) => {
    if (!amount) return "۰";
    return amount.toLocaleString("fa-IR");
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-amber-500";
      case "processing": return "bg-blue-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "completed": return "تکمیل شده";
      case "pending": return "در انتظار";
      case "processing": return "در حال پردازش";
      case "cancelled": return "لغو شده";
      default: return status || "نامشخص";
    }
  };

  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalSpent = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const memberDays = profile?.created_at ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const loyaltyPoints = completedOrders * 50 + memberDays;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-6xl mx-auto">
          {/* Welcome Header with Gradient */}
          <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white/30 shadow-xl">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {profile?.full_name || "کاربر عزیز"}
                    </h1>
                    <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                      <Crown className="w-3 h-3 ml-1" />
                      VIP
                    </Badge>
                  </div>
                  <p className="text-white/80">{user?.email}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={handleLogout} className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0">
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: ShoppingBag, label: "سفارشات", value: orders.length.toString(), color: "from-blue-500 to-cyan-500" },
              { icon: CheckCircle, label: "تکمیل شده", value: completedOrders.toString(), color: "from-green-500 to-emerald-500" },
              { icon: Wallet, label: "مجموع خرید", value: `${formatPrice(totalSpent)} ت`, color: "from-purple-500 to-pink-500" },
              { icon: Star, label: "امتیاز", value: loyaltyPoints.toString(), color: "from-amber-500 to-orange-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Loyalty Progress */}
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">سطح وفاداری شما</h3>
                    <p className="text-sm text-muted-foreground">تا سطح بعدی: {Math.max(0, 500 - loyaltyPoints)} امتیاز</p>
                  </div>
                </div>
                <Badge className="bg-amber-500 text-white">{loyaltyPoints >= 500 ? "طلایی" : loyaltyPoints >= 200 ? "نقره‌ای" : "برنزی"}</Badge>
              </div>
              <Progress value={Math.min((loyaltyPoints / 500) * 100, 100)} className="h-3 bg-amber-200 dark:bg-amber-900" />
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-card border w-full justify-start p-1 h-auto flex-wrap shadow-lg">
              <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShoppingBag className="w-4 h-4" />
                سفارشات
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UserIcon className="w-4 h-4" />
                پروفایل
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="w-4 h-4" />
                تنظیمات
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      سفارشات من
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
                        <p className="text-muted-foreground mb-4">با ثبت اولین سفارش، امتیاز کسب کنید!</p>
                        <Button onClick={() => navigate("/services")}>مشاهده خدمات</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-5 rounded-xl border bg-card hover:border-primary/30 transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                                <div>
                                  <p className="font-semibold">سفارش #{order.id.slice(0, 8)}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant="secondary">{getStatusText(order.status)}</Badge>
                                <span className="font-bold text-primary">{formatPrice(order.total_amount)} تومان</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-primary" />
                      اطلاعات پروفایل
                    </CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit3 className="w-4 h-4" />
                        ویرایش
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>انصراف</Button>
                        <Button size="sm" onClick={handleSaveProfile} disabled={saving} className="gap-2">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          ذخیره
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          نام و نام خانوادگی
                        </Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          disabled={!isEditing}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          شماره تماس
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="bg-background"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          ایمیل
                        </Label>
                        <Input value={user?.email || ""} disabled className="bg-muted" dir="ltr" />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          تاریخ عضویت
                        </Label>
                        <Input value={profile?.created_at ? formatDate(profile.created_at) : "-"} disabled className="bg-muted" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      تنظیمات حساب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-5 rounded-xl bg-secondary/50 border">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">تغییر رمز عبور</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        برای تغییر رمز عبور، ایمیل بازیابی ارسال می‌شود.
                      </p>
                      <Button variant="outline" onClick={async () => {
                        if (user?.email) {
                          const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                            redirectTo: `${window.location.origin}/auth`
                          });
                          if (!error) {
                            toast({ title: "ایمیل ارسال شد", description: "لینک بازیابی به ایمیل شما ارسال شد" });
                          }
                        }
                      }}>
                        ارسال ایمیل بازیابی
                      </Button>
                    </div>

                    <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <h3 className="font-semibold text-destructive">حذف حساب کاربری</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        با حذف حساب، تمام اطلاعات شما به طور دائم حذف خواهد شد.
                      </p>
                      <Button variant="destructive" disabled>
                        حذف حساب (غیرفعال)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

// Trophy icon component
const Trophy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default UserDashboard;
