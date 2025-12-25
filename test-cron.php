<?php
/**
 * فایل تست Cron Job
 * این فایل رو با Cron Job اجرا کن تا ببینی کار می‌کنه یا نه
 */

$log_file = __DIR__ . '/cron_test_log.txt';

// نوشتن در لاگ
$message = date('Y-m-d H:i:s') . " - Cron Job با موفقیت اجرا شد!\n";
file_put_contents($log_file, $message, FILE_APPEND);

// ارسال پیام به تلگرام
require_once 'telegram-config.php';

$test_msg = "✅ <b>Cron Job کار می‌کنه!</b>\n\n";
$test_msg .= "⏰ زمان اجرا: " . date('Y/m/d H:i:s') . "\n";
$test_msg .= "📂 فایل: test-cron.php\n\n";
$test_msg .= "حالا می‌تونی ربات رو راه‌اندازی کنی.";

sendTelegramMessage($test_msg);

echo "OK - " . date('Y-m-d H:i:s');
?>