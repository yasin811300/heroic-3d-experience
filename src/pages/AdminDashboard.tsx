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
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  Bot,
  FileEdit,
  BookOpen,
  ShoppingBag,
  Image,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AIStudio from "@/components/admin/AIStudio";
import SiteManager from "@/components/admin/SiteManager";
import ContentEditor from "@/components/admin/ContentEditor";
import BlogManager from "@/components/admin/BlogManager";
import UsersManager from "@/components/admin/UsersManager";
import OrdersManager from "@/components/admin/OrdersManager";
import PortfolioManager from "@/components/admin/PortfolioManager";
import DashboardStats from "@/components/admin/DashboardStats";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await (supabase as any)
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

  const menuItems = [
    { icon: LayoutDashboard, label: "داشبورد", id: "dashboard" },
    { icon: Users, label: "مدیریت کاربران", id: "users" },
    { icon: ShoppingBag, label: "مدیریت سفارشات", id: "orders" },
    { icon: BookOpen, label: "مدیریت بلاگ", id: "blog-manager" },
    { icon: Image, label: "نمونه‌کارها", id: "portfolio" },
    { icon: Sparkles, label: "استودیو AI", id: "ai-studio" },
    { icon: Bot, label: "مدیریت سایت", id: "site-manager" },
    { icon: FileEdit, label: "ویرایش محتوا", id: "content-editor" },
    { icon: Settings, label: "تنظیمات", id: "settings" },
  ];

  const getSectionTitle = () => {
    const item = menuItems.find(m => m.id === activeSection);
    return item?.label || "داشبورد";
  };

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                </div>
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

          <nav className="p-4 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ x: -5 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-border bg-card">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">خروج از حساب</span>}
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
                <h1 className="text-xl font-bold">{getSectionTitle()}</h1>
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
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">مدیر سیستم</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {activeSection === "dashboard" && <DashboardStats />}
            {activeSection === "users" && <UsersManager />}
            {activeSection === "orders" && <OrdersManager />}
            {activeSection === "blog-manager" && <BlogManager />}
            {activeSection === "portfolio" && <PortfolioManager />}
            {activeSection === "ai-studio" && <AIStudio />}
            {activeSection === "site-manager" && <SiteManager />}
            {activeSection === "content-editor" && <ContentEditor />}
            {activeSection === "settings" && (
              <div className="glass rounded-2xl p-8 text-center">
                <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">تنظیمات</h3>
                <p className="text-muted-foreground">بخش تنظیمات در حال توسعه است...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
