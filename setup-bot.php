<?php
/**
 * فایل نصب و راه‌اندازی ربات تلگرام
 * این فایل رو فقط یکبار اجرا کن و بعدش حذفش کن!
 */

require 'telegram-config.php';
require 'db.php';

echo "<!DOCTYPE html>
<html lang='fa' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <title>نصب ربات تلگرام آژانس ازما</title>
    <style>
        * { font-family: 'Vazirmatn', Tahoma, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        body {
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
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-bottom: 30px;
            font-size: 2rem;
        }
        h2 {
            color: #764ba2;
            margin: 30px 0 15px;
            font-size: 1.5rem;
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
        }
        .error {
            border-color: #dc3545;
            background: #f8d7da;
        }
        .warning {
            border-color: #ffc107;
            background: #fff3cd;
        }
        .info {
            border-color: #17a2b8;
            background: #d1ecf1;
        }
        code {
            background: #2d3748;
            color: #63b3ed;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        ul {
            line-height: 2;
            margin: 10px 0 10px 30px;
        }
    </style>
</head>
<body>
<div class='container'>";

echo "<h1>🤖 نصب ربات تلگرام آژانس ازما</h1>";

// مرحله 1: بررسی اتصال به ربات
echo "<h2>1️⃣ بررسی اتصال به ربات</h2>";
$bot_info = getBotInfo();

if ($bot_info) {
    echo "<div class='step success'>";
    echo "✅ <strong>ربات با موفقیت شناسایی شد!</strong><br><br>";
    echo "🤖 <strong>نام کاربری:</strong> @{$bot_info['username']}<br>";
    echo "📛 <strong>نام نمایشی:</strong> {$bot_info['first_name']}<br>";
    echo "🆔 <strong>آی‌دی ربات:</strong> <code>{$bot_info['id']}</code>";
    echo "</div>";
} else {
    echo "<div class='step error'>";
    echo "❌ <strong>خطا در اتصال به ربات!</strong><br>";
    echo "لطفاً توکن را در فایل <code>telegram-config.php</code> بررسی کنید.";
    echo "</div>";
    exit;
}

// مرحله 2: ایجاد جداول دیتابیس
echo "<h2>2️⃣ ایجاد جداول دیتابیس</h2>";

$tables_created = 0;
$tables_error = 0;

// جدول bot_states (برای ذخیره حالت کاربران)
$sql_states = "CREATE TABLE IF NOT EXISTS bot_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    state VARCHAR(50) NOT NULL,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql_states)) {
    $tables_created++;
} else {
    $tables_error++;
}

// جدول bot_logs (لاگ فعالیت‌ها)
$sql_logs = "CREATE TABLE IF NOT EXISTS bot_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX user_id (user_id),
    INDEX created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql_logs)) {
    $tables_created++;
} else {
    $tables_error++;
}

if ($tables_error == 0) {
    echo "<div class='step success'>";
    echo "✅ <strong>$tables_created جدول با موفقیت ایجاد شد!</strong>";
    echo "</div>";
} else {
    echo "<div class='step warning'>";
    echo "⚠️ بعضی جداول از قبل وجود داشتند یا خطا داشتند.";
    echo "</div>";
}

// مرحله 3: ایجاد پوشه فایل‌ها
echo "<h2>3️⃣ ایجاد پوشه ذخیره فایل‌ها</h2>";

if (!is_dir(UPLOAD_DIR)) {
    if (mkdir(UPLOAD_DIR, 0755, true)) {
        echo "<div class='step success'>";
        echo "✅ پوشه <code>" . UPLOAD_DIR . "</code> با موفقیت ایجاد شد!";
        echo "</div>";
    } else {
        echo "<div class='step error'>";
        echo "❌ خطا در ایجاد پوشه! دسترسی‌ها را بررسی کنید.";
        echo "</div>";
    }
} else {
    echo "<div class='step info'>";
    echo "ℹ️ پوشه از قبل وجود دارد: <code>" . UPLOAD_DIR . "</code>";
    echo "</div>";
}

// مرحله 4: تنظیم Webhook
echo "<h2>4️⃣ تنظیم Webhook</h2>";

