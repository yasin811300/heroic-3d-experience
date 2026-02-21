DELETE FROM public.portfolio_items;

INSERT INTO public.portfolio_items (title, category, image_url, description, is_active, display_order) VALUES
('بانک پاسارگاد', 'UI/UX', '/portfolio/pasargad-bank.jpg', 'طراحی رابط کاربری اپلیکیشن بانک پاسارگاد', true, 1),
('شهر کفش', 'پوستر تبلیغاتی', '/portfolio/shahr-kafsh.png', 'طراحی پوستر تبلیغاتی برای فروشگاه شهر کفش', true, 2),
('نکات ادمینی', 'اینستاگرام', '/portfolio/admin-tips.png', 'طراحی پست آموزشی برای پیج‌های اینستاگرامی', true, 3),
('کاور موزیک Atmin', 'کاور موزیک', '/portfolio/atmin-music.png', 'طراحی کاور موزیک برای هنرمند Atmin', true, 4),
('شامپو ماهورا', 'پوستر محصول', '/portfolio/mahoura-shampoo.png', 'طراحی پوستر تبلیغاتی برای محصول شامپو', true, 5),
('تزئینات اتومبیل سلطانی', 'پوستر تبلیغاتی', '/portfolio/sultani-car.png', 'طراحی پوستر برای خدمات خودرو', true, 6),
('لوگوهای مذهبی', 'طراحی لوگو', '/portfolio/religious-logos.png', 'مجموعه طراحی‌های لوگو تایپ مذهبی', true, 7),
('کنسرت یاسین', 'پوستر رویداد', '/portfolio/yasin-concert.png', 'طراحی پوستر کنسرت یاسین در تهران', true, 8),
('رستوران طعم خاص', 'پوستر غذا', '/portfolio/tame-khas-food.jpg', 'عکاسی و طراحی پوستر برای رستوران', true, 9),
('پست نات‌کوین', 'اینستاگرام', '/portfolio/notcoin-post.png', 'طراحی پست خبری و تعاملی ارز دیجیتال', true, 10),
('کمک به کودکان', 'پوستر خیریه', '/portfolio/charity-poster.png', 'طراحی پوستر مفهومی برای خیریه', true, 11),
('منوی کافه سنگی', 'طراحی منو', '/portfolio/cafe-sangi.png', 'طراحی منوی کافی‌شاپ با تم سنگی', true, 12),
('طراحی گواهینامه', 'اوراق اداری', '/portfolio/certificate-design.png', 'طراحی گواهینامه پایان دوره آموزشی', true, 13),
('روز مادر - آرمیران', 'پوستر مناسبتی', '/portfolio/armiran-mothers-day.jpg', 'طراحی پوستر مناسبتی برای فروشگاه مبلمان', true, 14),
('لوگو شاه کلید', 'طراحی لوگو', '/portfolio/shah-kelid-logo.png', 'طراحی لوگو برای برند املاک', true, 15),
('لوگو آرمیران', 'طراحی لوگو', '/portfolio/armiran-logo.jpg', 'طراحی لوگوی لوکس برای برند مبلمان', true, 16),
('اشتباهات رایج طراحی', 'تولید محتوا', '/portfolio/design-mistakes.jpg', 'طراحی اسلایدهای آموزشی اینستاگرام', true, 17),
('راز طراحی گرافیک', 'تولید محتوا', '/portfolio/design-secret.jpg', 'طراحی کاور پست جذاب برای اینستاگرام', true, 18),
('سایت‌های نجات‌دهنده', 'تولید محتوا', '/portfolio/design-sites.jpg', 'معرفی ابزارهای کاربردی برای طراحان', true, 19);