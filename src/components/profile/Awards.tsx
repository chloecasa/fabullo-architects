"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import React, { useRef, useState, useEffect } from "react";

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

// Component for collapsed year row (before click)
const YearRow = ({ 
  year, 
  onClick 
}: { 
  year: string; 
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="year-row group/row w-full border-b border-black cursor-pointer transition-opacity duration-300 hover:opacity-100"
    >
      {/* Inner constrained content */}
      <div className={[
        "max-w-[1514px] mx-auto grid grid-cols-[1fr_2fr_1fr] items-center",
        // Horizontal padding
        "px-[12px] md:px-[20px]",
        // 01. Mobile Min (320x640) - Compact vertical padding
        "py-2",
        // 02. Mobile Std (390x844)
        "min-[375px]:py-2",
        // 03. Tablet Port (768x1024) - Spacious vertical padding
        "md:py-3",
        // 04. Tablet Land (1024x768)
        "lg:py-3",
        // 05. Desktop Base (1280x800)
        "xl:py-4",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:py-4"
      ].join(" ")}>
        <span className={[
          "font-semibold",
          "text-xs min-[375px]:text-xs md:text-base lg:text-base xl:text-base min-[1440px]:text-base"
        ].join(" ")}>{year}</span>
        
        <span className={[
          "font-semibold text-center uppercase tracking-wider",
          "text-[10px] min-[375px]:text-[10px] md:text-sm lg:text-sm xl:text-base min-[1440px]:text-base"
        ].join(" ")}>See</span>
        
        <span className={[
          "font-semibold text-right uppercase tracking-wider",
          "text-[10px] min-[375px]:text-[10px] md:text-sm lg:text-sm xl:text-base min-[1440px]:text-base"
        ].join(" ")}>More</span>
      </div>
    </div>
  );
};

// Component for expanded detail row (after click)
const DetailRow = ({ 
  recognition, 
  project,
  showYear,
  year,
  onClose
}: { 
  recognition: string; 
  project: string;
  showYear?: boolean;
  year?: string;
  onClose?: () => void;
}) => {
  const scope = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!scope.current) return;

    tl.current = gsap.timeline({ paused: true }).to(".moving-line", { 
      scaleX: 1, 
      duration: 0.5, 
      ease: "power3.out" 
    });
  }, { scope });

  return (
    <div 
      ref={scope}
      onClick={showYear && onClose ? onClose : undefined}
      onMouseEnter={() => tl.current?.play()}
      onMouseLeave={() => tl.current?.reverse()}
      className="detail-row relative w-full cursor-pointer transition-opacity duration-300"
    >
      {/* Inner constrained content */}
      <div className={[
        "max-w-[1514px] mx-auto grid grid-cols-[1fr_2fr_1fr] items-center",
        // Horizontal padding
        "px-[12px] md:px-[20px]",
        // 01. Mobile Min (320x640)
        "py-2",
        // 02. Mobile Std (390x844)
        "min-[375px]:py-2",
        // 03. Tablet Port (768x1024)
        "md:py-3",
        // 04. Tablet Land (1024x768)
        "lg:py-3",
        // 05. Desktop Base (1280x800)
        "xl:py-4",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:py-4"
      ].join(" ")}>
        <span className={[
          "font-semibold",
          "text-xs min-[375px]:text-xs md:text-base lg:text-base xl:text-base min-[1440px]:text-base"
        ].join(" ")}>
          {showYear ? year : ""}
        </span>
        
        <span className={[
          "font-normal uppercase leading-[1.3] text-justify pr-2",
          "text-[10px] min-[375px]:text-[10px] md:text-sm lg:text-sm xl:text-base min-[1440px]:text-base"
        ].join(" ")}>
          {recognition}
        </span>
        
        <span className={[
          "font-normal text-right leading-[1.3] pl-2",
          "text-[10px] min-[375px]:text-[10px] md:text-sm lg:text-sm xl:text-base min-[1440px]:text-base"
        ].join(" ")}>
          {project}
        </span>
      </div>

      {/* Moving line that animates left to right on hover across full width */}
      <div className="moving-line absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 origin-left pointer-events-none" />
      {/* Static border line across full width */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/20 pointer-events-none" />
    </div>
  );
};

