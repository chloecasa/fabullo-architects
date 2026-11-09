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

// Wipe states. A caption is visible when its clip-path is fully open.
const CLIP_SHOWN = "inset(0% 0% 0% 0%)";
const CLIP_HIDDEN_BELOW = "inset(100% 0% 0% 0%)"; // hidden, the wipe comes up from the bottom
const CLIP_HIDDEN_ABOVE = "inset(0% 0% 100% 0%)"; // hidden, the wipe leaves toward the top

// Shared reveal for images
const REVEAL = { y: 40, duration: 1.1, ease: "power3.out" };

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectDetailView({ project }: { project: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const galleryPinRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const blindTop = useRef<HTMLDivElement>(null);
  const heroImageMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Images and paragraphs can be any count (at least 2 each).
  const images = (project.verticalImages ?? []).filter(Boolean);
  const texts = (project.slides ?? []).filter(Boolean);
  const imageCount = images.length;
  const textCount = texts.length;

  // Each paragraph is assigned to an image. Paragraphs are spread across the images in order.
  // When there are more paragraphs than images, several share one image.
  const beats = texts.map((text, t) => ({
    text,
    image: textCount > 0 ? Math.min(Math.floor((t * imageCount) / textCount), imageCount - 1) : 0,
  }));

  // For each image, the list of paragraph indexes that belong to it
  const beatsByImage: number[][] = images.map(() => []);
  beats.forEach((beat, bi) => beatsByImage[beat.image].push(bi));

  useGSAP(
    () => {
      // ---------- HERO ARRIVAL: settle ----------
      // The photo starts zoomed in and blurred, sharpens and settles,
      // then the title rises line by line and the details fade in.
      const arrivalTl = gsap.timeline();

      gsap.set(".project-hero-title-line", { yPercent: 110 });
      gsap.set(".project-hero-copy", { opacity: 0, y: 20 });
      gsap.set(heroImageRef.current, { scale: 1.12, filter: "blur(14px)" });

      arrivalTl
        .to(blindTop.current, { yPercent: -100, duration: 1, ease: "expo.inOut" })
        .to(
          heroImageRef.current,
          { scale: 1, filter: "blur(0px)", duration: 1.8, ease: "power3.out" },
          "-=0.4"
        )
        .to(
          ".project-hero-title-line",
          { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" },
          "-=1.3"
        )
        .to(
          ".project-hero-copy",
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power4.out" },
          "-=0.7"
        );

      // ---------- SECTION 2: IMAGE SEQUENCE ----------
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const root = sequenceRef.current;
          if (!root) return;

          // DESKTOP: the caption stays on the left. Each paragraph wipes out completely
          // before the next one wipes in, so two paragraphs never overlap.
          if (ctx.conditions?.isDesktop) {
            const captions = gsap.utils.toArray<HTMLElement>(".v-caption", root);
            const frames = gsap.utils.toArray<HTMLElement>(".v-img-frame", root);

            gsap.set(captions, { clipPath: CLIP_HIDDEN_BELOW });

            let current = -1;
            let tl: gsap.core.Timeline | null = null;

            const showCaption = (next: number) => {
              if (next === current) return;

              // If a transition is still running, finish it first so the captions are in a clean state
              if (tl) tl.progress(1);

              const prev = current;
              current = next;
              // forward = moving down the page; backward = moving back up
              const forward = prev === -1 || next > prev;

              tl = gsap.timeline();

              // 1. The outgoing paragraph wipes out
              if (prev >= 0) {
                tl.to(captions[prev], {
                  clipPath: forward ? CLIP_HIDDEN_ABOVE : CLIP_HIDDEN_BELOW,
                  duration: 0.6,
                  ease: "power2.in",
                });
              }

              // 2. The incoming paragraph wipes in, after the outgoing one has gone
              if (next >= 0) {
                tl.fromTo(
                  captions[next],
                  { clipPath: forward ? CLIP_HIDDEN_BELOW : CLIP_HIDDEN_ABOVE },
                  {
                    clipPath: CLIP_SHOWN,
                    duration: 0.9,
                    ease: "power3.out",
                  }
                );
              }
            };

            frames.forEach((frame, i) => {
              gsap.set(frame, { opacity: 0, y: REVEAL.y });
              gsap.to(frame, {
                opacity: 1,
                y: 0,
                duration: REVEAL.duration,
                ease: REVEAL.ease,
                scrollTrigger: { trigger: frame, start: "top 88%", once: true },
              });

              // Pick the paragraph for this image. If the image has several, they take turns
              // as the image moves through the middle of the screen.
              ScrollTrigger.create({
                trigger: frame,
                start: "top 55%",
                end: "bottom 55%",
                onUpdate: (self) => {
                  const list = beatsByImage[i];
                  if (!list || list.length === 0) return;
                  const k = Math.min(Math.floor(self.progress * list.length), list.length - 1);
                  showCaption(list[k]);
                },
                onLeaveBack: () => {
                  if (i === 0) showCaption(-1);
                },
              });
            });

            return () => {
              tl?.kill();
            };
          }

          // MOBILE: each paragraph wipes in, one after another, then its image fades up.
          // Runs once, as each block reaches the screen.
          if (ctx.conditions?.isMobile) {
            const wraps = gsap.utils.toArray<HTMLElement>(".m-block-wrap", root);

            wraps.forEach((wrap) => {
              const block = wrap.querySelector<HTMLElement>(".m-block");
              const paragraphs = gsap.utils.toArray<HTMLElement>(".m-text", wrap);

              gsap.set(paragraphs, { clipPath: CLIP_HIDDEN_BELOW });
              if (block) gsap.set(block, { opacity: 0, y: REVEAL.y });

              const tl = gsap.timeline({
                scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
              });

              tl.to(paragraphs, {
                clipPath: CLIP_SHOWN,
                duration: 0.9,
                stagger: 0.25,
                ease: "power3.out",
              });

              if (block) {
                tl.to(
                  block,
                  { opacity: 1, y: 0, duration: REVEAL.duration, ease: REVEAL.ease },
                  paragraphs.length > 0 ? "-=0.4" : 0
                );
              }
            });
          }
        }
      );

      // ---------- SECTION 3: GALLERY (one image per screen) ----------
      const galleryMm = gsap.matchMedia();
      const total = project.horizontalGallery.length;

      const setCounter = (index: number) => {
        if (counterRef.current) {
          counterRef.current.textContent = `${pad(index + 1)} / ${pad(total)}`;
        }
      };

      // DESKTOP: the section locks to the screen; scrolling down moves the images sideways
      galleryMm.add("(min-width: 768px)", () => {
        const section = galleryPinRef.current;
        const scroller = scrollerRef.current;
        const track = trackRef.current;
        if (!section || !scroller || !track || total < 2) return;

        const distance = () => track.scrollWidth - scroller.clientWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (total - 1),
              duration: { min: 0.25, max: 0.6 },
              delay: 0.08,
              ease: "power2.inOut",
            },
            onUpdate: (self) => setCounter(Math.round(self.progress * (total - 1))),
          },
        });

        setCounter(0);
      });

      // PHONES: swipe sideways with snapping; scrolling down then carries on to the footer
      galleryMm.add("(max-width: 767px)", () => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const onScroll = () => {
          const index = Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1));
          setCounter(Math.min(Math.max(index, 0), total - 1));
        };

        scroller.addEventListener("scroll", onScroll, { passive: true });
        setCounter(0);

        return () => scroller.removeEventListener("scroll", onScroll);
      });

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  // Images take their natural height, so the page grows as they load.
  // Measure the scroll positions again once the last one is in.
  useEffect(() => {
    const imgs = Array.from(containerRef.current?.querySelectorAll("img") ?? []);
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
  }, [project]);

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
          The image spans the full width inside the side padding and is never cropped.
          Recommended ratio: 16:9 landscape (2400 x 1350 px). */}
      <section className="relative flex min-h-svh w-full flex-col overflow-hidden bg-white px-3 pb-5 pt-[11px] text-black rounded-none md:px-5 md:pb-8 md:pt-5">
        <div
          ref={heroImageMaskRef}
          className="relative h-[46svh] w-full overflow-hidden rounded-none md:h-[58svh] xl:h-[60svh]"
        >
          <img
            ref={heroImageRef}
            src={project.heroImg}
            className="block h-full w-full object-cover will-change-transform rounded-none"
            alt={project.title}
          />
        </div>

        {/* Text area under the image.
            Phones: credits, consultants + team, then title, stacked.
            md and up: credits top left, title bottom left, consultants + team on the right. */}
        <div className="mt-5 flex flex-1 flex-col gap-6 md:mt-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,28vw)] md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-8">
          {/* Credits */}
          <div className="project-hero-copy min-w-0 text-left text-[11px] font-normal uppercase leading-[1.2] text-zinc-950 rounded-none md:col-start-1 md:row-start-1 md:max-w-xs md:text-xs xl:max-w-sm xl:text-sm">
            {project.credits}
          </div>

          {/* Consultants + team */}
          <div className="flex min-w-0 flex-col gap-4 text-[11px] uppercase leading-tight text-zinc-950 rounded-none md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-[430px] md:justify-self-end md:text-xs md:leading-5 xl:text-sm">
            <div className="project-hero-copy">
              {project.consultants.map((item, i) => (
                <div key={i}>
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-normal"> - </span>
                  <span className="font-bold">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="project-hero-copy">
              {project.team.map((item, i) => (
                <div key={i}>
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
          Desktop: the caption sticks on the left while the images scroll past on the right.
          Phones: each paragraph sits above its image. */}
      <section ref={sequenceRef} className="relative w-full bg-white rounded-none">
        {/* MOBILE (and reduced motion): paragraphs above each image */}
        <div className="flex flex-col gap-12 px-3 pt-12 md:hidden motion-reduce:md:flex">
          {images.map((img, i) => (
            <div key={i} className="m-block-wrap">
              {beatsByImage[i].length > 0 && (
                <div className="mb-6 flex flex-col gap-4">
                  {beatsByImage[i].map((bi) => (
                    <p
                      key={bi}
                      className="m-text text-left text-[11px] font-normal leading-tight text-zinc-950 rounded-none"
                    >
                      {beats[bi].text}
                    </p>
                  ))}
                </div>
              )}
              {/* RATIO: any ratio works, the image is never cropped (3:2 or 4:5 recommended) */}
              <div className="m-block w-full overflow-hidden rounded-none">
                <img src={img} className="block h-auto w-full rounded-none" alt="Architectural sequence" />
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP: sticky caption column + scrolling image column */}
        <div className="mx-auto hidden w-full max-w-382 px-5 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10 lg:gap-16 motion-reduce:md:hidden">
          {/* Captions share one grid cell, so only one is ever visible and none overlap */}
          <div className="sticky top-0 flex h-svh items-center self-start">
            <div className="grid w-full max-w-[34rem]">
              {beats.map((beat, i) => (
                <p
                  key={i}
                  style={{ clipPath: CLIP_HIDDEN_BELOW }}
                  className="v-caption col-start-1 row-start-1 text-left text-[clamp(0.85rem,min(1.5vw,2.6svh),1.5rem)] font-normal leading-tight text-black rounded-none"
                >
                  {beat.text}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[18svh] pb-[14svh] pt-[14svh]">
            {images.map((img, i) => (
              <div key={i} className="v-img-frame flex w-full justify-center rounded-none">
                {/* RATIO: any ratio works and the image is never cropped.
                    Best results: 3:2 landscape (1800 x 1200 px) or 4:5 portrait (1600 x 2000 px).
                    It fills the column width, and is scaled down only if it would be
                    taller than 80% of the screen. */}
                <img
                  src={img}
                  className="block h-auto max-h-[80svh] w-auto max-w-full object-contain rounded-none"
                  alt="Architectural sequence"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: GALLERY.
          One image per screen. Every image keeps its own proportions (never cropped).
          Desktop: the section locks and scrolling moves the images sideways.
          Phones: swipe sideways, then scroll on to the footer. */}
      {project.horizontalGallery.length > 0 && (
        <section
          ref={galleryPinRef}
          className="relative h-svh w-full overflow-hidden bg-white rounded-none"
        >
          <div
            ref={scrollerRef}
            className="h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [container-type:inline-size] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:snap-none md:overflow-hidden"
          >
            <div ref={trackRef} className="flex h-full w-max will-change-transform">
              {project.horizontalGallery.map((img, i) => (
                <div
                  key={i}
                  className="flex h-full w-[100cqw] shrink-0 snap-center snap-always items-center justify-center px-5 pb-16 pt-16 md:px-20 md:pb-20 md:pt-20"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    aria-label={`Open gallery image ${i + 1}`}
                    className="flex max-h-full max-w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 rounded-none"
                  >
                    <img
                      src={img}
                      alt="gallery perspective"
                      decoding="async"
                      draggable={false}
                      className="block h-auto max-h-[calc(100svh-8rem)] w-auto max-w-[calc(100vw-2.5rem)] object-contain grayscale transition-all duration-700 ease-out hover:grayscale-0 md:max-h-[calc(100svh-10rem)] md:max-w-[calc(100vw-10rem)] rounded-none"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 text-center md:bottom-7">
            <span
              ref={counterRef}
              className="font-mono text-[10px] uppercase tracking-widest text-black/50"
            >
              01 / {pad(project.horizontalGallery.length)}
            </span>
          </div>
        </section>
      )}

      {selectedImg && (
        <InteractiveLightbox img={selectedImg} onClose={() => setSelectedImg(null)} />
      )}
    </main>
  );
}

function InteractiveLightbox({ img, onClose }: { img: string; onClose: () => void }) {
  const MIN_SCALE = 1;
  const MAX_SCALE = 6;

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  const clamp = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  const zoomBy = (factor: number) => setScale((s) => clamp(s * factor));
  const reset = () => setScale(MIN_SCALE);

  // Only apply the pan when zoomed in, so the image re-centres at 100%
  const pan = scale > 1 ? position : { x: 0, y: 0 };

  // Lock page scroll while the viewer is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Hide the site header while the viewer is open, as with the video
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "lightbox-header-hide";
    style.textContent = `[role="banner"] { display: none !important; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Keyboard: Esc closes, + and - zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomBy(1.25);
      if (e.key === "-") zoomBy(1 / 1.25);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Drag to pan while the image is zoomed in
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOrigin.current.x,
        y: e.clientY - dragOrigin.current.y,
      });
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragOrigin.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setIsDragging(true);
  };

  const onDoubleClick = () => {
    if (scale > 1) reset();
    else setScale(2.5);
  };

  const onWheel = (e: React.WheelEvent) => {
    zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15);
  };

  const percent = Math.round(scale * 100);

  return (
    <div
      className="fixed inset-0 z-30000 flex select-none items-center justify-center overflow-hidden bg-black/55 backdrop-blur-2xl"
      onWheel={onWheel}
    >
      {/* Full-screen close target: clicking the empty background closes the viewer.
          The cursor ring shows CLOSE here, as it does on the video. */}
      <button
        type="button"
        data-cursor="close"
        onClick={onClose}
        aria-label="Close image"
        className="absolute inset-0 cursor-none bg-transparent"
      />

      {/* Hint */}
      <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 md:left-10 md:top-10">
        Scroll or use + / − to zoom
      </div>

      {/* Image: drag to pan and double-click to zoom. Clicking it does not close the viewer. */}
      <div
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        className={`relative z-10 flex items-center justify-center ${
          scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
        }`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 200ms ease-out",
        }}
      >
        <img
          src={img}
          alt=""
          draggable={false}
          className="pointer-events-none max-h-[80svh] max-w-[90vw] object-contain shadow-2xl"
        />
      </div>

      {/* Zoom bar */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-black/40 p-1 backdrop-blur-md md:bottom-10">
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.25)}
          aria-label="Zoom out"
          className="h-9 w-9 rounded-full text-lg text-white transition-opacity hover:opacity-50"
        >
          −
        </button>
        <span className="min-w-14 text-center font-mono text-[10px] uppercase tracking-widest text-white/70">
          {percent}%
        </span>
        <button
          type="button"
          onClick={() => zoomBy(1.25)}
          aria-label="Zoom in"
          className="h-9 w-9 rounded-full text-lg text-white transition-opacity hover:opacity-50"
        >
          +
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-1 rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white transition-opacity hover:opacity-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
