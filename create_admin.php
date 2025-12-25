<?php
require 'db.php';

 $username = 'admin';
 $password = password_hash('your_password', PASSWORD_DEFAULT);
 $name = 'ادمین سیستم';

 $stmt = $conn->prepare("INSERT INTO admins (name, username, password) VALUES (?, ?, ?)");
 $stmt->execute([$name, $username, $password]);

echo "کاربر ادمین با موفقیت ایجاد شد!<br>";
echo "نام کاربری: admin<br>";
echo "رمز عبور: your_password<br>";
echo "<strong>لطفاً این فایل را بعد از اجرا حذف کنید!</strong>";
?>