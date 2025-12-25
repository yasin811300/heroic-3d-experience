<?php
session_start();
require 'db.php';
require 'telegram-config.php'; // اضافه کردن تنظیمات تلگرام

// بررسی وضعیت لاگین
$is_logged_in = isset($_SESSION['user_phone']);
$is_admin = isset($_SESSION['admin_logged_in']);

// دریافت تنظیمات
$settings = $conn->query("SELECT * FROM settings WHERE id=1")->fetch_assoc();

// دریافت سئو
$seo_query = $conn->query("SELECT * FROM seo WHERE page_name='contact'");
if($seo_query->num_rows > 0) {
    $seo = $seo_query->fetch_assoc();
} else {
    $seo = ['title' => 'تماس با ما | آژانس ازما', 'description' => 'راه‌های ارتباطی با آژانس ازما', 'keywords' => 'تماس, پشتیبانی'];
}

// پردازش فرم تماس
$message_sent = false;
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_contact'])) {
    // دریافت و فیلتر داده‌ها
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject'] ?? 'درخواست عمومی'), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
    
    // اعتبارسنجی
    if (empty($name) || empty($phone) || empty($message)) {
        $error_message = 'لطفاً تمام فیلدهای ضروری را پر کنید.';
    } elseif (!preg_match('/^09[0-9]{9}$/', $phone)) {
        $error_message = 'شماره موبایل معتبر نیست. (مثال: 09123456789)';
    } else {
        // ذخیره در دیتابیس
        $stmt = $conn->prepare("INSERT INTO contact_messages (name, phone, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("sssss", $name, $phone, $email, $subject, $message);
        
        if ($stmt->execute()) {
            $message_sent = true;
            
            // ✅ ارسال اعلان به تلگرام
            $notification_details = [
                'نام' => $name,
                'موبایل' => $phone,
                'ایمیل' => $email ?: 'ندارد',
                'موضوع' => $subject,
                'پیام' => mb_substr($message, 0, 100) . (mb_strlen($message) > 100 ? '...' : '')
            ];
            
            sendFormattedNotification('📩 پیام جدید از سایت', $notification_details, '🔔');
            
            // ارسال دکمه برای مشاهده
            $keyboard = [
                [
                    ['text' => '👀 مشاهده در پنل', 'url' => 'https://azmamarkteng.ir/admin-panel.php'],
                    ['text' => '📞 تماس با ' . $name, 'url' => 'tel:' . $phone]
                ]
            ];
            sendTelegramMessage("✉️ پیام جدید از <b>$name</b> دریافت شد!", 'HTML', $keyboard);
        } else {
            $error_message = 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.';
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $seo['title']; ?></title>
    <meta name="description" content="<?php echo $seo['description']; ?>">
    <meta name="keywords" content="<?php echo $seo['keywords']; ?>">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
        :root { --primary: #00d2ff; --accent: #f59e0b; --dark-bg: #0f2027; --text-light: #e0f7fa; }
        html, body { cursor: auto; } @media (min-width: 1025px) { * { cursor: none !important; } }
        body { background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364); background-image: url('body-bg.jpg'); background-size: cover; background-attachment: fixed; color: var(--text-light); min-height: 100vh; }
        
        header { background: rgba(15, 32, 39, 0.95); padding: 10px 0; position: fixed; width: 100%; top: 0; z-index: 1000; backdrop-filter: blur(10px); }
        .container { width: 95%; max-width: 1200px; margin: 0 auto; padding: 0 15px; }
        .header-container { display: flex; justify-content: space-between; align-items: center; }
        nav ul { display: flex; list-style: none; } nav ul li { margin-right: 25px; }
        nav ul li a { color: #b0bec5; text-decoration: none; transition: 0.3s; font-weight: 500; }
        nav ul li a:hover, nav ul li a.active { color: var(--primary); }
        
        .login-link { color: var(--accent) !important; border: 1px solid var(--accent); padding: 5px 15px; border-radius: 20px; }
        .login-link:hover { background: var(--accent); color: #000 !important; }
        .dashboard-link { background: var(--accent); color: black !important; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .logo img { height: 40px; margin-left: 10px; } .logo { display: flex; align-items: center; font-size: 1.2rem; font-weight: 800; }
        
        @media (max-width: 768px) {
            .header-container { flex-direction: row-reverse; }
            nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #0f2027; padding: 10px 0; overflow-x: auto; z-index: 1001; }
            nav ul { justify-content: center; min-width: max-content; } nav ul li { margin: 0 15px; }
            nav ul li a { font-size: 0.9rem; display: flex; flex-direction: column; align-items: center; }
            .logo span, .header-btn { display: none; } header { padding: 10px 0; } body { padding-bottom: 70px; }
            .grid-cols-2 { grid-template-columns: 1fr !important; }
        }

        .glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; transition: 0.4s; }
        .glass-card:hover { border-color: rgba(255,255,255,0.2); }
        
        .btn-gold { background: linear-gradient(45deg, #f59e0b, #ff7e5f); color: white; border-radius: 50px; padding: 10px 30px; font-weight: bold; display: inline-block; transition: 0.3s; cursor: pointer; border: none; }
        .btn-gold:hover { transform: scale(1.05); box-shadow: 0 5px 20px rgba(245, 158, 11, 0.4); }
        
        .input-field { width: 100%; padding: 12px; margin-bottom: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white; outline: none; transition: 0.3s; }
        .input-field:focus { border-color: var(--accent); background: rgba(255,255,255,0.08); }
        .input-field::placeholder { color: rgba(255,255,255,0.5); }
        
        .contact-icon-box { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
        .contact-icon-box:hover { border-color: var(--accent); transform: translateY(-5px); }
        
        .social-btn { width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; transition: 0.3s; border: 2px solid transparent; }
        .social-btn:hover { transform: scale(1.1); border-color: var(--accent); }
        .instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
        .telegram { background: #0088cc; }
        .whatsapp { background: #25D366; }
        .phone { background: linear-gradient(45deg, #667eea, #764ba2); }
        
        .map-container { width: 100%; height: 400px; border-radius: 20px; overflow: hidden; border: 2px solid rgba(255,255,255,0.1); }
        
        .alert-success { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 20px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; animation: slideIn 0.5s ease; }
        .alert-error { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 15px 20px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; animation: slideIn 0.5s ease; }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        footer { background: #050b10; padding: 60px 0 20px; margin-top: 80px; border-top: 1px solid rgba(255,255,255,0.05); }
        
        .cursor-dot, .cursor-outline { position: fixed; top: 0; left: 0; transform: translate(-50%, -50%); border-radius: 50%; z-index: 999999; pointer-events: none; display: none; }
        @media (min-width: 1025px) { .cursor-dot, .cursor-outline { display: block; } }
        .cursor-dot { width: 8px; height: 8px; background-color: var(--accent); }
        .cursor-outline { width: 40px; height: 40px; border: 2px solid var(--accent); transition: all 0.1s ease-out; }
        
        .working-hours { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; border-right: 4px solid var(--accent); }
    </style>
</head>
<body>
    <div class="cursor-dot"></div><div class="cursor-outline"></div>

    <header>
        <div class="container header-container">
            <div class="flex gap-4 items-center btn-gold header-btn" style="background: none; padding: 0;">
                <a href="tel:<?php echo $settings['phone_1']; ?>" class="btn-gold text-sm">تماس فوری</a>
            </div>
            <nav>
                <ul>
                    <li><a href="index.php"><i class="fas fa-home md:hidden"></i> خانه</a></li>
                    <li><a href="services.php"><i class="fas fa-concierge-bell md:hidden"></i> خدمات</a></li>
                    <li><a href="portfolio.php"><i class="fas fa-briefcase md:hidden"></i> نمونه کارها</a></li>
                    <li><a href="about.php"><i class="fas fa-users md:hidden"></i> درباره ما</a></li>
                    <li><a href="contact.php" class="active"><i class="fas fa-phone md:hidden"></i> تماس</a></li>
                    <li>
                        <?php if($is_logged_in || $is_admin): ?>
                            <?php $dash_link = $is_admin ? 'admin-panel.php' : 'dashboard.php'; ?>
                            <a href="<?php echo $dash_link; ?>" class="dashboard-link">
                                <i class="fas fa-user-circle ml-1"></i> <span class="hidden md:inline">داشبورد</span>
                            </a>
                        <?php else: ?>
                            <a href="login.php" class="login-link">
                                <i class="fas fa-sign-in-alt ml-1"></i> <span class="hidden md:inline">ورود</span>
                            </a>
                        <?php endif; ?>
                    </li>
                </ul>
            </nav>
            <div class="logo"><img src="logo.png" alt="لوگوی آژانس ازما"> <span class="mr-2"><?php echo $settings['site_name']; ?></span></div>
        </div>
    </header>

    <section class="container pt-[120px] pb-20">
        <!-- عنوان صفحه -->
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">ارتباط با <span style="color: var(--accent);">ما</span></h1>
            <p class="text-gray-400 text-lg">آماده‌ایم تا پروژه شما را به واقعیت تبدیل کنیم 🚀</p>
        </div>

        <!-- نمایش پیام موفقیت یا خطا -->
        <?php if ($message_sent): ?>
            <div class="alert-success">
                <i class="fas fa-check-circle text-2xl"></i>
                <span>پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.</span>
            </div>
        <?php elseif ($error_message): ?>
            <div class="alert-error">
                <i class="fas fa-exclamation-triangle text-2xl"></i>
                <span><?php echo $error_message; ?></span>
            </div>
        <?php endif; ?>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <!-- فرم تماس -->
            <div class="glass-card p-8">
                <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <i class="fas fa-envelope text-accent"></i>
                    ارسال پیام
                </h2>
                <p class="text-gray-400 text-sm mb-6">فرم زیر را تکمیل کنید تا در اسرع وقت پاسخ دهیم</p>
                
                <form method="POST" action="" id="contactForm">
                    <input type="text" name="name" placeholder="نام و نام خانوادگی *" class="input-field" required>
                    <input type="tel" name="phone" placeholder="شماره موبایل (09xxxxxxxxx) *" class="input-field" pattern="09[0-9]{9}" required>
                    <input type="email" name="email" placeholder="ایمیل (اختیاری)" class="input-field">
                    <select name="subject" class="input-field">
                        <option value="درخواست عمومی">موضوع پیام</option>
                        <option value="طراحی سایت">طراحی سایت</option>
                        <option value="سئو">سئو و بهینه‌سازی</option>
                        <option value="مدیریت اینستاگرام">مدیریت اینستاگرام</option>
                        <option value="طراحی گرافیک">طراحی گرافیک</option>
                        <option value="تبلیغات">تبلیغات آنلاین</option>
                        <option value="سایر">سایر موارد</option>
                    </select>
                    <textarea name="message" rows="5" placeholder="پیام شما... *" class="input-field" required></textarea>
                    <button type="submit" name="submit_contact" class="btn-gold w-full py-3 text-lg">
                        <i class="fas fa-paper-plane ml-2"></i> ارسال درخواست
                    </button>
                </form>
            </div>

            <!-- اطلاعات تماس -->
            <div class="text-right space-y-6">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-3">راه‌های ارتباطی</h2>
                    <p class="text-gray-400 leading-8">برای مشاوره <strong class="text-accent">رایگان</strong> و دریافت پیشنهاد قیمت، از طریق راه‌های زیر با ما در تماس باشید:</p>
                </div>

                <!-- تلفن‌ها -->
                <div class="contact-icon-box">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-gray-400 text-sm">تلفن مستقیم</p>
                            <a href="tel:<?php echo $settings['phone_1']; ?>" class="text-xl text-white font-bold hover:text-accent transition" dir="ltr"><?php echo $settings['phone_1']; ?></a>
                        </div>
                        <i class="fas fa-phone-alt text-accent text-3xl"></i>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-400 text-sm">موبایل دوم</p>
                            <a href="tel:<?php echo $settings['phone_2']; ?>" class="text-xl text-white font-bold hover:text-accent transition" dir="ltr"><?php echo $settings['phone_2']; ?></a>
                        </div>
                        <i class="fas fa-mobile-alt text-accent text-3xl"></i>
                    </div>
                </div>

                <!-- شبکه‌های اجتماعی -->
                <div class="contact-icon-box">
                    <p class="text-gray-400 text-sm mb-4">ما را در شبکه‌های اجتماعی دنبال کنید:</p>
                    <div class="flex gap-4 justify-center">
                        <a href="https://instagram.com/<?php echo $settings['instagram']; ?>" target="_blank" class="social-btn instagram" title="اینستاگرام">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://t.me/<?php echo $settings['telegram']; ?>" target="_blank" class="social-btn telegram" title="تلگرام">
                            <i class="fab fa-telegram"></i>
                        </a>
                        <a href="https://wa.me/98<?php echo substr($settings['phone_1'], 1); ?>" target="_blank" class="social-btn whatsapp" title="واتساپ">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <a href="tel:<?php echo $settings['phone_1']; ?>" class="social-btn phone" title="تماس مستقیم">
                            <i class="fas fa-phone"></i>
                        </a>
                    </div>
                </div>

                <!-- ساعت کاری -->
                <div class="working-hours">
                    <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                        <i class="fas fa-clock text-accent"></i>
                        ساعات پاسخگویی
                    </h3>
                    <div class="text-gray-300 text-sm space-y-2">
                        <p><strong>شنبه تا چهارشنبه:</strong> 9:00 - 18:00</p>
                        <p><strong>پنج‌شنبه:</strong> 9:00 - 14:00</p>
                        <p><strong>جمعه:</strong> تعطیل (پاسخگویی آنلاین)</p>
                    </div>
                </div>

                <!-- آدرس -->
                <div class="contact-icon-box">
                    <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                        <i class="fas fa-map-marker-alt text-red-500"></i>
                        آدرس دفتر مرکزی
                    </h3>
                    <p class="text-gray-300 leading-7"><?php echo $settings['address']; ?></p>
                </div>
            </div>
        </div>

        <!-- نقشه گوگل -->
        <div class="glass-card p-4 mb-10">
            <h3 class="text-2xl font-bold text-white mb-4 text-center">موقعیت ما روی نقشه</h3>
            <div class="map-container">
                <!-- جایگزین کردن مختصات واقعی شما -->
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8179826482837!2d48.5152778!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIxLjEiTiA0OMKwMzAnNTUuMCJF!5e0!3m2!1sfa!2s!4v1234567890123!5m2!1sfa!2s"
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>

        <!-- باکس دعوت به عمل -->
        <div class="glass-card p-10 text-center">
            <h3 class="text-3xl font-bold text-white mb-4">آماده شروع پروژه خود هستید؟</h3>
            <p class="text-gray-300 mb-6 text-lg">تیم ما با بیش از ۵ سال تجربه، آماده همکاری با شماست</p>
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="services.php" class="btn-gold">
                    <i class="fas fa-rocket ml-2"></i> مشاهده خدمات
                </a>
                <a href="portfolio.php" class="btn-gold" style="background: linear-gradient(45deg, #667eea, #764ba2);">
                    <i class="fas fa-images ml-2"></i> نمونه کارها
                </a>
            </div>
        </div>
    </section>

    <footer>
        <div class="container text-center">
            <div class="logo justify-center mb-6"><img src="logo.png" alt="لوگو"><span class="mr-3 text-2xl"><?php echo $settings['site_name']; ?></span></div>
            <div class="flex justify-center gap-6 text-2xl text-gray-400 mb-8">
                <a href="https://instagram.com/<?php echo $settings['instagram']; ?>" class="hover:text-white transition" aria-label="اینستاگرام"><i class="fab fa-instagram"></i></a>
                <a href="https://t.me/<?php echo $settings['telegram']; ?>" class="hover:text-white transition" aria-label="تلگرام"><i class="fab fa-telegram"></i></a>
                <a href="tel:<?php echo $settings['phone_1']; ?>" class="hover:text-white transition" aria-label="تماس"><i class="fas fa-phone"></i></a>
            </div>
            <p class="text-gray-600 text-sm border-t border-gray-800 pt-6">&copy; 2025 تمامی حقوق برای آژانس دیجیتال مارکتینگ ازما محفوظ است.</p>
        </div>
    </footer>

    <script>
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        if (window.matchMedia("(min-width: 1025px)").matches) {
            window.addEventListener('mousemove', function(e) {
                const posX = e.clientX; const posY = e.clientY;
                cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
                cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 400, fill: "forwards" });
            });
        }

        // اعتبارسنجی فرم سمت کلاینت
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            const phone = document.querySelector('input[name="phone"]').value;
            const pattern = /^09[0-9]{9}$/;
            
            if (!pattern.test(phone)) {
                e.preventDefault();
                alert('شماره موبایل معتبر نیست. فرمت صحیح: 09123456789');
            }
        });
    </script>
</body>
</html>