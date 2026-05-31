"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageTransition from "@/components/ui/PageTransition";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const container = useRef(null);
  const imageMaskRef = useRef(null);
  const imageRef = useRef(null);
useGSAP(
  () => {
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
            <h1 className="hero-title-line text-[clamp(5rem,12vw,128px)] font-bold uppercase leading-[0.82] tracking-[-0.05em]">
              Detail
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1 className="hero-title-line text-[clamp(5rem,12vw,128px)] font-bold uppercase leading-[0.82] tracking-[-0.05em]">
              Matters
            </h1>
          </div>
        </div>

        {/* Main Statement */}
        <p className="hero-copy absolute left-[38vw] top-[22.5vh] z-20 w-[36.6vw] max-w-[520px] text-xl font-bold leading-none text-black/70">
           A team of multi-award winning architects based in Sydney, Australia.
        </p>

        {/* Lower Copy */}
        <p className="hero-copy absolute left-[60.5vw] top-[43vh] z-20 w-64 text-justify text-base font-medium leading-none">
          We design context-driven architecture that transforms your vision into
          refined, built form.
        </p>

        <p className="hero-copy absolute left-[80.2vw] top-[43vh] z-20 w-64 text-justify text-base font-medium leading-none">
          We make sure your details are in context. We make and build with care.
        </p>

        {/* CTA Corner Button */}
        <Link
  href="/contact"
  data-cursor="click"
  className="hero-cta group absolute right-5 top-5 z-40 block h-36 w-36 cursor-none"
  aria-label="Lets talk"
>
  <div className="relative h-full w-full transition-opacity duration-300 group-hover:opacity-40">
    <span className="absolute right-8 top-9 z-10 text-base font-bold uppercase leading-none">
      Let's talk
    </span>

    <span className="absolute right-0 top-0 block h-8 w-32 bg-black" />
    <span className="absolute right-0 top-0 block h-32 w-8 bg-black" />
  </div>
</Link>

        {/* Bottom Image */}
        <div
  ref={imageMaskRef}
  className="absolute bottom-0 left-0 z-10 h-[48.75vh] w-full overflow-hidden bg-white"
>
  <Image
    ref={imageRef}
    src="/assets/images/hero.png"
    alt="Architectural detail"
    fill
    priority
    className="object-cover will-change-transform"
  />
</div>
      </section>
    </PageTransition>
  );
};

export default Hero;
