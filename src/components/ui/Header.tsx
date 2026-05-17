"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenu } from '@/context/MenuProvider';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Header = () => {
  const menuContext = useMenu();
  const setIsOpen = menuContext?.setIsOpen;
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);

  useGSAP(() => {
    // 1. Reset logic: Ensure header is visible on sub-pages
    const hasVisited = sessionStorage.getItem("mgk_home_visited");
    if (pathname !== '/' || hasVisited) {
      gsap.set(headerRef.current, { clearProps: "all", autoAlpha: 1 });
    }

    // 2. Single source of truth for ScrollTriggers
    ScrollTrigger.getAll().forEach(t => t.kill());

    document.querySelectorAll('[data-header-theme="light"]').forEach((section, i) => {
      ScrollTrigger.create({
        id: `theme-${i}`,
        trigger: section,
        start: "top 5%",
        end: "bottom 5%",
        onToggle: (self) => setIsLightMode(self.isActive)
      });
    });

    ScrollTrigger.create({
      id: "footer-hide",
      trigger: "footer",
      start: "top 80%",
      onEnter: () => gsap.to(headerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.5 }),
      onLeaveBack: () => gsap.to(headerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.5 }),
    });

    ScrollTrigger.refresh();
  }, { dependencies: [pathname] });

  return (
    <header 
      ref={headerRef} 
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 py-8 md:px-12 bg-transparent pointer-events-none transition-colors duration-1000 ease-in-out ${isLightMode ? 'text-black' : 'text-white'}`} 
      style={{ '\zIndex': 1000 }}
    >
      <Link href="/" className="pointer-events-auto">
        <div className="flex gap-1 uppercase">
          <span className="font-extrabold">MGK</span>
          <span className="font-light">Architects</span>
        </div>
      </Link>
      
      <button className="group pointer-events-auto bg-transparent border-none cursor-pointer" onClick={() => setIsOpen?.(true)}>
        <span className="font-mono text-sm tracking-[2px] uppercase">Menu</span>
      </button>
    </header>
  );
};

export default Header;
