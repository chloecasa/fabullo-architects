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
  subtitle?: string; // Optional subtitle field
  description: string;
  descriptionTwo?: string; // Optional second description field
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
  "/assets/foreverhouse/1.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/2.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/3.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/4.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/5.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/6.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/7.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/8.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/9.jpeg", // Image 1 (Current)
  "/assets/foreverhouse/10.jpeg", // Image 1 (Current)
];

const slides: BlogSlide[] = [
  {
    id: "four",
    title: "ABOUT US",
    description: "At MCK, we believe architectural experience can be life-changing. We approach design as a sensitive exploration of phenomena, space, and light, crafting volumes and geometric forms that evoke distinct emotions. Across over two decades, our multi-award-winning team has dedicated itself to bespoke, one-off residential masterpieces and ambitious adaptive reuse projects that balance rigorous pragmatism with uninhibited creative vision.",
    descriptionTwo: "Our architecture is built on seamless collaboration between like-minded clients, creators, and builders. We guide ideas from conception to completion with meticulous expertise, ensuring every detail and material palette is sensitive to its environment and context. Ultimately, we strive to build something sublime—structures that stand as noble, magnificent testaments to what collective imagination can achieve.",
    image: "/assets/images/Tareola Image.png", // Update this image path if needed
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
            <div
              className={`
                section-container absolute inset-0 flex origin-bottom-left will-change-transform rotate-30
                ${slide.bgColor} ${slide.textColor}
                ${slide.layout === "centered" ? "flex-col items-center justify-center text-center gap-8" : ""}
              `}
            >
              {slide.layout === "about-us" && (
              <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between w-full">
                  {/* Left Side: Image */}
                  <div className="relative w-full lg:w-[58%] aspect-[16/9] md:aspect-[2.2/1] overflow-hidden">
                    <Image
                      src={slide.image || "/assets/images/Tareola Image.png"}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Right Side: Two text columns */}
                  <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 w-full lg:w-[38%]">
                    <p className="flex-1 font-sans font-bold text-m leading-relaxed text-black text-justify">
                      {slide.description}
                    </p>
                    <p className="flex-1 font-sans font-bold text-m leading-relaxed text-black text-justify">
                      {slide.descriptionTwo || slide.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mt-auto w-full">
                  <h1 className="font-sans text-bold-xl text-[clamp(3rem,10vw,15rem)] leading-none uppercase">
                    {slide.title}
                  </h1>
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="font-sans text-xl md:text-3xl lg:text-4xl tracking-tight uppercase transition-opacity hover:opacity-40 whitespace-nowrap"
                  >
                    [GET TO KNOW MORE]
                  </button>
                </div>
              </div>
            )}

            {slide.layout === "testimonials" && (
              <div className="relative w-full h-full flex flex-col md:flex-row bg-white">
                {/* Left Side: Full Height Image */}
                <div className="relative w-full md:w-[49%] h-1/2 md:h-full">
                  <Image
                    src={slide.image!}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Right Side: Content Area */}
                <div className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16">
                  {/* Header */}
                  <div className="w-full">
                    <h1 className="font-serif text-[clamp(2.5rem,6vw,8rem)] leading-none uppercase font-bold tracking-tight">
                      {slide.title}
                    </h1>
                  </div>

                  {/* Testimonial Text Quote */}
                  <div className="my-auto max-w-xl">
                    <p className="font-sans text-xl md:text-2xl lg:text-3xl leading-relaxed text-black/70">
                      {testimonials[testimonialIndex]}
                    </p>
                  </div>

                 {/* Navigation Buttons */}
                  <div className="flex gap-6 items-center justify-end mt-auto self-end">
                    <button
                      type="button"
                      onClick={() => setTestimonialIndex((prev) => prev - 1)}
                      className={`font-sans text-lg md:text-xl font-bold uppercase transition-opacity hover:opacity-50 ${
                        testimonialIndex > 0 ? "visible" : "invisible pointer-events-none"
                      }`}
                    >
                      [prev]
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestimonialIndex((prev) => prev + 1)}
                      className={`font-sans text-lg md:text-xl font-bold uppercase transition-opacity hover:opacity-50 ${
                        testimonialIndex < 2 ? "visible" : "invisible pointer-events-none"
                      }`}
                    >
                      [next]
                    </button>
                  </div>
                </div>
              </div>
            )}

         {slide.layout === "featured" && (
            <div className="relative w-full h-full flex flex-col md:flex-row bg-white">
             {/* Left Side: Text Content (Clickable to open the video, custom cursor enabled) */}
              <button
                type="button"
                data-cursor="[VIEW LOCAL PROJECT]"
                data-cursor-color="black" // Turn cursor text black over the white space
                onClick={() => setIsVideoOpen(true)}
                className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16 text-left cursor-none focus:outline-none"
              >
                {/* Header (Title & Subtitle) */}
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="font-serif text-[clamp(3rem,10vw,15rem)] leading-none uppercase font-bold text-black">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="font-sans text-xl md:text-3xl tracking-tight uppercase font-bold text-black/70">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                {/* Description text aligned to the middle-right */}
                <div className="my-auto self-center md:self-end md:mr-16 max-w-sm w-full">
                  <p className="font-sans text-lg md:text-xl font-bold uppercase text-black/70 leading-relaxed text-justify">
                    {slide.description}
                  </p>
                </div>

                {/* Spacer to align spacing */}
                <div className="h-0 md:h-12" />
              </button>

             {/* Right Side: Automatic cross-fade image slideshow */}
              <button
                type="button"
                data-cursor="[VIEW LOCAL PROJECT]"
                data-cursor-color="white" // Keep cursor text white over the image
                onClick={() => setIsVideoOpen(true)}
                className="relative w-full md:w-[49%] h-1/2 md:h-full cursor-none overflow-hidden group"
              >
                {featuredImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === featuredImageIndex ? "opacity-100" : "opacity-0"
                    }`}
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
      src="https://www.youtube-nocookie.com/embed/shT8Ccb1YHI?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1"
      title="Local Project Video"
      className="h-full w-full"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      onClick={(e) => e.stopPropagation()}
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
