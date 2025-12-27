import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, template } = await req.json();

    if (!phone) {
      throw new Error("شماره موبایل الزامی است");
    }

    // Get SMS settings from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["sms_api_token", "sms_provider"]);

    const smsToken = settings?.find(s => s.key === "sms_api_token")?.value;
    const smsProvider = settings?.find(s => s.key === "sms_provider")?.value || "inoti";

    if (!smsToken) {
      throw new Error("توکن SMS تنظیم نشده است");
    }

    console.log(`Sending SMS via ${smsProvider} to ${phone}`);

    let response;
    let result;

    // iNoti SMS API
    if (smsProvider === "inoti") {
      const smsMessage = message || template || "کد تایید شما";
      
      response = await fetch("https://api.inoti.ir/api/v1/sms/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${smsToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receptor: phone,
          message: smsMessage,
        }),
      });

      result = await response.json();
      console.log("iNoti response:", result);
    }
    // Faraz SMS API (برای آینده)
    else if (smsProvider === "faraz") {
      response = await fetch("https://ippanel.com/api/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          op: "send",
          uname: "username", // باید از تنظیمات بخونه
          pass: smsToken,
          to: phone,
          from: "sender_number",
          message: message || template,
        }),
      });

      result = await response.json();
      console.log("Faraz response:", result);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "پیامک با موفقیت ارسال شد",
      result 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("SMS error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "خطا در ارسال پیامک"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
