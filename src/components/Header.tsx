import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navItems = [
    { label: "خانه", href: "/" },
    { label: "خدمات", href: "/services" },
    { label: "نمونه‌کار", href: "/portfolio" },
    { label: "اخبار AI", href: "/ai-news" },
    { label: "شرکا", href: "/partners" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.webp" 
                alt="آژانس ازما" 
                className="h-12 w-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.href.startsWith("/") ? (
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {item.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="tel:09914601322" className="hidden sm:flex">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">۰۹۹۱۴۶۰۱۳۲۲</span>
              </Button>
            </a>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button size="sm" variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">داشبورد</span>
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  خروج
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">ورود / ثبت‌نام</span>
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { x: 0 } : { x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-0 right-0 w-4/5 h-screen glass-strong md:hidden z-50"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <img 
              src="/logo.webp" 
              alt="آژانس ازما" 
              className="h-10 w-auto object-contain"
            />
            <button onClick={() => setIsMenuOpen(false)} className="p-2">
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <ul className="space-y-6">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.href.startsWith("/") ? (
                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-foreground hover:text-primary transition-colors block"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-foreground hover:text-primary transition-colors block"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button className="w-full" size="lg">
              مشاوره رایگان
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm md:hidden z-40"
        />
      )}
    </header>
  );
};

export default Header;
