<?php
session_start();
require 'db.php';

$is_logged_in = isset($_SESSION['user_phone']);
$is_admin     = isset($_SESSION['admin_logged_in']);
$settings     = $conn->query("SELECT * FROM settings WHERE id=1")->fetch_assoc();

/* سئو صفحه درباره ما */
$seo_query = $conn->query("SELECT * FROM seo WHERE page_name='about'");
if ($seo_query->num_rows) {
    $seo = $seo_query->fetch_assoc();
} else {
    $seo = [
        'title'       => 'درباره ما | آژانس دیجیتال مارکتینگ ازما – طلایی کردن برندها',
        'description' => 'آشنایی با تیم بزرگ و حرفه‌ای ازما مارکتینگ | بیش از ۴۰ متخصص در حوزه‌های گرافیک، وب، سوشال، سئو، چاپ و ابزارهای هوشمند',
        'keywords'    => 'درباره ما, تیم ازما, آژانس دیجیتال مارکتینگ, اعضای مجموعه, طراح گرافیست, توسعه دهنده, ادمین اینستاگرام, متخصص سئو'
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
    <meta property="og:image" content="https://azmamarkteng.ir/images/about-og.webp">

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

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
      "@type": "AboutPage",
      "name": "<?= $seo['title'] ?>",
      "description": "<?= $seo['description'] ?>",
      "url": "https://azmamarkteng.ir/about.php",
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
                <a href="contact.php" class="btn btn-primary text-sm px-4 py-2" aria-label="همکاری تجاری">همکاری تجاری</a>
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
                    <li><a href="portfolio.php" class="nav-link">نمونه‌کارها</a></li>
                    <li><a href="about.php" class="nav-link active" aria-current="page">درباره ما</a></li>
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
        <section class="hero reveal" aria-labelledby="about-hero-title" style="padding-top: 160px; padding-bottom: 100px; text-align: center;">
            <div class="container">
                <h1 id="about-hero-title" class="text-4xl md:text-6xl font-extrabold text-white mb-6">
                    داستان <span class="text-[#f59e0b]">ازما</span>
                </h1>
                <p class="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
                    از ایده‌ای ساده در دل همدان تا بنایی بزرگ در دنیای دیجیتال؛ اینجا نقطه‌ای است که برندها طلایی می‌شوند.
                </p>
                <a href="#founder" class="btn btn-primary">ملاقات با بنیان‌گذار</a>
            </div>
        </section>

        <!-- درباره ازما مارکتینگ -->
        <section class="py-20" aria-labelledby="about-company-title">
            <div class="container">
                <h2 id="about-company-title" class="text-3xl font-bold text-center text-white mb-12 reveal">ازما مارکتینگ چیست؟</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div class="reveal">
                        <div class="glass-card p-6">
                            <h3 class="text-2xl font-bold text-white mb-4">ماموریت ما</h3>
                            <p class="text-gray-400 leading-7">
                                ما در ازما مارکتینگ باور داریم که هر برند ایرانی شایسته درخشش در سطح جهانی است. ماموریت ما این است که با ترکیب هنر، تکنولوژی و استراتژی، کسب‌وکارهای ایرانی را به بالاترین سطح استاندارد‌های بین‌المللی برسانیم.
                            </p>
                        </div>
                    </div>
                    <div class="reveal">
                        <div class="glass-card p-6">
                            <h3 class="text-2xl font-bold text-white mb-4">چشم‌انداز ۱۴۰۴</h3>
                            <p class="text-gray-400 leading-7">
                                تبدیل شدن به بزرگ‌ترین و معتبرترین آژانس دیجیتال مارکتینگ غرب کشور با بیش از ۱۰۰ متخصص حرفه‌ای و ارائه خدمات به برندهای ملی و بین‌المللی.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-10 reveal">
                    <div class="glass-card p-8 text-center">
                        <h3 class="text-2xl font-bold text-white mb-4">ارزش‌های اصلی ما</h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                            <div class="flex flex-col items-center">
                                <div class="w-16 h-16 bg-white/5 rounded-full mb-4 flex items-center justify-center text-2xl text-[#f59e0b]">
                                    <i class="fas fa-gem"></i>
                                </div>
                                <h4 class="text-white font-bold">کیفیت طلایی</h4>
                                <p class="text-gray-400 text-sm mt-1">استانداردهای جهانی</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-16 h-16 bg-white/5 rounded-full mb-4 flex items-center justify-center text-2xl text-[#00d2ff]">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <h4 class="text-white font-bold">نوآوری مداوم</h4>
                                <p class="text-gray-400 text-sm mt-1">آخرین تکنولوژی‌ها</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-16 h-16 bg-white/5 rounded-full mb-4 flex items-center justify-center text-2xl text-green-400">
                                    <i class="fas fa-handshake"></i>
                                </div>
                                <h4 class="text-white font-bold">صداقت کامل</h4>
                                <p class="text-gray-400 text-sm mt-1">شفافیت در همه چیز</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="w-16 h-16 bg-white/5 rounded-full mb-4 flex items-center justify-center text-2xl text-purple-400">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h4 class="text-white font-bold">تمرکز بر انسان</h4>
                                <p class="text-gray-400 text-sm mt-1">ارزش آفرینی برای مشتری</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- بنیان‌گذار -->
        <section id="founder" class="py-20" aria-labelledby="founder-title">
            <div class="container">
                <h2 id="founder-title" class="sr-only">بنیان‌گذار آژانس ازما</h2>
                <div class="founder-card reveal">
                    <div class="founder-img">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/yasin.jpg" type="image/webp">
                            <img src="https://azmamarkteng.ir/yasin.jpg" width="320" height="320" loading="lazy" alt="یاسین سالارناظم - بنیان‌گذار آژانس ازما">
                        </picture>
                        <div class="absolute -bottom-6 -right-6 bg-white text-black px-4 py-1 rounded-full shadow-lg flex items-center gap-2 border-4 border-[#0f2027] text-sm md:text-base">
                            <i class="fas fa-check-circle text-blue-600"></i><span class="font-bold">Founder & CEO</span>
                        </div>
                    </div>
                    <div class="founder-info">
                        <h2 class="text-3xl md:text-5xl font-bold text-white mb-2">یاسین سالارناظم</h2>
                        <h3 class="text-lg md:text-xl text-[#f59e0b] mb-6 tracking-[3px] font-bold uppercase border-b border-white/10 pb-4 inline-block">بنیان‌گذار آژانس دیجیتال مارکتینگ ازما</h3>
                        <p class="text-gray-200 text-lg leading-9 mb-6">
                            در دنیایی که همه به دنبال دیده‌شدن هستند، تنها کسانی ماندگار می‌شوند که <strong class="text-white font-bold">هویت</strong> داشته باشند. من، <strong>یاسین سالارناظم</strong>، فعالیت حرفه‌ای خود را ۶ سال پیش با یک چشم‌انداز بزرگ آغاز کردم: <span class="text-[#f59e0b] font-bold">ارتقای استانداردهای دیجیتال مارکتینگ در ایران به سطح جهانی.</span>
                        </p>
                        <p class="text-gray-400 text-lg leading-9 mb-8">
                            با تکیه بر دانش روز و اخذ معتبرترین گواهینامه‌های بین‌المللی از غول‌های تکنولوژی دنیا (Google و IBM)، مجموعه‌ای را پایه‌گذاری کردم که امروز نماد کیفیت و نوآوری در غرب کشور است.
                        </p>
                        <div class="flex items-center gap-6 flex-wrap">
                            <a href="https://instagram.com/<?= $settings['instagram'] ?>" class="flex items-center gap-3 text-black bg-white px-6 py-3 rounded-full hover:bg-[#f59e0b] hover:text-black transition font-bold shadow-lg">
                                <i class="fab fa-instagram text-2xl"></i> اینستاگرام من
                            </a>
                            <div class="text-gray-500 text-xs tracking-widest border-r border-gray-600 pr-6 uppercase hidden md:block">Certified by Google & IBM</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- اعضای مجموعه (تیم بزرگ) -->
        <section class="py-20" aria-labelledby="team-title">
            <div class="container">
                <h2 id="team-title" class="text-3xl font-bold text-center text-white mb-12 reveal">تیم حرفه‌ای ازما (۴۲ متخصص)</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- طراح ارشد گرافیک -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team1.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team1.jpg" width="200" height="200" loading="lazy" alt="سارا احمدی - طراح ارشد گرافیک" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">سارا احمدی</h4>
                        <p class="text-[#f59e0b] text-sm">طراح ارشد گرافیک</p>
                        <p class="text-gray-400 text-xs mt-2">۱۲ سال سابقه | متخصص برندینگ</p>
                    </div>
                    <!-- توسعه دهنده ارشد -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team2.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team2.jpg" width="200" height="200" loading="lazy" alt="علی کریمی - توسعه دهنده ارشد" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">علی کریمی</h4>
                        <p class="text-[#00d2ff] text-sm">توسعه دهنده ارشد</p>
                        <p class="text-gray-400 text-xs mt-2">۱۰ سال سابقه | متخصص Laravel</p>
                    </div>
                    <!-- ادمین سوشال مدیا -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team3.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team3.jpg" width="200" height="200" loading="lazy" alt="زهرا محمدی - ادمین سوشال مدیا" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">زهرا محمدی</h4>
                        <p class="text-pink-400 text-sm">ادمین سوشال مدیا</p>
                        <p class="text-gray-400 text-xs mt-2">۸ سال سابقه | متخصص اینستاگرام</p>
                    </div>
                    <!-- متخصص سئو -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team4.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team4.jpg" width="200" height="200" loading="lazy" alt="رضا رحیمی - متخصص سئو" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">رضا رحیمی</h4>
                        <p class="text-green-400 text-sm">متخصص سئو</p>
                        <p class="text-gray-400 text-xs mt-2">۹ سال سابقه | متخصص لوکال سئو</p>
                    </div>
                    <!-- مدیر چاپ -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team5.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team5.jpg" width="200" height="200" loading="lazy" alt="مریم نوری - مدیر چاپ" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">مریم نوری</h4>
                        <p class="text-purple-400 text-sm">مدیر چاپ</p>
                        <p class="text-gray-400 text-xs mt-2">۱۵ سال سابقه | متخصص چاف افست</p>
                    </div>
                    <!-- متخصص ابزارهای هوشمند -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team6.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team6.jpg" width="200" height="200" loading="lazy" alt="حسین اکبری - متخصص ابزارهای هوشمند" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">حسین اکبری</h4>
                        <p class="text-blue-400 text-sm">متخصص ابزارهای هوشمند</p>
                        <p class="text-gray-400 text-xs mt-2">۶ سال سابقه | متخصص NFC و USSD</p>
                    </div>
                    <!-- طراح موشن -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team7.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team7.jpg" width="200" height="200" loading="lazy" alt="لیلا حسینی - طراح موشن" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">لیلا حسینی</h4>
                        <p class="text-red-400 text-sm">طراح موشن</p>
                        <p class="text-gray-400 text-xs mt-2">۷ سال سابقه | متخصص After Effects</p>
                    </div>
                    <!-- تحلیلگر داده -->
                    <div class="glass-card group reveal text-center p-4">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/team/team8.webp" type="image/webp">
                            <img src="https://azmamarkteng.ir/team/team8.jpg" width="200" height="200" loading="lazy" alt="محمد رضایی - تحلیلگر داده" class="mx-auto">
                        </picture>
                        <h4 class="text-white font-bold text-lg mt-4">محمد رضایی</h4>
                        <p class="text-indigo-400 text-sm">تحلیلگر داده</p>
                        <p class="text-gray-400 text-xs mt-2">۵ سال سابقه | متخصص Google Analytics</p>
                    </div>
                </div>
                <div class="text-center mt-10 reveal">
                    <p class="text-gray-400 text-lg">و بیش از ۳۴ متخصص دیگر در حوزه‌های مختلف</p>
                    <a href="contact.php" class="btn btn-primary mt-6">همکاری با ما</a>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="py-20 container reveal">
            <div class="bg-gradient-to-r from-[#0f2027]/80 to-[#203a43]/80 backdrop-blur-md rounded-[30px] p-10 md:p-16 text-center text-white shadow-2xl border border-white/10">
                <h2 class="text-3xl md:text-5xl font-bold mb-6">آماده‌اید برندتان را طلایی کنید؟</h2>
                <p class="text-lg mb-8 max-w-2xl mx-auto">با تیم ۴۲ نفره ما، مسیر موفقیت را طی کنید. اولین جلسه مشاوره رایگان است.</p>
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
                    <source srcset="https://azmamarkteng.ir/logo.webp" type="image/webp">
                    <img src="https://azmamarkteng.ir/logo.png" width="50" height="50" loading="lazy" alt="لوگوی ازما">
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
        /* Founder Card */
        .founder-card {
            display: flex;
            flex-direction: row;
            gap: 50px;
            padding: 50px;
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.6) 100%);
            border-radius: var(--radius);
            border: 1px solid rgba(245, 158, 11, 0.3);
            align-items: center;
            position: relative;
        }
        .founder-img {
            position: relative;
            flex-shrink: 0;
        }
        .founder-img img {
            width: 320px;
            height: 320px;
            object-fit: cover;
            border-radius: var(--radius);
            border: 2px solid var(--primary);
        }
        .founder-info {
            flex: 1;
        }
        .founder-info h2 {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 0.5rem;
        }
        .founder-info h3 {
            font-size: 1.25rem;
            color: var(--primary);
            letter-spacing: 3px;
            font-weight: 700;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 1rem;
            display: inline-block;
            margin-bottom: 1.5rem;
        }
        .founder-info p {
            font-size: 1.125rem;
            line-height: 1.8;
            color: #e0f7fa;
            margin-bottom: 1.5rem;
        }
        .founder-info p strong {
            color: white;
            font-weight: 700;
        }
        .founder-info p span {
            color: var(--primary);
            font-weight: 700;
        }
        .founder-info .flex {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            flex-wrap: wrap;
        }
        .founder-info a {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: white;
            color: black;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            transition: background 0.3s, color 0.3s;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .founder-info a:hover {
            background: var(--primary);
            color: black;
        }
        .founder-info .border-r {
            border-right: 1px solid #4a5568;
            padding-right: 1.5rem;
        }
        .founder-info .text-xs {
            font-size: 0.75rem;
            color: #9ca3af;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

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
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .founder-card {
                flex-direction: column;
                padding: 30px;
                text-align: center;
            }
            .founder-img {
                margin-bottom: 2rem;
            }
            .founder-img img {
                width: 200px;
                height: 200px;
            }
            .founder-info {
                padding-left: 0;
                text-align: center !important;
            }
            .founder-info .flex {
                justify-content: center;
            }
            .founder-info .border-r {
                display: none;
            }
        }
    </style>
</body>
</html>