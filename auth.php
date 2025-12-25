<?php
/**
 * قالب‌های آماده پیام برای رویدادهای مختلف
 */

require_once 'telegram-config.php';

/**
 * اعلان ثبت‌نام کاربر جدید
 */
function notifyNewUser($fullname, $username, $phone) {
    $message = "🎉 <b>کاربر جدید ثبت‌نام کرد!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "👤 <b>نام:</b> $fullname\n";
    $message .= "🆔 <b>نام کاربری:</b> @$username\n";
    $message .= "📱 <b>موبایل:</b> <code>$phone</code>\n";
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    
    $keyboard = [
        [
            ['text' => '👥 مشاهده همه کاربران', 'url' => 'https://azmamarkteng.ir/admin-users.php'],
            ['text' => '📞 تماس', 'url' => 'tel:' . $phone]
        ]
    ];
    
    return sendTelegramMessage($message, 'HTML', $keyboard);
}

/**
 * اعلان پرداخت موفق
 */
function notifySuccessfulPayment($ref_id, $amount, $user_phone = null) {
    $message = "💰 <b>پرداخت موفق!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "✅ <b>کد پیگیری:</b> <code>$ref_id</code>\n";
    $message .= "💵 <b>مبلغ:</b> " . number_format($amount) . " تومان\n";
    if ($user_phone) {
        $message .= "👤 <b>کاربر:</b> <code>$user_phone</code>\n";
    }
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    
    $keyboard = [
        [
            ['text' => '📊 گزارش مالی', 'url' => 'https://azmamarkteng.ir/admin-panel.php']
        ]
    ];
    
    return sendTelegramMessage($message, 'HTML', $keyboard);
}

/**
 * اعلان پیام تماس جدید
 */
function notifyNewContactMessage($name, $phone, $email, $subject, $message_text) {
    $message = "📩 <b>پیام جدید از فرم تماس!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "👤 <b>نام:</b> $name\n";
    $message .= "📱 <b>موبایل:</b> <code>$phone</code>\n";
    $message .= "📧 <b>ایمیل:</b> " . ($email ?: 'ندارد') . "\n";
    $message .= "📌 <b>موضوع:</b> $subject\n";
    $message .= "💬 <b>پیام:</b>\n";
    $message .= "<i>" . mb_substr($message_text, 0, 150) . (mb_strlen($message_text) > 150 ? '...' : '') . "</i>\n";
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    
    $keyboard = [
        [
            ['text' => '📞 تماس با ' . $name, 'url' => 'tel:' . $phone],
            ['text' => '✉️ ایمیل', 'url' => 'mailto:' . $email]
        ],
        [
            ['text' => '👀 مشاهده در پنل', 'url' => 'https://azmamarkteng.ir/admin-panel.php']
        ]
    ];
    
    return sendTelegramMessage($message, 'HTML', $keyboard);
}

/**
 * اعلان سفارش جدید
 */
function notifyNewOrder($order_id, $customer_name, $amount, $product) {
    $message = "🛒 <b>سفارش جدید ثبت شد!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "🔢 <b>شماره سفارش:</b> #$order_id\n";
    $message .= "👤 <b>مشتری:</b> $customer_name\n";
    $message .= "📦 <b>محصول:</b> $product\n";
    $message .= "💰 <b>مبلغ:</b> " . number_format($amount) . " تومان\n";
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    
    $keyboard = [
        [
            ['text' => '👀 مشاهده سفارش', 'url' => 'https://azmamarkteng.ir/admin-panel.php?order=' . $order_id]
        ]
    ];
    
    return sendTelegramMessage($message, 'HTML', $keyboard);
}

/**
 * گزارش خطای سیستم
 */
function notifySystemError($error_type, $error_message, $file, $line) {
    $message = "🚨 <b>خطای سیستم!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "⚠️ <b>نوع:</b> $error_type\n";
    $message .= "📝 <b>پیام:</b> <code>" . htmlspecialchars(mb_substr($error_message, 0, 100)) . "</code>\n";
    $message .= "📄 <b>فایل:</b> " . basename($file) . "\n";
    $message .= "📍 <b>خط:</b> $line\n";
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    
    return sendTelegramMessage($message);
}

/**
 * گزارش روزانه سیستم (اجرا با Cron Job)
 */
function sendDailyReport($total_users, $new_users_today, $total_revenue, $orders_today) {
    $message = "📊 <b>گزارش روزانه سیستم</b>\n";
    $message .= "📅 " . date('Y/m/d') . "\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "👥 <b>کل کاربران:</b> " . number_format($total_users) . "\n";
    $message .= "🆕 <b>کاربران جدید امروز:</b> " . number_format($new_users_today) . "\n";
    $message .= "💰 <b>درآمد کل:</b> " . number_format($total_revenue) . " تومان\n";
    $message .= "🛒 <b>سفارش‌های امروز:</b> " . number_format($orders_today) . "\n";
    $message .= "\n✅ سیستم سالم و فعال است";
    
    $keyboard = [
        [
            ['text' => '📈 مشاهده آمار کامل', 'url' => 'https://azmamarkteng.ir/admin-panel.php']
        ]
    ];
    
    return sendTelegramMessage($message, 'HTML', $keyboard);
}

/**
 * هشدار امنیتی
 */
function notifySecurityAlert($alert_type, $details, $ip_address) {
    $message = "🔐 <b>هشدار امنیتی!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "⚠️ <b>نوع:</b> $alert_type\n";
    $message .= "📝 <b>جزئیات:</b> $details\n";
    $message .= "🌐 <b>IP:</b> <code>$ip_address</code>\n";
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    
    return sendTelegramMessage($message);
}

/**
 * یادآوری وظایف
 */
function sendTaskReminder($task_title, $deadline) {
    $message = "⏰ <b>یادآوری وظیفه</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "📌 <b>عنوان:</b> $task_title\n";
    $message .= "📅 <b>مهلت:</b> $deadline\n";
    $message .= "\n💡 فراموش نکنید!";
    
    return sendTelegramMessage($message);
}

/**
 * اعلان بکاپ موفق
 */
function notifyBackupSuccess($backup_file, $file_size) {
    $message = "💾 <b>بکاپ با موفقیت انجام شد!</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    $message .= "📁 <b>فایل:</b> <code>$backup_file</code>\n";
    $message .= "📊 <b>حجم:</b> $file_size MB\n";
    $message .= "\n⏰ " . date('Y/m/d - H:i:s');
    $message .= "\n✅ دیتابیس ایمن است";
    
    return sendTelegramMessage($message);
}
?>