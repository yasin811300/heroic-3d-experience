import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image, Plus, Edit, Trash2, Eye, EyeOff, Save, X, Search,
  ExternalLink, Layers
} from "lucide-react";
import { toast } from "sonner";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  client_name: string | null;
  project_url: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string;
}

const PortfolioManager = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    client_name: "",
    project_url: "",
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("خطا در دریافت نمونه‌کارها");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "",
      client_name: "",
      project_url: "",
      display_order: 0,
      is_active: true
    });
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      category: item.category || "",
      client_name: item.client_name || "",
      project_url: item.project_url || "",
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true
    });
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }

    try {
      const itemData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        category: formData.category.trim() || null,
        client_name: formData.client_name.trim() || null,
        project_url: formData.project_url.trim() || null,
        display_order: formData.display_order,
        is_active: formData.is_active
      };

      if (editingItem) {
        const { error } = await supabase
          .from("portfolio_items")
          .update(itemData)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("نمونه‌کار ویرایش شد");
      } else {
        const { error } = await supabase
          .from("portfolio_items")
          .insert([itemData]);

        if (error) throw error;
        toast.success("نمونه‌کار اضافه شد");
      }

      resetForm();
      fetchItems();
    } catch (error: any) {
      console.error("Error saving item:", error);
      toast.error(error.message || "خطا در ذخیره");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف اطمینان دارید؟")) return;

    try {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("نمونه‌کار حذف شد");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("خطا در حذف");
    }
  };

  const toggleActive = async (item: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .update({ is_active: !item.is_active })
        .eq("id", item.id);

      if (error) throw error;
      toast.success(item.is_active ? "غیرفعال شد" : "فعال شد");
      fetchItems();
    } catch (error) {
      console.error("Error toggling active:", error);
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Image className="w-6 h-6 text-primary" />
            مدیریت نمونه‌کارها
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} پروژه | {items.filter(i => i.is_active).length} فعال
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button onClick={() => { resetForm(); setIsCreating(true); }} className="gap-2">
            <Plus className="w-4 h-4" />
            پروژه جدید
          </Button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <span key={cat} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
            {cat}: {items.filter(i => i.category === cat).length}
          </span>
        ))}
      </div>

      {/* Editor Form */}
      {(isCreating || editingItem) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {editingItem ? "ویرایش پروژه" : "پروژه جدید"}
            </h3>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="عنوان پروژه"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">دسته‌بندی</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="طراحی سایت"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">توضیحات</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="توضیحات پروژه..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">تصویر (URL)</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">نام مشتری</label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="شرکت ایکس"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">لینک پروژه</label>
              <Input
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ترتیب نمایش</label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">فعال</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex-1" />
            <Button variant="outline" onClick={resetForm}>انصراف</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              ذخیره
            </Button>
          </div>
        </motion.div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="aspect-video bg-secondary/50 rounded-lg mb-4" />
              <div className="h-4 bg-secondary/50 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">نمونه‌کاری وجود ندارد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`glass rounded-xl overflow-hidden ${!item.is_active ? "opacity-50" : ""}`}
            >
              {/* Image */}
              <div className="aspect-video bg-secondary/30 relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {item.category && (
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs bg-background/80 backdrop-blur-sm">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                {item.client_name && (
                  <p className="text-sm text-muted-foreground mb-2">{item.client_name}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(item)}
                    title={item.is_active ? "غیرفعال" : "فعال"}
                  >
                    {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {item.project_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(item.project_url!, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
