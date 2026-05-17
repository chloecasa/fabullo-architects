"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  id: number;
  title: string;
  img: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, title: "Michael G. K.", img: "/assets/images/hero.png" },
  { id: 2, title: "Sarah Jenkins", img: "/assets/images/hero.png" },
  { id: 3, title: "David Chen", img: "/assets/images/hero.png" },
  { id: 4, title: "Elena Rodriguez", img: "/assets/images/hero.png" },
  { id: 5, title: "James Wilson", img: "/assets/images/hero.png" },
  { id: 6, title: "Aiko Tanaka", img: "/assets/images/hero.png" },
  { id: 7, title: "Marcus Thorne", img: "/assets/images/hero.png" },
  { id: 8, title: "Sophie Laurent", img: "/assets/images/hero.png" },
  { id: 9, title: "Omar Al-Fayed", img: "/assets/images/hero.png" },
  { id: 10, title: "Emma Thompson", img: "/assets/images/hero.png" },
];

const Teams = () => {
  const spotlightRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLHeadingElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesInnerRef = useRef<HTMLDivElement>(null);
  
  // TypeScript arrays for multiple refs
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(() => {
    if (!spotlightRef.current || !indexRef.current || !imagesContainerRef.current || !namesInnerRef.current) return;

    const totalMembers = TEAM_MEMBERS.length;
    const itemHeight = titleRefs.current[0]?.offsetHeight || 32;
    const totalNamesMove = itemHeight * (totalMembers - 1);
    
    const sectionHeight = spotlightRef.current.offsetHeight;
    const indexHeight = indexRef.current.offsetHeight;
    const moveDistanceIndex = sectionHeight - (32 * 2) - indexHeight; // 32 is padding
    const moveDistanceImages = window.innerHeight - imagesContainerRef.current.offsetHeight;

    ScrollTrigger.create({
      trigger: spotlightRef.current,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // 1. Move Index (Vertical)
        gsap.set(indexRef.current, { y: progress * moveDistanceIndex });
        
        // 2. Move Image Stack (Vertical)
        gsap.set(imagesContainerRef.current, { y: progress * moveDistanceImages });

        // 3. Move the Names Ticker
        gsap.set(namesInnerRef.current, { y: -progress * totalNamesMove });

        // 4. Update Index Text
        const currentIdx = Math.min(Math.floor(progress * totalMembers) + 1, totalMembers);
        if (indexRef.current) {
          indexRef.current.textContent = `${String(currentIdx).padStart(2, '0')}/${String(totalMembers).padStart(2, '0')}`;
        }

        // 5. Highlight Logic
        TEAM_MEMBERS.forEach((_, idx) => {
          const start = idx / totalMembers;
          const end = (idx + 1) / totalMembers;
          const isActive = progress >= start && progress < end;

          if (titleRefs.current[idx]) {
            gsap.to(titleRefs.current[idx], {
              color: isActive ? "#ffffff" : "#4a4a4a",
              duration: 0.2
            });
          }
          
          if (imgRefs.current[idx]) {
            gsap.to(imgRefs.current[idx], {
              opacity: isActive ? 1 : 0.3,
              scale: isActive ? 1 : 0.95,
              duration: 0.3
            });
          }
        });
      }
    });
  }, { scope: spotlightRef });

  return (
    <div className="bg-[#141414] text-white overflow-x-hidden font-sans">
      {/* Intro Scroll Space */}
      <section className="h-screen flex items-center justify-center text-2xl md:text-3xl font-medium text-center opacity-50 px-10">
        <p className="max-w-xl">
          A collective of designers, thinkers, and makers dedicated to the craft of built environment.
        </p>
      </section>

      {/* Main Spotlight Section */}
      <section 
        ref={spotlightRef} 
        className="relative w-full h-screen p-8 md:p-12 flex justify-between items-start"
        data-header-theme="dark"
      >
        {/* Dynamic Counter */}
        <div className="relative z-10">
          <h1 
            ref={indexRef} 
            className="text-[clamp(3rem,8vw,10rem)] font-light uppercase leading-none will-change-transform font-hoves"
          >
            01/10
          </h1>
        </div>

        {/* Center Image Stack */}
        <div 
          ref={imagesContainerRef} 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[35%] py-[50vh] flex flex-col gap-4 z-1 will-change-transform"
        >
          {TEAM_MEMBERS.map((member, i) => (
            <div 
              key={member.id} 
              ref={el => { imgRefs.current[i] = el }}
              className="w-full aspect-video overflow-hidden opacity-30 transition-all duration-500 rounded-sm"
            >
              <div className="relative w-full h-full">
                <Image 
                  src={member.img} 
                  alt={member.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Corner Name Ticker */}
        <div className="absolute right-8 md:right-12 bottom-12 h-8 md:h-12 overflow-hidden z-10 text-right">
          <div ref={namesInnerRef} className="flex flex-col items-end will-change-transform">
            {TEAM_MEMBERS.map((member, i) => (
              <p 
                key={member.id} 
                ref={el => { titleRefs.current[i] = el }}
                className="h-8 md:h-12 flex items-center text-lg md:text-2xl font-medium text-[#4a4a4a] whitespace-nowrap"
              >
                {member.title}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Outro Scroll Space */}
      <section className="h-screen flex items-center justify-center text-xl md:text-2xl opacity-40">
        <p>Our collective vision drives every detail.</p>
      </section>
    </div>
  );
};

export default Teams;
