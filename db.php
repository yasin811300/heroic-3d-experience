<?php
// فایل db.php - اتصال به دیتابیس
 $servername = "localhost";
 $username = "mzqdhyau_azma_db"; 
 $password = "Yasin@811300"; 
 $dbname = "mzqdhyau_azma_db"; 

// ایجاد اتصال
 $conn = new mysqli($servername, $username, $password, $dbname);
 $conn->set_charset("utf8mb4"); // پشتیبانی کامل از فارسی

// بررسی اتصال (اگر خطا داد، نشون بده)
if ($conn->connect_error) {
    die("خطا در اتصال به دیتابیس: " . $conn->connect_error);
}
?>