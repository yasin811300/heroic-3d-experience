<?php
// gemini-chat.php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");

// دریافت اطلاعات ارسالی
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);
$userMessage = $input['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(['error' => 'پیامی دریافت نشد.']);
    exit();
}

// --- تنظیمات امنیتی و کلید ---
// یاسین جان حتما چک کن این کلید معتبر باشه
$apiKey = "AIzaSyCUXMwx5VmStANuTs-faJa2emoRoBV8fdc"; 
$model = "gemini-2.0-flash"; // یا "gemini-1.5-flash"
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . $apiKey;

// دستورالعمل ربات
$systemInstruction = "تو پشتیبان سایت 'ازما مارکتینگ' هستی. مدیر تو یاسین سالارناظم است. خدمات شما طراحی سایت و سئو در همدان است. کوتاه و دوستانه جواب بده.";

$data = [
    "contents" => [
        [
            "parts" => [
                ["text" => $systemInstruction . "\n\nکاربر پرسیده: " . $userMessage]
            ]
        ]
    ]
];

// ارسال درخواست به گوگل
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // برای هاست‌های ایران یا گواهی‌های قدیمی
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode(['error' => 'CURL Error: ' . $curlError]);
    exit();
}

$result = json_decode($response, true);

if ($httpCode !== 200) {
    $msg = $result['error']['message'] ?? 'خطای ناشناخته از سمت گوگل';
    echo json_encode(['error' => "Google API Error (Code $httpCode): $msg"]);
    exit();
}

if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
    $reply = $result['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['reply' => $reply]);
} else {
    echo json_encode(['error' => 'ساختار پاسخ گوگل تغییر کرده یا محتوا بلاک شده است.']);
}
?>