"use client";
import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const container = React.useRef(null);

  useGSAP(() => {
    // This runs every time the route changes (because the component re-mounts)
    gsap.fromTo(container.current, 
  { 
    opacity: 0, 
    scale: 1.02, // Starts slightly zoomed in
  }, 
  { 
    opacity: 1, 
    scale: 1, 
    duration: 1.2, // A bit slower for elegance
    ease: "power2.out" 
  }
);
  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
