"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ProjectProps {
  project: {
    title: string;
    description: string;
    url: string;
    tags: string[];
    img: string;
    index: string;
  };
}

const ProjectDetailView = ({ project }: ProjectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  // Helper for staggered word reveal
  const splitToSpans = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
        <span className="intro-text inline-block will-change-transform">
          {word}
        </span>
      </span>
    ));
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Hero Image Reveal (Clip Path + Scale)
    tl.fromTo(heroImgRef.current, 
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", scale: 1.1 },
      { 
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
        scale: 1,
        duration: 1.4, 
        ease: "power4.inOut" 
      }
    );

    // 2. Text Reveal (Staggered)
    tl.fromTo(".intro-text", 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: "power3.out" },
      "-=0.7"
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-black text-white font-sans overflow-x-hidden">
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden" data-header-theme="dark">
        
        {/* --- Background Image --- */}
        <div ref={heroImgRef} className="absolute inset-0 z-1">
          <Image 
            src={project.img} 
            alt={project.title} 
            fill 
            priority
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* --- Content Overlay --- */}
        <div className="relative z-10 text-center w-[90%] max-w-225 mt-[5vh]">
          <h1 className="text-[clamp(3rem,8vw,6rem)] uppercase font-bold tracking-tighter mb-5 leading-none">
            {splitToSpans(project.title)}
          </h1>
          
          <p className="intro-text font-mono text-[0.9rem] uppercase max-w-125 mx-auto mb-8 leading-relaxed text-gray-400">
            {project.description}
          </p>
          
          <div className="intro-text">
            <a 
              href={project.url} 
              className="text-white no-underline font-mono border-b border-white pb-1 text-[0.8rem] uppercase hover:opacity-50 transition-opacity"
            >
              Visit Live Site
            </a>
          </div>
        </div>

        {/* --- Footer Info --- */}
        <div className="absolute bottom-10 w-full px-10 flex justify-between items-end z-10 font-mono text-[0.75rem] uppercase">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 mb-1">Tags</span>
            {project.tags.map((tag, i) => (
              <span key={i} className="intro-text">{tag}</span>
            ))}
          </div>
          <div className="intro-text text-sm">
            {project.index}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailView;
