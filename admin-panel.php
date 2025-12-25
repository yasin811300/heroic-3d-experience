<?php
session_start();
require 'db.php';

// اگر ادمین لاگین نکرده، بره به صفحه ورود
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: admin-login.php");
    exit();
}

// گرفتن اطلاعات ادمین
if (isset($_SESSION['admin_id'])) {
    $admin_id = $_SESSION['admin_id'];
    $stmt = $conn->prepare("SELECT * FROM admins WHERE id = ?");
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();
} else {
    $admin = ['name' => 'ادمین', 'username' => 'admin'];
}

// آمار داشبورد
 $user_count = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
 $order_count = $conn->query("SELECT COUNT(*) FROM orders")->fetch_row()[0];
 $total_income = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0];
 $ticket_count = $conn->query("SELECT COUNT(*) FROM tickets WHERE status='open'")->fetch_row()[0];
 $gallery_count = $conn->query("SELECT COUNT(*) FROM gallery")->fetch_row()[0];

// اگر فرم تنظیمات ارسال شده
if (isset($_POST['save_settings'])) {
    $site_name = $_POST['site_name'];
    $phone_1 = $_POST['phone_1'];
    $phone_2 = $_POST['phone_2'];
    $instagram = $_POST['instagram'];
    $telegram = $_POST['telegram'];
    $address = $_POST['address'];
    
    $stmt = $conn->prepare("UPDATE settings SET site_name=?, phone_1=?, phone_2=?, instagram=?, telegram=?, address=? WHERE id=1");
    $stmt->bind_param("ssssss", $site_name, $phone_1, $phone_2, $instagram, $telegram, $address);
    $stmt->execute();
    
    echo "<script>alert('تنظیمات با موفقیت ذخیره شد'); window.location.href='admin-panel.php';</script>";
}

