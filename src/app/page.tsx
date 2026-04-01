"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import CraftSection from "@/components/CraftSection";
import SeasonalSection from "@/components/SeasonalSection";
import RewardsSection from "@/components/RewardsSection";
import ReviewsSection from "@/components/ReviewsSection";
import LocationsSection from "@/components/LocationsSection";
import AISection from "@/components/AISection";
import Footer from "@/components/Footer";

// Dynamic import for the heavy canvas component
const ScrollCanvas = dynamic(() => import("@/components/ScrollCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "500vh",
        background: "linear-gradient(180deg, #0A0705, #1C1510)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "100px",
      }}
    />
  ),
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {loaded && (
        <main
          style={{
            opacity: 1,
            animation: "fadeInUp 0.8s ease forwards",
          }}
        >

          {/* Scroll canvas hero — 500vh sticky animation */}
          <ScrollCanvas />

          {/* Hero CTA */}
          <HeroSection />

          {/* Our Craft — blends + features */}
          <CraftSection />

          {/* Seasonal drinks */}
          <SeasonalSection />

          {/* Rewards program */}
          <RewardsSection />

          {/* Reviews */}
          <ReviewsSection />

          {/* Store locator */}
          <LocationsSection />

          {/* AI recommendation */}
          <AISection />

          {/* Footer */}
          <Footer />
        </main>
      )}
    </>
  );
}
