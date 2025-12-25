<?php
session_start();
// بررسی لاگین بودن مدیر
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: login.php");
    exit();
}

$message = "";

// --- تابع ذخیره عکس ---
if (isset($_POST['save_image'])) {
    $imageUrl = $_POST['image_url'];
    $filename = 'ai-' . time() . '.jpg'; // اسم فایل رندوم
    
    // ساخت پوشه uploads اگر نباشد
    if (!is_dir('uploads')) { mkdir('uploads', 0755, true); }
    
    // دانلود و ذخیره
    $content = file_get_contents($imageUrl);
    if ($content) {
        file_put_contents('uploads/' . $filename, $content);
        $message = "<div class='bg-green-600 text-white p-4 rounded-xl mb-6'>✅ عکس با موفقیت ذخیره شد!<br>لینک عکس: <b>uploads/$filename</b></div>";
    } else {
        $message = "<div class='bg-red-600 text-white p-4 rounded-xl mb-6'>❌ خطا در ذخیره عکس.</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تصویرساز هوشمند | ازما</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&display=swap');
        body { font-family: 'Vazirmatn', sans-serif; background: #1a202c; color: white; }
        .glass { background: #2d3748; border: 1px solid #4a5568; border-radius: 20px; }
        .btn { background: linear-gradient(45deg, #f59e0b, #ff7e5f); color: white; padding: 10px 30px; border-radius: 10px; font-weight: bold; transition: 0.3s; }
        .btn:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }
        input { background: #171923; border: 1px solid #4a5568; color: white; padding: 15px; rounded-xl; width: 100%; outline: none; }
        input:focus { border-color: #f59e0b; }
    </style>
</head>
<body class="p-4 md:p-10">

    <div class="max-w-4xl mx-auto">
        
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-pink-500"><i class="fas fa-paint-brush"></i> تصویرساز هوشمند AI</h1>
            <a href="admin-panel.php" class="text-gray-400 hover:text-white"><i class="fas fa-arrow-left"></i> بازگشت به پنل</a>
        </div>

        <?php echo $message; ?>

        <div class="glass p-8 mb-8">
            <label class="block mb-4 text-lg text-gray-300">توصیف عکس (به انگلیسی بهتر نتیجه می‌دهد):</label>
            <div class="flex gap-4 flex-col md:flex-row">
                <input type="text" id="prompt" placeholder="مثلاً: A futuristic neon office, 8k resolution, cyberpunk style">
                <button onclick="generateImage()" id="gen-btn" class="btn w-full md:w-auto whitespace-nowrap">
                    <i class="fas fa-magic"></i> ساخت تصویر
                </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">* پیشنهاد: از کلماتی مثل 8k, realistic, lighting استفاده کنید.</p>
        </div>

        <div id="result-area" class="hidden text-center">
            <div class="glass p-4 inline-block relative group">
                <img id="ai-image" src="" class="rounded-xl max-h-[500px] shadow-2xl border-2 border-white/10">
                
                <div class="mt-4 flex justify-center gap-4">
                    <form method="POST">
                        <input type="hidden" name="image_url" id="hidden-url">
                        <button name="save_image" class="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                            <i class="fas fa-save"></i> ذخیره در هاست
                        </button>
                    </form>
                    
                    <a id="dl-link" href="#" target="_blank" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                        <i class="fas fa-download"></i> دانلود مستقیم
                    </a>
                </div>
            </div>
        </div>

    </div>

    <script>
        function generateImage() {
            const prompt = document.getElementById('prompt').value;
            const btn = document.getElementById('gen-btn');
            const resultArea = document.getElementById('result-area');
            const img = document.getElementById('ai-image');
            const hiddenUrl = document.getElementById('hidden-url');
            const dlLink = document.getElementById('dl-link');

            if (!prompt) return alert('لطفاً توصیف عکس را بنویسید!');

            // حالت لودینگ
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ساخت...';
            btn.disabled = true;
            resultArea.classList.add('hidden');

            // ساخت لینک هوشمند (Pollinations AI)
            // اضافه کردن سید رندوم برای اینکه هر دفعه عکس جدید بده
            const randomSeed = Math.floor(Math.random() * 10000);
            const finalPrompt = encodeURIComponent(prompt);
            const imageUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=1024&height=1024&seed=${randomSeed}&nologo=true`;

            // بارگذاری عکس
            img.src = imageUrl;
            
            img.onload = function() {
                btn.innerHTML = '<i class="fas fa-magic"></i> ساخت تصویر';
                btn.disabled = false;
                resultArea.classList.remove('hidden');
                
                // تنظیم مقادیر برای ذخیره
                hiddenUrl.value = imageUrl;
                dlLink.href = imageUrl;
            };

            img.onerror = function() {
                alert('خطا در دریافت تصویر. لطفا دوباره تلاش کنید.');
                btn.innerHTML = '<i class="fas fa-magic"></i> ساخت تصویر';
                btn.disabled = false;
            };
        }
    </script>

</body>
</html>