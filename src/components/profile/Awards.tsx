"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- Data Types ---
interface Award {
  year: string;
  title: string;
  project: string;
}

const REWARDS_DATA: Award[] = [
  { year: "2025", title: "TIDA HOMES RUNNER UP (ARCHITECT) NEW HOME OF THE YEAR", project: "FOREVER HOUSE" },
  { year: "2019", title: "Australian Institute of Architects NSW Chapter Award Houses (new)", project: "Sunrise House" },
  { year: "2019", title: "Concrete Institute of Australia, State Award for Excellence", project: "Extruded House" },
  { year: "2018", title: "Architizer Architecture+Glass Awards, Special mention", project: "Sunrise House" },
  { year: "2016", title: "Australian Institute of Architects NSW Chapter, Architecture Award", project: "House Acute" },
  { year: "2016", title: "Australian Institute of Architects NSW Chapter, Commendation", project: "W House" },
  // ... (keeping your data structure the same)
];

const BOOKS_DATA: Award[] = [
    { year: "2024", title: "The Contemporary Home", project: "Architectural Press" },
    { year: "2022", title: "Detail: Minimalist Interiors", project: "Birkhauser" },
];

const AwardItem = ({ item }: { item: Award }) => {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scope.current) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(".text-base", { yPercent: -100, duration: 0.5, ease: "power3.inOut" })
      .to(".text-revealed", { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, 0)
      .to(".moving-line", { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 0);

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
      className="group/item relative flex items-center py-8 md:py-10 border-b border-[#f0f0f0] cursor-pointer transition-opacity duration-400 ease-in-out hover:!opacity-100 "
    >
      <span className="font-mono text-[13px] w-16 md:w-24 text-[#bbb] z-5">{item.year}</span>
      
      <div className="flex-1 relative h-12 md:h-16 overflow-hidden">
        {/* Layer 1: Base Text */}
        <div className="text-base flex flex-col justify-center h-full w-full text-[#bbb]">
          <span className="text-[10px] uppercase tracking-widest mb-1">{item.title}</span>
          <span className="text-lg md:text-3xl font-semibold leading-none">{item.project}</span>
        </div>

        {/* Layer 2: Revealed Text */}
        <div className="text-revealed absolute top-full left-0 flex flex-col justify-center h-full w-full text-black">
          <span className="text-[10px] uppercase tracking-widest mb-1 opacity-50">{item.title}</span>
          <span className="text-lg md:text-3xl font-semibold leading-none">{item.project}</span>
        </div>
      </div>

      {/* The Animated Bottom Border */}
      <div className="moving-line absolute -bottom-px left-0 w-full h-0.5 bg-black scale-x-0 origin-left z-10" />
    </div>
  );
};

const Awards = () => {
  return (
    <section className="bg-white py-24 md:py-32 w-full" data-header-theme="light">
      <div className=" mx-auto px-8 md:px-12" style={{ maxWidth: '1200px' }}>
        
        {/* AWARDS GROUP */}
        <div className="group/list">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ccc] mb-12">
            Awards / Recognitions
          </h2>
          <div className="flex flex-col group-hover/list:[&>div]:opacity-30">
            {REWARDS_DATA.map((item, index) => (
              <AwardItem key={index} item={item} />
            ))}
          </div>
        </div>

        {/* BOOKS GROUP */}
        <div className="group/list mt-32">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ccc] mb-12">
            Selected Books / Publications
          </h2>
          <div className="flex flex-col group-hover/list:[&>div]:opacity-30">
            {BOOKS_DATA.map((item, index) => (
              <AwardItem key={index} item={item} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Awards;
