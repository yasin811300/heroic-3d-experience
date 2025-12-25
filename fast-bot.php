<?php
/**
 * ربات تلگرام فوق سریع - هر 2 ثانیه چک می‌کنه ⚡
 * این فایل با Cron Job هر 1 دقیقه اجرا میشه ولی خودش 30 بار چک می‌کنه
 */

set_time_limit(0);
ignore_user_abort(true);

require_once 'db.php';
require_once 'telegram-config.php';

// حذف Webhook
deleteWebhook();

// فایل offset
$offset_file = __DIR__ . '/bot_offset.txt';
if (!file_exists($offset_file)) {
    file_put_contents($offset_file, '0');
}

// حلقه 55 ثانیه (هر 2 ثانیه یکبار چک می‌کنه = حدود 27 بار)
$start_time = time();
$max_duration = 55; // 55 ثانیه (5 ثانیه ذخیره برای Cron Job بعدی)

while ((time() - $start_time) < $max_duration) {
    try {
        $offset = (int)file_get_contents($offset_file);
        $updates = getUpdates($offset);
        
        if (!empty($updates)) {
            foreach ($updates as $update) {
                $offset = $update['update_id'] + 1;
                file_put_contents($offset_file, $offset);
                processUpdate($update);
            }
        }
        
        // صبر 2 ثانیه (سریع!)
        sleep(2);
        
    } catch (Exception $e) {
        file_put_contents(__DIR__ . '/bot_error.txt', date('Y-m-d H:i:s') . " - " . $e->getMessage() . "\n", FILE_APPEND);
        sleep(5);
    }
}

exit(0);

/**
 * پردازش آپدیت
 */
