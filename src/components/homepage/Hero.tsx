"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageTransition from "@/components/ui/PageTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/*
  Two photo sets: one for portrait screens (phones held upright, tablets upright)
  and one for landscape screens (desktops, laptops, phones turned sideways).

  Each photo has a "position": where the crop is anchored.
  "x y" with 0% = left/top, 50% = centre, 100% = right/bottom.

  Put tall photos in heroPortrait and wide photos in heroLandscape.
  The same photo can appear in both lists with different positions.
*/

// heroPortrait: used when the screen is taller than wide (phones held upright, tablets upright)
// Photo ratio: 3:4 (width:height), e.g. 1200 x 1600 px
// Keep the building in the middle; tall photos work best.
const heroPortrait = [
  { src: "/assets/images/Homepage/Hero.png", alt: "Architectural detail 1", position: "50% 50%" },
  { src: "/media/Hero/Image2.jpeg", alt: "Architectural detail 2", position: "50% 50%" },
  { src: "/media/Hero/Image3.jpeg", alt: "Architectural detail 3", position: "50% 50%" },
  { src: "/media/Hero/Image4.jpeg", alt: "Architectural detail 4", position: "50% 50%" },
  { src: "/media/Hero/Image5.jpeg", alt: "Architectural detail 5", position: "50% 50%" },
];
// heroLandscape: used when the screen is wider than tall (desktops, laptops, phones turned sideways)
// Photo ratio: 2:1 (width:height), e.g. 2400 x 1200 px
// Keep the building in the middle; wide photos work best.
const heroLandscape = [
  { src: "/assets/images/Homepage/Hero.png", alt: "Architectural detail 1", position: "50% 40%" },
  { src: "/media/Hero/Image2.jpeg", alt: "Architectural detail 2", position: "50% 50%" },
  { src: "/media/Hero/Image3.jpeg", alt: "Architectural detail 3", position: "50% 50%" },
  { src: "/media/Hero/Image4.jpeg", alt: "Architectural detail 4", position: "50% 50%" },
  { src: "/media/Hero/Image5.jpeg", alt: "Architectural detail 5", position: "50% 50%" },
];

const Hero = () => {
  const container = useRef<HTMLElement | null>(null);
  const imageMaskRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);

  // Watch the screen orientation and switch photo sets when it changes
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slides = isPortrait ? heroPortrait : heroLandscape;
  const index = activeImageIndex % slides.length;

  // Slideshow (paused for people who prefer reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  useGSAP(
    () => {
      if (!container.current || !imageMaskRef.current || !imageRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".hero-title-line", { yPercent: 110 });
        gsap.set(".hero-copy", { opacity: 0, y: 20 });
        gsap.set(".hero-cta", { opacity: 0, y: -12 });

        gsap
          .timeline({ defaults: { ease: "power4.out" }, delay: 0.25 })
          .to(".hero-title-line", { yPercent: 0, duration: 1, stagger: 0.12 })
          .to(".hero-copy", { opacity: 1, y: 0, duration: 0.75, stagger: 0.08 }, "-=0.45")
          .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, "-=0.55");

        gsap.fromTo(
          imageMaskRef.current,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out", delay: 0.35 }
        );

        // Subtle parallax: the inner layer is 120% tall, so it can drift without showing gaps
        gsap.fromTo(
          imageRef.current,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <PageTransition>
      <section
        ref={container}
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-white px-[12px] pb-[12px] pt-[52px] text-black md:px-[18px] md:pb-[18px] md:pt-[60px] lg:p-[20px]"
      >
        {/* Top block: title on the left, copy (and CTA on desktop) on the right */}
        <div className="relative z-20 flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-between">
          <h1
            className="font-bold uppercase leading-[0.82] tracking-tighter"
            style={{ fontSize: "clamp(2.75rem, min(10.5vw, 17svh), 8rem)" }}
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-title-line block">Detail</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-title-line block">Matters</span>
            </span>
          </h1>

          <div className="flex flex-col lg:items-end lg:justify-between lg:gap-6">
            {/* CTA: desktop only (mobile uses the MENU button in the header) */}
            <Link
              href="/contact"
              data-cursor="click"
              aria-label="Lets talk"
              className="hero-cta group relative hidden h-28 w-28 cursor-none lg:block xl:h-32 xl:w-32"
            >
              <span className="block h-full w-full transition-opacity duration-300 group-hover:opacity-40">
                <span className="absolute right-9 top-8 z-10 whitespace-nowrap text-base font-bold uppercase leading-none">
                  Lets talk
                </span>
                <span className="absolute right-0 top-0 block h-7 w-full bg-black" />
                <span className="absolute right-0 top-0 block h-full w-7 bg-black" />
              </span>
            </Link>

            <div className="grid w-full grid-cols-2 gap-4 md:ml-auto md:w-[min(30rem,70vw)] md:gap-7 lg:w-[min(30rem,36vw)]">
              <p className="hero-copy text-pretty font-bold leading-[1.25] text-[clamp(0.7rem,0.45rem+0.7vw,1rem)]">
                We design context‑driven architecture that transforms your vision into refined,
                built form.
              </p>
              <p className="hero-copy text-pretty font-bold leading-[1.25] text-[clamp(0.7rem,0.45rem+0.7vw,1rem)]">
                We make sure your details are in context. We make and build with care.
              </p>
            </div>
          </div>
        </div>

        {/* Image: takes all remaining height, so the bottom gap equals the padding */}
        <div
          ref={imageMaskRef}
          className="relative z-10 mt-[40px] md:mt-[60px] min-h-[38svh] flex-1 overflow-hidden bg-white"
        >
          <div ref={imageRef} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
            {slides.map((img, i) => (
              <Image
                key={`${isPortrait ? "p" : "l"}-${img.src}`}
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) calc(100vw - 40px), 100vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
                style={{ objectPosition: img.position }}
              />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Hero;
