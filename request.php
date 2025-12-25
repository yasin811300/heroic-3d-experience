<?php
session_start();

// --- تنظیمات زرین‌پال ---
$merchant_id = "3f14d25b-7441-4a3b-bd71-84f59003ea20"; 
$callback_url = "https://azmamarkteng.ir/verify.php";
$description = "سفارش خدمات دیجیتال مارکتینگ ازما";

// 1. دریافت مبلغ از لینک (به تومان)
// اگر مبلغی نبود، پیش‌فرض 50,000 تومان در نظر بگیر
$amount_toman = isset($_GET['amount']) ? intval($_GET['amount']) : 50000;

// جلوگیری از مبالغ زیر ۱۰۰۰ تومان
if ($amount_toman < 1000) {
    die("مبلغ نامعتبر است (حداقل ۱۰۰۰ تومان).");
}

// 2. تبدیل به ریال (زرین‌پال ریال می‌گیرد)
$amount_rial = $amount_toman * 10;

// 3. ذخیره مبلغ در سشن (برای امنیت در مرحله برگشت)
$_SESSION['payment_amount'] = $amount_rial;

// 4. ارسال به زرین‌پال
$data = array(
    "merchant_id" => $merchant_id,
    "amount" => $amount_rial,
    "callback_url" => $callback_url,
    "description" => $description,
    "metadata" => ["mobile" => $_SESSION['user_phone'] ?? "Guest"] // اگر لاگین بود شماره‌اش هم ثبت شود
);

$jsonData = json_encode($data);
$ch = curl_init('https://api.zarinpal.com/pg/v4/payment/request.json');
curl_setopt($ch, CURLOPT_USERAGENT, 'ZarinPal Rest Api v1');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($jsonData)
));

$result = curl_exec($ch);
$err = curl_error($ch);
$result = json_decode($result, true);
curl_close($ch);

if ($err) {
    echo "خطا در اتصال به درگاه: " . $err;
} else {
    if (isset($result['data']['code']) && $result['data']['code'] == 100) {
        // هدایت به درگاه بانک
        header('Location: https://www.zarinpal.com/pg/StartPay/' . $result['data']['authority']);
    } else {
        echo 'خطا در ایجاد تراکنش: ' . ($result['errors']['code'] ?? 'نامشخص');
        echo '<br>پیام: ' . ($result['errors']['message'] ?? 'نامشخص');
    }
}
?>