<?php
session_start();

$merchant_id = "3f14d25b-7441-4a3b-bd71-84f59003ea20"; 
$authority = $_GET['Authority'];
$status = $_GET['Status'];

// بازیابی مبلغ واقعی از سشن (جلوگیری از هک)
$amount_rial = isset($_SESSION['payment_amount']) ? $_SESSION['payment_amount'] : 0;
$amount_toman = $amount_rial / 10;

// پاک کردن سشن بعد از خواندن (برای جلوگیری از تکرار)
// unset($_SESSION['payment_amount']); // فعلاً کامنت کردم تا اگر رفرش کردی ارور نده

?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نتیجه پرداخت | آژانس ازما</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&display=swap');
        body { font-family: 'Vazirmatn', sans-serif; background: #0f2027; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; text-align: center; max-width: 500px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    </style>
</head>
<body>

    <div class="glass-card">
        <?php if ($status == 'OK' && $amount_rial > 0): ?>
            <?php
            // بررسی نهایی با زرین‌پال
            $data = array("merchant_id" => $merchant_id, "authority" => $authority, "amount" => $amount_rial);
            $jsonData = json_encode($data);
            
            $ch = curl_init('https://api.zarinpal.com/pg/v4/payment/verify.json');
            curl_setopt($ch, CURLOPT_USERAGENT, 'ZarinPal Rest Api v1');
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length: ' . strlen($jsonData)));
            
            $result = curl_exec($ch);
            $result = json_decode($result, true);
            curl_close($ch);
            
            if (isset($result['data']['code']) && $result['data']['code'] == 100): 
            ?>
                <div class="text-green-400 text-6xl mb-4"><i class="fas fa-check-circle"></i></div>
                <h1 class="text-2xl font-bold mb-2">پرداخت موفقیت‌آمیز بود!</h1>
                <p class="text-gray-400 mb-6">سفارش شما با موفقیت ثبت شد.</p>
                
                <div class="bg-white/10 rounded-xl p-4 mb-6 text-sm space-y-2 border border-white/5">
                    <div class="flex justify-between"><span>کد پیگیری:</span> <span class="font-mono font-bold text-yellow-400"><?php echo $result['data']['ref_id']; ?></span></div>
                    <div class="flex justify-between"><span>مبلغ پرداختی:</span> <span><?php echo number_format($amount_toman); ?> تومان</span></div>
                </div>
                
                <a href="dashboard.php" class="bg-green-600 hover:bg-green-500 text-white py-3 px-8 rounded-full font-bold transition block w-full">ورود به داشبورد</a>

            <?php else: ?>
                <div class="text-yellow-500 text-6xl mb-4"><i class="fas fa-exclamation-triangle"></i></div>
                <h1 class="text-2xl font-bold mb-2">تراکنش ناموفق</h1>
                <p class="text-gray-400 mb-6">کد خطا: <?php echo $result['errors']['code'] ?? 'نامشخص'; ?></p>
                <a href="index.html" class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-full font-bold transition block w-full">بازگشت به سایت</a>
            <?php endif; ?>

        <?php else: ?>
            <div class="text-red-500 text-6xl mb-4"><i class="fas fa-times-circle"></i></div>
            <h1 class="text-2xl font-bold mb-2">پرداخت لغو شد</h1>
            <p class="text-gray-400 mb-6">شما عملیات پرداخت را ناتمام گذاشتید.</p>
            <a href="index.html" class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-full font-bold transition block w-full">بازگشت به سایت</a>
        <?php endif; ?>
    </div>

</body>
</html>