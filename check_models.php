<?php
// check_models.php - لیست مدل‌های فعال
define('AZMA_ACCESS', true);
require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

// فقط ادمین می‌تواند این صفحه را ببیند
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    die('دسترسی غیرمجاز. لطفا ابتدا وارد شوید.');
}

$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . GEMINI_API_KEY;

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
    echo "<h3 style='color:red'>خطای اتصال: " . htmlspecialchars($err) . "</h3>";
} else {
    $data = json_decode($response, true);
    
    if (isset($data['models'])) {
        echo "<ul style='background:#eee; padding:20px; font-family:sans-serif;'>";
        foreach ($data['models'] as $model) {
            if (in_array("generateContent", $model['supportedGenerationMethods'])) {
                echo "<li style='margin-bottom:10px; color:green; font-weight:bold;'>" . htmlspecialchars($model['name']) . "</li>";
            }
        }
        echo "</ul>";
    } else {
        echo "<h3 style='color:red'>گوگل لیست نداد (شاید کلید محدود است)</h3>";
    }
}
?>