const AwardSection = ({ 
  title, 
  data,
  columnHeaders
}: { 
  title: string; 
  data: YearGroup[];
  columnHeaders: { col2: string; col3: string };
}) => {
  const [openYears, setOpenYears] = useState<string[]>([]);

  const toggleYear = (year: string) => {
    setOpenYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year) 
        : [...prev, year]
    );
  };

  return (
    <div className="group/list w-full">
      {/* Section Header with full-width border */}
      <div className="w-full border-b border-black">
        <div className={[
          "max-w-[1514px] mx-auto grid grid-cols-[1fr_2fr_1fr] items-end px-[12px] md:px-[20px]",
          // 01. Mobile Min (320x640)
          "pb-1",
          // 02. Mobile Std (390x844)
          "min-[375px]:pb-1",
          // 03. Tablet Port (768x1024)
          "md:pb-2",
          // 04. Tablet Land (1024x768)
          "lg:pb-2",
          // 05. Desktop Base (1280x800)
          "xl:pb-3",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:pb-3"
        ].join(" ")}>
          
          {/* Section title (e.g. /awards) */}
          <h2 className={[
            "font-medium lowercase rounded-none leading-none",
            "text-xl min-[375px]:text-2xl md:text-4xl lg:text-4xl xl:text-4xl min-[1440px]:text-4xl"
          ].join(" ")}>{title}</h2>
          
          {/* Column label 1 (e.g. recognition) */}
          <span className={[
            "font-bold lowercase text-center leading-none tracking-wide",
            "text-[10px] min-[375px]:text-[11px] md:text-base lg:text-base xl:text-base min-[1440px]:text-base"
          ].join(" ")}>{columnHeaders.col2}</span>
          
          {/* Column label 2 (e.g. project) */}
          <span className={[
            "font-bold lowercase text-right leading-none tracking-wide",
            "text-[10px] min-[375px]:text-[11px] md:text-base lg:text-base xl:text-base min-[1440px]:text-base"
          ].join(" ")}>{columnHeaders.col3}</span>
        </div>
      </div>

      {/* Rows wrapper */}
      <div className="w-full flex flex-col group-hover/list:[&>.year-row:not(:hover)]:opacity-30">
        {data.map((group) => {
          const isOpen = openYears.includes(group.year);
          
          return (
            <React.Fragment key={group.year}>
              {!isOpen ? (
                <YearRow
                  year={group.year}
                  onClick={() => toggleYear(group.year)}
                />
              ) : (
                <div className="group/details w-full [&:hover>.detail-row]:opacity-30 [&:hover>.detail-row:hover]:opacity-100">
                  {group.entries.map((entry, idx) => (
                    <DetailRow
                      key={`${group.year}-${idx}`}
                      recognition={entry.recognition}
                      project={entry.project}
                      showYear={idx === 0}
                      year={group.year}
                      onClose={() => toggleYear(group.year)}
                    />
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

interface AwardsProps {
  initialAwards: YearGroup[];
  initialBooks: YearGroup[];
}

const Awards = ({ initialAwards, initialBooks }: AwardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive data directly from props (no useState or useEffect needed)
  const awardsData = initialAwards || [];
  const booksData = initialBooks || [];


  useGSAP(() => {
    gsap.set(".awards-intro-reveal", { y: "115%" });
    
    gsap.to(".awards-intro-reveal", {
      y: "0%",
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".awards-header-section",
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "restart reverse restart reverse",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white w-full min-h-screen rounded-none" data-header-theme="light">
      
      {/* Component 1: Intro Header Section */}
      <section className={[
        "awards-header-section max-w-[1514px] mx-auto rounded-none",
        // Horizontal padding
        "px-[12px] md:px-[20px]",
        // Vertical spacing
        "pt-[73px] pb-6 min-[375px]:pt-[80px] min-[375px]:pb-8 md:pt-[110px] md:pb-12 xl:pb-16"
      ].join(" ")}>
        
        {/* Title & Tagline Flex Wrapper */}
        <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 mb-2 overflow-hidden">
          <h1 className={[
            "awards-intro-reveal font-bold uppercase leading-[0.8] tracking-tighter rounded-none",
            "text-[40px] min-[375px]:text-[52px] md:text-[96px] lg:text-[110px] xl:text-[120px] min-[1440px]:text-[130px]"
          ].join(" ")}>
            Recognitions
          </h1>
          
          <span className={[
            "awards-intro-reveal font-light lowercase whitespace-nowrap opacity-60",
            "text-[10px] min-[375px]:text-[11px] md:text-[16px] lg:text-[18px] xl:text-[20px] min-[1440px]:text-[22px]"
          ].join(" ")}>
            achievements & publications
          </span>
        </div>

        {/* Description Paragraph */}
        <div className="overflow-hidden rounded-none">
          <p className={[
            "awards-intro-reveal font-medium opacity-50 text-justify rounded-none leading-normal",
            "text-xs mt-3 max-w-[280px] min-[375px]:max-w-[340px] md:text-sm md:mt-4 md:max-w-md xl:text-base xl:mt-5 xl:max-w-xl"
          ].join(" ")}>
            A collection of honors, awards, and featured publications celebrating our commitment to architectural excellence.
          </p>
        </div>
      </section>

      {/* Component 5: Outer List Grid Container (Full-width for lines, bottom padding preserved) */}
      <div 
        className={[
          "w-full rounded-none",
          "pb-[40px] md:pb-[60px] xl:pb-[80px]"
        ].join(" ")}
      >
        {/* AWARDS SECTION */}
        <AwardSection 
          title="/awards" 
          data={awardsData}
          columnHeaders={{ col2: "recognition", col3: "project" }}
        />

        {/* Divider Gap */}
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
