<?php
// debug_ai.php - تست اتصال به Gemini
define('AZMA_ACCESS', true);
require_once 'config.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

// فقط ادمین می‌تواند این صفحه را ببیند
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    die('دسترسی غیرمجاز. لطفا ابتدا وارد شوید.');
}

echo "<h1>تست اتصال به Gemini Pro:</h1>";

$result = callGeminiAPI("سلام، خودت را معرفی کن.");

if (isset($result['error'])) {
    echo "<h3 style='color:red'>❌ خطا: " . htmlspecialchars($result['error']) . "</h3>";
} else {
    echo "<h2 style='color:green'>✅ موفقیت‌آمیز!</h2>";
    echo "<div style='background:#e6fffa; padding:20px; border:1px solid green; border-radius:10px;'>";
    echo "<strong>پاسخ هوش مصنوعی:</strong><br>";
    echo htmlspecialchars($result['text']);
    echo "</div>";
}
?>