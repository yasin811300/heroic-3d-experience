import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "هزینه طراحی سایت چقدر است؟",
    answer:
      "هزینه بسته به نوع سایت (فروشگاهی، شرکتی، شخصی) و امکانات مورد نیاز متفاوت است. از ۵ تا ۵۰ میلیون تومان متغیر است. برای قیمت دقیق تماس بگیرید.",
  },
  {
    question: "مدت زمان تحویل پروژه چقدر است؟",
    answer:
      "طراحی سایت معمولاً ۲-۴ هفته، مدیریت اینستاگرام ۱ هفته برای شروع، و سئو حداقل ۳ ماه برای نتیجه ملموس.",
  },
  {
    question: "آیا پشتیبانی بعد از تحویل دارید؟",
    answer:
      "بله! همه پروژه‌ها شامل ۶ ماه پشتیبانی رایگان هستند. بعد از اون هم می‌تونید قرارداد پشتیبانی سالانه داشته باشید.",
  },
  {
    question: "آیا از هوش مصنوعی استفاده می‌کنید؟",
    answer:
      "بله! ما از جدیدترین تکنولوژی‌های هوش مصنوعی برای تولید محتوا، بهینه‌سازی سئو و تحلیل داده‌ها استفاده می‌کنیم.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-right"
      >
        <span className="font-bold text-foreground pr-2">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            سوالات <span className="text-gradient-gold">متداول</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            پاسخ به سوالات رایج شما
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
