"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenu } from '@/context/MenuProvider';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';


if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const Header = () => {
  const menuContext = useMenu();
  const isOpen = menuContext?.isOpen; 
  const setIsOpen = menuContext?.setIsOpen;
  
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { contextSafe } = useGSAP({ scope: headerRef });

  // Hover Animation Logic
  const onHover = contextSafe(() => {
    gsap.to(".menu-line", {
      width: (i) => (i % 2 === 0 ? "100%" : "70%"),
      stagger: 0.05, duration: 0.4, ease: "power2.out"
    });
  });

  const onHoverLeave = contextSafe(() => {
    gsap.to(".menu-line", {
      width: "100%",
      stagger: 0.05, duration: 0.4, ease: "power2.inOut"
    });
  });

  useEffect(() => {
  if (isOpen || !headerRef.current) return;

  const header = headerRef.current;
  let lastScrollY = window.scrollY;
  let ticking = false;

  gsap.set(header, { yPercent: -150, xPercent: -50, autoAlpha: 0 });

  const hasVisited =
    typeof window !== "undefined"
      ? sessionStorage.getItem("hasVisitedHome")
      : null;

  const entryDelay = pathname === "/" && !hasVisited ? 3.8 : 0.5;

  gsap.to(header, {
    yPercent: 0,
    autoAlpha: 1,
    duration: 1,
    ease: "power4.out",
    delay: entryDelay,
  });

  const showHeader = () => {
    gsap.to(header, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const hideHeader = () => {
    gsap.to(header, {
      yPercent: -150,
      autoAlpha: 0,
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const handleScroll = () => {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const footer = document.querySelector("footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const footerVisible = footerTop < window.innerHeight * 0.95;

      if (currentScrollY < 80) {
        showHeader();
      } else if (footerVisible) {
        hideHeader();
      } else if (scrollingDown) {
        hideHeader();
      } else {
        showHeader();
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });

    ticking = true;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  };
}, [pathname, isOpen]);

  if (isOpen) return null;

  return (
    <header ref={headerRef} className="fixed top-8 left-1/2 z-9999 pointer-events-auto">
      <div className="w-64 md:w-72 h-11 bg-white text-black flex justify-between items-center px-5 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-black/5">
        <Link href="/" className="flex items-center">
          <div className="flex gap-1 uppercase text-[11px] tracking-widest font-bold">
            <span>MGK</span>
            <span className="font-light opacity-70">ARCHITECTS</span>
          </div>
        </Link>
        <button 
          className="w-7 h-4 flex flex-col justify-between items-end cursor-pointer group"
          onMouseEnter={onHover}
          onMouseLeave={onHoverLeave}
          onClick={() => setIsOpen?.(true)}
        >
          <div className="menu-line block w-full h-[1.5px] bg-black origin-right"></div>
          <div className="menu-line block w-full h-[1.5px] bg-black origin-right"></div>
          <div className="menu-line block w-full h-[1.5px] bg-black origin-right"></div>
          <div className="menu-line block w-full h-[1.5px] bg-black origin-right"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;
