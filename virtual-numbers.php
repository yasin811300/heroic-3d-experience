<?php
session_start();
require 'db.php';

/* ========== تنظیمات اولیه ========== */
$apiKey      = '0RAUgyf4gQ8xdWE7kv8eXK4r743jUu4tDstdj109'; // کلید شیزنامبر
$base        = 'https://api.shiznumber.com/api/';
$pageTitle   = 'شماره‌های مجازی | آژانس دیجیتال مارکتینگ ازما';
$pageDesc    = 'خرید آنی شماره مجازی برای تلگرام، واتس‌اپ، اینستاگرام و سایر سرویس‌ها | تحویل فوری، قیمت مناسب، پشتیبانی ۲۴ ساعته';

/* ========== دریافت لیست اولیه ========== */
$countries = json_decode(@file_get_contents($base.'countries', false, stream_context_create([
    'http' => ['header' => "X-API-KEY: $apiKey\r\nAccept: application/json"]
])), true) ?: [];

$services  = json_decode(@file_get_contents($base.'services', false, stream_context_create([
    'http' => ['header' => "X-API-KEY: $apiKey\r\nAccept: application/json"]
])), true) ?: [];

/* ========== خرید شماره ========== */
$order = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['buy'])) {
    $numberId = (int)$_POST['number_id'];
    $res = json_decode(@file_get_contents($base."numbers/$numberId", false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "X-API-KEY: $apiKey\r\nAccept: application/json\r\nContent-Type: application/json",
            'content' => json_encode([])
        ]
    ])), true);
    if (isset($res['order'])) $order = $res;
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <meta name="description" content="<?= $pageDesc ?>">
    <meta name="author" content="آژانس دیجیتال مارکتینگ ازما">
    <style>
        :root{--primary:#f59e0b;--dark:#0f2027;--light:#e0f7fa;--radius:24px}
        body{background:linear-gradient(to bottom,var(--dark),#203a43);color:var(--light);font-family:'Vazirmatn';margin:0;padding:40px 15px;text-align:center}
        .container{max-width:1200px;margin:0 auto;padding:0 15px}
        .reveal{opacity:0;transform:translateY(30px);transition:opacity .8s,transform .8s}
        .reveal.active{opacity:1;transform:translateY(0)}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:50px;font-weight:700;border:none;cursor:pointer;transition:.3s}
        .btn-primary{background:linear-gradient(45deg,var(--primary),#ff7e5f);color:#000;box-shadow:0 15px 40px rgba(245,158,11,.5)}
        .btn-primary:hover{transform:translateY(-3px)}
        .card{background:rgba(255,255,255,.05);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:30px;margin:30px auto}
        .grid{display:grid;gap:1.5rem}
        .grid-cols-1{grid-template-columns:1fr}
        .grid-cols-2{grid-template-columns:repeat(2,1fr)}
        @media(max-width:768px){.grid-cols-2{grid-template-columns:1fr}}
        header{background:rgba(15,32,39,.95);backdrop-filter:blur(15px);position:fixed;width:100%;top:0;z-index:1000;border-bottom:1px solid rgba(255,255,255,.05)}
        .skip-link{position:absolute;top:-40px;left:6px;background:var(--primary);color:#000;padding:8px;text-decoration:none;border-radius:4px;z-index:9999;transition:top .3s}.skip-link:focus{top:6px}
        /* اسلایدر شماره‌ها */
        .slider-container{position:relative;overflow:hidden;border-radius:24px;background:rgba(0,0,0,.3);padding:10px}
        .slider-track{display:flex;gap:15px;transition:transform .5s ease}
        .slide{min-width:280px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px;text-align:center}
        .slide img{height:120px;object-fit:cover;margin:0 auto 10px}
        .slide h4{font-size:1.1rem;color:var(--primary);margin-bottom:6px}
        .slide p{font-size:.85rem;color:#cbd5e1;margin-bottom:10px}
        .slider-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:none;color:#fff;font-size:1.5rem;width:40px;height:40px;border-radius:50%;cursor:pointer;transition:.3s}
        .slider-btn:hover{background:var(--primary)}
        .prev{left:10px}.next{right:10px}
        /* نتیجه خرید */
        .result-card{background:rgba(0,0,0,.4);border:1px solid var(--primary);border-radius:24px;padding:25px;margin-top:30px;text-align:right}
        .result-card h3{font-size:1.4rem;color:var(--primary);margin-bottom:10px}
        .result-card p{margin:6px 0;font-size:1rem}
        .copy-section{display:flex;gap:10px;margin-top:15px}
        .copy-input{flex:1;padding:10px;border-radius:12px;border:none;background:#fff;color:#000;font-family:'Vazirmatn'}
        .copy-btn{flex-shrink:0}
        .timer{font-size:1.1rem;color:var(--primary);margin-top:10px}
        .progress-bar{height:6px;background:rgba(255,255,255,.1);border-radius:3px;margin-top:8px;overflow:hidden}
        .progress-fill{height:100%;background:var(--primary);width:100%;transition:width 1s linear}
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">ردیف به محتوای اصلی</a>

    <!-- Header -->
    <header>
        <div class="container">
            <a href="index.php" class="logo">
                <img src="https://azmamarkteng.ir/logo.png" alt="لوگوی ازما">
                <span>آژانس ازما</span>
            </a>
            <nav>
                <ul>
                    <li><a href="index.php">خانه</a></li>
                    <li><a href="services.php">خدمات</a></li>
                    <li><a href="virtual-numbers.php" class="active">شماره مجازی</a></li>
                    <li><a href="contact.php">تماس</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main id="main-content" role="main">
        <!-- Hero -->
        <section class="hero reveal">
            <div class="container">
                <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6">شماره مجازی <span class="text-[#f59e0b]">طلایی</span></h1>
                <p class="text-gray-300 text-lg max-w-3xl mx-auto mb-8">دیگه نمی‌خوای شماره واقعیت دست همه باشه! امن، سریع، ارزان – فقط با یک کلیک</p>
                <a href="#buy" class="btn btn-primary">خرید فوری</a>
            </div>
        </section>

        <!-- چرا بخریم؟ (زبان خودمونی) -->
        <section class="py-20" aria-labelledby="why-title">
            <div class="container">
                <h2 id="why-title" class="text-3xl font-bold text-center text-white mb-12">چرا باید شماره مجازی بخرم؟</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="glass-card p-6"><h3 class="text-lg font-bold text-[#f59e0b] mb-2">۱. امنیت شخصی</h3><p class="text-gray-400 text-sm">شماره واقعیت رو فقط به کسایی بدی که لازم دارن؛ بقیه رو با مجازی راه بده.</p></div>
                    <div class="glass-card p-6"><h3 class="text-lg font-bold text-[#f59e0b] mb-2">۲. اکانت‌های متنوع</h3><p class="text-gray-400 text-sm">برند شخصی؟ اکانت بیزینسی؟ همشو با شماره مجازی بساز؛ بدون دردسر، بدون هزینه اضافه.</p></div>
                    <div class="glass-card p-6"><h3 class="text-lg font-bold text-[#f59e0b] mb-2">۳. حریم خصوصی</h3><p class="text-gray-400 text-sm">دیگه کسی نمی‌فهمه شماره اصلیت چیه؛ پیامک تبلیغاتی هم نمی‌رسه.</p></div>
                    <div class="glass-card p-6"><h3 class="text-lg font-bold text-[#f59e0b] mb-2">۴. تحویل فوری</h3><p class="text-gray-400 text-sm">کد تأیید رو در کمتر از ۱۰ ثانیه تحویل بگیر؛ بدون معطلی، بدون تماس.</p></div>
                </div>
            </div>
        </section>

        <!-- فرم خرید + اسلایدر شماره‌ها -->
        <section id="buy" class="py-20" aria-labelledby="buy-title">
            <div class="container">
                <h2 id="buy-title" class="text-3xl font-bold text-center text-white mb-12">خرید شماره مجازی</h2>

                <!-- فرم انتخاب -->
                <div class="card reveal">
                    <form method="post" id="buyForm">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="form-group"><label for="country">کشور</label><select name="country" id="country" required><?php foreach ($countries as $c): ?><option value="<?= htmlspecialchars($c['slug']) ?>"><?= htmlspecialchars($c['fa_name']) ?></option><?php endforeach; ?></select></div>
                            <div class="form-group"><label for="service">سرویس</label><select name="service" id="service" required"><?php foreach ($services as $s): ?><option value="<?= htmlspecialchars($s['slug']) ?>"><?= htmlspecialchars($s['fa_name']) ?></option><?php endforeach; ?></select></div>
                        </div>
                        <button type="button" id="loadNumbersBtn" class="btn btn-primary">نمایش شماره‌ها</button>
                    </form>

                    <!-- اسلایدر شماره‌ها -->
                    <div id="numbersSlider" class="slider-container reveal" style="display:none;">
                        <div class="slider-track" id="sliderTrack"></div>
                        <button class="slider-btn prev" aria-label="شماره قبلی">‹</button>
                        <button class="slider-btn next" aria-label="شماره بعدی">›</button>
                    </div>
                </div>

                <!-- نتیجه خرید -->
                <?php if ($order && isset($order['order'])): ?>
                    <div class="card result-card reveal">
                        <h3>🎉 شماره شما آماده است!</h3>
                        <p><strong>شماره:</strong> <span id="numText"><?= htmlspecialchars($order['order']['ordered_number']) ?></span></p>
                        <p><strong>کد تأیید:</strong> <span id="codeText"><?= htmlspecialchars($order['order']['sms_code']) ?></span></p>
                        <div class="copy-section"><input type="text" class="copy-input" value="<?= htmlspecialchars($order['order']['sms_code']) ?>" readonly><button class="copy-btn" onclick="copyCode()">کپی</button></div>
                        <p class="timer" id="timer">کد در ۱۸۰ ثانیه منقضی می‌شود</p>
                        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
                    </div>
                <?php endif; ?>
            </div>
        </section>

        <!-- JS Inline -->
        <script>
            /* ========== اسلایدر شماره‌ها ========== */
            const loadBtn      = document.getElementById('loadNumbersBtn');
            const sliderTrack  = document.getElementById('sliderTrack');
            const prevBtn      = document.querySelector('.prev');
            const nextBtn      = document.querySelector('.next');
            const apiKey       = '<?= $apiKey ?>';
            const base         = 'https://api.shiznumber.com/api/';
            let currentSlide   = 0;
            let slidesData     = [];

            loadBtn.addEventListener('click', async () => {
                const country = document.getElementById('country').value;
                const service = document.getElementById('service').value;
                const url     = `${base}countries/${country}/numbers`;

                try {
                    const res   = await fetch(url, { headers: { 'X-API-KEY': apiKey, 'Accept': 'application/json' } });
                    const data  = await res.json();
                    slidesData  = data;
                    renderSlides();
                    document.getElementById('numbersSlider').style.display = 'block';
                    startAutoSlide();
                } catch (e) {
                    alert('خطا در دریافت اطلاعات');
                }
            });

            function renderSlides() {
                sliderTrack.innerHTML = '';
                slidesData.forEach(n => {
                    const slide = document.createElement('div');
                    slide.className = 'slide';
                    slide.innerHTML = `
                        <img src="${n.service.img}" alt="${n.service.fa_name}">
                        <h4>${n.country.fa_name} - ${n.service.fa_name}</h4>
                        <p>قیمت: ${n.price.toLocaleString('fa-IR')} تومان</p>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="number_id" value="${n.id}">
                            <button type="submit" name="buy" class="btn btn-primary">خرید</button>
                        </form>
                    `;
                    sliderTrack.appendChild(slide);
                });
                currentSlide = 0;
            }

            function startAutoSlide() {
                setInterval(() => {
                    currentSlide = (currentSlide + 1) % slidesData.length;
                    updateSlider();
                }, 4000);
            }

            function updateSlider() {
                const offset = -currentSlide * (280 + 15);
                sliderTrack.style.transform = `translateX(${offset}px)`;
            }

            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
                updateSlider();
            });

            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slidesData.length;
                updateSlider();
            });

            /* ========== کپی کد ========== */
            function copyCode() {
                const code = document.getElementById('codeText').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    alert('کد کپی شد!');
                });
            }

            /* ========== تایمر پیشرفته ========== */
            let timeLeft = 180;
            const timerEl = document.getElementById('timer');
            const progressEl = document.getElementById('progressFill');

            if (timerEl) {
                const interval = setInterval(() => {
                    timeLeft--;
                    timerEl.textContent = `کد در ${timeLeft} ثانیه منقضی می‌شود`;
                    progressEl.style.width = `${(timeLeft / 180) * 100}%`;
                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        timerEl.textContent = 'کد منقضی شد - دوباره تلاش کنید';
                        progressEl.style.width = '0%';
                    }
                }, 1000);
            }

            /* ========== اسکرول روان ========== */
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
                });
            });

            /* ========== Scroll Reveal ========== */
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('active');
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        </script>
</body>
</html>