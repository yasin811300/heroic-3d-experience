<?php
// فایل عیب‌یابی (نسخه اصلاح شده)
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

$apiKey = "AIzaSyCUXMwx5VmStANuTs-faJa2emoRoBV8fdc";
// تغییر مدل به gemini-pro
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" . $apiKey;

$data = ["contents" => [["parts" => [["text" => "سلام، خودت را معرفی کن."]]]]];

echo "<h1>تست مجدد اتصال به Gemini Pro:</h1>";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo "<h3 style='color:red'>خطای CURL: $curlError</h3>";
} else {
    $json = json_decode($response, true);
    if(isset($json['candidates'][0]['content']['parts'][0]['text'])) {
        echo "<h2 style='color:green'>✅ موفقیت‌آمیز!</h2>";
        echo "<div style='background:#e6fffa; padding:20px; border:1px solid green; border-radius:10px;'>";
        echo "<strong>پاسخ هوش مصنوعی:</strong><br>";
        echo $json['candidates'][0]['content']['parts'][0]['text'];
        echo "</div>";
    } else {
        echo "<h3 style='color:red'>❌ خطای گوگل:</h3>";
        echo "<pre>" . print_r($json, true) . "</pre>";
    }
}
?>