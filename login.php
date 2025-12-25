<?php
session_start();

// اگر کاربر لاگین است، مستقیم به داشبورد برود
if(isset($_SESSION['user_phone'])) {
    header("Location: dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ورود / ثبت‌نام | آژانس ازما</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap');
        body { font-family: 'Vazirmatn', sans-serif; background: #0f2027; background-image: url('body-bg.jpg'); background-size: cover; }
        .glass-card { background: rgba(15, 32, 39, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .btn-gold { background: linear-gradient(45deg, #f59e0b, #ff7e5f); color: white; font-weight: bold; transition: 0.3s; }
        .btn-gold:hover { transform: scale(1.02); box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }
        .input-field { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: 0.3s; }
        .input-field:focus { border-color: #f59e0b; background: rgba(255,255,255,0.1); }
        .tab-btn.active { color: #f59e0b; border-bottom: 2px solid #f59e0b; }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">

    <div class="glass-card p-8 w-full max-w-md relative shadow-2xl">
        
        <div class="text-center mb-6">
            <a href="index.php"><img src="logo.png" class="h-12 mx-auto mb-2"></a>
            <h2 class="text-xl text-white font-bold">ناحیه کاربری ازما</h2>
        </div>

        <?php if(!isset($_GET['mode'])): ?>
        <div class="flex justify-center gap-6 mb-6 text-gray-400 text-sm border-b border-white/10 pb-2">
            <button onclick="switchTab('login-pass')" id="btn-pass" class="tab-btn active pb-2 transition">ورود با رمز</button>
            <button onclick="switchTab('login-otp')" id="btn-otp" class="tab-btn pb-2 transition">ورود پیامکی</button>
            <button onclick="switchTab('register')" id="btn-reg" class="tab-btn pb-2 transition">ثبت‌نام</button>
        </div>
        <?php endif; ?>

        <form action="auth.php" method="POST" id="login-pass" class="<?php echo isset($_GET['mode']) ? 'hidden' : ''; ?> space-y-4">
            <input type="hidden" name="action" value="login_password">
            <div>
                <label class="text-gray-400 text-xs mb-1 block">شماره موبایل</label>
                <input type="text" name="phone" class="input-field w-full p-3 rounded-xl text-left" dir="ltr" required>
            </div>
            <div>
                <label class="text-gray-400 text-xs mb-1 block">رمز عبور</label>
                <input type="password" name="password" class="input-field w-full p-3 rounded-xl text-left" dir="ltr" required>
            </div>
            <button class="btn-gold w-full py-3 rounded-xl shadow-lg">ورود به حساب</button>
        </form>

        <div id="login-otp" class="hidden">
            <form action="auth.php" method="POST">
                <input type="hidden" name="action" value="send_otp_login">
                <label class="text-gray-400 text-xs mb-1 block">شماره موبایل</label>
                <input type="text" name="phone" class="input-field w-full p-3 rounded-xl text-left mb-4" dir="ltr" required>
                <button class="btn-gold w-full py-3 rounded-xl shadow-lg">ارسال کد ورود</button>
            </form>
        </div>

        <div id="register" class="hidden">
            <form action="auth.php" method="POST">
                <input type="hidden" name="action" value="send_otp_register">
                <label class="text-gray-400 text-xs mb-1 block">شماره موبایل</label>
                <input type="text" name="phone" class="input-field w-full p-3 rounded-xl text-left mb-4" dir="ltr" required placeholder="09xxxxxxxxx">
                <button class="btn-gold w-full py-3 rounded-xl shadow-lg">دریافت کد ثبت‌نام</button>
            </form>
        </div>

        <?php if(isset($_GET['mode']) && isset($_GET['phone'])): ?>
            <div class="absolute inset-0 bg-[#0f2027] z-50 p-8 rounded-20 glass-card flex flex-col justify-center">
                <div class="text-center mb-4">
                    <i class="fas fa-envelope-open-text text-4xl text-yellow-500 mb-2"></i>
                    <h3 class="text-white font-bold">تایید شماره موبایل</h3>
                    <p class="text-gray-400 text-sm mt-1">کد ارسال شده به <span class="text-yellow-400"><?php echo htmlspecialchars($_GET['phone']); ?></span></p>
                </div>
                
                <form action="auth.php" method="POST" class="space-y-4">
                    <input type="hidden" name="phone" value="<?php echo htmlspecialchars($_GET['phone']); ?>">
                    
                    <?php if($_GET['mode'] == 'verify_register'): ?>
                        <input type="hidden" name="action" value="verify_register">
                        
                        <input type="text" name="otp" placeholder="کد تایید (۵ رقمی)" class="input-field w-full p-3 rounded-xl text-center tracking-[5px] text-xl font-bold" required autofocus>
                        
                        <div class="space-y-3 pt-2 border-t border-white/10">
                            <p class="text-xs text-gray-500">اطلاعات حساب خود را تعیین کنید:</p>
                            <input type="text" name="fullname" placeholder="نام و نام خانوادگی" class="input-field w-full p-3 rounded-xl" required>
                            <input type="text" name="username" placeholder="نام کاربری (انگلیسی)" class="input-field w-full p-3 rounded-xl text-left" dir="ltr" required>
                            <input type="password" name="password" placeholder="رمز عبور" class="input-field w-full p-3 rounded-xl text-left" dir="ltr" required>
                        </div>
                        <button class="btn-gold w-full py-3 rounded-xl mt-2">ایجاد حساب کاربری</button>
                    
                    <?php elseif($_GET['mode'] == 'verify_login'): ?>
                        <input type="hidden" name="action" value="verify_login">
                        <input type="text" name="otp" placeholder="- - - - -" class="input-field w-full p-3 rounded-xl text-center tracking-[10px] text-2xl font-bold" required autofocus>
                        <button class="btn-gold w-full py-3 rounded-xl mt-4">تایید و ورود</button>
                    <?php endif; ?>
                </form>

                <div class="text-center mt-4">
                    <p id="timer" class="text-yellow-500 text-sm font-mono">02:00</p>
                    <a href="login.php" id="resend-btn" class="text-gray-500 text-xs mt-2 hidden cursor-pointer hover:text-white border-b border-gray-600 pb-1">ارسال مجدد / اصلاح شماره</a>
                </div>
            </div>
            
            <script>
                let time = 120;
                const timerEl = document.getElementById('timer');
                const resendBtn = document.getElementById('resend-btn');
                const interval = setInterval(() => {
                    const m = Math.floor(time / 60);
                    const s = time % 60;
                    timerEl.innerText = `0${m}:${s < 10 ? '0' : ''}${s}`;
                    time--;
                    if (time < 0) {
                        clearInterval(interval);
                        timerEl.classList.add('hidden');
                        resendBtn.classList.remove('hidden');
                    }
                }, 1000);
            </script>
        <?php endif; ?>

        <div class="mt-6 text-center border-t border-white/10 pt-4">
            <a href="index.php" class="text-gray-500 hover:text-white text-sm transition">بازگشت به صفحه اصلی</a>
        </div>
    </div>

    <script>
        function switchTab(tabId) {
            ['login-pass', 'login-otp', 'register'].forEach(id => document.getElementById(id).classList.add('hidden'));
            document.getElementById(tabId).classList.remove('hidden');
            
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            if(tabId === 'login-pass') document.getElementById('btn-pass').classList.add('active');
            if(tabId === 'login-otp') document.getElementById('btn-otp').classList.add('active');
            if(tabId === 'register') document.getElementById('btn-reg').classList.add('active');
        }
    </script>
</body>
</html>