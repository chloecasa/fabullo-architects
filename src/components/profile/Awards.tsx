"use client";

import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Data Types ---

interface AwardEntry {
  recognition: string;
  project: string;
}

interface YearGroup {
  year: string;
  entries: AwardEntry[];
}

// Shared inner width and side padding, so every row lines up with the intro text
const ROW_INNER = "mx-auto w-full max-w-[1514px] px-3 md:px-5";

// One year: a full-width tap target, with its entries below when open
const YearItem = ({
  group,
  col2,
  col3,
}: {
  group: YearGroup;
  col2: string;
  col3: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Fade the entries in when opened (skipped for reduced motion)
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!isOpen || !panel) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(panel.children, {
        autoAlpha: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { dependencies: [isOpen] }
  );

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group relative block w-full min-h-12 cursor-pointer touch-manipulation text-left active:bg-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
      >
        <div
          className={`${ROW_INNER} award-text grid grid-cols-[1fr_auto] md:grid-cols-[1fr_2fr_1fr] items-center py-3 md:py-4`}
        >
          <span className="text-base font-semibold">{group.year}</span>
          <span className="hidden md:block" />
          <span className="flex items-center justify-end gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider">
            {isOpen ? "close" : "see more"}
            <span aria-hidden className="text-base leading-none">
              {isOpen ? "−" : "+"}
            </span>
          </span>
        </div>

        {/* Line that draws across on hover (only on devices that hover) */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      </button>

      {/* Static rule under the year: draws in on scroll */}
      <span
        aria-hidden
        className="award-rule pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-black"
      />

      {isOpen && (
        <div id={panelId} ref={panelRef}>
          {group.entries.map((entry, idx) => (
            <div
              key={`${group.year}-${idx}`}
              className="group relative border-b border-black/20"
            >
              <div
                className={`${ROW_INNER} grid grid-cols-1 gap-1 py-3 md:grid-cols-[1fr_2fr_1fr] md:items-baseline md:gap-0 md:py-4`}
              >
                <span className="hidden md:block" />

                <p className="text-base leading-snug md:pr-4 md:text-sm xl:text-base">
                  <span className="mb-0.5 block text-xs lowercase opacity-60 md:hidden">
                    {col2}
                  </span>
                  {entry.recognition}
                </p>

                <p className="text-base leading-snug md:text-right md:text-sm xl:text-base">
                  <span className="mb-0.5 block text-xs lowercase opacity-60 md:hidden">
                    {col3}
                  </span>
                  {entry.project}
                </p>
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AwardSection = ({
  title,
  data,
  columnHeaders,
}: {
  title: string;
  data: YearGroup[];
  columnHeaders: { col2: string; col3: string };
}) => {
  return (
    <div className="w-full">
      {/* Section header. Column labels only show on tablet and up; phones show labels inside each row. */}
      <div className="relative w-full">
        <div
          className={`${ROW_INNER} grid grid-cols-[1fr_auto] md:grid-cols-[1fr_2fr_1fr] items-end pb-2 md:pb-3`}
        >
          <h2 className="award-text text-2xl min-[375px]:text-3xl md:text-4xl font-medium lowercase leading-none">
            {title}
          </h2>
          <span className="award-text hidden md:block text-base font-bold lowercase text-center leading-none">
            {columnHeaders.col2}
          </span>
          <span className="award-text hidden md:block text-base font-bold lowercase text-right leading-none">
            {columnHeaders.col3}
          </span>
        </div>

        {/* Rule under the section title: draws in on scroll */}
        <span
          aria-hidden
          className="award-rule pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-black"
        />
      </div>

      {data.length === 0 && (
        <p className={`${ROW_INNER} py-4 text-base opacity-60`}>Nothing here yet.</p>
      )}

      {data.map((group) => (
        <YearItem
          key={group.year}
          group={group}
          col2={columnHeaders.col2}
          col3={columnHeaders.col3}
        />
      ))}
    </div>
  );
};

interface AwardsProps {
  initialAwards: YearGroup[];
  initialBooks: YearGroup[];
}

const Awards = ({ initialAwards, initialBooks }: AwardsProps) => {
  const containerRef = useRef<HTMLElement>(null);

  const awardsData = initialAwards || [];
  const booksData = initialBooks || [];

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = containerRef.current;
      if (!root || reduce) return;

      // Intro: title and subtitle rise from a mask, once
      gsap.fromTo(
        ".awards-intro-reveal",
        { y: "115%" },
        {
          y: "0%",
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".awards-header-section",
            start: "top 90%",
            once: true,
          },
        }
      );

      // Rules: draw from left to right as each one enters the screen
      root.querySelectorAll<HTMLElement>(".award-rule").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: rule, start: "top 92%", once: true },
          }
        );
      });

      // Text: fades and rises once as each line enters the screen
      root.querySelectorAll<HTMLElement>(".award-text").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-white w-full rounded-none"
      data-header-theme="light"
    >
      {/* Intro Header */}
      <div
        className={`awards-header-section ${ROW_INNER} pt-[73px] pb-6 min-[375px]:pt-[80px] min-[375px]:pb-8 md:pt-[110px] md:pb-12 xl:pb-16`}
      >
        <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 mb-2 overflow-hidden">
          <h1 className="awards-intro-reveal font-bold uppercase leading-[0.8] tracking-tighter text-[40px] min-[375px]:text-[52px] md:text-[96px] lg:text-[110px] xl:text-[120px] min-[1440px]:text-[130px]">
            Recognitions
          </h1>

          <span className="awards-intro-reveal font-light lowercase whitespace-nowrap opacity-60 text-[10px] min-[375px]:text-[11px] md:text-[16px] lg:text-[18px] xl:text-[20px] min-[1440px]:text-[22px]">
            achievements &amp; publications
          </span>
        </div>

        <div className="overflow-hidden">
          <p className="awards-intro-reveal font-medium opacity-50 leading-normal text-base mt-3 max-w-[340px] md:text-sm md:mt-4 md:max-w-md xl:text-base xl:mt-5 xl:max-w-xl">
            A collection of honors, awards, and featured publications celebrating our commitment to architectural excellence.
          </p>
        </div>
      </div>

      {/* Lists */}
      <div className="w-full pb-10 md:pb-16 xl:pb-20">
        <AwardSection
          title="/awards"
          data={awardsData}
          columnHeaders={{ col2: "recognition", col3: "project" }}
        />

        <div className="w-full mt-12 md:mt-16 xl:mt-24">
          <AwardSection
            title="/books"
            data={booksData}
            columnHeaders={{ col2: "details", col3: "name" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Awards;
