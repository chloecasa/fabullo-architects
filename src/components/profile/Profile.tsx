"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { RevealWrapper } from "@/components/ui/RevealWrapper";

const bodyText =
  "text-left md:text-justify text-black font-semibold font-['LT_Superior'] text-base leading-relaxed md:text-sm md:leading-[1.4] lg:text-sm xl:text-xl xl:leading-tight";

const ethosText =
  "text-left md:text-justify text-black font-semibold font-['LT_Superior'] text-base leading-relaxed md:text-sm lg:text-base xl:text-xl";

const sections = [
  {
    id: "who",
    title: "who we are",
    btnY: "16.66%",
    panelClass: "md:top-0 md:h-[18rem]",
    widthClass: "md:w-[728px]",
    content: (
      <>
        MCK is a multi-award winning Architecture Practice based in Sydney, Australia.
        <br />
        <br />
        We specialise in bespoke design of high quality finish and detail that is responsive to context and client brief.
      </>
    ),
  },
  {
    id: "story",
    title: "Our story",
    btnY: "50%",
    panelClass: "md:top-[33.33%] md:h-[18rem]",
    widthClass: "md:w-[876px]",
    content: (
      <>
        MCK has developed over the past two decades a knowledge and expertise in designing prestige buildings that has been awarded and acclaimed by the Australian Institute of Architects, the Institute of Interior Designers, and the Australian Design Council.
        <br />
        <br />
        MCK has a portfolio of commercial and residential projects with a specialisation in one-off detached houses and adaptive reuse.
      </>
    ),
  },
  {
    id: "ethos",
    title: "ethos",
    btnY: "83.33%",
    panelClass: "md:top-[33.33%] md:h-[66.67%]",
    widthClass: "",
    content: (
      <>
        {/* Column 1 of Ethos manifesto */}
        <div className={`${ethosText} w-full md:flex-1 min-w-0 xl:flex-none xl:w-[578px]`}>
          Architectural experience can be life changing. Phenomena in space and light. Volume and form delivering emotion and thought. Architecture is the embodiment of imagination. Engagement with it should be sublime.
          It should bring happiness and delight. It should represent what we strive for and our common goal. It should be noble, awe-inspiring and magnificent.
          <br />
          <br />
          Responsive to site, context and end user needs. Environmentally sensitive and sustainable. Quality in finish and detail. Pleasure and benefit in function. Excitement in innovation.
        </div>

        {/* Column 2 of Ethos manifesto */}
        <div className={`${ethosText} w-full md:flex-1 min-w-0 xl:flex-none xl:w-96`}>
          All this is enveloped in building. The fabric and material that delivers the built form. This is achieved through collaboration. Of like minded people that dream, create, construct and finance. Teamwork, knowledge experience and pragmatism. To guide and see ideas come to fruition.
          <br />
          <br />
          Nurtured, with expertise, from conception to completion. Our service as Architects is to aim to deliver this manifesto. To assist in the journey to make idea become reality. Let’s make Architecture.
        </div>
      </>
    ),
  },
];

