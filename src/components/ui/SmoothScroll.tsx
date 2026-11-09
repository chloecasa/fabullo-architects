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
        // Continuous follow: the page trails your input and never hits a hard stop.
        // A lower value gives a softer, slower settle.
        lerp: 0.06,
        // Each wheel notch moves less, so sections take more scrolling to pass.
        wheelMultiplier: 0.7,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tickerLag);
    }

    gsap.ticker.lagSmoothing(0);

    // Sort and refresh so the sections are measured in the right order
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 1000);

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
