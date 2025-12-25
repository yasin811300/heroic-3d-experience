<?php
/**
 * فایل تست ربات تلگرام
 * این فایل رو اجرا کن تا ببینی ربات کار می‌کنه یا نه
 */

require 'telegram-config.php';

echo "<!DOCTYPE html>
<html lang='fa' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <title>تست ربات تلگرام</title>
    <style>
        body { 
            font-family: 'Vazirmatn', Tahoma, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
        }
        h1 { 
            color: #667eea; 
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .result {
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
            border-left: 5px solid;
        }
        .success {
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .info {
            background: #d1ecf1;
            border-color: #0dcaf0;
            color: #055160;
        }
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            margin: 10px 5px;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        code {
            background: #f4f4f4;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e83e8c;
        }
    </style>
</head>
<body>
<div class='container'>";

echo "<h1>🤖 تست ربات تلگرام آژانس ازما</h1>";

// 1. بررسی اتصال به ربات
echo "<h3>1️⃣ بررسی اتصال به ربات...</h3>";
$bot_info = getTelegramBotInfo();

if ($bot_info) {
    echo "<div class='result success'>";
    echo "✅ <strong>ربات فعال است!</strong><br>";
    echo "نام ربات: <code>@{$bot_info['username']}</code><br>";
    echo "نام نمایشی: {$bot_info['first_name']}<br>";
    echo "آی‌دی: <code>{$bot_info['id']}</code>";
    echo "</div>";
} else {
    echo "<div class='result error'>";
    echo "❌ <strong>خطا در اتصال به ربات!</strong><br>";
    echo "لطفاً توکن ربات را در فایل <code>telegram-config.php</code> بررسی کنید.";
    echo "</div>";
    exit;
}

// 2. ارسال پیام ساده
echo "<h3>2️⃣ ارسال پیام تستی...</h3>";
$test_message = "🎉 <b>تبریک!</b>\n\nربات تلگرام شما با موفقیت راه‌اندازی شد.\n\n⏰ زمان تست: " . date('Y/m/d H:i:s');
$send_result = sendTelegramMessage($test_message);

if ($send_result) {
    echo "<div class='result success'>";
    echo "✅ پیام تستی با موفقیت ارسال شد! تلگرام خود را چک کنید.";
    echo "</div>";
} else {
    echo "<div class='result error'>";
    echo "❌ خطا در ارسال پیام!<br>";
    echo "احتمالاً Chat ID اشتباه است. از <code>@userinfobot</code> Chat ID خود را دریافت کنید.";
    echo "</div>";
}

// 3. ارسال پیام فرمت‌شده
echo "<h3>3️⃣ ارسال اعلان حرفه‌ای...</h3>";
$details = [
    'سایت' => 'آژانس دیجیتال مارکتینگ ازما',
    'وضعیت' => '✅ آنلاین',
    'تعداد کاربران' => '127 نفر',
    'تراکنش‌های امروز' => '12 تراکنش'
];

$formatted_result = sendFormattedNotification('📊 گزارش روزانه سیستم', $details, '📈');

if ($formatted_result) {
    echo "<div class='result success'>";
    echo "✅ اعلان حرفه‌ای ارسال شد!";
    echo "</div>";
} else {
    echo "<div class='result error'>";
    echo "❌ خطا در ارسال اعلان فرمت‌شده.";
    echo "</div>";
}

// 4. ارسال پیام با دکمه
echo "<h3>4️⃣ ارسال پیام با دکمه‌های تعاملی...</h3>";
$keyboard = [
    [
        ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir'],
        ['text' => '📊 پنل مدیریت', 'url' => 'https://azmamarkteng.ir/admin-panel.php']
    ],
    [
        ['text' => '📞 تماس با ما', 'url' => 'tel:+989914601322']
    ]
];

$keyboard_result = sendTelegramMessage("🔘 این یک پیام با دکمه‌های تعاملی است:", 'HTML', $keyboard);

if ($keyboard_result) {
    echo "<div class='result success'>";
    echo "✅ پیام با دکمه‌ها ارسال شد! روی دکمه‌ها در تلگرام کلیک کنید.";
    echo "</div>";
} else {
    echo "<div class='result error'>";
    echo "❌ خطا در ارسال پیام با دکمه.";
    echo "</div>";
}

// راهنمای بعدی
echo "<div class='result info'>";
echo "<h3>🎯 مراحل بعدی:</h3>";
echo "<ol style='line-height: 2;'>";
echo "<li>اگر همه تست‌ها موفق بود، ربات شما آماده است! 🎉</li>";
echo "<li>فایل <code>telegram-config.php</code> را از Git حذف کنید (برای امنیت)</li>";
echo "<li>اکنون می‌توانید در تمام قسمت‌های سایت از ربات استفاده کنید</li>";
echo "<li><strong>این فایل تست را از هاست پاک کنید!</strong></li>";
echo "</ol>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 30px;'>";
echo "<a href='contact.php' class='btn'>✉️ تست فرم تماس</a>";
echo "<a href='admin-panel.php' class='btn'>🎛️ رفتن به پنل</a>";
echo "</div>";

echo "</div></body></html>";
?>