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

// 1. Defining the standard categories
type Category = 'RESIDENTIAL' | 'COMMERCIAL' | 'UNBUILT';

// 2. The Project data model (Matches what your PostgreSQL schema will look like)
interface ProjectItem {
  id: string; // Used as the primary database key
  title: string;
  subText: string;
  img: string;
  slug: string;
  category: Category;
}

// 3. Clean Mock Database: Exactly one project per category to test dynamic loading.
// When your backend is ready, this array will be replaced by an API fetch call.
const MOCK_PROJECTS_DATABASE: ProjectItem[] = [
  {
    id: "1",
    title: "The Tareola Residence",
    subText: "Residential • 2024",
    img: "/assets/images/Tareola Image.png",
    slug: "tareola-residence",
    category: 'RESIDENTIAL',
  },
  {
    id: "2",
    title: "Apex Business HQ",
    subText: "Commercial • 2024",
    img: "https://placehold.co/1514x1136/222/fff?text=Commercial+Project",
    slug: "apex-hq",
    category: 'COMMERCIAL',
  },
  {
    id: "3",
    title: "The Pavilion Concept",
    subText: "Concept • 2025",
    img: "https://placehold.co/1514x1136/111/fff?text=Unbuilt+Project",
    slug: "pavilion-concept",
    category: 'UNBUILT',
  }
];

const BlindCard = ({ project }: { project: ProjectItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numStrips = 8;
  const strips = Array.from({ length: numStrips });

  useGSAP(() => {
    if (!cardRef.current) return;
    
    const titles = cardRef.current.querySelectorAll(".card-title, .card-subtext");
    const blindStrips = cardRef.current.querySelectorAll(".blind-strip");
    
    // Setup SplitText
    const split = new SplitText(titles, { type: "words" });
    
    // Hide the words immediately on load
    gsap.set(split.words, { yPercent: 105 });

    // Create the hover timeline
    const tl = gsap.timeline({ paused: true });
    
    // Blinds scale down
    tl.to(blindStrips, { 
        scaleY: 1, 
        duration: 0.5, 
        ease: "power2.inOut", 
        stagger: 0.04 
    }, 0);

    // Text slides UP into view
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

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<Category>('RESIDENTIAL');
  // State designed to hold dynamic projects from your future database API
  const [projects, setProjects] = useState<ProjectItem[]>(MOCK_PROJECTS_DATABASE);

  useEffect(() => {
    // 4. FUTURE BACKEND INTEGRATION PLACEHOLDER:
    // When your Express backend and database are online, you will replace the line above 
    // and fetch your database data here like this:
    // 
    // fetch('http://localhost:5000/api/projects')
    //   .then(res => res.json())
    //   .then(data => setProjects(data))
    //   .catch(err => console.log(err));

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
