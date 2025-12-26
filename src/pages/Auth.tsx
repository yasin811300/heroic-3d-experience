import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowLeft, Sparkles, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
      if (isLogin) {
        const result = loginSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("ایمیل یا رمز عبور اشتباه است");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("ورود موفقیت‌آمیز بود!");
          navigate("/");
        }
      } else {
        const result = registerSchema.safeParse(formData);

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("این ایمیل قبلاً ثبت شده است");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("ثبت‌نام موفقیت‌آمیز بود! به صفحه اصلی هدایت می‌شوید...");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "امنیت بالا" },
    { icon: Sparkles, text: "تجربه کاربری عالی" },
    { icon: CheckCircle, text: "پشتیبانی ۲۴/۷" },
  ];

  return (
    <>
      <Helmet>
        <title>{isLogin ? "ورود" : "ثبت‌نام"} | آژمان</title>
        <meta name="description" content="ورود یا ثبت‌نام در آژانس دیجیتال مارکتینگ آژمان" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden bg-background">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          />
        </div>

        {/* Noise Overlay */}
        <div className="noise-overlay" />

        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative"
          >
            <div className="max-w-md text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mb-8"
              >
                <img src="/logo.webp" alt="آژمان" className="w-32 h-32 mx-auto" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-gradient-gold mb-4"
              >
                به آژمان خوش آمدید
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground text-lg mb-8"
              >
                با ما همراه شوید و از خدمات حرفه‌ای دیجیتال مارکتینگ بهره‌مند شوید
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center gap-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-primary/50"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              {/* Back Button */}
              <motion.button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>بازگشت به صفحه اصلی</span>
              </motion.button>

              {/* Form Card */}
              <motion.div
                layout
                className="glass-strong rounded-3xl p-8 shadow-2xl"
              >
                {/* Tab Switcher */}
                <div className="flex rounded-2xl bg-secondary/50 p-1 mb-8">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isLogin
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ورود
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      !isLogin
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ثبت‌نام
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={isLogin ? "login" : "register"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-foreground">
                          نام و نام خانوادگی
                        </Label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="نام کامل شما"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-destructive text-sm">{errors.fullName}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        ایمیل
                      </Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                          dir="ltr"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-sm">{errors.email}</p>
                      )}
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">
                          شماره موبایل
                        </Label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="09123456789"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                            dir="ltr"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-destructive text-sm">{errors.phone}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        رمز عبور
                      </Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="رمز عبور"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pr-10 pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-destructive text-sm">{errors.password}</p>
                      )}
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-foreground">
                          تکرار رمز عبور
                        </Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="تکرار رمز عبور"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pr-10 pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                        )}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 text-lg font-bold bg-gradient-to-l from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full"
                        />
                      ) : isLogin ? (
                        "ورود به حساب"
                      ) : (
                        "ایجاد حساب کاربری"
                      )}
                    </Button>
                  </motion.form>
                </AnimatePresence>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">یا</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-5 border-border/50 hover:bg-secondary/50"
                    onClick={() => toast.info("به زودی...")}
                  >
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    ورود با گوگل
                  </Button>
                </div>
              </motion.div>

              {/* Footer Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                با ورود یا ثبت‌نام، شما{" "}
                <a href="#" className="text-primary hover:underline">
                  قوانین و مقررات
                </a>{" "}
                را می‌پذیرید.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
