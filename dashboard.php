<?php
session_start();
require 'db.php';

// اگر لاگین نیست، برود به login.php
if (!isset($_SESSION['user_phone'])) { header("Location: login.php"); exit(); }

$phone = $_SESSION['user_phone'];
$result = $conn->query("SELECT * FROM users WHERE phone='$phone'");
$user = $result->fetch_assoc();

// ویرایش پروفایل
if (isset($_POST['update_profile'])) {
    $new_name = $_POST['fullname'];
    $new_username = $_POST['username'];
    $conn->query("UPDATE users SET fullname='$new_name', username='$new_username' WHERE phone='$phone'");
    // رفرش صفحه برای دیدن تغییرات
    echo "<script>window.location.href='dashboard.php';</script>";
}
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>داشبورد <?php echo $user['fullname']; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap');
        body { font-family: 'Vazirmatn', sans-serif; background: #0f2027; color: white; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .sidebar-link { display: flex; items-center; gap: 12px; padding: 14px; border-radius: 15px; transition: 0.3s; color: #ccc; }
        .sidebar-link:hover, .sidebar-link.active { background: linear-gradient(45deg, #f59e0b, #ff7e5f); color: white; font-weight: bold; box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3); }
    </style>
</head>
<body class="bg-[#0f2027] min-h-screen p-4 md:p-8">

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div class="glass p-6 h-fit sticky top-8">
            <div class="text-center mb-8 border-b border-white/10 pb-6">
                <div class="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-600 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-3 shadow-lg">
                    <?php echo mb_substr($user['fullname'], 0, 1); ?>
                </div>
                <h2 class="text-xl font-bold text-white"><?php echo $user['fullname']; ?></h2>
                <p class="text-gray-400 text-sm mt-1 dir-ltr">@<?php echo $user['username'] ? $user['username'] : 'user'; ?></p>
            </div>
            
            <nav class="space-y-2">
                <a href="#" class="sidebar-link active"><i class="fas fa-th-large"></i> داشبورد</a>
                <a href="services.html" class="sidebar-link"><i class="fas fa-shopping-bag"></i> سفارش جدید</a>
                <a href="#" class="sidebar-link"><i class="fas fa-wallet"></i> کیف پول</a>
                <a href="index.html" class="sidebar-link"><i class="fas fa-home"></i> صفحه اصلی سایت</a>
                <a href="logout.php" class="sidebar-link text-red-400 hover:from-red-600 hover:to-red-800 mt-10"><i class="fas fa-sign-out-alt"></i> خروج</a>
            </nav>
        </div>

        <div class="md:col-span-3 space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass p-6 relative overflow-hidden group">
                    <div class="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div class="relative z-10">
                        <h3 class="text-gray-400 text-sm mb-2 flex justify-between">موجودی حساب <i class="fas fa-wallet text-yellow-500"></i></h3>
                        <div class="text-3xl font-bold text-white mb-4"><?php echo number_format($user['wallet']); ?> <span class="text-sm text-gray-400 font-normal">تومان</span></div>
                        <button class="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 hover:text-black transition w-full">
                            <i class="fas fa-plus-circle ml-1"></i> افزایش موجودی
                        </button>
                    </div>
                </div>

                <div class="glass p-6 flex flex-col justify-between">
                    <h3 class="text-gray-400 text-sm mb-2 flex justify-between">سفارش‌های فعال <i class="fas fa-box-open text-blue-400"></i></h3>
                    <div class="text-3xl font-bold text-white">0 <span class="text-sm text-gray-400 font-normal">عدد</span></div>
                    <p class="text-xs text-gray-500 mt-2">در حال انجام...</p>
                </div>

                <div class="glass p-6 flex flex-col justify-between">
                    <h3 class="text-gray-400 text-sm mb-2 flex justify-between">تیکت‌های پشتیبانی <i class="fas fa-headset text-green-400"></i></h3>
                    <div class="text-3xl font-bold text-white">0</div>
                    <a href="contact.html" class="text-xs text-green-400 mt-2 hover:underline">ارسال تیکت جدید</a>
                </div>
            </div>

            <div class="glass p-8">
                <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 class="text-xl font-bold text-white"><i class="fas fa-user-edit ml-2 text-accent"></i> ویرایش اطلاعات</h3>
                </div>
                
                <form method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="text-gray-400 text-sm mb-2 block">نام و نام خانوادگی</label>
                        <input type="text" name="fullname" value="<?php echo $user['fullname']; ?>" class="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500 outline-none transition">
                    </div>
                    <div>
                        <label class="text-gray-400 text-sm mb-2 block">نام کاربری (انگلیسی)</label>
                        <input type="text" name="username" value="<?php echo $user['username']; ?>" class="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500 outline-none transition text-left" dir="ltr">
                    </div>
                    <div class="md:col-span-2">
                        <label class="text-gray-400 text-sm mb-2 block">شماره موبایل (غیرقابل تغییر)</label>
                        <div class="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-gray-500 text-left flex justify-between items-center" dir="ltr">
                            <span><?php echo $user['phone']; ?></span>
                            <i class="fas fa-lock text-xs"></i>
                        </div>
                    </div>
                    <div class="md:col-span-2 flex justify-end mt-2">
                        <button name="update_profile" class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/20">
                            ذخیره تغییرات
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </div>

</body>
</html>