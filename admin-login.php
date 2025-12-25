<?php
session_start();

// اگر ادمین لاگین کرده، بره به پنل
if (isset($_SESSION['admin_logged_in'])) {
    header("Location: admin-panel.php");
    exit();
}

// اگر فرم ارسال شده
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require 'db.php';
    
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = "نام کاربری و رمز عبور را وارد کنید";
    } else {
        // بررسی اطلاعات ادمین
        $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin && password_verify($password, $admin['password'])) {
            // ذخیره اطلاعات سشن
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            
            // ریدایرکت به پنل
            header("Location: admin-panel.php");
            exit();
        } else {
            $error = "نام کاربری یا رمز عبور اشتباه است";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ورود به پنل ادمین</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
        
        * {
            font-family: 'Vazirmatn', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .login-card {
            background: rgba(26, 26, 46, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="login-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div class="text-center mb-8">
            <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <i class="fas fa-crown text-dark-primary text-3xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-yellow-400">ورود به پنل ادمین</h1>
            <p class="text-gray-400 mt-2">لطفاً اطلاعات خود را وارد کنید</p>
        </div>
        
        <?php if (isset($error)): ?>
            <div class="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" class="space-y-6">
            <div>
                <label class="block text-gray-400 text-sm mb-2">نام کاربری</label>
                <div class="relative">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i class="fas fa-user text-gray-500"></i>
                    </div>
                    <input type="text" name="username" required
                        class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg py-3 pr-10 text-white focus:border-yellow-primary focus:outline-none"
                        placeholder="نام کاربری را وارد کنید">
                </div>
            </div>
            
            <div>
                <label class="block text-gray-400 text-sm mb-2">رمز عبور</label>
                <div class="relative">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i class="fas fa-lock text-gray-500"></i>
                    </div>
                    <input type="password" name="password" required
                        class="w-full bg-dark-tertiary border border-yellow-primary/20 rounded-lg py-3 pr-10 text-white focus:border-yellow-primary focus:outline-none"
                        placeholder="رمز عبور را وارد کنید">
                </div>
            </div>
            
            <div class="flex items-center justify-between">
                <label class="flex items-center">
                    <input type="checkbox" class="rounded border-yellow-primary/20 text-yellow-primary focus:ring-yellow-primary">
                    <span class="mr-2 text-sm text-gray-400">مرا به خاطر بسپار</span>
                </label>
                <a href="#" class="text-sm text-yellow-primary hover:underline">فراموشی رمز؟</a>
            </div>
            
            <button type="submit"
                class="w-full bg-gradient-to-r from-yellow-primary to-yellow-dark text-dark-primary py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                ورود به پنل
            </button>
        </form>
        
        <div class="mt-8 text-center">
            <p class="text-gray-500 text-sm">
                <i class="fas fa-shield-alt ml-1"></i>
                ورود فقط برای مدیران سیستم مجاز است
            </p>
        </div>
    </div>
</body>
</html>