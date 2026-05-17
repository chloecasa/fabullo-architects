"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { SplitText } from "gsap/dist/SplitText";

// Register Plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

// --- Data Types ---
interface ProjectItem {
  title: string;
  subText: string;
  img: string;
  slug: string;
  overlayColor?: string;
}

const projectList: ProjectItem[] = [
  { 
    title: "Synthetic Silhouette", 
    subText: "Photography • 2024", 
    img: "/assets/projects/tareola.png", 
    slug: "tareola",
    overlayColor: "bg-[#b4aea7]/90"
  },
  { 
    title: "Material Pause", 
    subText: "Motion Study • 2023", 
    img: "/assets/projects/manning.png", 
    slug: "manning",
    overlayColor: "bg-black/80"
  },
  { 
    title: "Modern Architecture", 
    subText: "Design • Art", 
    img: "/assets/projects/hero.png", 
    slug: "p-template",
    overlayColor: "bg-[#8e9487]/90"
  },
  { 
    title: "Digital Flux", 
    subText: "UX/UI Study", 
    img: "/assets/projects/hero.png", 
    slug: "digital-flux",
    overlayColor: "bg-black/75"
  },
];

const BlindCard = ({ project }: { project: ProjectItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numStrips = 10;
  const strips = Array.from({ length: numStrips });

  useGSAP(() => {
    if (!cardRef.current) return;

    const titles = cardRef.current.querySelectorAll(".card-title, .card-subtext");
    const blindStrips = cardRef.current.querySelectorAll(".blind-strip");
    
    // Setup SplitText for the reveal
    const split = new SplitText(titles, { type: "words" });
    gsap.set(split.words, { yPercent: 105 });

    // Hover Timeline
    const tl = gsap.timeline({ paused: true });
    
    tl.to(blindStrips, { 
      scaleY: 1, 
      duration: 0.6, 
      ease: "power2.inOut", 
      stagger: 0.05 
    }, 0);

    tl.to(split.words, { 
      yPercent: 0, 
      duration: 0.5, 
      ease: "power3.out", 
      stagger: 0.02 
    }, 0.3);

    const enter = () => tl.play();
    const leave = () => tl.reverse();

    const el = cardRef.current;
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      split.revert();
    };
  }, { scope: cardRef });

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div 
        ref={cardRef} 
        className="relative w-full aspect-16/10 rounded-2xl overflow-hidden cursor-pointer bg-gray-200"
      >
        {/* Main Background Image */}
        <div className="absolute inset-0">
          <Image 
            src={project.img} 
            alt={project.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        </div>
        
        {/* Blinds Overlay System */}
        <div className="absolute inset-0 flex flex-col pointer-events-none z-5">
          {strips.map((_, i) => (
            <div 
              key={i} 
              className={`blind-strip flex-1 w-full scale-y-0 origin-top ${project.overlayColor || 'bg-black/75'}`} 
            />
          ))}
        </div>

        {/* Text Content */}
        <div className="absolute bottom-14 left-8 z-10 overflow-hidden">
          <h3 className="card-title text-white font-sans text-[clamp(1.2rem,2vw,2.2rem)] font-bold leading-none">
            {project.title}
          </h3>
        </div>
        
        <div className="absolute bottom-8 left-8 z-10 overflow-hidden">
          <p className="card-subtext text-white/80 font-mono text-[0.9rem] uppercase tracking-widest">
            {project.subText}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default function Projects() {
  return (
    <main className="bg-[#fff9eb] text-black px-8 pb-24 md:pb-32" data-header-theme="light">
      {/* Page Header */}
      <div className="pt-40 mb-24 text-center">
        <h1 className="text-[clamp(2.5rem,6vw,7rem)] font-bold leading-none mb-4">
          Projects
        </h1>
        <p className="text-gray-500 font-sans text-lg max-w-xl mx-auto">
          Explore our latest work through motion and structural intent.
        </p>
      </div>
      
      {/* Project Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-350 mx-auto">
        {projectList.map((proj, idx) => (
          <BlindCard key={idx} project={proj} />
        ))}
      </div>
    </main>
  );
}
