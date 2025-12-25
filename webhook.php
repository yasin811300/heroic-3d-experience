<?php
/**
 * Webhook برای دریافت پیام‌های ارسالی به ربات
 * این فایل رو به عنوان Webhook در BotFather تنظیم کن:
 * https://api.telegram.org/botTOKEN/setWebhook?url=https://azmamarkteng.ir/webhook.php
 */

require 'db.php';
require 'telegram-config.php';

// دریافت داده از تلگرام
$content = file_get_contents("php://input");
$update = json_decode($content, true);

if (!$update) exit;

// استخراج اطلاعات پیام
$message = $update['message'] ?? null;
$chat_id = $message['chat']['id'] ?? null;
$text = $message['text'] ?? '';
$from_user = $message['from']['first_name'] ?? 'کاربر';

// فقط به Chat ID تعیین‌شده (خودت) پاسخ بده
if ($chat_id != TELEGRAM_CHAT_ID) {
    sendTelegramMessage("⛔ شما دسترسی به این ربات ندارید.", 'HTML', null, $chat_id);
    exit;
}

// پردازش دستورات
switch (true) {
    // دستور /start
    case ($text == '/start'):
        $response = "👋 سلام <b>$from_user</b>!\n\n";
        $response .= "به ربات <b>آژانس ازما</b> خوش آمدید.\n\n";
        $response .= "📋 <b>دستورات موجود:</b>\n";
        $response .= "/stats - آمار سایت\n";
        $response .= "/users - تعداد کاربران\n";
        $response .= "/revenue - درآمد کل\n";
        $response .= "/today - گزارش امروز\n";
        $response .= "/help - راهنما";
        
        $keyboard = [
            [
                ['text' => '📊 آمار', 'callback_data' => '/stats'],
                ['text' => '👥 کاربران', 'callback_data' => '/users']
            ],
            [
                ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
            ]
        ];
        
        sendTelegramMessage($response, 'HTML', $keyboard, $chat_id);
        break;
    
    // دستور /stats
    case ($text == '/stats'):
        $total_users = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
        $total_orders = $conn->query("SELECT COUNT(*) FROM orders")->fetch_row()[0];
        $total_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0] ?? 0;
        
        $response = "📊 <b>آمار کلی سیستم</b>\n";
        $response .= str_repeat('─', 30) . "\n\n";
        $response .= "👥 کل کاربران: <code>" . number_format($total_users) . "</code>\n";
        $response .= "🛒 کل سفارش‌ها: <code>" . number_format($total_orders) . "</code>\n";
        $response .= "💰 درآمد کل: <code>" . number_format($total_revenue) . "</code> تومان\n";
        $response .= "\n⏰ " . date('Y/m/d H:i:s');
        
        sendTelegramMessage($response, 'HTML', null, $chat_id);
        break;
    
    // دستور /users
    case ($text == '/users'):
        $total_users = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
        $today_users = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
        $week_users = $conn->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_row()[0];
        
        $response = "👥 <b>گزارش کاربران</b>\n";
        $response .= str_repeat('─', 30) . "\n\n";
        $response .= "📊 کل: <code>" . number_format($total_users) . "</code> نفر\n";
        $response .= "🆕 امروز: <code>" . number_format($today_users) . "</code> نفر\n";
        $response .= "📅 این هفته: <code>" . number_format($week_users) . "</code> نفر\n";
        $response .= "\n⏰ " . date('Y/m/d H:i:s');
        
        sendTelegramMessage($response, 'HTML', null, $chat_id);
        break;
    
    // دستور /revenue
    case ($text == '/revenue'):
        $total_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0] ?? 0;
        $today_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND DATE(created_at) = CURDATE()")->fetch_row()[0] ?? 0;
        $month_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND MONTH(created_at) = MONTH(NOW())")->fetch_row()[0] ?? 0;
        
        $response = "💰 <b>گزارش مالی</b>\n";
        $response .= str_repeat('─', 30) . "\n\n";
        $response .= "📊 کل درآمد: <code>" . number_format($total_revenue) . "</code> تومان\n";
        $response .= "📅 امروز: <code>" . number_format($today_revenue) . "</code> تومان\n";
        $response .= "📆 این ماه: <code>" . number_format($month_revenue) . "</code> تومان\n";
        $response .= "\n⏰ " . date('Y/m/d H:i:s');
        
        sendTelegramMessage($response, 'HTML', null, $chat_id);
        break;
    
    // دستور /today
    case ($text == '/today'):
        $today_users = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
        $today_orders = $conn->query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
        $today_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND DATE(created_at) = CURDATE()")->fetch_row()[0] ?? 0;
        $today_messages = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
        
        $response = "📅 <b>گزارش امروز</b>\n";
        $response .= "📆 " . date('Y/m/d') . "\n";
        $response .= str_repeat('─', 30) . "\n\n";
        $response .= "👥 کاربران جدید: <code>$today_users</code>\n";
        $response .= "🛒 سفارش‌ها: <code>$today_orders</code>\n";
        $response .= "💰 درآمد: <code>" . number_format($today_revenue) . "</code> تومان\n";
        $response .= "📩 پیام‌ها: <code>$today_messages</code>\n";
        $response .= "\n✅ سیستم فعال است";
        
        sendTelegramMessage($response, 'HTML', null, $chat_id);
        break;
    
    // دستور /help
    case ($text == '/help'):
        $response = "📖 <b>راهنمای دستورات</b>\n";
        $response .= str_repeat('─', 30) . "\n\n";
        $response .= "/start - شروع مجدد\n";
        $response .= "/stats - آمار کلی سیستم\n";
        $response .= "/users - گزارش کاربران\n";
        $response .= "/revenue - گزارش مالی\n";
        $response .= "/today - گزارش امروز\n";
        $response .= "/help - این راهنما\n\n";
        $response .= "💡 برای دریافت اعلان‌ها، ربات باید فعال باشد.";
        
        sendTelegramMessage($response, 'HTML', null, $chat_id);
        break;
    
    default:
        $response = "❓ دستور نامعتبر!\n\nاز /help برای مشاهده دستورات استفاده کنید.";
        sendTelegramMessage($response, 'HTML', null, $chat_id);
}

// تابع ارسال پیام به Chat ID مشخص
function sendTelegramMessage($message, $parse_mode = 'HTML', $keyboard = null, $chat_id = null) {
    $url = TELEGRAM_API_URL . '/sendMessage';
    
    $data = [
        'chat_id' => $chat_id ?: TELEGRAM_CHAT_ID,
        'text' => $message,
        'parse_mode' => $parse_mode
    ];
    
    if ($keyboard) {
        $data['reply_markup'] = json_encode(['inline_keyboard' => $keyboard]);
    }
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}
?>