// src/components/homepage/HorizontalBlog.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogSlide {
  id: string;
  title: string;
  subtitle?: string; 
  description: string;
  descriptionTwo?: string; 
  image?: string;
  videoClip?: string;
  bgColor: string;
  textColor: string;
  layout: "text-only" | "image-left" | "image-right" | "centered" | "about-us" | "testimonials" | "featured";
}

const testimonials = [
  "“Bespoke design of high quality finish and detail that is responsive to context and client brief”",
  "“An exceptional attention to detail that transformed our vision into an incredible, lived-in reality.”",
  "“Highly professional execution from start to finish, delivering beyond our expectations.”"
];

const featuredImages = [
  "/assets/foreverhouse/1.jpeg", 
  "/assets/foreverhouse/2.jpeg", 
  "/assets/foreverhouse/3.jpeg", 
  "/assets/foreverhouse/4.jpeg", 
  "/assets/foreverhouse/5.jpeg", 
  "/assets/foreverhouse/6.jpeg", 
  "/assets/foreverhouse/7.jpeg", 
  "/assets/foreverhouse/8.jpeg", 
  "/assets/foreverhouse/9.jpeg", 
  "/assets/foreverhouse/10.jpeg", 
];

const slides: BlogSlide[] = [
  {
    id: "four",
    title: "ABOUT US",
    description: "At MCK, we believe architectural experience can be life-changing. We approach design as a sensitive exploration of phenomena, space, and light, crafting volumes and geometric forms that evoke distinct emotions.",
    descriptionTwo: "Across over two decades, our multi-award-winning team has dedicated itself to bespoke, one-off residential masterpieces and ambitious adaptive reuse projects that balance rigorous pragmatism with uninhibited creative vision.",
    image: "/assets/images/Tareola Image.png", 
    bgColor: "bg-[#ffffff]",
    textColor: "text-black",
    layout: "about-us",
  },
  {
    id: "three",
    title: "FEATURED",
    subtitle: "ON THE LOCAL PROJECT",
    description: "Striking a balance between modesty and tenacity, the design uses a careful play of voids to draw natural light deep into a reassuringly calm sanctuary",
    image: "/assets/images/Tareola Image.png",
    videoClip: "/assets/videos/local-project1.mp4",
    bgColor: "bg-[#ffffff]",
    textColor: "text-black",
    layout: "featured",
  },
  {
    id: "two",
    title: "TESTIMONIALS",
    description: "",
    image: "/assets/images/Tareola Image.png",
    bgColor: "bg-[#ffffff]",
    textColor: "text-black",
    layout: "testimonials",
  },
];

