"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// A white panel sits over the image. As the section comes in, the panel slides
// off to the right, so the image is revealed from left to right. Scrolling back up
// slides it back over the image. Only transform is animated, so it stays on the GPU.
export function setupScrollWipe(
  trigger: HTMLElement,
  panel: HTMLElement,
  options?: { start?: string; end?: string }
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    gsap.set(panel, { xPercent: 100 });
    return null;
  }

  return gsap.fromTo(
    panel,
    { xPercent: 0 },
    {
      xPercent: 100,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 85%",
        end: options?.end ?? "top 25%",
        // Light smoothing removes stutter without adding noticeable delay
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    }
  );
}
