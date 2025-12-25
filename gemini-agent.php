<?php
// 1. تنظیمات جلوگیری از خطا
error_reporting(E_ALL);
ini_set('display_errors', 0);
ob_start(); // شروع بافر برای جلوگیری از خراب شدن JSON
session_start();
header('Content-Type: application/json; charset=utf-8');
set_time_limit(120); // زمان بیشتر برای نوشتن کدهای طولانی

// تابع ارسال پاسخ استاندارد
function sendResponse($data) {
    ob_end_clean(); // پاک کردن هر خروجی اضافی
    echo json_encode($data);
    exit();
}

try {
    // 2. امنیت: فقط مدیر کل
    if (!isset($_SESSION['admin_logged_in'])) {
        throw new Exception('دسترسی غیرمجاز! لطفا وارد شوید.');
    }

    // دریافت داده‌های خام
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) throw new Exception('داده نامعتبر است.');

    // --- بخش الف: درخواست ذخیره فایل (توسط دکمه پنل) ---
    if (isset($input['action']) && $input['action'] == 'write') {
        $filename = $input['filename'];
        $content = $input['content'];
        
        // لیست سیاه فایل‌های حیاتی (جهت امنیت)
        $forbidden = ['db.php', 'auth.php', 'gemini-agent.php', 'admin-panel.php', '.htaccess'];
        
        if (in_array($filename, $forbidden) || strpos($filename, '/') !== false || strpos($filename, '..') !== false) {
             throw new Exception('ویرایش این فایل امنیتی مجاز نیست.');
        }
        
        // ذخیره فایل
        if (file_put_contents($filename, $content) !== false) {
             sendResponse(['result' => '✅ فایل ' . $filename . ' با موفقیت ساخته/ویرایش شد.']);
        } else {
             throw new Exception('خطا در نوشتن فایل (دسترسی‌ها را چک کنید).');
        }
    }

    // --- بخش ب: درخواست از هوش مصنوعی ---
    $apiKey = "AIzaSyCUXMwx5VmStANuTs-faJa2emoRoBV8fdc"; 
    // استفاده از مدل قدرتمند 2.0 Flash
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;
    
    $userMessage = $input['message'] ?? '';
    if (empty($userMessage)) throw new Exception('پیام خالی است.');

    // لیست فایل‌های موجود (برای اطلاع هوش مصنوعی)
    $files = implode(", ", array_map('basename', glob("*.{php,html,css,js}", GLOB_BRACE)));

    // 🔥 دستورالعمل هوشمند (System Prompt) با درک دیزاین سایت 🔥
    $systemInstruction = "تو یک برنامه نویس ارشد فول‌استک و طراح UI/UX هستی.
    لیست فایل‌های موجود در هاست: [$files]

    **قوانین طراحی و کدنویسی سایت 'آژانس ازما' (بسیار مهم):**
    1. **استک:** HTML5 + Tailwind CSS (CDN) + FontAwesome (CDN).
    2. **تم:** دارک (Dark Mode) با پس‌زمینه گرادینت سرمه‌ای/مشکی.
       - کد رنگ اصلی (آبی): #00d2ff
       - کد رنگ دوم (طلایی): #f59e0b
       - کد پس‌زمینه: linear-gradient(to bottom, #0f2027, #203a43, #2c5364)
    3. **کامپوننت‌ها:**
       - کارت‌ها: شیشه‌ای (Glassmorphism) با بوردر سفید شفاف.
       - دکمه‌ها: گرادینت طلایی یا آبی نئونی.
       - فونت: 'Vazirmatn' برای تمام متون.
    4. **هدر و فوتر:** در صفحات جدید، حتما هدر و فوتر سایت را قرار بده تا کاربر بتواند به صفحه اصلی برگردد.

    **وظیفه تو:**
    درخواست کاربر را انجام بده و کد کامل و نهایی فایل را بنویس.
    
    **فرمت پاسخ (حیاتی):**
    کد را حتماً و دقیقاً داخل تگ کد با نام فایل بگذار:
    ```filename.php
    ... کد کامل اینجا ...
    ```
    (مثلا: ```client-new.php یا ```about.php)
    ";

    $data = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $systemInstruction . "\n\nUser Request: " . $userMessage]
                ]
            ]
        ]
    ];

    // اتصال به گوگل
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90); // زمان بیشتر برای تولید کدهای طولانی

    $api_response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        throw new Exception('خطای اتصال CURL: ' . curl_error($ch));
    }
    curl_close($ch);

    $result = json_decode($api_response, true);
    
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        sendResponse(['reply' => $result['candidates'][0]['content']['parts'][0]['text']]);
    } else {
        $errMsg = $result['error']['message'] ?? 'پاسخ نامعتبر از گوگل';
        throw new Exception('خطای هوش مصنوعی: ' . $errMsg);
    }

} catch (Exception $e) {
    sendResponse(['error' => $e->getMessage()]);
}
?>