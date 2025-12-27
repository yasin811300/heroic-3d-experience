import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const VoiceAI = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to agent");
      toast.success("متصل شد!");
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      toast.info("قطع شد");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("خطا در اتصال");
    },
  });

  // Update volume visualization
  useEffect(() => {
    if (conversation.status !== "connected") return;
    
    const interval = setInterval(() => {
      const level = conversation.isSpeaking 
        ? conversation.getOutputVolume() 
        : conversation.getInputVolume();
      setVolumeLevel(level || 0);
    }, 100);

    return () => clearInterval(interval);
  }, [conversation.status, conversation.isSpeaking]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (!data?.token) {
        throw new Error("توکن دریافت نشد");
      }

      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error("خطا در شروع مکالمه. لطفا دسترسی میکروفون را بدهید.");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6" dir="rtl">
      {/* Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-foreground mb-8"
      >
        دستیار صوتی ازما
      </motion.h1>

      {/* Avatar Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-10"
      >
        {/* Animated rings around avatar */}
        <AnimatePresence>
          {isConnected && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1 + volumeLevel * 0.5, 
                  opacity: 0.3 - volumeLevel * 0.1 
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 rounded-full bg-primary/30"
                style={{ 
                  width: 200, 
                  height: 200, 
                  marginLeft: -20, 
                  marginTop: -20 
                }}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1.2 + volumeLevel * 0.8, 
                  opacity: 0.2 - volumeLevel * 0.05 
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 rounded-full bg-primary/20"
                style={{ 
                  width: 240, 
                  height: 240, 
                  marginLeft: -40, 
                  marginTop: -40 
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Avatar Face */}
        <motion.div 
          className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/30"
          animate={{
            scale: conversation.isSpeaking ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: conversation.isSpeaking ? Infinity : 0,
          }}
        >
          {/* Eyes */}
          <div className="absolute top-12 left-8 w-4 h-4 bg-white rounded-full">
            <motion.div 
              className="w-2 h-2 bg-foreground rounded-full mt-1 ml-1"
              animate={{
                x: conversation.isSpeaking ? [0, 2, 0] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="absolute top-12 right-8 w-4 h-4 bg-white rounded-full">
            <motion.div 
              className="w-2 h-2 bg-foreground rounded-full mt-1 ml-1"
              animate={{
                x: conversation.isSpeaking ? [0, 2, 0] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Mouth */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-full"
            animate={{
              width: conversation.isSpeaking ? [20, 30, 20] : 20,
              height: conversation.isSpeaking ? [8, 16, 8] : 8,
            }}
            transition={{
              duration: 0.3,
              repeat: conversation.isSpeaking ? Infinity : 0,
            }}
          />
        </motion.div>

        {/* Status indicator */}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? "bg-green-500/20 text-green-500" 
            : "bg-muted text-muted-foreground"
        }`}>
          {isConnected 
            ? conversation.isSpeaking 
              ? "در حال صحبت..." 
              : "در حال گوش دادن..." 
            : "آفلاین"
          }
        </div>
      </motion.div>

      {/* Speaking indicator */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          <Volume2 className={`w-5 h-5 ${conversation.isSpeaking ? "text-primary" : "text-muted-foreground"}`} />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-primary"
                animate={{
                  height: conversation.isSpeaking 
                    ? [8, 24, 8] 
                    : volumeLevel > i * 0.2 
                      ? [8, 16, 8] 
                      : 8,
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Control Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {!isConnected ? (
          <Button
            onClick={startConversation}
            disabled={isConnecting}
            size="lg"
            className="px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/30"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />
                در حال اتصال...
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 ml-2" />
                شروع مکالمه
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopConversation}
            variant="destructive"
            size="lg"
            className="px-8 py-6 text-lg rounded-full"
          >
            <MicOff className="w-6 h-6 ml-2" />
            پایان مکالمه
          </Button>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-muted-foreground text-center max-w-md"
      >
        {!isConnected 
          ? "روی دکمه بزن و شروع کن به صحبت کردن! دستیار صوتی آماده پاسخگویی به سوالاتت هست."
          : "حالا می‌تونی صحبت کنی. دستیار گوش می‌ده و جواب می‌ده."
        }
      </motion.p>
    </div>
  );
};

export default VoiceAI;
