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
  isOpen, 
  onClick 
}: { 
  year: string; 
  isOpen: boolean; 
  onClick: () => void;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      onClick={onClick}
      className={[
        "group/row grid grid-cols-[1fr_2fr_1fr] items-center border-b border-black cursor-pointer transition-opacity duration-300 hover:opacity-100",
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
      ].join(" ")}
    >
      <span className={[
        "font-semibold",
        // 01. Mobile Min (320x640)
        "text-xs",
        // 02. Mobile Std (390x844)
        "min-[375px]:text-xs",
        // 03. Tablet Port (768x1024)
        "md:text-base",
        // 04. Tablet Land (1024x768)
        "lg:text-base",
        // 05. Desktop Base (1280x800)
        "xl:text-base",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:text-base"
      ].join(" ")}>{year}</span>
      
      <span className={[
        "font-semibold text-center uppercase tracking-wider",
        // 01. Mobile Min (320x640)
        "text-[10px]",
        // 02. Mobile Std (390x844)
        "min-[375px]:text-[10px]",
        // 03. Tablet Port (768x1024)
        "md:text-sm",
        // 04. Tablet Land (1024x768)
        "lg:text-sm",
        // 05. Desktop Base (1280x800)
        "xl:text-base",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:text-base"
      ].join(" ")}>See</span>
      
      <span className={[
        "font-semibold text-right uppercase tracking-wider",
        // 01. Mobile Min (320x640)
        "text-[10px]",
        // 02. Mobile Std (390x844)
        "min-[375px]:text-[10px]",
        // 03. Tablet Port (768x1024)
        "md:text-sm",
        // 04. Tablet Land (1024x768)
        "lg:text-sm",
        // 05. Desktop Base (1280x800)
        "xl:text-base",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:text-base"
      ].join(" ")}>More</span>
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

  useGSAP(() => {
    if (!scope.current) return;

    const tl = gsap.timeline({ paused: true });

    // Line animates from left to right on hover
    tl.to(scope.current.querySelector(".moving-line"), { 
      scaleX: 1, 
      duration: 0.5, 
      ease: "power3.out" 
    });

    const onEnter = () => tl.play();
    const onLeave = () => tl.reverse();

    scope.current.addEventListener("mouseenter", onEnter);
    scope.current.addEventListener("mouseleave", onLeave);

    return () => {
      scope.current?.removeEventListener("mouseenter", onEnter);
      scope.current?.removeEventListener("mouseleave", onLeave);
    };
  }, { scope });

  return (
    <div 
      ref={scope}
      onClick={showYear && onClose ? onClose : undefined}
      className={[
        "detail-row relative grid grid-cols-[1fr_2fr_1fr] items-center cursor-pointer transition-opacity duration-300",
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
      ].join(" ")}
    >
      <span className={[
        "font-semibold",
        // 01. Mobile Min (320x640)
        "text-xs",
        // 02. Mobile Std (390x844)
        "min-[375px]:text-xs",
        // 03. Tablet Port (768x1024)
        "md:text-base",
        // 04. Tablet Land (1024x768)
        "lg:text-base",
        // 05. Desktop Base (1280x800)
        "xl:text-base",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:text-base"
      ].join(" ")}>
        {showYear ? year : ""}
      </span>
      
      <span className={[
        "font-normal uppercase leading-[1.3] text-justify pr-2",
        // 01. Mobile Min (320x640)
        "text-[10px]",
        // 02. Mobile Std (390x844)
        "min-[375px]:text-[10px]",
        // 03. Tablet Port (768x1024)
        "md:text-sm",
        // 04. Tablet Land (1024x768)
        "lg:text-sm",
        // 05. Desktop Base (1280x800)
        "xl:text-base",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:text-base"
      ].join(" ")}>
        {recognition}
      </span>
      
      <span className={[
        "font-normal text-right leading-[1.3] pl-2",
        // 01. Mobile Min (320x640)
        "text-[10px]",
        // 02. Mobile Std (390x844)
        "min-[375px]:text-[10px]",
        // 03. Tablet Port (768x1024)
        "md:text-sm",
        // 04. Tablet Land (1024x768)
        "lg:text-sm",
        // 05. Desktop Base (1280x800)
        "xl:text-base",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:text-base"
      ].join(" ")}>
        {project}
      </span>
      {/* Moving line that animates left to right on hover */}
      <div className="moving-line absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 origin-left" />
      {/* Static border line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/20" />
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
    <div className="group/list">
      {/* Section Header */}
      <div className={[
        "grid grid-cols-[1fr_2fr_1fr] items-end border-b border-black",
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
          // 01. Mobile Min (320x640)
          "text-xl",
          // 02. Mobile Std (390x844)
          "min-[375px]:text-2xl",
          // 03. Tablet Port (768x1024)
          "md:text-4xl",
          // 04. Tablet Land (1024x768)
          "lg:text-4xl",
          // 05. Desktop Base (1280x800)
          "xl:text-4xl",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:text-4xl"
        ].join(" ")}>{title}</h2>
        
        {/* Column label 1 (e.g. recognition) */}
        <span className={[
          "font-bold lowercase text-center leading-none tracking-wide",
          // 01. Mobile Min (320x640)
          "text-[10px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:text-[11px]",
          // 03. Tablet Port (768x1024)
          "md:text-base",
          // 04. Tablet Land (1024x768)
          "lg:text-base",
          // 05. Desktop Base (1280x800)
          "xl:text-base",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:text-base"
        ].join(" ")}>{columnHeaders.col2}</span>
        
        {/* Column label 2 (e.g. project) */}
        <span className={[
          "font-bold lowercase text-right leading-none tracking-wide",
          // 01. Mobile Min (320x640)
          "text-[10px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:text-[11px]",
          // 03. Tablet Port (768x1024)
          "md:text-base",
          // 04. Tablet Land (1024x768)
          "lg:text-base",
          // 05. Desktop Base (1280x800)
          "xl:text-base",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:text-base"
        ].join(" ")}>{columnHeaders.col3}</span>
      </div>

      {/* Rows wrapper */}
      <div className="flex flex-col group-hover/list:[&>.year-row:not(:hover)]:opacity-30">
        {data.map((group) => {
          const isOpen = openYears.includes(group.year);
          
          return (
            <React.Fragment key={group.year}>
              {!isOpen ? (
                <YearRow
                  year={group.year}
                  isOpen={isOpen}
                  onClick={() => toggleYear(group.year)}
                />
              ) : (
                <div className="group/details [&:hover>.detail-row]:opacity-30 [&:hover>.detail-row:hover]:opacity-100">
                  {group.entries.map((entry, idx) => (
                    <DetailRow
                      key={idx}
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
  initialAwards: YearGroup[]; // Accept live database awards as a prop
  initialBooks: YearGroup[];  // Accept live database books as a prop
}

const Awards = ({ initialAwards, initialBooks }: AwardsProps) => {
  // Initialize states using pre-grouped database entries
  const [awardsData, setAwardsData] = useState<YearGroup[]>(initialAwards || []);
  const [booksData, setBooksData] = useState<YearGroup[]>(initialBooks || []);

  // Keep states in sync if database props update dynamically
  useEffect(() => {
    if (initialAwards) setAwardsData(initialAwards);
    if (initialBooks) setBooksData(initialBooks);
  }, [initialAwards, initialBooks]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // INTRO REVEAL ANIMATION
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white w-full min-h-screen rounded-none" data-header-theme="light">
      
      {/* Component 1: Intro Header Section (Symmetrical margin / padding scale) */}
      <section className={[
        "awards-header-section rounded-none",
        // 01. Mobile Min (320x640)
        "px-[12px] pt-[73px] pb-6",
        // 02. Mobile Std (390x844)
        "min-[375px]:px-[12px] min-[375px]:pt-[80px] min-[375px]:pb-8",
        // 03. Tablet Port (768x1024)
        "md:px-[20px] md:pt-[110px] md:pb-12",
        // 04. Tablet Land (1024x768)
        "lg:px-[20px] lg:pt-[110px] lg:pb-12",
        // 05. Desktop Base (1280x800)
        "xl:px-[20px] xl:pt-[110px] xl:pb-16",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:px-[20px] min-[1440px]:pt-[110px] min-[1440px]:pb-16"
      ].join(" ")}>
        
        {/* Title & Tagline Flex Wrapper with compact gap */}
        <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 mb-2 overflow-hidden">
          
          {/* Component 2: Main Sizing Title ("Recognitions") */}
          <h1 className={[
            "awards-intro-reveal font-bold uppercase leading-[0.8] tracking-tighter rounded-none",
            // 01. Mobile Min (320x640)
            "text-[40px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[52px]",
            // 03. Tablet Port (768x1024)
            "md:text-[96px]",
            // 04. Tablet Land (1024x768)
            "lg:text-[110px]",
            // 05. Desktop Base (1280x800)
            "xl:text-[120px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-[130px]"
          ].join(" ")}>
            Recognitions
          </h1>
          
          {/* Component 3: Tagline ("achievements & publications") */}
          <span className={[
            "awards-intro-reveal font-light lowercase whitespace-nowrap opacity-60",
            // 01. Mobile Min (320x640)
            "text-[10px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[11px]",
            // 03. Tablet Port (768x1024)
            "md:text-[16px]",
            // 04. Tablet Land (1024x768)
            "lg:text-[18px]",
            // 05. Desktop Base (1280x800)
            "xl:text-[20px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-[22px]"
          ].join(" ")}>
            achievements & publications
          </span>
        </div>

        {/* Component 4: Description Paragraph (Width, Margin-Top, and Text scale) */}
        <div className="overflow-hidden rounded-none">
          <p className={[
            "awards-intro-reveal font-medium opacity-50 text-justify rounded-none leading-normal",
            // 01. Mobile Min (320x640)
            "text-xs mt-3 max-w-[280px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-xs min-[375px]:mt-3 min-[375px]:max-w-[340px]",
            // 03. Tablet Port (768x1024)
            "md:text-sm md:mt-4 md:max-w-md",
            // 04. Tablet Land (1024x768)
            "lg:text-sm lg:mt-4 lg:max-w-md",
            // 05. Desktop Base (1280x800)
            "xl:text-base xl:mt-5 xl:max-w-xl",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-base min-[1440px]:mt-5 min-[1440px]:max-w-xl"
          ].join(" ")}>
            A collection of honors, awards, and featured publications celebrating our commitment to architectural excellence.
          </p>
        </div>
      </section>

      {/* Component 5: Outer List Grid Container padding scale */}
      <div 
        className={[
          "mx-auto rounded-none",
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
          "min-[1440px]:px-[20px] min-[1440px]:pb-[80px]"
        ].join(" ")} 
        style={{ maxWidth: '1514px' }}
      >
        
        {/* AWARDS SECTION */}
        <AwardSection 
          title="/awards" 
          data={awardsData}
          columnHeaders={{ col2: "recognition", col3: "project" }}
        />

        {/* Component 6: Divider Gap (Spacing between Awards List and Books List) */}
        <div className={[
          "rounded-none",
          // 01. Mobile Min (320x640)
          "mt-12",
          // 02. Mobile Std (390x844)
          "min-[375px]:mt-12",
          // 03. Tablet Port (768x1024)
          "md:mt-16",
          // 04. Tablet Land (1024x768)
          "lg:mt-16",
          // 05. Desktop Base (1280x800)
          "xl:mt-24",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:mt-24"
        ].join(" ")}>
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
