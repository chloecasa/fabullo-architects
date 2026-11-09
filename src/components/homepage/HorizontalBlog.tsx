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
    videoClip: "/media/fabullovid.mp4",
    bgColor: "bg-white",
    textColor: "text-black",
    layout: "featured",
  },
];

export default function HorizontalBlog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const insideVideoRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  // Keeps the custom cursor label in sync with the video frame while scrolling.
  // Browsers don't fire mouseleave when the page scrolls under a still pointer,
  // so we check the pointer position ourselves.
  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;

    let frame = 0;

    const check = () => {
      frame = 0;
      const button = videoButtonRef.current;
      if (!button) return;

      const p = pointerRef.current;
      let inside = false;

      if (p) {
        const r = button.getBoundingClientRect();
        inside = p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
      }

      if (inside === insideVideoRef.current) return;
      insideVideoRef.current = inside;

      button.dispatchEvent(
        new MouseEvent(inside ? "mouseenter" : "mouseleave", {
          clientX: p?.x ?? 0,
          clientY: p?.y ?? 0,
        })
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const onPointerOutWindow = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        pointerRef.current = null;
        schedule();
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOutWindow);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOutWindow);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Hide the site header completely while the video plays.
  // The style is removed when the video closes, so the header returns.
  useEffect(() => {
    if (!isVideoOpen) return;

    const style = document.createElement("style");
    style.id = "video-header-hide";
    style.textContent = `
      [role="banner"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, [isVideoOpen]);

  useGSAP(
    () => {
      if (!isReady) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sections = gsap.utils.toArray<HTMLElement>(".blog-section");

      sections.forEach((section, index) => {
        const innerContainer = section.querySelector(".section-container");

        if (!reduceMotion) {
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
        }

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
              // Phones: height comes from content. Tablet and up: fixed heights (unchanged)
              // 03. Tablet Port (768x1024)
              "md:h-[1024px]",
              // 04. Tablet Land (1024x768)
              "lg:h-[768px]",
              // 05. Desktop Base (1280x1523)
              "xl:h-[1523px]",
              // 06. Original Widescreen (1440x1441)
              "min-[1440px]:h-[1441px]",
            ].join(" ")}
          >
            {/* Phones: relative (takes up space). Tablet and up: absolute fill (unchanged) */}
            <div
              className={`
                section-container relative md:absolute md:inset-0 will-change-transform rounded-none
                ${slide.bgColor} ${slide.textColor}
              `}
            >
              {/* Phones: flow layout. Tablet and up: absolute layout */}
              <div
                className={[
                  "relative w-full flex flex-col",
                  "px-[12px] pt-[100px] pb-14",
                  "md:block md:h-full md:p-0",
                ].join(" ")}
              >
                {/* Component 1: Title ("FEATURED") */}
                <h1
                  suppressHydrationWarning
                  className={[
                    "font-['LT_Superior'] font-medium uppercase leading-none text-black rounded-none italic",
                    "text-[clamp(2.75rem,15vw,4.5rem)] mb-6 break-words",
                    "md:absolute md:mb-0",
                    // 03. Tablet Port (768x1024)
                    "md:left-[20px] md:top-[178px] md:text-8xl",
                    // 04. Tablet Land (1024x768)
                    "lg:left-[20px] lg:top-[50px] lg:text-8xl",
                    // 05. Desktop Base (1280x1523)
                    "xl:left-[12px] xl:top-[176px] xl:text-[164px]",
                    // 06. Original Widescreen (1440x1441)
                    "min-[1440px]:left-[12px] min-[1440px]:top-[221px] min-[1440px]:text-[192px]",
                  ].join(" ")}
                >
                  {slide.title}
                </h1>

                {/* Component 2: Subtitle ("ON THE LOCAL PROJECT") */}
                {slide.subtitle && (
                  <p
                    className={[
                      "self-end text-right font-['LT_Superior'] font-bold text-black/70 text-sm mb-6",
                      "md:self-auto md:text-justify md:absolute md:mb-0 md:text-base md:w-auto",
                      // 03. Tablet Port (768x1024)
                      "md:left-auto md:right-[20px] md:top-[238px]",
                      // 04. Tablet Land (1024x768)
                      "lg:left-auto lg:right-[20px] lg:top-[112px] lg:text-base",
                      // 05. Desktop Base (1280x1523)
                      "xl:left-auto xl:right-[20px] xl:top-[282px] xl:text-2xl",
                      // 06. Original Widescreen (1440x1441)
                      "min-[1440px]:left-auto min-[1440px]:right-[20px] min-[1440px]:top-[323px] min-[1440px]:text-3xl",
                    ].join(" ")}
                  >
                    {slide.subtitle}
                  </p>
                )}

                {/* Component 3: Video Cover Trigger Button */}
                <button
                  ref={videoButtonRef}
                  type="button"
                  data-cursor="view"
                  onClick={() => setIsVideoOpen(true)}
                  className={[
                    "relative block w-full aspect-[4/3] mb-6 overflow-hidden bg-zinc-300 rounded-none",
                    "[@media(pointer:fine)]:cursor-none",
                    "md:absolute md:mb-0 md:aspect-auto md:w-auto",
                    // 03. Tablet Port (768x1024)
                    "md:left-[20px] md:top-[271px] md:right-[20px] md:h-[482px]",
                    // 04. Tablet Land (1024x768)
                    "lg:top-[145px] lg:left-[20px] lg:right-[20px] lg:h-[478px]",
                    // 05. Desktop Base (1280x1523)
                    "xl:top-[321px] xl:left-[20px] xl:right-[20px] xl:h-[881px]",
                    // 06. Original Widescreen (1440x1441)
                    "min-[1440px]:top-[375px] min-[1440px]:left-[20px] min-[1440px]:right-[20px] min-[1440px]:h-[868px]",
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
                <p
                  className={[
                    "font-['LT_Superior'] font-bold text-black rounded-none",
                    "w-full text-base leading-snug text-left",
                    "md:absolute md:text-justify md:text-base",
                    // 03. Tablet Port (768x1024)
                    "md:left-[20px] md:top-[773px] md:w-72",
                    // 04. Tablet Land (1024x768)
                    "lg:top-[643px] lg:w-96 lg:text-base",
                    // 05. Desktop Base (1280x1523)
                    "xl:top-[1222px] xl:w-[453px] xl:text-2xl",
                    // 06. Original Widescreen (1440x1441)
                    "min-[1440px]:top-[1263px] min-[1440px]:w-[453px] min-[1440px]:text-2xl",
                  ].join(" ")}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Video modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[5000] bg-black">
          {/* Non-interactive, so the cursor ring works over the video */}
          <iframe
            src="https://www.youtube.com/embed/shT8Ccb1YHI?autoplay=1&mute=1&playsinline=1&rel=0&controls=0"
            title="Local Project Video"
            className="pointer-events-none h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />

          {/* Full-screen close target: any click closes the video */}
          <button
            type="button"
            data-cursor="close"
            onClick={() => setIsVideoOpen(false)}
            className="absolute inset-0 z-10 cursor-none bg-transparent"
            aria-label="Close video"
          />

          {/* Visible close button */}
          <button
            type="button"
            data-cursor="close"
            onClick={() => setIsVideoOpen(false)}
            className="absolute bottom-6 right-6 z-20 min-h-11 cursor-none rounded-full border border-white/20 bg-white/10 px-4 py-3 font-mono text-xs uppercase tracking-wider text-white backdrop-blur-md"
            aria-label="Close video"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
