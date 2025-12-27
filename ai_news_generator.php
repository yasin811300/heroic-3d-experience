<?php
// ai_news_generator.php - تولید خبر با هوش مصنوعی
define('AZMA_ACCESS', true);
require_once 'config.php';
require 'db.php';

class AINewsGenerator {
    private $model;
    private $settings;
    private $conn;
    
    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
        $this->model = GEMINI_MODEL;
        $this->loadSettings();
    }
    
    private function loadSettings() {
        $stmt = $this->conn->prepare("SELECT setting_key, setting_value FROM ai_news_settings");
        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();
            $this->settings = [];
            while ($row = $result->fetch_assoc()) {
                $this->settings[$row['setting_key']] = $row['setting_value'];
            }
            $stmt->close();
        }
    }
    
    public function generateDailyNews() {
        $lastRun = $this->settings['last_run'] ?? '';
        $today = date('Y-m-d');
        
        if (substr($lastRun, 0, 10) == $today) {
            return ["status" => "already_run", "message" => "اخبار امروز قبلاً تولید شده‌اند"];
        }
        
        $postsPerDay = (int)($this->settings['posts_per_day'] ?? 1);
        $topics = explode(',', $this->settings['topics'] ?? 'دیجیتال مارکتینگ');
        $generatedPosts = [];
        
        for ($i = 0; $i < $postsPerDay; $i++) {
            $topic = trim($topics[array_rand($topics)]);
            $post = $this->generateSinglePost($topic);
            if ($post) {
                $generatedPosts[] = $post;
            }
        }
        
        // به‌روزرسانی زمان آخرین اجرا
        $stmt = $this->conn->prepare("UPDATE ai_news_settings SET setting_value = NOW() WHERE setting_key = 'last_run'");
        if ($stmt) {
            $stmt->execute();
            $stmt->close();
        }
        
        return [
            "status" => "success", 
            "message" => "تولید {$postsPerDay} خبر جدید با موفقیت انجام شد",
            "posts" => $generatedPosts
        ];
    }
    
    private function generateSinglePost($topic) {
        $title = $this->generateTitle($topic);
        $content = $this->generateContent($title, $topic);
        $excerpt = $this->generateExcerpt($content);
        $slug = $this->createSlug($title);
        
        $postId = $this->savePost([
            'title' => $title,
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $excerpt,
            'featured_image' => null,
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
        $result = callGeminiAPI($prompt);
        return isset($result['text']) ? trim($result['text']) : 'خبر جدید';
    }
    
    private function generateContent($title, $topic) {
        $contentLength = (int)($this->settings['content_length'] ?? 500);
        $prompt = "یک خبر کامل و جامع با عنوان '{$title}' در زمینه '{$topic}' بنویس. خبر باید شامل موارد زیر باشد:
        - مقدمه‌ای جذاب و کوتاه
        - توضیحات کامل و دقیق درباره موضوع
        - تحلیل تخصصی و کاربردی
        - نتیجه‌گیری و جمع‌بندی
        - طول خبر حدود {$contentLength} کلمه باشد
        - از لحن حرفه‌ای و روزنامه‌نگاری استفاده کن";
        
        $result = callGeminiAPI($prompt);
        return isset($result['text']) ? $result['text'] : '';
    }
    
    private function generateExcerpt($content) {
        $excerpt = mb_substr(strip_tags($content), 0, 150, 'UTF-8');
        if (mb_strlen($content, 'UTF-8') > 150) {
            $excerpt .= '...';
        }
        return $excerpt;
    }
    
    private function createSlug($title) {
        $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($title));
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        
        if (empty($slug)) {
            $slug = 'news-' . time();
        }
        
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }
    
    private function slugExists($slug) {
        $stmt = $this->conn->prepare("SELECT id FROM ai_news WHERE slug = ?");
        $stmt->bind_param("s", $slug);
        $stmt->execute();
        $result = $stmt->get_result();
        $exists = $result->num_rows > 0;
        $stmt->close();
        return $exists;
    }
    
    private function savePost($postData) {
        $stmt = $this->conn->prepare("INSERT INTO ai_news (title, slug, content, excerpt, featured_image, published_at, status, ai_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $aiGenerated = 1;
        $stmt->bind_param("sssssssi", 
            $postData['title'], 
            $postData['slug'], 
            $postData['content'], 
            $postData['excerpt'], 
            $postData['featured_image'], 
            $postData['published_at'], 
            $postData['status'], 
            $aiGenerated
        );
        $stmt->execute();
        $insertId = $stmt->insert_id;
        $stmt->close();
        return $insertId;
    }
}

// اجرای سیستم
$generator = new AINewsGenerator($conn);
$result = $generator->generateDailyNews();

// لاگ نتایج
$logMessage = date('Y-m-d H:i:s') . " - " . json_encode($result, JSON_UNESCAPED_UNICODE) . "\n";
file_put_contents('ai_news_log.txt', $logMessage, FILE_APPEND);

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>