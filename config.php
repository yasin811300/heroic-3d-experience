<?php
/**
 * فایل تنظیمات امن - ازما مارکتینگ
 * تمام کلیدهای API باید در این فایل ذخیره شوند
 * 
 * مهم: این فایل را در .htaccess محدود کنید تا از دسترسی مستقیم جلوگیری شود
 */

// جلوگیری از دسترسی مستقیم
if (!defined('AZMA_ACCESS')) {
    die('دسترسی مستقیم مجاز نیست');
}

// کلید API گوگل Gemini - فقط از متغیر محیطی خوانده می‌شود
// هیچ کلیدی نباید در سورس کد قرار بگیرد
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');


// مدل پیش‌فرض Gemini
define('GEMINI_MODEL', 'gemini-2.0-flash');

// آدرس پایه API گوگل
define('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1beta/models/');

/**
 * دریافت URL کامل API برای یک مدل خاص
 */
function getGeminiApiUrl($model = null) {
    $model = $model ?: GEMINI_MODEL;
    return GEMINI_API_URL . $model . ':generateContent?key=' . GEMINI_API_KEY;
}

/**
 * ارسال درخواست به Gemini با مدیریت خطا
 */
function callGeminiAPI($prompt, $model = null) {
    $url = getGeminiApiUrl($model);
    
    $data = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $prompt]
                ]
            ]
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    // Enable SSL verification for security (prevents MITM attacks)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($error) {
        return ['error' => 'CURL Error: ' . $error];
    }
    
    $result = json_decode($response, true);
    
    if ($httpCode !== 200) {
        $msg = $result['error']['message'] ?? 'خطای ناشناخته';
        return ['error' => "Google API Error ($httpCode): $msg"];
    }
    
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        return ['success' => true, 'text' => $result['candidates'][0]['content']['parts'][0]['text']];
    }
    
    return ['error' => 'ساختار پاسخ نامعتبر است'];
}
?>