import { useEffect, useState } from "react";
import { Settings, Save, Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Setting {
  id: string;
  key: string;
  value: string | null;
}

const KNOWN_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "site_title", label: "عنوان سایت" },
  { key: "site_description", label: "توضیح متا سایت", multiline: true },
  { key: "phone", label: "شماره تماس" },
  { key: "email", label: "ایمیل" },
  { key: "address", label: "آدرس", multiline: true },
  { key: "instagram", label: "لینک اینستاگرام" },
  { key: "telegram", label: "لینک تلگرام" },
  { key: "whatsapp", label: "لینک واتساپ" },
  { key: "working_hours", label: "ساعات کاری" },
];

const SettingsManager = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*").order("key");
    if (error) toast.error(error.message);
    const list = (data as Setting[]) || [];
    setRows(list);
    setSettings(Object.fromEntries(list.map((s) => [s.key, s.value ?? ""])));
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const upsert = async (key: string, value: string) => {
    const existing = rows.find((r) => r.key === key);
    if (existing) {
      const { error } = await supabase.from("site_settings").update({ value }).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("site_settings").insert([{ key, value }]);
      if (error) throw error;
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await upsert(key, value);
      }
      toast.success("تنظیمات ذخیره شد");
      fetchSettings();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    if (!newKey.trim()) return toast.error("کلید تنظیم را وارد کنید");
    try {
      await upsert(newKey.trim(), newValue);
      setNewKey("");
      setNewValue("");
      toast.success("تنظیم اضافه شد");
      fetchSettings();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const removeSetting = async (id: string) => {
    if (!confirm("این تنظیم حذف شود؟")) return;
    const { error } = await supabase.from("site_settings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    fetchSettings();
  };

  const customRows = rows.filter((r) => !KNOWN_FIELDS.some((f) => f.key === r.key));

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">تنظیمات سایت</h2>
            <p className="text-sm text-muted-foreground">اطلاعات کلی، تماس و شبکه‌های اجتماعی</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={fetchSettings}>
            <RefreshCw className="w-4 h-4 ml-2" /> بروزرسانی
          </Button>
          <Button onClick={saveAll} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            ذخیره همه
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 grid md:grid-cols-2 gap-4">
        {KNOWN_FIELDS.map((f) => (
          <div key={f.key} className={`space-y-2 ${f.multiline ? "md:col-span-2" : ""}`}>
            <Label>{f.label}</Label>
            {f.multiline ? (
              <Textarea
                rows={2}
                value={settings[f.key] ?? ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                value={settings[f.key] ?? ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold">تنظیمات سفارشی</h3>
        {customRows.map((r) => (
          <div key={r.id} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-xs text-muted-foreground">{r.key}</Label>
              <Input
                value={settings[r.key] ?? ""}
                onChange={(e) => setSettings({ ...settings, [r.key]: e.target.value })}
              />
            </div>
            <Button size="icon" variant="ghost" onClick={() => removeSetting(r.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Input placeholder="کلید جدید (مثلا footer_note)" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
          <Input placeholder="مقدار" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <Button onClick={addSetting}>
            <Plus className="w-4 h-4 ml-2" /> افزودن
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
