import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, FileText, ShoppingBag, Image, TrendingUp, 
  Eye, MessageSquare, DollarSign, BarChart3, PieChart
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart as RechartsPie, Pie, Cell
} from "recharts";

interface Stats {
  usersCount: number;
  postsCount: number;
  ordersCount: number;
  portfolioCount: number;
  publishedPosts: number;
  completedOrders: number;
  totalRevenue: number;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#22c55e", "#eab308"];

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    usersCount: 0,
    postsCount: 0,
    ordersCount: 0,
    portfolioCount: 0,
    publishedPosts: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all counts in parallel
      const [
        { count: usersCount },
        { data: posts },
        { data: orders },
        { count: portfolioCount }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id, is_published"),
        supabase.from("orders").select("id, status, total_amount, created_at"),
        supabase.from("portfolio_items").select("*", { count: "exact", head: true })
      ]);

      const publishedPosts = posts?.filter(p => p.is_published).length || 0;
      const completedOrders = orders?.filter(o => o.status === "completed").length || 0;
      const totalRevenue = orders?.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      setStats({
        usersCount: usersCount || 0,
        postsCount: posts?.length || 0,
        ordersCount: orders?.length || 0,
        portfolioCount: portfolioCount || 0,
        publishedPosts,
        completedOrders,
        totalRevenue
      });

      // Process orders by month for chart
      const monthlyData: { [key: string]: number } = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString("fa-IR", { month: "short" });
        monthlyData[key] = 0;
      }

      orders?.forEach(order => {
        const date = new Date(order.created_at);
        const key = date.toLocaleDateString("fa-IR", { month: "short" });
        if (monthlyData[key] !== undefined) {
          monthlyData[key]++;
        }
      });

      setOrdersByMonth(Object.entries(monthlyData).map(([name, orders]) => ({ name, orders })));

      // Orders by status for pie chart
      const statusCounts: { [key: string]: number } = {
        "در انتظار": 0,
        "در حال پردازش": 0,
        "تکمیل شده": 0,
        "لغو شده": 0
      };

      orders?.forEach(order => {
        switch (order.status) {
          case "pending": statusCounts["در انتظار"]++; break;
          case "processing": statusCounts["در حال پردازش"]++; break;
          case "completed": statusCounts["تکمیل شده"]++; break;
          case "cancelled": statusCounts["لغو شده"]++; break;
          default: statusCounts["در انتظار"]++;
        }
      });

      setOrdersByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const statCards = [
    { 
      label: "کاربران", 
      value: formatNumber(stats.usersCount), 
      icon: Users, 
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "مقالات", 
      value: formatNumber(stats.postsCount), 
      subValue: `${formatNumber(stats.publishedPosts)} منتشر شده`,
      icon: FileText, 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10"
    },
    { 
      label: "سفارشات", 
      value: formatNumber(stats.ordersCount), 
      subValue: `${formatNumber(stats.completedOrders)} تکمیل شده`,
      icon: ShoppingBag, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10"
    },
    { 
      label: "نمونه‌کارها", 
      value: formatNumber(stats.portfolioCount), 
      icon: Image, 
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10"
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-16 bg-secondary/50 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
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
                {stat.subValue && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">درآمد کل</p>
            <p className="text-4xl font-bold">{formatNumber(stats.totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">تومان</p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-bold">سفارشات ماهانه</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersByMonth}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    direction: "rtl"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorOrders)" 
                  strokeWidth={2}
                  name="سفارشات"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-bold">وضعیت سفارشات</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    direction: "rtl"
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {ordersByStatus.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          خلاصه عملکرد
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-secondary/30">
            <p className="text-3xl font-bold text-primary">{formatNumber(stats.publishedPosts)}</p>
            <p className="text-sm text-muted-foreground mt-1">مقاله منتشر شده</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/30">
            <p className="text-3xl font-bold text-green-500">{formatNumber(stats.completedOrders)}</p>
            <p className="text-sm text-muted-foreground mt-1">سفارش تکمیل شده</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/30">
            <p className="text-3xl font-bold text-accent">{formatNumber(stats.portfolioCount)}</p>
            <p className="text-sm text-muted-foreground mt-1">نمونه‌کار فعال</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
