"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IntroSequence: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const title = section.querySelector<HTMLElement>(".intro-title");
      const firstText = section.querySelector<HTMLElement>(".intro-text-one");
      const firstLine = section.querySelector<HTMLElement>(".intro-line-one");
      const image = section.querySelector<HTMLElement>(".intro-image");
      const secondText = section.querySelector<HTMLElement>(".intro-text-two");
      const secondLine = section.querySelector<HTMLElement>(".intro-line-two");

      if (!title || !firstText || !firstLine || !image || !secondText || !secondLine) {
        return;
      }

      gsap.fromTo(
        title,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: title,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        firstText,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: firstText,
            start: "top 90%",
            end: "top 65%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        firstLine,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: firstLine,
            start: "top 92%",
            end: "top 72%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        image,
        {
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 1.04,
        },
        {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top 92%",
            end: "top 62%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        secondText,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: secondText,
            start: "top 90%",
            end: "top 65%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        secondLine,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: secondLine,
            start: "top 92%",
            end: "top 72%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onToggle: (self) => {
          const header = document.getElementById("main-header");

          if (!header) return;

          if (self.isActive) {
            header.classList.add("text-black");
            header.classList.remove("text-white");
          } else {
            header.classList.remove("text-black");
            header.classList.add("text-white");
          }
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full overflow-hidden bg-white text-black"
    >
      <div className="relative mx-auto min-h-screen w-full max-w-[1440px] px-5 py-20 lg:h-[1523px] lg:px-0 lg:py-0">
        <Link
          href="/profile"
          className="intro-title block font-['LT_Superior'] text-[clamp(2rem,6vw,74px)] font-bold uppercase leading-[0.85] text-black transition-opacity duration-300 hover:opacity-40 will-change-transform lg:absolute lg:left-[20px] lg:top-[208px] lg:w-[520px]"
        >
          WHAT WE DO
        </Link>

        <div className="intro-text-one mt-16 w-full text-justify font-['LT_Superior'] text-3xl font-bold leading-tight text-black will-change-transform lg:absolute lg:left-[710px] lg:top-[208px] lg:mt-0 lg:w-[713px] lg:text-4xl">
          We design refined, context-driven homes and commercial spaces shaped
          by clarity, craftsmanship, and purpose. We focus on what you need, how
          you live, and how your site works.
        </div>

        <div className="intro-line-one mt-12 h-px w-full origin-left bg-black lg:absolute lg:left-[707px] lg:top-[456px] lg:mt-0 lg:w-[713px]" />

        <img
          src="https://placehold.co/473x583"
          alt="Architectural detail"
          className="intro-image mt-20 h-auto w-full object-cover will-change-[clip-path,transform] lg:absolute lg:left-[20px] lg:top-[752px] lg:mt-0 lg:h-[583px] lg:w-[473px]"
        />

        <div className="intro-text-two mt-16 w-full text-justify font-['LT_Superior'] text-3xl font-bold leading-tight text-black will-change-transform lg:absolute lg:left-[710px] lg:top-[752px] lg:mt-0 lg:w-[710px] lg:text-4xl">
          Every project is guided by context, material clarity, and functional
          precision. From first sketch to final detail, we deliver architecture
          that is responsive, enduring, and built to a high standard.
        </div>

        <div className="intro-line-two mt-12 h-px w-full origin-left bg-black lg:absolute lg:left-[707px] lg:top-[1040px] lg:mt-0 lg:w-[713px]" />
      </div>
    </section>
  );
};

export default IntroSequence;
