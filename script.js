// اسکریپت اصلی سایت (فقط منطق موس)

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.matchMedia("(min-width: 1025px)").matches) {
    document.body.style.cursor = 'none'; // مخفی کردن موس پیشفرض
    
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // حرکت نقطه وسط
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // حرکت دایره دور (با انیمیشن نرم)
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 400, fill: "forwards" });
    });
}