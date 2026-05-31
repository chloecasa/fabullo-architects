// src/components/profile/Teams.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface TeamMember {
  id: number;
  name: string;
  img: string;
  desc: string;
}

interface TeamsProps {
  initialMembers: TeamMember[]; // 1. Accept dynamic database team profiles as a prop [2]
}

const Teams = ({ initialMembers }: TeamsProps) => {
  const spotlightRef = useRef<HTMLElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesInnerRef = useRef<HTMLDivElement>(null);
  const descInnerRef = useRef<HTMLDivElement>(null);
  
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 2. Initialize and sync your states with the live database entries [2]
  const [members, setMembers] = useState<TeamMember[]>(initialMembers || []);

  useEffect(() => {
    if (initialMembers) {
      setMembers(initialMembers);
    }
  }, [initialMembers]);

  // Scroll to selected team member dynamically [3]
  const scrollToMember = (index: number) => {
  if (members.length <= 1) return;

  const st = ScrollTrigger.getById("teamTrigger");
  if (!st) return;

  const totalScroll = st.end - st.start;
  const targetScroll = st.start + (index / (members.length - 1)) * totalScroll;

  gsap.to(window, {
    scrollTo: targetScroll,
    duration: 1.2,
    ease: "power3.inOut",
  });
};

  useEffect(() => {
    if (members.length === 0) return; // Prevent timeline calculations on empty state

    let ctx = gsap.context(() => {
      
      // REPEATABLE INTRO ANIMATION
      gsap.set(".team-intro-reveal", { y: "115%" });
      
      gsap.to(".team-intro-reveal", {
        y: "0%",
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".team-header-section",
          start: "top 90%",           
          end: "bottom 10%",         
          toggleActions: "restart reverse restart reverse", 
        }
      });

      if (!spotlightRef.current || !imagesContainerRef.current || !namesInnerRef.current || !descInnerRef.current) return;

      const total = members.length;
      const nameItemHeight = nameRefs.current[0]?.offsetHeight || 80;
      const descItemHeight = descRefs.current[0]?.offsetHeight || 120;

      if (total === 1) {
  gsap.set(imgRefs.current[0], { opacity: 1, scale: 1 });
  gsap.set(nameRefs.current[0], { opacity: 1 });
  gsap.set(descRefs.current[0], { opacity: 0.7 });
  return;
}

      // SPOTLIGHT SCROLLTRIGGER (Pinning logic scales based on members length) [3]
      ScrollTrigger.create({
        id: "teamTrigger",
        trigger: spotlightRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * Math.max(total - 1, 1)}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (!imagesContainerRef.current || !namesInnerRef.current || !descInnerRef.current) return;

          const progress = self.progress;
          const moveImages = imagesContainerRef.current.offsetHeight - window.innerHeight;

          gsap.set(imagesContainerRef.current, { y: -progress * moveImages });
          gsap.set(namesInnerRef.current, { y: -progress * (nameItemHeight * (total - 1)) });
          gsap.set(descInnerRef.current, { y: -progress * (descItemHeight * (total - 1)) });

          members.forEach((_, idx) => {
            const sectionStep = 1 / (total - 1);
            const distance = Math.abs(progress - (idx * sectionStep));
            const isActive = distance < sectionStep / 2;

            if (imgRefs.current[idx]) {
              gsap.to(imgRefs.current[idx], {
                opacity: isActive ? 1 : 0.2,
                scale: isActive ? 1 : 0.95,
                duration: 0.3,
                overwrite: 'auto'
              });
            }
            if (nameRefs.current[idx]) {
              gsap.to(nameRefs.current[idx], {
                opacity: isActive ? 1 : 0.1,
                duration: 0.3,
                overwrite: 'auto'
              });
            }
            if (descRefs.current[idx]) {
              gsap.to(descRefs.current[idx], {
                opacity: isActive ? 0.7 : 0,
                duration: 0.3,
                overwrite: 'auto'
              });
            }
          });
        }
      });
    });

    return () => ctx.revert();
  }, [members]); // Re-run GSAP context when members state is ready [3]

  return (
    <div className="bg-white text-black font-sans pb-32">
      
      {/* Intro Header Section */}
      <section className="team-header-section px-8 md:px-20 pt-32 pb-0">
        <div className="flex items-baseline gap-4 mb-2 overflow-hidden">
          <h1 className="team-intro-reveal text-[10vw] md:text-[130px] font-bold uppercase leading-[0.8] tracking-tighter">
            Our Team
          </h1>
          <span className="team-intro-reveal text-lg md:text-2xl font-light lowercase whitespace-nowrap opacity-60">
            the collective mind
          </span>
        </div>
        <div className="max-w-xl overflow-hidden">
          <p className="team-intro-reveal text-base md:text-lg font-medium opacity-50">
            A collective of designers, thinkers, and makers dedicated to the craft of the built environment.
          </p>
        </div>
      </section>

      {/* Main Spotlight Section */}
      {members.length > 0 && (
        <section ref={spotlightRef} className="relative w-full h-screen overflow-hidden px-8 md:px-20">
          
          {/* LEFT SIDE: Portrait Images */}
          <div 
            ref={imagesContainerRef} 
            className="absolute left-8 md:left-20 top-0 w-64 md:w-80 pt-[10vh] pb-[40vh] flex flex-col gap-10 z-10"
          >
            {members.map((member, i) => (
              <div 
                key={member.id} 
                ref={el => { imgRefs.current[i] = el }}
                onClick={() => scrollToMember(i)}
                className="w-full aspect-3/4 relative cursor-pointer overflow-hidden rounded-sm bg-zinc-100"
              >
                <Image 
                  src={member.img} 
                  alt={member.name} 
                  fill 
                  sizes="400px"
                  className="object-cover" 
                />
              </div>
            ))}
          </div>

          {/* CENTER: Names Vertical Ticker */}
          <div className="absolute left-87.5 md:left-125 top-1/2 -translate-y-1/2 h-20 md:h-25 overflow-hidden pointer-events-none">
            <div ref={namesInnerRef} className="flex flex-col will-change-transform">
              {members.map((member, i) => (
                <p 
                  key={member.id} 
                  ref={el => { nameRefs.current[i] = el }}
                  className="h-20 md:h-25 flex items-center text-4xl md:text-6xl font-bold uppercase tracking-tighter whitespace-nowrap"
                >
                  {member.name}
                </p>
              ))}
            </div>
          </div>

          {/* BOTTOM RIGHT: Description Vertical Ticker */}
          <div className="absolute right-8 md:right-20 bottom-12 w-64 md:w-80 h-30 overflow-hidden text-justify pointer-events-none">
  <div ref={descInnerRef} className="flex flex-col items-end will-change-transform">
    {members.map((member, i) => (
      <div
        key={member.id}
        ref={el => { descRefs.current[i] = el }}
        className="h-30 flex flex-col justify-center"
      >
        <p className="text-[10px] md:text-xs uppercase leading-relaxed font-bold tracking-widest text-justify">
          {member.desc}
        </p>
      </div>
    ))}
  </div>
</div>

        </section>
      )}
    </div>
  );
};

export default Teams;
