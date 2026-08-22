<?php
/**
 * تنظیمات ربات تلگرام آژانس ازما - نسخه اصلاح شده
 */

// اطلاعات ربات فقط از متغیرهای محیطی سرور خوانده می‌شوند.
define('TELEGRAM_BOT_TOKEN', getenv('TELEGRAM_BOT_TOKEN') ?: '');
define('TELEGRAM_CHAT_ID', getenv('TELEGRAM_CHAT_ID') ?: '');
if (TELEGRAM_BOT_TOKEN === '' || TELEGRAM_CHAT_ID === '') {
    error_log('Telegram configuration is missing.');
    http_response_code(503);
    exit('سرویس پیام‌رسان در دسترس نیست.');
}
define('TELEGRAM_API_URL', 'https://api.telegram.org/bot' . TELEGRAM_BOT_TOKEN);

// تنظیمات امنیتی
define('ADMIN_CHAT_IDS', [TELEGRAM_CHAT_ID]);

// پوشه ذخیره فایل‌ها
define('UPLOAD_DIR', __DIR__ . '/uploads/telegram/');
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

/**
 * بررسی دسترسی ادمین
 */
function isAdmin($chat_id) {
    return in_array($chat_id, ADMIN_CHAT_IDS);
}

/**
 * ارسال پیام ساده
 */
function sendMessage($chat_id, $text, $keyboard = null, $parse_mode = 'HTML') {
    $url = TELEGRAM_API_URL . '/sendMessage';
    
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => $parse_mode
    ];
    
    if ($keyboard) {
        $data['reply_markup'] = json_encode($keyboard);
    }
    
    return makeRequest($url, $data);
}

/**
 * ارسال پیام تلگرام (تابع اصلی برای استفاده در سایت)
 */
function sendTelegramMessage($message, $parse_mode = 'HTML', $keyboard = null) {
    return sendMessage(TELEGRAM_CHAT_ID, $message, $keyboard, $parse_mode);
}

/**
 * ارسال اعلان فرمت‌شده
 */
function sendFormattedNotification($title, $details = [], $icon = '📢') {
    $message = "$icon <b>$title</b>\n";
    $message .= str_repeat('─', 30) . "\n\n";
    
    foreach ($details as $key => $value) {
        $message .= "• <b>$key:</b> $value\n";
    }
    
    $message .= "\n⏰ " . date('Y/m/d H:i:s');
    
    return sendTelegramMessage($message);
}

/**
 * ارسال عکس
 */
function sendPhoto($chat_id, $photo, $caption = '', $keyboard = null) {
    $url = TELEGRAM_API_URL . '/sendPhoto';
    
    $data = [
        'chat_id' => $chat_id,
        'photo' => $photo,
        'caption' => $caption,
        'parse_mode' => 'HTML'
    ];
    
    if ($keyboard) {
        $data['reply_markup'] = json_encode($keyboard);
    }
    
    return makeRequest($url, $data);
}

/**
 * ارسال فایل
 */
function sendDocument($chat_id, $document, $caption = '') {
    $url = TELEGRAM_API_URL . '/sendDocument';
    
    $data = [
        'chat_id' => $chat_id,
        'document' => $document,
        'caption' => $caption
    ];
    
    return makeRequest($url, $data);
}

/**
 * ارسال ویدیو
 */
function sendVideo($chat_id, $video, $caption = '') {
    $url = TELEGRAM_API_URL . '/sendVideo';
    
    $data = [
        'chat_id' => $chat_id,
        'video' => $video,
        'caption' => $caption
    ];
    
    return makeRequest($url, $data);
}

/**
 * ویرایش پیام
 */
function editMessage($chat_id, $message_id, $text, $keyboard = null) {
    $url = TELEGRAM_API_URL . '/editMessageText';
    
    $data = [
        'chat_id' => $chat_id,
        'message_id' => $message_id,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    if ($keyboard) {
        $data['reply_markup'] = json_encode($keyboard);
    }
    
    return makeRequest($url, $data);
}

/**
 * حذف پیام
 */
function deleteMessage($chat_id, $message_id) {
    $url = TELEGRAM_API_URL . '/deleteMessage';
    
    $data = [
        'chat_id' => $chat_id,
        'message_id' => $message_id
    ];
    
    return makeRequest($url, $data);
}

/**
 * دانلود فایل از تلگرام
 */
function downloadFile($file_id) {
    $url = TELEGRAM_API_URL . '/getFile?file_id=' . $file_id;
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    
    if (!isset($data['result']['file_path'])) {
        return false;
    }
    
    $file_path = $data['result']['file_path'];
    $file_url = 'https://api.telegram.org/file/bot' . TELEGRAM_BOT_TOKEN . '/' . $file_path;
    
    $file_content = file_get_contents($file_url);
    $local_filename = UPLOAD_DIR . basename($file_path);
    
    file_put_contents($local_filename, $file_content);
    
    return $local_filename;
}

/**
 * ارسال اعلان به همه ادمین‌ها
 */
function notifyAdmins($message, $keyboard = null) {
    foreach (ADMIN_CHAT_IDS as $admin_id) {
        sendMessage($admin_id, $message, $keyboard);
    }
}

/**
 * ارسال درخواست HTTP
 */
function makeRequest($url, $data) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Enable SSL verification for security (prevents MITM attacks)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("Telegram API Error: " . $error);
        return false;
    }
    
    return json_decode($response, true);
}

/**
 * ساخت کیبورد Inline
 */
function makeInlineKeyboard($buttons) {
    return ['inline_keyboard' => $buttons];
}

/**
 * ساخت کیبورد Reply
 */
function makeReplyKeyboard($buttons, $resize = true, $one_time = false) {
    return [
        'keyboard' => $buttons,
        'resize_keyboard' => $resize,
        'one_time_keyboard' => $one_time
    ];
}

/**
 * حذف کیبورد
 */
function removeKeyboard() {
    return ['remove_keyboard' => true];
}

/**
 * ارسال اکشن (در حال تایپ، آپلود عکس و...)
 */
function sendChatAction($chat_id, $action = 'typing') {
    $url = TELEGRAM_API_URL . '/sendChatAction';
    
    $data = [
        'chat_id' => $chat_id,
        'action' => $action
    ];
    
    return makeRequest($url, $data);
}

/**
 * دریافت اطلاعات ربات
 */
function getBotInfo() {
    $url = TELEGRAM_API_URL . '/getMe';
    $response = file_get_contents($url);
    $result = json_decode($response, true);
    return $result['result'] ?? false;
}

/**
 * تنظیم Webhook
 */
function setWebhook($webhook_url) {
    $url = TELEGRAM_API_URL . '/setWebhook';
    
    $data = [
        'url' => $webhook_url
    ];
    
    return makeRequest($url, $data);
}

/**
 * حذف Webhook
 */
function deleteWebhook() {
    $url = TELEGRAM_API_URL . '/deleteWebhook';
    return file_get_contents($url);
}

/**
 * دریافت آپدیت‌ها (برای تست بدون Webhook)
 */
function getUpdates($offset = 0) {
    $url = TELEGRAM_API_URL . '/getUpdates?offset=' . $offset;
    $response = file_get_contents($url);
    $result = json_decode($response, true);
    return $result['result'] ?? [];
}

/**
 * دریافت اطلاعات ربات (alias برای سازگاری)
 */
function getTelegramBotInfo() {
    return getBotInfo();
}
?>