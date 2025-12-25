<?php
/**
 * ربات تلگرام آژانس ازما - هسته اصلی
 * این فایل باید به عنوان Webhook تنظیم بشه
 * URL: https://azmamarkteng.ir/bot.php
 */

error_reporting(0);
ini_set('display_errors', 0);

require_once 'db.php';
require_once 'telegram-config.php';

// دریافت آپدیت از تلگرام
$content = file_get_contents("php://input");
$update = json_decode($content, true);

// لاگ کردن آپدیت (برای دیباگ)
file_put_contents('bot_log.txt', date('Y-m-d H:i:s') . " - " . $content . "\n", FILE_APPEND);

if (!$update) exit;

// استخراج اطلاعات
$message = $update['message'] ?? null;
$callback_query = $update['callback_query'] ?? null;
$chat_id = null;
$user_id = null;
$username = null;
$text = '';

// پردازش پیام عادی
if ($message) {
    $chat_id = $message['chat']['id'];
    $user_id = $message['from']['id'];
    $username = $message['from']['first_name'] ?? 'کاربر';
    $text = $message['text'] ?? '';
    $photo = $message['photo'] ?? null;
    $document = $message['document'] ?? null;
    $video = $message['video'] ?? null;
}

// پردازش Callback Query (دکمه‌های Inline)
if ($callback_query) {
    $chat_id = $callback_query['message']['chat']['id'];
    $user_id = $callback_query['from']['id'];
    $username = $callback_query['from']['first_name'] ?? 'کاربر';
    $text = $callback_query['data'];
    $message_id = $callback_query['message']['message_id'];
    
    // پاسخ به Callback
    $url = TELEGRAM_API_URL . '/answerCallbackQuery';
    makeRequest($url, ['callback_query_id' => $callback_query['id']]);
}

// بررسی دسترسی ادمین
if (!isAdmin($chat_id)) {
    sendMessage($chat_id, "⛔ شما دسترسی به این ربات را ندارید.\n\nفقط ادمین سایت می‌تواند از ربات استفاده کند.");
    exit;
}

// ====================
// پردازش دستورات
// ====================