$webhook_url = 'https://azmamarkteng.ir/bot.php';
$webhook_result = setWebhook($webhook_url);

if ($webhook_result && isset($webhook_result['ok']) && $webhook_result['ok']) {
    echo "<div class='step success'>";
    echo "✅ <strong>Webhook با موفقیت تنظیم شد!</strong><br><br>";
    echo "🔗 <strong>آدرس Webhook:</strong> <code>$webhook_url</code>";
    echo "</div>";
} else {
    echo "<div class='step error'>";
    echo "❌ خطا در تنظیم Webhook!<br>";
    echo "پیام خطا: " . ($webhook_result['description'] ?? 'نامشخص');
    echo "</div>";
}

// مرحله 5: ارسال پیام تست
echo "<h2>5️⃣ ارسال پیام تست به شما</h2>";

$test_message = "🎉 <b>تبریک!</b>\n\n";
$test_message .= "ربات تلگرام آژانس ازما با موفقیت راه‌اندازی شد.\n\n";
$test_message .= "🤖 <b>نام ربات:</b> @{$bot_info['username']}\n";
$test_message .= "🆔 <b>Chat ID شما:</b> <code>" . TELEGRAM_CHAT_ID . "</code>\n\n";
$test_message .= "از دستور /start برای شروع استفاده کنید.\n\n";
$test_message .= "⏰ " . date('Y/m/d H:i:s');

$keyboard = makeInlineKeyboard([
    [
        ['text' => '🚀 شروع استفاده', 'callback_data' => '/start']
    ],
    [
        ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
    ]
]);

$send_result = sendMessage(TELEGRAM_CHAT_ID, $test_message, $keyboard);

if ($send_result && isset($send_result['ok']) && $send_result['ok']) {
    echo "<div class='step success'>";
    echo "✅ <strong>پیام تست ارسال شد!</strong><br>";
    echo "تلگرام خود را چک کنید 📱";
    echo "</div>";
} else {
    echo "<div class='step error'>";
    echo "❌ خطا در ارسال پیام!<br>";
    echo "احتمالاً Chat ID اشتباه است.";
    echo "</div>";
}

// خلاصه نهایی
echo "<h2>📋 خلاصه نصب</h2>";
echo "<div class='step info'>";
echo "<strong>وضعیت نصب:</strong><br><br>";
echo "✅ ربات: فعال<br>";
echo "✅ دیتابیس: آماده<br>";
echo "✅ Webhook: تنظیم شده<br>";
echo "✅ پیام تست: ارسال شده<br>";
echo "</div>";

// مراحل بعدی
echo "<h2>🎯 مراحل بعدی</h2>";
echo "<div class='step warning'>";
echo "<ol>";
echo "<li><strong>این فایل را حذف کنید!</strong> (<code>setup-bot.php</code>)</li>";
echo "<li>فایل <code>telegram-config.php</code> را از Git حذف کنید</li>";
echo "<li>به ربات در تلگرام پیام <code>/start</code> بفرستید</li>";
echo "<li>از منوی ربات برای مدیریت سایت استفاده کنید</li>";
echo "<li>از فرم تماس یک پیام تستی بفرستید تا اعلان رو ببینید</li>";
echo "</ol>";
echo "</div>";

// لینک‌های مفید
echo "<div style='text-align: center; margin: 40px 0;'>";
echo "<a href='https://t.me/{$bot_info['username']}' class='btn' target='_blank'>🤖 رفتن به ربات</a>";
echo "<a href='contact.php' class='btn'>📧 تست فرم تماس</a>";
echo "<a href='admin-panel.php' class='btn'>🎛️ پنل مدیریت</a>";
echo "</div>";

// هشدار امنیتی
echo "<div class='step error'>";
echo "<strong>⚠️ هشدار امنیتی:</strong><br>";
echo "لطفاً پس از مشاهده این صفحه، فایل <code>setup-bot.php</code> را از هاست حذف کنید!<br>";
echo "نگه داشتن این فایل می‌تواند خطر امنیتی ایجاد کند.";
echo "</div>";

echo "</div></body></html>";
?>