"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from 'next/link';
import { Coffee, Sparkles } from 'lucide-react';

const stages = [
  "Awaken Your Senses",
  "Precision in Every Drop",
  "Crafted for Your Mood",
  "Your Coffee, Your Ritual"
];

export default function HeroSection() {
  const [stage, setStage] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse parallax
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const { scrollYProgress } = useScroll();

  const scrollScale = useTransform(scrollYProgress, [0, 0.18], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Stage cycling timer
  useEffect(() => {
    if (stage < stages.length - 1) {
      const timer = setTimeout(() => setStage(prev => prev + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 30);
      mouseY.set((clientY / innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      className="relative -mt-14 sm:-mt-10 md:mt-0 min-h-[100svh] pt-14 sm:pt-10 md:pt-0 flex items-center justify-center overflow-hidden bg-[#0A0705]"
    >
      <div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-black via-black/70 to-transparent z-20 pointer-events-none" />
      {/* Cinematic Layered Background */}
      <motion.div 
        style={{ scale: scrollScale, x: springX, y: springY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10" />
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover grayscale brightness-50"
          alt=""
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-transparent to-transparent z-[11]" />
      </motion.div>

      {/* Narrative Text Sync */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-30 max-w-5xl px-5 sm:px-8 text-center flex flex-col items-center"
      >
        <div className="min-h-[7rem] sm:min-h-[10rem] mb-5 sm:mb-8 flex items-center justify-center">
           <AnimatePresence mode="wait">
             <motion.h1
               key={stage}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
               className="font-playfair text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tighter leading-[0.95]"
             >
               {stages[stage]}
             </motion.h1>
           </AnimatePresence>
        </div>

        {/* Descriptive Body Copy - only at final stage */}
        <motion.p
          animate={{ opacity: stage === 3 ? 1 : 0, y: stage === 3 ? 0 : 20 }}
          className="max-w-xl mx-auto text-[rgba(255,255,255,0.6)] text-[11px] sm:text-sm md:text-base font-medium tracking-[0.12em] sm:tracking-[0.2em] uppercase leading-loose mb-8 sm:mb-16 transition-all duration-1000"
        >
          Specialty coffee, roasted for the discerning ritualist. <br />
          Experience Bangalore&apos;s premier collective.
        </motion.p>

        {/* Final Stage CTAs */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center w-full sm:w-auto"
            >
              <Link
                href="/menu"
              className="group relative w-full sm:w-auto min-h-[44px] px-8 sm:px-12 py-4 sm:py-5 bg-white text-black font-black uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[10px] rounded-2xl hover:bg-amber-500 transition-all duration-500 shadow-2xl active:scale-95 flex items-center justify-center gap-4"
              >
                Explore Menu <Coffee size={14} className="group-hover:rotate-12 duration-300" />
              </Link>
              <Link
                href="/ai-guide"
              className="group w-full sm:w-auto min-h-[44px] px-8 sm:px-12 py-4 sm:py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-4"
              >
                Start Your Ritual <Sparkles size={14} className="text-amber-500" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 sm:gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-default"
      >
        <span className="text-[10px] uppercase font-black tracking-[0.6em] text-white">Scroll to experience</span>
        <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1/2 bg-amber-500 ritual-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
