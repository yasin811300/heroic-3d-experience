import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
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
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      {/* Floating Music Control */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={togglePlay}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full glass-strong flex items-center justify-center group hover:border-primary/50 transition-all"
        title={isPlaying ? "قطع موسیقی" : "پخش موسیقی"}
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