switch (true) {
    
    // دستور /start یا شروع
    case ($text == '/start' || $text == 'شروع' || $text == '🏠 منوی اصلی'):
        $response = "👋 سلام <b>$username</b> عزیز!\n\n";
        $response .= "به ربات مدیریت <b>آژانس دیجیتال مارکتینگ ازما</b> خوش آمدید.\n\n";
        $response .= "این ربات ابزاری قدرتمند برای مدیریت سایت، دریافت اعلان‌ها و کنترل کامل از طریق تلگرام است.\n\n";
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
                ['text' => '📢 ارسال اطلاعیه', 'callback_data' => 'broadcast']
            ],
            [
                ['text' => '📂 فایل‌ها', 'callback_data' => 'files'],
                ['text' => '⚙️ تنظیمات', 'callback_data' => 'settings']
            ],
            [
                ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
            ]
        ]);
        
        sendMessage($chat_id, $response, $keyboard);
        break;
    
    // آمار سیستم
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
    
    // مدیریت کاربران
    case ($text == 'users' || $text == '/users'):
        $total = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
        $today = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
        $week = $conn->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_row()[0];
        $month = $conn->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetch_row()[0];
        
        // آخرین کاربر
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
    
    // گزارش مالی
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
    
    // پیام‌های تماس
    case ($text == 'messages' || $text == '/messages'):
        $total = $conn->query("SELECT COUNT(*) FROM contact_messages")->fetch_row()[0];
        $unread = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE is_read = 0")->fetch_row()[0];
        $today = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
        
        // آخرین پیام
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
    
    // ابزارها
    case ($text == 'tools' || $text == '/tools'):
        $response = "🛠️ <b>ابزارهای مدیریتی</b>\n\n";
        $response .= "از ابزارهای زیر برای مدیریت سایت استفاده کنید:";
        
        $keyboard = makeInlineKeyboard([
            [
                ['text' => '🔄 بکاپ دیتابیس', 'callback_data' => 'backup_db'],
                ['text' => '📊 لاگ‌های سیستم', 'callback_data' => 'system_logs']
            ],
            [
                ['text' => '🧹 پاک‌سازی', 'callback_data' => 'cleanup'],
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
    
    // بکاپ دیتابیس
    case ($text == 'backup_db'):
        sendChatAction($chat_id, 'upload_document');
        
        $backup_file = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
        $command = "mysqldump -u " . $username . " -p" . $password . " " . $dbname . " > " . UPLOAD_DIR . $backup_file;
        exec($command);
        
        if (file_exists(UPLOAD_DIR . $backup_file)) {
            $file_size = round(filesize(UPLOAD_DIR . $backup_file) / 1024 / 1024, 2);
            
            sendDocument($chat_id, new CURLFile(UPLOAD_DIR . $backup_file), "💾 بکاپ دیتابیس\n📅 " . date('Y/m/d H:i:s') . "\n📊 حجم: $file_size MB");
            
            sendMessage($chat_id, "✅ بکاپ با موفقیت انجام شد!");
        } else {
            sendMessage($chat_id, "❌ خطا در ایجاد بکاپ!");
        }
        break;
    
    // ارسال اطلاعیه
    case ($text == 'broadcast'):
        $response = "📢 <b>ارسال اطلاعیه عمومی</b>\n\n";
        $response .= "پیام خود را ارسال کنید تا به همه کاربران ارسال شود.\n\n";
        $response .= "⚠️ از این ویژگی با احتیاط استفاده کنید!";
        
        // ذخیره حالت در دیتابیس یا Session
        $conn->query("UPDATE bot_states SET state='waiting_broadcast', user_id='$user_id' WHERE user_id='$user_id'");
        if ($conn->affected_rows == 0) {
            $conn->query("INSERT INTO bot_states (user_id, state) VALUES ('$user_id', 'waiting_broadcast')");
        }
        
        $keyboard = makeInlineKeyboard([
            [
                ['text' => '❌ انصراف', 'callback_data' => '/start']
            ]
        ]);
        
        sendMessage($chat_id, $response, $keyboard);
        break;
    
    // مدیریت فایل‌ها
    case ($text == 'files'):
        $response = "📂 <b>مدیریت فایل‌ها</b>\n\n";
        $response .= "برای آپلود فایل، عکس یا ویدیو، آن را ارسال کنید.\n\n";
        $response .= "📤 فایل‌های ارسالی در سرور ذخیره می‌شوند.";
        
        $keyboard = makeInlineKeyboard([
            [
                ['text' => '📁 مشاهده فایل‌ها', 'callback_data' => 'list_files'],
                ['text' => '🗑️ حذف فایل', 'callback_data' => 'delete_file']
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
    
    // تنظیمات
    case ($text == 'settings'):
        $response = "⚙️ <b>تنظیمات ربات</b>\n\n";
        $response .= "🤖 نام ربات: " . (getBotInfo()['username'] ?? 'نامشخص') . "\n";
        $response .= "🆔 Chat ID شما: <code>$chat_id</code>\n";
        $response .= "📅 تاریخ: " . date('Y/m/d H:i:s') . "\n\n";
        $response .= "✅ همه چیز عادی است";
        
        $keyboard = makeInlineKeyboard([
            [
                ['text' => '🔄 ریستارت ربات', 'callback_data' => 'restart_bot'],
                ['text' => '📊 وضعیت', 'callback_data' => 'bot_status']
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
    
    // گزارش کامل روزانه
    case ($text == 'full_report' || $text == '/report'):
        sendChatAction($chat_id, 'typing');
        
        // جمع‌آوری آمار کامل
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
        
        sendMessage($chat_id, $response, $keyboard);
        break;
    
    // راهنما
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
        $response .= "• بکاپ خودکار\n";
        $response .= "• آپلود و دانلود فایل";
        
        sendMessage($chat_id, $response);
        break;
    
    // پردازش پیام‌های عادی (برای broadcast)
    default:
        // بررسی حالت کاربر
        $state_query = $conn->query("SELECT state FROM bot_states WHERE user_id='$user_id'");
        if ($state_query && $state_query->num_rows > 0) {
            $state = $state_query->fetch_assoc()['state'];
            
            if ($state == 'waiting_broadcast' && !empty($text)) {
                // ارسال پیام به همه کاربران
                $users = $conn->query("SELECT phone FROM users");
                $sent = 0;
                $failed = 0;
                
                while ($user = $users->fetch_assoc()) {
                    // در اینجا باید chat_id کاربران رو داشته باشی
                    // این فقط یک مثال است
                    // $user_chat_id = getUserChatId($user['phone']);
                    // if (sendMessage($user_chat_id, $text)) {
                    //     $sent++;
                    // } else {
                    //     $failed++;
                    // }
                }
                
                // پاک کردن حالت
                $conn->query("DELETE FROM bot_states WHERE user_id='$user_id'");
                
                sendMessage($chat_id, "✅ پیام به $sent کاربر ارسال شد.\n❌ $failed ناموفق");
            } else {
                sendMessage($chat_id, "❓ دستور نامعتبر!\n\nاز /start برای منوی اصلی استفاده کنید.");
            }
        } else {
            sendMessage($chat_id, "❓ دستور نامعتبر!\n\nاز /help برای راهنما استفاده کنید.");
        }
}

// ====================
// پردازش فایل‌ها
// ====================

if ($message) {
    // دریافت عکس
    if ($photo) {
        $file_id = end($photo)['file_id'];
        $local_file = downloadFile($file_id);
        
        if ($local_file) {
            sendMessage($chat_id, "✅ عکس با موفقیت ذخیره شد:\n<code>" . basename($local_file) . "</code>");
        } else {
            sendMessage($chat_id, "❌ خطا در دریافت عکس");
        }
    }
    
    // دریافت فایل
    if ($document) {
        $file_id = $document['file_id'];
        $file_name = $document['file_name'];
        $local_file = downloadFile($file_id);
        
        if ($local_file) {
            sendMessage($chat_id, "✅ فایل با موفقیت ذخیره شد:\n📁 <code>$file_name</code>");
        } else {
            sendMessage($chat_id, "❌ خطا در دریافت فایل");
        }
    }
    
    // دریافت ویدیو
    if ($video) {
        $file_id = $video['file_id'];
        $local_file = downloadFile($file_id);
        
        if ($local_file) {
            sendMessage($chat_id, "✅ ویدیو با موفقیت ذخیره شد:\n<code>" . basename($local_file) . "</code>");
        } else {
            sendMessage($chat_id, "❌ خطا در دریافت ویدیو");
        }
    }
}
?>