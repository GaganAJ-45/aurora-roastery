
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { siteConfig } from "@/config/site";
import { FRAME_FILENAMES } from "@/config/frames";

const FRAME_COUNT = FRAME_FILENAMES.length;
const OPENING_HERO_SRC = "/hero_coffee.png";
const OPENING_SEGMENT_END = 1 / siteConfig.heroScrollTexts.length;
const MOBILE_FRAME_STEP = 4;
const MOBILE_SCROLL_HEIGHT = "320vh";
const DESKTOP_SCROLL_HEIGHT = "500vh";

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
  const [activeFrameCount, setActiveFrameCount] = useState(FRAME_COUNT);
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
    const openingImg = new Image();
    openingImg.src = OPENING_HERO_SRC;
    openingImg.onload = () => setOpeningImage(openingImg);
    openingImg.onerror = () => setOpeningImage(null);
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

  useEffect(() => {
    let loadedCount = 0;
    const frameIndexes = isMobile
      ? FRAME_FILENAMES.map((_, index) => index).filter((index) => index % MOBILE_FRAME_STEP === 0)
      : FRAME_FILENAMES.map((_, index) => index);
    const preloadedImages: HTMLImageElement[] = [];

    setLoaded(false);

    frameIndexes.forEach((frameIndex, i) => {
      const img = new Image();
      img.src = `/frames/${FRAME_FILENAMES[frameIndex]}`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameIndexes.length) {
          setImages(preloadedImages);
          setActiveFrameCount(preloadedImages.length);
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameIndexes.length) {
          setImages(preloadedImages);
          setActiveFrameCount(preloadedImages.length);
          setLoaded(true);
        }
      };
      preloadedImages[i] = img;
    });
  }, [isMobile]);

  // 3. Canvas Rendering Logic
  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderFrame = (progress: number) => {
      const useOpeningImage = progress <= OPENING_SEGMENT_END && openingImage;
      const frameIndex = Math.min(
        activeFrameCount - 1,
        Math.floor(progress * activeFrameCount)
      );

      const img = useOpeningImage ? openingImage : images[frameIndex];
      if (!img) return;

      // Full screen (h-screen w-full)
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const dpr = isMobile ? 1 : Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(canvasWidth * dpr);
      canvas.height = Math.floor(canvasHeight * dpr);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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

    const progressSource = isMobile ? scrollYProgress : smoothProgress;
    let ticking = false;
    let latestProgress = progressSource.get();

    const paint = () => {
      ticking = false;
      renderFrame(latestProgress);
    };

    // Initial render
    renderFrame(latestProgress);

    // Listen to scroll changes and paint via RAF for smoother touch scrolling
    const unsubscribe = progressSource.on("change", (latest) => {
      latestProgress = latest;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(paint);
      }
    });

    // Handle resize
    const handleResize = () => renderFrame(progressSource.get());
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [activeFrameCount, isMobile, loaded, images, openingImage, scrollYProgress, smoothProgress]);

  // 4. Text Overlay logic
  const displayTexts = isMobile ? siteConfig.heroScrollTexts.slice(0, 5) : siteConfig.heroScrollTexts;
  const textSegments = displayTexts.map((text, i) => {
    const total = displayTexts.length;
    const segSize = 1 / total;
    const start = i * segSize;
    const end = (i + 1) * segSize;
    return { text, start, end };
  });

  // 5. Cinematic visuals (Scale & Blur)
  const progressSource = isMobile ? scrollYProgress : smoothProgress;
  const scale = useTransform(progressSource, [0, 1], [1, isMobile ? 1.06 : 1.2]);

  return (
    <div
      ref={containerRef}
      style={{ height: isMobile ? MOBILE_SCROLL_HEIGHT : DESKTOP_SCROLL_HEIGHT, position: "relative", touchAction: "pan-y pinch-zoom" }}
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent z-[9]" />

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
