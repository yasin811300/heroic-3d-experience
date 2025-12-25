<?php
/**
 * راه‌اندازی ربات با Long Polling
 */

require 'telegram-config.php';
require 'db.php';

echo "<!DOCTYPE html>
<html lang='fa' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <title>راه‌اندازی ربات (Polling Mode)</title>
    <style>
        body { font-family: Tahoma; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; }
        h1 { color: #f59e0b; border-bottom: 3px solid #f59e0b; padding-bottom: 15px; margin-bottom: 30px; }
        .step { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px; margin: 20px 0; border-left: 5px solid; }
        .success { border-color: #10b981; }
        .error { border-color: #ef4444; }
        .warning { border-color: #f59e0b; }
        .info { border-color: #3b82f6; }
        code { background: rgba(0,0,0,0.3); padding: 3px 10px; border-radius: 5px; color: #60a5fa; }
        .btn { background: #f59e0b; color: #000; padding: 12px 30px; border-radius: 50px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
        .btn:hover { background: #d97706; }
        textarea { width: 100%; height: 150px; background: rgba(0,0,0,0.3); color: #fff; border: 2px solid #4b5563; padding: 15px; border-radius: 10px; font-family: monospace; }
    </style>
</head>
<body>
<div class='container'>";

echo "<h1>🤖 راه‌اندازی ربات (Polling Mode)</h1>";

// حذف Webhook
echo "<h3>1️⃣ حذف Webhook</h3>";
$delete_result = deleteWebhook();
echo "<div class='step success'>✅ Webhook حذف شد. حالا از Polling استفاده می‌کنیم.</div>";

// ایجاد جداول
echo "<h3>2️⃣ ایجاد جداول دیتابیس</h3>";

$conn->query("CREATE TABLE IF NOT EXISTS bot_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    state VARCHAR(50) NOT NULL,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$conn->query("CREATE TABLE IF NOT EXISTS bot_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX user_id (user_id),
    INDEX created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

echo "<div class='step success'>✅ جداول ایجاد شد</div>";

// ایجاد فایل offset
echo "<h3>3️⃣ ایجاد فایل Offset</h3>";
file_put_contents(__DIR__ . '/bot_offset.txt', '0');
echo "<div class='step success'>✅ فایل <code>bot_offset.txt</code> ایجاد شد</div>";

// ایجاد پوشه آپلود
echo "<h3>4️⃣ ایجاد پوشه فایل‌ها</h3>";
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
echo "<div class='step success'>✅ پوشه آپلود آماده است</div>";

// تست ارسال پیام
echo "<h3>5️⃣ ارسال پیام تست</h3>";

$test_message = "🎉 <b>ربات با موفقیت راه‌اندازی شد!</b>\n\n";
$test_message .= "✅ حالت: <b>Long Polling</b>\n";
$test_message .= "✅ Webhook: <b>غیرفعال</b>\n\n";
$test_message .= "حالا دستور <b>/start</b> رو بفرست تا منو رو ببینی.\n\n";
$test_message .= "⏰ " . date('Y/m/d H:i:s');

$keyboard = makeInlineKeyboard([
    [
        ['text' => '🚀 شروع (/start)', 'callback_data' => '/start']
    ],
    [
        ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
    ]
]);

$result = sendTelegramMessage($test_message, 'HTML', $keyboard);

if ($result && isset($result['ok']) && $result['ok']) {
    echo "<div class='step success'>✅ پیام تست ارسال شد! تلگرام رو چک کن 📱</div>";
} else {
    echo "<div class='step error'>❌ خطا در ارسال پیام</div>";
}

// راهنمای Cron Job
echo "<h3>6️⃣ تنظیم Cron Job (مهم!)</h3>";
echo "<div class='step warning'>";
echo "<p><strong>برای اینکه ربات کار کنه، باید یک Cron Job تنظیم کنی:</strong></p>";
echo "<ol style='line-height: 2;'>";
echo "<li>به cPanel برو</li>";
echo "<li>Cron Jobs رو انتخاب کن</li>";
echo "<li>یک Cron Job جدید بساز با این تنظیمات:</li>";
echo "</ol>";
echo "<p><strong>زمان اجرا:</strong> هر 1 دقیقه</p>";
echo "<p><strong>دستور:</strong></p>";
echo "<textarea readonly>";
echo "*/1 * * * * /usr/bin/php " . __DIR__ . "/bot-polling.php > /dev/null 2>&1";
echo "</textarea>";
echo "<p style='color: #fbbf24; margin-top: 15px;'>⚠️ بدون Cron Job، ربات کار نمی‌کنه!</p>";
echo "</div>";

// راهنمای استفاده
echo "<h3>📋 مراحل بعدی</h3>";
echo "<div class='step info'>";
echo "<ol style='line-height: 2;'>";
echo "<li><strong>Cron Job رو تنظیم کن</strong> (توضیحات بالا)</li>";
echo "<li>به ربات برو: <code>@azmamarktengbot</code></li>";
echo "<li>دستور <code>/start</code> رو بفرست</li>";
echo "<li>صبر کن تا Cron Job اجرا بشه (حداکثر 1 دقیقه)</li>";
echo "<li>منو باید نمایش داده بشه</li>";
echo "<li><strong>این فایل رو حذف کن!</strong></li>";
echo "</ol>";
echo "</div>";

// تست دستی
echo "<h3>🧪 تست دستی (اختیاری)</h3>";
echo "<div class='step info'>";
echo "<p>اگه نمی‌خوای منتظر Cron Job بمونی، الان دکمه زیر رو بزن:</p>";
echo "<a href='bot-polling.php' class='btn' target='_blank'>🔄 اجرای دستی ربات</a>";
echo "<p style='margin-top: 15px;'><small>بعد از زدن دکمه، به ربات برو و /start رو بفرست</small></p>";
echo "</div>";

// لینک‌ها
echo "<div style='text-align: center; margin: 40px 0;'>";
$bot_info = getBotInfo();
echo "<a href='https://t.me/{$bot_info['username']}' class='btn' target='_blank'>🤖 رفتن به ربات</a>";
echo "<a href='bot-polling.php' class='btn'>▶️ اجرای ربات</a>";
echo "</div>";

// هشدار
echo "<div class='step error'>";
echo "🚨 <strong>مهم:</strong> این فایل (<code>setup-polling.php</code>) رو حذف کن!";
echo "</div>";

echo "</div></body></html>";
?>