import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, Search, Clock, CheckCircle, XCircle,
  Eye, Calendar, DollarSign, Package
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  user_id: string | null;
  items: any;
  total_amount: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("وضعیت سفارش بروزرسانی شد");
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("خطا در بروزرسانی وضعیت");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateString));
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "۰";
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />تکمیل شده</span>;
      case "processing":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 flex items-center gap-1"><Clock className="w-3 h-3" />در حال پردازش</span>;
      case "cancelled":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" />لغو شده</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><Clock className="w-3 h-3" />در انتظار</span>;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = orders.filter(o => o.status === "pending" || !o.status).length;
  const processingCount = orders.filter(o => o.status === "processing").length;
  const completedCount = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            مدیریت سفارشات
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} سفارش ثبت شده
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی شماره سفارش..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">در انتظار</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{processingCount}</p>
            <p className="text-sm text-muted-foreground">در حال پردازش</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-muted-foreground">تکمیل شده</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">درآمد کل (تومان)</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-secondary/50 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary/50 rounded w-1/3" />
                  <div className="h-3 bg-secondary/50 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">سفارشی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              {/* Order Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground font-mono text-sm">
                  #{order.id.slice(0, 8)}
                </h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(order.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {formatPrice(order.total_amount)} تومان
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              {getStatusBadge(order.status)}

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <select
                  value={order.status || "pending"}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="bg-secondary rounded-lg px-3 py-1 text-sm border-none outline-none"
                >
                  <option value="pending">در انتظار</option>
                  <option value="processing">در حال پردازش</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>جزئیات سفارش</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">شماره سفارش:</span>
                <span className="font-mono">{selectedOrder.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">تاریخ:</span>
                <span>{formatDate(selectedOrder.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">مبلغ کل:</span>
                <span className="font-bold">{formatPrice(selectedOrder.total_amount)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">وضعیت:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              {selectedOrder.items && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">آیتم‌ها:</p>
                  <pre className="text-xs bg-secondary/50 p-3 rounded-lg overflow-auto max-h-40">
                    {JSON.stringify(selectedOrder.items, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManager;
