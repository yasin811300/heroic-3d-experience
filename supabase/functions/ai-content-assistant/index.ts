import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    
    console.log('AI Content Assistant called with type:', type);
    console.log('Messages count:', messages?.length);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompts based on type
    const systemPrompts: Record<string, string> = {
      general: `شما یک دستیار هوش مصنوعی حرفه‌ای هستید که به زبان فارسی پاسخ می‌دهید. 
      شما در تولید محتوا، نوشتن متن‌های جذاب، و ارائه پیشنهادات خلاقانه تخصص دارید.
      پاسخ‌های شما باید مختصر، مفید و حرفه‌ای باشد.`,
      
      blog: `شما یک نویسنده حرفه‌ای بلاگ هستید. 
      محتوای جذاب، SEO-friendly و خوانا تولید کنید.
      از تیترهای جذاب، پاراگراف‌های کوتاه و نکات کلیدی استفاده کنید.`,
      
      social: `شما یک متخصص شبکه‌های اجتماعی هستید.
      پست‌های جذاب، کپشن‌های viral و هشتگ‌های مناسب پیشنهاد دهید.
      محتوا باید کوتاه، تاثیرگذار و قابل اشتراک‌گذاری باشد.`,
      
      marketing: `شما یک کپی‌رایتر حرفه‌ای هستید.
      متن‌های تبلیغاتی، CTA های قوی و پیام‌های بازاریابی موثر بنویسید.
      از تکنیک‌های روانشناسی فروش استفاده کنید.`,
      
      email: `شما متخصص نوشتن ایمیل‌های حرفه‌ای هستید.
      ایمیل‌های واضح، مختصر و موثر با subject line های جذاب بنویسید.`
    };

    const systemPrompt = systemPrompts[type] || systemPrompts.general;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "محدودیت درخواست. لطفا کمی صبر کنید." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "اعتبار کافی نیست. لطفا اعتبار خود را شارژ کنید." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "خطا در ارتباط با هوش مصنوعی" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('Streaming response from AI Gateway');
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AI Content Assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "خطای ناشناخته" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
