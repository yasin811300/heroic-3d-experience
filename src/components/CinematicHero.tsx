import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import desktopVideo from "@/assets/hero-desktop.mp4.asset.json";
import mobileVideo from "@/assets/hero-mobile.mp4.asset.json";
import posterImage from "@/assets/hero-poster.jpg.asset.json";

const SCENES = [
  { at: 0.06, side: "right", text: "هوش مصنوعی نسل بعد" },
  { at: 0.3, side: "left", text: "طراحی سایت و تجربه کاربری" },
  { at: 0.54, side: "right", text: "سئو و رشد ارگانیک" },
  { at: 0.78, side: "left", text: "مدیریت شبکه‌های اجتماعی" },
] as const;

const CinematicHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(false);

  // Choose source at mount (never use <source media>)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // Only fetch the video bytes when the hero is near the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(true),
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll drives progress; on desktop it also scrubs the video
  useEffect(() => {
    let raf = 0;
    let target = 0;
    let current = 0;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      target = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const loop = () => {
      current += (target - current) * 0.12;
      setProgress(current);
      const video = videoRef.current;
      if (video && !isMobile && video.readyState >= 2 && video.duration) {
        video.currentTime = current * (video.duration - 0.05);
      }
      raf = requestAnimationFrame(loop);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMobile]);

  // Mobile: autoplay + loop instead of scrubbing (iOS Safari seek bug)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isMobile) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isMobile, active]);

  const fadeIn = Math.min(1, progress * 6);
  const titleOpacity = Math.max(0, 1 - Math.max(0, progress - 0.45) * 3.2);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] md:h-[500vh]"
      aria-label="معرفی آژانس ازما"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Video stage */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={active ? (isMobile ? mobileVideo.url : desktopVideo.url) : undefined}
          poster={posterImage.url}
          muted
          playsInline
          loop={isMobile}
          autoPlay={isMobile}
          preload="auto"
tabIndex={-1}
        />

        {/* Legibility gradients — keep brand dark/gold palette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/25 to-background" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,hsl(var(--background)/0.6)_80%)]" />

        {/* Side callouts */}
        {SCENES.map((scene, i) => {
          const d = progress - scene.at;
          const opacity = Math.max(0, 1 - Math.abs(d) * 8);
          return (
            <div
              key={i}
              className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 md:block ${
                scene.side === "right" ? "right-8 text-right" : "left-8 text-left"
              }`}
              style={{
                opacity,
                transform: `translateY(-50%) translateX(${(1 - opacity) * (scene.side === "right" ? 32 : -32)}px)`,
              }}
            >
              <span className="glass-strong inline-block rounded-2xl px-5 py-3 text-sm font-bold tracking-wide text-gradient-gold md:text-base">
                {scene.text}
              </span>
            </div>
          );
        })}

        {/* Centered content */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ opacity: titleOpacity }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <span
              className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-bold text-primary sm:text-sm"
              style={{ opacity: 1 - fadeIn * 0.15 }}
            >
              <Sparkles className="h-4 w-4" />
              آینده دیجیتال با هوش مصنوعی
            </span>

            <h1 className="mb-6 text-3xl font-black leading-tight text-foreground sm:text-5xl lg:text-7xl">
              جایی که برندها
              <br />
              <span className="text-gradient-gold">طلا می‌شوند</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
              با هوش مصنوعی و تکنولوژی‌های پیشرفته، کسب‌وکار شما را متحول می‌کنیم؛
              طراحی سایت، سئو و مدیریت شبکه‌های اجتماعی در بالاترین کیفیت.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                شروع همکاری
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                مشاهده خدمات
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile callout (single line, bottom) */}
        <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center px-6 md:hidden">
          {SCENES.map((scene, i) => {
            const d = progress - scene.at;
            const opacity = Math.max(0, 1 - Math.abs(d) * 8);
            if (opacity <= 0.01) return null;
            return (
              <span
                key={i}
                style={{ opacity }}
                className="glass-strong rounded-2xl px-4 py-2 text-xs font-bold text-gradient-gold"
              >
                {scene.text}
              </span>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-border/30">
          <div
            className="h-full bg-gradient-gold"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;
