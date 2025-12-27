import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Send, 
  Loader2, 
  Plus, 
  Edit3, 
  Trash2, 
  Image,
  Save,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  client_name: string;
}

const SiteManager = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "سلام! من دستیار هوشمند مدیریت سایت هستم. می‌تونم کمکت کنم:\n• صفحه جدید بسازی\n• نمونه کار اضافه کنی\n• محتوای سایت رو ویرایش کنی\n\nچطور می‌تونم کمکت کنم؟" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchPortfolioItems = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order");
    
    if (data) {
      setPortfolioItems(data as PortfolioItem[]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-studio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "site_management",
            prompt: userMessage,
            messages: [...messages, { role: "user", content: userMessage }],
          }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        
        // Handle AI commands
        try {
          const parsed = JSON.parse(data.response);
          if (parsed.action === "add_portfolio") {
            setShowPortfolio(true);
            toast.info("برای اضافه کردن نمونه کار، از فرم زیر استفاده کنید");
          }
        } catch {
          // Not a JSON response, just display it
        }
      } else {
        throw new Error(data.error || "خطا در دریافت پاسخ");
      }
    } catch (error: any) {
      toast.error(error.message);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioItem = async (item: { title: string; description?: string; image_url?: string; category?: string; client_name?: string }) => {
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .insert([item]);

      if (error) throw error;
      
      toast.success("نمونه کار با موفقیت اضافه شد");
      fetchPortfolioItems();
      setEditingItem(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updatePortfolioItem = async (id: string, updates: Partial<PortfolioItem>) => {
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      toast.success("نمونه کار با موفقیت ویرایش شد");
      fetchPortfolioItems();
      setEditingItem(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deletePortfolioItem = async (id: string) => {
    if (!confirm("آیا از حذف این نمونه کار مطمئن هستید؟")) return;
    
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("نمونه کار حذف شد");
      fetchPortfolioItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">مدیریت هوشمند سایت</h2>
            <p className="text-muted-foreground text-sm">با دستور متنی سایت را مدیریت کنید</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowPortfolio(!showPortfolio)}
        >
          {showPortfolio ? "چت" : "نمونه کارها"}
        </Button>
      </div>

      {showPortfolio ? (
        /* Portfolio Manager */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">مدیریت نمونه کارها</h3>
            <Button 
              size="sm"
              onClick={() => setEditingItem({
                id: "",
                title: "",
                description: "",
                image_url: "",
                category: "",
                client_name: ""
              })}
            >
              <Plus className="w-4 h-4 ml-1" />
              افزودن
            </Button>
          </div>

          {/* Edit Form */}
          <AnimatePresence>
            {editingItem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {editingItem.id ? "ویرایش نمونه کار" : "افزودن نمونه کار جدید"}
                  </h4>
                  <Button size="sm" variant="ghost" onClick={() => setEditingItem(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="عنوان پروژه"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  />
                  <Input
                    placeholder="نام مشتری"
                    value={editingItem.client_name}
                    onChange={(e) => setEditingItem({...editingItem, client_name: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="دسته‌بندی (مثال: طراحی سایت)"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                />
                <Input
                  placeholder="آدرس تصویر"
                  value={editingItem.image_url}
                  onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                />
                <Textarea
                  placeholder="توضیحات پروژه"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                />
                
                <Button 
                  className="w-full"
                  onClick={() => {
                if (editingItem.id) {
                      updatePortfolioItem(editingItem.id, editingItem);
                    } else {
                      addPortfolioItem({
                        title: editingItem.title || "",
                        description: editingItem.description || "",
                        image_url: editingItem.image_url || "",
                        category: editingItem.category || "",
                        client_name: editingItem.client_name || ""
                      });
                    }
                  }}
                >
                  <Save className="w-4 h-4 ml-1" />
                  ذخیره
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portfolio List */}
          <div className="grid gap-4">
            {portfolioItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="glass rounded-xl p-4 flex items-center gap-4"
              >
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.client_name}</p>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deletePortfolioItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {portfolioItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                هنوز نمونه کاری اضافه نشده
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div className="glass rounded-xl overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {msg.content}
                  </pre>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <div className="bg-secondary rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="دستور خود را بنویسید..."
                className="flex-1"
                dir="rtl"
              />
              <Button onClick={sendMessage} disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManager;
