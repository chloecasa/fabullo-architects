// src/components/ui/Footer.tsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandWrapRef = useRef<HTMLDivElement>(null);
  const mgkRef = useRef<HTMLSpanElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // On phones, scale the brand so its width matches the wrapper (screen minus 20px each side)
  useLayoutEffect(() => {
    const fit = () => {
      const wrap = brandWrapRef.current;
      const brand = mgkRef.current;
      if (!wrap || !brand) return;

      // Desktop keeps the Tailwind sizes, so clear the inline size there
      if (window.matchMedia("(min-width: 768px)").matches) {
        brand.style.fontSize = "";
        return;
      }

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
        <Link
          href="/contact"
          className="flex items-center gap-2 text-3xl font-semibold uppercase transition-opacity hover:opacity-50 sm:text-4xl md:absolute md:left-5 md:top-10 md:gap-3 md:text-5xl"
        >
          Lets talk
          <span className="text-4xl leading-none md:text-6xl">↗</span>
        </Link>

        {/* Nav + social: two columns on phones, fixed columns on desktop */}
        <div className="flex justify-between gap-8 md:block">
          <nav className="flex flex-col text-lg font-semibold uppercase sm:text-xl md:absolute md:left-[61vw] md:top-10 md:gap-5 md:text-2xl">
            <Link href="/" className="py-2.5 transition-opacity hover:opacity-50 md:py-0">
              Home
            </Link>
            <Link href="/projects" className="py-2.5 transition-opacity hover:opacity-50 md:py-0">
              Projects
            </Link>
            <Link href="/profile" className="py-2.5 transition-opacity hover:opacity-50 md:py-0">
              Profile
            </Link>
            <Link href="/contact" className="py-2.5 transition-opacity hover:opacity-50 md:py-0">
              Contact
            </Link>
          </nav>

          <div className="flex flex-col text-lg font-semibold uppercase sm:text-xl md:absolute md:left-[81vw] md:top-10 md:gap-5 md:text-2xl">
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 transition-opacity hover:opacity-50 md:py-0"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 transition-opacity hover:opacity-50 md:py-0"
            >
              Facebook
            </a>
            <Link href="/contact" className="py-2.5 transition-opacity hover:opacity-50 md:py-0">
              Contact
            </Link>
            <a
              href="mailto:hello@mgkarchitects.com"
              className="py-2.5 transition-opacity hover:opacity-50 md:py-0"
            >
              Email
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 transition-opacity hover:opacity-50 md:py-0"
            >
              X
            </a>
          </div>
        </div>

        {/* Brand name: full width on phones (fitted by script), fixed size on desktop */}
        <div
          ref={brandWrapRef}
          className="mt-auto flex w-full items-end whitespace-nowrap font-bold uppercase leading-[0.72] tracking-[-0.06em] md:absolute md:bottom-12 md:left-5 md:mt-0 md:w-auto"
        >
          <span
            ref={mgkRef}
            className="inline-block origin-bottom-left md:text-[15vw] xl:text-[clamp(8rem,15vw,300px)]"
          >
            FABULLO
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
          <Link href="/privacy" className="transition-opacity hover:opacity-50">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-opacity hover:opacity-50">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
