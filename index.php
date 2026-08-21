<?php
session_start();
require 'db.php';

// بررسی وضعیت لاگین
$is_logged_in = isset($_SESSION['user_phone']);
$is_admin = isset($_SESSION['admin_logged_in']);

// دریافت تنظیمات
$settings_query = $conn->query("SELECT * FROM settings WHERE id=1");
$settings = $settings_query ? $settings_query->fetch_assoc() : [
    'site_name' => 'آژانس دیجیتال مارکتینگ ازما',
    'phone_1' => '09914601322',
    'phone_2' => '09300521812',
    'instagram' => 'yasinsalarnazm',
    'telegram' => 'yasinsalarnazm',
    'address' => 'همدان، شهرک مدنی، بلوار امام خمینی'
];

// سئو
$seo_query = $conn->query("SELECT * FROM seo WHERE page_name='index'");
$seo = $seo_query ? $seo_query->fetch_assoc() : [
    'title' => 'آژانس دیجیتال مارکتینگ ازما | رشد کسب‌وکار شما',
    'description' => 'بهترین خدمات طراحی سایت، سئو و گرافیک در غرب کشور. فروش خود را ۳ برابر کنید!',
    'keywords' => 'طراحی سایت, سئو, همدان, گرافیک, دیجیتال مارکتینگ, اینستاگرام'
];
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title><?php echo $seo['title']; ?></title>
    <meta name="description" content="<?php echo $seo['description']; ?>">
    <meta name="keywords" content="<?php echo $seo['keywords']; ?>">
    <meta name="author" content="یاسین سالارناظم">
    <meta property="og:title" content="<?php echo $seo['title']; ?>">
    <meta property="og:description" content="<?php echo $seo['description']; ?>">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "DigitalMarketingAgency",
      "name": "<?php echo $settings['site_name']; ?>",
      "founder": {
        "@type": "Person",
        "name": "یاسین سالارناظم",
        "certification": ["Google AI", "IBM IT"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "همدان",
        "addressRegion": "همدان",
        "addressCountry": "IR"
      },
      "telephone": "<?php echo $settings['phone_1']; ?>"
    }
    </script>
    
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');
        
        :root {
            --primary: #f59e0b;
            --primary-dark: #d97706;
            --secondary: #0f2027;
            --text-main: #ffffff;
            --text-light: #cbd5e1;
        }

        * { box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
        
        body {
            background: url('body-bg.jpg') no-repeat center center fixed;
            background-size: cover;
            color: var(--text-main);
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* Accessibility Improvements */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

        /* Skip to main content link for screen readers */
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: black;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 9999;
            transition: top 0.3s;
        }
        .skip-link:focus { top: 6px; }

        header {
            background: rgba(15, 32, 39, 0.95);
            backdrop-filter: blur(15px);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .nav-link {
            color: #e2e8f0;
            font-weight: 500;
            transition: 0.3s;
        }
        .nav-link:hover, .nav-link.active { color: var(--primary); }

        .mobile-menu {
            position: fixed; top: 0; right: -100%; width: 85%; height: 100vh;
            background: rgba(15, 32, 39, 0.98); backdrop-filter: blur(10px);
            z-index: 2000; transition: 0.4s; padding: 2rem; color: white;
        }
        .mobile-menu.active { right: 0; }

        .btn {
            padding: 12px 28px;
            border-radius: 50px;
            font-weight: 700;
            transition: 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            text-decoration: none;
        }
        .btn-primary {
            background: linear-gradient(45deg, var(--primary), #d97706);
            color: white;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
            border: none;
        }
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.4);
        }
        .btn-outline {
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(5px);
        }
        .btn-outline:hover {
            background: white;
            color: var(--secondary);
            transform: translateY(-3px);
        }

        .hero {
            padding-top: 160px;
            padding-bottom: 100px;
            position: relative;
        }

        /* Main landmark for accessibility */
        main {
            display: block;
        }

        .card-3d {
            background: rgba(15, 32, 39, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            padding: 30px;
            transition: all 0.4s;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.05);
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .card-3d:hover {
            transform: translateY(-10px);
            background: rgba(15, 32, 39, 0.8);
            border-color: var(--primary);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        
        .card-icon {
            width: 60px; height: 60px;
            background: rgba(245, 158, 11, 0.1);
            color: var(--primary);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            transition: 0.3s;
        }
        .card-3d:hover .card-icon {
            background: var(--primary);
            color: white;
            transform: rotateY(180deg);
        }

        .portfolio-card {
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            height: 300px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .portfolio-img {
            width: 100%; height: 100%; object-fit: cover;
            transition: 0.5s;
        }
        .portfolio-overlay {
            position: absolute; bottom: -100%; left: 0; width: 100%;
            background: linear-gradient(0deg, rgba(15, 32, 39, 0.95) 0%, transparent 100%);
            padding: 20px;
            color: white;
            transition: 0.3s;
        }
        .portfolio-card:hover .portfolio-img { transform: scale(1.1); }
        .portfolio-card:hover .portfolio-overlay { bottom: 0; }

        footer {
            background: rgba(15, 32, 39, 0.95);
            backdrop-filter: blur(10px);
            color: white;
            padding-top: 60px;
            border-top-right-radius: 80px;
            margin-top: 60px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-link { color: #94a3b8; transition: 0.3s; }
        .footer-link:hover { color: var(--primary); padding-right: 5px; }

        .floating-widget {
            position: fixed; right: 20px; z-index: 1001;
            background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: all 0.3s ease;
        }
        
        .bot-trigger {
            bottom: 85px; width: 60px; height: 60px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.8rem; color: white;
            cursor: pointer;
            background: linear-gradient(45deg, var(--primary), #ff7e5f);
            animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }

        .reveal { opacity: 0; transform: translateY(30px); transition: 0.8s; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.2rem; }
            .desktop-nav { display: none; }
            .mobile-btn { display: block; }
            .bot-trigger { bottom: 140px; right: 10px; width: 50px; height: 50px; font-size: 1.5rem; }
        }
        .mobile-btn { display: none; font-size: 1.5rem; color: white; cursor: pointer; }

        /* Chat Window Styles */
        #chat-window {
            width: 320px;
            height: 400px;
            max-height: 70vh;
        }
        .chat-message {
            max-width: 85%;
            word-wrap: break-word;
        }

        /* Focus styles for keyboard navigation */
        button:focus, a:focus, input:focus {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .btn-outline {
                border-width: 2px;
            }
        }

        /* ========================================
           تنظیمات دقیق موبایل - مطابق اسکرین‌شات
           ======================================== */

        @media (max-width: 480px) {
            /* Header موبایل */
            header .container {
                height: 60px;
                padding: 0 0.75rem;
            }
            
            header img {
                height: 30px;
            }
            
            header .btn {
                padding: 6px 12px;
                font-size: 0.75rem;
            }
            
            header .flex.gap-3 {
                gap: 0.4rem;
            }

            /* Hero Section - مطابق اسکرین‌شات */
            .hero {
                padding-top: 80px;
                padding-bottom: 40px;
            }
            
            .hero .container {
                padding: 0 1rem;
            }
            
            .hero span.text-\[\#f59e0b\] {
                font-size: 0.7rem;
                padding: 4px 10px;
            }
            
            .hero h1 {
                font-size: 1.5rem !important;
                line-height: 1.3;
                margin-top: 0.75rem;
                margin-bottom: 0.75rem;
            }
            
            .hero p {
                font-size: 0.75rem;
                line-height: 1.5;
                margin-bottom: 1.25rem;
            }
            
            .hero .flex.flex-col.sm\:flex-row {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .hero .btn {
                width: 100%;
                justify-content: center;
                padding: 10px 20px;
                font-size: 0.813rem;
            }
            
            .hero img {
                margin-top: 1.5rem;
                border-radius: 20px;
            }

            /* Services Section - مطابق اسکرین‌شات */
            section.py-20 {
                padding-top: 2.5rem;
                padding-bottom: 2.5rem;
            }
            
            section h2 {
                font-size: 1.5rem !important;
                margin-bottom: 0.5rem;
            }
            
            section p.text-gray-400 {
                font-size: 0.813rem;
            }
            
            .text-center.mb-16 {
                margin-bottom: 2rem !important;
            }
            
            /* Service Cards */
            .card-3d {
                padding: 1.25rem;
                margin-bottom: 0.75rem;
                border-radius: 16px;
            }
            
            .card-icon {
                width: 45px;
                height: 45px;
                font-size: 1.3rem;
                margin-bottom: 0.75rem;
                border-radius: 12px;
            }
            
            .card-3d h3 {
                font-size: 0.938rem;
                margin-bottom: 0.5rem;
                font-weight: 700;
            }
            
            .card-3d p {
                font-size: 0.75rem;
                line-height: 1.4;
                margin-bottom: 0.5rem;
            }
            
            .card-3d ul {
                font-size: 0.688rem;
            }
            
            .card-3d ul li {
                line-height: 1.3;
                margin-bottom: 0.15rem;
            }

            /* Portfolio Section */
            .portfolio-card {
                height: 200px;
                margin-bottom: 0.75rem;
                border-radius: 16px;
            }
            
            .portfolio-overlay {
                padding: 1rem;
            }
            
            .portfolio-overlay h3 {
                font-size: 0.938rem;
            }
            
            .portfolio-overlay p {
                font-size: 0.688rem;
            }
            
            .portfolio-overlay span {
                font-size: 0.688rem;
            }
            
            .flex.justify-between.items-end.mb-12 {
                margin-bottom: 1.5rem !important;
            }

            /* Testimonials */
            .card-3d .flex.items-center.gap-4 img {
                width: 35px;
                height: 35px;
            }
            
            .card-3d .flex.items-center.gap-4 h3 {
                font-size: 0.875rem;
            }
            
            .card-3d .flex.items-center.gap-4 p {
                font-size: 0.688rem;
            }
            
            .card-3d blockquote {
                font-size: 0.75rem;
                line-height: 1.4;
            }
            
            .text-yellow-400 {
                font-size: 0.875rem;
                margin-top: 0.5rem;
            }

            /* FAQ Section */
            details {
                padding: 0.875rem !important;
                border-radius: 12px;
                margin-bottom: 0.5rem;
            }
            
            details summary {
                font-size: 0.813rem;
                line-height: 1.4;
                font-weight: 600;
            }
            
            details p {
                font-size: 0.75rem;
                line-height: 1.4;
                margin-top: 0.5rem;
            }

            /* CTA Section */
            .bg-gradient-to-r {
                padding: 2rem 1.25rem !important;
                border-radius: 20px;
                margin: 0 1rem;
            }
            
            .bg-gradient-to-r h2 {
                font-size: 1.25rem !important;
                line-height: 1.3;
                margin-bottom: 0.75rem;
            }
            
            .bg-gradient-to-r p {
                font-size: 0.75rem;
                line-height: 1.4;
                margin-bottom: 1.25rem;
            }
            
            .bg-gradient-to-r .btn {
                font-size: 0.938rem;
                padding: 12px 24px;
            }

            /* Footer */
            footer {
                padding-top: 2.5rem;
                border-top-right-radius: 40px;
                margin-top: 2.5rem;
            }
            
            footer .container {
                padding-bottom: 1.5rem;
            }
            
            footer .grid {
                gap: 2rem;
            }
            
            footer img {
                height: 32px;
            }
            
            footer .text-2xl {
                font-size: 1.1rem;
            }
            
            footer h3 {
                font-size: 1rem;
                margin-bottom: 1rem;
            }
            
            footer p, footer a, footer address {
                font-size: 0.75rem;
                line-height: 1.5;
            }
            
            footer .space-y-3 {
                gap: 0.5rem;
            }
            
            footer .border-t {
                padding-top: 1rem;
                padding-bottom: 1rem;
                font-size: 0.688rem;
            }

            /* Chat Window */
            #chat-window {
                width: 88% !important;
                max-width: 320px;
                right: 6% !important;
                bottom: 90px;
                height: 400px;
                border-radius: 16px;
            }
            
            #chat-messages {
                font-size: 0.75rem;
                padding: 0.75rem;
            }
            
            #chat-messages .chat-message {
                padding: 0.5rem 0.75rem;
                font-size: 0.75rem;
            }
            
            #chat-input {
                font-size: 0.813rem;
                padding: 0.5rem 0.75rem;
            }
            
            #chat-window .p-4 {
                padding: 0.75rem;
            }
            
            #chat-window button[type="submit"] {
                padding: 0.5rem 0.75rem;
            }

            /* Floating Bot Button */
            .bot-trigger {
                width: 50px !important;
                height: 50px !important;
                font-size: 1.4rem !important;
                bottom: 20px !important;
                right: 15px !important;
            }

            /* Mobile Menu */
            .mobile-menu {
                width: 75%;
                padding: 1.5rem;
            }
            
            .mobile-menu img {
                height: 28px;
            }
            
            .mobile-menu ul {
                font-size: 0.938rem;
                gap: 1.25rem;
            }
            
            .mobile-menu button {
                font-size: 1.5rem;
            }

            /* Grid Adjustments */
            .grid {
                gap: 1rem;
            }
            
            .grid.gap-8 {
                gap: 1rem;
            }
            
            .grid.gap-6 {
                gap: 0.75rem;
            }

            /* Container */
            .container {
                padding-left: 1rem;
                padding-right: 1rem;
            }

            /* Spacing */
            .mb-16 {
                margin-bottom: 2rem !important;
            }
            
            .mb-12 {
                margin-bottom: 1.5rem !important;
            }
            
            .mb-8 {
                margin-bottom: 1.25rem !important;
            }
            
            .mb-6 {
                margin-bottom: 1rem !important;
            }
            
            .mt-8 {
                margin-top: 1.25rem !important;
            }
            
            .gap-10 {
                gap: 2rem;
            }
            
            .gap-12 {
                gap: 2rem;
            }

            /* Text Center for Mobile */
            .text-center.md\:text-right {
                text-align: center;
            }

            /* Hidden on Mobile */
            .hidden.md\:flex {
                display: none !important;
            }
            
            .hidden.md\:block {
                display: none !important;
            }

            /* Buttons */
            .btn {
                font-size: 0.813rem;
            }
        }

        @media (max-width: 768px) and (min-width: 481px) {
            /* Tablet - بین موبایل و دسکتاپ */
            .hero h1 {
                font-size: 2rem;
            }
            
            .card-3d {
                padding: 1.5rem;
            }
            
            section h2 {
                font-size: 1.875rem;
            }
        }
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">ردیف به محتوای اصلی</a>

    <header role="banner">
        <div class="container mx-auto px-4 h-20 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <button class="mobile-btn" onclick="toggleMenu()" aria-label="منوی موبایل" aria-expanded="false" aria-controls="mobileMenu">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
                
                <a href="index.php" class="flex items-center gap-2" aria-label="صفحه اصلی <?php echo $settings['site_name']; ?>">
                    <picture>
                        <source srcset="logo.webp" type="image/webp">
                        <img src="logo.png" alt="لوگوی آژانس دیجیتال مارکتینگ ازما" class="h-10" style="filter: drop-shadow(0 0 10px rgba(245,158,11,0.5));">
                    </picture>
                    <span class="font-extrabold text-xl text-white hidden md:block"><?php echo $settings['site_name']; ?></span>
                </a>
            </div>

            <nav class="desktop-nav hidden md:block" role="navigation" aria-label="ناوبری اصلی">
                <ul class="flex gap-8">
                    <li><a href="index.php" class="nav-link active" aria-current="page">خانه</a></li>
                    <li><a href="services.php" class="nav-link">خدمات</a></li>
                    <li><a href="portfolio.php" class="nav-link">نمونه‌کار</a></li>
                    <li><a href="about.php" class="nav-link">درباره ما</a></li>
                    <li><a href="contact.php" class="nav-link">تماس</a></li>
                </ul>
            </nav>

            <div class="flex items-center gap-3">
                <?php if(!$is_logged_in): ?>
                    <a href="login.php" class="btn btn-outline py-2 px-6 text-sm" aria-label="ورود به حساب کاربری">ورود</a>
                    <a href="contact.php" class="btn btn-primary py-2 px-6 text-sm" aria-label="دریافت مشاوره رایگان">مشاوره رایگان</a>
                <?php else: ?>
                    <a href="dashboard.php" class="btn btn-primary py-2 px-6 text-sm" aria-label="ورود به داشبورد">داشبورد من</a>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
        <div class="flex justify-between items-center mb-8">
            <h2 id="mobile-menu-title" class="sr-only">منوی موبایل</h2>
            <picture>
                <source srcset="logo.webp" type="image/webp">
                <img src="logo.png" alt="لوگوی آژانس ازما" class="h-8" style="filter: drop-shadow(0 0 5px rgba(245,158,11,0.5));">
            </picture>
            <button onclick="toggleMenu()" aria-label="بستن منوی موبایل"><i class="fas fa-times text-2xl"></i></button>
        </div>
        <ul class="space-y-6 font-bold text-lg" role="list">
            <li><a href="index.php" class="text-[#f59e0b]" aria-current="page">خانه</a></li>
            <li><a href="services.php">خدمات ما</a></li>
            <li><a href="portfolio.php">نمونه‌کارها</a></li>
            <li><a href="about.php">درباره ما</a></li>
            <li><a href="contact.php">تماس با ما</a></li>
        </ul>
    </div>
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1999;opacity:0;visibility:hidden;transition:0.3s;" id="overlay" onclick="toggleMenu()" aria-hidden="true"></div>

    <main id="main-content" role="main">
        <section class="hero" aria-labelledby="hero-title">
            <div class="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                <div class="text-center md:text-right reveal">
                    <span class="text-[#f59e0b] font-bold tracking-wider bg-[#f59e0b]/10 px-3 py-1 rounded-full text-sm">تخصصی‌ترین آژانس غرب کشور</span>
                    <h1 id="hero-title" class="text-4xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
                        جایی که برندها <br> <span class="text-[#f59e0b]">طلا می‌شوند</span>
                    </h1>
                    <p class="text-gray-300 text-lg mb-8 leading-8 font-medium">
                        ما با عنوان بهترین <a href="/blog/آژانس-دیجیتال-مارکتینگ-در-همدان.php" style="color:#f59e0b;font-weight:700;">آژانس دیجیتال مارکتینگ در همدان</a>، با طراحی سایت اختصاصی، سئو قدرتمند و مدیریت شبکه‌های اجتماعی، مسیر موفقیت کسب‌وکار شما را هموار می‌کنیم.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a href="services.php" class="btn btn-primary" aria-label="مشاهده خدمات ما">
                            خدمات ما <i class="fas fa-arrow-left" aria-hidden="true"></i>
                        </a>
                        <a href="contact.php" class="btn btn-outline rounded-full" aria-label="دریافت مشاوره رایگان">
                            دریافت مشاوره
                        </a>
                    </div>
                </div>
                <div class="reveal delay-200 relative">
                    <picture>
                        <source srcset="https://azmamarkteng.ir/hero-image.webp" type="image/webp">
                        <img 
                            src="https://azmamarkteng.ir/hero-image.jpg" 
                            alt="طلایی کردن کسب‌وکار با آژانس دیجیتال مارکتینگ ازما" 
                            class="w-full rounded-[30px] shadow-2xl border-4 border-white/20"
                            width="596" 
                            height="333"
                            loading="eager"
                            fetchpriority="high"
                        >
                    </picture>
                </div>
            </div>
        </section>

        <section class="py-20" aria-labelledby="services-title">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16 reveal">
                    <h2 id="services-title" class="text-3xl md:text-4xl font-bold text-white">خدمات <span class="text-[#f59e0b]">طلایی</span> ما</h2>
                    <p class="text-gray-400 font-medium mt-2">از صفر تا صد کسب‌وکار خود را به ما بسپارید</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <article class="card-3d reveal">
                        <div class="card-icon" aria-hidden="true">
                            <i class="fas fa-brush"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-3">طراحی هویت بصری</h3>
                        <p class="text-gray-400 text-sm leading-6 mb-4">
                            لوگو، ست اداری، بنر، کاتالوگ و همه چیز برای برندینگ حرفه‌ای شما.
                        </p>
                        <ul class="text-xs text-gray-500 space-y-1" aria-label="ویژگی‌های طراحی هویت بصری">
                            <li>✓ طراحی لوگو منحصربه‌فرد</li>
                            <li>✓ کارت ویزیت و سربرگ</li>
                            <li>✓ بسته‌بندی محصولات</li>
                        </ul>
                    </article>
                    
                    <article class="card-3d reveal">
                        <div class="card-icon" aria-hidden="true">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-3">طراحی سایت</h3>
                        <p class="text-gray-400 text-sm leading-6 mb-4">
                            سایت‌های مدرن، سریع و واکنش‌گرا با بهترین تکنولوژی‌های روز دنیا.
                        </p>
                        <ul class="text-xs text-gray-500 space-y-1" aria-label="ویژگی‌های طراحی سایت">
                            <li>✓ سایت فروشگاهی</li>
                            <li>✓ سایت شرکتی</li>
                            <li>✓ سایت شخصی</li>
                        </ul>
                    </article>
                    
                    <article class="card-3d reveal">
                        <div class="card-icon" aria-hidden="true">
                            <i class="fas fa-search"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-3">بهینه‌سازی SEO</h3>
                        <p class="text-gray-400 text-sm leading-6 mb-4">
                            سایت شما را به صفحه اول گوگل می‌رسانیم. تضمینی!
                        </p>
                        <ul class="text-xs text-gray-500 space-y-1" aria-label="ویژگی‌های سئو">
                            <li>✓ تحلیل کلمات کلیدی</li>
                            <li>✓ بهینه‌سازی تکنیکال</li>
                            <li>✓ لینک‌سازی داخلی و خارجی</li>
                        </ul>
                    </article>
                    
                    <article class="card-3d reveal">
                        <div class="card-icon" aria-hidden="true">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-3">مدیریت اینستاگرام</h3>
                        <p class="text-gray-400 text-sm leading-6 mb-4">
                            پیج شما را به یک برند موفق تبدیل می‌کنیم. فالوور واقعی، فروش واقعی.
                        </p>
                        <ul class="text-xs text-gray-500 space-y-1" aria-label="ویژگی‌های مدیریت اینستاگرام">
                            <li>✓ تولید محتوای هدفمند</li>
                            <li>✓ افزایش فالوور واقعی</li>
                            <li>✓ مدیریت کامنت و دایرکت</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>

        <section class="py-20 glass-panel" aria-labelledby="portfolio-title">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-end mb-12 reveal">
                    <div>
                        <h2 id="portfolio-title" class="text-3xl font-bold text-white">پروژه‌های <span class="text-[#f59e0b]">موفق</span> ما</h2>
                        <p class="text-gray-400 mt-2">نتیجه کار ما را ببینید</p>
                    </div>
                    <a href="portfolio.php" class="btn btn-outline hidden md:flex rounded-full" aria-label="مشاهده همه نمونه کارها">مشاهده همه</a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <article class="portfolio-card reveal">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/portfolio/food-website.webp" type="image/webp">
                            <img 
                                src="https://azmamarkteng.ir/portfolio/food-website.jpg" 
                                class="portfolio-img" 
                                alt="سایت رستوران طعم خاص - طراحی و سئو"
                                width="444" 
                                height="298"
                                loading="lazy"
                            >
                        </picture>
                        <div class="portfolio-overlay">
                            <span class="text-[#f59e0b] text-sm font-bold mb-1 block">رستوران طعم خاص</span>
                            <h3 class="text-xl font-bold">طراحی سایت + سئو</h3>
                            <p class="text-gray-300 text-xs mt-2">افزایش ۳۰۰٪ رزرو آنلاین در ۲ ماه</p>
                        </div>
                    </article>
                    
                    <article class="portfolio-card reveal">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/portfolio/clothing-store.webp" type="image/webp">
                            <img 
                                src="https://azmamarkteng.ir/portfolio/clothing-store.jpg" 
                                class="portfolio-img" 
                                alt="فروشگاه پوشاک مردانه - مدیریت اینستاگرام"
                                width="444" 
                                height="298"
                                loading="lazy"
                            >
                        </picture>
                        <div class="portfolio-overlay">
                            <span class="text-[#f59e0b] text-sm font-bold mb-1 block">فروشگاه مردانه</span>
                            <h3 class="text-xl font-bold">مدیریت اینستاگرام</h3>
                            <p class="text-gray-300 text-xs mt-2">از ۲k به ۴۵k فالوور در ۶ ماه</p>
                        </div>
                    </article>
                    
                    <article class="portfolio-card reveal">
                        <picture>
                            <source srcset="https://azmamarkteng.ir/portfolio/travel-agency.webp" type="image/webp">
                            <img 
                                src="https://azmamarkteng.ir/portfolio/travel-agency.jpg" 
                                class="portfolio-img" 
                                alt="آژانس مسافرتی - کمپین تبلیغاتی"
                                width="444" 
                                height="298"
                                loading="lazy"
                            >
                        </picture>
                        <div class="portfolio-overlay">
                            <span class="text-[#f59e0b] text-sm font-bold mb-1 block">آژانس گردشگری</span>
                            <h3 class="text-xl font-bold">کمپین تبلیغاتی</h3>
                            <p class="text-gray-300 text-xs mt-2">فروش ۲۵۰٪ بیشتر در نوروز</p>
                        </div>
                    </article>
                </div>
                
                <div class="text-center mt-8 md:hidden">
                    <a href="portfolio.php" class="btn btn-outline w-full justify-center rounded-full" aria-label="مشاهده همه نمونه کارها">مشاهده همه</a>
                </div>
            </div>
        </section>

        <section class="py-20" aria-labelledby="testimonials-title">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16 reveal">
                    <h2 id="testimonials-title" class="text-3xl font-bold text-white">نظرات <span class="text-[#f59e0b]">مشتریان</span></h2>
                    <p class="text-gray-400 font-medium mt-2">صداقت در کار، راز موفقیت ماست</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <article class="card-3d reveal">
                        <div class="flex items-center gap-4 mb-4">
                            <picture>
                                <source srcset="https://azmamarkteng.ir/avatar/client1.webp" type="image/webp">
                                <img src="https://azmamarkteng.ir/avatar/client1.jpg" class="w-12 h-12 rounded-full border-2 border-[#f59e0b]" loading="lazy" width="48" height="48" alt="محمدرضا شریفی - صاحب رستوران">
                            </picture>
                            <div>
                                <h3 class="font-bold text-white">محمدرضا شریفی</h3>
                                <p class="text-gray-400 text-xs">صاحب رستوران</p>
                            </div>
                        </div>
                        <blockquote class="text-gray-300 text-sm leading-6">
                            "بعد از ۳ ماه همکاری، مشتری‌های آنلاین من ۳ برابر شد. تیم ازما واقعاً حرفه‌ایه."
                        </blockquote>
                        <div class="text-yellow-400 mt-3" aria-label="امتیاز ۵ ستاره">★★★★★</div>
                    </article>
                    
                    <article class="card-3d reveal">
                        <div class="flex items-center gap-4 mb-4">
                            <picture>
                                <source srcset="https://azmamarkteng.ir/avatar/client2.webp" type="image/webp">
                                <img src="https://azmamarkteng.ir/avatar/client2.jpg" class="w-12 h-12 rounded-full border-2 border-[#f59e0b]" loading="lazy" width="48" height="48" alt="زهرا احمدی - مدیر فروشگاه">
                            </picture>
                            <div>
                                <h3 class="font-bold text-white">زهرا احمدی</h3>
                                <p class="text-gray-400 text-xs">مدیر فروشگاه</p>
                            </div>
                        </div>
                        <blockquote class="text-gray-300 text-sm leading-6">
                            "سایتی که طراحی کردن فوق‌العاده بود. سرعت لود بالا و رابط کاربری عالی."
                        </blockquote>
                        <div class="text-yellow-400 mt-3" aria-label="امتیاز ۵ ستاره">★★★★★</div>
                    </article>
                    
                    <article class="card-3d reveal">
                        <div class="flex items-center gap-4 mb-4">
                            <picture>
                                <source srcset="https://azmamarkteng.ir/avatar/client3.webp" type="image/webp">
                                <img src="https://azmamarkteng.ir/avatar/client3.jpg" class="w-12 h-12 rounded-full border-2 border-[#f59e0b]" loading="lazy" width="48" height="48" alt="علی کریمی - مدیر آژانس مسافرتی">
                            </picture>
                            <div>
                                <h3 class="font-bold text-white">علی کریمی</h3>
                                <p class="text-gray-400 text-xs">مدیر آژانس مسافرتی</p>
                            </div>
                        </div>
                        <blockquote class="text-gray-300 text-sm leading-6">
                            "کمپین تبلیغاتی‌شون فوق‌العاده بود. فروش نوروز ما ۲۵۰٪ افزایش پیدا کرد."
                        </blockquote>
                        <div class="text-yellow-400 mt-3" aria-label="امتیاز ۵ ستاره">★★★★★</div>
                    </article>
                </div>
            </div>
        </section>

        <section class="py-20 glass-panel" aria-labelledby="faq-title">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16 reveal">
                    <h2 id="faq-title" class="text-3xl font-bold text-white">سوالات <span class="text-[#f59e0b]">متداول</span></h2>
                    <p class="text-gray-400 font-medium mt-2">پاسخ به سوالات رایج شما</p>
                </div>
                
                <div class="max-w-3xl mx-auto space-y-4">
                    <details class="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/5 reveal">
                        <summary class="font-bold text-white mb-2 cursor-pointer">
                            ❓ هزینه طراحی سایت چقدر است؟
                        </summary>
                        <p class="text-gray-400 text-sm leading-6">
                            هزینه بسته به نوع سایت (فروشگاهی، شرکتی، شخصی) و امکانات مورد نیاز متفاوت است. از ۵ تا ۵۰ میلیون تومان متغیر است. برای قیمت دقیق، 
                            <a href="contact.php" class="text-[#f59e0b] hover:underline">تماس بگیرید</a>.
                        </p>
                    </details>
                    
                    <details class="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/5 reveal">
                        <summary class="font-bold text-white mb-2 cursor-pointer">
                            ❓ مدت زمان تحویل پروژه چقدر است؟
                        </summary>
                        <p class="text-gray-400 text-sm leading-6">
                            طراحی سایت معمولاً ۲-۴ هفته، مدیریت اینستاگرام ۱ هفته برای شروع، و سئو حداقل ۳ ماه برای نتیجه ملموس. دقیق‌تر در 
                            <a href="services.php" class="text-[#f59e0b] hover:underline">صفحه خدمات</a>.
                        </p>
                    </details>
                    
                    <details class="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/5 reveal">
                        <summary class="font-bold text-white mb-2 cursor-pointer">
                            ❓ آیا پشتیبانی بعد از تحویل دارید؟
                        </summary>
                        <p class="text-gray-400 text-sm leading-6">
                            بله! همه پروژه‌ها شامل ۶ ماه پشتیبانی رایگان هستند. بعد از اون هم می‌تونید قرارداد پشتیبانی سالانه داشته باشید.
                        </p>
                    </details>
                </div>
            </div>
        </section>

        <section class="py-20 container mx-auto px-4" aria-labelledby="cta-title">
            <div class="bg-gradient-to-r from-[#0f2027]/80 to-[#203a43]/80 backdrop-blur-md rounded-[30px] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden reveal border border-white/10">
                <h2 id="cta-title" class="text-3xl md:text-5xl font-bold mb-6 relative z-10">وقتشه کسب‌وکارت رو طلایی کنی</h2>
                <p class="text-lg mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">همین حالا برای دریافت مشاوره رایگان و آنالیز پیج یا سایتت با ما تماس بگیر. اولین جلسه ۱ ساعته، کاملاً رایگان.</p>
                <a href="contact.php" class="btn btn-primary text-2xl py-4 px-8 relative z-10 inline-flex items-center gap-2 transform hover:-translate-y-1" aria-label="شروع همکاری با آژانس ازما">
                    شروع همکاری <i class="fas fa-rocket" aria-hidden="true"></i>
                </a>
            </div>
        </section>
    </main>

    <footer role="contentinfo">
        <div class="container mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
                <div class="flex items-center gap-2 mb-6">
                    <picture>
                        <source srcset="logo.webp" type="image/webp">
                        <img src="logo.png" alt="لوگوی آژانس دیجیتال مارکتینگ ازما" class="h-10" style="filter: drop-shadow(0 0 5px rgba(245,158,11,0.5));">
                    </picture>
                    <span class="text-2xl font-bold"><?php echo $settings['site_name']; ?></span>
                </div>
                <p class="text-gray-400 text-sm leading-7 mb-6">
                    ما با تکیه بر دانش روز و تجربه ۴ ساله، بهترین راهکارها را برای رشد کسب‌وکار شما ارائه می‌دهیم.
                </p>
                <div class="flex gap-4" role="list" aria-label="شبکه‌های اجتماعی">
                    <a href="https://instagram.com/<?php echo $settings['instagram']; ?>" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#f59e0b] transition" aria-label="اینستاگرام آژانس ازما">
                        <i class="fab fa-instagram" aria-hidden="true"></i>
                    </a>
                    <a href="https://t.me/<?php echo $settings['telegram']; ?>" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#f59e0b] transition" aria-label="تلگرام آژانس ازما">
                        <i class="fab fa-telegram" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
            
            <div>
                <h3 class="text-xl font-bold mb-6 border-b border-white/10 pb-2 inline-block">دسترسی سریع</h3>
                <nav role="navigation" aria-label="لینک‌های سریع">
                    <ul class="space-y-3 text-sm">
                        <li><a href="index.php" class="footer-link">صفحه اصلی</a></li>
                        <li><a href="services.php" class="footer-link">خدمات ما</a></li>
                        <li><a href="portfolio.php" class="footer-link">نمونه‌کارها</a></li>
                        <li><a href="contact.php" class="footer-link">تماس با ما</a></li>
                        <li><a href="login.php" class="footer-link">ورود به حساب</a></li>
                    </ul>
                </nav>
            </div>

            <div>
                <h3 class="text-xl font-bold mb-6 border-b border-white/10 pb-2 inline-block">اطلاعات تماس</h3>
                <address class="space-y-4 text-sm text-gray-400 not-italic">
                    <p class="flex items-center gap-3">
                        <i class="fas fa-phone text-[#f59e0b] text-lg" aria-hidden="true"></i>
                        <a href="tel:<?php echo $settings['phone_1']; ?>" class="hover:text-white transition"><?php echo $settings['phone_1']; ?></a>
                    </p>
                    <p class="flex items-center gap-3">
                        <i class="fas fa-mobile text-[#f59e0b] text-lg" aria-hidden="true"></i>
                        <a href="tel:<?php echo $settings['phone_2']; ?>" class="hover:text-white transition"><?php echo $settings['phone_2']; ?></a>
                    </p>
                    <p class="flex items-center gap-3">
                        <i class="fas fa-map-marker-alt text-[#f59e0b] text-lg" aria-hidden="true"></i>
                        <span><?php echo $settings['address']; ?></span>
                    </p>
                </address>
            </div>
        </div>
        <div class="border-t border-white/10 text-center py-6 text-gray-500 text-xs">
            © 2025 تمامی حقوق برای آژانس دیجیتال مارکتینگ ازما محفوظ است. | طراحی و توسعه توسط <strong>یاسین سالارناظم</strong>
        </div>
    </footer>

    <div class="floating-widget bot-trigger" onclick="toggleChat()" role="button" aria-label="باز کردن چت با پشتیبان" tabindex="0">
        <i class="fas fa-comments" aria-hidden="true"></i>
    </div>

    <div id="chat-window" class="hidden fixed bottom-32 right-5 w-80 h-96 bg-[#0f2027] border border-[#f59e0b] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50" role="dialog" aria-modal="true" aria-labelledby="chat-title" aria-describedby="chat-description">
        <div class="bg-[#f59e0b] text-black p-4 flex justify-between items-center font-bold">
            <span id="chat-title" class="flex items-center gap-2"><i class="fas fa-robot" aria-hidden="true"></i> پشتیبان هوشمند</span>
            <button onclick="toggleChat()" class="hover:text-white" aria-label="بستن چت"><i class="fas fa-times" aria-hidden="true"></i></button>
        </div>
        <div id="chat-description" class="sr-only">پنجره چت با پشتیبان هوشمند آژانس ازما</div>
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-black/90" role="log" aria-live="polite" aria-atomic="false">
            <div class="bg-white/10 text-white p-3 rounded-lg rounded-tr-none self-start max-w-[85%] chat-message">
                سلام! 👋 من دستیار هوشمند ازما هستم. چطور می‌تونم کمکتون کنم؟
            </div>
        </div>
        <form class="p-3 border-t border-white/10 flex gap-2" onsubmit="event.preventDefault(); sendMessage();">
            <label for="chat-input" class="sr-only">پیام شما</label>
            <input type="text" id="chat-input" placeholder="پیام شما..." class="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 outline-none focus:border-[#f59e0b]" aria-label="نوشتن پیام برای پشتیبان">
            <button type="submit" class="bg-[#f59e0b] text-black px-4 py-2 rounded-lg hover:bg-white transition" aria-label="ارسال پیام">
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
        </form>
    </div>

    <script>
        // Toggle Menu
        function toggleMenu() {
            const menu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('overlay');
            const button = document.querySelector('.mobile-btn');
            
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Update aria-expanded
            const isExpanded = menu.classList.contains('active');
            button.setAttribute('aria-expanded', isExpanded);
        }

        // Toggle Chat
        function toggleChat() {
            const chatWindow = document.getElementById('chat-window');
            const button = document.querySelector('.bot-trigger');
            
            chatWindow.classList.toggle('hidden');
            
            // Update aria-expanded
            const isExpanded = !chatWindow.classList.contains('hidden');
            button.setAttribute('aria-expanded', isExpanded);
            
            // Focus on input when opened
            if (isExpanded) {
                setTimeout(() => {
                    document.getElementById('chat-input').focus();
                }, 100);
            }
        }

        // Send Message
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const messages = document.getElementById('chat-messages');
            const msg = input.value.trim();
            
            if (!msg) return;
            
            // نمایش پیام کاربر
            messages.innerHTML += `
                <div class="flex justify-end">
                    <div class="bg-[#f59e0b] text-black p-3 rounded-lg rounded-tl-none max-w-[85%] chat-message">${msg}</div>
                </div>
            `;
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
            
            // نمایش در حال تایپ
            messages.innerHTML += `
                <div id="typing" class="bg-white/10 text-gray-400 p-3 rounded-lg text-xs chat-message">
                    در حال تایپ...
                </div>
            `;
            
            try {
                // آدرس فایل از gemini-api.php به gemini-chat.php اصلاح شد
                const response = await fetch('gemini-chat.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg, mode: 'chat' })
                });
                const data = await response.json();
                
                document.getElementById('typing').remove();
                
                if(data.reply) {
                    messages.innerHTML += `
                        <div class="flex justify-start">
                            <div class="bg-white/10 text-white p-3 rounded-lg rounded-tr-none max-w-[90%] chat-message">${data.reply}</div>
                        </div>
                    `;
                }
            } catch (e) {
                document.getElementById('typing').remove();
                messages.innerHTML += `
                    <div class="bg-red-500/20 text-red-300 p-3 rounded-lg text-xs chat-message">
                        خطا در ارتباط. لطفاً دوباره تلاش کنید.
                    </div>
                `;
            }
            messages.scrollTop = messages.scrollHeight;
        }

        // Scroll Reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Keyboard navigation for chat button
        document.querySelector('.bot-trigger').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleChat();
            }
        });

        // Keyboard navigation for mobile menu button
        document.querySelector('.mobile-btn').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    </script>
</body>
</html>