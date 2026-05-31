"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealWrapper } from '@/components/ui/RevealWrapper';



if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Profile = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lastPosRef = useRef({ top: "0%", title: "", content: "" });
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
      content: "MCK is a multi-award winning Architecture Practice based in Sydney, Australia. We specialise in bespoke design of high quality finish and detail that is responsive to context and client brief." 
    },
    { 
      id: "story", 
      title: "Our story", 
      top: "33.33%", 
      btnY:"50%", 
      content: "MCK has developed over the past two decades a knowledge and expertise in designing prestige buildings awarded and acclaimed by the Australian Institute of Architects, the Institute of Interior Designers, and the Australian Design Council." 
    },
    { 
      id: "ethos", 
      title: "ethos", 
      top: "66.66%", 
      btnY: "83.33%", 
      content: "Architectural experience can be life changing. Phenomena in space and light. Volume and form delivering emotion and thought. Architecture is the embodiment of imagination. Our service as Architects is to assist in the journey to make idea become reality." 
    },
  ];

  const currentData = sections.find(s => s.id === activeSection);
  if (currentData) {
    lastPosRef.current = { 
        top: currentData.top, 
        title: currentData.title, 
        content: currentData.content 
    };
  }
useEffect(() => {
    if (activeSection) {
      // OPEN: Slide from right to left (100% -> 0%)
      gsap.to(panelRef.current, { x: "0%", duration: 0.8, ease: "power4.inOut" });
      gsap.to(contentRef.current, { opacity: 1, x: 0, duration: 0.5, delay: 0.4 });
    } else {
      // CLOSE: Slide from left to right (0% -> 100%) - opposite of open
      gsap.to(contentRef.current, { opacity: 0, x: 20, duration: 0.3 });
      gsap.to(panelRef.current, { 
        x: "100%", 
        duration: 0.8, 
        ease: "power4.inOut"
      });
    }
  }, [activeSection]);

   return (
    <main ref={containerRef} className="w-full bg-white">

      <RevealWrapper>
      <section  className="w-full h-110 bg-[#ffffff] relative overflow-hidden flex items-end px-5 md:px-12 pb-12">
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

        {/* INTERACTIVE LABELS - Centered vertically in their slices */}
        <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${activeSection ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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

        {/* SLIDING PANEL */}
       <div 
  ref={panelRef}
  style={{ 
    top: lastPosRef.current.top, // Keep this to remember vertical position
    height: "33.33%", 
    transform: 'translateX(100%)' // Ensure it starts hidden to the right
  }}
  className="absolute left-0 w-full bg-white z-20 flex items-center px-8 md:px-20 border-b border-black/5"
>
          <div ref={contentRef} className="opacity-0 w-full flex items-center justify-between gap-10">
            <div className="max-w-3xl text-black text-lg md:text-xl font-semibold uppercase leading-tight">
              {lastPosRef.current.content}
            </div>

            <button 
              onClick={() => setActiveSection(null)}
              className="flex items-baseline gap-2 group cursor-pointer shrink-0"
            >
              <span className="text-black text-xl md:text-2xl font-bold uppercase tracking-tighter">
                {lastPosRef.current.title}
              </span>
              <span className="text-black text-[10px] font-normal uppercase opacity-50 group-hover:opacity-100 transition-opacity">
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


