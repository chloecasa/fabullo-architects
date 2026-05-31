"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

// Import your templates
import PreviewPanelVersion1 from "@/components/journal/templates/PreviewPanelVersion1";
import PreviewPanelVersion2 from "@/components/journal/templates/PreviewPanelVersion2";
import PreviewPanelVersion3 from "@/components/journal/templates/PreviewPanelVersion3";
import PreviewPanelVersion4 from "@/components/journal/templates/PreviewPanelVersion4";
import PreviewPanelVersion5 from "@/components/journal/templates/PreviewPanelVersion5";

// Import your local journal data structure
import { JOURNAL_ENTRIES, JournalEntry } from "@/components/journal/JournalInfo";


const JournalHome = () => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  
  // 2. Store your entries in a React state so we can dynamically fetch from the database later.
  const [entries, setEntries] = useState<JournalEntry[]>(JOURNAL_ENTRIES);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(JOURNAL_ENTRIES[0] || null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // 3. FUTURE BACKEND INTEGRATION PLACEHOLDER:
    // Once your database is active, uncomment this to populate the page directly from your CMS:
    //
    // fetch('http://localhost:5000/api/journal')
    //   .then(res => res.json())
    //   .then(data => {
    //     setEntries(data);
    //     if (data.length > 0) setActiveEntry(data[0]);
    //   })
    //   .catch(err => console.log(err));
  }, []);

  const handleItemClick = (entry: JournalEntry, e: React.MouseEvent<HTMLElement>) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveEntry(entry);
    setActiveSlide(0);

    const clickedEl = e.currentTarget;
    const rect = clickedEl.getBoundingClientRect();
    
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    requestAnimationFrame(() => {
      if (panelRef.current) {
        panelRef.current.style.transformOrigin = `${clickX}px ${clickY}px`;
      }

      const allItems = gsap.utils.toArray(".grid-item") as HTMLElement[];
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      });

      tl.to(allItems, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.inOut"
      }, 0);

      tl.fromTo(panelRef.current, 
        {
          opacity: 0,
          scale: 0,
          transformOrigin: `${clickX}px ${clickY}px`
        },
        {
          opacity: 1,
          scale: 1,
          pointerEvents: "all",
          duration: 0.6,
          ease: "power3.out"
        }, 
        0.15
      );
    });
  };

  const closePanel = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const allItems = gsap.utils.toArray(".grid-item") as HTMLElement[];
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    tl.to(panelRef.current, { 
      opacity: 0, 
      scale: 0,
      pointerEvents: "none", 
      duration: 0.5,
      ease: "power3.in"
    });

    tl.to(allItems, { 
      opacity: 1, 
      scale: 1,
      duration: 0.4, 
      stagger: {
        amount: 0.2,
        from: "random"
      },
      ease: "power2.out"
    }, 0.3);
  };

  const goPrevSlide = () => {
    setActiveSlide((current) => Math.max(current - 1, 0));
  };

  const goNextSlide = () => {
    if (!activeEntry) return;
    setActiveSlide((current) =>
      Math.min(current + 1, (activeEntry.previewSlides?.length ?? 1) - 1)
    );
  };

  return (
    <>
      <section className="bg-white text-[#151515] min-h-screen px-5 pt-8 pb-64 relative overflow-x-hidden">
        {/* Header Section */}
        <div className="flex items-baseline gap-4 mt-44 mb-8">
          <h2 className="font-sans text-[clamp(4rem,13vw,200px)] font-bold uppercase leading-[0.8] tracking-tighter">
            JOURNAL
          </h2>
          <span className="text-3xl font-normal lowercase">
            keep updates on us
          </span>
        </div>

        {/* Grid Layout - Renders dynamic database entries cleanly */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6.25">
          {entries.slice(0, 12).map((entry) => (
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
      </section>

      {/* Render the correct template based on entry's previewTemplate */}
      {activeEntry?.previewTemplate === "version-1" && activeEntry.previewSlides && (
        <PreviewPanelVersion1
          panelRef={panelRef}
          activeSlide={activeSlide}
          slides={activeEntry.previewSlides}
          onPrevSlide={goPrevSlide}
          onNextSlide={goNextSlide}
          onSetSlide={setActiveSlide}
          onClose={closePanel}
        />
      )}

      {activeEntry?.previewTemplate === "version-2" && activeEntry.previewSlides && (
        <PreviewPanelVersion2
          panelRef={panelRef}
          activeSlide={activeSlide}
          slides={activeEntry.previewSlides}
          onPrevSlide={goPrevSlide}
          onNextSlide={goNextSlide}
          onSetSlide={setActiveSlide}
          onClose={closePanel}
        />
      )}

      {activeEntry?.previewTemplate === "version-3" && activeEntry.previewSlides && (
        <PreviewPanelVersion3
          panelRef={panelRef}
          activeSlide={activeSlide}
          slides={activeEntry.previewSlides}
          onPrevSlide={goPrevSlide}
          onNextSlide={goNextSlide}
          onSetSlide={setActiveSlide}
          onClose={closePanel}
        />
      )}

      {activeEntry?.previewTemplate === "version-4" && activeEntry.previewSlides && (
        <PreviewPanelVersion4
          panelRef={panelRef}
          activeSlide={activeSlide}
          slides={activeEntry.previewSlides}
          onPrevSlide={goPrevSlide}
          onNextSlide={goNextSlide}
          onSetSlide={setActiveSlide}
          onClose={closePanel}
        />
      )}

      {activeEntry?.previewTemplate === "version-5" && activeEntry.previewSlides && (
        <PreviewPanelVersion5
          panelRef={panelRef}
          activeSlide={activeSlide}
          slides={activeEntry.previewSlides}
          onPrevSlide={goPrevSlide}
          onNextSlide={goNextSlide}
          onSetSlide={setActiveSlide}
          onClose={closePanel}
        />
      )}
    </>
  );
};

export default JournalHome;
