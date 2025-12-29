import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image, 
  Upload, 
  Download, 
  Loader2,
  Sparkles,
  X,
  Plus,
  Wand2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  dataUrl: string;
}

const AIImageMerge = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (uploadedImages.length >= 4) {
          toast.error("حداکثر ۴ تصویر می‌توانید آپلود کنید");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImages(prev => [
            ...prev, 
            { id: crypto.randomUUID(), dataUrl: event.target?.result as string }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const generateMergedImage = async () => {
    if (uploadedImages.length < 2) {
      toast.error("لطفاً حداقل ۲ تصویر آپلود کنید");
      return;
    }
    if (!prompt.trim()) {
      toast.error("لطفاً دستور ترکیب را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image-merge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: uploadedImages.map(img => img.dataUrl),
            prompt,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("تصویر با موفقیت ساخته شد! 🎨");
      } else {
        throw new Error(data.error || "خطا در ساخت تصویر");
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-merged-${Date.now()}.png`;
    link.click();
    toast.success("دانلود شروع شد");
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full px-6 py-3 mb-6"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              هوش مصنوعی پیشرفته
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ترکیب تصاویر با{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              هوش مصنوعی
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            چند تصویر آپلود کنید و بذارید هوش مصنوعی یه شاهکار بسازه! 🚀
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Upload Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  تصاویر شما ({uploadedImages.length}/4)
                </h3>
                {uploadedImages.length < 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن تصویر
                  </Button>
                )}
              </div>

              {uploadedImages.length === 0 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload className="w-16 h-16 mx-auto text-primary/50 mb-4" />
                  </motion.div>
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    تصاویر خود را اینجا بیندازید
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    یا کلیک کنید برای انتخاب (حداقل ۲ تصویر)
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, index) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-border"
                    >
                      <img 
                        src={img.dataUrl} 
                        alt={`Uploaded ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeImage(img.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                  {uploadedImages.length < 4 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex items-center justify-center bg-secondary/30 hover:bg-secondary/50 transition-all"
                    >
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="دستور ترکیب تصاویر را بنویسید... مثال: این دو چهره را ترکیب کن و یک پرتره حرفه‌ای بساز"
                className="min-h-[100px] resize-none bg-secondary/30 border-border/50"
                dir="rtl"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateMergedImage} 
              disabled={loading || uploadedImages.length < 2}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 rounded-xl shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  در حال ساخت شاهکار...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 ml-2" />
                  ساخت تصویر نهایی
                </>
              )}
            </Button>

            {/* Result */}
            <AnimatePresence>
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  className="mt-8"
                >
                  <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20">
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-4 right-4 left-4 flex justify-center gap-3">
                      <Button 
                        size="lg"
                        onClick={() => downloadImage(generatedImage)}
                        className="bg-white/90 text-gray-900 hover:bg-white shadow-xl"
                      >
                        <Download className="w-5 h-5 ml-2" />
                        دانلود تصویر
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => setGeneratedImage(null)}
                        className="bg-white/90 text-gray-900 hover:bg-white shadow-xl border-0"
                      >
                        <X className="w-5 h-5 ml-2" />
                        ساخت مجدد
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIImageMerge;
