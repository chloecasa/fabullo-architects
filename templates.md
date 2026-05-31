"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import PageTransition from "@/components/ui/PageTransition";


// --- Data Types ---
interface JournalEntry {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
}

const JOURNAL_ENTRIES: JournalEntry[] = Array.from({ length: 12 }).map((_, i) => ({
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

  

    const handleItemClick = (entry: JournalEntry, e: React.MouseEvent<HTMLElement>) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveEntry(entry);

    const clickedEl = e.currentTarget as HTMLElement;
    const gridContainer = clickedEl.parentElement;
    
    // Get all grid items
    const allItems = gsap.utils.toArray(".grid-item") as HTMLElement[];
    const clickedIndex = allItems.indexOf(clickedEl);
    
    // Items before and after clicked
    const itemsBefore = allItems.slice(0, clickedIndex);
    const itemsAfter = allItems.slice(clickedIndex + 1);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    // 1. Fade out items before (push up)
    if (itemsBefore.length > 0) {
      tl.to(itemsBefore, {
        opacity: 0,
        y: -50,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.inOut"
      }, 0);
    }

    // 2. Fade out items after (push down)
    if (itemsAfter.length > 0) {
      tl.to(itemsAfter, {
        opacity: 0,
        y: 50,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.inOut"
      }, 0);
    }

    // 3. Move clicked item to center and expand
    tl.to(clickedEl, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    }, 0.2);

    // 4. Reveal panel
    tl.to(panelRef.current, {
      opacity: 1,
      pointerEvents: "all",
      duration: 0.5,
      ease: "power2.inOut"
    }, 0.4);

    // 5. Fade out the clicked item as panel takes over
    tl.to(clickedEl, {
      opacity: 0,
      duration: 0.3
    }, 0.5);
  };

  

  const closePanel = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const allItems = gsap.utils.toArray(".grid-item") as HTMLElement[];

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    // 1. Fade out panel
    tl.to(panelRef.current, { 
      opacity: 0, 
      pointerEvents: "none", 
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 2. Bring back all items (accordion collapse)
    tl.to(allItems, { 
      opacity: 1, 
      scale: 1,
      y: 0,
      duration: 0.5, 
      stagger: {
        amount: 0.3,
        from: "center"
      },
      ease: "power2.out"
    }, 0.2);
  };

  return (
   
        <section className="bg-white text-[#151515] min-h-screen px-5 py-8 relative overflow-x-hidden" ref={containerRef}>
      
            {/* Header Section */}
      <div className="flex items-baseline gap-4 mt-44 mb-8">
        <h2 className="font-sans text-[clamp(4rem,13vw,200px)] font-bold uppercase leading-[0.8] tracking-tighter">
          JOURNAL
        </h2>
        <span className="text-3xl font-normal lowercase">
          keep updates on us
        </span>
      </div>

           {/* Grid Layout - 6 columns, images only, no captions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6.25">
        {JOURNAL_ENTRIES.slice(0, 12).map((entry) => (
          <figure 
            key={entry.id} 
            className="grid-item m-0 cursor-pointer transition-transform hover:scale-[1.02]" 
            onClick={(e) => handleItemClick(entry, e)}
          >
            <div 
              className="grid-image w-56 h-72 bg-cover bg-center bg-zinc-400 transition-opacity duration-300 hover:opacity-80 grayscale" 
              style={{ backgroundImage: `url(${entry.img})` }}
            />
          </figure>
        ))}
      </div>

      {/* Preview Panel */}
      <figure 
        ref={panelRef}
        className={`
          fixed inset-0 p-8 bg-white opacity-0 pointer-events-none grid gap-8
          ${isPanelRight ? 'grid-cols-[1fr_auto]' : 'grid-cols-[auto_1fr]'}
          
        `}
        style={{ zIndex: 2000 }}
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
