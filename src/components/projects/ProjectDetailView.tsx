// src/components/projects/ProjectDetailView.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ProjectData } from "@/app/(app)/projects/[slug]/page";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// One shared reveal, used by the sequence AND the gallery so they feel like one page
const REVEAL = { y: 40, duration: 1.1, ease: "power3.out" };

export default function ProjectDetailView({ project }: { project: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const blindTop = useRef<HTMLDivElement>(null);
  const heroImageMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Slides that have an image, so captions and images always line up
  const sequence = project.slides
    .map((text, i) => ({ text, img: project.verticalImages[i] }))
    .filter((item): item is { text: string; img: string } => Boolean(item.img));

  useGSAP(
    () => {
      // ---------- HERO ARRIVAL ----------
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

      // ---------- SECTION 2: IMAGE SEQUENCE (no pinning, just flowing scroll) ----------
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

          // DESKTOP: caption stays put (sticky) and swaps softly as each image passes
          if (ctx.conditions?.isDesktop) {
            const captions = gsap.utils.toArray<HTMLElement>(".v-caption", sequence);
            const frames = gsap.utils.toArray<HTMLElement>(".v-img-frame", sequence);

            const showCaption = (active: number) => {
              captions.forEach((el, idx) => {
                gsap.to(el, {
                  opacity: idx === active ? 1 : 0,
                  y: idx === active ? 0 : idx < active ? -REVEAL.y / 2 : REVEAL.y / 2,
                  duration: 0.9,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              });
            };

            gsap.set(captions, { opacity: (i) => (i === 0 ? 1 : 0), y: 0 });

            frames.forEach((frame, i) => {
              const img = frame.querySelector("img");
              if (!img) return;

              // Image fades up as it arrives
              gsap.set(frame, { opacity: 0, y: REVEAL.y });
              gsap.to(frame, {
                opacity: 1,
                y: 0,
                duration: REVEAL.duration,
                ease: REVEAL.ease,
                scrollTrigger: { trigger: frame, start: "top 88%", once: true },
              });

              // Very slight drift inside the frame while it scrolls
              gsap.set(img, { scale: 1.12 });
              gsap.fromTo(
                img,
                { yPercent: -4 },
                {
                  yPercent: 4,
                  ease: "none",
                  scrollTrigger: {
                    trigger: frame,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                }
              );

              // Caption for this image takes over when it reaches mid screen
              ScrollTrigger.create({
                trigger: frame,
                start: "top 55%",
                end: "bottom 55%",
                onEnter: () => showCaption(i),
                onEnterBack: () => showCaption(i),
              });
            });
          }

          // MOBILE: each slide fades up as it reaches the screen
          if (ctx.conditions?.isMobile) {
            const slides = gsap.utils.toArray<HTMLElement>(".m-slide", sequence);

            slides.forEach((slide) => {
              const text = slide.querySelector<HTMLElement>(".m-slide-text");
              const block = slide.querySelector<HTMLElement>(".m-img-block");
              if (!text || !block) return;

              gsap.set([text, block], { opacity: 0, y: REVEAL.y });

              gsap
                .timeline({
                  scrollTrigger: { trigger: slide, start: "top 88%", once: true },
                })
                .to(text, {
                  opacity: 1,
                  y: 0,
                  duration: REVEAL.duration,
                  ease: REVEAL.ease,
                })
                .to(
                  block,
                  {
                    opacity: 1,
                    y: 0,
                    duration: REVEAL.duration,
                    ease: REVEAL.ease,
                  },
                  "-=0.8"
                );
            });
          }
        }
      );

      // ---------- SECTION 3: GALLERY GRID (same reveal as the sequence) ----------
      const items = gsap.utils.toArray<HTMLElement>(".g-item");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (items.length > 0 && !reduceMotion) {
        gsap.set(items, { opacity: 0, y: REVEAL.y });

        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: REVEAL.duration,
              ease: REVEAL.ease,
              stagger: 0.1,
              overwrite: true,
            }),
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  // Gallery images change the page height as they load, so refresh the scroll
  // positions once when the last one is in.
  useEffect(() => {
    const imgs = Array.from(galleryRef.current?.querySelectorAll("img") ?? []);
    let pending = imgs.filter((img) => !img.complete).length;
    if (pending === 0) return;

    const done = () => {
      pending -= 1;
      if (pending === 0) ScrollTrigger.refresh();
    };

    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });

    return () => {
      imgs.forEach((img) => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
    };
  }, [project.horizontalGallery]);

  return (
    <main
      ref={containerRef}
      className="bg-white min-h-screen w-full overflow-x-clip selection:bg-white selection:text-white no-scrollbar [&_.pin-spacer]:!bg-white"
    >
      <div
        ref={blindTop}
        className="fixed top-0 left-0 w-full h-full bg-white/10 backdrop-blur-xl z-10000 pointer-events-none border-b border-white/10"
      />

      {/* SECTION 1: HERO.
          Everything is in normal flow (no vh-based absolute positions), so the
          credits, consultants, team and title can never overlap each other or the
          image. The section grows if the text is long. */}
      <section className="relative flex min-h-svh w-full flex-col overflow-hidden bg-white px-3 pb-5 pt-[11px] text-black rounded-none md:px-5 md:pb-8 md:pt-5">
        {/* Hero image */}
        <div
          ref={heroImageMaskRef}
          className="relative h-[46svh] w-full shrink-0 overflow-hidden bg-zinc-400 rounded-none md:h-[58svh] xl:h-[60svh]"
        >
          <img
            ref={heroImageRef}
            src={project.heroImg}
            className="h-full w-full object-cover will-change-transform rounded-none"
            alt={project.title}
          />
        </div>

        {/* Text area under the image.
            Phones: credits, consultants + team, then title, stacked.
            md and up: credits top left, title bottom left, consultants + team on the right. */}
        <div className="mt-5 flex flex-1 flex-col gap-6 md:mt-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,28vw)] md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-8">
          {/* Credits */}
          <div className="project-hero-copy min-w-0 text-justify text-[11px] font-medium uppercase leading-[1.2] text-zinc-950 rounded-none md:col-start-1 md:row-start-1 md:max-w-xs md:text-xs xl:max-w-sm xl:text-sm">
            {project.credits}
          </div>

          {/* Consultants + team */}
          <div className="flex min-w-0 flex-col gap-4 text-[11px] uppercase leading-tight text-zinc-950 rounded-none md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-[430px] md:justify-self-end md:text-xs md:leading-5 xl:text-sm">
            <div className="project-hero-copy">
              {project.consultants.map((item) => (
                <div key={item.label}>
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-normal"> - </span>
                  <span className="font-bold">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="project-hero-copy">
              {project.team.map((item) => (
                <div key={item.label}>
                  <span className="font-bold">{item.label}</span>
                  <span className="font-semibold"> - {item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Title + year */}
          <div className="mt-auto flex min-w-0 items-end gap-1.5 rounded-none md:col-start-1 md:row-start-2 md:mt-0 md:self-end">
            <div className="min-w-0 overflow-hidden">
              <h1 className="project-hero-title-line break-words text-3xl font-bold uppercase leading-none tracking-[-0.03em] rounded-none min-[375px]:text-4xl md:text-5xl xl:text-[clamp(3rem,4.1vw,64px)] min-[1440px]:text-[64px]">
                {project.title}
              </h1>
            </div>

            <span className="project-hero-copy shrink-0 pb-1 text-xs font-normal leading-none opacity-85 md:text-sm xl:text-base">
              {project.year}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: IMAGE SEQUENCE.
          No pinning, so it scrolls like normal. On desktop the caption stays in place
          on the left while the images scroll past on the right. */}
      <section ref={sequenceRef} className="relative w-full bg-white rounded-none">
        {/* MOBILE (and reduced motion): each paragraph sits above its image */}
        <div className="flex flex-col gap-12 px-3 pt-12 md:hidden motion-reduce:md:flex">
          {sequence.map(({ text, img }, i) => (
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
          ))}
        </div>

        {/* DESKTOP: sticky caption column + scrolling image column */}
        <div className="mx-auto hidden w-full max-w-382 px-5 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10 lg:gap-16 motion-reduce:md:hidden">
          {/* Captions share one grid cell, so only one is ever visible and none overlap */}
          <div className="sticky top-0 flex h-svh items-center self-start">
            <div className="grid w-full max-w-[34rem]">
              {sequence.map(({ text }, i) => (
                <p
                  key={i}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  className="v-caption col-start-1 row-start-1 text-justify [text-justify:inter-word] hyphens-auto text-[clamp(0.85rem,min(1.5vw,2.6svh),1.5rem)] font-semibold uppercase leading-tight text-black rounded-none"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[18svh] pt-[14svh]">
            {sequence.map(({ img }, i) => (
              <div
                key={i}
                className="v-img-frame relative h-[76svh] max-h-[760px] w-full overflow-hidden bg-zinc-400 rounded-none"
              >
                <img
                  src={img}
                  className="h-full w-full object-cover rounded-none"
                  alt="Architectural sequence"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: GALLERY GRID.
          Same fade-up as the sequence, and the gap above it matches the gap
          between sequence images (3rem on phones, 18svh on desktop). */}
      <section className="w-full bg-white px-3 pb-16 pt-12 rounded-none md:px-5 md:pb-24 md:pt-[18svh]">
        <div
          ref={galleryRef}
          className="columns-2 gap-2 md:columns-3 md:gap-4 xl:columns-4"
        >
          {project.horizontalGallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImg(img)}
              aria-label={`Open gallery image ${i + 1}`}
              className="g-item group mb-2 block w-full cursor-pointer break-inside-avoid overflow-hidden border-0 bg-transparent p-0 md:mb-4 rounded-none"
            >
              <img
                src={img}
                alt="gallery perspective"
                decoding="async"
                className="block h-auto w-full grayscale transition-all duration-700 ease-out hover:grayscale-0 rounded-none"
              />
            </button>
          ))}
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