// گرفتن تنظیمات سایت
 $settings = $conn->query("SELECT * FROM settings WHERE id=1")->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پنل ادمین - <?php echo $settings['site_name']; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'dark-primary': '#0f0f23',
                        'dark-secondary': '#1a1a2e',
                        'dark-tertiary': '#16213e',
                        'yellow-primary': '#ffd700',
                        'yellow-secondary': '#ffed4e',
                        'yellow-dark': '#b7791f'
                    }
                }
            }
        }
    </script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
        
        * {
            font-family: 'Vazirmatn', sans-serif;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .glass-card {
            background: rgba(26, 26, 46, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .glow-effect {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }
        
        .sidebar-item {
            transition: all 0.3s ease;
        }
        
        .sidebar-item:hover {
            background: linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%);
            border-right: 3px solid #ffd700;
        }
        
        .sidebar-overlay {
            transition: all 0.3s ease;
        }
        
        .table-container {
            scrollbar-width: thin;
            scrollbar-color: #ffd700 #1a1a2e;
        }
        
        .table-container::-webkit-scrollbar {
            height: 6px;
        }
        
        .table-container::-webkit-scrollbar-track {
            background: #1a1a2e;
        }
        
        .table-container::-webkit-scrollbar-thumb {
            background: #ffd700;
            border-radius: 3px;
        }
        
        .ai-section {
            display: none;
        }
        
        .ai-section.active {
            display: block;
        }
        
        .notification-panel {
            display: none;
        }
        
        .notification-panel.show {
            display: block;
        }
        
        .loading-spinner {
            border: 3px solid rgba(255,255,255,0.1);
            border-top: 3px solid #ffd700;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            display: none;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>

<body class="gradient-bg min-h-screen">
    <!-- دکمه منوی موبایل -->
    <button class="fixed top-4 right-4 z-50 lg:hidden bg-yellow-primary text-dark-primary p-3 rounded-full shadow-lg"
        onclick="toggleMobileSidebar()">
        <i class="fas fa-bars"></i>
    </button>

    <!-- اوورلی منوی موبایل -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden" id="sidebar-overlay"
        onclick="toggleMobileSidebar()"></div>

    <!-- سایدبار -->
    <div class="fixed right-0 top-0 h-full w-64 glass-card shadow-2xl z-50 transform translate-x-full lg:translate-x-0 transition-transform duration-300"
        id="sidebar">
        <div class="p-4 lg:p-6 border-b border-yellow-primary/20">
            <div class="flex items-center space-x-3 space-x-reverse">
                <div
                    class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-primary to-yellow-dark rounded-full flex items-center justify-center glow-effect">
                    <i class="fas fa-crown text-dark-primary text-lg lg:text-xl"></i>
                </div>
                <div>
                    <h2 class="text-yellow-primary font-bold text-base lg:text-lg">پنل ادمین</h2>
                    <p class="text-gray-400 text-xs lg:text-sm">مدیریت سیستم</p>
                </div>
            </div>
        </div>

        <nav class="mt-6 overflow-y-auto h-[calc(100vh-200px)]">
            <!-- داشبورد -->
            <div class="sidebar-item px-4 lg:px-6 py-3 text-yellow-primary bg-yellow-primary/10 border-r-3 border-yellow-primary"
                onclick="showSection('dashboard')">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="font-medium text-sm lg:text-base">داشبورد</span>
                </div>
            </div>

            <!-- کاربران -->
            <div class="sidebar-item">
                <div class="px-4 lg:px-6 py-3 text-gray-300 hover:text-yellow-primary cursor-pointer flex items-center justify-between"
                    onclick="toggleDropdown('users')">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <i class="fas fa-users"></i>
                        <span class="font-medium text-sm lg:text-base">کاربران</span>
                    </div>
                    <i class="fas fa-chevron-down transition-transform duration-300" id="users-arrow"></i>
                </div>
                <div class="hidden bg-dark-tertiary" id="users-dropdown">
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">لیست کاربران</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">افزودن کاربر</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">کیف پول کاربران</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">نقش‌ها</a>
                </div>
            </div>

            <!-- محصولات -->
            <div class="sidebar-item">
                <div class="px-4 lg:px-6 py-3 text-gray-300 hover:text-yellow-primary cursor-pointer flex items-center justify-between"
                    onclick="toggleDropdown('products')">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <i class="fas fa-box"></i>
                        <span class="font-medium text-sm lg:text-base">محصولات</span>
                    </div>
                    <i class="fas fa-chevron-down transition-transform duration-300" id="products-arrow"></i>
                </div>
                <div class="hidden bg-dark-tertiary" id="products-dropdown">
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">لیست محصولات</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">افزودن محصول</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">دسته‌بندی</a>
                </div>
            </div>

            <!-- سفارشات -->
            <div class="sidebar-item">
                <div class="px-4 lg:px-6 py-3 text-gray-300 hover:text-yellow-primary cursor-pointer flex items-center justify-between"
                    onclick="toggleDropdown('orders')">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="font-medium text-sm lg:text-base">سفارشات</span>
                    </div>
                    <i class="fas fa-chevron-down transition-transform duration-300" id="orders-arrow"></i>
                </div>
                <div class="hidden bg-dark-tertiary" id="orders-dropdown">
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">سفارشات جدید</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">تاریخچه سفارشات</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">گزارشات</a>
                </div>
            </div>

            <!-- ابزارهای هوش مصنوعی -->
            <div class="sidebar-item px-4 lg:px-6 py-3 text-gray-300 hover:text-yellow-primary cursor-pointer"
                onclick="showSection('ai-tools')">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <i class="fas fa-magic"></i>
                    <span class="font-medium text-sm lg:text-base">ابزارهای هوش مصنوعی</span>
                </div>
            </div>

            <!-- مالی -->
            <div class="sidebar-item">
                <div class="px-4 lg:px-6 py-3 text-gray-300 hover:text-yellow-primary cursor-pointer flex items-center justify-between"
                    onclick="toggleDropdown('finance')">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <i class="fas fa-coins"></i>
                        <span class="font-medium text-sm lg:text-base">مالی</span>
                    </div>
                    <i class="fas fa-chevron-down transition-transform duration-300" id="finance-arrow"></i>
                </div>
                <div class="hidden bg-dark-tertiary" id="finance-dropdown">
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">گزارش درآمد</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">تراکنش‌ها</a>
                    <a href="#" class="block px-8 lg:px-12 py-2 text-gray-400 hover:text-yellow-primary text-sm">صورتحساب</a>
                </div>
            </div>

            <!-- تنظیمات -->
            <div class="sidebar-item px-4 lg:px-6 py-3 text-gray-300 hover:text-yellow-primary cursor-pointer"
                onclick="showSection('settings')">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <i class="fas fa-cog"></i>
                    <span class="font-medium text-sm lg:text-base">تنظیمات</span>
                </div>
            </div>
        </nav>

        <div class="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 left-4 lg:left-6">
            <div class="bg-dark-tertiary rounded-lg p-3 lg:p-4 border border-yellow-primary/20">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <img src="https://ui-avatars.com/api/?name=<?php echo urlencode($admin['name']); ?>&background=ffd700&color=0f0f23&bold=true"
                        class="w-8 h-8 lg:w-10 lg:h-10 rounded-full">
                    <div>
                        <p class="text-yellow-primary font-medium text-sm"><?php echo $admin['name']; ?></p>
                        <p class="text-gray-400 text-xs">آنلاین</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- محتوای اصلی -->
    <div class="lg:mr-64 min-h-screen">
        <!-- هدر -->
        <header class="glass-card/50 backdrop-blur-sm border-b border-yellow-primary/20 p-4 lg:p-6 pt-16 lg:pt-6">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 class="text-xl lg:text-2xl font-bold text-yellow-primary">داشبورد مدیریت</h1>
                    <p class="text-gray-400 text-sm lg:text-base">خوش آمدید به پنل کنترل</p>
                </div>
                <div class="flex items-center space-x-4 space-x-reverse">
                    <div class="relative">
                        <button class="bg-dark-tertiary p-2 lg:p-3 rounded-full text-yellow-primary hover:bg-yellow-primary hover:text-dark-primary transition-all glow-effect"
                            onclick="toggleNotifications()">
                            <i class="fas fa-bell text-sm lg:text-base"></i>
                        </button>
                        <span class="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-xs"><?php echo $ticket_count; ?></span>
                        
                        <!-- پنل نوتیفیکیشن‌ها -->
                        <div id="notification-panel" class="notification-panel absolute left-0 mt-2 w-80 glass-card rounded-lg shadow-xl z-50 border border-yellow-primary/20">
                            <div class="p-4 border-b border-yellow-primary/20">
                                <h3 class="text-yellow-primary font-bold">اعلان‌ها</h3>
                            </div>
                            <div class="max-h-96 overflow-y-auto">
                                <div class="p-4 border-b border-gray-800 hover:bg-dark-secondary">
                                    <div class="flex items-start space-x-3 space-x-reverse">
                                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <i class="fas fa-user-plus text-white text-xs"></i>
                                        </div>
                                        <div>
                                            <p class="text-gray-300 text-sm">کاربر جدید عضو شد</p>
                                            <p class="text-gray-500 text-xs">5 دقیقه پیش</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 border-b border-gray-800 hover:bg-dark-secondary">
                                    <div class="flex items-start space-x-3 space-x-reverse">
                                        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <i class="fas fa-shopping-bag text-white text-xs"></i>
                                        </div>
                                        <div>
                                            <p class="text-gray-300 text-sm">سفارش جدید ثبت شد</p>
                                            <p class="text-gray-500 text-xs">12 دقیقه پیش</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 border-b border-gray-800 hover:bg-dark-secondary">
                                    <div class="flex items-start space-x-3 space-x-reverse">
                                        <div class="w-8 h-8 bg-yellow-primary rounded-full flex items-center justify-center flex-shrink-0">
                                            <i class="fas fa-star text-dark-primary text-xs"></i>
                                        </div>
                                        <div>
                                            <p class="text-gray-300 text-sm">نظر جدید دریافت شد</p>
                                            <p class="text-gray-500 text-xs">25 دقیقه پیش</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-3 text-center">
                                <a href="#" class="text-yellow-primary text-sm hover:underline">مشاهده همه اعلان‌ها</a>
                            </div>
                        </div>
                    </div>
                    <a href="admin-logout.php" class="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all text-sm lg:text-base">
                        خروج
                    </a>
                </div>
            </div>
        </header>

        <!-- محتوای صفحه -->
        <main class="p-4 lg:p-6">
            <!-- بخش داشبورد -->
            <div id="dashboard-section" class="ai-section active">
                <!-- کارت‌های آماری -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-xs lg:text-sm">کل کاربران</p>
                                <p class="text-xl lg:text-2xl font-bold text-yellow-primary"><?php echo number_format($user_count); ?></p>
                                <p class="text-green-400 text-xs lg:text-sm">↑ 12% از ماه قبل</p>
                            </div>
                            <div class="bg-yellow-primary/20 p-3 lg:p-4 rounded-full">
                                <i class="fas fa-users text-yellow-primary text-lg lg:text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-xs lg:text-sm">فروش امروز</p>
                                <p class="text-xl lg:text-2xl font-bold text-yellow-primary"><?php echo number_format($total_income); ?> تومان</p>
                                <p class="text-green-400 text-xs lg:text-sm">↑ 8% از دیروز</p>
                            </div>
                            <div class="bg-green-500/20 p-3 lg:p-4 rounded-full">
                                <i class="fas fa-dollar-sign text-green-400 text-lg lg:text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-xs lg:text-sm">سفارشات جدید</p>
                                <p class="text-xl lg:text-2xl font-bold text-yellow-primary"><?php echo number_format($order_count); ?></p>
                                <p class="text-red-400 text-xs lg:text-sm">↓ 3% از دیروز</p>
                            </div>
                            <div class="bg-blue-500/20 p-3 lg:p-4 rounded-full">
                                <i class="fas fa-shopping-cart text-blue-400 text-lg lg:text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-xs lg:text-sm">تصاویر AI</p>
                                <p class="text-xl lg:text-2xl font-bold text-yellow-primary"><?php echo number_format($gallery_count); ?></p>
                                <p class="text-green-400 text-xs lg:text-sm">↑ 15% از هفته قبل</p>
                            </div>
                            <div class="bg-purple-500/20 p-3 lg:p-4 rounded-full">
                                <i class="fas fa-image text-purple-400 text-lg lg:text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- نمودار و فعالیت‌ها -->
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <!-- نمودار فروش -->
                    <div class="xl:col-span-2 glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20">
                        <h3 class="text-yellow-primary font-bold text-base lg:text-lg mb-4">نمودار فروش</h3>
                        <div class="h-48 lg:h-64">
                            <canvas id="salesChart"></canvas>
                        </div>
                    </div>

                    <!-- فعالیت‌های اخیر -->
                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20">
                        <h3 class="text-yellow-primary font-bold text-base lg:text-lg mb-4">فعالیت‌های اخیر</h3>
                        <div class="space-y-3 lg:space-y-4">
                            <div class="flex items-center space-x-3 space-x-reverse">
                                <div class="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-user-plus text-white text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-gray-300 text-xs lg:text-sm">کاربر جدید عضو شد</p>
                                    <p class="text-gray-500 text-xs">5 دقیقه پیش</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 space-x-reverse">
                                <div class="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-shopping-bag text-white text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-gray-300 text-xs lg:text-sm">سفارش جدید ثبت شد</p>
                                    <p class="text-gray-500 text-xs">12 دقیقه پیش</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 space-x-reverse">
                                <div class="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-star text-dark-primary text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-gray-300 text-xs lg:text-sm">نظر جدید دریافت شد</p>
                                    <p class="text-gray-500 text-xs">25 دقیقه پیش</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 space-x-reverse">
                                <div class="w-6 h-6 lg:w-8 lg:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-exclamation text-white text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-gray-300 text-xs lg:text-sm">خطا در سیستم</p>
                                    <p class="text-gray-500 text-xs">1 ساعت پیش</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- جداول -->
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <!-- آخرین سفارشات -->
                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                            <h3 class="text-yellow-primary font-bold text-base lg:text-lg">آخرین سفارشات</h3>
                            <button class="text-yellow-primary hover:text-yellow-secondary text-xs lg:text-sm self-start sm:self-auto">مشاهده همه</button>
                        </div>
                        <div class="table-container overflow-x-auto">
                            <table class="w-full min-w-[500px]">
                                <thead>
                                    <tr class="border-b border-gray-700">
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">شماره</th>
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">مشتری</th>
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">مبلغ</th>
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">وضعیت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b border-gray-800">
                                        <td class="py-2 lg:py-3 text-yellow-primary text-xs lg:text-sm">#1234</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">احمد محمدی</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">899,000 تومان</td>
                                        <td class="py-2 lg:py-3">
                                            <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">تکمیل</span>
                                        </td>
                                    </tr>
                                    <tr class="border-b border-gray-800">
                                        <td class="py-2 lg:py-3 text-yellow-primary text-xs lg:text-sm">#1235</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">مریم احمدی</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">699,000 تومان</td>
                                        <td class="py-2 lg:py-3">
                                            <span class="bg-yellow-primary/20 text-yellow-primary px-2 py-1 rounded-full text-xs">انتظار</span>
                                        </td>
                                    </tr>
                                    <tr class="border-b border-gray-800">
                                        <td class="py-2 lg:py-3 text-yellow-primary text-xs lg:text-sm">#1236</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">علی رضایی</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">199,000 تومان</td>
                                        <td class="py-2 lg:py-3">
                                            <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">ارسال</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- محصولات پرفروش -->
                    <div class="glass-card rounded-xl p-4 lg:p-6 border border-yellow-primary/20">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                            <h3 class="text-yellow-primary font-bold text-base lg:text-lg">محصولات پرفروش</h3>
                            <button class="text-yellow-primary hover:text-yellow-secondary text-xs lg:text-sm self-start sm:self-auto">مشاهده همه</button>
                        </div>
                        <div class="table-container overflow-x-auto">
                            <table class="w-full min-w-[400px]">
                                <thead>
                                    <tr class="border-b border-gray-700">
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">محصول</th>
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">فروش</th>
                                        <th class="text-right text-gray-400 font-medium py-2 lg:py-3 text-xs lg:text-sm">درآمد</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b border-gray-800">
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">لپ تاپ ایسوس</td>
                                        <td class="py-2 lg:py-3 text-yellow-primary text-xs lg:text-sm">45</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">40,455,000 تومان</td>
                                    </tr>
                                    <tr class="border-b border-gray-800">
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">گوشی سامسونگ</td>
                                        <td class="py-2 lg:py-3 text-yellow-primary text-xs lg:text-sm">38</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">26,562,000 تومان</td>
                                    </tr>
                                    <tr class="border-b border-gray-800">
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">هدفون بی‌سیم</td>
                                        <td class="py-2 lg:py-3 text-yellow-primary text-xs lg:text-sm">29</td>
                                        <td class="py-2 lg:py-3 text-gray-300 text-xs lg:text-sm">5,771,000 تومان</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- بخش ابزارهای هوش مصنوعی -->
            <div id="ai-tools-section" class="ai-section">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-purple-400"><i class="fas fa-magic mr-2"></i> ابزارهای هوش مصنوعی</h2>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- تولید متن -->
                    <div class="glass-card rounded-xl p-6 border border-yellow-primary/20">
                        <h3 class="text-xl font-bold text-purple-400 mb-4">تولید محتوا با هوش مصنوعی</h3>
                        
                        <div class="mb-4">
                            <label class="block text-sm text-gray-400 mb-2">نوع محتوا</label>
                            <select id="text-type" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none">
                                <option value="blog">📝 مقاله وبلاگ (سئو شده)</option>
                                <option value="caption">📱 کپشن اینستاگرام</option>
                                <option value="ad">📢 متن تبلیغاتی</option>
                            </select>
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-sm text-gray-400 mb-2">موضوع یا عنوان</label>
                            <textarea id="text-prompt" rows="4" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none" placeholder="مثلاً: مزایای داشتن سایت برای رستوران‌ها..."></textarea>
                        </div>
                        
                        <button onclick="generateText()" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                            <span class="loading-spinner" id="text-spinner"></span>
                            شروع نوشتن
                        </button>
                    </div>

                    <!-- نتیجه تولید متن -->
                    <div class="glass-card rounded-xl p-6 border border-yellow-primary/20 relative">
                        <h3 class="text-xl font-bold text-purple-400 mb-4">نتیجه:</h3>
                        <div id="text-result" class="w-full h-[400px] bg-dark-tertiary rounded-lg p-4 overflow-y-auto text-gray-300 leading-7 text-sm border border-yellow-primary/20">
                            هنوز متنی تولید نشده است...
                        </div>
                        <button onclick="copyText()" class="absolute top-6 left-6 text-gray-400 hover:text-white bg-dark-tertiary p-2 rounded-lg shadow">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>

                <!-- تولید تصویر -->
                <div class="mt-8 glass-card rounded-xl p-6 border border-yellow-primary/20">
                    <h3 class="text-xl font-bold text-pink-400 mb-4">تولید تصویر با هوش مصنوعی</h3>
                    
                    <div class="flex gap-4 mb-6">
                        <input type="text" id="img-prompt" class="flex-1 bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none" placeholder="توصیف عکس (مثلاً: A futuristic neon office with computers)">
                        <button onclick="generateImage()" class="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                            <span class="loading-spinner" id="img-spinner"></span>
                            ساختن
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mb-6">* برای نتیجه بهتر، توصیف را به انگلیسی بنویسید.</p>

                    <div id="image-result-area" class="hidden text-center">
                        <div class="inline-block relative group">
                            <img id="generated-img" src="" class="rounded-2xl shadow-2xl border-4 border-white/10 max-h-[500px]">
                            <div class="absolute bottom-4 right-4 flex gap-2">
                                <button onclick="saveImage()" class="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-500 transition font-bold">
                                    <i class="fas fa-save mr-2"></i> ذخیره در گالری
                                </button>
                                <a id="download-link" href="#" download="ai-image.jpg" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-500 transition font-bold">
                                    <i class="fas fa-download mr-2"></i> دانلود
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- بخش تنظیمات -->
            <div id="settings-section" class="ai-section">
                <h2 class="text-2xl font-bold mb-6">تنظیمات عمومی</h2>
                <div class="glass-card rounded-xl p-6 border border-yellow-primary/20">
                    <form method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-400">نام سایت</label>
                            <input type="text" name="site_name" value="<?php echo $settings['site_name']; ?>" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none">
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">شماره تماس ۱</label>
                            <input type="text" name="phone_1" value="<?php echo $settings['phone_1']; ?>" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none dir-ltr text-left">
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">شماره تماس ۲</label>
                            <input type="text" name="phone_2" value="<?php echo $settings['phone_2']; ?>" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none dir-ltr text-left">
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">اینستاگرام</label>
                            <input type="text" name="instagram" value="<?php echo $settings['instagram']; ?>" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none">
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">تلگرام</label>
                            <input type="text" name="telegram" value="<?php echo $settings['telegram']; ?>" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none">
                        </div>
                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-400">آدرس</label>
                            <textarea name="address" rows="3" class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg p-3 text-white focus:border-yellow-primary focus:outline-none"><?php echo $settings['address']; ?></textarea>
                        </div>
                        <div class="md:col-span-2">
                            <button name="save_settings" class="w-full bg-gradient-to-r from-yellow-primary to-yellow-dark text-dark-primary py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                                ذخیره تغییرات
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script>
        // توابع منو
        function toggleDropdown(id) {
            const dropdown = document.getElementById(`${id}-dropdown`);
            const arrow = document.getElementById(`${id}-arrow`);

            dropdown.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
        }

        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');

            sidebar.classList.toggle('translate-x-full');
            overlay.classList.toggle('hidden');
        }

        function toggleNotifications() {
            const panel = document.getElementById('notification-panel');
            panel.classList.toggle('show');
        }

        function showSection(sectionName) {
            // مخفی کردن همه بخش‌ها
            document.querySelectorAll('.ai-section').forEach(el => el.classList.remove('active'));
            
            // نمایش بخش مورد نظر
            document.getElementById(`${sectionName}-section`).classList.add('active');
            
            // بستن منوی موبایل
            if (window.innerWidth < 1024) {
                toggleMobileSidebar();
            }
        }

        // توابع هوش مصنوعی
        async function generateText() {
            const prompt = document.getElementById('text-prompt').value;
            const type = document.getElementById('text-type').value;
            const spinner = document.getElementById('text-spinner');
            const resultBox = document.getElementById('text-result');

            if(!prompt) return alert('لطفا موضوع را بنویسید');

            spinner.style.display = 'inline-block';
            resultBox.innerHTML = '<span class="animate-pulse">در حال نوشتن... لطفا صبر کنید.</span>';

            try {
                const res = await fetch('ai-engine.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'generate_text', prompt: prompt, type: type })
                });
                const data = await res.json();
                
                if(data.result) {
                    // تبدیل مارک‌داون به HTML ساده
                    let html = data.result.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
                    resultBox.innerHTML = html;
                } else {
                    resultBox.innerHTML = 'خطا: ' + data.error;
                }
            } catch(e) {
                resultBox.innerHTML = 'خطای ارتباط با سرور';
            }
            spinner.style.display = 'none';
        }

        function copyText() {
            const text = document.getElementById('text-result').innerText;
            navigator.clipboard.writeText(text);
            alert('متن کپی شد!');
        }

        async function generateImage() {
            const prompt = document.getElementById('img-prompt').value;
            const spinner = document.getElementById('img-spinner');
            const resultArea = document.getElementById('image-result-area');
            const img = document.getElementById('generated-img');
            const dlLink = document.getElementById('download-link');

            if(!prompt) return alert('لطفا توصیف عکس را بنویسید');

            spinner.style.display = 'inline-block';
            resultArea.classList.add('hidden');

            try {
                const res = await fetch('ai-engine.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'generate_image', prompt: prompt })
                });
                const data = await res.json();
                
                if(data.image_url) {
                    img.src = data.image_url;
                    dlLink.href = data.image_url;
                    
                    img.onload = () => {
                        spinner.style.display = 'none';
                        resultArea.classList.remove('hidden');
                    };
                }
            } catch(e) {
                alert('خطا در تولید تصویر');
                spinner.style.display = 'none';
            }
        }

        async function saveImage() {
            const imgUrl = document.getElementById('generated-img').src;
            if(!imgUrl) return;

            if(!confirm('آیا تصویر در گالری هاست ذخیره شود؟')) return;

            try {
                const res = await fetch('ai-engine.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'save_image', url: imgUrl })
                });
                const data = await res.json();
                if(data.success) {
                    alert('✅ تصویر با موفقیت ذخیره شد: ' + data.path);
                } else {
                    alert('خطا: ' + data.error);
                }
            } catch(e) {
                alert('خطای ارتباط');
            }
        }

        // نمودار فروش
        document.addEventListener('DOMContentLoaded', function() {
            const ctx = document.getElementById('salesChart').getContext('2d');
            const salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان'],
                    datasets: [{
                        label: 'فروش (میلیون تومان)',
                        data: [65, 78, 90, 81, 96, 105, 112, 125],
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#e5e7eb',
                                font: {
                                    family: 'Vazirmatn'
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: '#9ca3af'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#9ca3af'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        });

        // بستن پنل نوتیفیکیشن با کلیک خارج
        document.addEventListener('click', function(event) {
            const panel = document.getElementById('notification-panel');
            const button = event.target.closest('button');
            
            if (!panel.contains(event.target) && !button?.onclick?.toString().includes('toggleNotifications')) {
                if (panel.classList.contains('show')) {
                    panel.classList.remove('show');
                }
            }
        });

        // انیمیشن کارت‌ها
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.card-hover');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.5s ease';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });
        });
    </script>
</body>
</html>