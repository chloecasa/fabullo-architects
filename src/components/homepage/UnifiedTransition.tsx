"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// --- Data Types ---
interface ProjectSlide {
    id: number;
    image: string;
    line1: string;
    line2: string;
    path: string;
}

const slideData: ProjectSlide[] = [
    { id: 1, image: "/assets/images/Tareola Image.png", line1: "Refined", line2: "Reception", path: "/projects/tareola" },
    { id: 2, image: "/assets/images/strong-arm.png", line1: "Practical", line2: "Luxury", path: "/profile" },
    { id: 3, image: "/assets/images/manning.png", line1: "Modern", line2: "Concrete", path: "/projects/manning" },
    { id: 4, image: "/assets/images/eveleigh.png", line1: "Minimal", line2: "Design", path: "/journal" }
];

const UnifiedTransition = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const slidesContainerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useGSAP(() => {
        if (!isReady || !slidesContainerRef.current || !sectionRef.current) return;

        const slides = gsap.utils.toArray<HTMLElement>(".slide-item");
        const titles = gsap.utils.toArray<HTMLElement>(".slide-title");

        gsap.set(titles, { y: 50, opacity: 0 });
        gsap.set(cursorRef.current, { scale: 0, autoAlpha: 0 });

        // Calculate the distance to scroll horizontally
        const totalMove = slidesContainerRef.current.scrollWidth - window.innerWidth;

const scrollTween = gsap.to(slidesContainerRef.current, {
    x: -totalMove,
    ease: "none",
    scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${totalMove}`,
        invalidateOnRefresh: true, 
        anticipatePin: 1,
        refreshPriority: 0, // <--- ADD OR UPDATE THIS
    }
});

        // --- Per-Slide Title Stagger ---
        titles.forEach((title, i) => {
            gsap.to(title, {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: slides[i],
                    containerAnimation: scrollTween,
                    start: "left 40%",
                    end: "right 30%",
                    toggleActions: "play reverse play reverse",
                }
            });
        });

        // --- Professional Cursor Performance (quickTo) ---
        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        ScrollTrigger.refresh();

        return () => window.removeEventListener("mousemove", handleMouseMove);

    }, { scope: sectionRef, dependencies: [isReady] });

    // Cursor Interactions
    const onEnter = () => gsap.to(cursorRef.current, { scale: 1, autoAlpha: 1, duration: 0.3 });
const onLeave = () => gsap.to(cursorRef.current, { scale: 0, autoAlpha: 0, duration: 0.3 });

    return (
        <section 
            ref={sectionRef} 
            data-header-theme="dark"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="relative h-screen w-full overflow-hidden bg-black cursor-none"
        >
            {/* Custom Glass Cursor */}
            <div 
    ref={cursorRef} 
    style={{ visibility: 'hidden', zIndex: 9999 }} // Hard-hide and fix z-index
    className="fixed top-0 left-0 w-30 h-11.25 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center pointer-events-none -ml-15 mt-[-22.5px]"
>
                <span className="text-white font-mono text-[11px] uppercase tracking-wider font-bold">
                    View Project
                </span>
            </div>

            {/* Horizontal Slider Wrapper */}
            <div className="h-screen w-full flex items-center">
                <div ref={slidesContainerRef} className="flex flex-nowrap h-screen w-fit will-change-transform">
                    {slideData.map((slide) => (
                        <div 
                            key={slide.id} 
                            className="slide-item relative w-screen h-screen shrink-0 cursor-pointer group"
                            onClick={() => {
                                window.scrollTo(0, 0); 
                                router.push(slide.path);
                            }}
                        >
                            {/* Optimized Project Image */}
                            <div className="absolute inset-0 z-1 bg-[#1a1a1a]">
                                <Image 
                                    src={slide.image} 
                                    alt={slide.line1} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Title Overlay */}
                            <div className="slide-title absolute bottom-[10%] left-[5%] z-10 text-white pointer-events-none">
                                <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] m-0 uppercase font-black tracking-tighter font-sans">
                                    <span className="block">{slide.line1}</span>
                                    <span className="block">{slide.line2}</span>
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UnifiedTransition;
