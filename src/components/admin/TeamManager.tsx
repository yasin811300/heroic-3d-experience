import { Edit2, useEffect, useRef, useState } from "react";
import { Edit2, motion, AnimatePresence } from "framer-motion";
import { Edit2,
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Users,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Edit2, Button } from "@/components/ui/button";
import { Edit2, Input } from "@/components/ui/input";
import { Edit2, Textarea } from "@/components/ui/textarea";
import { Edit2, Label } from "@/components/ui/label";
import { Edit2, Switch } from "@/components/ui/switch";
import { Edit2, supabase } from "@/integrations/supabase/client";
import { Edit2, toast } from "sonner";
import { Edit2, fileToCompressedDataUrl } from "@/lib/image";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  telegram: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyMember = (order: number): Partial<TeamMember> => ({
  name: "",
  role: "",
  title: "",
  bio: "",
  image_url: "",
  telegram: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  display_order: order,
  is_active: true,
});

const TeamManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("team_members")
      .select("*")
      .order("display_order");
    if (error) toast.error(error.message);
    setMembers((data as TeamMember[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleImage = async (file?: File | null) => {
    if (!file) return;
    try {
      const url = await fileToCompressedDataUrl(file, 512);
      setDraft((d) => ({ ...(d || {}), image_url: url }));
      toast.success("تصویر بارگذاری شد");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const save = async () => {
    if (!draft?.name?.trim()) {
      toast.error("نام عضو الزامی است");
      return;
    }
    setSaving(true);
    const payload = {
      name: draft.name,
      role: draft.role || "",
      title: draft.title || null,
      bio: draft.bio || "",
      image_url: draft.image_url || "",
      telegram: draft.telegram || null,
      instagram: draft.instagram || null,
      linkedin: draft.linkedin || null,
      twitter: draft.twitter || null,
      display_order: draft.display_order ?? members.length + 1,
      is_active: draft.is_active ?? true,
    };

    const query = draft.id
      ? (supabase as any).from("team_members").update(payload).eq("id", draft.id)
      : (supabase as any).from("team_members").insert([payload]);

    const { error } = await query;
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "عضو تیم بروزرسانی شد" : "عضو تیم اضافه شد");
    setDraft(null);
    fetchMembers();
  };

  const remove = async (id: string) => {
    if (!confirm("این عضو حذف شود؟")) return;
    const { error } = await (supabase as any).from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("عضو حذف شد");
    fetchMembers();
  };

  const toggleActive = async (m: TeamMember) => {
    const { error } = await (supabase as any)
      .from("team_members")
      .update({ is_active: !m.is_active })
      .eq("id", m.id);
    if (error) return toast.error(error.message);
    fetchMembers();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= members.length) return;
    const a = members[index];
    const b = members[target];
    await (supabase as any).from("team_members").update({ display_order: b.display_order }).eq("id", a.id);
    await (supabase as any).from("team_members").update({ display_order: a.display_order }).eq("id", b.id);
    fetchMembers();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">مدیریت تیم</h2>
            <p className="text-sm text-muted-foreground">
              اعضای تیم بلافاصله در صفحه اصلی سایت نمایش داده می‌شوند
            </p>
          </div>
        </div>
        <Button onClick={() => setDraft(emptyMember(members.length + 1))}>
          <Plus className="w-4 h-4 ml-2" /> افزودن عضو
        </Button>
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{draft.id ? "ویرایش عضو" : "عضو جدید"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setDraft(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-[160px_1fr] gap-6">
              <div className="space-y-3">
                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center mx-auto">
                  {draft.image_url ? (
                    <img src={draft.image_url} alt={draft.name || "عضو تیم"} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files?.[0])}
                />
                <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-4 h-4 ml-2" /> بارگذاری عکس
                </Button>
                <Input
                  placeholder="یا آدرس عکس (URL)"
                  value={draft.image_url?.startsWith("data:") ? "" : draft.image_url || ""}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نام و نام خانوادگی *</Label>
                  <Input value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>سمت</Label>
                  <Input value={draft.role || ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>لقب (اختیاری)</Label>
                  <Input value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>ترتیب نمایش</Label>
                  <Input
                    type="number"
                    value={draft.display_order ?? 0}
                    onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>بیوگرافی کوتاه</Label>
                  <Textarea rows={2} value={draft.bio || ""} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>تلگرام</Label>
                  <Input dir="ltr" value={draft.telegram || ""} onChange={(e) => setDraft({ ...draft, telegram: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>اینستاگرام</Label>
                  <Input dir="ltr" value={draft.instagram || ""} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>لینکدین</Label>
                  <Input dir="ltr" value={draft.linkedin || ""} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>توییتر</Label>
                  <Input dir="ltr" value={draft.twitter || ""} onChange={(e) => setDraft({ ...draft, twitter: e.target.value })} />
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Switch
                    checked={draft.is_active ?? true}
                    onCheckedChange={(v) => setDraft({ ...draft, is_active: v })}
                  />
                  <span className="text-sm">نمایش در سایت</span>
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <Button onClick={save} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                    ذخیره
                  </Button>
                  <Button variant="ghost" onClick={() => setDraft(null)}>انصراف</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <div key={m.id} className="glass rounded-2xl p-4 flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-6 h-6 m-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{m.name}</p>
                <p className="text-sm text-primary truncate">{m.role}</p>
                {m.title && <p className="text-xs text-muted-foreground truncate">{m.title}</p>}
                <div className="flex gap-1 mt-2 flex-wrap">
                  <Button size="icon" variant="ghost" onClick={() => setDraft(m)} title="ویرایش">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => toggleActive(m)} title="نمایش/عدم نمایش">
                    {m.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, -1)} title="بالا">
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, 1)} title="پایین">
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(m.id)} title="حذف">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">هنوز عضوی اضافه نشده است</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamManager;
