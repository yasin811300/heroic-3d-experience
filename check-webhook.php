<?php
/**
 * فایل بررسی وضعیت Webhook و ارسال پیام تست
 * این فایل رو یکبار اجرا کن و ببین مشکل کجاست
 */

require 'telegram-config.php';

echo "<!DOCTYPE html>
<html lang='fa' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <title>بررسی وضعیت ربات تلگرام</title>
    <style>
        body { font-family: 'Vazirmatn', Tahoma; background: #1a202c; color: #fff; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: #2d3748; padding: 30px; border-radius: 15px; }
        h1 { color: #f59e0b; border-bottom: 3px solid #f59e0b; padding-bottom: 10px; }
        .box { background: #1a202c; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid; }
        .success { border-color: #10b981; }
        .error { border-color: #ef4444; }
        .info { border-color: #3b82f6; }
        .warning { border-color: #f59e0b; }
        code { background: #374151; padding: 3px 8px; border-radius: 5px; color: #60a5fa; }
        .btn { background: #f59e0b; color: #000; padding: 12px 25px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 10px 5px; text-decoration: none; display: inline-block; }
        .btn:hover { background: #d97706; }
    </style>
</head>
<body>
<div class='container'>";

echo "<h1>🤖 بررسی وضعیت ربات تلگرام</h1>";

// 1. بررسی اتصال به ربات
echo "<h2>1️⃣ بررسی اتصال به API تلگرام</h2>";
$bot_info = getBotInfo();

if ($bot_info) {
    echo "<div class='box success'>";
    echo "✅ <strong>اتصال به ربات موفق!</strong><br><br>";
    echo "🤖 <strong>نام کاربری:</strong> @{$bot_info['username']}<br>";
    echo "📛 <strong>نام نمایشی:</strong> {$bot_info['first_name']}<br>";
    echo "🆔 <strong>آی‌دی ربات:</strong> <code>{$bot_info['id']}</code>";
    echo "</div>";
} else {
    echo "<div class='box error'>";
    echo "❌ <strong>خطا!</strong> نمی‌تونم به ربات وصل بشم.<br>";
    echo "توکن ربات رو در فایل <code>telegram-config.php</code> چک کن.";
    echo "</div>";
    exit;
}

// 2. بررسی وضعیت Webhook
echo "<h2>2️⃣ بررسی وضعیت Webhook</h2>";
$webhook_info = json_decode(file_get_contents(TELEGRAM_API_URL . '/getWebhookInfo'), true);

if (isset($webhook_info['result'])) {
    $info = $webhook_info['result'];
    
    if (!empty($info['url'])) {
        echo "<div class='box success'>";
        echo "✅ <strong>Webhook فعال است!</strong><br><br>";
        echo "🔗 <strong>آدرس:</strong> <code>{$info['url']}</code><br>";
        echo "📊 <strong>تعداد آپدیت‌های انتظار:</strong> " . ($info['pending_update_count'] ?? 0) . "<br>";
        
        if (isset($info['last_error_date'])) {
            echo "⚠️ <strong>آخرین خطا:</strong> {$info['last_error_message']}<br>";
            echo "📅 <strong>زمان:</strong> " . date('Y/m/d H:i:s', $info['last_error_date']);
        } else {
            echo "✅ <strong>هیچ خطایی وجود ندارد</strong>";
        }
        echo "</div>";
    } else {
        echo "<div class='box error'>";
        echo "❌ <strong>Webhook تنظیم نشده!</strong><br>";
        echo "برای تنظیم، فایل <code>setup-bot.php</code> رو اجرا کن.";
        echo "</div>";
    }
}

// 3. تست ارسال پیام ساده
echo "<h2>3️⃣ تست ارسال پیام</h2>";
$test_msg = "🧪 <b>پیام تست از سیستم چک</b>\n\n";
$test_msg .= "✅ ربات فعال و سالم است\n";
$test_msg .= "⏰ " . date('Y/m/d H:i:s');

$send_result = sendTelegramMessage($test_msg);

if ($send_result && isset($send_result['ok']) && $send_result['ok']) {
    echo "<div class='box success'>";
    echo "✅ <strong>پیام تست با موفقیت ارسال شد!</strong><br>";
    echo "تلگرام خود را چک کن 📱";
    echo "</div>";
} else {
    echo "<div class='box error'>";
    echo "❌ <strong>خطا در ارسال پیام!</strong><br>";
    if (isset($send_result['description'])) {
        echo "پیام خطا: <code>{$send_result['description']}</code><br>";
    }
    echo "احتمالاً Chat ID اشتباه است.";
    echo "</div>";
}

// 4. تست ارسال پیام با کیبورد
echo "<h2>4️⃣ تست ارسال منوی کلیدی</h2>";
$keyboard = makeInlineKeyboard([
    [
        ['text' => '📊 آمار سیستم', 'callback_data' => 'stats'],
        ['text' => '👥 کاربران', 'callback_data' => 'users']
    ],
    [
        ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
    ]
]);

$menu_msg = "🎯 <b>منوی تست ربات</b>\n\n";
$menu_msg .= "از دکمه‌های زیر استفاده کن:";

$menu_result = sendTelegramMessage($menu_msg, 'HTML', $keyboard);

if ($menu_result && isset($menu_result['ok']) && $menu_result['ok']) {
    echo "<div class='box success'>";
    echo "✅ <strong>منو با موفقیت ارسال شد!</strong><br>";
    echo "روی دکمه‌ها در تلگرام کلیک کن و ببین کار می‌کنن یا نه.";
    echo "</div>";
} else {
    echo "<div class='box error'>";
    echo "❌ خطا در ارسال منو!";
    echo "</div>";
}

// 5. تست ارسال اعلان فرمت‌شده
echo "<h2>5️⃣ تست اعلان فرمت‌شده</h2>";
$notification_details = [
    'تست' => 'اطلاعیه تستی',
    'وضعیت' => '✅ موفق',
    'زمان' => date('H:i:s')
];

$notif_result = sendFormattedNotification('📢 اعلان تستی', $notification_details);

if ($notif_result && isset($notif_result['ok']) && $notif_result['ok']) {
    echo "<div class='box success'>";
    echo "✅ <strong>اعلان فرمت‌شده ارسال شد!</strong>";
    echo "</div>";
} else {
    echo "<div class='box error'>";
    echo "❌ خطا در ارسال اعلان فرمت‌شده!";
    echo "</div>";
}

// 6. راهنمای رفع مشکل
echo "<h2>🔧 راهنمای رفع مشکل</h2>";
echo "<div class='box warning'>";
echo "<strong>اگر منو در ربات نمیاد، این کارها رو انجام بده:</strong><br><br>";
echo "<ol style='line-height: 2;'>";
echo "<li>مطمئن شو Webhook تنظیم شده (بالا چک کردیم)</li>";
echo "<li>اگر Webhook تنظیم نشده، فایل <code>setup-bot.php</code> رو اجرا کن</li>";
echo "<li>به ربات در تلگرام برو و دستور <code>/start</code> رو بفرست</li>";
echo "<li>اگر منو نیومد، یکبار دستور <code>/setcommands</code> رو در BotFather بفرست و منو رو تنظیم کن</li>";
echo "<li>فایل <code>bot.php</code> رو چک کن که روی سرور آپلود شده باشه</li>";
echo "<li>لاگ‌های فایل <code>bot_log.txt</code> رو بررسی کن</li>";
echo "</ol>";
echo "</div>";

echo "<div class='box info'>";
echo "<strong>دستورات BotFather برای تنظیم منو:</strong><br><br>";
echo "<code>/setcommands</code> رو به BotFather بفرست، بعد این متن رو کپی کن:<br><br>";
echo "<textarea style='width:100%; height:150px; background:#1a202c; color:#fff; border:1px solid #4b5563; padding:10px; border-radius:5px;' readonly>";
echo "start - شروع و منوی اصلی\n";
echo "stats - آمار سیستم\n";
echo "users - گزارش کاربران\n";
echo "finance - گزارش مالی\n";
echo "messages - پیام‌های تماس\n";
echo "tools - ابزارهای مدیریتی\n";
echo "report - گزارش کامل\n";
echo "help - راهنما";
echo "</textarea>";
echo "</div>";

// لینک‌های مفید
echo "<div style='text-align: center; margin: 30px 0;'>";
echo "<a href='setup-bot.php' class='btn'>🔧 تنظیم مجدد ربات</a>";
echo "<a href='https://t.me/{$bot_info['username']}' class='btn' target='_blank'>🤖 رفتن به ربات</a>";
echo "<a href='bot_log.txt' class='btn' target='_blank'>📋 مشاهده لاگ‌ها</a>";
echo "</div>";

// هشدار امنیتی
echo "<div class='box error'>";
echo "<strong>⚠️ مهم:</strong> بعد از بررسی، این فایل (<code>check-webhook.php</code>) رو حذف کن!";
echo "</div>";

echo "</div></body></html>";
?>