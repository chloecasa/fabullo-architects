"use client";

import React, { useRef, useState, useMemo, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type Category = "RESIDENTIAL" | "COMMERCIAL" | "UNBUILT";

interface ProjectItem {
  id: string;
  title: string;
  subText: string;
  img: string;
  slug: string;
  category: Category;
}

const STRIP_COUNT = 8;

// Maps Sanity project documents into the shape the cards expect
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProjects = (docs: any[]): ProjectItem[] => {
  if (!docs || !Array.isArray(docs)) return [];

  return docs.map((doc) => {
    let subLabel = "Residential";
    if (doc.category === "COMMERCIAL") subLabel = "Commercial";
    if (doc.category === "UNBUILT") subLabel = "Concept";

    return {
      id: String(doc.id),
      title: doc.title,
      subText: subLabel,
      img: doc.heroImg?.url || "",
      slug: doc.slug,
      category: doc.category as Category,
    };
  });
};

const BlindCard = ({ project }: { project: ProjectItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numStrips = 8;
  const strips = Array.from({ length: numStrips });

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const blindStrips = card.querySelectorAll(".blind-strip");

      // ENTRANCE (blind reveal): the strips start covering the photo,
      // then retract one after another as the card scrolls into view.
      gsap.set(blindStrips, { scaleY: reduce ? 0 : 1 });
      if (!reduce) {
        gsap.to(blindStrips, {
          scaleY: 0,
          duration: 0.9,
          ease: "power3.inOut",
          stagger: 0.06,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      }

      // HOVER: only on devices with a real mouse. Touch screens keep the text visible.
      const mm = gsap.matchMedia();

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const titles = card.querySelectorAll(".card-title, .card-subtext");
        const split = new SplitText(titles, { type: "words" });

        gsap.set(split.words, { yPercent: 105 });

        const tl = gsap.timeline({ paused: true });

        tl.fromTo(
          blindStrips,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.5, ease: "power2.inOut", stagger: 0.04 },
          0
        );

        tl.to(
          split.words,
          { yPercent: 0, duration: 0.5, ease: "power3.out", stagger: 0.02 },
          0.2
        );

        const enter = () => tl.play();
        const leave = () => tl.reverse();

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        return () => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: cardRef }
  );

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card block group no-underline"
    >
      <div
        ref={cardRef}
        className="relative w-full aspect-16/10 overflow-hidden bg-zinc-400 rounded-none"
      >
        <img
          src={project.img}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover [@media(hover:hover)_and_(pointer:fine)]:grayscale group-hover:grayscale-0 transition-all duration-700 rounded-none"
        />

        {/* Bottom gradient: keeps the text readable on touch screens */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 pointer-events-none z-1" />

        {/* Blind strips: cover the photo on load, retract on entrance, close again on hover */}
        <div className="absolute inset-0 flex flex-col pointer-events-none z-5">
          {strips.map((_, i) => (
            <div
              key={i}
              className="blind-strip flex-1 w-full origin-top bg-black/20"
            />
          ))}
        </div>

        {/* Text Content */}
        <div
          className={[
            "absolute z-10 flex flex-col pointer-events-none",
            // 01. Mobile Min (320x640)
            "bottom-3 left-3 gap-0.5",
            // 02. Mobile Std (390x844)
            "min-[375px]:bottom-3 min-[375px]:left-3",
            // 03. Tablet Port (768x1024)
            "md:bottom-6 md:left-6 md:gap-1",
            // 04. Tablet Land (1024x768)
            "lg:bottom-6 lg:left-6",
            // 05. Desktop Base (1280x800)
            "xl:bottom-8 xl:left-8",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:bottom-8 min-[1440px]:left-8",
          ].join(" ")}
        >
          <div className="overflow-hidden">
            <h3
              className={[
                "card-title text-white font-bold uppercase tracking-tighter leading-none",
                // 01. Mobile Min (320x640)
                "text-base",
                // 02. Mobile Std (390x844)
                "min-[375px]:text-lg",
                // 03. Tablet Port (768x1024)
                "md:text-2xl",
                // 04. Tablet Land (1024x768)
                "lg:text-2xl",
                // 05. Desktop Base (1280x800)
                "xl:text-3xl",
                // 06. Original Widescreen (1440x794)
                "min-[1440px]:text-3xl",
              ].join(" ")}
            >
              {project.title}
            </h3>
          </div>
          <div className="overflow-hidden">
            <p
              className={[
                "card-subtext text-white/80 font-mono uppercase tracking-[0.2em]",
                // 01. Mobile Min (320x640)
                "text-[12px]",
                // 02. Mobile Std (390x844)
                "min-[375px]:text-[12px]",
                // 03. Tablet Port (768x1024)
                "md:text-[12px]",
                // 04. Tablet Land (1024x768)
                "lg:text-[13px]",
                // 05. Desktop Base (1280x800)
                "xl:text-[13px]",
                // 06. Original Widescreen (1440x794)
                "min-[1440px]:text-[14px]",
              ].join(" ")}
            >
              {project.subText}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ProjectsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProjects: any[];
}

const CATEGORIES: Category[] = ["RESIDENTIAL", "COMMERCIAL", "UNBUILT"];

export default function Projects({ initialProjects }: ProjectsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const blindsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const [activeCategory, setActiveCategory] = useState<Category>("RESIDENTIAL");

  const projects = useMemo(() => mapProjects(initialProjects), [initialProjects]);

  const filteredProjects = useMemo(
    () => projects.filter((p) => p.category === activeCategory),
    [activeCategory, projects]
  );

  // ---------- PAGE ENTRANCE: vertical blinds ----------
  // White blinds cover the page, then retract one after another from left to right.
  // They are removed once the reveal has finished.
  useGSAP(
    () => {
      const overlay = blindsRef.current;
      if (!overlay) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        overlay.style.display = "none";
        return;
      }

      const strips = overlay.querySelectorAll(".projects-blind");
      gsap.set(strips, { scaleY: 1, transformOrigin: "top" });

      gsap.to(strips, {
        scaleY: 0,
        duration: 1.1,
        ease: "power4.inOut",
        stagger: { each: 0.08, from: "start" },
        delay: 0.15,
        onComplete: () => {
          overlay.style.display = "none";
        },
      });
    },
    { scope: containerRef }
  );

  // ---------- TITLE + SUBTITLE: letter rise ----------
  // Starts after the blinds have mostly cleared, so the letters are not hidden behind them.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      if (!title || !subtitle || reduce) return;

      const titleSplit = new SplitText(title, { type: "chars", mask: "chars" });
      const subtitleSplit = new SplitText(subtitle, { type: "chars", mask: "chars" });

      gsap.from(titleSplit.chars, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.05,
        ease: "power4.out",
        delay: 1.0,
      });

      gsap.from(subtitleSplit.chars, {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.025,
        ease: "power4.out",
        delay: 1.4,
      });

      return () => {
        titleSplit.revert();
        subtitleSplit.revert();
      };
    },
    { scope: containerRef }
  );

  // ---------- CATEGORY SWITCH: wave ----------
  // Step 1: the current grid fades out. Step 2: the category changes.
  // Step 3: the new cards arrive in a diagonal wave, from the top-left corner.
  const handleCategory = (cat: Category) => {
    if (cat === activeCategory) return;

    const wrap = gridWrapRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!wrap || reduce) {
      setActiveCategory(cat);
      return;
    }

    gsap.killTweensOf(wrap);
    gsap.to(wrap, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setActiveCategory(cat),
    });
  };

  // Runs after the new grid is rendered, before the browser paints
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const wrap = gridWrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(wrap, { opacity: 1 });
    if (reduce) return;

    const cards = wrap.querySelectorAll(".project-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        // grid: "auto" reads each card's position, so the wave runs diagonally across the grid
        stagger: { amount: 0.6, grid: "auto", from: "start" },
      }
    );
  }, [activeCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <main
      ref={containerRef}
      className="bg-[#ffffff] min-h-screen text-black rounded-none"
    >
      {/* Page blinds: a fixed white overlay that retracts on entry, then is hidden */}
      <div
        ref={blindsRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] flex"
      >
        {Array.from({ length: STRIP_COUNT }).map((_, i) => (
          <div key={i} className="projects-blind flex-1 bg-white" />
        ))}
      </div>

      {/* Component 1: Header Section */}
      <div
        className={[
          "pb-10 rounded-none",
          // 01. Mobile Min (320x640)
          "px-[12px] pt-[73px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:px-[12px] min-[375px]:pt-[80px]",
          // 03. Tablet Port (768x1024)
          "md:px-[20px] md:pt-[110px]",
          // 04. Tablet Land (1024x768)
          "lg:px-[20px] lg:pt-[110px]",
          // 05. Desktop Base (1280x800)
          "xl:px-[20px] xl:pt-[110px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:px-[20px] min-[1440px]:pt-[110px]",
        ].join(" ")}
      >
        {/* Title & Tagline (wraps on very narrow screens so nothing is cut off) */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 md:gap-2 xl:gap-3 mb-4">
          {/* Component 2: Main Title ("projects") */}
          <h1
            ref={titleRef}
            className={[
              "font-bold uppercase leading-[0.8] tracking-tighter rounded-none",
              // 01. Mobile Min (320x640)
              "text-[44px]",
              // 02. Mobile Std (390x844)
              "min-[375px]:text-[56px]",
              // 03. Tablet Port (768x1024)
              "md:text-[110px]",
              // 04. Tablet Land (1024x768)
              "lg:text-[130px]",
              // 05. Desktop Base (1280x800)
              "xl:text-[180px]",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:text-[200px]",
            ].join(" ")}
          >
            projects
          </h1>

          {/* Component 3: Subtitle ("know our works") */}
          <span
            ref={subtitleRef}
            className={[
              "font-light lowercase whitespace-nowrap opacity-80",
              // 01. Mobile Min (320x640)
              "text-[14px]",
              // 02. Mobile Std (390x844)
              "min-[375px]:text-[14px]",
              // 03. Tablet Port (768x1024)
              "md:text-[16px]",
              // 04. Tablet Land (1024x768)
              "lg:text-[18px]",
              // 05. Desktop Base (1280x800)
              "xl:text-[22px]",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:text-[24px]",
            ].join(" ")}
          >
            know our works
          </span>
        </div>

        {/* Component 4: Category Buttons */}
        <div
          className={[
            "flex flex-wrap",
            // 01. Mobile Min (320x640)
            "gap-4 mt-4",
            // 02. Mobile Std (390x844)
            "min-[375px]:gap-4 min-[375px]:mt-4",
            // 03. Tablet Port (768x1024)
            "md:gap-6 md:mt-6",
            // 04. Tablet Land (1024x768)
            "lg:gap-8 lg:mt-6",
            // 05. Desktop Base (1280x800)
            "xl:gap-10 xl:mt-6",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:gap-10 min-[1440px]:mt-6",
          ].join(" ")}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={[
                "font-medium tracking-tight transition-all duration-300 relative group border-none bg-transparent p-0 m-0 cursor-pointer text-black",
                activeCategory === cat
                  ? "opacity-100"
                  : "opacity-40 [@media(hover:hover)]:hover:opacity-100",
                // 01. Mobile Min (320x640)
                "text-[14px]",
                // 02. Mobile Std (390x844)
                "min-[375px]:text-[14px]",
                // 03. Tablet Port (768x1024)
                "md:text-[16px]",
                // 04. Tablet Land (1024x768)
                "lg:text-[18px]",
                // 05. Desktop Base (1280x800)
                "xl:text-[20px]",
                // 06. Original Widescreen (1440x794)
                "min-[1440px]:text-[22px]",
              ].join(" ")}
            >
              {cat}
              <span
                className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-500 ${
                  activeCategory === cat ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Component 5: Project Grid (this wrapper is what fades during a category switch) */}
      <div
        ref={gridWrapRef}
        className={[
          "rounded-none",
          // 01. Mobile Min (320x640)
          "px-[12px] pb-[40px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:px-[12px] min-[375px]:pb-[40px]",
          // 03. Tablet Port (768x1024)
          "md:px-[20px] md:pb-[60px]",
          // 04. Tablet Land (1024x768)
          "lg:px-[20px] lg:pb-[60px]",
          // 05. Desktop Base (1280x800)
          "xl:px-[20px] xl:pb-[80px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:px-[20px] min-[1440px]:pb-[80px]",
        ].join(" ")}
      >
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono uppercase text-sm tracking-widest">
            No projects found in this category.
          </div>
        ) : (
          /* Component 6: Card Grid */
          <div
            className={[
              "grid grid-cols-1 md:grid-cols-2 rounded-none",
              // 01. Mobile Min (320x640)
              "gap-x-[12px] gap-y-[12px]",
              // 02. Mobile Std (390x844)
              "min-[375px]:gap-x-[12px] min-[375px]:gap-y-[12px]",
              // 03. Tablet Port (768x1024)
              "md:gap-x-[15px] md:gap-y-[15px]",
              // 04. Tablet Land (1024x768)
              "lg:gap-x-[15px] lg:gap-y-[15px]",
              // 05. Desktop Base (1280x800)
              "xl:gap-x-[20px] xl:gap-y-[20px]",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:gap-x-[20px] min-[1440px]:gap-y-[20px]",
            ].join(" ")}
          >
            {filteredProjects.map((proj) => (
              <BlindCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
