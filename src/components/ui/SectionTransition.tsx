"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface SectionTransitionProps {
    children: React.ReactNode;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // 1. Get all sections
        const sections = gsap.utils.toArray<HTMLElement>(containerRef.current.children);

        sections.forEach((section, index) => {
            // We only animate the entrance of sections AFTER the first one
            if (index > 0) {
                // The "Content" inside the section wrapper
                const content = section.firstElementChild;

                gsap.fromTo(content, 
                    { yPercent: 100 }, 
                    {
                        yPercent: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom", 
                            end: "top top",
                            scrub: true,
                            // Priority 1 ensures this calculates AFTER the internal horizontal pins
                            refreshPriority: -1, 
                            invalidateOnRefresh: true,
                        }
                    }
                );
            }
        });

        // Force GSAP to recalculate everything once the components load
        const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
        return () => clearTimeout(timer);

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full bg-black">
            {React.Children.map(children, (child) => (
                <div className="section-outer relative w-full overflow-visible">
                    <div className="section-inner w-full h-full will-change-transform">
                        {child}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SectionTransition;
