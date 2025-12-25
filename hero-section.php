<?php
// این فایل رو می‌تونید در صفحه اصلی اینکلود کنید
// یا مستقیماً کدش رو در index.php قرار بدید
?>

<!-- Hero Section -->
<section class="hero">
    <div class="hero-background">
        <div class="hero-layer bull-layer">
            <img src="Gemini_Generated_Image_a6hud2a6hud2a6hu.png" alt="قدرت و رشد دیجیتال" class="hero-image">
        </div>
        <div class="hero-layer team-layer">
            <img src="Rectangle%201.png" alt="تیم متخصص دیجیتال مارکتینگ" class="hero-image">
        </div>
    </div>
    
    <div class="hero-content">
        <div class="hero-text">
            <h1 class="hero-title">
                <span class="title-line">قدرت فردی</span>
                <span class="title-line">+</span>
                <span class="title-line">تیم حرفه‌ای</span>
            </h1>
            <p class="hero-subtitle">
                با ترکیب استراتژی‌های قدرتمند و تیمی از متخصصان خلاق، 
                کسب‌وکار شما را به اوج می‌رسانیم
            </p>
            <div class="hero-buttons">
                <a href="#services" class="btn-primary">مشاهده خدمات</a>
                <a href="#about" class="btn-secondary">درباره ما</a>
            </div>
        </div>
        
        <div class="hero-features">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-bull"></i>
                </div>
                <h3>قدرت و پایداری</h3>
                <p>استراتژی‌های محکم و نتایج ماندگار</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>تیم متخصص</h3>
                <p>متخصصان با تجربه در زمینه‌های مختلف</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <h3>نوآوری مستمر</h3>
                <p>راهکارهای خلاقانه و به‌روز</p>
            </div>
        </div>
    </div>
    
    <div class="scroll-indicator">
        <div class="scroll-mouse">
            <div class="mouse-wheel"></div>
        </div>
        <span>اسکرول کنید</span>
    </div>
</section>

<style>
/* Hero Section Styles */
.hero {
    position: relative;
    height: 100vh;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%);
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.hero-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 1s ease;
}

.hero-image {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
    transition: all 1s ease;
}

.bull-layer {
    opacity: 1;
    transform: scale(1);
}

.team-layer {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 1200px;
    padding: 0 20px;
    animation: fadeInUp 1s ease;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: white;
    line-height: 1.2;
}

.title-line {
    display: block;
    margin: 0.5rem 0;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease forwards;
}

.title-line:nth-child(1) { animation-delay: 0.2s; }
.title-line:nth-child(2) { animation-delay: 0.4s; }
.title-line:nth-child(3) { animation-delay: 0.6s; }

.hero-subtitle {
    font-size: 1.3rem;
    color: #b0bec5;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0;
    animation: fadeInUp 0.8s ease 0.8s forwards;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    opacity: 0;
    animation: fadeInUp 0.8s ease 1s forwards;
}

.hero-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease forwards;
}

.feature-card:nth-child(1) { animation-delay: 1.2s; }
.feature-card:nth-child(2) { animation-delay: 1.4s; }
.feature-card:nth-child(3) { animation-delay: 1.6s; }

.feature-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary);
}

.feature-icon {
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.feature-card p {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.6;
}

.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    text-align: center;
    color: #94a3b8;
    font-size: 0.9rem;
    animation: bounce 2s infinite;
}

.scroll-mouse {
    width: 30px;
    height: 50px;
    border: 2px solid #94a3b8;
    border-radius: 15px;
    margin: 0 auto 10px;
    position: relative;
}

.mouse-wheel {
    width: 6px;
    height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    animation: scrollWheel 2s infinite;
}

/* Animations */
@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(-10px);
    }
    60% {
        transform: translateX(-50%) translateY(-5px);
    }
}

@keyframes scrollWheel {
    0% {
        top: 10px;
        opacity: 1;
    }
    100% {
        top: 30px;
        opacity: 0;
    }
}

/* Scroll Effect */
.hero.scrolled .bull-layer {
    opacity: 0;
    transform: scale(0.8) translateY(-50px);
}

.hero.scrolled .team-layer {
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .hero-features {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .feature-card {
        padding: 1.5rem;
    }
}
</style>

<script>
// Hero Section Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const scrollPercentage = scrolled / heroHeight;
        
        // Add class when scrolled 30% of hero section
        if (scrollPercentage > 0.3) {
            hero.classList.add('scrolled');
        } else {
            hero.classList.remove('scrolled');
        }
    });
    
    // Parallax effect for hero images
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const bullLayer = document.querySelector('.bull-layer');
        const teamLayer = document.querySelector('.team-layer');
        
        bullLayer.style.transform = `translateY(${scrolled * 0.5}px)`;
        teamLayer.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
});
</script>