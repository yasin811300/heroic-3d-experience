<?php
// فایل تست اتصال به آی‌نوتی
header('Content-Type: text/html; charset=utf-8');

// تنظیمات (طبق فایل auth.php شما)
$token = "T90luIgMv8Yiu34PsiVj701YF1pion0cpnYzzWDBLOQzeVu2al";
$sender = "9821746070";
$mobile = "09914601322"; // شماره خودت برای تست
$message = "تست پنل پیامک ازما - کد: 12345";

// آماده‌سازی آدرس و داده‌ها
$url = "https://api.inoti.com/api/v1/send-sms";

$data = array(
    "token" => $token,
    "sender" => $sender,
    "mobile" => $mobile,
    "message" => $message
);

// شروع اتصال CURL
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => http_build_query($data), // ارسال به صورت فرم دیتا
    CURLOPT_HTTPHEADER => array(
        "Cache-Control: no-cache"
    ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

echo "<h1>نتیجه تست ارسال پیامک:</h1>";

if ($err) {
    echo "<h3 style='color:red'>خطای اتصال (CURL Error):</h3>";
    echo "<pre>$err</pre>";
    echo "<p>نکته: اگر خطای SSL دیدید، مشکل از تنظیمات امنیتی هاست است.</p>";
} else {
    echo "<h3 style='color:blue'>پاسخ دریافتی از آی‌نوتی:</h3>";
    echo "<pre style='background:#eee; padding:10px; direction:ltr; text-align:left;'>$response</pre>";
    
    // تحلیل پاسخ
    $json = json_decode($response, true);
    
    if (isset($json['status']) && $json['status'] == 'success') {
        echo "<h2 style='color:green'>✅ پیامک با موفقیت به مخابرات تحویل شد!</h2>";
        echo "<p>اگر روی گوشی دریافت نکردید، احتمالاً شماره شما در لیست سیاه تبلیغاتی است.</p>";
    } else {
        echo "<h2 style='color:red'>❌ پیامک ارسال نشد! (کد خطا را در بالا بخوانید)</h2>";
        echo "<p>معمولاً خطای 'Unauthorized' یعنی توکن اشتباه است یا IP مسدود است.</p>";
        echo "<p>خطای 'Credit' یعنی شارژ ندارید.</p>";
    }
}
?>