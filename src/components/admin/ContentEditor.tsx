import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileEdit, 
  Save, 
  Plus, 
  Trash2, 
  Image,
  Type,
  RefreshCw,
  Search,
  X,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEFAULT_PRICING_PLANS = [
  { name: "استارتاپ", icon: "Zap", price: "۲,۹۰۰,۰۰۰", description: "برای کسب‌وکارهای تازه‌کار", features: ["طراحی لوگو", "۵ صفحه سایت", "هاست و دامنه یکساله", "پشتیبانی ۳ ماهه"], popular: false, gradient: "from-blue-500 to-cyan-400" },
  { name: "حرفه‌ای", icon: "Star", price: "۷,۹۰۰,۰۰۰", description: "محبوب‌ترین انتخاب", features: ["هویت بصری کامل", "سایت نامحدود صفحه", "سئو پایه", "مدیریت اینستا ۳ ماه", "پشتیبانی ۶ ماهه", "اپلیکیشن موبایل"], popular: true, gradient: "from-primary to-gold-light" },
  { name: "سازمانی", icon: "Crown", price: "۱۴,۹۰۰,۰۰۰", description: "برای برندهای بزرگ", features: ["همه امکانات حرفه‌ای", "سئو پیشرفته", "کمپین تبلیغاتی", "مشاور اختصاصی", "پشتیبانی ۱ ساله", "گزارش‌های ماهانه", "تولید محتوا"], popular: false, gradient: "from-purple-500 to-pink-500" },
];

interface EditableContent {
  id: string;
  page_name: string;
  section_key: string;
  content_type: string;
  content: string;
  image_url: string;
}

