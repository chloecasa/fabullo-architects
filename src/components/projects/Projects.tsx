// src/components/projects/Projects.tsx
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

// Helper function to map raw Payload CMS database data into the exact format your UI expects [1, 2]
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
      img: doc.heroImg?.url || '', // Resolves the populated Media relation URL [1]
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
    <Link href={`/projects/${project.slug}`} className="block group">
      <div ref={cardRef} className="relative w-full aspect-16/10 overflow-hidden bg-zinc-400">
        <img 
            src={project.img} 
            alt={project.title} 
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
        />
        
        {/* Blinds Overlay */}
        <div className="absolute inset-0 flex flex-col pointer-events-none z-5">
          {strips.map((_, i) => (
            <div key={i} className="blind-strip flex-1 w-full scale-y-0 origin-top bg-black/20" />
          ))}
        </div>
        
        {/* Text Content */}
        <div className="absolute bottom-8 left-8 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="overflow-hidden">
            <h3 className="card-title text-white font-bold text-2xl md:text-3xl uppercase tracking-tighter leading-none">
              {project.title}
            </h3>
          </div>
          <div className="overflow-hidden">
            <p className="card-subtext text-white/70 text-[10px] font-mono uppercase tracking-[0.2em]">
              {project.subText}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ProjectsProps {
  initialProjects: any[]; // Accept live database data as a prop from page.tsx [2]
}

export default function Projects({ initialProjects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('RESIDENTIAL');
  
  // Initialize state with mapped database projects instead of mock data [2]
  const [projects, setProjects] = useState<ProjectItem[]>(() => 
    mapPayloadProjects(initialProjects)
  );

  // Sync state if initialProjects changes dynamically [2]
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
    <main className="bg-[#ffffff] min-h-screen text-black">
      {/* Header Section */}
      <div className="px-5 pt-32 md:pt-48 pb-10">
        
        <div className="flex items-baseline gap-4 mb-4">
          <h1 className="text-[15vw] md:text-[200px] font-bold uppercase leading-[0.8] tracking-tighter">
            projects
          </h1>
          <span className="text-xl md:text-3xl font-light lowercase whitespace-nowrap opacity-80">
            know our works
          </span>
        </div>

        {/* Navigation / Filter Buttons */}
        <div className="flex gap-6 md:gap-10 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-lg md:text-2xl font-medium tracking-tight transition-all duration-300 relative group
                ${activeCategory === cat ? 'opacity-100' : 'opacity-40 hover:opacity-100'}
              `}
            >
              {cat}
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-500
                ${activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'}
              `}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Project Grid Section */}
      <div className="px-5 pb-24">
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono uppercase text-sm tracking-widest">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            {filteredProjects.map((proj) => (
              <BlindCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
