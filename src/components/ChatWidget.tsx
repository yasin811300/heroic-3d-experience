import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, FileText, Share2, Mail, Megaphone, Loader2, Copy, Check, MessageCircle, Image, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
};

type ContentType = 'general' | 'blog' | 'social' | 'marketing' | 'email' | 'image';

const contentTypes: { id: ContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'general', label: 'عمومی', icon: <Sparkles className="w-4 h-4" />, description: 'دستیار همه‌کاره' },
  { id: 'image', label: 'تصویر', icon: <Image className="w-4 h-4" />, description: 'تولید تصویر' },
  { id: 'blog', label: 'بلاگ', icon: <FileText className="w-4 h-4" />, description: 'نوشتن مقاله' },
  { id: 'social', label: 'شبکه اجتماعی', icon: <Share2 className="w-4 h-4" />, description: 'پست و کپشن' },
  { id: 'marketing', label: 'بازاریابی', icon: <Megaphone className="w-4 h-4" />, description: 'متن تبلیغاتی' },
  { id: 'email', label: 'ایمیل', icon: <Mail className="w-4 h-4" />, description: 'ایمیل حرفه‌ای' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-content-assistant`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('general');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('کپی شد!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('تصویر دانلود شد!');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check if this is an image generation request
    const isImageRequest = contentType === 'image';

    if (isImageRequest) {
      // Non-streaming image generation
      try {
        const response = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            messages: [...messages, userMessage],
            type: contentType,
            generateImage: true
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'خطا در تولید تصویر');
        }

        const data = await response.json();
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.text || 'تصویر شما آماده است!',
          imageUrl: data.imageUrl 
        }]);
      } catch (error) {
        console.error('Image generation error:', error);
        toast.error(error instanceof Error ? error.message : 'خطا در تولید تصویر');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Streaming text generation
    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          type: contentType 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطا در ارتباط');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      // Add assistant message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'خطا در ارتباط با دستیار');
      // Remove the empty assistant message if error
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1 || prev[i].content));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = contentType === 'image' 
    ? [
        'غروب آفتاب روی کوهستان',
        'شهر آینده با آسمان‌خراش',
        'جنگل جادویی با نور ماه',
        'اقیانوس آرام با موج‌های طلایی',
      ]
    : [
        'یک پست اینستاگرام جذاب بنویس',
        'ایده برای عنوان مقاله',
        'CTA قوی برای لندینگ پیج',
        'ایمیل پیگیری مشتری',
      ];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg flex items-center justify-center ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
        }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[420px] max-w-[calc(100vw-48px)] h-[650px] max-h-[calc(100vh-100px)] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    {contentType === 'image' ? <Image className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold">دستیار هوش مصنوعی</h3>
                    <p className="text-xs text-white/80">
                      {contentType === 'image' ? 'تولید تصویر با AI' : 'تولید محتوای حرفه‌ای'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Type Selector */}
              <div className="flex gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                      contentType === type.id
                        ? 'bg-white text-amber-600 shadow'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4">
                    {contentType === 'image' ? (
                      <Image className="w-8 h-8 text-amber-500" />
                    ) : (
                      <MessageCircle className="w-8 h-8 text-amber-500" />
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {contentType === 'image' ? 'چه تصویری بسازم؟' : 'چطور می‌تونم کمکتون کنم؟'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {contentType === 'image' 
                      ? 'توضیح تصویر مورد نظرتان را بنویسید'
                      : `محتوای ${contentTypes.find(t => t.id === contentType)?.description} تولید کنید`
                    }
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(prompt)}
                        className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      
                      {/* Display generated image */}
                      {message.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={message.imageUrl} 
                            alt="Generated image" 
                            className="rounded-lg max-w-full shadow-lg"
                          />
                          <button
                            onClick={() => downloadImage(message.imageUrl!)}
                            className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            دانلود تصویر
                          </button>
                        </div>
                      )}
                      
                      {message.role === 'assistant' && message.content && !message.imageUrl && (
                        <button
                          onClick={() => copyToClipboard(message.content, index)}
                          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3" />
                              کپی شد
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              کپی متن
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    <span className="text-sm text-muted-foreground">
                      {contentType === 'image' ? 'در حال تولید تصویر...' : 'در حال تایپ...'}
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={contentType === 'image' ? 'توضیح تصویر...' : 'پیام خود را بنویسید...'}
                  className="flex-1 resize-none bg-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 max-h-32"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl px-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : contentType === 'image' ? (
                    <Image className="w-5 h-5" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
