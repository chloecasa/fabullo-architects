"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealWrapper } from "@/components/ui/RevealWrapper";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Profile = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // Keeps track of the last selected section so content doesn't vanish while sliding out
  const [lastActiveId, setLastActiveId] = useState<string>("who");

  const containerRef = useRef<HTMLDivElement>(null);
  const imageSectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "who",
      title: "who we are",
      top: "0%",
      btnY: "16.66%",
      content: (
        <>
          MCK is a multi-award winning Architecture Practice based in Sydney, Australia.
          <br />
          <br />
          We specialise in bespoke design of high quality finish and detail that is responsive to context and client brief.
        </>
      ),
    },
    {
      id: "story",
      title: "Our story",
      top: "33.33%",
      btnY: "50%",
      content: (
        <>
          MCK has developed over the past two decades a knowledge and expertise in designing prestige buildings that has been awarded and acclaimed by the Australian Institute of Architects, the Institute of Interior Designers, and the Australian Design Council.
          <br />
          <br />
          MCK has a portfolio of commercial and residential projects with a specialisation in one-off detached houses and adaptive reuse.
        </>
      ),
    },
    {
      id: "ethos",
      title: "ethos",
      top: "66.66%",
      btnY: "83.33%",
      content: (
        <>
          {/* Column 1 of Ethos manifesto */}
          <div className="w-[578px] max-w-full text-justify justify-start text-black text-xs md:text-sm lg:text-base xl:text-xl font-semibold font-['LT_Superior']">
            Architectural experience can be life changing. Phenomena in space and light. Volume and form delivering emotion and thought. Architecture is the embodiment of imagination. Engagement with it should be sublime.
            It should bring happiness and delight. It should represent what we strive for and our common goal. It should be noble, awe-inspiring and magnificent.
            <br />
            <br />
            Responsive to site, context and end user needs. Environmentally sensitive and sustainable. Quality in finish and detail. Pleasure and benefit in function. Excitement in innovation.
          </div>

          {/* Column 2 of Ethos manifesto */}
          <div className="w-96 max-w-full text-justify justify-start text-black text-xs md:text-sm lg:text-base xl:text-xl font-semibold font-['LT_Superior'] pb-6 md:pb-0">
            All this is enveloped in building. The fabric and material that delivers the built form. This is achieved through collaboration. Of like minded people that dream, create, construct and finance. Teamwork, knowledge experience and pragmatism. To guide and see ideas come to fruition.
            <br />
            <br />
            Nurtured, with expertise, from conception to completion. Our service as Architects is to aim to deliver this manifesto. To assist in the journey to make idea become reality. Let’s make Architecture.
          </div>
        </>
      ),
    },
  ];

  const displayedData = sections.find((s) => s.id === (activeSection || lastActiveId)) || sections[0];
  const isEthos = displayedData.id === "ethos";

  const handleOpenSection = (id: string) => {
    setActiveSection(id);
    setLastActiveId(id);
  };

  useEffect(() => {
    if (activeSection) {
      gsap.to(panelRef.current, { x: "0%", duration: 0.8, ease: "power4.inOut" });
      gsap.to(contentRef.current, { opacity: 1, x: 0, duration: 0.5, delay: 0.4 });
    } else {
      gsap.to(contentRef.current, { opacity: 0, x: 20, duration: 0.3 });
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.8,
        ease: "power4.inOut",
      });
    }
  }, [activeSection]);

  return (
    <main ref={containerRef} className="w-full bg-white rounded-none">
      <RevealWrapper>
        {/* Component 1: Intro Header Section */}
        <section className={[
          "w-full bg-white relative overflow-hidden flex items-end rounded-none",
          // 01. Mobile Min (320x640)
          "h-[140px] px-[12px] pb-[16px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:h-[160px] min-[375px]:px-[12px] min-[375px]:pb-[20px]",
          // 03. Tablet Port (768x1024)
          "md:h-[220px] md:px-[20px] md:pb-[24px]",
          // 04. Tablet Land (1024x768)
          "lg:h-[220px] lg:px-[20px] lg:pb-[24px]",
          // 05. Desktop Base (1280x800)
          "xl:h-[280px] xl:px-[20px] xl:pb-[32px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:h-[280px] min-[1440px]:px-[20px] min-[1440px]:pb-[32px]"
        ].join(" ")}>
          
          <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 rounded-none">
            <h1 className={[
              "font-bold uppercase leading-[0.75] tracking-tighter text-black rounded-none",
              "text-[44px] min-[375px]:text-[56px] md:text-[110px] lg:text-[130px] xl:text-[180px] min-[1440px]:text-[200px]"
            ].join(" ")}>
              Profile
            </h1>
            
            <span className={[
              "font-normal lowercase text-black opacity-80 rounded-none",
              "text-[10px] min-[375px]:text-[11px] md:text-[16px] lg:text-[18px] xl:text-[22px] min-[1440px]:text-[24px]"
            ].join(" ")}>
              know who we are
            </span>
          </div>
        </section>
      </RevealWrapper>

      {/* Component 4: Image & Section Height Scale */}
      <section
        ref={imageSectionRef}
        className={[
          "relative w-full bg-zinc-400 overflow-hidden rounded-none",
          "h-[340px] min-[375px]:h-[420px] md:h-[580px] lg:h-[580px] xl:h-[750px] min-[1440px]:h-[800px]"
        ].join(" ")}
      >
        <Image
          src="/assets/images/Profile.webp"
          alt="Profile Background"
          fill
          className="object-cover grayscale rounded-none"
          priority
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/50 z-[1] rounded-none" />

        {/* Hover buttons absolute layout */}
        <div className={`absolute inset-0 z-10 transition-opacity duration-500 rounded-none ${activeSection ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => handleOpenSection(item.id)}
              style={{ top: item.btnY }}
              className={[
                "absolute -translate-y-1/2 group flex items-baseline gap-3 text-white border-none bg-transparent p-0 m-0 cursor-pointer hover:-translate-x-2.5 transition-transform duration-500 rounded-none",
                "right-[12px] min-[375px]:right-[12px] md:right-[20px] lg:right-[20px] xl:right-[20px] min-[1440px]:right-[20px]"
              ].join(" ")}
            >
              <h2 className={[
                "font-semibold uppercase tracking-tight rounded-none",
                "text-sm min-[375px]:text-base md:text-lg lg:text-xl xl:text-2xl min-[1440px]:text-2xl"
              ].join(" ")}>{item.title}</h2>
              
              <span className="text-[10px] font-normal uppercase opacity-40 group-hover:opacity-100 tracking-widest transition-opacity rounded-none">
                click to know
              </span>
            </button>
          ))}
        </div>

        {/* Sliding Panel */}
        <div
          ref={panelRef}
          style={{
            top: isEthos ? "33.33%" : displayedData.top,
            height: isEthos ? "66.67%" : "18rem",
            transform: "translateX(100%)",
          }}
          className="absolute left-0 w-full bg-white z-20 overflow-hidden rounded-none"
        >
          <div ref={contentRef} className="opacity-0 relative w-full h-full rounded-none">
            {isEthos ? (
              <div className={[
                "absolute left-[20px] top-[20px] right-[20px] flex rounded-none",
                "flex-col gap-[12px] h-[calc(100%-40px)] overflow-y-auto",
                "min-[375px]:flex-col min-[375px]:gap-[12px] min-[375px]:h-[calc(100%-40px)] min-[375px]:overflow-y-auto",
                "md:flex-row md:gap-[20px] md:h-auto md:overflow-visible",
                "lg:flex-row lg:gap-[20px] lg:h-auto lg:overflow-visible",
                "xl:flex-row xl:gap-[20px] xl:h-auto xl:overflow-visible",
                "min-[1440px]:flex-row min-[1440px]:gap-[20px] min-[1440px]:h-auto min-[1440px]:overflow-visible"
              ].join(" ")}>
                {displayedData.content}
              </div>
            ) : (
              <div className={[
                "absolute left-[20px] top-[20px] text-justify justify-start text-black font-semibold font-['LT_Superior'] rounded-none h-[calc(100%-40px)] overflow-y-auto md:overflow-visible",
                lastOriginalWidthClass(displayedData.title),
                "text-xs max-w-[calc(100%-40px)] leading-normal pr-4 md:pr-0",
                "min-[375px]:text-xs min-[375px]:max-w-[calc(100%-40px)] min-[375px]:leading-normal min-[375px]:pr-4 min-[375px]:md:pr-0",
                "md:text-sm md:leading-[1.4] md:max-w-none",
                "lg:text-sm lg:leading-[1.4]",
                "xl:text-xl xl:leading-tight",
                "min-[1440px]:text-xl min-[1440px]:leading-tight"
              ].join(" ")}>
                {displayedData.content}
              </div>
            )}

            {/* Panel Close Button */}
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="absolute right-[20px] bottom-[20px] flex items-baseline gap-1 justify-start border-none bg-transparent cursor-pointer p-0 m-0 transition-opacity hover:opacity-40 rounded-none"
            >
              <span className="text-black text-xl font-semibold font-['LT_Superior'] uppercase rounded-none">
                {displayedData.title}
              </span>
              <span className="text-black text-xs font-normal font-['LT_Superior'] uppercase rounded-none">
                close
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

// Helper function to return original desktop widths for standard paragraphs
function lastOriginalWidthClass(title: string) {
  if (title === "Our story") {
    return "md:w-[876px]";
  }
  return "md:w-[728px]";
}

export default Profile;
