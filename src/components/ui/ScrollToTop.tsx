"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  // 1. Automatically scroll to top when changing pages
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  // 2. Show button only after scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => lenis?.scrollTo(0)}
      className={`
        fixed bottom-8 right-8 z-50
        w-12 h-12 rounded-full border border-black/10 bg-white/50 backdrop-blur-md
        flex items-center justify-center text-black transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        hover:bg-black hover:text-white
      `}
    >
      <span className="text-xs font-mono uppercase font-bold">Up</span>
    </button>
  );
}
