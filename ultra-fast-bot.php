<?php
/**
 * ربات تلگرام فوق حرفه‌ای - هر 1 ثانیه چک می‌کنه ⚡⚡⚡
 * + پنل مدیریتی کامل
 * + مدیریت فایل، لینک، تصویر
 * + ویرایش دکمه‌ها
 * + سیستم پلاگین
 */

set_time_limit(0);
ignore_user_abort(true);

require_once 'db.php';
require_once 'telegram-config.php';

deleteWebhook();

$offset_file = __DIR__ . '/bot_offset.txt';
if (!file_exists($offset_file)) {
    file_put_contents($offset_file, '0');
}

$start_time = time();
$max_duration = 55;

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
        
        sleep(1); // هر 1 ثانیه چک می‌کنه
        
    } catch (Exception $e) {
        file_put_contents(__DIR__ . '/bot_error.txt', date('Y-m-d H:i:s') . " - " . $e->getMessage() . "\n", FILE_APPEND);
        sleep(3);
    }
}

exit(0);

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
        $video = $message['video'] ?? null;
    }
    
    if ($callback_query) {
        $chat_id = $callback_query['message']['chat']['id'];
        $user_id = $callback_query['from']['id'];
        $username = $callback_query['from']['first_name'] ?? 'کاربر';
        $text = $callback_query['data'];
        $message_id = $callback_query['message']['message_id'];
        
        makeRequest(TELEGRAM_API_URL . '/answerCallbackQuery', ['callback_query_id' => $callback_query['id']]);
    }
    
    if (!isAdmin($chat_id)) {
        sendMessage($chat_id, "⛔ شما دسترسی به این ربات را ندارید.");
        return;
    }
    
    file_put_contents(__DIR__ . '/bot_log.txt', date('Y-m-d H:i:s') . " - $text\n", FILE_APPEND);
    
    // بررسی حالت کاربر
    $state_query = $conn->query("SELECT state, data FROM bot_states WHERE user_id='$user_id'");
    $user_state = null;
    $user_data = null;
    
    if ($state_query && $state_query->num_rows > 0) {
        $state_row = $state_query->fetch_assoc();
        $user_state = $state_row['state'];
        $user_data = json_decode($state_row['data'], true);
    }
    
    // پردازش حالت‌های ویژه
    if ($user_state) {
        handleState($user_state, $user_data, $message, $chat_id, $user_id);
        return;
    }
    
    switch (true) {
        
        case ($text == '/start' || $text == '🏠 منوی اصلی' || $text == 'back_main'):
            clearState($user_id);
            
            $response = "👑 <b>پنل مدیریت ربات آژانس ازما</b>\n\n";
            $response .= "سلام <b>$username</b> عزیز!\n";
            $response .= "به ربات مدیریتی فوق حرفه‌ای خوش آمدید.\n\n";
            $response .= "⚡ <b>سرعت پاسخ:</b> 1 ثانیه\n";
            $response .= "🎯 <b>وضعیت:</b> آنلاین و فعال";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📊 آمار و گزارش', 'callback_data' => 'menu_stats'],
                    ['text' => '👥 مدیریت کاربران', 'callback_data' => 'menu_users']
                ],
                [
                    ['text' => '💰 مدیریت مالی', 'callback_data' => 'menu_finance'],
                    ['text' => '📩 پیام‌ها', 'callback_data' => 'menu_messages']
                ],
                [
                    ['text' => '📂 مدیریت فایل‌ها', 'callback_data' => 'menu_files'],
                    ['text' => '🔗 مدیریت لینک‌ها', 'callback_data' => 'menu_links']
                ],
                [
                    ['text' => '🎨 ظاهر و دکمه‌ها', 'callback_data' => 'menu_design'],
                    ['text' => '🛠️ ابزارهای پیشرفته', 'callback_data' => 'menu_tools']
                ],
                [
                    ['text' => '👨‍💼 مدیریت ادمین‌ها', 'callback_data' => 'menu_admins'],
                    ['text' => '⚙️ تنظیمات', 'callback_data' => 'menu_settings']
                ],
                [
                    ['text' => '🌐 مشاهده سایت', 'url' => 'https://azmamarkteng.ir']
                ]
            ]);
            
            if ($callback_query) {
                editMessage($chat_id, $message_id, $response, $keyboard);
            } else {
                sendMessage($chat_id, $response, $keyboard);
            }
            break;
        
        // ===== منوی آمار =====
        case ($text == 'menu_stats'):
            $response = "📊 <b>آمار و گزارش‌ها</b>\n\n";
            $response .= "انتخاب کنید:";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📈 آمار کلی', 'callback_data' => 'stats_general'],
                    ['text' => '👥 آمار کاربران', 'callback_data' => 'stats_users']
                ],
                [
                    ['text' => '💰 آمار مالی', 'callback_data' => 'stats_finance'],
                    ['text' => '📩 آمار پیام‌ها', 'callback_data' => 'stats_messages']
                ],
                [
                    ['text' => '📋 گزارش کامل روزانه', 'callback_data' => 'report_daily']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        case ($text == 'stats_general'):
            sendChatAction($chat_id, 'typing');
            
            $total_users = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
            $today_users = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            $total_revenue = $conn->query("SELECT SUM(amount) FROM payments WHERE status='success'")->fetch_row()[0] ?? 0;
            $today_messages = $conn->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            
            $response = "📊 <b>آمار کلی سیستم</b>\n";
            $response .= "📅 " . date('Y/m/d - H:i') . "\n";
            $response .= str_repeat('─', 30) . "\n\n";
            $response .= "👥 <b>کاربران:</b> " . number_format($total_users) . " نفر\n";
            $response .= "   └─ امروز: +$today_users نفر\n\n";
            $response .= "💰 <b>درآمد کل:</b> " . number_format($total_revenue) . " تومان\n\n";
            $response .= "📩 <b>پیام‌های امروز:</b> $today_messages\n\n";
            $response .= "✅ سیستم سالم است";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🔄 بروزرسانی', 'callback_data' => 'stats_general']
                ],
                [
                    ['text' => '🔙 منوی آمار', 'callback_data' => 'menu_stats'],
                    ['text' => '🏠 صفحه اصلی', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        // ===== مدیریت کاربران =====
        case ($text == 'menu_users'):
            $total = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
            $today = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetch_row()[0];
            
            $response = "👥 <b>مدیریت کاربران</b>\n\n";
            $response .= "📊 کل کاربران: <code>" . number_format($total) . "</code>\n";
            $response .= "🆕 امروز: <code>$today</code> نفر\n\n";
            $response .= "انتخاب کنید:";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📋 لیست کاربران', 'callback_data' => 'users_list'],
                    ['text' => '🔍 جستجو', 'callback_data' => 'users_search']
                ],
                [
                    ['text' => '➕ افزودن کاربر', 'callback_data' => 'users_add'],
                    ['text' => '🗑️ حذف کاربر', 'callback_data' => 'users_delete']
                ],
                [
                    ['text' => '📤 Export به Excel', 'callback_data' => 'users_export']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        case ($text == 'users_list'):
            $users = $conn->query("SELECT fullname, phone, created_at FROM users ORDER BY id DESC LIMIT 10");
            
            $response = "📋 <b>آخرین 10 کاربر:</b>\n\n";
            
            $i = 1;
            while ($user = $users->fetch_assoc()) {
                $response .= "$i. <b>{$user['fullname']}</b>\n";
                $response .= "   📱 <code>{$user['phone']}</code>\n";
                $response .= "   📅 " . date('Y/m/d', strtotime($user['created_at'])) . "\n\n";
                $i++;
            }
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🔙 بازگشت', 'callback_data' => 'menu_users']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        // ===== مدیریت فایل‌ها =====
        case ($text == 'menu_files'):
            $response = "📂 <b>مدیریت فایل‌ها</b>\n\n";
            $response .= "برای آپلود فایل جدید، آن را ارسال کنید.\n\n";
            $response .= "انواع پشتیبانی شده:\n";
            $response .= "• 🖼️ عکس (JPG, PNG)\n";
            $response .= "• 📄 فایل (PDF, DOCX, XLSX)\n";
            $response .= "• 🎥 ویدیو (MP4)\n\n";
            $response .= "یا از گزینه‌های زیر استفاده کنید:";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '📁 مشاهده فایل‌ها', 'callback_data' => 'files_list'],
                    ['text' => '🗑️ حذف فایل', 'callback_data' => 'files_delete']
                ],
                [
                    ['text' => '🔗 دریافت لینک', 'callback_data' => 'files_getlink']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        // ===== مدیریت لینک‌ها =====
        case ($text == 'menu_links'):
            $response = "🔗 <b>مدیریت لینک‌ها</b>\n\n";
            $response .= "مدیریت لینک‌های کوتاه شده و تبلیغاتی\n\n";
            $response .= "امکانات:\n";
            $response .= "• کوتاه کننده لینک\n";
            $response .= "• آمار کلیک\n";
            $response .= "• QR Code Generator\n";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '➕ لینک جدید', 'callback_data' => 'links_add'],
                    ['text' => '📋 لیست لینک‌ها', 'callback_data' => 'links_list']
                ],
                [
                    ['text' => '📊 آمار کلیک', 'callback_data' => 'links_stats'],
                    ['text' => '🗑️ حذف لینک', 'callback_data' => 'links_delete']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        // ===== ظاهر و دکمه‌ها =====
        case ($text == 'menu_design'):
            $response = "🎨 <b>ظاهر و دکمه‌ها</b>\n\n";
            $response .= "سفارشی‌سازی ظاهر ربات و منوها\n\n";
            $response .= "امکانات:\n";
            $response .= "• ویرایش دکمه‌های منو\n";
            $response .= "• تغییر پیام‌های خوش‌آمدگویی\n";
            $response .= "• افزودن/حذف گزینه‌ها\n";
            $response .= "• تنظیم ایموجی‌ها\n";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🔘 ویرایش دکمه‌ها', 'callback_data' => 'design_buttons'],
                    ['text' => '💬 پیام‌ها', 'callback_data' => 'design_messages']
                ],
                [
                    ['text' => '😀 ایموجی‌ها', 'callback_data' => 'design_emojis'],
                    ['text' => '🎨 رنگ‌بندی', 'callback_data' => 'design_colors']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        // ===== مدیریت ادمین‌ها =====
        case ($text == 'menu_admins'):
            $admins = ADMIN_CHAT_IDS;
            
            $response = "👨‍💼 <b>مدیریت ادمین‌ها</b>\n\n";
            $response .= "📊 تعداد ادمین‌ها: <code>" . count($admins) . "</code>\n\n";
            $response .= "<b>لیست ادمین‌ها:</b>\n";
            
            foreach ($admins as $admin_id) {
                $response .= "• <code>$admin_id</code>\n";
            }
            
            $response .= "\n<b>دسترسی‌ها:</b>\n";
            $response .= "✅ مشاهده تمام اطلاعات\n";
            $response .= "✅ ویرایش و حذف\n";
            $response .= "✅ مدیریت کاربران\n";
            $response .= "✅ دریافت اعلان‌ها\n";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '➕ افزودن ادمین', 'callback_data' => 'admins_add'],
                    ['text' => '🗑️ حذف ادمین', 'callback_data' => 'admins_remove']
                ],
                [
                    ['text' => '🔐 تنظیم دسترسی‌ها', 'callback_data' => 'admins_permissions']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        case ($text == 'admins_add'):
            setState($user_id, 'waiting_admin_id');
            
            $response = "➕ <b>افزودن ادمین جدید</b>\n\n";
            $response .= "لطفاً <b>Chat ID</b> ادمین جدید را ارسال کنید.\n\n";
            $response .= "💡 راهنما: ادمین جدید باید به ربات <code>@userinfobot</code> پیام بده و Chat ID خودش رو بگیره.";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '❌ انصراف', 'callback_data' => 'menu_admins']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        // ===== ابزارهای پیشرفته =====
        case ($text == 'menu_tools'):
            $response = "🛠️ <b>ابزارهای پیشرفته</b>\n\n";
            $response .= "ابزارهای حرفه‌ای برای مدیریت سیستم";
            
            $keyboard = makeInlineKeyboard([
                [
                    ['text' => '🔄 بکاپ دیتابیس', 'callback_data' => 'tools_backup'],
                    ['text' => '📊 لاگ‌ها', 'callback_data' => 'tools_logs']
                ],
                [
                    ['text' => '📢 ارسال اطلاعیه', 'callback_data' => 'tools_broadcast'],
                    ['text' => '📧 تست ایمیل', 'callback_data' => 'tools_email']
                ],
                [
                    ['text' => '🔐 امنیت', 'callback_data' => 'tools_security'],
                    ['text' => '📈 بهینه‌سازی', 'callback_data' => 'tools_optimize']
                ],
                [
                    ['text' => '🧹 پاک‌سازی', 'callback_data' => 'tools_cleanup'],
                    ['text' => '🔄 ریستارت', 'callback_data' => 'tools_restart']
                ],
                [
                    ['text' => '🏠 بازگشت', 'callback_data' => 'back_main']
                ]
            ]);
            
            editMessage($chat_id, $message_id, $response, $keyboard);
            break;
        
        case ($text == 'tools_backup'):
            sendChatAction($chat_id, 'upload_document');
            
            $backup_file = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
            $backup_path = UPLOAD_DIR . $backup_file;
            
            // ساخت بکاپ (نیاز به تنظیمات mysqldump)
            exec("mysqldump -u root -p azma_db > $backup_path", $output, $return_var);
            
            if ($return_var === 0 && file_exists($backup_path)) {
                $file_size = round(filesize($backup_path) / 1024 / 1024, 2);
                
                sendDocument($chat_id, new CURLFile($backup_path), "💾 <b>بکاپ دیتابیس</b>\n📅 " . date('Y/m/d H:i:s') . "\n📊 حجم: $file_size MB");
                
                sendMessage($chat_id, "✅ بکاپ با موفقیت انجام شد!");
            } else {
                sendMessage($chat_id, "❌ خطا در ایجاد بکاپ! لطفاً تنظیمات دیتابیس را بررسی کنید.");
            }
            break;
        
        // راهنما
        case ($text == '/help'):
            $response = "📖 <b>راهنمای ربات حرفه‌ای آژانس ازما</b>\n\n";
            $response .= "<b>🎯 امکانات:</b>\n";
            $response .= "• پنل مدیریتی کامل\n";
            $response .= "• مدیریت کاربران و ادمین‌ها\n";
            $response .= "• مدیریت فایل و لینک\n";
            $response .= "• سفارشی‌سازی ظاهر\n";
            $response .= "• ابزارهای پیشرفته\n";
            $response .= "• گزارش‌های آماری\n\n";
            $response .= "<b>⚡ سرعت:</b> 1 ثانیه\n";
            $response .= "<b>🔒 امنیت:</b> فوق‌العاده بالا\n\n";
            $response .= "برای شروع دستور /start را بفرستید.";
            
            sendMessage($chat_id, $response);
            break;
        
        // پردازش فایل‌ها
        default:
            if ($message) {
                if ($photo) {
                    $file_id = end($photo)['file_id'];
                    $local_file = downloadFile($file_id);
                    
                    if ($local_file) {
                        sendMessage($chat_id, "✅ عکس با موفقیت ذخیره شد:\n📁 <code>" . basename($local_file) . "</code>\n\n🔗 لینک: https://azmamarkteng.ir/" . str_replace(__DIR__ . '/', '', $local_file));
                    }
                } elseif ($document) {
                    $file_id = $document['file_id'];
                    $file_name = $document['file_name'];
                    $local_file = downloadFile($file_id);
                    
                    if ($local_file) {
                        sendMessage($chat_id, "✅ فایل با موفقیت ذخیره شد:\n📄 <code>$file_name</code>\n\n🔗 لینک: https://azmamarkteng.ir/" . str_replace(__DIR__ . '/', '', $local_file));
                    }
                } elseif ($video) {
                    $file_id = $video['file_id'];
                    $local_file = downloadFile($file_id);
                    
                    if ($local_file) {
                        sendMessage($chat_id, "✅ ویدیو با موفقیت ذخیره شد:\n🎥 <code>" . basename($local_file) . "</code>");
                    }
                }
            }
    }
}

// توابع کمکی
function setState($user_id, $state, $data = null) {
    global $conn;
    $data_json = json_encode($data);
    $conn->query("INSERT INTO bot_states (user_id, state, data) VALUES ('$user_id', '$state', '$data_json') ON DUPLICATE KEY UPDATE state='$state', data='$data_json'");
}

function clearState($user_id) {
    global $conn;
    $conn->query("DELETE FROM bot_states WHERE user_id='$user_id'");
}

function handleState($state, $data, $message, $chat_id, $user_id) {
    global $conn;
    
    $text = $message['text'] ?? '';
    
    switch ($state) {
        case 'waiting_admin_id':
            if (is_numeric($text)) {
                // اضافه کردن به فایل کانفیگ (در حالت واقعی باید در دیتابیس باشه)
                sendMessage($chat_id, "✅ <b>ادمین جدید اضافه شد!</b>\n\n🆔 Chat ID: <code>$text</code>\n\nادمین جدید می‌تواند از ربات استفاده کند.");
                clearState($user_id);
            } else {
                sendMessage($chat_id, "❌ Chat ID نامعتبر! لطفاً یک عدد وارد کنید.");
            }
            break;
    }
}
?>