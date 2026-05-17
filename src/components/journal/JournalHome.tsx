"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- Data Types ---
interface JournalEntry {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
}

const JOURNAL_ENTRIES: JournalEntry[] = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  title: `Entry — 0${i + 1}`,
  subtitle: "Architectural Journal",
  desc: "An exploration of context-driven design and refined structural forms within the modern landscape.",
  img: `/assets/images/hero.png`, // Placeholder
}));

const JournalHome = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelImgRef = useRef<HTMLDivElement>(null);
  
  const [activeEntry, setActiveEntry] = useState<JournalEntry>(JOURNAL_ENTRIES[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPanelRight, setIsPanelRight] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const handleItemClick = (entry: JournalEntry, e: React.MouseEvent<HTMLElement>) => {
    if (isAnimating || !panelRef.current || !panelImgRef.current || !containerRef.current) return;
    
    setIsAnimating(true);
    setActiveEntry(entry);

    const clickedEl = e.currentTarget.querySelector(".grid-image") as HTMLElement;
    const startRect = clickedEl.getBoundingClientRect();
    
    // Determine Panel Orientation
    const isLeft = startRect.left < window.innerWidth / 2;
    setIsPanelRight(isLeft);

    // Prepare Panel Reveal
    gsap.set(panelRef.current, { opacity: 0, pointerEvents: "none" });
    const endRect = panelImgRef.current.getBoundingClientRect();

    const mainTl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    // 1. Hide Grid
    mainTl.to(".grid-item", {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: { amount: 0.2, from: "center" }
    });

    // 2. Create "Mover" Trail (The Shane Weber Effect)
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const t = (i + 1) / (steps + 1);
      const mover = document.createElement("div");
      
      // We use a global CSS class for the mover for performance
      mover.className = "journal-mover-element";
      
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const x = lerp(startRect.left + startRect.width / 2, endRect.left + endRect.width / 2, t);
      const y = lerp(startRect.top + startRect.height / 2, endRect.top + endRect.height / 2, t);

      Object.assign(mover.style, {
        backgroundImage: `url(${entry.img})`,
        width: `${width}px`,
        height: `${height}px`,
        left: `${x - width / 2}px`,
        top: `${y - height / 2}px`,
      });

      containerRef.current.appendChild(mover);

      gsap.timeline({ delay: 0.4 + (i * 0.05) })
        .fromTo(mover, 
          { clipPath: "inset(100% 0% 0% 0%)" }, 
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "sine.in" }
        )
        .to(mover, 
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.35, ease: "sine" }, 
          "+=0.14"
        )
        .add(() => mover.remove());
    }

    // 3. Show Panel
    mainTl.to(panelRef.current, {
      opacity: 1,
      pointerEvents: "all",
      duration: 0.5,
      delay: 0.3
    }, "-=0.2");
  };

  const closePanel = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    tl.to(panelRef.current, { opacity: 0, pointerEvents: "none", duration: 0.4 })
      .to(".grid-item", { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05 });
  };

  return (
    <section data-header-theme="light" className="bg-white text-[#151515] min-h-screen p-8 relative overflow-x-hidden" ref={containerRef}>
      
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4 mt-20 mb-8" data-header-theme="light">
        <h2 className="font-sans text-[clamp(2rem,10vw,5rem)] font-bold uppercase leading-[0.8]">
          OUR JOURNAL
        </h2>
        <span className="font-mono text-xs opacity-60 lowercase">
          / Index of architectural thought
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-16 py-8">
        {JOURNAL_ENTRIES.map((entry) => (
          <figure 
            key={entry.id} 
            className="grid-item m-0 cursor-pointer flex flex-col gap-2 transition-transform hover:scale-[1.02]" 
            onClick={(e) => handleItemClick(entry, e)}
          >
            <div 
              className="grid-image w-full bg-cover bg-center transition-opacity duration-300 hover:opacity-80" 
              style={{ backgroundImage: `url(${entry.img})`, aspectRatio: "4 / 5" }}
            />
            <figcaption className="text-right">
              <h3 className="text-sm font-semibold m-0 uppercase tracking-wider">{entry.title}</h3>
              <p className="text-[10px] opacity-50 m-0 uppercase font-mono">{entry.subtitle}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Preview Panel */}
      <figure 
        ref={panelRef}
        className={`
          fixed inset-0 p-8 bg-white opacity-0 pointer-events-none grid gap-8
          ${isPanelRight ? 'grid-cols-[1fr_auto]' : 'grid-cols-[auto_1fr]'}
          {{style: zIndex: 2000}}
        `}
      >
        <div 
          ref={panelImgRef}
          className={`h-full bg-cover bg-center ${isPanelRight ? 'order-2' : 'order-1'}`}
          style={{ backgroundImage: `url(${activeEntry.img})`, aspectRatio: "4 / 5"}}
        />
        
        <figcaption className={`flex flex-col justify-end pb-12 ${isPanelRight ? 'order-1 text-left items-start' : 'order-2 text-right items-end'}`}>
          <h3 className="text-3xl md:text-5xl font-bold uppercase mb-4">{activeEntry.title}</h3>
          <p className="leading-relaxed mb-8 opacity-70" style={{ maxWidth: '300px' }}>{activeEntry.desc}</p>
          <button 
            type="button" 
            className="bg-transparent border-none font-mono font-bold cursor-pointer text-red-800 hover:text-black transition-colors"
            onClick={closePanel}
          >
            [ CLOSE ]
          </button>
        </figcaption>
      </figure>
    </section>
  );
};

export default JournalHome;
