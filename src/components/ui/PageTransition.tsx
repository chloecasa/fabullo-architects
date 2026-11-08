"use client";
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Skip the zoom for users who asked for reduced motion; keep the fade
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        container.current,
        {
          opacity: 0,
          scale: reduce ? 1 : 1.02, // Starts slightly zoomed in
        },
        {
          opacity: 1,
          scale: 1,
          duration: reduce ? 0.6 : 1.2,
          ease: "power2.out",
        }
      );
    },
    { scope: container }
  );

  return <div ref={container}>{children}</div>;
}
