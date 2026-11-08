"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

import PreviewPanelVersion1 from "@/components/journal/templates/PreviewPanelVersion1";
import PreviewPanelVersion2 from "@/components/journal/templates/PreviewPanelVersion2";
import PreviewPanelVersion3 from "@/components/journal/templates/PreviewPanelVersion3";
import PreviewPanelVersion4 from "@/components/journal/templates/PreviewPanelVersion4";
import PreviewPanelVersion5 from "@/components/journal/templates/PreviewPanelVersion5";

import { JournalEntry } from "@/components/journal/JournalInfo";
import { useSearchParams } from "next/navigation";

interface JournalHomeProps {
  initialEntries: JournalEntry[];
}

const JournalHome = ({ initialEntries }: JournalHomeProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const autoOpenedSlugRef = useRef<string | null>(null);

  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries || []);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(
    initialEntries?.[0] || null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const searchParams = useSearchParams();
  const openSlug = searchParams.get("open");
  useEffect(() => {
  autoOpenedSlugRef.current = null;
}, [openSlug]);

useEffect(() => {
    const timer = setTimeout(() => {
      setEntries(initialEntries);

      if (initialEntries.length > 0 && !isPanelOpen) {
        setActiveEntry(initialEntries[0]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [initialEntries, isPanelOpen]);

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;
    if (!header) return;

    header.style.display = isPanelOpen ? "none" : "";

    return () => {
      header.style.display = "";
    };
  }, [isPanelOpen]);

 useEffect(() => {
    // Keep your original guard conditions at the top
    if (entries.length === 0 || !autoOpenedSlugRef.current) return;

    // 1. Restore the code finding the targetEntry
    const targetEntry = entries.find((entry) => entry.slug === autoOpenedSlugRef.current);
    if (!targetEntry) return;

    const timer = setTimeout(() => {
      // 2. Safe state updates (deferred)
      setIsAnimating(true);
      setActiveEntry(targetEntry);
      setActiveSlide(0);
      setIsPanelOpen(true);

      // 3. Original nested animation frame sequences (running after state updates commit)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!panelRef.current) {
            setIsAnimating(false);
            setIsPanelOpen(false);
            return;
          }

          panelRef.current.style.transformOrigin = "center center";

          const fadeTargets = gsap.utils.toArray(
            ".grid-item, .journal-header"
          ) as HTMLElement[];

          // ... your remaining GSAP animation code
        });
      });
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [entries]); // Keep your original dependency list

  const handleItemClick = (
  entry: JournalEntry,
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveEntry(entry);
    setActiveSlide(0);
    setIsPanelOpen(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    requestAnimationFrame(() => {
      if (panelRef.current) {
        panelRef.current.style.transformOrigin = `${clickX}px ${clickY}px`;
      }

      const fadeTargets = gsap.utils.toArray(
        ".grid-item, .journal-header"
      ) as HTMLElement[];

      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      tl.to(
        fadeTargets,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.inOut",
        },
        0
      );

      tl.fromTo(
        panelRef.current,
        {
          opacity: 0,
          scale: 0,
          transformOrigin: `${clickX}px ${clickY}px`,
        },
        {
          opacity: 1,
          scale: 1,
          pointerEvents: "all",
          duration: 0.6,
          ease: "power3.out",
        },
        0.15
      );
    });
  };

  const closePanel = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsPanelOpen(false);

    const fadeTargets = gsap.utils.toArray(
      ".grid-item, .journal-header"
    ) as HTMLElement[];

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to(panelRef.current, {
      opacity: 0,
      scale: 0,
      pointerEvents: "none",
      duration: 0.5,
      ease: "power3.in",
    });

    tl.to(
      fadeTargets,
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: {
          amount: 0.2,
          from: "random",
        },
        ease: "power2.out",
      },
      0.3
    );
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
      <section className="bg-white text-[#151515] min-h-svh px-5 pt-8 pb-24 md:pb-64 relative overflow-x-hidden">
        <div className="journal-header flex flex-wrap items-baseline gap-x-4 gap-y-2 mt-28 md:mt-44 mb-8">
          <h2 className="font-sans text-[clamp(3rem,13vw,200px)] font-bold uppercase leading-[0.8] tracking-tighter break-words">
            JOURNAL
          </h2>
          <span className="text-base md:text-3xl font-normal lowercase">
            keep updates on us
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {entries.slice(0, 12).map((entry) => (
            <figure
              key={entry.id}
              role="button"
              tabIndex={0}
              aria-label={entry.title}
              className="grid-item m-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515]"
              onClick={(e) => handleItemClick(entry, e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick(entry, e);
                }
              }}
            >
              <div
                className="grid-image w-full aspect-[4/5] bg-cover bg-center bg-zinc-400 grayscale transition-opacity duration-300 hover:opacity-80 active:opacity-80"
                style={{ backgroundImage: `url(${entry.img})` }}
              />
            </figure>
          ))}
        </div>
      </section>

      {activeEntry?.previewTemplate === "version-1" &&
        activeEntry.previewSlides && (
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

      {activeEntry?.previewTemplate === "version-2" &&
        activeEntry.previewSlides && (
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

      {activeEntry?.previewTemplate === "version-3" &&
        activeEntry.previewSlides && (
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

      {activeEntry?.previewTemplate === "version-4" &&
        activeEntry.previewSlides && (
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

      {activeEntry?.previewTemplate === "version-5" &&
        activeEntry.previewSlides && (
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
