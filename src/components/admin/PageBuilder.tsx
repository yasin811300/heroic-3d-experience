import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Upload,
  Plus,
  Trash2,
  Link as LinkIcon,
  Share2,
  HelpCircle,
  MapPin,
  Palette,
  User,
  Blocks,
  Save,
  Smartphone,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fileToCompressedDataUrl } from "@/lib/image";

type BlockType = "link" | "social" | "faq" | "contact";

interface Block {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  url?: string;
  items?: { label: string; value: string }[];
}

interface Theme {
  mode: "gradient" | "color" | "image";
  color: string;
  gradient: string;
  image: string;
  glass: boolean;
}

const GRADIENTS = [
  "linear-gradient(160deg,#0b0b0f,#1c1608 55%,#3a2c07)",
  "linear-gradient(160deg,#0f0c29,#302b63,#24243e)",
  "linear-gradient(160deg,#141e30,#243b55)",
  "linear-gradient(160deg,#1a0b2e,#3b0764,#831843)",
];

const uid = () => Math.random().toString(36).slice(2, 9);

const BLOCK_META: Record<BlockType, { label: string; icon: any }> = {
  link: { label: "لینک متنی", icon: LinkIcon },
  social: { label: "ردیف شبکه‌های اجتماعی", icon: Share2 },
  faq: { label: "سوالات متداول", icon: HelpCircle },
  contact: { label: "تماس / موقعیت", icon: MapPin },
};

const newBlock = (type: BlockType): Block => {
  switch (type) {
    case "social":
      return {
        id: uid(),
        type,
        title: "ما را دنبال کنید",
        items: [
          { label: "اینستاگرام", value: "https://instagram.com/" },
          { label: "تلگرام", value: "https://t.me/" },
        ],
      };
    case "faq":
      return {
        id: uid(),
        type,
        title: "سوالات متداول",
        items: [{ label: "چطور سفارش بدهم؟", value: "از طریق دکمه تماس با ما اقدام کنید." }],
      };
    case "contact":
      return { id: uid(), type, title: "تماس با ما", subtitle: "همدان، ایران", url: "tel:09914601322" };
    default:
      return { id: uid(), type: "link", title: "لینک جدید", subtitle: "توضیح کوتاه", url: "https://" };
  }
};

const PageBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("آژانس ازما");
  const [bio, setBio] = useState("آژانس دیجیتال مارکتینگ — طراحی سایت، سئو و شبکه‌های اجتماعی");
  const [avatar, setAvatar] = useState("");
  const [slug, setSlug] = useState("azma");
  const [theme, setTheme] = useState<Theme>({
    mode: "gradient",
    color: "#0b0b0f",
    gradient: GRADIENTS[0],
    image: "",
    glass: true,
  });
  const [blocks, setBlocks] = useState<Block[]>([
    newBlock("link"),
    newBlock("social"),
    newBlock("contact"),
  ]);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPage = async () => {
      const { data, error } = await (supabase as any)
        .from("builder_pages")
        .select("slug,title,bio,avatar_url,theme,blocks")
        .eq("slug", slug)
        .maybeSingle();
      if (error || !data) return;
      setTitle(data.title || "");
      setBio(data.bio || "");
      setAvatar(data.avatar_url || "");
      if (data.theme) setTheme(data.theme as Theme);
      if (Array.isArray(data.blocks)) setBlocks(data.blocks as Block[]);
    };
    loadPage();
  }, []);

  const background = useMemo(() => {
    if (theme.mode === "image" && theme.image) return { backgroundImage: `url(${theme.image})`, backgroundSize: "cover", backgroundPosition: "center" };
    if (theme.mode === "color") return { background: theme.color };
    return { background: theme.gradient };
  }, [theme]);

  const generate = async () => {
    if (!prompt.trim()) return toast.error("موضوع صفحه را بنویسید");
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    const topic = prompt.trim();
    setTitle(topic.split("\n")[0].slice(0, 40) || "آژانس ازما");
    setBio(`${topic} — همه‌چیز در یک لینک؛ سریع، حرفه‌ای و قابل اعتماد.`);
    setTheme((t) => ({ ...t, mode: "gradient", gradient: GRADIENTS[0], glass: true }));
    setBlocks([
      { id: uid(), type: "link", title: "مشاهده نمونه‌کارها", subtitle: "۲۵۰+ پروژه موفق", url: "/portfolio" },
      { id: uid(), type: "link", title: "دریافت مشاوره رایگان", subtitle: "کمتر از ۲۴ ساعت پاسخ", url: "/contact" },
      { id: uid(), type: "link", title: "خدمات و تعرفه‌ها", subtitle: "طراحی سایت، سئو، اینستاگرام", url: "/services" },
      {
        id: uid(),
        type: "social",
        title: "ما را دنبال کنید",
        items: [
          { label: "اینستاگرام", value: "https://instagram.com/azmamarkteng" },
          { label: "تلگرام", value: "https://t.me/yasin_salarnazem" },
        ],
      },
      { id: uid(), type: "contact", title: "تماس مستقیم", subtitle: "همدان، ایران", url: "tel:09914601322" },
    ]);
    setGenerating(false);
    toast.success("صفحه با هوش مصنوعی ساخته شد ✨");
  };

  const savePage = async () => {
    if (!slug.trim()) return toast.error("نامک صفحه الزامی است");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return toast.error("برای ذخیره صفحه دوباره وارد پنل شوید");
    setSaving(true);
    const payload = {
      slug: slug.trim(),
      title,
      bio,
      avatar_url: avatar,
      theme: theme as any,
      blocks: blocks as any,
      is_published: true,
    };
    const { error } = await (supabase as any)
      .from("builder_pages")
      .upsert(payload, { onConflict: "slug" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`صفحه ذخیره شد: /p/${slug}`);
  };

  const updateBlock = (id: string, patch: Partial<Block>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const moveBlock = (index: number, dir: -1 | 1) => {
    const t = index + dir;
    if (t < 0 || t >= blocks.length) return;
    const copy = [...blocks];
    [copy[index], copy[t]] = [copy[t], copy[index]];
    setBlocks(copy);
  };

  const cardClass = theme.glass
    ? "backdrop-blur-xl bg-white/10 border border-white/20"
    : "bg-black/40 border border-white/10";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">صفحه‌ساز (Link in Bio)</h2>
          <p className="text-sm text-muted-foreground">ساخت صفحه موبایلی با پیش‌نمایش زنده</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[60fr_40fr] gap-6 items-start">
        {/* Controls */}
        <div className="space-y-6 order-2 lg:order-1">
          {/* AI card */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold">ساخت جادویی با هوش مصنوعی</h3>
            </div>
            <Textarea
              rows={3}
              placeholder="موضوع صفحه‌ات را بنویس (مثلا: آژانس ازما، دیجیتال مارکتینگ، لینک‌های تماس)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={generate} disabled={generating} className="w-full">
              {generating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Sparkles className="w-4 h-4 ml-2" />}
              ✨ ساخت با هوش مصنوعی
            </Button>
          </div>

          <Tabs defaultValue="theme" className="glass rounded-2xl p-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="theme"><Palette className="w-4 h-4 ml-1" /> ظاهر</TabsTrigger>
              <TabsTrigger value="hero"><User className="w-4 h-4 ml-1" /> معرفی</TabsTrigger>
              <TabsTrigger value="blocks"><Blocks className="w-4 h-4 ml-1" /> بلوک‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="space-y-4 pt-4">
              <div className="flex gap-2 flex-wrap">
                {(["gradient", "color", "image"] as const).map((m) => (
                  <Button
                    key={m}
                    variant={theme.mode === m ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setTheme({ ...theme, mode: m })}
                  >
                    {m === "gradient" ? "گرادیانت" : m === "color" ? "رنگ ثابت" : "تصویر"}
                  </Button>
                ))}
              </div>

              {theme.mode === "gradient" && (
                <div className="grid grid-cols-4 gap-3">
                  {GRADIENTS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setTheme({ ...theme, gradient: g })}
                      style={{ background: g }}
                      className={`h-16 rounded-xl border-2 transition-all ${theme.gradient === g ? "border-primary scale-105" : "border-transparent"}`}
                    />
                  ))}
                </div>
              )}

              {theme.mode === "color" && (
                <div className="space-y-2">
                  <Label>رنگ پس‌زمینه</Label>
                  <Input type="color" value={theme.color} onChange={(e) => setTheme({ ...theme, color: e.target.value })} className="h-12 w-24 p-1" />
                </div>
              )}

              {theme.mode === "image" && (
                <div className="space-y-2">
                  <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try { setTheme({ ...theme, image: await fileToCompressedDataUrl(f, 900) }); } catch (err: any) { toast.error(err.message); }
                  }} />
                  <Button variant="secondary" onClick={() => bgRef.current?.click()}>
                    <Upload className="w-4 h-4 ml-2" /> بارگذاری تصویر پس‌زمینه
                  </Button>
                  <Input placeholder="یا آدرس تصویر" value={theme.image.startsWith("data:") ? "" : theme.image} onChange={(e) => setTheme({ ...theme, image: e.target.value })} />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Switch checked={theme.glass} onCheckedChange={(v) => setTheme({ ...theme, glass: v })} />
                <span className="text-sm">کارت‌های شیشه‌ای مات (Glassmorphism)</span>
              </div>
            </TabsContent>

            <TabsContent value="hero" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                  {avatar ? <img src={avatar} alt="آواتار صفحه" className="w-full h-full object-cover" /> : <User className="w-7 h-7 text-muted-foreground" />}
                </div>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try { setAvatar(await fileToCompressedDataUrl(f, 400)); } catch (err: any) { toast.error(err.message); }
                }} />
                <Button variant="secondary" onClick={() => avatarRef.current?.click()}>
                  <Upload className="w-4 h-4 ml-2" /> بارگذاری آواتار
                </Button>
              </div>
              <div className="space-y-2">
                <Label>عنوان صفحه</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>بیو کوتاه</Label>
                <Textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>نامک صفحه (آدرس)</Label>
                <Input dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value)} />
                <p className="text-xs text-muted-foreground">آدرس نهایی: /p/{slug}</p>
              </div>
            </TabsContent>

            <TabsContent value="blocks" className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(BLOCK_META) as BlockType[]).map((t) => {
                  const Icon = BLOCK_META[t].icon;
                  return (
                    <Button key={t} size="sm" variant="secondary" onClick={() => setBlocks([...blocks, newBlock(t)])}>
                      <Icon className="w-4 h-4 ml-1" /> {BLOCK_META[t].label}
                    </Button>
                  );
                })}
              </div>

              <AnimatePresence initial={false}>
                {blocks.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-border p-4 space-y-3 bg-card/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{BLOCK_META[b.type].label}</span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => moveBlock(i, -1)}><ArrowUp className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => moveBlock(i, 1)}><ArrowDown className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setBlocks(blocks.filter((x) => x.id !== b.id))}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <Input placeholder="عنوان" value={b.title} onChange={(e) => updateBlock(b.id, { title: e.target.value })} />
                    {(b.type === "link" || b.type === "contact") && (
                      <>
                        <Input placeholder="توضیح کوتاه" value={b.subtitle || ""} onChange={(e) => updateBlock(b.id, { subtitle: e.target.value })} />
                        <Input dir="ltr" placeholder="لینک" value={b.url || ""} onChange={(e) => updateBlock(b.id, { url: e.target.value })} />
                      </>
                    )}
                    {(b.type === "social" || b.type === "faq") && (
                      <div className="space-y-2">
                        {(b.items || []).map((it, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              placeholder={b.type === "faq" ? "سوال" : "نام شبکه"}
                              value={it.label}
                              onChange={(e) => {
                                const items = [...(b.items || [])];
                                items[idx] = { ...it, label: e.target.value };
                                updateBlock(b.id, { items });
                              }}
                            />
                            <Input
                              placeholder={b.type === "faq" ? "پاسخ" : "لینک"}
                              value={it.value}
                              onChange={(e) => {
                                const items = [...(b.items || [])];
                                items[idx] = { ...it, value: e.target.value };
                                updateBlock(b.id, { items });
                              }}
                            />
                            <Button size="icon" variant="ghost" onClick={() => updateBlock(b.id, { items: (b.items || []).filter((_, k) => k !== idx) })}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button size="sm" variant="ghost" onClick={() => updateBlock(b.id, { items: [...(b.items || []), { label: "", value: "" }] })}>
                          <Plus className="w-4 h-4 ml-1" /> افزودن مورد
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>
          </Tabs>

          <Button onClick={savePage} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
            ذخیره و انتشار صفحه
          </Button>
        </div>

        {/* Live preview */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="mx-auto w-full max-w-[400px]">
            <div className="rounded-[2.5rem] border-8 border-foreground/80 bg-black overflow-hidden shadow-2xl">
              <div className="h-6 bg-foreground/80 flex items-center justify-center">
                <div className="w-24 h-3 rounded-full bg-black/80" />
              </div>
              <div style={background as any} className="h-[620px] overflow-y-auto p-5 text-white">
                <div className="text-center space-y-3 py-4">
                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-white/40 bg-white/10 flex items-center justify-center">
                    {avatar ? <img src={avatar} alt={title} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-white/70" />}
                  </div>
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{bio}</p>
                </div>

                <div className="space-y-3 pb-6">
                  {blocks.map((b) => {
                    if (b.type === "social") {
                      return (
                        <div key={b.id} className={`rounded-2xl p-4 ${cardClass}`}>
                          <p className="text-xs text-white/60 mb-3 text-center">{b.title}</p>
                          <div className="flex justify-center gap-3 flex-wrap">
                            {(b.items || []).map((it, i) => (
                              <a key={i} href={it.value} target="_blank" rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-white/10 text-xs hover:bg-white/20 transition-colors">
                                {it.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (b.type === "faq") {
                      return (
                        <div key={b.id} className={`rounded-2xl p-4 ${cardClass} space-y-3`}>
                          <p className="font-bold text-sm">{b.title}</p>
                          {(b.items || []).map((it, i) => (
                            <div key={i}>
                              <p className="text-xs font-medium">{it.label}</p>
                              <p className="text-xs text-white/60 leading-relaxed">{it.value}</p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <a
                        key={b.id}
                        href={b.url || "#"}
                        className={`block rounded-2xl p-4 text-center transition-all hover:scale-[1.02] hover:bg-white/20 ${cardClass}`}
                      >
                        <p className="font-bold text-sm">{b.title}</p>
                        {b.subtitle && <p className="text-xs text-white/60 mt-1">{b.subtitle}</p>}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">پیش‌نمایش زنده موبایل</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
