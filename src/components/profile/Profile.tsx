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

  const lastPosRef = useRef<{
    top: string;
    title: string;
    content: React.ReactNode;
  }>({
    top: "0%",
    title: "",
    content: "",
  });

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
          <div className="w-[578px] max-w-full text-justify justify-start text-black text-xl font-semibold font-['LT_Superior']">
            Architectural experience can be life changing. Phenomena in space and light. Volume and form delivering emotion and thought. Architecture is the embodiment of imagination. Engagement with it should be sublime.
            It should bring happiness and delight. It should represent what we strive for and our common goal. It should be noble, awe-inspiring and magnificent.
            <br />
            <br />
            Responsive to site, context and end user needs. Environmentally sensitive and sustainable. Quality in finish and detail. Pleasure and benefit in function. Excitement in innovation.
          </div>

          <div className="w-96 max-w-full text-justify justify-start text-black text-xl font-semibold font-['LT_Superior']">
            All this is enveloped in building. The fabric and material that delivers the built form. This is achieved through collaboration. Of like minded people that dream, create, construct and finance. Teamwork, knowledge experience and pragmatism. To guide and see ideas come to fruition.
            <br />
            <br />
            Nurtured, with expertise, from conception to completion. Our service as Architects is to aim to deliver this manifesto. To assist in the journey to make idea become reality. Let’s make Architecture.
          </div>
        </>
      ),
    },
  ];

  const currentData = sections.find((s) => s.id === activeSection);

  if (currentData) {
    lastPosRef.current = {
      top: currentData.top,
      title: currentData.title,
      content: currentData.content,
    };
  }

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

  const isEthos = activeSection === "ethos" || lastPosRef.current.title === "ethos";

  return (
    <main ref={containerRef} className="w-full bg-white">
      <RevealWrapper>
        <section className="w-full h-110 bg-white relative overflow-hidden flex items-end px-5 md:px-12 pb-12">
          <div className="flex items-baseline gap-4">
            <h1 className="text-[12vw] md:text-[200px] font-bold uppercase leading-[0.75] tracking-tighter text-black">
              Profile
            </h1>
            <span className="text-xl md:text-3xl font-normal lowercase text-black opacity-80">
              know who we are
            </span>
          </div>
        </section>
      </RevealWrapper>

      <section
        ref={imageSectionRef}
        className="relative w-full h-[60vh] md:h-287 bg-zinc-400 overflow-hidden"
      >
        <Image
  src="/assets/images/Profile.webp"
  alt="Profile Background"
  fill
  className="object-cover grayscale"
  priority
  sizes="100vw"
/>

<div className="absolute inset-0 bg-black/50 z-[1]" />

        <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${activeSection ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{ top: item.btnY }}
              className="absolute right-10 md:right-20 -translate-y-1/2 group flex items-baseline gap-3 text-white cursor-pointer hover:-translate-x-2.5 transition-transform duration-500"
            >
              <h2 className="text-2xl font-semibold uppercase tracking-tight">{item.title}</h2>
              <span className="text-[10px] font-normal uppercase opacity-40 group-hover:opacity-100 tracking-widest transition-opacity">
                click to know
              </span>
            </button>
          ))}
        </div>

        <div
          ref={panelRef}
          style={{
  top: isEthos ? "33.33%" : lastPosRef.current.top,
  height: isEthos ? "66.67%" : "18rem",
  transform: "translateX(100%)",
}}
          className="absolute left-0 w-full bg-white z-20 overflow-hidden"
        >
          <div ref={contentRef} className="opacity-0 relative w-full h-full">
            {isEthos ? (
              <div className="absolute left-[20px] top-[20px] flex gap-[20px]">
                {lastPosRef.current.content}
              </div>
            ) : (
              <div className={`absolute left-[20px] top-[20px] ${lastPosRef.current.title === "Our story" ? "w-[876px]" : "w-[728px]"} max-w-[calc(100%-40px)] text-justify justify-start text-black text-xl font-semibold font-['LT_Superior']`}>
                {lastPosRef.current.content}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="absolute right-[20px] bottom-[20px] flex items-baseline gap-1 justify-start cursor-pointer transition-opacity hover:opacity-40"
            >
              <span className="text-black text-2xl font-semibold font-['LT_Superior'] uppercase">
                {lastPosRef.current.title}
              </span>
              <span className="text-black text-xs font-normal font-['LT_Superior'] uppercase">
                close
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
