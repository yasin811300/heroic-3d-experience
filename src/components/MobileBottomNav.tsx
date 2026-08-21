import { Link, useLocation } from "react-router-dom";
import { Home, Gift, Newspaper, Store, User } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/", label: "خانه", icon: Home },
  { to: "/club", label: "باشگاه", icon: Gift },
  { to: "/ai-news", label: "اخبار", icon: Newspaper },
  { to: "/services", label: "خدمات", icon: Store },
  { to: "/dashboard", label: "پروفایل", icon: User },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav
      dir="rtl"
      aria-label="ناوبری موبایل"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary"
                  />
                )}
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
