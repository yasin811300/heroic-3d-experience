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
  Loader2
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

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
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

      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        phone: formData.phone
      } : null);
      
      setIsEditing(false);
      toast({
        title: "پروفایل به‌روزرسانی شد",
        description: "اطلاعات شما با موفقیت ذخیره شد",
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "مشکلی در ذخیره اطلاعات پیش آمد",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Sample requests data (in a real app, this would come from database)
  const sampleRequests = [
    {
      id: 1,
      title: "طراحی سایت فروشگاهی",
      status: "در حال انجام",
      statusType: "progress",
      date: "۱۴۰۳/۱۰/۰۵",
      description: "طراحی و توسعه سایت فروشگاهی با امکانات کامل"
    },
    {
      id: 2,
      title: "سئو و بهینه‌سازی",
      status: "تکمیل شده",
      statusType: "completed",
      date: "۱۴۰۳/۰۹/۲۰",
      description: "بهینه‌سازی سایت برای موتورهای جستجو"
    },
    {
      id: 3,
      title: "طراحی لوگو",
      status: "در انتظار تأیید",
      statusType: "pending",
      date: "۱۴۰۳/۱۰/۰۱",
      description: "طراحی لوگوی حرفه‌ای برای برند"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Welcome Header */}
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  خوش آمدید، {profile?.full_name || "کاربر عزیز"}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">۳</p>
                    <p className="text-sm text-muted-foreground">کل درخواست‌ها</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">۱</p>
                    <p className="text-sm text-muted-foreground">تکمیل شده</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">۲</p>
                    <p className="text-sm text-muted-foreground">در حال انجام</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card border w-full justify-start p-1 h-auto flex-wrap">
              <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UserIcon className="w-4 h-4" />
                پروفایل
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4" />
                درخواست‌ها
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="w-4 h-4" />
                تنظیمات
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
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
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          انصراف
                        </Button>
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
                        <Input
                          value={user?.email || ""}
                          disabled
                          className="bg-muted"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          تاریخ عضویت
                        </Label>
                        <Input
                          value={profile?.created_at ? formatDate(profile.created_at) : "-"}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      درخواست‌های من
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl border bg-card hover:border-primary/30 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-foreground">{request.title}</h3>
                                <Badge
                                  variant={
                                    request.statusType === "completed" ? "default" :
                                    request.statusType === "progress" ? "secondary" : "outline"
                                  }
                                  className={
                                    request.statusType === "completed" ? "bg-green-500 hover:bg-green-600" :
                                    request.statusType === "progress" ? "bg-primary" : ""
                                  }
                                >
                                  {request.statusType === "completed" && <CheckCircle className="w-3 h-3 ml-1" />}
                                  {request.statusType === "progress" && <Clock className="w-3 h-3 ml-1" />}
                                  {request.statusType === "pending" && <AlertCircle className="w-3 h-3 ml-1" />}
                                  {request.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{request.description}</p>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {request.date}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      تنظیمات حساب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-muted/50 border">
                      <h3 className="font-semibold mb-2">تغییر رمز عبور</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        برای تغییر رمز عبور، ایمیل بازیابی به آدرس ایمیل شما ارسال خواهد شد.
                      </p>
                      <Button variant="outline" onClick={async () => {
                        if (user?.email) {
                          const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                            redirectTo: `${window.location.origin}/auth`
                          });
                          if (!error) {
                            toast({
                              title: "ایمیل ارسال شد",
                              description: "لینک بازیابی رمز عبور به ایمیل شما ارسال شد",
                            });
                          }
                        }
                      }}>
                        ارسال ایمیل بازیابی
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <h3 className="font-semibold mb-2 text-destructive">حذف حساب کاربری</h3>
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

export default UserDashboard;
