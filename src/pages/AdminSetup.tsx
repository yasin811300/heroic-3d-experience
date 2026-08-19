import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Lock, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const setupSchema = z
  .object({
    email: z.string().email("ایمیل معتبر نیست"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

const AdminSetup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = setupSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (error) {
        // Best-effort parse server message
        let serverMessage = "";
        try {
          const json = await (error as any)?.context?.json?.();
          serverMessage = json?.error || json?.message || "";
        } catch {
          // ignore
        }

        const msg = serverMessage || error.message || "خطا در ایجاد ادمین";

        if (msg.toLowerCase().includes("admin already exists") || msg.includes("403")) {
          toast.error("ادمین قبلاً ساخته شده است؛ از صفحه ورود استفاده کنید.");
          navigate("/admin/login");
          return;
        }

        toast.error(msg);
        return;
      }

      if (data?.success) {
        toast.success("🎉 حساب ادمین با موفقیت ایجاد شد!");
        setTimeout(() => navigate("/admin/login"), 800);
        return;
      }

      toast.error(data?.error || "خطا در ایجاد ادمین");
    } catch {
      toast.error("خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>راه‌اندازی ادمین | ازما</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${window.location.origin}/admin/setup`} />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center p-6">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        </div>
        <div className="noise-overlay" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Key className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">راه‌اندازی اولیه پنل</span>
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-3xl p-8 shadow-2xl border border-primary/20"
          >
            {/* Header */}
            <header className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              >
                <Shield className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground mb-2">ایجاد اولین ادمین</h1>
              <p className="text-muted-foreground text-sm">این مرحله فقط برای ساخت اولین ادمین است.</p>
            </header>

            <main>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    ایمیل ادمین
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-secondary/50 border-border/50 focus:border-primary h-12"
                    dir="ltr"
                  />
                  {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    رمز عبور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="حداقل ۶ کاراکتر"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-secondary/50 border-border/50 focus:border-primary h-12 pl-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    تکرار رمز عبور
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="تکرار رمز عبور"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-secondary/50 border-border/50 focus:border-primary h-12"
                    dir="ltr"
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-l from-primary to-accent hover:opacity-90 transition-all"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Shield className="w-5 h-5 ml-2" />
                      ایجاد ادمین
                    </>
                  )}
                </Button>
              </form>

              <section className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground text-center">
                  ⚠️ بعد از ساخت اولین ادمین، این مسیر برای ساخت ادمین جدید دیگر کار نمی‌کند.
                </p>
              </section>
            </main>
          </motion.div>

          <footer className="text-center mt-6">
            <button
              onClick={() => navigate("/admin/login")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              رفتن به صفحه ورود ادمین
            </button>
          </footer>
        </motion.div>
      </div>
    </>
  );
};

export default AdminSetup;
