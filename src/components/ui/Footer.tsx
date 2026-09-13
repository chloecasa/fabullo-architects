"use client";

import React, { useRef } from "react";
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
  const mgkRef = useRef<HTMLSpanElement>(null);
  const architectsRef = useRef<HTMLSpanElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

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
        {
          scale: 0.35,
          yPercent: 65,
          opacity: 0,
        },
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
        architectsRef.current,
        {
          scale: 0.35,
          xPercent: 45,
          yPercent: 65,
          opacity: 0,
        },
        {
          scale: 1,
          xPercent: 0,
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
        {
          yPercent: 100,
          opacity: 0,
        },
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
      className="relative z-0 h-screen min-h-[760px] w-full overflow-hidden border-none bg-black text-white shadow-none"
    >
      <div ref={contentRef} className="relative h-full w-full">
        <Link
          href="/contact"
          className="absolute left-5 top-10 flex items-center gap-3 text-5xl font-semibold uppercase transition-opacity hover:opacity-50"
        >
          Lets talk
          <span className="text-6xl leading-none">↗</span>
        </Link>

        <nav className="absolute left-[61vw] top-10 flex flex-col gap-5 text-2xl font-semibold uppercase">
          <Link href="/" className="transition-opacity hover:opacity-50">
            Home
          </Link>
          <Link href="/projects" className="transition-opacity hover:opacity-50">
            Projects
          </Link>
          <Link href="/profile" className="transition-opacity hover:opacity-50">
            Profile
          </Link>
          <Link href="/journal" className="transition-opacity hover:opacity-50">
            Journal
          </Link>
          <Link href="/contact" className="transition-opacity hover:opacity-50">
            Contact
          </Link>
        </nav>

        <div className="absolute left-[81vw] top-10 flex flex-col gap-5 text-2xl font-semibold uppercase">
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-50"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-50"
          >
            Facebook
          </a>
          <Link href="/contact" className="transition-opacity hover:opacity-50">
            Contact
          </Link>
          <a
            href="mailto:hello@mgkarchitects.com"
            className="transition-opacity hover:opacity-50"
          >
            Email
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-50"
          >
            X
          </a>
        </div>

        <div className="absolute bottom-12 left-5 flex items-end whitespace-nowrap font-bold uppercase leading-[0.72] tracking-[-0.06em]">
          <span
            ref={mgkRef}
            className="inline-block origin-bottom-left text-[clamp(8rem,26vw,376px)]"
          >
            FABULLO
          </span>
    
        </div>
      </div>

      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 h-12 w-full overflow-hidden border-t border-white/70 bg-black font-['LT_Superior'] text-[10px] font-normal uppercase text-white"
      >
        <div className="absolute left-[21px] top-[20px] normal-case">
          © FABULLO ARCHITECTS / 2025
        </div>

        <Link
          href="/privacy"
          className="absolute right-[185px] top-[20px] transition-opacity hover:opacity-50"
        >
          Privacy Policy
        </Link>

        <Link
          href="/terms"
          className="absolute right-[20px] top-[20px] transition-opacity hover:opacity-50"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
