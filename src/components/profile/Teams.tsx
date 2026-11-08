"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface TeamMember {
  id: number;
  name: string;
  img: string;
  desc: string;
}

interface TeamsProps {
  initialMembers: TeamMember[];
}

const Teams = ({ initialMembers }: TeamsProps) => {
  const spotlightRef = useRef<HTMLElement>(null);

  // Three tracks, one per column. Each track lives inside its own clipped frame,
  // so text can never sit on top of a photo or another text block.
  const imgTrackRef = useRef<HTMLDivElement>(null);
  const nameTrackRef = useRef<HTMLDivElement>(null);
  const descTrackRef = useRef<HTMLDivElement>(null);

  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);

  const members = initialMembers || [];

  // Scroll to a member. Uses the same mapping as the scroll render, so the
  // destination always matches the portrait, name and description.
  const scrollToMember = (index: number) => {
    if (members.length <= 1) return;

    const st = ScrollTrigger.getById("teamTrigger");
    if (!st) return;

    const totalScroll = st.end - st.start;
    const targetScroll = st.start + (index / (members.length - 1)) * totalScroll;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: reduce ? 0 : 1.2,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  useEffect(() => {
    if (members.length === 0) return;

    // If the user touches or wheels while a programmatic scroll runs, stop it
    // so their gesture wins immediately.
    const stopAutoScroll = () => gsap.killTweensOf(window);
    window.addEventListener("touchstart", stopAutoScroll, { passive: true });
    window.addEventListener("wheel", stopAutoScroll, { passive: true });

    const ctx = gsap.context(() => {
      // REPEATABLE INTRO ANIMATION
      gsap.set(".team-intro-reveal", { y: "115%" });

      gsap.to(".team-intro-reveal", {
        y: "0%",
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".team-header-section",
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "restart reverse restart reverse",
        },
      });

      const spotlight = spotlightRef.current;
      const imgTrack = imgTrackRef.current;
      const nameTrack = nameTrackRef.current;
      const descTrack = descTrackRef.current;
      if (!spotlight || !imgTrack || !nameTrack || !descTrack) return;

      const total = members.length;

      if (total === 1) {
        gsap.set(imgRefs.current[0], { scale: 1 });
        gsap.set(nameRefs.current[0], { opacity: 1 });
        gsap.set(descRefs.current[0], { opacity: 0.7 });
        return;
      }

      // Measured sizes. Each row is exactly one frame tall, so moving a track by
      // (index × rowHeight) puts that row exactly in its frame.
      const sizes = { slot: 0, nameRow: 0, descRow: 0 };

      const measure = () => {
        sizes.slot = imgRefs.current[0]?.offsetHeight ?? 0;
        sizes.nameRow = nameRefs.current[0]?.offsetHeight ?? 0;
        sizes.descRow = descRefs.current[0]?.offsetHeight ?? 0;
      };

      // One function drives all three columns from the same value.
      // `f` is a fractional index: 2.5 means halfway between member 2 and 3.
      const render = (progress: number) => {
        const f = progress * (total - 1);

        gsap.set(imgTrack, { y: -f * sizes.slot });
        gsap.set(nameTrack, { y: -f * sizes.nameRow });
        gsap.set(descTrack, { y: -f * sizes.descRow });

        for (let i = 0; i < total; i++) {
          // near = 1 when this member is centred, 0 when one full step away
          const near = 1 - Math.min(1, Math.abs(f - i));

          const img = imgRefs.current[i];
          const name = nameRefs.current[i];
          const desc = descRefs.current[i];

          if (img) gsap.set(img, { scale: 0.94 + 0.06 * near });
          if (name) gsap.set(name, { opacity: 0.12 + 0.88 * near });
          if (desc) gsap.set(desc, { opacity: 0.7 * near });
        }
      };

      ScrollTrigger.create({
        id: "teamTrigger",
        trigger: spotlight,
        start: "top top",
        end: () => `+=${window.innerHeight * Math.max(total - 1, 1)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6, // small lag smooths out touch input
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          render(self.progress);
        },
        onUpdate: (self) => render(self.progress),
      });
    });

    return () => {
      window.removeEventListener("touchstart", stopAutoScroll);
      window.removeEventListener("wheel", stopAutoScroll);
      ctx.revert();
    };
  }, [members]);

  return (
    <div className="bg-white text-black font-sans pb-32">
      {/* Component 1: Intro Header Section */}
      <section
        className={[
          "team-header-section rounded-none",
          "px-[12px] pt-[73px] pb-6",
          "min-[375px]:px-[12px] min-[375px]:pt-[80px] min-[375px]:pb-8",
          "md:px-[20px] md:pt-[110px] md:pb-12",
          "lg:px-[20px] lg:pt-[110px] lg:pb-12",
          "xl:px-[20px] xl:pt-[110px] xl:pb-16",
          "min-[1440px]:px-[20px] min-[1440px]:pt-[110px] min-[1440px]:pb-16",
        ].join(" ")}
      >
        <div className="flex items-baseline gap-1.5 md:gap-2 xl:gap-3 mb-2 overflow-hidden">
          <h1
            className={[
              "team-intro-reveal font-bold uppercase leading-[0.8] tracking-tighter rounded-none",
              "text-[40px] min-[375px]:text-[52px] md:text-[96px] lg:text-[110px] xl:text-[120px] min-[1440px]:text-[130px]",
            ].join(" ")}
          >
            Our Team
          </h1>

          <span
            className={[
              "team-intro-reveal font-light lowercase whitespace-nowrap opacity-60 rounded-none",
              "text-[10px] min-[375px]:text-[11px] md:text-[16px] lg:text-[18px] xl:text-[20px] min-[1440px]:text-[22px]",
            ].join(" ")}
          >
            the collective mind
          </span>
        </div>

        <div className="overflow-hidden rounded-none">
          <p
            className={[
              "team-intro-reveal font-medium opacity-50 text-justify rounded-none leading-normal",
              "text-xs mt-3 max-w-[280px]",
              "min-[375px]:text-xs min-[375px]:mt-3 min-[375px]:max-w-[340px]",
              "md:text-sm md:mt-4 md:max-w-md",
              "lg:text-sm lg:mt-4 lg:max-w-md",
              "xl:text-base xl:mt-5 xl:max-w-xl",
              "min-[1440px]:text-base min-[1440px]:mt-5 min-[1440px]:max-w-xl",
            ].join(" ")}
          >
            A collective of designers, thinkers, and makers dedicated to the craft of the built environment.
          </p>
        </div>
      </section>

      {/* Spotlight: pinned on all screens. Uses svh so mobile browser bars don't shift it. */}
      {members.length > 0 && (
        <section
          ref={spotlightRef}
          className="relative w-full h-svh overflow-hidden touch-pan-y"
        >
          {/*
            Layout container.
            Phones (portrait): stacked, image on top, name, then description.
            Phones (landscape): row. Tablet and up: image left, name centre, description right.
          */}
          <div
            className={[
              "absolute inset-0 flex flex-col justify-center gap-4 px-3",
              "md:flex-row md:items-center md:justify-between md:gap-10 md:px-5",
              "max-md:landscape:flex-row max-md:landscape:gap-5 max-md:landscape:px-5",
            ].join(" ")}
          >
            {/* IMAGE FRAME: shows one portrait at a time */}
            <div
              className={[
                "relative shrink-0 aspect-[3/4] overflow-hidden bg-transparent rounded-none",
                "mx-auto w-[min(62vw,260px)]",
                "md:mx-0 md:w-80",
                "max-md:landscape:w-[min(45vw,calc((100svh-40px)*0.75))]",
              ].join(" ")}
            >
              <div ref={imgTrackRef} className="absolute inset-x-0 top-0 flex flex-col will-change-transform">
                {members.map((member, i) => (
                  <div
                    key={member.id}
                    ref={(el) => {
                      imgRefs.current[i] = el;
                    }}
                    onClick={() => scrollToMember(i)}
                    className="relative w-full aspect-[3/4] shrink-0 cursor-pointer overflow-hidden"
                  >
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 62vw, 320px"
                      className="object-cover rounded-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* NAME FRAME: one name at a time, same index as the portrait */}
            <div
              className={[
                "relative w-full h-20 overflow-hidden pointer-events-none rounded-none",
                "md:h-25 md:flex-1 md:min-w-0",
                "max-md:landscape:flex-1 max-md:landscape:h-20",
              ].join(" ")}
            >
              <div ref={nameTrackRef} className="absolute inset-x-0 top-0 flex flex-col will-change-transform">
                {members.map((member, i) => (
                  <p
                    key={member.id}
                    ref={(el) => {
                      nameRefs.current[i] = el;
                    }}
                    className={[
                      "flex items-center justify-center md:justify-start shrink-0 h-20 md:h-25 px-2 rounded-none",
                      "text-center md:text-left font-bold uppercase tracking-tighter leading-[0.95]",
                      "text-[clamp(1.25rem,6.5vw,2.25rem)] md:text-5xl xl:text-6xl min-[1440px]:text-6xl",
                    ].join(" ")}
                  >
                    {member.name}
                  </p>
                ))}
              </div>
            </div>

            {/* DESCRIPTION FRAME: same index as the portrait and name */}
            <div
              className={[
                "relative w-full h-28 overflow-hidden pointer-events-none rounded-none",
                "md:h-30 md:w-80 md:shrink-0",
                "max-md:landscape:w-[38vw] max-md:landscape:h-28",
              ].join(" ")}
            >
              <div ref={descTrackRef} className="absolute inset-x-0 top-0 flex flex-col will-change-transform">
                {members.map((member, i) => (
                  <div
                    key={member.id}
                    ref={(el) => {
                      descRefs.current[i] = el;
                    }}
                    className="flex items-center justify-center md:justify-end shrink-0 h-28 md:h-30 px-1"
                  >
                    <p className="text-xs leading-relaxed font-bold uppercase tracking-widest text-center md:text-right text-black/70 rounded-none">
                      {member.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Teams;
