"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Stops mobile address-bar show/hide from resetting the pin
    ScrollTrigger.config({ ignoreMobileResize: true });
}

interface ProjectSlide {
    id: number;
    image: string;
    line1: string;
    line2: string;
    slug: string;
}

interface PayloadProject {
  title: string;
  heroImg?: {
    url?: string | null;
  } | null;
  homepageFeatured?: {
    line1?: string | null;
    line2?: string | null;
  } | null;
  slug?: string | null;
}

const mapPayloadFeaturedSlides = (payloadSlides: PayloadProject[]): ProjectSlide[] => {
  if (!payloadSlides || !Array.isArray(payloadSlides)) return [];

  return payloadSlides.map((project, index) => {
    const titleWords = project.title.split(' ');
    const defaultLine1 = titleWords[0] || 'VIEW';
    const defaultLine2 = titleWords.slice(1).join(' ') || 'PROJECT';

    return {
      id: index + 1,
      image: project.heroImg?.url || '',
      line1: project.homepageFeatured?.line1 || defaultLine1,
      line2: project.homepageFeatured?.line2 || defaultLine2,
      slug: `/projects/${project.slug}`,
    };
  });
};

interface UnifiedTransitionProps {
  featuredProjects: PayloadProject[];
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

    const slideData = useMemo(() =>
        mapPayloadFeaturedSlides(featuredProjects),
        [featuredProjects]
    );

    useGSAP(() => {
        if (!isReady || !slidesContainerRef.current || !sectionRef.current || slideData.length === 0) return;

        const container = slidesContainerRef.current;
        const slides = gsap.utils.toArray<HTMLElement>(".slide-item");
        const titles = gsap.utils.toArray<HTMLElement>(".slide-title");

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        // Recalculated on every refresh, so resize and rotation stay correct
        const getMove = () => Math.max(0, container.scrollWidth - window.innerWidth);

        gsap.set(cursorRef.current, { scale: 0, autoAlpha: 0 });
        if (!reduceMotion) gsap.set(titles, { y: 50, opacity: 0 });

        const scrollTween = gsap.to(container, {
            x: () => -getMove(),
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${getMove()}`,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                refreshPriority: 0,
                snap: slideData.length > 1
                    ? {
                        snapTo: 1 / (slideData.length - 1),
                        duration: 0.1,
                        delay: 0,
                        ease: "power1.inOut"
                    }
                    : undefined,
            }
        });

        if (!reduceMotion) {
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
        }

        // Refresh after the page and images have finished loading, so the pin
        // distance is measured against the real layout
        const refreshNow = () => ScrollTrigger.refresh();
        ScrollTrigger.refresh();
        const refreshTimer = setTimeout(refreshNow, 800);
        window.addEventListener("load", refreshNow);

        // Glass cursor only on devices with a mouse
        let handleMouseMove: ((e: MouseEvent) => void) | null = null;
        if (finePointer) {
            const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
            const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

            handleMouseMove = (e: MouseEvent) => {
                xTo(e.clientX);
                yTo(e.clientY);
            };

            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            clearTimeout(refreshTimer);
            window.removeEventListener("load", refreshNow);
            if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
        };

    }, { scope: sectionRef, dependencies: [isReady, slideData] });

    const isFinePointer = () =>
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Place the cursor under the pointer first, then fade it in,
    // so it never appears at the top-left corner
    const onEnter = (e: React.MouseEvent<HTMLElement>) => {
        if (!isFinePointer() || !cursorRef.current) return;
        gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
        gsap.to(cursorRef.current, { scale: 1, autoAlpha: 1, duration: 0.3 });
    };

    const onLeave = () => {
        if (isFinePointer()) gsap.to(cursorRef.current, { scale: 0, autoAlpha: 0, duration: 0.3 });
    };

    if (slideData.length === 0) {
        return (
            <section className="h-lvh w-full bg-black flex items-center justify-center px-6 text-center text-white/50 font-mono uppercase text-xs tracking-widest">
                Please select at least 2 projects in [Homepage Settings] to initialize the slider.
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="relative h-lvh w-full overflow-hidden bg-black hover:cursor-none"
        >
            {/* Custom Glass Cursor (mouse devices only) */}
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
            <div className="h-lvh w-full flex items-center">
                <div ref={slidesContainerRef} className="flex flex-nowrap h-lvh w-fit will-change-transform">
                    {slideData.map((slide) => (
                        <div
                            key={slide.id}
                            role="link"
                            tabIndex={0}
                            aria-label={`View project: ${slide.line1} ${slide.line2}`}
                            className="slide-item relative w-screen h-lvh shrink-0 cursor-pointer group focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-4"
                            onClick={() => {
                                window.scrollTo(0, 0);
                                router.push(slide.slug);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    window.scrollTo(0, 0);
                                    router.push(slide.slug);
                                }
                            }}
                        >
                            {/* Optimized Project Image */}
                            <div className="absolute inset-0 z-0 bg-[#1a1a1a]">
                                <Image
                                    src={slide.image}
                                    alt={slide.line1}
                                    fill
                                    sizes="100vw"
                                    priority={slide.id === 1}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Title Overlay Position */}
                            <div className={[
                              "slide-title absolute z-10 text-white pointer-events-none max-w-[calc(100%-24px)]",
                              // 01. Mobile Min (320)
                              "left-[12px] bottom-[40px]",
                              // 02. Mobile Std (375+)
                              "min-[375px]:left-[12px] min-[375px]:bottom-[40px]",
                              // 03. Tablet Port (768)
                              "md:left-[20px] md:bottom-[60px]",
                              // 04. Tablet Land (1024)
                              "lg:left-[20px] lg:bottom-[60px]",
                              // 05. Desktop Base (1280)
                              "xl:left-[20px] xl:bottom-[80px]",
                              // 06. Widescreen (1440+)
                              "min-[1440px]:left-[20px] min-[1440px]:bottom-[80px]"
                            ].join(" ")}>

                                {/* Line 1: Main Project Title */}
                                <h1 className={[
                                  "leading-[0.9] m-0 uppercase font-black tracking-tighter font-sans block break-words",
                                  "text-3xl",
                                  "min-[375px]:text-4xl",
                                  "md:text-[56px]",
                                  "lg:text-[72px]",
                                  "xl:text-[84px]",
                                  "min-[1440px]:text-[100px]"
                                ].join(" ")}>
                                    {slide.line1}
                                </h1>

                                {/* Line 2: Project Metadata */}
                                <span className={[
                                  "block uppercase font-bold tracking-widest text-white/60 font-mono mt-1 md:mt-[2px] xl:mt-[2px] break-words",
                                  "text-[14px]",
                                  "md:text-[24px]",
                                  "lg:text-[24px]",
                                  "xl:text-[42px]",
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
