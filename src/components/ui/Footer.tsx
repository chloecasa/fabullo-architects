// src/components/ui/Footer.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import RollLink from "@/components/ui/RollLink";
import ParticleBrand from "@/components/ui/ParticleBrand";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandWrapRef = useRef<HTMLDivElement>(null);
  const mgkRef = useRef<HTMLSpanElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Keep ScrollTrigger in step with smooth scrolling
  useLenis(() => ScrollTrigger.update());

  // Page height changes late (images, maps, fonts), so measure again after each page change
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [50, 300, 800, 1800].map((ms) => window.setTimeout(refresh, ms));

    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  // Any later change in page height refreshes too
  useEffect(() => {
    let timer: number | undefined;
    let lastHeight = document.documentElement.scrollHeight;

    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const height = document.documentElement.scrollHeight;
        if (height === lastHeight) return;
        lastHeight = height;
        ScrollTrigger.refresh();
      }, 120);
    });

    observer.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Fit FABULLO to the full width of its wrapper (the footer minus 20px each side) on every screen
  useLayoutEffect(() => {
    const fit = () => {
      const wrap = brandWrapRef.current;
      const brand = mgkRef.current;
      if (!wrap || !brand) return;

      brand.style.fontSize = "100px";
      const natural = brand.offsetWidth; // ignores GSAP transforms
      if (!natural) return;
      brand.style.fontSize = `${(wrap.clientWidth / natural) * 100}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { y: -300 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        mgkRef.current,
        { scale: 0.35, yPercent: 65, opacity: 0 },
        {
          scale: 1,
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        bottomBarRef.current,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <footer
      ref={containerRef}
      className="relative z-0 flex min-h-svh w-full flex-col overflow-hidden border-none bg-black text-white shadow-none md:h-svh md:min-h-[760px]"
    >
      <div
        ref={contentRef}
        className="relative flex flex-1 flex-col gap-10 px-5 pt-12 pb-20 md:absolute md:inset-0 md:h-full md:gap-0 md:p-0"
      >
        {/* Call to action */}
        <RollLink
          href="/contact"
          className="flex items-center gap-2 text-3xl font-semibold uppercase sm:text-4xl md:absolute md:left-5 md:top-10 md:gap-3 md:text-5xl"
        >
          Lets talk
          <span className="text-4xl leading-none md:text-6xl">↗</span>
        </RollLink>

        {/* Nav + social: two columns on phones, fixed columns on desktop */}
        <div className="flex justify-between gap-8 md:block">
          <nav className="flex flex-col text-lg font-semibold uppercase sm:text-xl md:absolute md:left-[61vw] md:top-10 md:gap-5 md:text-2xl">
            <RollLink href="/" className="block py-2.5 md:py-0">Home</RollLink>
            <RollLink href="/projects" className="block py-2.5 md:py-0">Projects</RollLink>
            <RollLink href="/profile" className="block py-2.5 md:py-0">Profile</RollLink>
            <RollLink href="/contact" className="block py-2.5 md:py-0">Contact</RollLink>
          </nav>

          <div className="flex flex-col text-lg font-semibold uppercase sm:text-xl md:absolute md:left-[81vw] md:top-10 md:gap-5 md:text-2xl">
            <RollLink href="https://instagram.com/yourhandle" className="block py-2.5 md:py-0">Instagram</RollLink>
            <RollLink href="https://facebook.com" className="block py-2.5 md:py-0">Facebook</RollLink>
            <RollLink href="mailto:hello@mgkarchitects.com" className="block py-2.5 md:py-0">Email</RollLink>
            <RollLink href="https://x.com" className="block py-2.5 md:py-0">X</RollLink>
          </div>
        </div>

        {/* Brand name: fitted to the full width with 20px padding on each side */}
        <div
          ref={brandWrapRef}
                    className="mt-auto flex w-full items-end whitespace-nowrap font-bold uppercase leading-[0.72] tracking-[-0.06em] md:absolute md:bottom-12 md:left-5 md:right-5 md:mt-0 md:w-auto"
        >
          <span ref={mgkRef} className="relative inline-block origin-bottom-left text-[20vw]">
            FABULLO
            <ParticleBrand spanRef={mgkRef} text="FABULLO" />
          </span>
        </div>
      </div>

      {/* Bottom bar: stacked with a small gap on phones, one row on desktop */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 flex w-full flex-col gap-1.5 border-t border-white/70 bg-black px-5 py-3 font-['LT_Superior'] text-[10px] font-normal uppercase text-white md:h-12 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0"
      >
        <div className="normal-case">© FABULLO ARCHITECTS / 2025</div>

        <div className="flex gap-3 md:gap-6">
          <RollLink href="/privacy">Privacy Policy</RollLink>
          <RollLink href="/terms">Terms of Service</RollLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
