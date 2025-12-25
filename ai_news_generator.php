<?php
require 'db.php';

class AINewsGenerator {
    private $apiKey;
    private $model;
    private $settings;
    
    public function __construct() {
        // دریافت تنظیمات از دیتابیس
        $this->loadSettings();
    }
    
    private function loadSettings() {
        $result = $conn->query("SELECT setting_key, setting_value FROM ai_news_settings");
        $this->settings = [];
        while ($row = $result->fetch_assoc()) {
            $this->settings[$row['setting_key']] = $row['setting_value'];
        }
        $this->apiKey = $this->settings['api_key'];
        $this->model = $this->settings['model'] ?? 'gemini-2.0-flash';
    }
    
    public function generateDailyNews() {
        // بررسی اینکه آیا امروز اخبار تولید شده‌اند یا خیر
        $lastRun = $this->settings['last_run'];
        $today = date('Y-m-d');
        
        if (substr($lastRun, 0, 10) == $today) {
            return ["status" => "already_run", "message" => "اخبار امروز قبلاً تولید شده‌اند"];
        }
        
        $postsPerDay = (int)$this->settings['posts_per_day'];
        $topics = explode(',', $this->settings['topics']);
        $generatedPosts = [];
        
        for ($i = 0; $i < $postsPerDay; $i++) {
            $topic = $topics[array_rand($topics)];
            $post = $this->generateSinglePost($topic);
            if ($post) {
                $generatedPosts[] = $post;
            }
        }
        
        // به‌روزرسانی زمان آخرین اجرا
        $conn->query("UPDATE ai_news_settings SET setting_value = NOW() WHERE setting_key = 'last_run'");
        
        return [
            "status" => "success", 
            "message" => "تولید {$postsPerDay} خبر جدید با موفقیت انجام شد",
            "posts" => $generatedPosts
        ];
    }
    
    private function generateSinglePost($topic) {
        // 1. تولید عنوان خبر
        $title = $this->generateTitle($topic);
        
        // 2. تولید محتوای خبر
        $content = $this->generateContent($title, $topic);
        
        // 3. تولید چکیده
        $excerpt = $this->generateExcerpt($content);
        
        // 4. تولید تصویر شاخص (غیرفعال شده برای Google Gemini)
        $imageUrl = null; // $this->generateImage($title);
        
        // 5. ایجاد اسلاگ
        $slug = $this->createSlug($title);
        
        // 6. ذخیره در دیتابیس
        $postId = $this->savePost([
            'title' => $title,
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $excerpt,
            'featured_image' => $imageUrl,
            'published_at' => date('Y-m-d H:i:s'),
            'status' => 'published'
        ]);
        
        return [
            'id' => $postId,
            'title' => $title,
            'slug' => $slug
        ];
    }
    
    private function generateTitle($topic) {
        $prompt = "یک عنوان جذاب و حرفه‌ای برای یک خبر در زمینه '{$topic}' بنویس. عنوان باید کوتاه (حداکثر 70 کاراکتر) و جذاب باشد.";
        
        $response = $this->callGoogleAI($prompt);
        return trim($response);
    }
    
    private function generateContent($title, $topic) {
        $contentLength = (int)$this->settings['content_length'];
        $prompt = "یک خبر کامل و جامع با عنوان '{$title}' در زمینه '{$topic}' بنویس. خبر باید شامل موارد زیر باشد:
        - مقدمه‌ای جذاب و کوتاه
        - توضیحات کامل و دقیق درباره موضوع
        - تحلیل تخصصی و کاربردی
        - نتیجه‌گیری و جمع‌بندی
        - طول خبر حدود {$contentLength} کلمه باشد
        - از لحن حرفه‌ای و روزنامه‌نگاری استفاده کن";
        
        $response = $this->callGoogleAI($prompt);
        return $response;
    }
    
    private function generateExcerpt($content) {
        // استخراج 150 کاراکتر اول به عنوان چکیده
        $excerpt = substr(strip_tags($content), 0, 150);
        if (strlen($content) > 150) {
            $excerpt .= '...';
        }
        return $excerpt;
    }
    
    private function createSlug($title) {
        // تبدیل عنوان به اسلاگ URL-friendly
        $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($title));
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        
        // بررسی تکراری نبودن اسلاگ
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }
    
    private function slugExists($slug) {
        $result = $conn->query("SELECT id FROM ai_news WHERE slug = '$slug'");
        return $result->num_rows > 0;
    }
    
    private function savePost($postData) {
        $stmt = $conn->prepare("INSERT INTO ai_news (title, slug, content, excerpt, featured_image, published_at, status, ai_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssi", 
            $postData['title'], 
            $postData['slug'], 
            $postData['content'], 
            $postData['excerpt'], 
            $postData['featured_image'], 
            $postData['published_at'], 
            $postData['status'], 
            1
        );
        $stmt->execute();
        return $stmt->insert_id;
    }
    
    private function callGoogleAI($prompt) {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";
        
        $data = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ],
            "generationConfig" => [
                "temperature" => 0.7,
                "topK" => 1,
                "topP" => 1,
                "maxOutputTokens" => 2048,
            ]
        ];
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        // استخراج متن از پاسخ Google Gemini
        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            return $result['candidates'][0]['content']['parts'][0]['text'];
        }
        
        // در صورت خطا، یک متن پیش‌فرض برگردان
        return "محتوای مورد نظر در حال حاضر قابل تولید نیست. لطفاً بعداً دوباره تلاش کنید.";
    }
}

// اجرای سیستم
 $generator = new AINewsGenerator();
 $result = $generator->generateDailyNews();

// لاگ نتایج
 $logMessage = date('Y-m-d H:i:s') . " - " . json_encode($result) . "\n";
file_put_contents('ai_news_log.txt', $logMessage, FILE_APPEND);

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>