export default function HorizontalBlog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const lenis = useLenis();
  const [isReady, setIsReady] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);

  // Automatically cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedImageIndex((prev) => (prev + 1) % featuredImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;

    if (header) {
      header.style.display = isVideoOpen ? "none" : "";
    }

    return () => {
      if (header) header.style.display = "";
    };
  }, [isVideoOpen]);

  useGSAP(
    () => {
      if (!isReady) return;

      const sections = gsap.utils.toArray<HTMLElement>(".blog-section");

      sections.forEach((section, index) => {
        const innerContainer = section.querySelector(".section-container");

        gsap.to(innerContainer, {
          rotation: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

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

      const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
      return () => clearTimeout(timer);
    },
    { scope: containerRef, dependencies: [isReady] }
  );

  const goToProfile = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    router.push("/profile");

    setTimeout(() => {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
    }, 100);
  };

  return (
    <>
      <main ref={containerRef} className="relative bg-white overflow-hidden">
        {slides.map((slide) => (
          <section
            key={slide.id}
            className="blog-section relative w-full h-svh overflow-hidden bg-white"
          >
            {/* Added p-[10px] to establish the unified 10px frame boundary on all sides [1.1.7] */}
            <div
              className={`
                section-container absolute inset-0 flex origin-bottom-left will-change-transform rotate-30 p-[10px]
                ${slide.bgColor} ${slide.textColor}
                ${slide.layout === "centered" ? "flex-col items-center justify-center text-center gap-8" : ""}
              `}
            >
              {slide.layout === "about-us" && (
              // Bounded directly to your 10px section frame [1.1.7]
              <div className="relative w-full h-full p-0">
                {/* 1. Portfolio Image: Aligned to 10px top and left [1.1.7] */}
                <div className="relative w-full lg:absolute lg:left-[10px] lg:top-[10px] lg:w-[57.7%] lg:h-[48.3%] aspect-[16/9] lg:aspect-auto overflow-hidden bg-zinc-400">
                  <Image
                    src={slide.image || "/assets/images/Tareola Image.png"}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 2. Text Column Wrapper: Strips itself on desktop [1.1.7] */}
                <div className="flex flex-col sm:flex-row gap-6 mt-6 lg:mt-0 lg:contents">
                  {/* Column 1: Aligned relative to the 10px grid top [1.1.7] */}
                  <p className="w-full sm:flex-1 lg:w-[17.7%] lg:min-w-[220px] lg:max-w-[280px] lg:absolute lg:left-[60.5%] lg:top-[27%] text-justify text-black text-sm lg:text-base font-bold font-sans leading-relaxed">
                    {slide.description}
                  </p>
                  
                  {/* Column 2: Aligned relative to the 10px grid top [1.1.7] */}
                  <p className="w-full sm:flex-1 lg:w-[17.7%] lg:min-w-[220px] lg:max-w-[280px] lg:absolute lg:left-[80.2%] lg:top-[27%] text-justify text-black text-sm lg:text-base font-bold font-sans leading-relaxed">
                    {slide.descriptionTwo || slide.description}
                  </p>
                </div>

               {/* 3. Main Header + CTA: 10px gap */}
<div className="mt-6 flex flex-col items-start gap-[10px] lg:mt-0 lg:absolute lg:left-[10px] lg:bottom-[10px] lg:flex-row lg:items-end">
  <h1 className="justify-start text-black text-9xl font-bold font-['LT_Superior'] leading-none uppercase">
    {slide.title}
  </h1>

  <button
    type="button"
    onClick={goToProfile}
    className="text-justify justify-start text-black text-4xl font-bold font-['LT_Superior'] uppercase transition-opacity hover:opacity-40 whitespace-nowrap text-left leading-none lg:translate-y-[-10px]"
  >
    [GET TO KNOW MORE]
  </button>
</div>
              </div>
            )}
            

            {slide.layout === "testimonials" && (
  <div className="relative w-full h-full bg-white overflow-hidden">
    {/* Left image */}
    <div className="relative w-full h-1/2 md:absolute md:left-0 md:top-[-4px] md:w-[49.3%] md:h-[calc(100%+4px)]">
      <Image
        src={slide.image!}
        alt={slide.title}
        fill
        className="object-cover"
      />
    </div>

    {/* Header */}
    <h1 className="mt-6 md:mt-0 md:absolute md:left-[50.7%] md:top-[20px] justify-start text-black text-7xl md:text-[102px] font-bold font-['LT_Superior'] leading-none uppercase">
      {slide.title}
    </h1>

    {/* Testimonial text */}
   <div className="mt-8 w-full max-w-[710px] md:mt-0 md:absolute md:left-[50.7%] md:top-[214px] text-justify justify-start text-black text-xl font-medium font-['LT_Superior']">
      {testimonials[testimonialIndex]}
    </div>

    {/* Navigation */}
    <div className="mt-8 flex gap-[20px] justify-end md:mt-0 md:absolute md:left-[78.3%] md:top-[407px]">
      <button
        type="button"
        onClick={() => setTestimonialIndex((prev) => prev - 1)}
        className={`text-justify justify-start text-black text-xl font-bold font-['LT_Superior'] uppercase transition-opacity hover:opacity-50 ${
          testimonialIndex > 0 ? "visible" : "invisible pointer-events-none"
        }`}
      >
        [prev]
      </button>

      <button
        type="button"
        onClick={() => setTestimonialIndex((prev) => prev + 1)}
        className={`text-justify justify-start text-black text-xl font-bold font-['LT_Superior'] uppercase transition-opacity hover:opacity-50 ${
          testimonialIndex < testimonials.length - 1 ? "visible" : "invisible pointer-events-none"
        }`}
      >
        [next]
      </button>
    </div>
  </div>
)}

         {slide.layout === "featured" && (
            // Bounded directly to your 10px section frame [1.1.7]
            <div className="relative w-full h-full p-0">
             {/* Left Side: Text Content (Clickable to open the video, custom cursor enabled) [1.1.7, 3] */}
              <button
                type="button"
                data-cursor="[VIEW LOCAL PROJECT]"
                data-cursor-color="black" 
                onClick={() => setIsVideoOpen(true)}
                className="relative w-full lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:w-[49.3%] lg:h-full flex flex-col justify-between p-0 text-left cursor-none focus:outline-none"
              >
                {/* Header Title: Figma top: 20px, left: 20px -> Aligned to 10px [1.1.7] */}
                <h1 className="font-sans text-bold-xl text-[clamp(7rem,11vw,148px)] leading-none uppercase font-bold text-black mt-6 lg:mt-0 lg:absolute lg:left-[10px] lg:top-[10px]">
                  {slide.title}
                </h1>
                
                {/* Subtitle: Figma top: 129px (16.2%), left: 20px -> Aligned to 10px [1.1.7] */}
                {slide.subtitle && (
                  <p className="font-sans text-xl lg:text-[clamp(1.2rem,1.8vw,30px)] tracking-tight font-bold text-black/80 mt-2 lg:mt-0 lg:absolute lg:left-4.5 lg:top-[16%] font-['LT_Superior'] 'uppercase'">
                    {slide.subtitle}
                  </p>
                )}

                {/* Description Text: Figma top: 407px (51.2%), left: 257px (35% relative to left panel) [1.1.7] */}
                <div className="my-auto self-center md:self-end md:mr-16 w-155 max-w-full lg:absolute lg:left-[15%] lg:top-[51.2%] lg:mr-0 lg:self-auto">
                  <p className="text-justify justify-start text-black text-xl font-bold font-['LT_Superior']">
                    {slide.description}
                  </p>
                </div>

                {/* Spacer to align spacing */}
                <div className="h-0 md:h-12" />
              </button>

             {/* Right Side: Automatic cross-fade image slideshow - Figma left: 743px, width: 710px [1.1.7, 3] */}
              <button
                type="button"
                data-cursor="[VIEW LOCAL PROJECT]"
                data-cursor-color="white" 
                onClick={() => setIsVideoOpen(true)}
                className="relative w-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[49.3%] lg:h-full h-1/2 cursor-none overflow-hidden group"
              >
                {featuredImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: idx === featuredImageIndex ? 1 : 0 }}
                  >
                    <Image
                      src={imgSrc}
                      alt={`${slide.title} frame ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </button>
            </div>
          )}
              

              {slide.layout === "centered" && (
                <>
                  <div className="relative w-[80%] md:w-[30%] aspect-square overflow-hidden group">
                    <Image
                      src={slide.image!}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h1 className="font-serif text-[clamp(3rem,8vw,12rem)] leading-none uppercase">
                    {slide.title}
                  </h1>
                  <p className="font-sans text-xl md:text-2xl tracking-tight max-w-2xl">
                    {slide.description}
                  </p>
                </>
              )}
            </div>
          </section>
        ))}
      </main>
     {isVideoOpen && (
    <div className="fixed inset-0 z-[5000] bg-black">
      <iframe
        data-cursor="[ CLOSE ]"
        src="https://www.youtube.com/embed/shT8Ccb1YHI?autoplay=1&mute=1&playsinline=1&rel=0"
        title="Local Project Video"
        className="h-full w-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      />
      <button
        type="button"
        data-cursor="[ CLOSE ]"
        onClick={() => setIsVideoOpen(false)}
        className="absolute left-0 top-0 z-10 h-[calc(100%-96px)] w-full cursor-none"
        aria-label="Close video"
      />
    </div>
      )}
    </>
  );
}
