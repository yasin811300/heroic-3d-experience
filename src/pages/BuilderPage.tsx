import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Block {
  id: string;
  type: "link" | "social" | "faq" | "contact";
  title: string;
  subtitle?: string;
  url?: string;
  items?: { label: string; value: string }[];
}

const BuilderPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any)
        .from("builder_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      setPage(data);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        این صفحه یافت نشد
      </div>
    );
  }

  const theme = page.theme || {};
  const blocks: Block[] = page.blocks || [];
  const background =
    theme.mode === "image" && theme.image
      ? { backgroundImage: `url(${theme.image})`, backgroundSize: "cover", backgroundPosition: "center" }
      : theme.mode === "color"
      ? { background: theme.color }
      : { background: theme.gradient || "linear-gradient(160deg,#0b0b0f,#1c1608 55%,#3a2c07)" };

  const cardClass = theme.glass === false
    ? "bg-black/40 border border-white/10"
    : "backdrop-blur-xl bg-white/10 border border-white/20";

  return (
    <>
      <Helmet>
        <title>{`${page.title} | آژانس ازما`}</title>
        <meta name="description" content={page.bio?.slice(0, 155) || page.title} />
        <link rel="canonical" href={`https://azmamarkteng.ir/p/${page.slug}`} />
      </Helmet>
      <main dir="rtl" style={background as any} className="min-h-screen text-white px-4 py-10">
        <div className="mx-auto w-full max-w-[420px]">
          <header className="text-center space-y-3 mb-8">
            <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-white/40 bg-white/10 flex items-center justify-center">
              {page.avatar_url ? (
                <img src={page.avatar_url} alt={page.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <User className="w-9 h-9 text-white/70" />
              )}
            </div>
            <h1 className="text-2xl font-black">{page.title}</h1>
            <p className="text-sm text-white/70 leading-relaxed">{page.bio}</p>
          </header>

          <div className="space-y-3 pb-10">
            {blocks.map((b) => {
              if (b.type === "social") {
                return (
                  <section key={b.id} className={`rounded-2xl p-4 ${cardClass}`}>
                    <p className="text-xs text-white/60 mb-3 text-center">{b.title}</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {(b.items || []).map((it, i) => (
                        <a key={i} href={it.value} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-white/10 text-sm hover:bg-white/20 transition-colors">
                          {it.label}
                        </a>
                      ))}
                    </div>
                  </section>
                );
              }
              if (b.type === "faq") {
                return (
                  <section key={b.id} className={`rounded-2xl p-4 space-y-3 ${cardClass}`}>
                    <h2 className="font-bold text-sm">{b.title}</h2>
                    {(b.items || []).map((it, i) => (
                      <div key={i}>
                        <p className="text-sm font-medium">{it.label}</p>
                        <p className="text-xs text-white/60 leading-relaxed">{it.value}</p>
                      </div>
                    ))}
                  </section>
                );
              }
              return (
                <a key={b.id} href={b.url || "#"}
                  className={`block rounded-2xl p-4 text-center transition-all hover:scale-[1.02] hover:bg-white/20 ${cardClass}`}>
                  <p className="font-bold">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-white/60 mt-1">{b.subtitle}</p>}
                </a>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default BuilderPage;
