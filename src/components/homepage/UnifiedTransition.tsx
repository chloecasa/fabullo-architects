"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ProjectSlide {
    id: number;
    image: string;
    line1: string;
    line2: string;
    slug: string;
}

interface PayloadProject {
  title: string; // Added this property to support project.title
  heroImg?: {
    url?: string | null;
  } | null;
  homepageFeatured?: {
    line1?: string | null;
    line2?: string | null;
  } | null;
  slug?: string | null;
}

// Helper to safely format Payload's database data into the exact format your horizontal GSAP timeline expects
// Changing `any[]` to `PayloadProject[]` solves the lint warning
const mapPayloadFeaturedSlides = (payloadSlides: PayloadProject[]): ProjectSlide[] => {
  if (!payloadSlides || !Array.isArray(payloadSlides)) return [];
  
  return payloadSlides.map((project, index) => {
    // Fail-safe: If the architect didn't specify custom line-breaks, split the title by the first word!
    const titleWords = project.title.split(' ');
    const defaultLine1 = titleWords[0] || 'VIEW';
    const defaultLine2 = titleWords.slice(1).join(' ') || 'PROJECT';

    return {
      id: index + 1,
      image: project.heroImg?.url || '', // Resolves the populated Media relation URL
      line1: project.homepageFeatured?.line1 || defaultLine1,
      line2: project.homepageFeatured?.line2 || defaultLine2,
      slug: `/projects/${project.slug}`, // Directs cleanly to your dynamic project detail page
    };
  });
};

interface UnifiedTransitionProps {
  featuredProjects: PayloadProject[]; // Accepts typed projects instead of any[]
}

const UnifiedTransition = ({ featuredProjects }: UnifiedTransitionProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const slidesContainerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // 2. Map database projects dynamically, falling back to an empty array if none selected
    const slideData = useMemo(() => 
        mapPayloadFeaturedSlides(featuredProjects), 
        [featuredProjects]
    );

    useGSAP(() => {
        if (!isReady || !slidesContainerRef.current || !sectionRef.current || slideData.length === 0) return;

        const slides = gsap.utils.toArray<HTMLElement>(".slide-item");
        const titles = gsap.utils.toArray<HTMLElement>(".slide-title");

        gsap.set(titles, { y: 50, opacity: 0 });
        gsap.set(cursorRef.current, { scale: 0, autoAlpha: 0 });

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
                refreshPriority: 0,
                snap: {
                    snapTo: 1 / (slideData.length - 1), // Calculates stop points dynamically based on actual database count
                    duration: 0.1,                     
                    delay: 0,                          
                    ease: "power1.inOut"               
                }, 
            }
        });

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

        ScrollTrigger.refresh();

        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => window.removeEventListener("mousemove", handleMouseMove);

    }, { scope: sectionRef, dependencies: [isReady, slideData] });

    const onEnter = () => gsap.to(cursorRef.current, { scale: 1, autoAlpha: 1, duration: 0.3 });
    const onLeave = () => gsap.to(cursorRef.current, { scale: 0, autoAlpha: 0, duration: 0.3 });

    // Fallback display if the client has not configured any featured projects yet
    if (slideData.length === 0) {
        return (
            <section className="h-screen w-full bg-black flex items-center justify-center text-white/50 font-mono uppercase text-xs tracking-widest">
                Please select exactly 4 projects in [Homepage Settings] to initialize the slider.
            </section>
        );
    }

    return (
        <section 
            ref={sectionRef} 
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="relative h-screen w-full overflow-hidden bg-black cursor-none"
        >
            {/* Custom Glass Cursor */}
            <div 
                ref={cursorRef} 
                style={{ visibility: 'hidden', zIndex: 9999 }}
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
                                router.push(slide.slug);
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

                           {/* Title Overlay Position (Controls absolute distance from bottom-left corner) */}
                            <div className={[
                              "slide-title absolute z-10 text-white pointer-events-none",
                              // 01. Mobile Min (320x640)
                              "left-[12px] bottom-[40px]",
                              // 02. Mobile Std (390x844)
                              "min-[375px]:left-[12px] min-[375px]:bottom-[40px]",
                              // 03. Tablet Port (768x1024)
                              "md:left-[20px] md:bottom-[60px]",
                              // 04. Tablet Land (1024x768)
                              "lg:left-[20px] lg:bottom-[60px]",
                              // 05. Desktop Base (1280x800)
                              "xl:left-[20px] xl:bottom-[80px]",
                              // 06. Original Widescreen (1440x794)
                              "min-[1440px]:left-[20px] min-[1440px]:bottom-[80px]"
                            ].join(" ")}>
                                
                               {/* Line 1: Main Project Title (Massive Highlight) */}
                                <h1 className={[
                                  "leading-[0.9] m-0 uppercase font-black tracking-tighter font-sans block",
                                  // 01. Mobile Min (320x640) - Compact Sizing
                                  "text-3xl",
                                  // 02. Mobile Std (390x844) - Standard Phone Sizing
                                  "min-[375px]:text-4xl",
                                  // 03. Tablet Port (768x1024) - Portrait iPad Sizing
                                  "md:text-[56px]",
                                  // 04. Tablet Land (1024x768) - Landscape iPad Sizing
                                  "lg:text-[72px]",
                                  // 05. Desktop Base (1280x800) - Laptop Display Sizing
                                  "xl:text-[84px]",
                                  // 06. Original Widescreen (1440x794) - Widescreen Sizing
                                  "min-[1440px]:text-[100px]"
                                ].join(" ")}>
                                    {slide.line1}
                                </h1>

                                {/* Line 2: Project Date / Metadata (Small & Monospace) */}
                                <span className={[
                                  // mt-1, md:mt-[4px], and xl:mt-[6px] lessen the gap between line 1 and 2
                                  "block uppercase font-bold tracking-widest text-white/60 font-mono mt-1 md:mt-[2px] xl:mt-[2px]",
                                  // 01. Mobile Min (320x640) - Compact Sizing
                                  "text-[14px]",
                                  // 02. Mobile Std (390x844) - Standard Phone Sizing
                                  "min-[375px]:text-[14px]",
                                  // 03. Tablet Port (768x1024) - Portrait iPad Sizing
                                  "md:text-[24px]",
                                  // 04. Tablet Land (1024x768) - Landscape iPad Sizing
                                  "lg:text-[24px]",
                                  // 05. Desktop Base (1280x800) - Laptop Display Sizing (added px unit)
                                  "xl:text-[42px]",
                                  // 06. Original Widescreen (1440x794) - Widescreen Sizing (added px unit)
                                  "min-[1440px]:text-[42px]"
                                ].join(" ")}>
                                    {slide.line2}
                                </span>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UnifiedTransition;
