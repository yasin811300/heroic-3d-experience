<?php
header('Content-Type: text/html; charset=utf-8');

// کلید خودت
$apiKey = "AIzaSyCUXMwx5VmStANuTs-faJa2emoRoBV8fdc";
// آدرسی که لیست مدل‌ها رو میده
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $apiKey;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

echo "<h1>لیست مدل‌های فعال برای کلید شما:</h1>";
echo "<p>در حال پرسش از گوگل...</p>";

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo "<h3 style='color:red'>خطای اتصال: $err</h3>";
} else {
    $data = json_decode($response, true);
    
    if (isset($data['models'])) {
        echo "<ul style='background:#eee; padding:20px; font-family:sans-serif;'>";
        foreach ($data['models'] as $model) {
            // فقط مدل‌هایی که قابلیت تولید محتوا دارند رو نشون بده
            if (in_array("generateContent", $model['supportedGenerationMethods'])) {
                echo "<li style='margin-bottom:10px; color:green; font-weight:bold;'>" . $model['name'] . "</li>";
            }
        }
        echo "</ul>";
        echo "<pre style='direction:ltr; text-align:left;'>" . print_r($data, true) . "</pre>";
    } else {
        echo "<h3 style='color:red'>گوگل لیست نداد (شاید کلید محدود است):</h3>";
        echo "<pre>" . $response . "</pre>";
    }
}
?>