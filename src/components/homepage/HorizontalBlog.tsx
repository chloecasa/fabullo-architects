"use client";

import { useRef, useState, useEffect } from "react";
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
  videoClip?: string;
  bgColor: string;
  textColor: string;
  layout: "featured";
}

const slides: BlogSlide[] = [
  {
    id: "featured",
    title: "FEATURED",
    subtitle: "ON THE LOCAL PROJECT",
    description:
      "Striking a balance between modesty and tenacity, the design uses a careful play of voids to draw natural light deep into a reassuringly calm sanctuary",
    videoClip:   "/media/fabullovid.mp4",
    bgColor: "bg-white",
    textColor: "text-black",
    layout: "featured",
  },
];

export default function HorizontalBlog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
  const handle = requestAnimationFrame(() => {
    setIsReady(true);
  });

  return () => cancelAnimationFrame(handle);
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
            className={[
              "blog-section relative w-full overflow-hidden bg-white rounded-none",
              // 01. Mobile Min (320x640)
              "min-h-[640px] h-[640px]",
              // 02. Mobile Std (390x844)
              "min-[375px]:min-h-[844px] min-[375px]:h-[844px]",
              // 03. Tablet Port (768x1024)
              "md:min-h-[1024px] md:h-[1024px]",
              // 04. Tablet Land (1024x768)
              "lg:min-h-[768px] lg:h-[768px]",
              // 05. Desktop Base (1280x1523)
              "xl:min-h-[1523px] xl:h-[1523px]",
              // 06. Original Widescreen (1440x1441)
              "min-[1440px]:min-h-[1441px] min-[1440px]:h-[1441px]"
            ].join(" ")}
          >
            <div
              className={`
                section-container absolute inset-0 will-change-transform rounded-none
                ${slide.bgColor} ${slide.textColor}
              `}
            >
              <div className="relative h-full w-full">
                
                {/* Component 1: Title ("FEATURED") */}
                <h1 
                  suppressHydrationWarning
                  className={[
                    "absolute font-['LT_Superior'] font-medium uppercase leading-none text-black rounded-none italic",
                    // 01. Mobile Min (320x640)
                    "left-[10px] top-[98px] text-4xl",
                    // 02. Mobile Std (390x844)
                    "min-[375px]:left-[10px] min-[375px]:top-[112px] min-[375px]:text-4xl",
                    // 03. Tablet Port (768x1024)
                    "md:left-[20px] md:top-[178px] md:text-8xl",
                    // 04. Tablet Land (1024x768)
                    "lg:left-[20px] lg:top-[50px] lg:text-8xl",
                    // 05. Desktop Base (1280x1523)
                    "xl:left-[12px] xl:top-[176px] xl:text-[164px]",
                    // 06. Original Widescreen (1440x1441)
                    "min-[1440px]:left-[12px] min-[1440px]:top-[221px] min-[1440px]:text-[192px]"
                  ].join(" ")}
                >
                  {slide.title}
                </h1>

                

                {/* Component 2: Subtitle ("ON THE LOCAL PROJECT") */}
                {slide.subtitle && (
                  <p className={[
                    "absolute text-justify font-['LT_Superior'] font-bold text-black/70",
                    // 01. Mobile Min (320x640)
                    "left-[191px] top-[118px] text-[10px] w-auto",
                    // 02. Mobile Std (390x844)
                    "min-[375px]:left-[261px] min-[375px]:top-[131px] min-[375px]:text-[10px]",
                    // 03. Tablet Port (768x1024)
                    "md:left-auto md:right-[20px] md:top-[238px] md:text-base md:w-auto",
                    // 04. Tablet Land (1024x768)
                    "lg:left-auto lg:right-[20px] lg:top-[112px] lg:text-base lg:w-auto",
                    // 05. Desktop Base (1280x1523)
                    "xl:left-auto xl:right-[20px] xl:top-[282px] xl:text-2xl",
                    // 06. Original Widescreen (1440x1441)
                    "min-[1440px]:left-auto min-[1440px]:right-[20px] min-[1440px]:top-[323px] min-[1440px]:text-3xl"
                  ].join(" ")}>
                    {slide.subtitle}
                  </p>
                )}

                {/* Component 3: Video Cover Trigger Button */}
                <button
                  type="button"
                  data-cursor="[VIEW LOCAL PROJECT]"
                  data-cursor-color="white"
                  onClick={() => setIsVideoOpen(true)}
                  className={[
                    "absolute cursor-none overflow-hidden bg-zinc-300 rounded-none",
                    // 01. Mobile Min (320x640) - Centered with dynamic 10px margins
                    "left-[10px] right-[10px] top-[134px] h-80 w-auto",
                    // 02. Mobile Std (390x844) - Centered with dynamic 10px margins
                    "min-[375px]:left-[10px] min-[375px]:right-[10px] min-[375px]:top-[149px] min-[375px]:h-[407px] min-[375px]:w-auto",
                    // 03. Tablet Port (768x1024)
                    "md:left-[20px] md:top-[271px] md:right-[20px] md:w-auto md:h-[482px]",
                    // 04. Tablet Land (1024x768)
                    "lg:left-[20px] lg:top-[145px] lg:right-[20px] lg:w-auto lg:h-[478px]",
                    // 05. Desktop Base (1280x1523)
                    "xl:left-[20px] xl:top-[321px] xl:right-[20px] xl:w-auto xl:h-[881px]",
                    // 06. Original Widescreen (1440x1441)
                    "min-[1440px]:left-[20px] min-[1440px]:top-[375px] min-[1440px]:right-[20px] min-[1440px]:w-auto min-[1440px]:h-[868px]"
                  ].join(" ")}
                  aria-label="View Local Project video"
                >
                  <video
                    src={slide.videoClip}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover rounded-none"
                  />
                </button>

                {/* Component 4: Description Paragraph */}
                <p className={[
                  "absolute text-justify font-['LT_Superior'] font-bold text-black rounded-none",
                  // 01. Mobile Min (320x640)
                  "left-[10px] top-[465px] w-44 text-[10px]",
                  // 02. Mobile Std (390x844)
                  "min-[375px]:left-[10px] min-[375px]:top-[566px] min-[375px]:w-44 min-[375px]:text-[10px]",
                  // 03. Tablet Port (768x1024)
                  "md:left-[20px] md:top-[773px] md:w-72 md:text-base",
                  // 04. Tablet Land (1024x768)
                  "lg:left-[20px] lg:top-[643px] lg:w-96 lg:text-base",
                  // 05. Desktop Base (1280x1523)
                  "xl:left-[20px] xl:top-[1222px] xl:w-[453px] xl:text-2xl",
                  // 06. Original Widescreen (1440x1441)
                  "min-[1440px]:left-[20px] min-[1440px]:top-[1263px] min-[1440px]:w-[453px] min-[1440px]:text-2xl"
                ].join(" ")}>
                  {slide.description}
                </p>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Kept exactly as is to preserve dynamic video player modal */}
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
