import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  TrendingUp,
  MessageSquare,
  Image,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        toast.error("دسترسی غیرمجاز");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("با موفقیت خارج شدید");
    navigate("/admin/login");
  };

  const stats = [
    { label: "کاربران", value: "۱,۲۳۴", change: "+۱۲%", icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "درخواست‌ها", value: "۵۶", change: "+۸%", icon: FileText, color: "from-green-500 to-green-600" },
    { label: "بازدید", value: "۴۵,۶۷۸", change: "+۲۴%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { label: "پیام‌ها", value: "۸۹", change: "+۱۵%", icon: MessageSquare, color: "from-orange-500 to-orange-600" },
  ];

  const menuItems = [
    { icon: Home, label: "داشبورد", active: true },
    { icon: Users, label: "کاربران" },
    { icon: FileText, label: "درخواست‌ها" },
    { icon: Image, label: "گالری" },
    { icon: MessageSquare, label: "پیام‌ها" },
    { icon: Settings, label: "تنظیمات" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>پنل مدیریت | آژمان</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex" dir="rtl">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="fixed right-0 top-0 h-full bg-card border-l border-border z-50 overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between border-b border-border">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <img src="/logo.webp" alt="آژمان" className="w-10 h-10" />
                <span className="font-bold text-lg">پنل ادمین</span>
              </motion.div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ x: -5 }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>خروج</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main
          className="flex-1 transition-all duration-300"
          style={{ marginRight: sidebarOpen ? 280 : 80 }}
        >
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">داشبورد</h1>
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">خلاصه وضعیت</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو..."
                    className="pr-10 w-64 bg-secondary/50"
                  />
                </div>

                <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                </button>

                <div className="flex items-center gap-3 pr-4 border-r border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">ادمین</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-x-8 -translate-y-8`} />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-green-500 text-sm mt-2">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold mb-6">فعالیت‌های اخیر</h2>
              
              <div className="space-y-4">
                {[
                  { title: "کاربر جدید ثبت‌نام کرد", time: "۵ دقیقه پیش", type: "user" },
                  { title: "درخواست طراحی سایت ثبت شد", time: "۱۵ دقیقه پیش", type: "request" },
                  { title: "پیام جدید از مشتری", time: "۱ ساعت پیش", type: "message" },
                  { title: "پروژه جدید به گالری اضافه شد", time: "۲ ساعت پیش", type: "gallery" },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === "user" && <Users className="w-5 h-5 text-primary" />}
                      {activity.type === "request" && <FileText className="w-5 h-5 text-green-500" />}
                      {activity.type === "message" && <MessageSquare className="w-5 h-5 text-blue-500" />}
                      {activity.type === "gallery" && <Image className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
