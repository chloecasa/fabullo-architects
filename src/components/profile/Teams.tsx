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
  initialMembers: TeamMember[]; // Accept dynamic database team profiles as a prop
}

const Teams = ({ initialMembers }: TeamsProps) => {
  const spotlightRef = useRef<HTMLElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesInnerRef = useRef<HTMLDivElement>(null);
  const descInnerRef = useRef<HTMLDivElement>(null);
  
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize and sync your states with the live database entries
  const [members, setMembers] = useState<TeamMember[]>(initialMembers || []);

  useEffect(() => {
    if (initialMembers) {
      setMembers(initialMembers);
    }
  }, [initialMembers]);

  // Scroll to selected team member dynamically
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

      // SPOTLIGHT SCROLLTRIGGER (Pinning logic scales based on members length - active on ALL devices)
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
  }, [members]);

  return (
    <div className="bg-white text-black font-sans pb-32">
      
      {/* Component 1: Intro Header Section (Symmetrical margin / padding scale) */}
      <section className={[
        "team-header-section rounded-none",
        // 01. Mobile Min (320x640)
        "px-[12px] pt-[73px] pb-6",
        // 02. Mobile Std (390x844)
        "min-[375px]:px-[12px] min-[375px]:pt-[80px] min-[375px]:pb-8",
        // 03. Tablet Port (768x1024)
        "md:px-[20px] md:pt-[110px] md:pb-12",
        // 04. Tablet Land (1024x768)
        "lg:px-[20px] lg:pt-[110px] lg:pb-12",
        // 05. Desktop Base (1280x800)
        "xl:px-[20px] xl:pt-[110px] xl:pb-16",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:px-[20px] min-[1440px]:pt-[110px] min-[1440px]:pb-16"
      ].join(" ")}>
        
        {/* Title & Tagline Flex Wrapper with compact gap */}
        <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 mb-2 overflow-hidden">
          
          {/* Component 2: Main Sizing Title ("Our Team") */}
          <h1 className={[
            "team-intro-reveal font-bold uppercase leading-[0.8] tracking-tighter rounded-none",
            // 01. Mobile Min (320x640)
            "text-[40px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[52px]",
            // 03. Tablet Port (768x1024)
            "md:text-[96px]",
            // 04. Tablet Land (1024x768)
            "lg:text-[110px]",
            // 05. Desktop Base (1280x800)
            "xl:text-[120px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-[130px]"
          ].join(" ")}>
            Our Team
          </h1>
          
          {/* Component 3: Tagline ("the collective mind") */}
          <span className={[
            "team-intro-reveal font-light lowercase whitespace-nowrap opacity-60 rounded-none",
            // 01. Mobile Min (320x640)
            "text-[10px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[11px]",
            // 03. Tablet Port (768x1024)
            "md:text-[16px]",
            // 04. Tablet Land (1024x768)
            "lg:text-[18px]",
            // 05. Desktop Base (1280x800)
            "xl:text-[20px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-[22px]"
          ].join(" ")}>
            the collective mind
          </span>
        </div>

        {/* Component 4: Description Paragraph (Width, Margin-Top, and Text scale) */}
        <div className="overflow-hidden rounded-none">
          <p className={[
            "team-intro-reveal font-medium opacity-50 text-justify rounded-none leading-normal",
            // 01. Mobile Min (320x640)
            "text-xs mt-3 max-w-[280px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-xs min-[375px]:mt-3 min-[375px]:max-w-[340px]",
            // 03. Tablet Port (768x1024)
            "md:text-sm md:mt-4 md:max-w-md",
            // 04. Tablet Land (1024x768)
            "lg:text-sm lg:mt-4 lg:max-w-md",
            // 05. Desktop Base (1280x800)
            "xl:text-base xl:mt-5 xl:max-w-xl",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-base min-[1440px]:mt-5 min-[1440px]:max-w-xl"
          ].join(" ")}>
            A collective of designers, thinkers, and makers dedicated to the craft of the built environment.
          </p>
        </div>
      </section>

      {/* Main Spotlight Section (Active on ALL screens, refactoring container coordinates responsively) */}
      {members.length > 0 && (
        <section ref={spotlightRef} className="relative w-full h-screen overflow-hidden px-[12px] md:px-[20px]">
          
          {/* Component 5: LEFT SIDE: Portrait Images Container */}
          <div 
            ref={imagesContainerRef} 
            className={[
              "absolute top-0 flex flex-col gap-10 z-10 rounded-none",
              // 01. Mobile Min (320x640) - Centered and compact width
              "left-[12px] w-[200px] pt-[8vh] pb-[42vh]",
              // 02. Mobile Std (390x844) - Centered and compact width
              "min-[375px]:left-[12px] min-[375px]:w-[200px] min-[375px]:pt-[8vh] min-[375px]:pb-[42vh]",
              // 03. Tablet Port (768x1024)
              "md:left-[20px] md:w-80 md:pt-[10vh] md:pb-[40vh]",
              // 04. Tablet Land (1024x768)
              "lg:left-[20px] lg:w-80 lg:pt-[10vh] lg:pb-[40vh]",
              // 05. Desktop Base (1280x800)
              "xl:left-[20px] xl:w-80 xl:pt-[10vh] xl:pb-[40vh]",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:left-[20px] min-[1440px]:w-80 min-[1440px]:pt-[10vh] min-[1440px]:pb-[40vh]"
            ].join(" ")}
          >
            {members.map((member, i) => (
              <div 
                key={member.id} 
                ref={el => { imgRefs.current[i] = el }}
                onClick={() => scrollToMember(i)}
                className="w-full aspect-[3/4] relative cursor-pointer overflow-hidden rounded-none bg-zinc-100"
              >
                <Image 
                  src={member.img} 
                  alt={member.name} 
                  fill 
                  sizes="400px"
                  className="object-cover rounded-none" 
                />
              </div>
            ))}
          </div>

          {/* Component 6: CENTER: Names Vertical Ticker Container */}
          <div className={[
            "absolute overflow-hidden pointer-events-none rounded-none",
            // 01. Mobile Min (320x640) - Positioned directly underneath the active mobile image
            "left-[12px] top-[51vh] h-12",
            // 02. Mobile Std (390x844) - Positioned directly underneath the active mobile image
            "min-[375px]:left-[12px] min-[375px]:top-[51vh] min-[375px]:h-12",
            // 03. Tablet Port (768x1024) - Standard side-column layout
            "md:left-[360px] md:top-1/2 md:-translate-y-1/2 md:h-25",
            // 04. Tablet Land (1024x768)
            "lg:left-[360px] lg:top-1/2 lg:-translate-y-1/2 lg:h-25",
            // 05. Desktop Base (1280x800)
            "xl:left-[360px] xl:top-1/2 xl:-translate-y-1/2 xl:h-25",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[360px] min-[1440px]:top-1/2 min-[1440px]:-translate-y-1/2 min-[1440px]:h-25"
          ].join(" ")}>
            <div ref={namesInnerRef} className="flex flex-col will-change-transform rounded-none">
              {members.map((member, i) => (
                <p 
                  key={member.id} 
                  ref={el => { nameRefs.current[i] = el }}
                  className={[
                    "flex items-center font-bold uppercase tracking-tighter whitespace-nowrap rounded-none",
                    // 01. Mobile Min (320x640) - Scaled font size & line heights
                    "h-12 text-2xl",
                    // 02. Mobile Std (390x844) - Scaled font size & line heights
                    "min-[375px]:h-12 min-[375px]:text-3xl",
                    // 03. Tablet Port (768x1024)
                    "md:h-25 md:text-5xl",
                    // 04. Tablet Land (1024x768)
                    "lg:h-25 lg:text-5xl",
                    // 05. Desktop Base (1280x800)
                    "xl:h-25 xl:text-6xl",
                    // 06. Original Widescreen (1440x794)
                    "min-[1440px]:h-25 min-[1440px]:text-6xl"
                  ].join(" ")}
                >
                  {member.name}
                </p>
              ))}
            </div>
          </div>

          {/* Component 7: BOTTOM RIGHT: Description Vertical Ticker Container */}
          <div className={[
            "absolute overflow-hidden text-justify pointer-events-none rounded-none",
            // 01. Mobile Min (320x640) - Positioned directly underneath the active mobile Name
            "left-[12px] top-[60vh] w-[296px] h-24",
            // 02. Mobile Std (390x844) - Positioned directly underneath the active mobile Name
            "min-[375px]:left-[12px] min-[375px]:top-[60vh] min-[375px]:w-[366px] min-[375px]:h-24",
            // 03. Tablet Port (768x1024) - Standard side-column layout
            "md:left-auto md:right-[20px] md:bottom-12 md:top-auto md:w-80 md:h-30",
            // 04. Tablet Land (1024x768)
            "lg:left-auto lg:right-[20px] lg:bottom-12 lg:top-auto lg:w-80 lg:h-30",
            // 05. Desktop Base (1280x800)
            "xl:left-auto xl:right-[20px] xl:bottom-12 xl:top-auto xl:w-80 xl:h-30",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-auto min-[1440px]:right-[20px] min-[1440px]:bottom-12 min-[1440px]:top-auto min-[1440px]:w-80 min-[1440px]:h-30"
          ].join(" ")}>
            <div ref={descInnerRef} className={[
              "flex flex-col will-change-transform rounded-none",
              // Mobile aligns items left, desktops align items right
              "items-start md:items-end"
            ].join(" ")}>
              {members.map((member, i) => (
                <div
                  key={member.id}
                  ref={el => { descRefs.current[i] = el }}
                  className={[
                    "flex flex-col justify-center rounded-none",
                    // 01. Mobile Min (320x640) - Compact row height
                    "h-24",
                    // 02. Mobile Std (390x844) - Compact row height
                    "min-[375px]:h-24",
                    // 03. Tablet Port (768x1024)
                    "md:h-30",
                    // 04. Tablet Land (1024x768)
                    "lg:h-30",
                    // 05. Desktop Base (1280x800)
                    "xl:h-30",
                    // 06. Original Widescreen (1440x794)
                    "min-[1440px]:h-30"
                  ].join(" ")}
                >
                  <p className="text-[10px] md:text-xs uppercase leading-relaxed font-bold tracking-widest text-justify text-black/70 rounded-none">
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
