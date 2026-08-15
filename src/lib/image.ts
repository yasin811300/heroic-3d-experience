/**
 * Reads an image file and returns a compressed data URL,
 * so images can be stored directly in the database without a storage bucket.
 */
export const fileToCompressedDataUrl = (
  file: File,
  maxSize = 512,
  quality = 0.82
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("فایل انتخابی تصویر نیست"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خطا در خواندن فایل"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("تصویر قابل خواندن نیست"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("خطا در پردازش تصویر"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
