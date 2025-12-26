import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ambient music URL - royalty free electronic/cinematic
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowPrompt(false);
    }
  };

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setShowPrompt(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      {/* Initial Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-lg"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="glass-strong rounded-3xl p-8 md:p-12 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center"
              >
                <Music className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">
                🎵 تجربه‌ای متفاوت
              </h2>
              <p className="text-muted-foreground mb-6">
                برای یک تجربه فوق‌العاده، موسیقی پس‌زمینه رو فعال کنید
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startMusic}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  پخش موسیقی
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPrompt(false)}
                  className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <VolumeX className="w-5 h-5" />
                  بدون صدا
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Music Control */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={togglePlay}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full glass-strong flex items-center justify-center group hover:border-primary/50 transition-all"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-6 h-6 text-primary" />
            {/* Sound waves animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/50"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        ) : (
          <VolumeX className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </motion.button>
    </>
  );
};

export default MusicPlayer;
