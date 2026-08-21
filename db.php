<?php
// فایل db.php - اتصال به دیتابیس (اطلاعات حساس فقط از متغیرهای محیطی)
$servername = getenv('DB_HOST') ?: 'localhost';
$username   = getenv('DB_USER') ?: '';
$password   = getenv('DB_PASS') ?: '';
$dbname     = getenv('DB_NAME') ?: '';

if ($username === '' || $dbname === '') {
    die('پیکربندی دیتابیس ناقص است. متغیرهای محیطی DB_USER / DB_PASS / DB_NAME را تنظیم کنید.');
}

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    error_log('DB connect error: ' . $conn->connect_error);
    die('خطا در اتصال به دیتابیس.');
}
?>
