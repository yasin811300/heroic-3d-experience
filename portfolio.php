<?php
session_start();
require 'db.php';

$is_logged_in = isset($_SESSION['user_phone']);
$is_admin     = isset($_SESSION['admin_logged_in']);
$settings     = $conn->query("SELECT * FROM settings WHERE id=1")->fetch_assoc();

/* سئو پیش‌فرض صفحه */
$seo_query = $conn->query("SELECT * FROM seo WHERE page_name='portfolio'");
if ($seo_query->num_rows) {
    $seo = $seo_query->fetch_assoc();
} else {
    $seo = [
        'title'       => 'نمونه کارها | آژانس دیجیتال مارکتینگ ازما – طلایی کردن برندها',
        'description' => 'طراحی لوگو، هویت بصری، پوستر، استوری موشن، مدیریت اینستاگرام، طراحی سایت و سئو | نمونه‌کارهای حرفه‌ای با 3D Animation در همدان',
        'keywords'    => 'نمونه کار طراحی لوگو, نمونه پوستر, استوری موشن, طراحی سایت همدان, سئو, اینستاگرام, هویت بصری'
    ];
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?= htmlspecialchars($seo['title']) ?></title>
    <meta name="description" content="<?= htmlspecialchars($seo['description']) ?>">
    <meta name="keywords" content="<?= htmlspecialchars($seo['keywords']) ?>">
    <meta name="author" content="یاسین سالارناظم">
    <meta name="robots" content="index, follow">

    <!-- Open Graph -->
    <meta property="og:title" content="<?= $seo['title'] ?>">
    <meta property="og:description" content="<?= $seo['description'] ?>">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= $settings['site_name'] ?>">
    <meta property="og:image" content="https://azmamarkteng.ir/images/portfolio-og.webp">

    <!-- Preconnect & DNS-Prefetch -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

    <!-- Preload Critical Images -->
    <link rel="preload" href="/images/portfolio-hero.webp" as="image" type="image/webp">
    <link rel="preload" href="/images/logo.webp" as="image" type="image/webp">

    <!-- Critical Inline CSS -->
    <style>
        :root {
            --primary: #f59e0b;
            --accent: #00d2ff;
            --dark-bg: #0f2027;
            --text-light: #e0f7fa;
            --radius: 24px;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Vazirmatn', 'Tahoma', sans-serif;
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
            background-attachment: fixed;
            color: var(--text-light);
            line-height: 1.6;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            border-radius: var(--radius);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: #000;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 9999;
            transition: top 0.3s;
        }
        .skip-link:focus {
            top: 6px;
        }
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s, transform 0.8s;
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "<?= $seo['title'] ?>",
      "description": "<?= $seo['description'] ?>",
      "url": "https://azmamarkteng.ir/portfolio.php",
      "publisher": {
        "@type": "DigitalMarketingAgency",
        "name": "<?= $settings['site_name'] ?>",
        "telephone": "<?= $settings['phone_1'] ?>"
      }
    }
    </script>
