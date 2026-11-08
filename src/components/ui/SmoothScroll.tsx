"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register here to be safe
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    const tickerLag = (time: number) => {
      lenis?.raf(time * 1000);
    };

    // Smooth scrolling is off for users who asked for reduced motion
    if (!reduce) {
      lenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tickerLag);
    }

    gsap.ticker.lagSmoothing(0);

    // CRITICAL: Sort and Refresh
    // This ensures that IntroSequence (Top) is calculated before UnifiedTransition (Bottom)
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 1000); // Increased delay slightly to ensure Hero images are loaded

    return () => {
      clearTimeout(refreshTimer);
      if (lenis) {
        lenis.destroy();
        gsap.ticker.remove(tickerLag);
      }
    };
  }, []);

  return <>{children}</>;
}
