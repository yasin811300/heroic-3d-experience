<?php
/**
 * تنظیم Webhook ربات تلگرام - نسخه ساده
 * فقط یکبار اجرا کن!
 */

require 'telegram-config.php';
require 'db.php';

echo "<!DOCTYPE html>
<html lang='fa' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <title>تنظیم Webhook</title>
    <style>
        body { 
            font-family: 'Vazirmatn', Tahoma, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin: 0;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 700px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-bottom: 30px;
            font-size: 2rem;
        }
        .step {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
            border-left: 5px solid;
        }
        .success {
            border-color: #28a745;
            background: #d4edda;
            color: #155724;
        }
        .error {
            border-color: #dc3545;
            background: #f8d7da;
            color: #721c24;
        }
        .warning {
            border-color: #ffc107;
            background: #fff3cd;
            color: #856404;
        }
        .info {
            border-color: #17a2b8;
            background: #d1ecf1;
            color: #0c5460;
        }
        code {
            background: #2d3748;
            color: #63b3ed;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
            transition: all 0.3s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        ol, ul {
            line-height: 2;
            margin: 15px 0 15px 30px;
        }
        .big-icon {
            font-size: 3rem;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
<div class='container'>";

echo "<h1>🔧 تنظیم Webhook ربات</h1>";

// بررسی اتصال به ربات
echo "<h3>1️⃣ بررسی اتصال به ربات</h3>";
$bot_info = getBotInfo();

if (!$bot_info) {
    echo "<div class='step error'>";
    echo "❌ <strong>خطا!</strong> نمی‌تونم به ربات وصل بشم.<br>";
    echo "لطفاً توکن را در فایل <code>telegram-config.php</code> بررسی کن.";
    echo "</div></div></body></html>";
    exit;
}

echo "<div class='step success'>";
echo "✅ <strong>ربات فعال است!</strong><br>";
echo "🤖 نام کاربری: <code>@{$bot_info['username']}</code>";
echo "</div>";

// ایجاد جداول دیتابیس (اگه نداشته باشه)
echo "<h3>2️⃣ بررسی دیتابیس</h3>";

// جدول bot_states
$conn->query("CREATE TABLE IF NOT EXISTS bot_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    state VARCHAR(50) NOT NULL,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// جدول bot_logs
$conn->query("CREATE TABLE IF NOT EXISTS bot_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX user_id (user_id),
    INDEX created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

echo "<div class='step success'>";
echo "✅ جداول دیتابیس آماده است";
echo "</div>";

// ایجاد پوشه آپلود
echo "<h3>3️⃣ ایجاد پوشه فایل‌ها</h3>";

if (!is_dir(UPLOAD_DIR)) {
    if (mkdir(UPLOAD_DIR, 0755, true)) {
        echo "<div class='step success'>";
        echo "✅ پوشه <code>" . UPLOAD_DIR . "</code> ایجاد شد";
        echo "</div>";
    } else {
        echo "<div class='step warning'>";
        echo "⚠️ نتونستم پوشه رو بسازم. دستی بساز: <code>uploads/telegram/</code>";
        echo "</div>";
    }
} else {
    echo "<div class='step info'>";
    echo "ℹ️ پوشه از قبل وجود دارد";
    echo "</div>";
}

// تنظیم Webhook
echo "<h3>4️⃣ تنظیم Webhook</h3>";

$webhook_url = 'https://azmamarkteng.ir/bot.php';
$result = setWebhook($webhook_url);

if ($result && isset($result['ok']) && $result['ok']) {
    echo "<div class='step success'>";
    echo "<div class='big-icon'>🎉</div>";
    echo "<strong style='font-size: 1.3rem;'>Webhook با موفقیت تنظیم شد!</strong><br><br>";
    echo "🔗 <strong>آدرس Webhook:</strong><br>";
    echo "<code style='display: block; margin: 10px 0; padding: 10px; background: #2d3748; color: #63b3ed; border-radius: 8px;'>$webhook_url</code>";
    echo "</div>";
} else {
    echo "<div class='step error'>";
    echo "❌ <strong>خطا در تنظیم Webhook!</strong><br>";
    echo "پیام خطا: " . ($result['description'] ?? 'نامشخص') . "<br><br>";
    echo "<strong>چند احتمال وجود داره:</strong><br>";
    echo "<ul>";
    echo "<li>فایل <code>bot.php</code> وجود نداره</li>";
    echo "<li>سرور SSL نداره (باید HTTPS باشه)</li>";
    echo "<li>دسترسی به فایل محدود شده</li>";
    echo "</ul>";
    echo "</div>";
}

// ارسال پیام آزمایشی
echo "<h3>5️⃣ ارسال پیام تست</h3>";

$test_message = "🎊 <b>تبریک یاسین عزیز!</b>\n\n";
$test_message .= "ربات تلگرام آژانس ازما با موفقیت راه‌اندازی شد.\n\n";
$test_message .= "🤖 <b>نام ربات:</b> @{$bot_info['username']}\n";
$test_message .= "🆔 <b>Chat ID شما:</b> <code>" . TELEGRAM_CHAT_ID . "</code>\n\n";
$test_message .= "✅ Webhook فعال است\n";
$test_message .= "✅ دیتابیس آماده است\n";
$test_message .= "✅ پوشه آپلود ساخته شد\n\n";
$test_message .= "حالا دستور <b>/start</b> رو بفرست تا منو رو ببینی.\n\n";
$test_message .= "⏰ " . date('Y/m/d H:i:s');

$keyboard = makeInlineKeyboard([
    [
        ['text' => '🚀 شروع استفاده (/start)', 'callback_data' => '/start']
    ],
    [
        ['text' => '📊 آمار سیستم', 'callback_data' => 'stats'],
        ['text' => '👥 کاربران', 'callback_data' => 'users']
    ],
    [
        ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
    ]
]);

$send_result = sendTelegramMessage($test_message, 'HTML', $keyboard);

if ($send_result && isset($send_result['ok']) && $send_result['ok']) {
    echo "<div class='step success'>";
    echo "✅ <strong>پیام تست ارسال شد!</strong><br>";
    echo "تلگرام خود را چک کن 📱";
    echo "</div>";
} else {
    echo "<div class='step error'>";
    echo "❌ خطا در ارسال پیام تست!";
    echo "</div>";
}

// راهنمای نهایی
echo "<h3>📋 مراحل بعدی</h3>";
echo "<div class='step info'>";
echo "<ol>";
echo "<li><strong>به ربات برو:</strong> <code>@{$bot_info['username']}</code></li>";
echo "<li><strong>دستور /start رو بفرست</strong></li>";
echo "<li>اگه منو نیومد، به BotFather برو و دستور <code>/setcommands</code> رو بفرست</li>";
echo "<li>از فرم تماس سایت یک پیام تستی بفرست تا اعلان ببینی</li>";
echo "<li><strong style='color: #dc3545;'>این فایل رو حذف کن! (setup-webhook.php)</strong></li>";
echo "</ol>";
echo "</div>";

// دستورات BotFather
echo "<h3>🤖 تنظیم منوی BotFather</h3>";
echo "<div class='step warning'>";
echo "<p>اگه منو در ربات نمیاد، این کارا رو انجام بده:</p>";
echo "<ol>";
echo "<li>به <code>@BotFather</code> برو</li>";
echo "<li>دستور <code>/setcommands</code> رو بفرست</li>";
echo "<li>ربات خودت رو انتخاب کن</li>";
echo "<li>این متن رو کپی و ارسال کن:</li>";
echo "</ol>";
echo "<textarea readonly style='width:100%; height:180px; background:#f8f9fa; border:2px solid #dee2e6; padding:15px; border-radius:8px; font-family: monospace; font-size: 0.9rem; resize: none;'>";
echo "start - شروع و منوی اصلی\n";
echo "stats - آمار سیستم\n";
echo "users - گزارش کاربران\n";
echo "finance - گزارش مالی\n";
echo "messages - پیام‌های تماس\n";
echo "tools - ابزارهای مدیریتی\n";
echo "report - گزارش کامل روزانه\n";
echo "help - راهنمای استفاده";
echo "</textarea>";
echo "</div>";

// لینک‌های مفید
echo "<div style='text-align: center; margin: 40px 0;'>";
echo "<a href='https://t.me/{$bot_info['username']}' class='btn' target='_blank'>🤖 رفتن به ربات</a>";
echo "<a href='contact.php' class='btn'>📧 تست فرم تماس</a>";
echo "<a href='admin-panel.php' class='btn'>🎛️ پنل مدیریت</a>";
echo "</div>";

// هشدار نهایی
echo "<div class='step error'>";
echo "🚨 <strong>هشدار امنیتی:</strong><br>";
echo "لطفاً همین الان این فایل (<code>setup-webhook.php</code>) رو از هاست حذف کن!<br>";
echo "نگه داشتن این فایل می‌تونه خطر امنیتی ایجاد کنه.";
echo "</div>";

echo "</div></body></html>";
?>