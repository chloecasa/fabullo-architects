"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  videoClip?: string;
  bgColor: string;
  textColor: string;
  layout: "featured";
}

const featuredImages = [
  "/assets/foreverhouse/1.jpeg",
  "/assets/foreverhouse/2.jpeg",
  "/assets/foreverhouse/3.jpeg",
  "/assets/foreverhouse/4.jpeg",
  "/assets/foreverhouse/5.jpeg",
  "/assets/foreverhouse/6.jpeg",
  "/assets/foreverhouse/7.jpeg",
  "/assets/foreverhouse/8.jpeg",
  "/assets/foreverhouse/9.jpeg",
  "/assets/foreverhouse/10.jpeg",
];

const slides: BlogSlide[] = [
  {
    id: "featured",
    title: "FEATURED",
    subtitle: "ON THE LOCAL PROJECT",
    description:
      "Striking a balance between modesty and tenacity, the design uses a careful play of voids to draw natural light deep into a reassuringly calm sanctuary",
    image: "/assets/images/Tareola Image.png",
    videoClip: "/assets/videos/local-project1.mp4",
    bgColor: "bg-[#ffffff]",
    textColor: "text-black",
    layout: "featured",
  },
];

export default function HorizontalBlog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedImageIndex((prev) => (prev + 1) % featuredImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;

    if (header) {
      header.style.display = isVideoOpen ? "none" : "";
    }

    return () => {
      if (header) header.style.display = "";
    };
  }, [isVideoOpen]);

  useGSAP(
    () => {
      if (!isReady) return;

      const sections = gsap.utils.toArray<HTMLElement>(".blog-section");

      sections.forEach((section, index) => {
        const innerContainer = section.querySelector(".section-container");

        gsap.fromTo(
          innerContainer,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 20%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        if (index === sections.length - 1) return;

        ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        });
      });

      const timer = setTimeout(() => ScrollTrigger.refresh(), 500);

      return () => clearTimeout(timer);
    },
    { scope: containerRef, dependencies: [isReady] }
  );

  return (
    <>
      <main ref={containerRef} className="relative overflow-hidden bg-white">
        {slides.map((slide) => (
          <section
            key={slide.id}
            className="blog-section relative h-svh w-full overflow-hidden bg-white"
          >
            <div
              className={`
                section-container absolute inset-0 flex will-change-transform p-[10px]
                ${slide.bgColor} ${slide.textColor}
              `}
            >
              <div className="relative h-full w-full p-0">
                <button
                  type="button"
                  data-cursor="[VIEW LOCAL PROJECT]"
                  data-cursor-color="black"
                  onClick={() => setIsVideoOpen(true)}
                  className="relative flex w-full cursor-none flex-col justify-between p-0 text-left focus:outline-none lg:absolute lg:bottom-0 lg:left-0 lg:top-0 lg:h-full lg:w-[49.3%]"
                >
                  <h1 className="mt-6 font-['LT_Superior'] text-[clamp(7rem,11vw,148px)] font-bold uppercase leading-none text-black lg:absolute lg:left-[10px] lg:top-[10px] lg:mt-0">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="mt-2 font-['LT_Superior'] text-xl font-bold tracking-tight text-black/80 lg:absolute lg:left-4.5 lg:top-[16%] lg:mt-0 lg:text-[clamp(1.2rem,1.8vw,30px)]">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="my-auto w-155 max-w-full self-center md:mr-16 md:self-end lg:absolute lg:left-[15%] lg:top-[51.2%] lg:mr-0 lg:self-auto">
                    <p className="text-justify font-['LT_Superior'] text-xl font-bold text-black">
                      {slide.description}
                    </p>
                  </div>

                  <div className="h-0 md:h-12" />
                </button>

                <button
                  type="button"
                  data-cursor="[VIEW LOCAL PROJECT]"
                  data-cursor-color="white"
                  onClick={() => setIsVideoOpen(true)}
                  className="group relative h-1/2 w-full cursor-none overflow-hidden lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:h-full lg:w-[49.3%]"
                >
                  {featuredImages.map((imgSrc, idx) => (
                    <div
                      key={imgSrc}
                      className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                      style={{ opacity: idx === featuredImageIndex ? 1 : 0 }}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${slide.title} frame ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                </button>
              </div>
            </div>
          </section>
        ))}
      </main>

      {isVideoOpen && (
        <div className="fixed inset-0 z-[5000] bg-black">
          <iframe
            data-cursor="[ CLOSE ]"
            src="https://www.youtube.com/embed/shT8Ccb1YHI?autoplay=1&mute=1&playsinline=1&rel=0"
            title="Local Project Video"
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />

          <button
            type="button"
            data-cursor="[ CLOSE ]"
            onClick={() => setIsVideoOpen(false)}
            className="absolute left-0 top-0 z-10 h-[calc(100%-96px)] w-full cursor-none"
            aria-label="Close video"
          />
        </div>
      )}
    </>
  );
}
