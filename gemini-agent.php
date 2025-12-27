<?php
// gemini-agent.php - ربات هوشمند ادمین
define('AZMA_ACCESS', true);
require_once 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
ob_start();
session_start();
header('Content-Type: application/json; charset=utf-8');
set_time_limit(120);

function sendResponse($data) {
    ob_end_clean();
    echo json_encode($data);
    exit();
}

try {
    // امنیت: فقط مدیر کل
    if (!isset($_SESSION['admin_logged_in'])) {
        throw new Exception('دسترسی غیرمجاز! لطفا وارد شوید.');
    }

    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input) throw new Exception('داده نامعتبر است.');

    // --- بخش الف: درخواست ذخیره فایل ---
    if (isset($input['action']) && $input['action'] == 'write') {
        $filename = basename($input['filename']); // جلوگیری از path traversal
        $content = $input['content'];
        
        // لیست سیاه فایل‌های حیاتی
        $forbidden = ['db.php', 'auth.php', 'config.php', 'gemini-agent.php', 'admin-panel.php', '.htaccess'];
        
        if (in_array($filename, $forbidden) || strpos($filename, '..') !== false) {
             throw new Exception('ویرایش این فایل امنیتی مجاز نیست.');
        }
        
        if (file_put_contents($filename, $content) !== false) {
             sendResponse(['result' => '✅ فایل ' . htmlspecialchars($filename) . ' با موفقیت ساخته/ویرایش شد.']);
        } else {
             throw new Exception('خطا در نوشتن فایل (دسترسی‌ها را چک کنید).');
        }
    }

    // --- بخش ب: درخواست از هوش مصنوعی ---
    $userMessage = isset($input['message']) ? trim($input['message']) : '';
    if (empty($userMessage)) throw new Exception('پیام خالی است.');
    
    // محدودیت طول پیام
    if (strlen($userMessage) > 5000) {
        throw new Exception('پیام بیش از حد طولانی است.');
    }

    // لیست فایل‌های موجود
    $files = implode(", ", array_map('basename', glob("*.{php,html,css,js}", GLOB_BRACE)));

    // دستورالعمل هوشمند
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
    4. **هدر و فوتر:** در صفحات جدید، حتما هدر و فوتر سایت را قرار بده.

    **فرمت پاسخ:**
    کد را حتماً داخل تگ کد با نام فایل بگذار:
    ```filename.php
    ... کد کامل اینجا ...
    ```
    ";

    $fullPrompt = $systemInstruction . "\n\nUser Request: " . $userMessage;
    $result = callGeminiAPI($fullPrompt);

    if (isset($result['error'])) {
        throw new Exception('خطای هوش مصنوعی: ' . $result['error']);
    }
    
    sendResponse(['reply' => $result['text']]);

} catch (Exception $e) {
    sendResponse(['error' => $e->getMessage()]);
}
?>