<?php
// gemini-chat.php
define('AZMA_ACCESS', true);
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");

// دریافت اطلاعات ارسالی
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);
$userMessage = isset($input['message']) ? trim($input['message']) : '';

if (empty($userMessage)) {
    echo json_encode(['error' => 'پیامی دریافت نشد.']);
    exit();
}

// محدودیت طول پیام
if (strlen($userMessage) > 2000) {
    echo json_encode(['error' => 'پیام بیش از حد طولانی است.']);
    exit();
}

// دستورالعمل ربات
$systemInstruction = "تو پشتیبان سایت 'ازما مارکتینگ' هستی. مدیر تو یاسین سالارناظم است. خدمات شما طراحی سایت و سئو در همدان است. کوتاه و دوستانه جواب بده.";

$fullPrompt = $systemInstruction . "\n\nکاربر پرسیده: " . $userMessage;
$result = callGeminiAPI($fullPrompt);

if (isset($result['error'])) {
    echo json_encode(['error' => $result['error']]);
} else {
    echo json_encode(['reply' => $result['text']]);
}
?>