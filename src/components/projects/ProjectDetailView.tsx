// src/components/projects/ProjectDetailView.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { ProjectData } from "@/app/(app)/projects/[slug]/page";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Splits a paragraph into wrapped lines so each line can rise on its own
function splitIntoLines(el: HTMLElement) {
  const split = new SplitType(el, { types: "lines", lineClass: "line-child" });

  split.lines?.forEach((line, i, arr) => {
    line.style.display = "block";
    line.style.width = "100%";
    line.style.textAlign = "justify";
    line.style.textAlignLast = i < arr.length - 1 ? "justify" : "left";

    const wrapper = document.createElement("div");
    wrapper.className = "overflow-hidden py-1 mb-[-4px]";
    line.parentNode?.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  return split;
}

export default function ProjectDetailView({ project }: { project: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const blindTop = useRef<HTMLDivElement>(null);
  const heroImageMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useGSAP(
    () => {
      // ---------- HERO ARRIVAL (unchanged) ----------
      const arrivalTl = gsap.timeline();

      gsap.set(".project-hero-title-line", { yPercent: 110 });
      gsap.set(".project-hero-copy", { opacity: 0, y: 20 });
      gsap.set(heroImageMaskRef.current, {
        clipPath: "inset(0% 100% 0% 0%)",
      });
      gsap.set(heroImageRef.current, {
        scale: 1.05,
      });

      arrivalTl
        .to(blindTop.current, {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut",
        })
        .to(
          heroImageMaskRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          heroImageRef.current,
          {
            scale: 1,
            duration: 1.4,
            ease: "power4.out",
          },
          "<"
        )
        .to(
          ".project-hero-title-line",
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.75"
        )
        .to(
          ".project-hero-copy",
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.55"
        );

      gsap.to(heroImageRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ---------- SECTION 2: IMAGE SEQUENCE (split by device) ----------
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop:
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile:
            "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const sequence = sequenceRef.current;
          if (!sequence) return;

          // DESKTOP: caption stays pinned, images scroll past it
          if (ctx.conditions?.isDesktop) {
            const textEls = gsap.utils.toArray<HTMLElement>(".slide-text", sequence);
            const imgBlocks = gsap.utils.toArray<HTMLElement>(".v-img-block", sequence);
            const splits = textEls.map(splitIntoLines);

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sequence,
                start: "top top",
                end: "+=700%",
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
              },
            });

            textEls.forEach((el, i) => {
              const lines = el.querySelectorAll(".line-child");
              const img = imgBlocks[i];
              if (!img) return;

              gsap.set(lines, { yPercent: 115 });
              // The first image starts in place; the rest wait below the frame
              if (i > 0) gsap.set(img, { yPercent: 100 });

              tl.to(lines, {
                yPercent: 0,
                stagger: 0.08,
                duration: 2,
                ease: "power3.out",
              });

              if (i > 0) {
                tl.to(
                  img,
                  { yPercent: 0, duration: 2.5, ease: "power3.out" },
                  "<"
                );
              }

              tl.to({}, { duration: 3 });

              if (i < textEls.length - 1) {
                tl.to(lines, {
                  yPercent: -115,
                  stagger: 0.05,
                  duration: 1.4,
                  ease: "power3.inOut",
                }).to(
                  img,
                  { yPercent: -100, duration: 2.5, ease: "power2.inOut" },
                  "<"
                );
              }
            });

            return () => splits.forEach((s) => s.revert());
          }

          // MOBILE: each slide reveals as it reaches the screen
          if (ctx.conditions?.isMobile) {
            const slides = gsap.utils.toArray<HTMLElement>(".m-slide", sequence);
            const splits: ReturnType<typeof splitIntoLines>[] = [];

            slides.forEach((slide) => {
              const text = slide.querySelector<HTMLElement>(".m-slide-text");
              const block = slide.querySelector<HTMLElement>(".m-img-block");
              const img = slide.querySelector<HTMLElement>(".m-img");
              if (!text || !block || !img) return;

              const split = splitIntoLines(text);
              splits.push(split);
              const lines = split.lines ?? [];

              gsap.set(lines, { yPercent: 115 });
              gsap.set(block, { clipPath: "inset(100% 0% 0% 0%)" });
              gsap.set(img, { scale: 1.08 });

              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: slide,
                    start: "top 80%",
                    once: true,
                  },
                })
                .to(lines, {
                  yPercent: 0,
                  stagger: 0.06,
                  duration: 0.9,
                  ease: "power3.out",
                })
                .to(
                  block,
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.2,
                    ease: "power4.out",
                  },
                  "-=0.5"
                )
                .to(
                  img,
                  { scale: 1, duration: 1.4, ease: "power4.out" },
                  "<"
                );
            });

            return () => splits.forEach((s) => s.revert());
          }
        }
      );

      // ---------- SECTION 3: HORIZONTAL GALLERY (unchanged) ----------
      if (horizontalRef.current && horizontalTrackRef.current) {
        const track = horizontalTrackRef.current;
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

        const trackImages = track.querySelectorAll("img");
        trackImages.forEach((img) => {
          if (img.complete) {
            ScrollTrigger.refresh();
          } else {
            img.addEventListener("load", () => {
              ScrollTrigger.refresh();
            });
          }
        });

        gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="bg-white min-h-screen w-full overflow-x-hidden selection:bg-white selection:text-white no-scrollbar [&_.pin-spacer]:!bg-white"
    >
      <div
        ref={blindTop}
        className="fixed top-0 left-0 w-full h-full bg-white/10 backdrop-blur-xl z-10000 pointer-events-none border-b border-white/10"
      />

      {/* SECTION 1: HERO (unchanged) */}
      <section className="relative h-screen w-full bg-white overflow-hidden text-black rounded-none">
        {/* Component 1: Hero Image Mask Container */}
        <div
          ref={heroImageMaskRef}
          className={[
            "absolute overflow-hidden bg-zinc-400 rounded-none",
            // 01. Mobile Min (320x640)
            "left-[12px] top-[11px] right-[12px] h-[50vh]",
            // 02. Mobile Std (390x844)
            "min-[375px]:left-[12px] min-[375px]:top-[11px] min-[375px]:right-[12px] min-[375px]:h-[52vh]",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:top-[20px] md:right-[20px] md:h-[60vh]",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[20px] lg:right-[20px] lg:h-[60vh]",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:top-[20px] xl:right-[20px] xl:h-[62.5vh]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[20px] min-[1440px]:top-[20px] min-[1440px]:right-[20px] min-[1440px]:h-[62.5vh]",
          ].join(" ")}
        >
          <img
            ref={heroImageRef}
            src={project.heroImg}
            className="h-full w-full object-cover will-change-transform rounded-none"
            alt={project.title}
          />
        </div>

        {/* Component 2: Lower Left Credits/Description */}
        <div
          className={[
            "project-hero-copy absolute text-justify font-medium uppercase leading-[1.2] text-zinc-950 rounded-none",
            // 01. Mobile Min (320x640)
            "left-[12px] top-[56vh] w-[296px] text-[11px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:left-[12px] min-[375px]:top-[58vh] min-[375px]:w-[366px]",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:top-[65vh] md:w-64 md:text-xs",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[65vh] lg:w-64 lg:text-xs",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:top-[67.5vh] xl:w-72 xl:text-sm",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[20px] min-[1440px]:top-[67.5vh] min-[1440px]:w-72 min-[1440px]:text-sm",
          ].join(" ")}
        >
          {project.credits}
        </div>

        {/* Component 3: Project Title & Dynamic Year (Bottom Left) */}
        <div
          className={[
            "absolute flex items-end gap-1.5 rounded-none",
            // 01. Mobile Min (320x640)
            "left-[12px] bottom-[20px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:left-[12px] min-[375px]:bottom-[20px]",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:bottom-8",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:bottom-8",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:bottom-8",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[20px] min-[1440px]:bottom-8",
          ].join(" ")}
        >
          <div className="overflow-hidden">
            <h1
              className={[
                "project-hero-title-line font-bold uppercase leading-none tracking-[-0.03em] rounded-none",
                // 01. Mobile Min (320x640)
                "text-3xl",
                // 02. Mobile Std (390x844)
                "min-[375px]:text-4xl",
                // 03. Tablet Port (768x1024)
                "md:text-5xl",
                // 04. Tablet Land (1024x768)
                "lg:text-5xl",
                // 05. Desktop Base (1280x800)
                "xl:text-[clamp(3rem,4.1vw,64px)]",
                // 06. Original Widescreen (1440x794)
                "min-[1440px]:text-[64px]",
              ].join(" ")}
            >
              {project.title}
            </h1>
          </div>

          <span className="project-hero-copy pb-1 text-xs md:text-sm xl:text-base font-normal leading-none opacity-85">
            {project.year}
          </span>
        </div>

        {/* Component 4: Consultants Column (Bottom Right Upper) */}
        <div
          className={[
            "project-hero-copy absolute uppercase leading-tight text-zinc-950 rounded-none",
            // 01. Mobile Min (320x640)
            "left-[12px] top-[74vh] w-[296px] text-[11px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:left-[12px] min-[375px]:top-[74vh] min-[375px]:w-[366px]",
            // 03. Tablet Port (768x1024)
            "md:left-auto md:right-[20px] md:top-[65vh] md:w-[28vw] md:max-w-[430px] md:text-xs md:leading-5",
            // 04. Tablet Land (1024x768)
            "lg:left-auto lg:right-[20px] lg:top-[65vh] lg:w-[28vw] lg:max-w-[430px] lg:text-xs lg:leading-5",
            // 05. Desktop Base (1280x800)
            "xl:left-auto xl:right-[20px] xl:top-[67.5vh] xl:w-[28vw] xl:max-w-[430px] xl:text-sm xl:leading-5",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-auto min-[1440px]:right-[20px] min-[1440px]:top-[67.5vh] min-[1440px]:w-[28vw] min-[1440px]:max-w-[430px] min-[1440px]:text-sm min-[1440px]:leading-5",
          ].join(" ")}
        >
          {project.consultants.map((item) => (
            <div key={item.label}>
              <span className="font-semibold">{item.label}</span>
              <span className="font-normal"> - </span>
              <span className="font-bold">{item.val}</span>
            </div>
          ))}
        </div>

        {/* Component 5: Team Column (Bottom Right Lower) */}
        <div
          className={[
            "project-hero-copy absolute uppercase leading-tight text-zinc-950 rounded-none",
            // 01. Mobile Min (320x640)
            "left-[12px] top-[86vh] w-[296px] text-[11px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:left-[12px] min-[375px]:top-[86vh] min-[375px]:w-[366px]",
            // 03. Tablet Port (768x1024)
            "md:left-auto md:right-[20px] md:top-[80vh] md:w-[28vw] md:max-w-[430px] md:text-xs md:leading-5",
            // 04. Tablet Land (1024x768)
            "lg:left-auto lg:right-[20px] lg:top-[80vh] lg:w-[28vw] lg:max-w-[430px] lg:text-xs lg:leading-5",
            // 05. Desktop Base (1280x800)
            "xl:left-auto xl:right-[20px] xl:top-[83.7vh] xl:w-[28vw] xl:max-w-[430px] xl:text-sm xl:leading-5",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-auto min-[1440px]:right-[20px] min-[1440px]:top-[83.7vh] min-[1440px]:w-[28vw] min-[1440px]:max-w-[430px] min-[1440px]:text-sm min-[1440px]:leading-5",
          ].join(" ")}
        >
          {project.team.map((item) => (
            <div key={item.label}>
              <span className="font-bold">{item.label}</span>
              <span className="font-semibold"> - {item.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: IMAGE SEQUENCE */}
      <section
        ref={sequenceRef}
        className="relative w-full h-auto md:h-svh bg-white overflow-hidden rounded-none"
      >
        <div className="relative w-full md:h-full max-w-382 mx-auto rounded-none">
          {/* MOBILE: normal flow, each paragraph sits above its image */}
          <div className="md:hidden flex flex-col gap-12 px-3 pt-12 pb-16">
            {project.slides.map((text, i) => {
              const img = project.verticalImages[i];
              if (!img) return null;

              return (
                <div key={i} className="m-slide">
                  <p className="m-slide-text text-justify hyphens-auto text-black text-base font-semibold leading-snug uppercase rounded-none">
                    {text}
                  </p>
                  <div className="m-img-block mt-6 w-full aspect-[4/5] bg-zinc-400 overflow-hidden rounded-none">
                    <img
                      src={img}
                      className="m-img w-full h-full object-cover rounded-none"
                      alt="Architectural sequence"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP: caption pinned, images scroll past it */}
          <div
            className={[
              "hidden md:block absolute z-20 pointer-events-none rounded-none",
              "md:left-[449px] md:top-[187px] md:w-72",
              "lg:left-[622px] lg:top-[114px] lg:w-96",
              "xl:left-[776px] xl:top-[345px] xl:w-[484px]",
              "min-[1440px]:left-[872px] min-[1440px]:top-[342px] min-[1440px]:w-[540px]",
            ].join(" ")}
          >
            {project.slides.map((text, index) => (
              <p
                key={index}
                className="slide-text absolute w-full text-justify [text-justify:inter-word] hyphens-auto text-black text-xs md:text-sm lg:text-base xl:text-lg min-[1440px]:text-2xl font-semibold leading-tight uppercase tracking-normal rounded-none"
              >
                {text}
              </p>
            ))}
          </div>

          <div className="hidden md:block absolute inset-0 z-10 pointer-events-none rounded-none">
            {project.verticalImages.map((img, i) => {
              const layout =
                i === 2
                  ? [
                      "md:left-[20px] md:top-[172px] md:w-[288px] md:h-[384px]",
                      "lg:left-[20px] lg:top-[152px] lg:w-[384px] lg:h-[384px]",
                      "xl:left-[20px] xl:top-[152px] xl:w-[504px] xl:h-[583px]",
                      "min-[1440px]:left-[20px] min-[1440px]:top-[152px] min-[1440px]:w-[473px] min-[1440px]:h-[583px]",
                    ].join(" ")
                  : [
                      "md:right-[20px] md:top-[187px] md:w-[288px] md:h-[288px]",
                      "lg:right-[20px] lg:top-[114px] lg:w-[384px] lg:h-[384px]",
                      "xl:right-[20px] xl:top-[208px] xl:w-[484px] xl:h-[484px]",
                      "min-[1440px]:right-[20px] min-[1440px]:top-[208px] min-[1440px]:w-[473px] min-[1440px]:h-[583px]",
                    ].join(" ");

              return (
                <div
                  key={i}
                  className={`v-img-block absolute bg-zinc-400 overflow-hidden rounded-none ${layout}`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover rounded-none"
                    alt="Architectural sequence"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: HORIZONTAL GALLERY (unchanged) */}
      <section
        ref={horizontalRef}
        className="relative h-screen w-full flex items-end bg-white overflow-hidden no-scrollbar pb-10 md:pb-16 rounded-none"
      >
        <div
          ref={horizontalTrackRef}
          className="flex flex-nowrap items-end px-[10vw] gap-2 md:gap-4 rounded-none"
        >
          {project.horizontalGallery.map((img, i) => {
            const heights = [
              "h-[45vh]",
              "h-[65vh]",
              "h-[45vh]",
              "h-[45vh]",
              "h-[65vh]",
            ];

            return (
              <div
                key={i}
                onClick={() => setSelectedImg(img)}
                className={`shrink-0 w-auto cursor-pointer group rounded-none ${
                  heights[i % heights.length]
                }`}
              >
                <img
                  src={img}
                  alt="gallery perspective"
                  className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-1000 ease-out rounded-none"
                />
              </div>
            );
          })}
        </div>
      </section>

      {selectedImg && (
        <InteractiveLightbox
          img={selectedImg}
          onClose={() => setSelectedImg(null)}
        />
      )}
    </main>
  );
}

function InteractiveLightbox({
  img,
  onClose,
}: {
  img: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(1, scale + delta), 6);
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || scale <= 1) return;

      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scale]);

  return (
    <div
      className="fixed inset-0 z-30000 bg-white flex items-center justify-center overflow-hidden touch-none select-none"
      onWheel={handleWheel}
    >
      <div
        ref={imageRef}
        onMouseDown={handleMouseDown}
        className={`relative flex items-center justify-center will-change-transform ${
          scale > 1 ? "cursor-grab" : "cursor-zoom-in"
        } ${
          isDragging ? "cursor-grabbing transition-none" : "transition-transform duration-200"
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <img
          src={img}
          alt="Viewpart"
          className="max-h-[90vh] max-w-[90vw] object-contain pointer-events-none"
        />
      </div>

      <div className="absolute top-10 left-10 text-black/30 text-[10px] uppercase tracking-[0.3em] pointer-events-none">
        {scale > 1 ? "Drag to Pan - Scroll to Zoom" : "Scroll to Zoom"}
      </div>

      <button
        onClick={onClose}
        className="absolute right-10 bottom-10 text-black font-bold tracking-[0.4em] text-xs uppercase hover:opacity-50 transition-opacity p-4 z-30001"
      >
        [CLOSE]
      </button>
    </div>
  );
}
