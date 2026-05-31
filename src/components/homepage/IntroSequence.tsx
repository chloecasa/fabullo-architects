"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

const slides = [
  "We design refined, context‑driven homes and commercial spaces shaped by clarity, craftsmanship, and purpose",
  "We focus on what you need, how you live, and how your site works",
  "Every project is guided by context, material clarity, and functional precision",
  "From first sketch to final detail, we deliver architecture that is responsive, enduring, and built to a high standard"
];

const IntroSequence: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  

  useGSAP(() => {
    const textElements = gsap.utils.toArray<HTMLElement>('.slide-text');
    
    // 1. Split Text (Keep your existing splitting logic here)
    const splitInstances = textElements.map((el) => {
      const split = new SplitType(el, { types: 'lines', lineClass: 'line-child' });
      split.lines?.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'overflow-hidden py-1 mb-[-4px]'; 
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
      return split;
    });

    // 2. Combined Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Theme switching logic inside the main ScrollTrigger
        onToggle: (self) => {
          const header = document.getElementById("main-header");
          if (header) {
            if (self.isActive) {
              header.classList.add("text-black");
              header.classList.remove("text-white");
            } else {
              header.classList.remove("text-black");
              header.classList.add("text-white");
            }
          }
        }
      }
    });

    // 3. Animation logic
    textElements.forEach((el, i) => {
      const lines = el.querySelectorAll('.line-child');
      gsap.set(lines, { yPercent: 105 });
      gsap.set(el, { opacity: 0 });

      tl.to(el, { opacity: 1, duration: 0.1 })
        .to(lines, { yPercent: 0, stagger: 0.1, duration: 1.5, ease: "power2.out" }, "<")
        .to({}, { duration: 2 }); 

      if (i < textElements.length - 1) {
        tl.to(lines, { yPercent: -105, stagger: 0.05, duration: 1, ease: "power2.in" })
          .to(el, { opacity: 0, duration: 0.1 });
      }
    });

    return () => {
      splitInstances.forEach(s => s.revert());
    };
  }, { scope: sectionRef });

  return (
    <section 
   
      ref={sectionRef} 
      // Ensure the background color is solid so it doesn't look "destroyed" during pin
      className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center z-20"
    >
      <div className="relative w-full max-w-7xl h-full flex items-center justify-center px-6" >
        {slides.map((text, index) => (
          <p
            key={index}
            className="slide-text absolute w-full text-center font-bold text-black leading-[1.1] tracking-tight font-(family-name:--font-lt-superior)" 
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              opacity: 0
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
};

export default IntroSequence;