function processUpdate($update) {
    global $conn;
    
    $message = $update['message'] ?? null;
    $callback_query = $update['callback_query'] ?? null;
    $chat_id = null;
    $user_id = null;
    $username = null;
    $text = '';
    $message_id = null;
    
    if ($message) {
        $chat_id = $message['chat']['id'];
        $user_id = $message['from']['id'];
        $username = $message['from']['first_name'] ?? 'کاربر';
        $text = $message['text'] ?? '';
        $photo = $message['photo'] ?? null;
        $document = $message['document'] ?? null;
    }
    
    if ($callback_query) {
        $chat_id = $callback_query['message']['chat']['id'];
        $user_id = $callback_query['from']['id'];
        $username = $callback_query['from']['first_name'] ?? 'کاربر';
        $text = $callback_query['data'];
        $message_id = $callback_query['message']['message_id'];
        
        $url = TELEGRAM_API_URL . '/answerCallbackQuery';
        makeRequest($url, ['callback_query_id' => $callback_query['id']]);
    }
    
    if (!isAdmin($chat_id)) {
        sendMessage($chat_id, "⛔ شما دسترسی به این ربات را ندارید.");
        return;
    }
    
    file_put_contents(__DIR__ . '/bot_log.txt', date('Y-m-d H:i:s') . " - User: $user_id, Text: $text\n", FILE_APPEND);
    
    switch (true) {
        
        case ($text == '/start' || $text == 'شروع' || $text == '🏠 منوی اصلی'):
            $response = "👋 سلام <b>$username</b> عزیز!\n\n";
            $response .= "به ربات مدیریت <b>آژانس دیجیتال مارکتینگ ازما</b> خوش آمدید.\n\n";
            $response .= "📋 <b>از منوی زیر استفاده کنید:</b>";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📊 آمار سیستم', 'callback_data' => 'stats'],
                    ['text' => '👥 کاربران', 'callback_data' => 'users']
                ],
                [
                    ['text' => '💰 مالی', 'callback_data' => 'finance'],
                    ['text' => '📩 پیام‌ها', 'callback_data' => 'messages']
                ],
                [
                    ['text' => '🛠️ ابزارها', 'callback_data' => 'tools'],
                    ['text' => '📂 فایل‌ها', 'callback_data' => 'files']
                ],
                [
                    ['text' => '⚙️ تنظیمات', 'callback_data' => 'settings'],
                    ['text' => '📈 گزارش کامل', 'callback_data' => 'full_report']
                ],
                [
                    ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
                ]
            ]);
            
            sendMessage($chat_id, $response, $keyboard);
            break;
        
        case ($text == 'stats' || $text == '/stats'):
            sendChatAction($chat_id, 'typing');
            
            $total_users = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
            $today_users = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            $total_orders = $conn->query("SELECT COUNT(*) FROM orders")->fetch_row()[0] ?? 0;
            $total_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0] ?? 0;
            $today_messages = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            
            $response = "📊 <b>آمار کلی سیستم</b>\n";
            $response .= "📅 " . date('Y/m/d - l') . "\n";
            $response .= str_repeat('─', 30) . "\n\n";
            $response .= "👥 <b>کاربران:</b>\n";
            $response .= "   • کل: <code>" . number_format($total_users) . "</code> نفر\n";
            $response .= "   • امروز: <code>$today_users</code> نفر\n\n";
            $response .= "🛒 <b>سفارش‌ها:</b> <code>" . number_format($total_orders) . "</code>\n";
            $response .= "💰 <b>درآمد کل:</b> <code>" . number_format($total_revenue) . "</code> تومان\n";
            $response .= "📩 <b>پیام‌های امروز:</b> <code>$today_messages</code>\n\n";
            $response .= "✅ سیستم سالم و فعال است";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🔄 بروزرسانی', 'callback_data' => 'stats'],
                    ['text' => '📈 گزارش کامل', 'callback_data' => 'full_report']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'users' || $text == '/users'):
            $total = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
            $today = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            $week = $conn->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_row()[0];
            $month = $conn->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetch_row()[0];
            
            $last_user = $conn->query("SELECT fullname, phone FROM users ORDER BY id DESC LIMIT 1")->fetch_assoc();
            
            $response = "👥 <b>گزارش کاربران</b>\n";
            $response .= str_repeat('─', 30) . "\n\n";
            $response .= "📊 <b>تعداد کاربران:</b>\n";
            $response .= "   • کل: <code>" . number_format($total) . "</code> نفر\n";
            $response .= "   • امروز: <code>$today</code> نفر\n";
            $response .= "   • این هفته: <code>$week</code> نفر\n";
            $response .= "   • این ماه: <code>$month</code> نفر\n\n";
            
            if ($last_user) {
                $response .= "👤 <b>آخرین کاربر:</b>\n";
                $response .= "   نام: {$last_user['fullname']}\n";
                $response .= "   موبایل: <code>{$last_user['phone']}</code>";
            }
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📋 لیست کاربران', 'url' => 'https://azmamarkteng.ir/admin-users.php']
                ],
                [
                    ['text' => '🔄 بروزرسانی', 'callback_data' => 'users'],
                    ['text' => '🏠 منوی اصلی', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'finance' || $text == '/finance'):
            $total = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0] ?? 0;
            $today = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND DATE(created_at) = CURDATE()")->fetch_row()[0] ?? 0;
            $week = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_row()[0] ?? 0;
            $month = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND MONTH(created_at) = MONTH(NOW())")->fetch_row()[0] ?? 0;
            
            $response = "💰 <b>گزارش مالی</b>\n";
            $response .= str_repeat('─', 30) . "\n\n";
            $response .= "📊 <b>درآمد:</b>\n";
            $response .= "   • کل: <code>" . number_format($total) . "</code> تومان\n";
            $response .= "   • امروز: <code>" . number_format($today) . "</code> تومان\n";
            $response .= "   • این هفته: <code>" . number_format($week) . "</code> تومان\n";
            $response .= "   • این ماه: <code>" . number_format($month) . "</code> تومان\n\n";
            $response .= "💳 برای مشاهده تراکنش‌ها به پنل مراجعه کنید.";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '💳 تراکنش‌ها', 'url' => 'https://azmamarkteng.ir/admin-panel.php']
                ],
                [
                    ['text' => '🔄 بروزرسانی', 'callback_data' => 'finance'],
                    ['text' => '🏠 منوی اصلی', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'messages' || $text == '/messages'):
            $total = $conn->query("SELECT COUNT(*) FROM contact_messages")->fetch_row()[0];
            $unread = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE is_read = 0")->fetch_row()[0];
            $today = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            
            $last_msg = $conn->query("SELECT name, phone, subject FROM contact_messages ORDER BY id DESC LIMIT 1")->fetch_assoc();
            
            $response = "📩 <b>پیام‌های تماس</b>\n";
            $response .= str_repeat('─', 30) . "\n\n";
            $response .= "📊 <b>آمار:</b>\n";
            $response .= "   • کل پیام‌ها: <code>$total</code>\n";
            $response .= "   • خوانده نشده: <code>$unread</code> 🔴\n";
            $response .= "   • امروز: <code>$today</code>\n\n";
            
            if ($last_msg) {
                $response .= "📨 <b>آخرین پیام:</b>\n";
                $response .= "   از: {$last_msg['name']}\n";
                $response .= "   موضوع: {$last_msg['subject']}\n";
                $response .= "   موبایل: <code>{$last_msg['phone']}</code>";
            }
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📋 مشاهده پیام‌ها', 'url' => 'https://azmamarkteng.ir/admin-panel.php']
                ],
                [
                    ['text' => '🔄 بروزرسانی', 'callback_data' => 'messages'],
                    ['text' => '🏠 منوی اصلی', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'tools' || $text == '/tools'):
            $response = "🛠️ <b>ابزارهای مدیریتی</b>\n\n";
            $response .= "از ابزارهای زیر برای مدیریت سایت استفاده کنید:";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📊 لاگ‌های سیستم', 'callback_data' => 'system_logs'],
                    ['text' => '📈 بهینه‌سازی', 'callback_data' => 'optimize']
                ],
                [
                    ['text' => '🔐 امنیت', 'callback_data' => 'security'],
                    ['text' => '📧 تست ایمیل', 'callback_data' => 'test_email']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'files' || $text == '/files'):
            $response = "📂 <b>مدیریت فایل‌ها</b>\n\n";
            $response .= "برای آپلود فایل، عکس یا ویدیو، آن را ارسال کنید.\n\n";
            $response .= "📤 فایل‌های ارسالی در سرور ذخیره می‌شوند.";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'settings' || $text == '/settings'):
            $response = "⚙️ <b>تنظیمات ربات</b>\n\n";
            $response .= "🤖 نام ربات: " . (getBotInfo()['username'] ?? 'نامشخص') . "\n";
            $response .= "🆔 Chat ID شما: <code>$chat_id</code>\n";
            $response .= "📅 تاریخ: " . date('Y/m/d H:i:s') . "\n";
            $response .= "⚡ سرعت: <b>هر 2 ثانیه</b>\n\n";
            $response .= "✅ همه چیز عادی است";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == 'full_report' || $text == '/report'):
            sendChatAction($chat_id, 'typing');
            
            $users_total = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
            $users_today = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            $revenue_total = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0] ?? 0;
            $revenue_today = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success' AND DATE(created_at) = CURDATE()")->fetch_row()[0] ?? 0;
            $messages_today = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            $orders_total = $conn->query("SELECT COUNT(*) FROM orders")->fetch_row()[0] ?? 0;
            
            $response = "📈 <b>گزارش روزانه کامل</b>\n";
            $response .= "📅 " . date('l, Y/m/d') . "\n";
            $response .= str_repeat('═', 30) . "\n\n";
            
            $response .= "👥 <b>کاربران</b>\n";
            $response .= "├─ کل: " . number_format($users_total) . " نفر\n";
            $response .= "└─ امروز: +$users_today نفر\n\n";
            
            $response .= "💰 <b>درآمد</b>\n";
            $response .= "├─ کل: " . number_format($revenue_total) . " تومان\n";
            $response .= "└─ امروز: " . number_format($revenue_today) . " تومان\n\n";
            
            $response .= "📊 <b>سایر آمار</b>\n";
            $response .= "├─ سفارش‌ها: $orders_total\n";
            $response .= "└─ پیام‌های امروز: $messages_today\n\n";
            
            $response .= "✅ سیستم فعال و سالم است";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🏠 منوی اصلی', 'callback_data' => '/start']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        case ($text == '/help'):
            $response = "📖 <b>راهنمای استفاده از ربات</b>\n\n";
            $response .= "<b>دستورات:</b>\n";
            $response .= "/start - شروع و منوی اصلی\n";
            $response .= "/stats - آمار سیستم\n";
            $response .= "/users - گزارش کاربران\n";
            $response .= "/finance - گزارش مالی\n";
            $response .= "/messages - پیام‌های تماس\n";
            $response .= "/report - گزارش کامل\n";
            $response .= "/help - این راهنما\n\n";
            $response .= "<b>ویژگی‌ها:</b>\n";
            $response .= "• دریافت اعلان لحظه‌ای\n";
            $response .= "• مدیریت از طریق تلگرام\n";
            $response .= "• سرعت پاسخ: 2 ثانیه ⚡";
            
            sendMessage($chat_id, $response);
            break;
        
        default:
            if ($message) {
                if ($photo) {
                    $file_id = end($photo)['file_id'];
                    $local_file = downloadFile($file_id);
                    
                    if ($local_file) {
                        sendMessage($chat_id, "✅ عکس با موفقیت ذخیره شد:\n<code>" . basename($local_file) . "</code>");
                    } else {
                        sendMessage($chat_id, "❌ خطا در دریافت عکس");
                    }
                } elseif ($document) {
                    $file_id = $document['file_id'];
                    $file_name = $document['file_name'];
                    $local_file = downloadFile($file_id);
                    
                    if ($local_file) {
                        sendMessage($chat_id, "✅ فایل با موفقیت ذخیره شد:\n📁 <code>$file_name</code>");
                    } else {
                        sendMessage($chat_id, "❌ خطا در دریافت فایل");
                    }
                }
            }
    }
}
?>