const Profile = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // Keeps the last opened section so content doesn't vanish while the panel slides out
  const [lastActiveId, setLastActiveId] = useState<string>("who");

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const readyRef = useRef(false);

  const displayedData =
    sections.find((s) => s.id === (activeSection || lastActiveId)) || sections[0];
  const isEthos = displayedData.id === "ethos";

  const handleOpenSection = (id: string) => {
    setActiveSection(id);
    setLastActiveId(id);
  };

  // Animate the panel with one timeline at a time, so fast taps don't fight each other
  useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (seconds: number) => (reduce ? 0 : seconds);

    // First run: park the panel off-screen and hide the content
    if (!readyRef.current) {
      readyRef.current = true;
      gsap.set(panel, { xPercent: 100 });
      gsap.set(content, { autoAlpha: 0, y: 12 });
      return;
    }

    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    if (activeSection) {
      tl.to(panel, { xPercent: 0, duration: t(0.8), ease: "power4.inOut" }).to(
        content,
        { autoAlpha: 1, y: 0, duration: t(0.5), ease: "power2.out" },
        t(0.4)
      );
    } else {
      tl.to(content, { autoAlpha: 0, y: 12, duration: t(0.25), ease: "power2.in" }).to(
        panel,
        { xPercent: 100, duration: t(0.8), ease: "power4.inOut" },
        0
      );
    }
  }, [activeSection]);

  // Stop any running animation when the component unmounts
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  return (
    <main className="w-full bg-white rounded-none">
      <RevealWrapper>
        {/* Component 1: Intro Header Section */}
        <section
          className={[
            "w-full bg-white relative overflow-hidden flex items-end rounded-none",
            "h-[140px] px-[12px] pb-[16px]",
            "min-[375px]:h-[160px] min-[375px]:px-[12px] min-[375px]:pb-[20px]",
            "md:h-[220px] md:px-[20px] md:pb-[24px]",
            "lg:h-[220px] lg:px-[20px] lg:pb-[24px]",
            "xl:h-[280px] xl:px-[20px] xl:pb-[32px]",
            "min-[1440px]:h-[280px] min-[1440px]:px-[20px] min-[1440px]:pb-[32px]",
          ].join(" ")}
        >
          <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 rounded-none">
            <h1
              className={[
                "font-bold uppercase leading-[0.75] tracking-tighter text-black rounded-none",
                "text-[44px] min-[375px]:text-[56px] md:text-[110px] lg:text-[130px] xl:text-[180px] min-[1440px]:text-[200px]",
              ].join(" ")}
            >
              Profile
            </h1>

            <span
              className={[
                "font-normal lowercase text-black opacity-80 rounded-none",
                "text-xs min-[375px]:text-sm md:text-[16px] lg:text-[18px] xl:text-[22px] min-[1440px]:text-[24px]",
              ].join(" ")}
            >
              know who we are
            </span>
          </div>
        </section>
      </RevealWrapper>

      {/* Component 2: Image & Section */}
      <section className="relative w-full h-[80svh] min-h-[420px] bg-zinc-400 overflow-hidden rounded-none md:h-[580px] xl:h-[750px] min-[1440px]:h-[800px]">
        <Image
          src="/assets/images/Profile.webp"
          alt="Profile Background"
          fill
          className="object-cover grayscale rounded-none"
          priority
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/50 z-[1] rounded-none" />

        {/* Section buttons (hover lift only applies on devices that hover, Tailwind v4 default) */}
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-500 rounded-none ${
            activeSection ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpenSection(item.id)}
              style={{ top: item.btnY }}
              className="absolute right-3 -translate-y-1/2 group flex items-baseline gap-3 px-2 py-3 text-white border-none bg-transparent m-0 cursor-pointer hover:-translate-x-2.5 transition-transform duration-500 rounded-none"
            >
              <h2 className="font-semibold uppercase tracking-tight text-base md:text-lg lg:text-xl xl:text-2xl rounded-none">
                {item.title}
              </h2>

              <span className="text-xs font-normal uppercase opacity-60 group-hover:opacity-100 tracking-widest transition-opacity rounded-none">
                click to know
              </span>
            </button>
          ))}
        </div>

        {/* Sliding Panel: full image height on phones, fixed placement from md up */}
        <div
          ref={panelRef}
          className={`absolute left-0 top-0 h-full w-full bg-white z-20 overflow-hidden rounded-none ${displayedData.panelClass}`}
        >
          <div ref={contentRef} className="relative w-full h-full rounded-none">
            {isEthos ? (
              <div
                data-lenis-prevent
                className="absolute left-5 right-5 top-5 bottom-20 flex flex-col gap-4 overflow-y-auto overscroll-contain md:flex-row md:gap-5 md:bottom-auto md:h-[calc(100%-56px)] md:overflow-visible"
              >
                {displayedData.content}
              </div>
            ) : (
              <div
                data-lenis-prevent
                className={`absolute left-5 right-5 top-5 bottom-20 max-w-[calc(100%-40px)] overflow-y-auto overscroll-contain md:bottom-auto md:h-[calc(100%-56px)] md:overflow-visible ${bodyText} ${displayedData.widthClass}`}
              >
                {displayedData.content}
              </div>
            )}

            {/* Panel Close Button (bigger tap area, visual position unchanged) */}
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="absolute right-2 bottom-2 flex items-baseline gap-1 p-3 border-none bg-transparent cursor-pointer m-0 transition-opacity hover:opacity-40 rounded-none"
            >
              <span className="text-black text-lg md:text-xl font-semibold font-['LT_Superior'] uppercase rounded-none">
                {displayedData.title}
              </span>
              <span className="text-black text-xs font-normal font-['LT_Superior'] uppercase rounded-none">
                close
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
