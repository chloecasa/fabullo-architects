"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

// --- Data Types ---
interface Project {
  name: string;
  img: string;
  path: string;
}

const projectData: Record<string, Project> = {
  tareola: {
    name: "Tareola Residence",
    img: "/assets/projects/tareola.png",
    path: "/projects/tareola",
  },
  template: {
    name: "Project Template",
    img: "/assets/images/hero.png",
    path: "/projects/p-template",
  },
  journal: {
    name: "Our Journal",
    img: "/assets/images/hero.png",
    path: "/journal",
  },
};

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const container = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeImg, setActiveImg] = useState("/assets/images/hero.png");
  const [match, setMatch] = useState<Project | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop(); // Stops the user from scrolling while menu is open
    } else {
      lenis?.start(); // Re-enables scroll
    }
  }, [isOpen, lenis]);
  // --- Auto-Match Logic ---
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    if (projectData[query]) {
      const found = projectData[query];
      setMatch(found);

      // Swap image with fade
      gsap.to(".menu-img-layer", {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setActiveImg(found.img);
          gsap.to(".menu-img-layer", { opacity: 1, duration: 0.4 });
        },
      });
    } else {
      setMatch(null);
      if (query === "") setActiveImg("/assets/images/hero.png");
    }
  }, [searchQuery]);

  // --- Animations ---
  useGSAP(() => {
    // Initial states
    gsap.set(".menu-overlay", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
    gsap.set(".menu-link-text", { y: 150 });
    gsap.set(".search-anim", { opacity: 0, y: -20 });

   tl.current = gsap.timeline({ paused: true })
      // Instantly make the wrapper visible right before the clip-path animation starts
      .set(container.current, { autoAlpha: 1 }) 
      .to(".menu-overlay", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.25,
        ease: "power4.inOut"
      })
      .to(".search-anim", { opacity: 1, y: 0, duration: 0.8 }, 0.6)
      .to(".menu-link-text", { y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.5);

    // Optional: Animate out main content if it exists
    if (document.querySelector(".main-content")) {
      tl.current.to(".main-content", { y: -150, opacity: 0, duration: 1.25, ease: "power4.inOut" }, 0);
    }
  }, { scope: container });

  useGSAP(() => {
    // We only care about playing/reversing the timeline here.
    // The menu is already hidden visually by the clip-path.
    if (isOpen) tl.current?.play();
    else tl.current?.reverse();
  }, [isOpen]);

  // --- Parallax ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOpen) return;
    const xPos = (e.clientX / window.innerWidth - 0.5);
    const yPos = (e.clientY / window.innerHeight - 0.5);
    
    const layers = [
      { id: "#img-1", factor: 30 },
      { id: "#img-2", factor: 60 },
      { id: "#img-3", factor: 90 },
      { id: "#img-4", factor: 120 },
    ];

    layers.forEach(layer => {
      gsap.to(layer.id, { 
        x: xPos * layer.factor, 
        y: yPos * layer.factor, 
        duration: 0.75,
        ease: "power2.out"
      });
    });
  };

  return (
    <div ref={container} onMouseMove={handleMouseMove} className="relative" style={{ zIndex: 2000, visibility: 'hidden'}}>
      <div 
        className="menu-overlay fixed top-0 left-0 w-screen h-screen bg-[#0a0a0a] flex p-8 gap-12 text-white overflow-hidden"
        style={{ pointerEvents: isOpen ? "all" : "none" }}
      >
        {/* --- Top Nav / Search --- */}
        <nav className="absolute top-0 left-0 w-full p-10 flex justify-between items-center z-50">
          <div className="flex-1 max-w-100 relative left-[10%] md:left-[60%] search-anim">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search Project..." 
                className="w-full bg-transparent border-none border-b border-white/20 text-white font-mono text-sm py-2.5 outline-none uppercase tracking-[2px] focus:border-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {match && (
                <div 
                  className="absolute top-full left-0 w-full bg-white/10 backdrop-blur-md p-4 mt-2.5 flex items-center cursor-pointer border-l-3 border-white transition-all hover:bg-white/20 hover:translate-x-1 animate-in fade-in slide-in-from-top-2"
                  onClick={() => { onClose(); router.push(match.path); }}
                >
                  <span className="font-mono text-[10px] text-white/50 mr-2.5">GO TO:</span>
                  <span className="font-bold text-base uppercase flex-1">{match.name}</span>
                  <div className="text-lg">↗</div>
                </div>
              )}
            </div>
          </div>

          <div className="cursor-pointer font-sans font-bold text-[14px] tracking-[2px] uppercase hover:text-gray-400 transition-colors" onClick={onClose}>
            [CLOSE]
          </div>
        </nav>

        {/* --- Image Section (Desktop Only) --- */}
        <div className="hidden lg:flex flex-[1.4] relative overflow-hidden bg-black justify-center items-center">
           <img id="img-4" src={activeImg} alt="" className="menu-img-layer absolute w-[110%] h-[110%] object-cover blur-[25px] opacity-20 scale-[0.82] z-10" />
           <img id="img-3" src={activeImg} alt="" className="menu-img-layer absolute w-[110%] h-[110%] object-cover blur-md opacity-40 scale-[0.88] z-20" />
           <img id="img-2" src={activeImg} alt="" className="menu-img-layer absolute w-[110%] h-[110%] object-cover blur-[5px] opacity-70 scale-[0.94] z-30" />
           <img id="img-1" src={activeImg} alt="" className="menu-img-layer absolute w-[110%] h-[110%] object-cover blur-0 opacity-100 z-40" />
           <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/30 to-[#0a0a0a]/70 z-50 pointer-events-none"></div>
        </div>

        {/* --- Links Section --- */}
        <div className="flex-1 flex flex-col justify-between pt-24 pb-4 md:pt-32 md:pb-4">
          <div className="mt-[5vh]">
        {["Home", "Projects", "Profile", "Journal", "Contact"].map((link) => (
  <div key={link} className="overflow-hidden mb-1.5">
    <p className="menu-link-text text-[clamp(3rem,5vw,5rem)] font-extrabold uppercase leading-[0.9]">
      <Link
        href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
        onClick={onClose}
        className="group relative inline-flex items-center overflow-hidden text-white px-4"
      >
        <span className="absolute left-4 -translate-x-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0.8 group-hover:opacity-100">
          -
        </span>

        <span className="relative block h-[0.9em] overflow-hidden">
          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full">
            {link}
          </span>
          <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full">
            {link}
          </span>
        </span>

        <span className="absolute right-4 translate-x-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0.8 group-hover:opacity-100">
          -
        </span>
      </Link>
    </p>
  </div>
))}
          </div>
          
            <div className="flex flex-col gap-10 pb-0">
           
           
             
             <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">© MGK ARCHITECTS / 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