const ContentEditor = () => {
  const [contents, setContents] = useState<EditableContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<EditableContent> | null>(null);
  const [pricingPlans, setPricingPlans] = useState(DEFAULT_PRICING_PLANS);
  const [savingPricing, setSavingPricing] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("editable_content")
        .select("*")
        .order("page_name");

      if (error) throw error;
      setContents(data as EditableContent[] || []);
      const pricing = (data as EditableContent[] | null)?.find((item) => item.page_name === "home" && item.section_key === "pricing_plans");
      if (pricing?.content) {
        try {
          const parsed = JSON.parse(pricing.content);
          if (Array.isArray(parsed)) setPricingPlans(parsed);
        } catch {
          setPricingPlans(DEFAULT_PRICING_PLANS);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const savePricing = async () => {
    setSavingPricing(true);
    const payload = {
      page_name: "home",
      section_key: "pricing_plans",
      content_type: "json",
      content: JSON.stringify(pricingPlans),
      image_url: "",
    };
    const { error } = await supabase
      .from("editable_content")
      .upsert(payload, { onConflict: "page_name,section_key" });
    setSavingPricing(false);
    if (error) return toast.error(error.message);
    toast.success("تعرفه‌های صفحه اصلی ذخیره شد");
    fetchContents();
  };

  const saveContent = async (item: EditableContent) => {
    try {
      const { error } = await supabase
        .from("editable_content")
        .update({
          content: item.content,
          image_url: item.image_url,
        })
        .eq("id", item.id);

      if (error) throw error;
      
      toast.success("محتوا با موفقیت ذخیره شد");
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addContent = async () => {
    if (!newItem?.page_name || !newItem?.section_key) {
      toast.error("نام صفحه و بخش الزامی است");
      return;
    }

    try {
      const { error } = await supabase
        .from("editable_content")
        .insert([{
          page_name: newItem.page_name,
          section_key: newItem.section_key,
          content_type: newItem.content_type || "text",
          content: newItem.content || "",
          image_url: newItem.image_url || "",
        }]);

      if (error) throw error;
      
      toast.success("محتوای جدید اضافه شد");
      setNewItem(null);
      fetchContents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm("آیا از حذف این محتوا مطمئن هستید؟")) return;

    try {
      const { error } = await supabase
        .from("editable_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("محتوا حذف شد");
      fetchContents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredContents = contents.filter(
    (item) =>
      item.page_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedContents = filteredContents.reduce((acc, item) => {
    if (!acc[item.page_name]) {
      acc[item.page_name] = [];
    }
    acc[item.page_name].push(item);
    return acc;
  }, {} as Record<string, EditableContent[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <FileEdit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ویرایش محتوای سایت</h2>
            <p className="text-muted-foreground text-sm">متن‌ها و تصاویر سایت را ویرایش کنید</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchContents}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={() => setNewItem({ content_type: "text" })}>
            <Plus className="w-4 h-4 ml-1" />
            افزودن
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در صفحات و بخش‌ها..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="glass rounded-xl p-5 space-y-5" dir="rtl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-bold">تعرفه‌های صفحه اصلی</h3>
            <p className="text-sm text-muted-foreground">نام، قیمت، توضیح و امکانات هر بسته را مستقیم ویرایش کنید</p>
          </div>
          <Button onClick={savePricing} disabled={savingPricing}>
            {savingPricing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            ذخیره تعرفه‌ها
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan, planIndex) => (
            <div key={planIndex} className="rounded-xl border border-border p-4 space-y-3 bg-card/40">
              <Input value={plan.name} onChange={(e) => setPricingPlans((items) => items.map((item, i) => i === planIndex ? { ...item, name: e.target.value } : item))} placeholder="نام بسته" />
              <Input value={plan.price} onChange={(e) => setPricingPlans((items) => items.map((item, i) => i === planIndex ? { ...item, price: e.target.value } : item))} placeholder="قیمت" />
              <Textarea value={plan.description} onChange={(e) => setPricingPlans((items) => items.map((item, i) => i === planIndex ? { ...item, description: e.target.value } : item))} placeholder="توضیح" rows={2} />
              <Textarea
                value={plan.features.join("\n")}
                onChange={(e) => setPricingPlans((items) => items.map((item, i) => i === planIndex ? { ...item, features: e.target.value.split("\n").filter(Boolean) } : item))}
                placeholder="هر ویژگی در یک خط"
                rows={6}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={plan.popular} onChange={(e) => setPricingPlans((items) => items.map((item, i) => ({ ...item, popular: i === planIndex ? e.target.checked : e.target.checked ? false : item.popular })))} />
                نمایش به‌عنوان پرفروش‌ترین
              </label>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {newItem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">افزودن محتوای جدید</h3>
              <Button size="sm" variant="ghost" onClick={() => setNewItem(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="نام صفحه (مثال: home)"
                value={newItem.page_name || ""}
                onChange={(e) => setNewItem({...newItem, page_name: e.target.value})}
              />
              <Input
                placeholder="کلید بخش (مثال: hero_title)"
                value={newItem.section_key || ""}
                onChange={(e) => setNewItem({...newItem, section_key: e.target.value})}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newItem.content_type || "text"}
                onChange={(e) => setNewItem({...newItem, content_type: e.target.value})}
              >
                <option value="text">متن</option>
                <option value="image">تصویر</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
              </select>
            </div>
            
            {newItem.content_type === "image" ? (
              <Input
                placeholder="آدرس تصویر"
                value={newItem.image_url || ""}
                onChange={(e) => setNewItem({...newItem, image_url: e.target.value})}
              />
            ) : (
              <Textarea
                placeholder="محتوا"
                value={newItem.content || ""}
                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
              />
            )}
            
            <Button onClick={addContent} className="w-full">
              <Save className="w-4 h-4 ml-1" />
              ذخیره
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedContents).map(([pageName, items]) => (
            <motion.div
              key={pageName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                <h3 className="font-medium">صفحه: {pageName}</h3>
              </div>
              
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {item.content_type === "image" ? (
                            <Image className="w-4 h-4 text-blue-500" />
                          ) : item.content_type === "json" ? (
                            <Code className="w-4 h-4 text-orange-500" />
                          ) : (
                            <Type className="w-4 h-4 text-green-500" />
                          )}
                          <span className="font-medium text-sm">{item.section_key}</span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                            {item.content_type}
                          </span>
                        </div>
                        
                        {editingId === item.id ? (
                          item.content_type === "image" ? (
                            <Input
                              value={item.image_url}
                              onChange={(e) => {
                                const updated = contents.map(c => 
                                  c.id === item.id ? {...c, image_url: e.target.value} : c
                                );
                                setContents(updated);
                              }}
                              placeholder="آدرس تصویر"
                            />
                          ) : (
                            <Textarea
                              value={item.content}
                              onChange={(e) => {
                                const updated = contents.map(c => 
                                  c.id === item.id ? {...c, content: e.target.value} : c
                                );
                                setContents(updated);
                              }}
                              className="min-h-[100px]"
                            />
                          )
                        ) : (
                          item.content_type === "image" ? (
                            item.image_url && (
                              <img 
                                src={item.image_url} 
                                alt={item.section_key}
                                className="max-h-32 rounded-lg"
                              />
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.content || "(خالی)"}
                            </p>
                          )
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        {editingId === item.id ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => saveContent(item)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setEditingId(null);
                                fetchContents();
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setEditingId(item.id)}
                            >
                              <FileEdit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteContent(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
