import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image, 
  Video, 
  MessageSquare, 
  Sparkles, 
  Upload, 
  Download, 
  Copy, 
  Loader2,
  Wand2,
  FileText,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const AIStudio = () => {
  const [activeTab, setActiveTab] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("لطفاً توضیحات تصویر را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-studio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "generate_image",
            prompt,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("تصویر با موفقیت ساخته شد!");
      } else {
        throw new Error(data.error || "خطا در ساخت تصویر");
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const editImage = async () => {
    if (!uploadedImage) {
      toast.error("لطفاً ابتدا یک تصویر آپلود کنید");
      return;
    }
    if (!prompt.trim()) {
      toast.error("لطفاً دستور ویرایش را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-studio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "edit_image",
            prompt,
            imageBase64: uploadedImage,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("تصویر با موفقیت ویرایش شد!");
      } else {
        throw new Error(data.error || "خطا در ویرایش تصویر");
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const generateCaption = async () => {
    if (!prompt.trim()) {
      toast.error("لطفاً موضوع کپشن را وارد کنید");
      return;
    }

    setLoading(true);
    setGeneratedText("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-studio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "generate_caption",
            prompt,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.caption) {
        setGeneratedText(data.caption);
        toast.success("کپشن با موفقیت ساخته شد!");
      } else {
        throw new Error(data.error || "خطا در ساخت کپشن");
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const generateText = async () => {
    if (!prompt.trim()) {
      toast.error("لطفاً موضوع متن را وارد کنید");
      return;
    }

    setLoading(true);
    setGeneratedText("");
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-studio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "generate_text",
            prompt,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("خطا در دریافت پاسخ");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              setGeneratedText(prev => prev + content);
            }
          } catch {
            continue;
          }
        }
      }
      
      toast.success("متن با موفقیت ساخته شد!");
    } catch (error: any) {
      toast.error(error.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("کپی شد!");
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
    toast.success("دانلود شروع شد");
  };

  const tabs = [
    { id: "image", label: "تولید تصویر", icon: Image },
    { id: "edit", label: "ویرایش تصویر", icon: Wand2 },
    { id: "caption", label: "کپشن‌نویسی", icon: MessageSquare },
    { id: "text", label: "تولید متن", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">استودیو هوش مصنوعی</h2>
          <p className="text-muted-foreground text-sm">تولید تصویر، ویدیو و محتوا</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 h-auto p-2 bg-secondary/50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* تولید تصویر */}
        <TabsContent value="image" className="space-y-4 mt-6">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="توضیح تصویر مورد نظر خود را بنویسید... مثال: یک منظره کوهستانی با غروب آفتاب"
            className="min-h-[120px] resize-none"
            dir="rtl"
          />
          
          <Button 
            onClick={generateImage} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <Sparkles className="w-4 h-4 ml-2" />
            )}
            ساخت تصویر
          </Button>

          <AnimatePresence>
            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative rounded-xl overflow-hidden border border-border"
              >
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-auto"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => downloadImage(generatedImage)}>
                    <Download className="w-4 h-4 ml-1" />
                    دانلود
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setGeneratedImage(null)}>
                    <RefreshCw className="w-4 h-4 ml-1" />
                    پاک کردن
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* ویرایش تصویر */}
        <TabsContent value="edit" className="space-y-4 mt-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">تصویر خود را آپلود کنید</p>
              </>
            )}
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="دستور ویرایش را بنویسید... مثال: پس‌زمینه را به آبی تغییر بده"
            className="min-h-[100px] resize-none"
            dir="rtl"
          />
          
          <Button 
            onClick={editImage} 
            disabled={loading || !uploadedImage}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <Wand2 className="w-4 h-4 ml-2" />
            )}
            ویرایش تصویر
          </Button>

          <AnimatePresence>
            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative rounded-xl overflow-hidden border border-border"
              >
                <img src={generatedImage} alt="Edited" className="w-full h-auto" />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => downloadImage(generatedImage)}>
                    <Download className="w-4 h-4 ml-1" />
                    دانلود
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* کپشن‌نویسی */}
        <TabsContent value="caption" className="space-y-4 mt-6">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="موضوع پست یا محصول خود را بنویسید... مثال: پست اینستاگرام برای معرفی خدمات طراحی سایت"
            className="min-h-[120px] resize-none"
            dir="rtl"
          />
          
          <Button 
            onClick={generateCaption} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <MessageSquare className="w-4 h-4 ml-2" />
            )}
            ساخت کپشن
          </Button>

          <AnimatePresence>
            {generatedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative glass rounded-xl p-4"
              >
                <pre className="whitespace-pre-wrap text-sm leading-relaxed" dir="rtl">
                  {generatedText}
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 left-2"
                  onClick={() => copyToClipboard(generatedText)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* تولید متن */}
        <TabsContent value="text" className="space-y-4 mt-6">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="موضوع مقاله یا متن مورد نظر را بنویسید... مثال: مقاله درباره مزایای طراحی سایت حرفه‌ای"
            className="min-h-[120px] resize-none"
            dir="rtl"
          />
          
          <Button 
            onClick={generateText} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <FileText className="w-4 h-4 ml-2" />
            )}
            تولید متن
          </Button>

          <AnimatePresence>
            {generatedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative glass rounded-xl p-4"
              >
                <pre className="whitespace-pre-wrap text-sm leading-relaxed" dir="rtl">
                  {generatedText}
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 left-2"
                  onClick={() => copyToClipboard(generatedText)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIStudio;
