<?php
// موتور هوشمند تولید محتوا و تصویر - اختصاصی ازما
define('AZMA_ACCESS', true);
require_once 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json; charset=utf-8');
set_time_limit(120);

// امنیت
if (!isset($_SESSION['admin_logged_in'])) {
    echo json_encode(['error' => 'دسترسی غیرمجاز']);
    exit();
}

require 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

// --- 1. تولید متن (با Gemini) ---
if ($action === 'generate_text') {
    $prompt = isset($input['prompt']) ? trim($input['prompt']) : '';
    $type = isset($input['type']) ? $input['type'] : 'blog';
    
    if (empty($prompt) || strlen($prompt) > 1000) {
        echo json_encode(['error' => 'پرامپت نامعتبر است']);
        exit();
    }
    
    $systemPrompt = "تو یک نویسنده خلاق و متخصص مارکتینگ هستی. زبان: فارسی.";
    if($type == 'blog') $systemPrompt .= " یک مقاله جامع و سئو شده با تگ‌های HTML (h2, p, ul) بنویس.";
    if($type == 'caption') $systemPrompt .= " یک کپشن اینستاگرام جذاب با ایموجی و هشتگ بنویس.";
    if($type == 'ad') $systemPrompt .= " یک متن تبلیغاتی کوتاه و کوبنده برای جذب مشتری بنویس.";

    $result = callGeminiAPI($systemPrompt . "\n\nموضوع: " . $prompt);
    
    if (isset($result['error'])) {
        echo json_encode(['error' => 'خطا در تولید متن: ' . $result['error']]);
    } else {
        echo json_encode(['result' => $result['text']]);
    }
    exit();
}

// --- 2. تولید تصویر (با Pollinations AI) ---
if ($action === 'generate_image') {
    $prompt = isset($input['prompt']) ? trim($input['prompt']) : '';
    
    if (empty($prompt) || strlen($prompt) > 500) {
        echo json_encode(['error' => 'پرامپت تصویر نامعتبر است']);
        exit();
    }
    
    $encodedPrompt = urlencode($prompt);
    $enhancedPrompt = $encodedPrompt . ", hyper realistic, 8k, highly detailed, cinematic lighting, professional photography";
    $imageUrl = "https://image.pollinations.ai/prompt/" . $enhancedPrompt . "?width=1024&height=1024&seed=" . rand(1, 9999);
    
    echo json_encode(['image_url' => $imageUrl]);
    exit();
}

// --- 3. ذخیره تصویر در هاست ---
if ($action === 'save_image') {
    $url = isset($input['url']) ? filter_var($input['url'], FILTER_VALIDATE_URL) : '';
    
    if (!$url) {
        echo json_encode(['error' => 'آدرس تصویر نامعتبر است']);
        exit();
    }
    
    $filename = 'ai-gen-' . time() . '.jpg';
    $path = 'uploads/' . $filename;
    
    if (!is_dir('uploads')) mkdir('uploads', 0755, true);
    
    $imageContent = @file_get_contents($url);
    if ($imageContent && file_put_contents($path, $imageContent)) {
        // استفاده از prepared statement
        $stmt = $conn->prepare("INSERT INTO gallery (image_path, prompt) VALUES (?, ?)");
        $promptText = 'AI Generated';
        $stmt->bind_param("ss", $path, $promptText);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode(['success' => true, 'path' => $path]);
    } else {
        echo json_encode(['error' => 'خطا در ذخیره تصویر']);
    }
    exit();
}

// اگر هیچ اقدامی مطابقت نداشت
echo json_encode(['error' => 'عملیات نامعتبر']);
?>