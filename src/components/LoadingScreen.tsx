"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FRAME_FILENAMES } from "@/config/frames";

const FRAME_COUNT = FRAME_FILENAMES.length;

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const loadingStarted = useRef(false);

  useEffect(() => {
    if (loadingStarted.current) return;
    loadingStarted.current = true;

    let loadedCount = 0;
    const preloadedImages: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loadedCount++;
      const p = Math.floor((loadedCount / FRAME_COUNT) * 100);
      setProgress(p);

      if (loadedCount === FRAME_COUNT) {
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 800);
        }, 500);
      }
    };

    // Preload ALL frames
    FRAME_FILENAMES.forEach((filename, i) => {
      const img = new Image();
      img.src = `/frames/${filename}`;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Continue even if one fails
      preloadedImages[i] = img;
    });
    
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
           key="loader"
           initial={{ opacity: 1 }}
           exit={{ opacity: 0, scale: 1.05 }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
           className="fixed inset-0 z-[9999] bg-[#0A0705] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background circles */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(111,78,55,0.15)_0%,transparent_70%)] animate-pulse" />

          {/* Logo area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-5 relative z-10 mb-14"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl drop-shadow-[0_0_20px_rgba(200,162,124,0.5)]"
            >
              ☕
            </motion.div>

            <h1 className="font-serif text-3xl font-semibold tracking-widest text-[#F5ECD7]">
              Aurora Roastery
            </h1>

            <div className="font-sans text-[11px] tracking-[4px] uppercase text-[#A89880]">
              Preparing Your Experience...
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-80 relative z-10"
          >
            <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden mb-5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-accent-light transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center px-1">
              <span className="font-sans text-[10px] text-[#A89880] tracking-[2px] uppercase">
                {progress === 100 ? "Ready" : "Crafting Frames"}
              </span>
              <span className="font-display text-2xl text-accent italic font-light">
                {progress}%
              </span>
            </div>
          </motion.div>

          {/* Info text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 font-sans text-[9px] text-white/20 tracking-widest uppercase"
          >
            Optimizing 144 cinematic frames
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
