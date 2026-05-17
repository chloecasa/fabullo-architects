"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // 0. INITIAL STATE
    // Start image below the screen
    gsap.set(".hero-image-wrap", { y: "100%" }); 
    // Start text/subhead off-screen to the right
    gsap.set(".slogan-word, .hero-subhead", { x: "300%", opacity: 0 });
    gsap.set("header", { yPercent: -100, autoAlpha: 0 });

    // 1. IMAGE REVEAL (Slides up to cover viewport)
    tl.to(".hero-image-wrap", { 
      y: "0%", 
      duration: 1.8, 
      ease: "power4.inOut" 
    })

    // 2. PAUSE (Wait 2 seconds)
    .to({}, { duration: .2 })

    // 3. TEXT SLIDE-IN (Right to Left)
    .to(".slogan-word", { 
      x: "0%", 
      opacity: 1, 
      duration: 1, 
      stagger: 0.1, 
      ease: "power4.out" 
    })
    .to(".hero-subhead", { 
      x: "0%", 
      opacity: 1, 
      duration: 1, 
      ease: "power4.out", 
    }, "-=1") // Overlap slightly with text

    // 4. HEADER DROP-DOWN
    .to("header", { 
      yPercent: 0, 
      autoAlpha: 1, 
      duration: 1, 
      ease: "power4.out" 
    }, "-=0.5");

  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
      
      {/* The Image Wrapper (Animated) */}
      <div className="hero-image-wrap absolute inset-0 z-0">
        <Image
          src="/assets/images/hero.png"
          alt="Architectural Vision"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 w-full h-full min-h-screen">
        {/* Subhead */}
        <h2 className="hero-subhead absolute right-[5%] md:right-[2%] top-[25%] max-w-70.5 text-white text-justify font-sans font-medium text-lg md:text-xl leading-tight">
          We design context‑driven architecture that transforms your vision into refined, built form.
        </h2>
        
        {/* Scattered Slogan */}
        <div className="absolute inset-0 pointer-events-none">
          <h1 className="slogan-word absolute text-white font-bold uppercase text-[clamp(48px,8vw,128px)] left-[10%] md:left-[22%] top-[15%]">Make</h1>
          <h1 className="slogan-word absolute text-white font-bold uppercase text-[clamp(48px,8vw,128px)] left-[15%] md:left-[33.1%] top-[35%]">your</h1>
          <h1 className="slogan-word absolute text-white font-bold uppercase text-[clamp(48px,8vw,128px)] left-[50%] md:left-[60.6%] top-[35%]">idea</h1>
          <h1 className="slogan-word absolute text-white font-bold uppercase text-[clamp(48px,8vw,128px)] left-[20%] md:left-[48.2%] top-[55%]">BECOME</h1>
          <h1 className="slogan-word absolute text-white font-bold uppercase text-[clamp(48px,8vw,128px)] left-[40%] md:left-[69.6%] top-[75%]">REALITY</h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
        

