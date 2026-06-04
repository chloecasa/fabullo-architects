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
        className="relative h-screen w-full overflow-hidden bg-white text-black rounded-none"
      >
        {/* Component 1: Title Parent Container */}
        <div className={[
          "absolute z-20",
          // 01. Mobile Min (320x640)
          "left-[10px] top-[11px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:left-[10px] min-[375px]:top-[11px]",
          // 03. Tablet Port (768x1024)
          "md:left-[10px] md:top-[20px]",
          // 04. Tablet Land (1024x768)
          "lg:left-[10px] lg:top-[20px]",
          // 05. Desktop Base (1280x800)
          "xl:left-[10px] xl:top-[20px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:left-[10px] min-[1440px]:top-[20px]"
        ].join(" ")}>
          
          <div className="overflow-hidden">
            <h1 className={[
              "hero-title-line pr-4 pb-2 font-bold uppercase leading-[0.82] tracking-tighter",
              // 01. Mobile Min (320x640)
              "text-5xl",
              // 02. Mobile Std (390x844)
              "min-[375px]:text-5xl",
              // 03. Tablet Port (768x1024)
              "md:text-8xl",
              // 04. Tablet Land (1024x768)
              "lg:text-8xl",
              // 05. Desktop Base (1280x800)
              "xl:text-9xl",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:text-9xl"
            ].join(" ")}>
              Detail
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1 className={[
              "hero-title-line pr-4 pb-2 font-bold uppercase leading-[0.82] tracking-tighter",
              // 01. Mobile Min (320x640)
              "text-5xl",
              // 02. Mobile Std (390x844)
              "min-[375px]:text-5xl",
              // 03. Tablet Port (768x1024)
              "md:text-8xl",
              // 04. Tablet Land (1024x768)
              "lg:text-8xl",
              // 05. Desktop Base (1280x800)
              "xl:text-9xl",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:text-9xl"
            ].join(" ")}>
              Matters
            </h1>
          </div>
        </div>

        {/* Component 2: Unified Responsive Copy Container Wrapper */}
        <div className={[
          "absolute z-20 rounded-none grid",
          // 01. Mobile Min (320x640)
          "right-[34px] top-[196px] w-[236px] gap-[60px] grid-cols-2",
          // 02. Mobile Std (390x844)
          "min-[375px]:left-[86px] min-[375px]:top-[210px] min-[375px]:w-[296px] min-[375px]:gap-[8px]",
          // 03. Tablet Port (768x1024)
          "md:left-auto md:right-[24px] md:top-[457px] md:w-[475px] md:gap-[27px]",
          // 04. Tablet Land (1024x768)
          "lg:right-[20px] lg:top-[285px] lg:w-[377px] lg:gap-[25px]",
          // 05. Desktop Base (1280x800)
          "xl:right-[20px] xl:top-[300px] xl:w-[476px] xl:gap-[28px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:right-[20px] min-[1440px]:top-[300px] min-[1440px]:w-[540px] min-[1440px]:gap-[28px]"
        ].join(" ")}>
          
          {/* Component 3: Copy Paragraph 1 */}
          <p className={[
            "hero-copy text-justify font-medium leading-[1.25] rounded-none",
            // 01. Mobile Min (320x640)
            "text-[10px] w-35",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[10px] min-[375px]:w-36",
            // 03. Tablet Port (768x1024)
            "md:text-sm md:w-56",
            // 04. Tablet Land (1024x768)
            "lg:text-sm lg:w-44",
            // 05. Desktop Base (1280x800)
            "xl:text-base xl:w-56",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-base min-[1440px]:w-64"
          ].join(" ")}>
            We design context‑driven architecture that transforms your vision into refined,
            built form.
          </p>
          
          {/* Component 3: Copy Paragraph 2 */}
          <p className={[
            "hero-copy text-justify font-medium leading-[1.25] rounded-none",
            // 01. Mobile Min (320x640)
            "text-[10px] w-28",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[10px] min-[375px]:w-36",
            // 03. Tablet Port (768x1024)
            "md:text-sm md:w-56",
            // 04. Tablet Land (1024x768)
            "lg:text-sm lg:w-44",
            // 05. Desktop Base (1280x800)
            "xl:text-base xl:w-56",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-base min-[1440px]:w-64"
          ].join(" ")}>
            We make sure your details are in context. We make and build with care.
          </p>
        </div>

        {/* Component 4: CTA Corner Button Link */}
        <Link
          href="/contact"
          data-cursor="click"
          className={[
            "hero-cta group absolute z-40 hidden h-36 w-36 cursor-none lg:block",
            // 01. Mobile Min (320x640) - Hidden
            // 02. Mobile Std (390x844) - Hidden
            // 03. Tablet Port (768x1024) - Hidden
            // 04. Tablet Land (1024x768)
            "lg:right-[15px] lg:top-[20px]",
            // 05. Desktop Base (1280x800)
            "xl:right-[15px] xl:top-[20px] xl:left-auto",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:right-[15px] min-[1440px]:top-[20px] min-[1440px]:left-auto"
          ].join(" ")}
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

        {/* Component 5: Bottom Image Container */}
        <div
          ref={imageMaskRef}
          className={[
            "absolute z-10 overflow-hidden bg-white",
            // 01. Mobile Min (320x640) - Centered with symmetrical 12px margins
            "left-[12px] right-[12px] top-[308px] h-80 w-auto",
            // 02. Mobile Std (390x844) - Centered with symmetrical 12px margins
            "min-[375px]:left-[12px] min-[375px]:right-[12px] min-[350px]:top-[344px] min-[375px]:h-[490px] min-[375px]:w-auto",
            // 03. Tablet Port (768x1024)
            "md:left-[15px] md:top-[522px] md:right-[15px] md:w-auto md:h-[488px] md:bottom-auto",
            // 04. Tablet Land (1024x768)
            "lg:left-[15px] lg:top-[368px] lg:right-[15px] lg:w-auto lg:h-97 lg:bottom-auto",
            // 05. Desktop Base (1280x800)
            "xl:left-[15px] xl:top-[394px] xl:right-[15px] xl:w-auto xl:h-97 xl:bottom-auto",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[15px] min-[1440px]:top-[392px] min-[1440px]:right-[15px] min-[1440px]:w-auto min-[1440px]:h-97 min-[1440px]:bottom-auto"
          ].join(" ")}
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
