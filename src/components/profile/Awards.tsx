// src/components/profile/Awards.tsx
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
      className="group/row grid grid-cols-[1fr_2fr_1fr] items-center py-3 border-b border-black cursor-pointer transition-opacity duration-300 hover:opacity-100"
    >
      <span className="text-base font-semibold">{year}</span>
      <span className="text-base font-semibold text-center">See</span>
      <span className="text-base font-semibold text-right">More</span>
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
      className="detail-row relative grid grid-cols-[1fr_2fr_1fr] items-center py-3 cursor-pointer transition-opacity duration-300"
    >
      <span className="text-base font-semibold">
        {showYear ? year : ""}
      </span>
      <span className="text-base font-normal uppercase">
        {recognition}
      </span>
      <span className="text-base font-normal text-right">
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
      <div className="grid grid-cols-[1fr_2fr_1fr] items-end pb-2 border-b border-black">
        <h2 className="text-4xl font-medium lowercase">{title}</h2>
        <span className="text-base font-bold lowercase text-center">{columnHeaders.col2}</span>
        <span className="text-base font-bold lowercase text-right">{columnHeaders.col3}</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col group-hover/list:[&>.year-row:not(:hover)]:opacity-30">
        {data.map((group) => {
          const isOpen = openYears.includes(group.year);
          
          return (
            <React.Fragment key={group.year}>
              {!isOpen ? (
                <div
                  onClick={() => toggleYear(group.year)}
                  className="year-row grid grid-cols-[1fr_2fr_1fr] items-center py-3 border-b border-black cursor-pointer transition-opacity duration-300 hover:opacity-100"
                >
                  <span className="text-base font-semibold">{group.year}</span>
                  <span className="text-base font-semibold text-center">See</span>
                  <span className="text-base font-semibold text-right">More</span>
                </div>
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
  initialAwards: YearGroup[]; // Accept live database awards as a prop [2]
  initialBooks: YearGroup[];  // Accept live database books as a prop [2]
}

const Awards = ({ initialAwards, initialBooks }: AwardsProps) => {
  // Initialize states using pre-grouped database entries [2]
  const [awardsData, setAwardsData] = useState<YearGroup[]>(initialAwards || []);
  const [booksData, setBooksData] = useState<YearGroup[]>(initialBooks || []);

  // Keep states in sync if database props update dynamically [2]
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
    <section className="bg-white w-full min-h-screen" data-header-theme="light">
      
      {/* Intro Header Section */}
      <section className="awards-header-section px-5 pt-32 pb-16">
        <div className="flex items-baseline gap-4 mb-2 overflow-hidden">
          <h1 className="awards-intro-reveal text-[10vw] md:text-[130px] font-bold uppercase leading-[0.8] tracking-tighter">
            Recognitions
          </h1>
          <span className="awards-intro-reveal text-lg md:text-2xl font-light lowercase whitespace-nowrap opacity-60">
            achievements & publications
          </span>
        </div>
        <div className="max-w-xl overflow-hidden">
          <p className="awards-intro-reveal text-base md:text-lg font-medium opacity-50">
            A collection of honors, awards, and featured publications celebrating our commitment to architectural excellence.
          </p>
        </div>
      </section>

      <div className="mx-auto px-5 pb-24" style={{ maxWidth: '1514px' }}>
        
        {/* AWARDS SECTION */}
        <AwardSection 
          title="/awards" 
          data={awardsData}
          columnHeaders={{ col2: "recognition", col3: "project" }}
        />

        {/* BOOKS SECTION */}
        <div className="mt-24">
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
