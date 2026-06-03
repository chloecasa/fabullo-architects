"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageTransition from "@/components/ui/PageTransition";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const heroImages = [
  "/assets/images/Homepage/Hero.png",
  "/assets/images/Homepage/Hero.png",
  "/assets/images/Homepage/Hero.png",
];

const Hero = () => {
  const container = useRef<HTMLElement | null>(null);
  const imageMaskRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (!container.current || !imageMaskRef.current || !imageRef.current) {
        return;
      }

      gsap.set(".hero-title-line", { yPercent: 110 });
      gsap.set(".hero-copy", { opacity: 0, y: 20 });
      gsap.set(".hero-cta", { opacity: 0, y: -12 });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.25,
      });

      tl.to(".hero-title-line", {
        yPercent: 0,
        duration: 1,
        stagger: 0.12,
      })
        .to(
          ".hero-copy",
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
          },
          "-=0.45"
        )
        .to(
          ".hero-cta",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.55"
        );

      gsap.fromTo(
        imageMaskRef.current,
        {
          clipPath: "inset(0% 100% 0% 0%)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.out",
          delay: 0.35,
        }
      );

      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.05,
        },
        {
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
          delay: 0.35,
        }
      );

      gsap.to(imageRef.current, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <PageTransition>
      <section
        ref={container}
        className="relative h-screen w-full overflow-hidden bg-white text-black"
      >
        {/* Title */}
<div className="absolute left-5 top-5 z-20">
  <div className="overflow-hidden">
    <h1 className="hero-title-line pr-4 pb-2 text-[clamp(5rem,12vw,128px)] md:text-8xl lg:text-[clamp(5rem,12vw,128px)] font-bold uppercase leading-[0.82] tracking-tighter">
      Detail
    </h1>
  </div>

  <div className="overflow-hidden">
    <h1 className="hero-title-line pr-4 pb-2 text-[clamp(5rem,12vw,128px)] md:text-8xl lg:text-[clamp(5rem,12vw,128px)] font-bold uppercase leading-[0.82] tracking-tighter">
      Matters
    </h1>
  </div>
</div>

{/* Lower Copy */}
<p className="hero-copy absolute left-[60.5vw] top-[41.5vh] z-20 w-64 text-justify text-base font-medium leading-none md:left-[269px] md:top-[457px] md:w-56 md:text-sm lg:left-[60.5vw] lg:top-[41.5vh] lg:w-64 lg:text-base">
  Design context-driven architecture that transforms your vision into refined,
  built form.
</p>

<p className="hero-copy absolute left-[80.2vw] top-[41.5vh] z-20 w-64 text-justify text-base font-medium leading-none md:left-[520px] md:top-[458px] md:w-56 md:text-sm lg:left-[80.2vw] lg:top-[41.5vh] lg:w-64 lg:text-base">
  We make sure your details are in context. We make and build with care.
</p>

{/* CTA Corner Button - desktop/mobile */}
<Link
  href="/contact"
  data-cursor="click"
  className="hero-cta group absolute right-5 top-5 z-40 block h-36 w-36 cursor-none md:hidden lg:block"
  aria-label="Lets talk"
>
  <div className="relative h-full w-full transition-opacity duration-300 group-hover:opacity-40">
    <span className="absolute right-10.5 top-10 z-10 text-base font-bold uppercase leading-none">
      Let's talk
    </span>

    <span className="absolute right-0 top-0 block h-8 w-32 bg-black" />
    <span className="absolute right-0 top-0 block h-32 w-8 bg-black" />
  </div>
</Link>

{/* Bottom Image */}
<div
  ref={imageMaskRef}
  className="absolute bottom-5 left-5 right-5 z-10 h-[48vh] overflow-hidden bg-white md:h-[482px] lg:h-[48vh]"
>
          <div ref={imageRef} className="relative h-full w-full will-change-transform">
            {heroImages.map((imageSrc, index) => (
              <Image
                key={`${imageSrc}-${index}`}
                src={imageSrc}
                alt={`Architectural detail ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  index === activeImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Hero;
