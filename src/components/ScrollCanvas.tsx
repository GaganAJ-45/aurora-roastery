
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { siteConfig } from "@/config/site";
import { FRAME_FILENAMES } from "@/config/frames";

const FRAME_COUNT = FRAME_FILENAMES.length;
const OPENING_HERO_SRC = "/hero_coffee.png";
const OPENING_SEGMENT_END = 1 / siteConfig.heroScrollTexts.length;

function getMobileScrollText(text: string) {
  const mobileMap: Record<string, string> = {
    "BREWED TO\nPERFECTION.": "Brewed to\nPerfection",
    "From Bean to Perfection": "From Bean to\nPerfection",
    "Roasted with Precision": "Roasted with\nPrecision",
    "Ground to Unlock Aroma": "Ground to Unlock\nAroma",
    "Brewed to Excellence": "Brewed to\nExcellence",
    "Every Drop Tells a Story": "Every Drop Tells\na Story",
    "Coffee, Reimagined": "Coffee,\nReimagined",
    "Begin Your Ritual": "Begin Your\nRitual",
  };

  return mobileMap[text] ?? text;
}

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [openingImage, setOpeningImage] = useState<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Scroll tracking with Spring for ultra-smoothness
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 2. Preload/Retrieve images (they'll be in browser cache from LoadingScreen)
  useEffect(() => {
    let loadedCount = 0;
    const preloadedImages: HTMLImageElement[] = [];
    const openingImg = new Image();

    openingImg.src = OPENING_HERO_SRC;
    openingImg.onload = () => setOpeningImage(openingImg);
    openingImg.onerror = () => setOpeningImage(null);

    const loadImages = () => {
      FRAME_FILENAMES.forEach((filename, i) => {
        const img = new Image();
        img.src = `/frames/${filename}`;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === FRAME_COUNT) {
            setImages(preloadedImages);
            setLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === FRAME_COUNT) {
            setImages(preloadedImages);
            setLoaded(true);
          }
        };
        preloadedImages[i] = img;
      });
    };

    loadImages();
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  // 3. Canvas Rendering Logic
  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderFrame = (progress: number) => {
      const useOpeningImage = progress <= OPENING_SEGMENT_END && openingImage;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT)
      );

      const img = useOpeningImage ? openingImage : images[frameIndex];
      if (!img) return;

      // Full screen (h-screen w-full)
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / (isMobile ? 1.7 : 2);
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / (isMobile ? 3.2 : 2);
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Subtle overlay to make text pop
      ctx.fillStyle = isMobile ? "rgba(10, 7, 5, 0.48)" : "rgba(10, 7, 5, 0.4)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (isMobile) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.75);
        gradient.addColorStop(0, "rgba(10, 7, 5, 0.14)");
        gradient.addColorStop(0.35, "rgba(10, 7, 5, 0.06)");
        gradient.addColorStop(1, "rgba(10, 7, 5, 0.62)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    };

    // Initial render
    renderFrame(smoothProgress.get());

    // Listen to scroll changes
    const unsubscribe = smoothProgress.on("change", (latest) => {
      renderFrame(latest);
    });

    // Handle resize
    const handleResize = () => renderFrame(smoothProgress.get());
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, loaded, images, openingImage, smoothProgress]);

  // 4. Text Overlay logic
  const textSegments = siteConfig.heroScrollTexts.map((text, i) => {
    const total = siteConfig.heroScrollTexts.length;
    const segSize = 1 / total;
    const start = i * segSize;
    const end = (i + 1) * segSize;
    return { text, start, end };
  });

  // 5. Cinematic visuals (Scale & Blur)
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.2]);

  return (
    <div
      ref={containerRef}
      style={{ height: "500vh", position: "relative" }}
      className="bg-dark"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-dark">
            {/* Spinner fallback */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-4xl mb-4"
            >☕</motion.div>
          </div>
        )}

        <motion.canvas
          ref={canvasRef}
          id="hero-canvas"
          style={{ scale }}
          className="absolute inset-0 w-full h-full object-cover z-0 origin-center"
        />

        {/* Hero Text Overlays */}
        {textSegments.map(({ text, start, end }, i) => (
          <ScrollText
            key={i}
            text={text}
            scrollProgress={smoothProgress}
            start={start}
            end={end}
            isOpeningFrame={i === 0}
            isMobile={isMobile}
          />
        ))}

        {/* Scroll Indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: isMobile ? "72px" : "40px",
            left: "50%",
            translateX: "-50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-[10px] tracking-[3px] uppercase text-text-muted font-sans">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-[1px] h-10 bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}

function ScrollText({
  text,
  scrollProgress,
  start,
  end,
  isOpeningFrame = false,
  isMobile = false,
}: {
  text: string;
  scrollProgress: MotionValue<number>;
  start: number;
  end: number;
  isOpeningFrame?: boolean;
  isMobile?: boolean;
}) {
  const fadeWindow = 0.05;
  const opacity = useTransform(
    scrollProgress,
    [start, start + fadeWindow, end - fadeWindow, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    [start, start + fadeWindow, end - fadeWindow, end],
    [40, 0, 0, -40]
  );

  const scale = useTransform(
    scrollProgress,
    [start, start + fadeWindow, end - fadeWindow, end],
    [0.9, 1, 1, 1.1]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: isMobile ? "flex-start" : isOpeningFrame ? "flex-start" : "center",
        justifyContent: isMobile ? "center" : isOpeningFrame ? "flex-start" : "center",
        opacity,
        y,
        scale,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {(isOpeningFrame || isMobile) && (
        <div className={`absolute inset-0 ${isMobile ? "bg-gradient-to-b from-black/20 via-black/10 to-black/55" : "bg-gradient-to-r from-black via-black/70 to-transparent"}`} />
      )}
      <h2
        className={
          isMobile
            ? "font-serif whitespace-pre-line text-center px-6 pt-32 max-w-[11ch] text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[#f2d7b1] drop-shadow-[0_0_28px_rgba(0,0,0,0.9)]"
            : isOpeningFrame
              ? "font-serif whitespace-pre-line text-left uppercase px-8 md:px-16 pt-24 md:pt-32 max-w-[7ch] text-5xl md:text-7xl lg:text-[7.5rem] font-semibold leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_0_35px_rgba(0,0,0,0.7)]"
              : "font-serif gradient-text text-center px-8 text-4xl md:text-7xl lg:text-9xl font-semibold leading-tight tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        }
      >
        {isMobile ? getMobileScrollText(text) : text}
      </h2>
    </motion.div>
  );
}
