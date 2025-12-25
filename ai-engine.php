<?php
// موتور هوشمند تولید محتوا و تصویر - اختصاصی ازما
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
    $apiKey = "AIzaSyCUXMwx5VmStANuTs-faJa2emoRoBV8fdc"; // کلید شما
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;
    
    $prompt = $input['prompt'];
    $type = $input['type']; // blog, caption, ad
    
    $systemPrompt = "تو یک نویسنده خلاق و متخصص مارکتینگ هستی. زبان: فارسی.";
    if($type == 'blog') $systemPrompt .= " یک مقاله جامع و سئو شده با تگ‌های HTML (h2, p, ul) بنویس.";
    if($type == 'caption') $systemPrompt .= " یک کپشن اینستاگرام جذاب با ایموجی و هشتگ بنویس.";
    if($type == 'ad') $systemPrompt .= " یک متن تبلیغاتی کوتاه و کوبنده برای جذب مشتری بنویس.";

    $data = ["contents" => [["parts" => [["text" => $systemPrompt . "\n\nموضوع: " . $prompt]]]]];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        echo json_encode(['result' => $result['candidates'][0]['content']['parts'][0]['text']]);
    } else {
        echo json_encode(['error' => 'خطا در تولید متن']);
    }
    exit();
}

// --- 2. تولید تصویر (با Pollinations AI - رایگان و باکیفیت) ---
if ($action === 'generate_image') {
    $prompt = urlencode($input['prompt']);
    // افزودن کلمات کلیدی برای کیفیت بهتر
    $enhancedPrompt = $prompt . ", hyper realistic, 8k, highly detailed, cinematic lighting, professional photography";
    $imageUrl = "https://image.pollinations.ai/prompt/" . $enhancedPrompt . "?width=1024&height=1024&seed=" . rand(1, 9999);
    
    echo json_encode(['image_url' => $imageUrl]);
    exit();
}

// --- 3. ذخیره تصویر در هاست ---
if ($action === 'save_image') {
    $url = $input['url'];
    $filename = 'ai-gen-' . time() . '.jpg';
    $path = 'uploads/' . $filename;
    
    if (!is_dir('uploads')) mkdir('uploads', 0777, true);
    
    $imageContent = file_get_contents($url);
    if ($imageContent && file_put_contents($path, $imageContent)) {
        $conn->query("INSERT INTO gallery (image_path, prompt) VALUES ('$path', 'AI Generated')");
        echo json_encode(['success' => true, 'path' => $path]);
    } else {
        echo json_encode(['error' => 'خطا در ذخیره تصویر']);
    }
    exit();
}

// اگر هیچ اقدامی مطابقت نداشت
echo json_encode(['error' => 'عملیات نامعتبر']);
?>