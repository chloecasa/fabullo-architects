"use client";

import { useRef, useState, useEffect } from 'react'; 
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface BlogSlide {
  id: string;
  title: string;
  description: string;
  image?: string;
  bgColor: string;
  textColor: string;
  layout: 'text-only' | 'image-left' | 'image-right' | 'centered';
}

const slides: BlogSlide[] = [
  {
    id: 'one',
    title: 'Entry Point',
    description: 'The beginning of the architectural journey where space meets intent.',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-black',
    layout: 'text-only'
  },
  {
    id: 'two',
    title: 'Gesture',
    description: 'A singular movement in form that defines the character of the site.',
    image: '/assets/projects/tareola.png',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-black',
    layout: 'image-left'
  },
  {
    id: 'three',
    title: 'Variations',
    description: 'Exploring the different facets of light and material within a single structure.',
    image: '/assets/projects/tareola.png',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-black',
    layout: 'image-right'
  },
  {
    id: 'four',
    title: 'Stillness',
    description: 'Moments of silence captured in stone and glass.',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-black',
    layout: 'text-only'
  },
  {
    id: 'five',
    title: 'The Stance',
    description: 'An architectural posture that commands presence while respecting the landscape.',
    image: '/assets/projects/tareola.png',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-black',
    layout: 'centered'
  }
];

export default function HorizontalBlog() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    useGSAP(() => {
        if (!isReady) return;

        const sections = gsap.utils.toArray<HTMLElement>(".blog-section");

        sections.forEach((section, index) => {
            const innerContainer = section.querySelector(".section-container");

            // 1. Entrance Animation: Rotate the section from 30deg to 0deg as it enters
            gsap.to(innerContainer, {
                rotation: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top 20%",
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });

            // 2. Pining Logic: Pin every section except the last one
            if (index === sections.length - 1) return;

            ScrollTrigger.create({
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                pin: true,
                pinSpacing: false,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            });
        });

        // Refresh after initial load
        const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
        return () => clearTimeout(timer);

    }, { scope: containerRef, dependencies: [isReady] });

    return (
        <main ref={containerRef} className="relative bg-white overflow-hidden" data-header-theme="light">
            {slides.map((slide) => (
                <section 
                    key={slide.id} 
                    className={`blog-section relative w-full h-svh overflow-hidden bg-white ${slide.id === 'five' ? 'h-[150svh]' : ''}`}
                >
                    <div className={`
                        section-container absolute inset-0 p-8 md:p-12 flex origin-bottom-left will-change-transform rotate-30
                        ${slide.bgColor} ${slide.textColor}
                        ${slide.layout === 'centered' ? 'flex-col items-center justify-center text-center gap-8' : ''}
                    `}>
                        
                        {/* --- Layout: Text Only --- */}
                        {slide.layout === 'text-only' && (
                            <div className="flex w-full h-full">
                                <div className="flex-1 flex items-end">
                                    <h1 className="font-serif text-[clamp(3rem,10vw,15rem)] leading-none uppercase">{slide.title}</h1>
                                </div>
                                <div className="flex-1 flex items-end">
                                    <p className="font-sans text-xl md:text-3xl tracking-tight max-w-md">{slide.description}</p>
                                </div>
                            </div>
                        )}

                        {/* --- Layout: Image Left --- */}
                        {slide.layout === 'image-left' && (
                            <div className="flex w-full h-full gap-8">
                                <div className="flex-1 relative overflow-hidden group">
                                    <Image src={slide.image!} alt={slide.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <h1 className="font-serif text-[clamp(3rem,10vw,15rem)] leading-none uppercase">{slide.title}</h1>
                                    <p className="font-sans text-xl md:text-3xl tracking-tight max-w-md self-center">{slide.description}</p>
                                </div>
                            </div>
                        )}

                        {/* --- Layout: Image Right --- */}
                        {slide.layout === 'image-right' && (
                            <div className="flex w-full h-full gap-8">
                                <div className="flex-1 flex flex-col justify-between">
                                    <h1 className="font-serif text-[clamp(3rem,10vw,15rem)] leading-none uppercase">{slide.title}</h1>
                                    <p className="font-sans text-xl md:text-3xl tracking-tight max-w-md self-center">{slide.description}</p>
                                </div>
                                <div className="flex-1 relative overflow-hidden group">
                                    <Image src={slide.image!} alt={slide.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                            </div>
                        )}

                        {/* --- Layout: Centered --- */}
                        {slide.layout === 'centered' && (
                            <>
                                <div className="relative w-[80%] md:w-[30%] aspect-square overflow-hidden group">
                                    <Image src={slide.image!} alt={slide.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <h1 className="font-serif text-[clamp(3rem,8vw,12rem)] leading-none uppercase">{slide.title}</h1>
                                <p className="font-sans text-xl md:text-2xl tracking-tight max-w-2xl">{slide.description}</p>
                            </>
                        )}

                    </div>
                </section>
            ))}
        </main>
    );
}
