import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Save, X, Search,
  FileText, Calendar, Tag, Image, Clock
} from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  author_name: string | null;
  is_published: boolean;
  published_at: string | null;
  views_count: number;
  read_time: number;
  created_at: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category: "",
    tags: "",
    author_name: "",
    read_time: 5,
    is_published: false
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("خطا در دریافت مقالات");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "",
      tags: "",
      author_name: "",
      read_time: 5,
      is_published: false
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      featured_image: post.featured_image || "",
      category: post.category || "",
      tags: post.tags?.join(", ") || "",
      author_name: post.author_name || "",
      read_time: post.read_time,
      is_published: post.is_published
    });
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("عنوان و محتوا الزامی است");
      return;
    }

    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        featured_image: formData.featured_image.trim() || null,
        category: formData.category.trim() || null,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : null,
        author_name: formData.author_name.trim() || "تیم ازما",
        read_time: formData.read_time,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null
      };

      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("مقاله با موفقیت ویرایش شد");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([postData]);

        if (error) throw error;
        toast.success("مقاله با موفقیت ایجاد شد");
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast.error(error.message || "خطا در ذخیره مقاله");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("مقاله حذف شد");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("خطا در حذف مقاله");
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ 
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : null
        })
        .eq("id", post.id);

      if (error) throw error;
      toast.success(post.is_published ? "مقاله پیش‌نویس شد" : "مقاله منتشر شد");
      fetchPosts();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            مدیریت بلاگ
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {posts.length} مقاله | {posts.filter(p => p.is_published).length} منتشر شده
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
            مقاله جدید
          </Button>
        </div>
      </div>

      {/* Editor Form */}
      {(isCreating || editingPost) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {editingPost ? "ویرایش مقاله" : "مقاله جدید"}
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="عنوان مقاله"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">اسلاگ (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="slug-url"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">خلاصه</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="خلاصه‌ای از مقاله..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">محتوا * (HTML)</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="<p>محتوای مقاله...</p>"
              rows={10}
              className="font-mono text-sm"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">تصویر شاخص (URL)</label>
              <Input
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">دسته‌بندی</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="دیجیتال مارکتینگ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">نویسنده</label>
              <Input
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="تیم ازما"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">برچسب‌ها (با کاما جدا کنید)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="سئو, طراحی, مارکتینگ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">زمان مطالعه (دقیقه)</label>
              <Input
                type="number"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
                min={1}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">منتشر شود</span>
            </label>
            <div className="flex-1" />
            <Button variant="outline" onClick={resetForm}>انصراف</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              ذخیره
            </Button>
          </div>
        </motion.div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-16 bg-secondary/50 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-secondary/50 rounded w-1/2" />
                  <div className="h-4 bg-secondary/50 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">هنوز مقاله‌ای وجود ندارد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              {/* Thumbnail */}
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full md:w-24 h-32 md:h-16 object-cover rounded-lg"
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground truncate">{post.title}</h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.created_at)}
                  </span>
                  {post.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views_count}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    post.is_published 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {post.is_published ? "منتشر شده" : "پیش‌نویس"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(post)}
                  title={post.is_published ? "پیش‌نویس" : "انتشار"}
                >
                  {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(post)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
