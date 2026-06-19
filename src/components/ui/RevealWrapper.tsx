"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const RevealWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
   const ctx = gsap.context(() => {
      // Find all elements with class "reveal-item" inside this wrapper
      const items = gsap.utils.toArray(".reveal-item");

      gsap.set(items, { yPercent: 110 });

      gsap.to(items, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 95%",
          end: "bottom 10%",
          toggleActions: "restart reverse restart reverse",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
};
