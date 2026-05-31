"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { ProjectData } from "@/app/projects/[slug]/page";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectDetailView({ project }: { project: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const blindTop = useRef<HTMLDivElement>(null);
  const heroImageMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useGSAP(
    () => {
      const arrivalTl = gsap.timeline();

      gsap.set(".project-hero-title-line", { yPercent: 110 });
      gsap.set(".project-hero-copy", { opacity: 0, y: 20 });
      gsap.set(heroImageMaskRef.current, {
        clipPath: "inset(0% 100% 0% 0%)",
      });
      gsap.set(heroImageRef.current, {
        scale: 1.05,
      });

      arrivalTl
        .to(blindTop.current, {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut",
        })
        .to(
          heroImageMaskRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          heroImageRef.current,
          {
            scale: 1,
            duration: 1.4,
            ease: "power4.out",
          },
          "<"
        )
        .to(
          ".project-hero-title-line",
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.75"
        )
        .to(
          ".project-hero-copy",
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.55"
        );

      gsap.to(heroImageRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      const textElements = gsap.utils.toArray<HTMLElement>(".slide-text");
      const imgBlocks = gsap.utils.toArray<HTMLElement>(".v-img-block");

      const splitInstances = textElements.map((el) => {
        const split = new SplitType(el, {
          types: "lines",
          lineClass: "line-child",
        });

        split.lines?.forEach((line, i, arr) => {
          line.style.display = "block";
          line.style.width = "100%";
          line.style.textAlign = "justify";
          line.style.textAlignLast = i < arr.length - 1 ? "justify" : "left";

          const wrapper = document.createElement("div");
          wrapper.className = "overflow-hidden py-1 mb-[-4px]";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        return split;
      });

      const sequenceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sequenceRef.current,
          start: "top top",
          end: "+=700%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      textElements.forEach((el, i) => {
        const lines = el.querySelectorAll(".line-child");
        const img = imgBlocks[i];

        gsap.set(lines, { yPercent: 115 });

        gsap.set(img, {
          clipPath: "inset(100% 0% 0% 0%)",
          yPercent: 18,
          scale: 1.08,
          transformOrigin: "center bottom",
        });

        sequenceTl
          .to(lines, {
            yPercent: 0,
            stagger: 0.08,
            duration: 2,
            ease: "power3.out",
          })
          .to(
            img,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              yPercent: 0,
              scale: 1,
              duration: 5,
              ease: "power4.out",
            },
            "<"
          )
          .to({}, { duration: 3 });

        if (i < textElements.length - 1) {
          sequenceTl
            .to(lines, {
              yPercent: -115,
              stagger: 0.05,
              duration: 1.4,
              ease: "power3.inOut",
            })
            .to(
              img,
              {
                clipPath: "inset(0% 0% 100% 0%)",
                yPercent: -22,
                scale: 1.03,
                duration: 5,
                ease: "power3.inOut",
              },
              "<"
            );
        }
      });

      if (horizontalRef.current && horizontalTrackRef.current) {
        const track = horizontalTrackRef.current;
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            start: "top top",
            end: () => `+=${track.scrollWidth + window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      ScrollTrigger.refresh();

      return () => {
        splitInstances.forEach((split) => split.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="bg-white min-h-screen w-full overflow-x-hidden selection:bg-white selection:text-white no-scrollbar [&_.pin-spacer]:!bg-white"
    >
      <div
        ref={blindTop}
        className="fixed top-0 left-0 w-full h-full bg-white/10 backdrop-blur-xl z-10000 pointer-events-none border-b border-white/10"
      />

      {/* SECTION 1: HERO */}
      <section className="relative h-screen w-full bg-white overflow-hidden text-black">
        <div
          ref={heroImageMaskRef}
          className="absolute left-5 top-5 right-5 h-[62.5vh] overflow-hidden bg-zinc-400"
        >
          <img
            ref={heroImageRef}
            src={project.heroImg}
            className="h-full w-full object-cover will-change-transform"
            alt={project.title}
          />
        </div>

        <div className="project-hero-copy absolute left-5 top-[67.5vh] w-72 text-justify text-sm font-medium uppercase leading-none text-zinc-950">
          {project.credits}
        </div>

        <div className="absolute left-5 bottom-8 flex items-end gap-1">
          <div className="overflow-hidden">
            <h1 className="project-hero-title-line text-[clamp(3rem,4.1vw,64px)] font-bold uppercase leading-none tracking-[-0.03em]">
              {project.title}
            </h1>
          </div>

          <span className="project-hero-copy pb-1 text-base font-normal leading-none">
            2025
          </span>
        </div>

        <div className="project-hero-copy absolute left-[70.4vw] top-[67.5vh] w-[28vw] max-w-[430px] text-sm uppercase leading-5">
          {project.consultants.map((item) => (
            <div key={item.label}>
              <span className="font-semibold">{item.label}</span>
              <span className="font-normal"> - </span>
              <span className="font-bold">{item.val}</span>
            </div>
          ))}
        </div>

        <div className="project-hero-copy absolute left-[70.4vw] top-[83.7vh] w-[28vw] max-w-[430px] text-sm uppercase leading-5">
          {project.team.map((item) => (
            <div key={item.label}>
              <span className="font-bold">{item.label}</span>
              <span className="font-semibold"> - {item.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 */}
      <section
        ref={sequenceRef}
        className="relative w-full h-screen bg-white overflow-hidden"
      >
        <div className="relative w-full h-full max-w-382 mx-auto">
          <div className="absolute left-155.75 top-37.25 w-110 z-20 pointer-events-none">
            {project.slides.map((text, index) => (
              <p
                key={index}
                className="slide-text absolute w-full text-justify [text-justify:inter-word] hyphens-auto text-black text-2xl font-semibold leading-tight uppercase tracking-normal"
              >
                {text}
              </p>
            ))}
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            {project.verticalImages.map((img, i) => (
              <div
                key={i}
                className={`v-img-block absolute bg-zinc-400 overflow-hidden shadow-none ${
                  i === 2
                    ? "left-2.5 top-37.25 w-145.75 h-96"
                    : "right-2.5 top-5 w-105 h-188.5"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="work" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section
        ref={horizontalRef}
        className="relative h-screen w-full flex items-end bg-white overflow-hidden no-scrollbar pb-10 md:pb-16"
      >
        <div
          ref={horizontalTrackRef}
          className="flex flex-nowrap items-end px-[10vw] gap-2 md:gap-2"
        >
          {project.horizontalGallery.map((img, i) => {
            const heights = [
              "h-[45vh]",
              "h-[65vh]",
              "h-[45vh]",
              "h-[45vh]",
              "h-[65vh]",
            ];

            return (
              <div
                key={i}
                onClick={() => setSelectedImg(img)}
                className={`shrink-0 w-auto cursor-pointer group ${
                  heights[i % heights.length]
                }`}
              >
                <img
                  src={img}
                  alt="gallery"
                  className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
                />
              </div>
            );
          })}
        </div>
      </section>

      {selectedImg && (
        <InteractiveLightbox
          img={selectedImg}
          onClose={() => setSelectedImg(null)}
        />
      )}
    </main>
  );
}

function InteractiveLightbox({
  img,
  onClose,
}: {
  img: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(1, scale + delta), 6);
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || scale <= 1) return;

      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scale]);

  return (
    <div
      className="fixed inset-0 z-30000 bg-white flex items-center justify-center overflow-hidden touch-none select-none"
      onWheel={handleWheel}
    >
      <div
        ref={imageRef}
        onMouseDown={handleMouseDown}
        className={`relative flex items-center justify-center will-change-transform ${
          scale > 1 ? "cursor-grab" : "cursor-zoom-in"
        } ${
          isDragging ? "cursor-grabbing transition-none" : "transition-transform duration-200"
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <img
          src={img}
          alt="Viewpart"
          className="max-h-[90vh] max-w-[90vw] object-contain pointer-events-none"
        />
      </div>

      <div className="absolute top-10 left-10 text-black/30 text-[10px] uppercase tracking-[0.3em] pointer-events-none">
        {scale > 1 ? "Drag to Pan - Scroll to Zoom" : "Scroll to Zoom"}
      </div>

      <button
        onClick={onClose}
        className="absolute right-10 bottom-10 text-black font-bold tracking-[0.4em] text-xs uppercase hover:opacity-50 transition-opacity p-4 z-30001"
      >
        [CLOSE]
      </button>
    </div>
  );
}
