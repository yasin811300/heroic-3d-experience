<?php
require 'telegram-config.php';
require 'db.php';

echo "<!DOCTYPE html><html lang='fa' dir='rtl'><head><meta charset='UTF-8'><title>نصب ربات فوق حرفه‌ای</title>";
echo "<style>body{font-family:Tahoma;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:40px}";
echo ".box{max-width:900px;margin:0 auto;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);padding:40px;border-radius:20px}";
echo "h1{color:#f59e0b;border-bottom:3px solid #f59e0b;padding-bottom:15px;margin-bottom:30px}";
echo ".step{background:rgba(0,0,0,0.2);padding:20px;border-radius:15px;margin:20px 0;border-left:5px solid #10b981}";
echo ".success{border-color:#10b981}.error{border-color:#ef4444}.warning{border-color:#f59e0b}";
echo "code{background:rgba(0,0,0,0.3);padding:5px 10px;border-radius:5px;color:#60a5fa}";
echo ".btn{background:#f59e0b;color:#000;padding:12px 30px;border-radius:50px;text-decoration:none;display:inline-block;margin:10px 5px;font-weight:bold}";
echo "</style></head><body><div class='box'>";

echo "<h1>🚀 نصب ربات فوق حرفه‌ای</h1>";

// حذف Webhook
deleteWebhook();
echo "<div class='step success'>✅ Webhook حذف شد</div>";

// ایجاد جداول
$conn->query("CREATE TABLE IF NOT EXISTS bot_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    state VARCHAR(50) NOT NULL,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

echo "<div class='step success'>✅ دیتابیس آماده شد</div>";

// ایجاد فایل offset
file_put_contents(__DIR__ . '/bot_offset.txt', '0');
echo "<div class='step success'>✅ فایل Offset ساخته شد</div>";

// ایجاد پوشه آپلود
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
echo "<div class='step success'>✅ پوشه آپلود آماده است</div>";

// ارسال پیام تست
$test_msg = "🎊 <b>ربات فوق حرفه‌ای راه‌اندازی شد!</b>\n\n";
$test_msg .= "⚡ سرعت: <b>1 ثانیه</b>\n";
$test_msg .= "🎯 وضعیت: <b>آنلاین</b>\n\n";
$test_msg .= "✅ پنل مدیریتی کامل\n";
$test_msg .= "✅ مدیریت فایل و لینک\n";
$test_msg .= "✅ مدیریت ادمین\n";
$test_msg .= "✅ سفارشی‌سازی ظاهر\n\n";
$test_msg .= "دستور /start رو بفرست!";

$keyboard = makeInlineKeyboard([
    [['text' => '🚀 شروع', 'callback_data' => '/start']],
    [['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']]
]);

$result = sendTelegramMessage($test_msg, 'HTML', $keyboard);

if ($result && $result['ok']) {
    echo "<div class='step success'>✅ پیام تست ارسال شد!</div>";
} else {
    echo "<div class='step error'>❌ خطا در ارسال پیام</div>";
}

echo "<h3>⚙️ تنظیم Cron Job</h3>";
echo "<div class='step warning'>";
echo "<p><strong>برای بیشترین سرعت، Cron Job رو تنظیم کن:</strong></p>";
echo "<p><strong>زمان:</strong> هر 1 دقیقه (<code>* * * * *</code>)</p>";
echo "<p><strong>دستور:</strong></p>";
echo "<code>/usr/bin/php " . __DIR__ . "/ultra-fast-bot.php</code>";
echo "</div>";

echo "<div style='text-align:center;margin:40px 0'>";
$bot_info = getBotInfo();
echo "<a href='https://t.me/{$bot_info['username']}' class='btn' target='_blank'>🤖 رفتن به ربات</a>";
echo "<a href='ultra-fast-bot.php' class='btn'>▶️ اجرای دستی</a>";
echo "</div>";

echo "<div class='step error'>🚨 این فایل رو حذف کن: <code>setup-ultra.php</code></div>";

echo "</div></body></html>";
?>