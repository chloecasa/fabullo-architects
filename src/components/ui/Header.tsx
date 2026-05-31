// src/components/Header.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenu } from '@/components/context/MenuProvider';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Header = () => {
  const menuContext = useMenu();
  const isOpen = menuContext?.isOpen; 
  const setIsOpen = menuContext?.setIsOpen;
  
  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // States: Tracks scroll threshold and dynamic width safely
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [containerWidth, setContainerWidth] = useState("360px");

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Safe window-width resizing tracker to prevent SSR compilation crashes
  useEffect(() => {
    if (!isReady) return;

    const handleResize = () => {
      if (isScrolled) {
        setContainerWidth(window.innerWidth < 768 ? "256px" : "288px"); // Scrolled compact pill width [3]
      } else {
        setContainerWidth(window.innerWidth < 768 ? "310px" : "360px"); // Hero transparent links width [3]
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isScrolled, isReady]);

  const { contextSafe } = useGSAP({ scope: headerRef });

  // Hover Animation Logic for the Hamburger icon lines
  const onHover = contextSafe(() => {
    gsap.to(".menu-line", {
      width: (i) => (i % 2 === 0 ? "100%" : "70%"),
      stagger: 0.05, 
      duration: 0.4, 
      ease: "power2.out"
    });
  });

  const onHoverLeave = contextSafe(() => {
    gsap.to(".menu-line", {
      width: "100%",
      stagger: 0.05, 
      duration: 0.4, 
      ease: "power2.inOut"
    });
  });

  // GSAP Morph Timeline: Animates styles, width, position, and element visibility [3]
  useGSAP(() => {
    if (!isReady || !containerRef.current || !headerRef.current) return;

    if (isScrolled) {
      // Scrolled State: Shift down to top-6 (24px) [3]
      gsap.to(headerRef.current, {
        top: "24px", // Matches top-6
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(containerRef.current, {
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(0, 0, 0, 0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        width: window.innerWidth < 768 ? "256px" : "288px",
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(".brand-logo", {
        opacity: 1,
        x: 0,
        autoAlpha: 1,
        duration: 0.3,
        display: "flex",
        delay: 0.1,
        overwrite: "auto",
      });
      gsap.to(".hamburger-btn", {
        opacity: 1,
        x: 0,
        autoAlpha: 1,
        duration: 0.3,
        display: "flex",
        delay: 0.1,
        overwrite: "auto",
      });
      gsap.to(".inline-links", {
        opacity: 0,
        x: 15,
        autoAlpha: 0,
        duration: 0.3,
        display: "none",
        overwrite: "auto",
      });
    } else {
      // Hero State: Shift up to top-2 (8px) [3]
      gsap.to(headerRef.current, {
        top: "8px", // Matches top-2
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(containerRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderColor: "rgba(255, 255, 255, 0)",
        boxShadow: "none",
        width: window.innerWidth < 768 ? "310px" : "360px",
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(".brand-logo", {
        opacity: 0,
        x: -15,
        autoAlpha: 0,
        duration: 0.3,
        display: "none",
        overwrite: "auto",
      });
      gsap.to(".hamburger-btn", {
        opacity: 0,
        x: 15,
        autoAlpha: 0,
        duration: 0.3,
        display: "none",
        overwrite: "auto",
      });
      gsap.to(".inline-links", {
        opacity: 1,
        x: 0,
        autoAlpha: 1,
        duration: 0.3,
        display: "inline-flex",
        width: "100%",
        justifyContent: "center",
        delay: 0.1,
        overwrite: "auto",
      });
    }
  }, { dependencies: [isScrolled, isReady], scope: headerRef });

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

        // Toggle Morph State based on scroll threshold [3]
        if (currentScrollY < 100) {
          setIsScrolled(false);
        } else {
          setIsScrolled(true);
        }

        // Toggle Header Hide/Show Visibility based on scroll direction [3]
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
    <header ref={headerRef} className="fixed top-2 left-1/2 z-9999 pointer-events-auto">
      {/* Morph Container: Background opacity and shadows transition dynamically [1.1.7, 3] */}
      <div 
        ref={containerRef} 
        style={{
          width: containerWidth,
          backgroundColor: isReady ? (isScrolled ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)") : "rgba(255, 255, 255, 0)",
          borderColor: isReady ? (isScrolled ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0)") : "rgba(255, 255, 255, 0)",
          boxShadow: isReady ? (isScrolled ? "0px 4px 20px rgba(0, 0, 0, 0.1)" : "none") : "none"
        }}
        className="h-11 flex justify-between items-center px-5 overflow-hidden"
      >
        {/* Brand Logo Link (Hidden in Hero State, transitions to visible) [3] */}
        <Link href="/" className="brand-logo flex items-center shrink-0 hidden">
          <div className="flex gap-1 uppercase text-[10px] md:text-[11px] tracking-widest font-bold font-sans">
            <span>MGK</span>
            <span className="font-light opacity-70">ARCHITECTS</span>
          </div>
        </Link>

        {/* State A: Centered Inline Navigation Links (Visible in Hero State) [3] */}
        <nav className="inline-links justify-center items-center gap-5 md:gap-6 whitespace-nowrap font-sans flex w-full">
          <Link href="/projects" className="text-black text-xs font-bold uppercase tracking-wider hover:opacity-50 transition-opacity">Projects</Link>
          <Link href="/journal" className="text-black text-xs font-bold uppercase tracking-wider hover:opacity-50 transition-opacity">Journal</Link>
          <Link href="/profile" className="text-black text-xs font-bold uppercase tracking-wider hover:opacity-50 transition-opacity">Profile</Link>
          <Link href="/contact" className="text-black text-xs font-bold uppercase tracking-wider hover:opacity-50 transition-opacity">Contact</Link>
        </nav>

        {/* State B: Hamburger Button (Hidden in Hero State, transitions to visible) [3] */}
        <button 
          className="hamburger-btn w-7 h-4 flex flex-col justify-between items-end cursor-pointer group hidden"
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
