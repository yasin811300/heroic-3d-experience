<?php
session_start();
require 'db.php';

// امنیت: اگر لاگین نیست، برود بیرون
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>لیست کاربران | پنل مدیریت</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&display=swap');
        body { font-family: 'Vazirmatn', sans-serif; background: #1a202c; color: white; }
    </style>
</head>
<body class="flex h-screen overflow-hidden">

    <aside class="w-64 bg-gray-900 p-6 flex flex-col shadow-2xl border-l border-gray-800">
        <div class="text-2xl font-bold mb-10 text-blue-400 flex items-center gap-2">
            <i class="fas fa-rocket"></i> پنل ادمین
        </div>
        
        <nav class="space-y-2 flex-1">
            <a href="admin-panel.php" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition">
                <i class="fas fa-arrow-right"></i> بازگشت به داشبورد
            </a>
            
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20">
                <i class="fas fa-users"></i> لیست کاربران
            </div>
        </nav>
        
        <div class="mt-auto">
            <a href="logout.php" class="block bg-red-600 text-white py-2 px-4 rounded-lg text-center hover:bg-red-700 transition text-sm">
                خروج امن <i class="fas fa-sign-out-alt ml-1"></i>
            </a>
        </div>
    </aside>

    <main class="flex-1 p-10 overflow-y-auto bg-gray-800">
        <div class="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <div>
                <h2 class="text-3xl font-bold text-white">👥 لیست تمام کاربران سایت</h2>
                <p class="text-gray-400 text-sm mt-1">مدیریت و مشاهده اطلاعات ثبت‌نام کنندگان</p>
            </div>
            <div class="bg-gray-900 px-4 py-2 rounded-lg text-gray-400 text-sm">
                تعداد کل: 
                <span class="text-yellow-400 font-bold text-lg ml-1">
                    <?php 
                    $count = $conn->query("SELECT COUNT(*) as total FROM users")->fetch_assoc()['total'];
                    echo $count; 
                    ?>
                </span> نفر
            </div>
        </div>
        
        <div class="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700">
            <table class="w-full text-right">
                <thead class="bg-gray-700 text-gray-300 uppercase text-sm">
                    <tr>
                        <th class="p-4 text-center">شناسه</th>
                        <th class="p-4">نام کامل</th>
                        <th class="p-4">نام کاربری</th>
                        <th class="p-4">موبایل</th>
                        <th class="p-4">کیف پول</th>
                        <th class="p-4 text-center">تاریخ عضویت</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800 text-sm text-gray-300">
                    <?php
                    $sql = "SELECT * FROM users ORDER BY id DESC";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            // فرمت کردن تاریخ (اختیاری: اگر تاریخ میلادی ذخیره شده)
                            $date = $row['created_at']; 
                            
                            echo "<tr class='hover:bg-gray-800 transition duration-200'>
                                    <td class='p-4 text-center font-mono text-blue-400'>#{$row['id']}</td>
                                    <td class='p-4 font-bold text-white flex items-center gap-2'>
                                        <div class='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs'><i class='fas fa-user'></i></div>
                                        {$row['fullname']}
                                    </td>
                                    <td class='p-4 text-gray-400 dir-ltr text-left'>@{$row['username']}</td>
                                    <td class='p-4 font-mono text-yellow-500'>{$row['phone']}</td>
                                    <td class='p-4 text-green-400 font-bold'>" . number_format($row['wallet']) . " تومان</td>
                                    <td class='p-4 text-center dir-ltr text-gray-500 text-xs'>{$date}</td>
                                  </tr>";
                        }
                    } else {
                        echo "<tr><td colspan='6' class='p-10 text-center text-gray-500 flex flex-col items-center gap-2'><i class='fas fa-inbox text-4xl opacity-50'></i>هنوز کاربری ثبت نام نکرده است.</td></tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </main>

</body>
</html>