</head>
<body>
    <a href="#main-content" class="skip-link">ردیف به محتوای اصلی</a>

    <!-- Header -->
    <header style="background: rgba(15,32,39,0.95); backdrop-filter: blur(15px); position: fixed; width: 100%; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div class="container h-20 flex justify-between items-center px-4">
            <div class="flex items-center gap-3">
                <a href="contact.php" class="btn btn-primary text-sm px-4 py-2" aria-label="سفارش پروژه">سفارش پروژه</a>
                <?php if ($is_logged_in || $is_admin): ?>
                    <a href="<?= $is_admin ? 'admin-panel.php' : 'dashboard.php' ?>" class="btn btn-primary text-sm px-4 py-2" aria-label="داشبورد">داشبورد</a>
                <?php else: ?>
                    <a href="login.php" class="btn btn-outline text-sm px-4 py-2" aria-label="ورود">ورود</a>
                <?php endif; ?>
            </div>

            <nav role="navigation" aria-label="ناوبری اصلی">
                <ul class="flex gap-6">
                    <li><a href="index.php" class="nav-link">خانه</a></li>
                    <li><a href="services.php" class="nav-link">خدمات</a></li>
                    <li><a href="portfolio.php" class="nav-link active" aria-current="page">نمونه‌کارها</a></li>
                    <li><a href="about.php" class="nav-link">درباره ما</a></li>
                    <li><a href="contact.php" class="nav-link">تماس</a></li>
                </ul>
            </nav>

            <a href="index.php" class="flex items-center gap-2" aria-label="صفحه اصلی">
                <picture>
                    <source srcset="/images/logo.webp" type="image/webp">
                    <img src="/images/logo.png" width="40" height="40" loading="eager" fetchpriority="high" alt="لوگوی ازما">
                </picture>
                <span class="font-extrabold text-xl hidden md:block"><?= htmlspecialchars($settings['site_name']) ?></span>
            </a>
        </div>
    </header>

    <main id="main-content" role="main">
        <!-- Hero -->
        <section class="hero reveal" aria-labelledby="portfolio-hero-title" style="padding-top: 160px; padding-bottom: 100px; text-align: center;">
            <div class="container">
                <h1 id="portfolio-hero-title" class="text-4xl md:text-6xl font-extrabold text-white mb-6">
                    طلایی‌ترین <span class="text-[#f59e0b]">نمونه‌کارها</span>
                </h1>
                <p class="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
                    طراحی لوگو، هویت بصری، پوستر، استوری موشن، مدیریت اینستاگرام، طراحی سایت و سئو – همه‌چیز را با استاندارد‌های جهانی و انیمیشن‌های سه‌بعدی به شما تحویل می‌دهیم.
                </p>
                <a href="#pricing" class="btn btn-primary">مشاهده تعرفه‌ها</a>
            </div>
        </section>

        <!-- Portfolio Grid -->
        <section class="py-20" aria-labelledby="portfolio-grid-title">
            <div class="container">
                <h2 id="portfolio-grid-title" class="sr-only">گالری نمونه‌کارهای آژانس ازما</h2>

                <!-- طراحی لوگو -->
                <div class="mb-16 reveal">
                    <h3 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <i class="fas fa-palette text-[#f59e0b]"></i> طراحی لوگو و هویت بصری
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/logo-coffee.webp" type="image/webp">
                                <img src="/images/portfolio/logo-coffee.jpg" width="400" height="300" loading="lazy" alt="لوگو کافه طلایی - طراحی مینیمال و سه‌بعدی">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">کافه طلایی</h4>
                                <p class="text-gray-400 text-sm">لوگو مینیمال + رنگ‌بندی طلایی + انیمیشن 3D ورودی</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/logo-tech.webp" type="image/webp">
                                <img src="/images/portfolio/logo-tech.jpg" width="400" height="300" loading="lazy" alt="لوگو استارتاپ تکنولوژی - سبک فلات و موشن">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">استارتاپ تکنولوژی</h4>
                                <p class="text-gray-400 text-sm">سبک فلات + آیکون هوش مصنوعی + موشن اینترو</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/logo-fashion.webp" type="image/webp">
                                <img src="/images/portfolio/logo-fashion.jpg" width="400" height="300" loading="lazy" alt="لوگو برند پوشاک - امضای لوکس">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">برند پوشاک لیلی</h4>
                                <p class="text-gray-400 text-sm">امضای لوکس + طلاکوب + استوری موشن معرفی</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- پوستر و استوری موشن -->
                <div class="mb-16 reveal">
                    <h3 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <i class="fas fa-photo-video text-[#f59e0b]"></i> پوستر و استوری موشن
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="glass-card group">
                            <video width="400" height="300" muted loop playsinline preload="metadata" class="w-full" poster="/images/portfolio/poster-yalda.webp">
                                <source src="/videos/yalda-motion.mp4" type="video/mp4">
                                <img src="/images/portfolio/yalda-fallback.jpg" width="400" height="300" alt="استوری موشن یلدا">
                            </video>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">کمپین یلدا</h4>
                                <p class="text-gray-400 text-sm">استوری موشن 15 ثانیه‌ای - افزایش 320٪ فروش</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/poster-newyear.webp" type="image/webp">
                                <img src="/images/portfolio/poster-newyear.jpg" width="400" height="300" loading="lazy" alt="پوستر نوروز - سبک ایرانی مدرن">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">پوستر نوروز 1404</h4>
                                <p class="text-gray-400 text-sm">سبک ایرانی-مدرن + چاپ افست + طلاکوب</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- طراحی سایت و سئو -->
                <div class="mb-16 reveal">
                    <h3 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <i class="fas fa-code text-[#f59e0b]"></i> طراحی سایت و سئو
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/web-food.webp" type="image/webp">
                                <img src="/images/portfolio/web-food.jpg" width="400" height="300" loading="lazy" alt="سایت رستوران - رزرو آنلاین و سئو">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">رستوران طعم خاص</h4>
                                <p class="text-gray-400 text-sm">رزرو آنلاین + سئو محلی + افزایش 300٪ رزرو</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/web-shop.webp" type="image/webp">
                                <img src="/images/portfolio/web-shop.jpg" width="400" height="300" loading="lazy" alt="فروشگاه پوشاک - UI/UX مدرن">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">فروشگاه مردانه</h4>
                                <p class="text-gray-400 text-sm">UI/UX مدرن + فیلتر هوشمند + پرداخت درگاهی</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/web-real.webp" type="image/webp">
                                <img src="/images/portfolio/web-real.jpg" width="400" height="300" loading="lazy" alt="سایت آژانس املاک - نقشه گوگل">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">آژانس املاک</h4>
                                <p class="text-gray-400 text-sm">نقشه گوگل + فیلتر قیمت + اسکن مدارک</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- مدیریت اینستاگرام -->
                <div class="mb-16 reveal">
                    <h3 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <i class="fab fa-instagram text-[#f59e0b]"></i> مدیریت اینستاگرام
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/ig-food.webp" type="image/webp">
                                <img src="/images/portfolio/ig-food.jpg" width="400" height="300" loading="lazy" alt="صفحه اینستاگرام رستوران - 45k فالوور">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">رستوران طعم خاص</h4>
                                <p class="text-gray-400 text-sm">از 2k به 45k فالوور واقعی در 6 ماه</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/ig-fashion.webp" type="image/webp">
                                <img src="/images/portfolio/ig-fashion.jpg" width="400" height="300" loading="lazy" alt="صفحه اینستاگرام فشن - استوری موشن">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">برند پوشاک لیلی</h4>
                                <p class="text-gray-400 text-sm">استوری موشن روزانه + ریلز + فروش 250٪</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- گوگل مپ و لوکال سئو -->
                <div class="mb-16 reveal">
                    <h3 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <i class="fas fa-map-marker-alt text-[#f59e0b]"></i> ثبت در گوگل مپ و لوکال سئو
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/gmap-coffee.webp" type="image/webp">
                                <img src="/images/portfolio/gmap-coffee.jpg" width="400" height="300" loading="lazy" alt="گوگل مپ کافه - رتبه 1 همدان">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">کافه طلایی</h4>
                                <p class="text-gray-400 text-sm">رتبه 1 گوگل مپ همدان + ۴.۹ ستاره + ۲k کامنت</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/gmap-clinic.webp" type="image/webp">
                                <img src="/images/portfolio/gmap-clinic.jpg" width="400" height="300" loading="lazy" alt="کلینیک دندانپزشکی - رتبه 1 لوکال">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">کلینیک دندانپزشکی</h4>
                                <p class="text-gray-400 text-sm">رتبه 1 لوکال + عکس 360° + رزرو آنلاین</p>
                            </div>
                        </div>
                        <div class="glass-card group">
                            <picture>
                                <source srcset="/images/portfolio/gmap-salon.webp" type="image/webp">
                                <img src="/images/portfolio/gmap-salon.jpg" width="400" height="300" loading="lazy" alt="آرایشگاه زنانه - ریتوی 5 ستاره">
                            </picture>
                            <div class="p-4">
                                <h4 class="text-white font-bold mb-2">آرایشگاه زنانه</h4>
                                <p class="text-gray-400 text-sm">ریتوی 5 ستاره + کیورد "آرایشگاه همدان" rank 1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section id="pricing" class="py-20" aria-labelledby="pricing-title" style="background: rgba(255,255,255,0.02); backdrop-filter: blur(5px);">
            <div class="container">
                <h2 id="pricing-title" class="text-3xl md:text-5xl font-extrabold text-center text-white mb-12 reveal">
                    تعرفه‌های <span class="text-[#f59e0b]">طلایی</span>
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <!-- Starter -->
                    <div class="glass-card p-6 flex flex-col h-full reveal">
                        <h3 class="text-2xl font-bold text-white mb-2">Starter</h3>
                        <p class="text-gray-400 mb-4">شروع حرفه‌ای</p>
                        <div class="text-4xl font-extrabold text-[#f59e0b] mb-6">۵ میلیون ت</div>
                        <ul class="text-sm text-gray-300 space-y-2 mb-6">
                            <li>✓ طراحی لوگو 3D</li>
                            <li>✓ کارت ویزیت دیجیتال</li>
                            <li>✓ ۵ پست اینستاگرام</li>
                            <li>✓ ثبت گوگل مپ</li>
                        </ul>
                        <a href="request.php?pack=starter&price=5000000" class="btn btn-outline w-full mt-auto">سفارش آنلاین</a>
                    </div>

                    <!-- Pro -->
                    <div class="glass-card p-6 flex flex-col h-full reveal" style="border-color: var(--primary); transform: scale(1.03);">
                        <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-black px-3 py-1 rounded-full text-xs font-bold">محبوب‌ترین</span>
                        <h3 class="text-2xl font-bold text-white mb-2">Pro</h3>
                        <p class="text-gray-400 mb-4">رشد سریع</p>
                        <div class="text-4xl font-extrabold text-[#f59e0b] mb-6">۱۵ میلیون ت</div>
                        <ul class="text-sm text-gray-300 space-y-2 mb-6">
                            <li>✓ همه موارد Starter</li>
                            <li>✓ طراحی سایت 5 صفحه‌ای</li>
                            <li>✓ سئو محلی</li>
                            <li>✓ ۱۲ پست + ۸ استوری موشن</li>
                            <li>✓ بک‌لینک قوی</li>
                        </ul>
                        <a href="request.php?pack=pro&price=15000000" class="btn btn-primary w-full mt-auto">سفارش آنلاین</a>
                    </div>

                    <!-- VIP -->
                    <div class="glass-card p-6 flex flex-col h-full reveal">
                        <h3 class="text-2xl font-bold text-white mb-2">VIP</h3>
                        <p class="text-gray-400 mb-4">برندسازی کامل</p>
                        <div class="text-4xl font-extrabold text-[#f59e0b] mb-6">۳۹ میلیون ت</div>
                        <ul class="text-sm text-gray-300 space-y-2 mb-6">
                            <li>✓ همه موارد Pro</li>
                            <li>✓ فروشگاه آنلاین</li>
                            <li>✓ مدیریت کامل اینستاگرام</li>
                            <li>✓ کمپین تبلیغاتی</li>
                            <li>✓ پشتیبانی ۱ ساله</li>
                        </ul>
                        <a href="request.php?pack=vip&price=39000000" class="btn btn-outline w-full mt-auto">سفارش آنلاین</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="py-20 container reveal">
            <div class="bg-gradient-to-r from-[#0f2027]/80 to-[#203a43]/80 backdrop-blur-md rounded-[30px] p-10 md:p-16 text-center text-white shadow-2xl border border-white/10">
                <h2 class="text-3xl md:text-5xl font-bold mb-6">آماده‌اید برندتان را طلایی کنید؟</h2>
                <p class="text-lg mb-8 max-w-2xl mx-auto">اولین جلسه مشاوره رایگان است. فرم زیر را پر کنید یا مستقیم تماس بگیرید.</p>
                <a href="contact.php" class="btn btn-primary text-2xl py-4 px-8 inline-flex items-center gap-2">
                    شروع کنید <i class="fas fa-rocket"></i>
                </a>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer role="contentinfo" style="background: rgba(15,32,39,0.95); backdrop-filter: blur(10px); color: white; padding-top: 60px; border-top-right-radius: 80px; margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.05);">
        <div class="container text-center pb-10">
            <div class="flex justify-center items-center gap-3 mb-6">
                <picture>
                    <source srcset="/images/logo.webp" type="image/webp">
                    <img src="/images/logo.png" width="50" height="50" loading="lazy" alt="لوگوی ازما">
                </picture>
                <span class="text-2xl font-bold"><?= htmlspecialchars($settings['site_name']) ?></span>
            </div>
            <div class="flex justify-center gap-6 text-2xl text-gray-400 mb-8">
                <a href="https://instagram.com/<?= $settings['instagram'] ?>" class="hover:text-white transition" aria-label="اینستاگرام"><i class="fab fa-instagram"></i></a>
                <a href="https://t.me/<?= $settings['telegram'] ?>" class="hover:text-white transition" aria-label="تلگرام"><i class="fab fa-telegram"></i></a>
                <a href="tel:<?= $settings['phone_1'] ?>" class="hover:text-white transition" aria-label="تماس"><i class="fas fa-phone"></i></a>
            </div>
            <p class="text-gray-600 text-sm border-t border-gray-800 pt-6">
                © 2025 تمامی حقوق برای آژانس دیجیتال مارکتینگ ازما محفوظ است. | طراحی و توسعه <strong>یاسین سالارناظم</strong>
            </p>
        </div>
    </footer>

    <!-- Chat Bot -->
    <div class="floating-widget bot-trigger" onclick="toggleChat()" role="button" aria-label="باز کردن چت با پشتیبان" tabindex="0" style="position: fixed; bottom: 85px; right: 20px; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; cursor: pointer; background: linear-gradient(45deg, #f59e0b, #ff7e5f); animation: pulse-glow 2s infinite; z-index: 1001;">
        <i class="fas fa-comments" aria-hidden="true"></i>
    </div>

    <!-- Chat Window -->
    <div id="chat-window" class="hidden fixed bottom-32 right-5 w-80 h-96 bg-[#0f2027] border border-[#f59e0b] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50" role="dialog" aria-modal="true" aria-labelledby="chat-title">
        <div class="bg-[#f59e0b] text-black p-4 flex justify-between items-center font-bold">
            <span id="chat-title" class="flex items-center gap-2"><i class="fas fa-robot" aria-hidden="true"></i> پشتیبان هوشمند</span>
            <button onclick="toggleChat()" class="hover:text-white" aria-label="بستن چت"><i class="fas fa-times" aria-hidden="true"></i></button>
        </div>
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-black/90" role="log" aria-live="polite">
            <div class="bg-white/10 text-white p-3 rounded-lg rounded-tr-none self-start max-w-[85%] chat-message">سلام! 👋 من دستیار هوشمند ازما هستم. چطور می‌تونم کمکتون کنم؟</div>
        </div>
        <form class="p-3 border-t border-white/10 flex gap-2" onsubmit="event.preventDefault(); sendMessage();">
            <label for="chat-input" class="sr-only">پیام شما</label>
            <input type="text" id="chat-input" placeholder="پیام شما..." class="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 outline-none focus:border-[#f59e0b]" aria-label="نوشتن پیام برای پشتیبان">
            <button type="submit" class="bg-[#f59e0b] text-black px-4 py-2 rounded-lg hover:bg-white transition" aria-label="ارسال پیام"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
        </form>
    </div>

    <!-- Defer Non-Critical -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
    <script src="https://cdn.tailwindcss.com" defer></script>

    <!-- Inline JS -->
    <script>
        // Chat
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const messages = document.getElementById('chat-messages');
            const msg = input.value.trim();
            if (!msg) return;
            messages.innerHTML += `<div class="flex justify-end"><div class="bg-[#f59e0b] text-black p-3 rounded-lg rounded-tl-none max-w-[85%]">${msg}</div></div>`;
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
            const typing = document.createElement('div');
            typing.id = 'typing';
            typing.className = 'bg-white/10 text-gray-400 p-3 rounded-lg text-xs';
            typing.textContent = 'در حال تایپ...';
            messages.appendChild(typing);
            try {
                const res = await fetch('gemini-api.php', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({message: msg, mode: 'chat'})});
                const data = await res.json();
                typing.remove();
                if (data.reply) messages.innerHTML += `<div class="flex justify-start"><div class="bg-white/10 text-white p-3 rounded-lg rounded-tr-none max-w-[90%]">${data.reply}</div></div>`;
            } catch {
                typing.remove();
                messages.innerHTML += `<div class="bg-red-500/20 text-red-300 p-3 rounded-lg text-xs">خطا در ارتباط. لطفاً دوباره تلاش کنید.</div>`;
            }
            messages.scrollTop = messages.scrollHeight;
        }
        function toggleChat() {
            const win = document.getElementById('chat-window');
            const btn = document.querySelector('.bot-trigger');
            win.classList.toggle('hidden');
            btn.setAttribute('aria-expanded', !win.classList.contains('hidden'));
            if (!win.classList.contains('hidden')) setTimeout(() => document.getElementById('chat-input').focus(), 100);
        }

        // Scroll Reveal
        const observer = new IntersectionObserver((entries) => entries.forEach(e => {if (e.isIntersecting) e.target.classList.add('active');}), {threshold: 0.1});
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    </script>

    <!-- Non-Critical CSS -->
    <style>
        /* Glass Card */
        .glass-card {
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: var(--radius);
            transition: 0.4s;
            overflow: hidden;
        }
        .glass-card:hover {
            border-color: var(--primary);
            background: rgba(255,255,255,0.08);
            transform: translateY(-8px);
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            border-radius: 50px;
            font-weight: 700;
            text-decoration: none;
            transition: 0.3s;
            cursor: pointer;
            border: none;
        }
        .btn-primary {
            background: linear-gradient(45deg, #f59e0b, #ff7e5f);
            color: white;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
        }
        .btn-outline {
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(5px);
        }
        .btn-outline:hover {
            background: white;
            color: var(--dark-bg);
            transform: translateY(-3px);
        }

        /* Nav */
        .nav-link {
            color: #cbd5e1;
            font-weight: 500;
            transition: 0.3s;
        }
        .nav-link:hover, .nav-link.active {
            color: var(--primary);
        }

        /* Animations */
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158