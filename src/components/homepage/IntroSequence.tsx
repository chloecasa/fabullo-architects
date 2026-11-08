"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
      className="relative z-20 w-full overflow-hidden bg-white text-black rounded-none"
    >
      {/* Phones: flow layout, height from content. Tablet and up: fixed heights (unchanged) */}
      <div className={[
        "relative mx-auto w-full max-w-[1440px] flex flex-col",
        "px-[12px] pt-[80px] pb-[56px]",
        "md:block md:p-0",
        // 03. Tablet Port (768x1024)
        "md:h-[1024px]",
        // 04. Tablet Land (1024x768)
        "lg:h-[768px]",
        // 05. Desktop Base (1280x800)
        "xl:h-[1523px]",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:h-[1523px]",
      ].join(" ")}>

        {/* Component 1: Title ("WHAT WE DO") */}
        <div className={[
          "intro-title will-change-transform justify-start text-black font-bold font-['LT_Superior'] text-xl mb-6",
          "md:absolute md:mb-0 md:text-3xl",
          // 03. Tablet Port (768x1024)
          "md:left-[20px] md:top-[187px]",
          // 04. Tablet Land (1024x768)
          "lg:left-[20px] lg:top-[114px]",
          // 05. Desktop Base (1280x800)
          "xl:left-[20px] xl:top-[208px] xl:text-4xl",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:left-[20px] min-[1440px]:top-[208px] min-[1440px]:text-[74px]",
        ].join(" ")}>
          <Link
            href="/profile"
            className="block font-['LT_Superior'] uppercase leading-[0.85] text-black transition-opacity duration-300 hover:opacity-40 no-underline"
          >
            WHAT WE DO
          </Link>
        </div>

        {/* Component 2: Copy Paragraph 1 */}
        <div className={[
          "intro-text-one text-left md:text-justify font-['LT_Superior'] font-bold leading-snug md:leading-tight text-black will-change-transform justify-start text-base",
          "md:absolute",
          // 03. Tablet Port (768x1024)
          "md:left-[455px] md:top-[187px] md:w-[288px] md:text-xl",
          // 04. Tablet Land (1024x768)
          "lg:left-[622px] lg:top-[114px] lg:w-[384px] lg:text-xl",
          // 05. Desktop Base (1280x800)
          "xl:left-[776px] xl:top-[208px] xl:w-[484px] xl:text-3xl",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:left-[710px] min-[1440px]:top-[208px] min-[1440px]:w-[713px] min-[1440px]:text-4xl",
        ].join(" ")}>
          We design refined, context‑driven homes and commercial spaces shaped
          by clarity, craftsmanship, and purpose. We focus on what you need, how
          you live, and how your site works.
        </div>

        {/* Component 3: Divider Line 1 */}
        <div className={[
          "intro-line-one h-px w-full my-8 md:my-0 origin-left bg-black",
          "md:absolute",
          // 03. Tablet Port (768x1024)
          "md:left-[455px] md:top-[401px] md:w-[288px]",
          // 04. Tablet Land (1024x768)
          "lg:left-[622px] lg:top-[268px] lg:w-[384px]",
          // 05. Desktop Base (1280x800)
          "xl:left-[776px] xl:top-[482px] xl:w-[484px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:left-[707px] min-[1440px]:top-[456px] min-[1440px]:w-[713px]",
        ].join(" ")} />

        {/* Component 4: Image Mask & Source */}
        <img
          src="/media/Intro/Image.jpeg"
          alt="Architectural detail"
          className={[
            "intro-image object-cover will-change-[clip-path,transform] block w-full aspect-[3/4] mb-8 md:mb-0 rounded-none",
            "md:absolute md:aspect-auto",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:top-[506px] md:w-[288px] md:h-[384px]",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[302px] lg:w-[384px] lg:h-[384px]",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:top-[775px] xl:w-[504px] xl:h-[583px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[20px] min-[1440px]:top-[752px] min-[1440px]:w-[473px] min-[1440px]:h-[583px]",
          ].join(" ")}
        />

        {/* Component 5: Copy Paragraph 2 */}
        <div className={[
          "intro-text-two text-left md:text-justify font-['LT_Superior'] font-bold leading-snug md:leading-tight text-black will-change-transform justify-start text-base",
          "md:absolute",
          // 03. Tablet Port (768x1024)
          "md:left-[455px] md:top-[502px] md:w-[288px] md:text-xl",
          // 04. Tablet Land (1024x768)
          "lg:left-[622px] lg:top-[301px] lg:w-[384px] lg:text-xl",
          // 05. Desktop Base (1280x800)
          "xl:left-[776px] xl:top-[772px] xl:w-[484px] xl:text-3xl",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:left-[710px] min-[1440px]:top-[752px] min-[1440px]:w-[710px] min-[1440px]:text-4xl",
        ].join(" ")}>
          Every project is guided by context, material clarity, and functional
          precision. From first sketch to final detail, we deliver architecture
          that is responsive, enduring, and built to a high standard.
        </div>

        {/* Component 6: Divider Line 2 */}
        <div className={[
          "intro-line-two h-px w-full my-8 md:my-0 origin-left bg-black",
          "md:absolute",
          // 03. Tablet Port (768x1024)
          "md:left-[455px] md:top-[715px] md:w-[288px]",
          // 04. Tablet Land (1024x768)
          "lg:left-[622px] lg:top-[455px] lg:w-[384px]",
          // 05. Desktop Base (1280x800)
          "xl:left-[776px] xl:top-[1046px] xl:w-[484px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:left-[707px] min-[1440px]:top-[1040px] min-[1440px]:w-[713px]",
        ].join(" ")} />
      </div>
    </section>
  );
};

export default IntroSequence;
