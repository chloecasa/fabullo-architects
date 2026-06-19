"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type Category = 'RESIDENTIAL' | 'COMMERCIAL' | 'UNBUILT';

interface ProjectItem {
  id: string; 
  title: string;
  subText: string;
  img: string;
  slug: string;
  category: Category;
}

// Helper function to map raw Payload CMS database data into the exact format your UI expects
const mapPayloadProjects = (payloadDocs: any[]): ProjectItem[] => {
  if (!payloadDocs || !Array.isArray(payloadDocs)) return [];
  
  return payloadDocs.map((doc) => {
    // Determine user-friendly category string
    let subLabel = 'Residential';
    if (doc.category === 'COMMERCIAL') subLabel = 'Commercial';
    if (doc.category === 'UNBUILT') subLabel = 'Concept';

    return {
      id: String(doc.id),
      title: doc.title,
      subText: subLabel,
      img: doc.heroImg?.url || '', // Resolves the populated Media relation URL
      slug: doc.slug,
      category: doc.category as Category,
    };
  });
};

const BlindCard = ({ project }: { project: ProjectItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numStrips = 8;
  const strips = Array.from({ length: numStrips });

  useGSAP(() => {
    if (!cardRef.current) return;
    
    const titles = cardRef.current.querySelectorAll(".card-title, .card-subtext");
    const blindStrips = cardRef.current.querySelectorAll(".blind-strip");
    
    const split = new SplitText(titles, { type: "words" });
    
    gsap.set(split.words, { yPercent: 105 });

    const tl = gsap.timeline({ paused: true });
    
    tl.to(blindStrips, { 
        scaleY: 1, 
        duration: 0.5, 
        ease: "power2.inOut", 
        stagger: 0.04 
    }, 0);

    tl.to(split.words, { 
        yPercent: 0, 
        duration: 0.5, 
        ease: "power3.out", 
        stagger: 0.02 
    }, 0.2); 

    const enter = () => tl.play();
    const leave = () => tl.reverse();

    cardRef.current.addEventListener("mouseenter", enter);
    cardRef.current.addEventListener("mouseleave", leave);

    return () => {
      cardRef.current?.removeEventListener("mouseenter", enter);
      cardRef.current?.removeEventListener("mouseleave", leave);
      split.revert();
    };
  }, { scope: cardRef });

  return (
    <Link href={`/projects/${project.slug}`} className="block group no-underline">
      <div ref={cardRef} className="relative w-full aspect-16/10 overflow-hidden bg-zinc-400 rounded-none">
        <img 
            src={project.img} 
            alt={project.title} 
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-none" 
        />
        
        {/* Blinds Overlay */}
        <div className="absolute inset-0 flex flex-col pointer-events-none z-5">
          {strips.map((_, i) => (
            <div key={i} className="blind-strip flex-1 w-full scale-y-0 origin-top bg-black/20" />
          ))}
        </div>
        
        {/* Text Content */}
        <div className={[
          "absolute z-10 flex flex-col pointer-events-none",
          // 01. Mobile Min (320x640)
          "bottom-3 left-3 gap-0.5",
          // 02. Mobile Std (390x844)
          "min-[375px]:bottom-3 min-[375px]:left-3",
          // 03. Tablet Port (768x1024)
          "md:bottom-6 md:left-6 md:gap-1",
          // 04. Tablet Land (1024x768)
          "lg:bottom-6 lg:left-6",
          // 05. Desktop Base (1280x800)
          "xl:bottom-8 xl:left-8",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:bottom-8 min-[1440px]:left-8"
        ].join(" ")}>
          <div className="overflow-hidden">
            <h3 className={[
              "card-title text-white font-bold uppercase tracking-tighter leading-none",
              // 01. Mobile Min (320x640)
              "text-base",
              // 02. Mobile Std (390x844)
              "min-[375px]:text-lg",
              // 03. Tablet Port (768x1024)
              "md:text-2xl",
              // 04. Tablet Land (1024x768)
              "lg:text-2xl",
              // 05. Desktop Base (1280x800)
              "xl:text-3xl",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:text-3xl"
            ].join(" ")}>
              {project.title}
            </h3>
          </div>
          <div className="overflow-hidden">
            <p className={[
              "card-subtext text-white/70 font-mono uppercase tracking-[0.2em]",
              // 01. Mobile Min (320x640)
              "text-[8px]",
              // 02. Mobile Std (390x844)
              "min-[375px]:text-[8px]",
              // 03. Tablet Port (768x1024)
              "md:text-[9px]",
              // 04. Tablet Land (1024x768)
              "lg:text-[9px]",
              // 05. Desktop Base (1280x800)
              "xl:text-[10px]",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:text-[10px]"
            ].join(" ")}>
              {project.subText}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ProjectsProps {
  initialProjects: any[]; // Accept live database data as a prop from page.tsx
}

export default function Projects({ initialProjects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('RESIDENTIAL');
  
  // Initialize state with mapped database projects instead of mock data
  const [projects, setProjects] = useState<ProjectItem[]>(() => 
    mapPayloadProjects(initialProjects)
  );

  // Sync state if initialProjects changes dynamically
  useEffect(() => {
    setProjects(mapPayloadProjects(initialProjects));
  }, [initialProjects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.category === activeCategory);
  }, [activeCategory, projects]);

  const categories: Category[] = ['RESIDENTIAL', 'COMMERCIAL', 'UNBUILT'];

  return (
    <main className="bg-[#ffffff] min-h-screen text-black rounded-none">
      
      {/* Component 1: Header Section Container (Slightly adjusted padding to match standard top lines) */}
      <div className={[
        "pb-10 rounded-none",
        // 01. Mobile Min (320x640)
        "px-[12px] pt-[73px]",
        // 02. Mobile Std (390x844)
        "min-[375px]:px-[12px] min-[375px]:pt-[80px]",
        // 03. Tablet Port (768x1024)
        "md:px-[20px] md:pt-[110px]",
        // 04. Tablet Land (1024x768)
        "lg:px-[20px] lg:pt-[110px]",
        // 05. Desktop Base (1280x800)
        "xl:px-[20px] xl:pt-[110px]",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:px-[20px] min-[1440px]:pt-[110px]"
      ].join(" ")}>
        
       {/* Title & Tagline Flex Wrapper */}
        <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 mb-4">
          
          {/* Component 2: Main Branding Title ("projects") */}
          <h1 className={[
            "font-bold uppercase leading-[0.8] tracking-tighter rounded-none",
            // 01. Mobile Min (320x640)
            "text-[44px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[56px]",
            // 03. Tablet Port (768x1024)
            "md:text-[110px]",
            // 04. Tablet Land (1024x768)
            "lg:text-[130px]",
            // 05. Desktop Base (1280x800)
            "xl:text-[180px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-[200px]"
          ].join(" ")}>
            projects
          </h1>
          
          {/* Component 3: Subtitle Tagline ("know our works") */}
          <span className={[
            "font-light lowercase whitespace-nowrap opacity-80",
            // 01. Mobile Min (320x640)
            "text-[10px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:text-[11px]",
            // 03. Tablet Port (768x1024)
            "md:text-[16px]",
            // 04. Tablet Land (1024x768)
            "lg:text-[18px]",
            // 05. Desktop Base (1280x800)
            "xl:text-[22px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:text-[24px]"
          ].join(" ")}>
            know our works
          </span>
        </div>

        {/* Component 4: Navigation / Filter Buttons Container */}
        <div className={[
          "flex",
          // 01. Mobile Min (320x640)
          "gap-4 mt-4",
          // 02. Mobile Std (390x844)
          "min-[375px]:gap-4 min-[375px]:mt-4",
          // 03. Tablet Port (768x1024)
          "md:gap-6 md:mt-6",
          // 04. Tablet Land (1024x768)
          "lg:gap-8 lg:mt-6",
          // 05. Desktop Base (1280x800)
          "xl:gap-10 xl:mt-6",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:gap-10 min-[1440px]:mt-6"
        ].join(" ")}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "font-medium tracking-tight transition-all duration-300 relative group border-none bg-transparent p-0 m-0 cursor-pointer text-black",
                activeCategory === cat ? 'opacity-100' : 'opacity-40 hover:opacity-100',
                // 01. Mobile Min (320x640)
                "text-[11px]",
                // 02. Mobile Std (390x844)
                "min-[375px]:text-[12px]",
                // 03. Tablet Port (768x1024)
                "md:text-[16px]",
                // 04. Tablet Land (1024x768)
                "lg:text-[18px]",
                // 05. Desktop Base (1280x800)
                "xl:text-[20px]",
                // 06. Original Widescreen (1440x794)
                "min-[1440px]:text-[22px]"
              ].join(" ")}
            >
              {cat}
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-500
                ${activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'}
              `}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Component 5: Dynamic Project Grid Section Container */}
      <div className={[
        "rounded-none",
        // 01. Mobile Min (320x640)
        "px-[12px] pb-[40px]",
        // 02. Mobile Std (390x844)
        "min-[375px]:px-[12px] min-[375px]:pb-[40px]",
        // 03. Tablet Port (768x1024)
        "md:px-[20px] md:pb-[60px]",
        // 04. Tablet Land (1024x768)
        "lg:px-[20px] lg:pb-[60px]",
        // 05. Desktop Base (1280x800)
        "xl:px-[20px] xl:pb-[80px]",
        // 06. Original Widescreen (1440x794)
        "min-[1440px]:px-[20px] min-[1440px]:pb-[80px]"
      ].join(" ")}>
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono uppercase text-sm tracking-widest">
            No projects found in this category.
          </div>
        ) : (
          /* Component 6: Card Grid Gap scale */
          <div className={[
            "grid grid-cols-1 md:grid-cols-2 rounded-none",
            // 01. Mobile Min (320x640)
            "gap-x-[12px] gap-y-[12px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:gap-x-[12px] min-[375px]:gap-y-[12px]",
            // 03. Tablet Port (768x1024)
            "md:gap-x-[15px] md:gap-y-[15px]",
            // 04. Tablet Land (1024x768)
            "lg:gap-x-[15px] lg:gap-y-[15px]",
            // 05. Desktop Base (1280x800)
            "xl:gap-x-[20px] xl:gap-y-[20px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:gap-x-[20px] min-[1440px]:gap-y-[20px]"
          ].join(" ")}>
            {filteredProjects.map((proj) => (
              <BlindCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
