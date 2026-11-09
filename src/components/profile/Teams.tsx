"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SplitType from "split-type";

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

// Same word animation as the project paragraphs
const WORD_HIDDEN_BELOW = { yPercent: 70, opacity: 0, filter: "blur(10px)" };
const WORD_SETTLED = { yPercent: 0, opacity: 1, filter: "blur(0px)" };
const WORD_LIFTED_OUT = { yPercent: -60, opacity: 0, filter: "blur(8px)" };

function splitWords(el: HTMLElement) {
  const split = new SplitType(el, { types: "words", wordClass: "wd" });
  split.words?.forEach((w) => {
    w.style.display = "inline-block";
  });
  return split;
}

const Teams = ({ initialMembers }: TeamsProps) => {
  const spotlightRef = useRef<HTMLElement>(null);
  const imgTrackRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const members = initialMembers || [];

  // Scroll to a member. Uses the same mapping as the scroll render.
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

    const stopAutoScroll = () => gsap.killTweensOf(window);
    window.addEventListener("touchstart", stopAutoScroll, { passive: true });
    window.addEventListener("wheel", stopAutoScroll, { passive: true });

    const splits: SplitType[] = [];

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
      if (!spotlight || !imgTrack) return;

      const total = members.length;

      // Split each name and description into words
      const nameSplits = nameRefs.current.slice(0, total).map((el) => (el ? splitWords(el) : null));
      const descSplits = descRefs.current.slice(0, total).map((el) => (el ? splitWords(el) : null));
      nameSplits.forEach((s) => s && splits.push(s));
      descSplits.forEach((s) => s && splits.push(s));

      // Only the first member's words are visible at the start
      const setInitial = (list: (SplitType | null)[]) =>
        list.forEach((s, i) => {
          if (s) gsap.set(s.words ?? [], i === 0 ? WORD_SETTLED : WORD_HIDDEN_BELOW);
        });
      setInitial(nameSplits);
      setInitial(descSplits);

      if (total === 1) {
        gsap.set(imgRefs.current[0], { scale: 1 });
        return;
      }

      let current = 0;
      let slotH = 0;

      // Lift the old member's words out and rise the new member's words in.
      // dir = 1 when moving forward through the list, -1 when moving back.
      const swap = (list: (SplitType | null)[], prev: number, next: number, dir: number) => {
        const outWords = list[prev]?.words ?? [];
        const inWords = list[next]?.words ?? [];
        gsap.killTweensOf([...outWords, ...inWords]);

        gsap.to(outWords, {
          yPercent: WORD_LIFTED_OUT.yPercent * dir,
          opacity: 0,
          filter: WORD_LIFTED_OUT.filter,
          duration: 0.7,
          stagger: 0.03,
          ease: "power2.in",
        });

        gsap.fromTo(
          inWords,
          {
            yPercent: WORD_HIDDEN_BELOW.yPercent * dir,
            opacity: 0,
            filter: WORD_HIDDEN_BELOW.filter,
          },
          {
            ...WORD_SETTLED,
            duration: 1.1,
            stagger: 0.045,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      };

      const showMember = (next: number) => {
        if (next === current) return;
        const prev = current;
        current = next;
        const dir = next > prev ? 1 : -1;
        swap(nameSplits, prev, next, dir);
        swap(descSplits, prev, next, dir);
      };

      // Portraits move with the scroll. f is a fractional index: 2.5 means halfway between members 2 and 3.
      const render = (progress: number) => {
        const f = progress * (total - 1);

        gsap.set(imgTrack, { y: -f * slotH });

        for (let i = 0; i < total; i++) {
          const near = 1 - Math.min(1, Math.abs(f - i));
          const img = imgRefs.current[i];
          if (img) gsap.set(img, { scale: 0.94 + 0.06 * near });
        }

        showMember(Math.round(f));
      };

      ScrollTrigger.create({
        id: "teamTrigger",
        trigger: spotlight,
        start: "top top",
        end: () => `+=${window.innerHeight * Math.max(total - 1, 1)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          slotH = imgRefs.current[0]?.offsetHeight ?? 0;
          render(self.progress);
        },
        onUpdate: (self) => render(self.progress),
      });
    });

    return () => {
      window.removeEventListener("touchstart", stopAutoScroll);
      window.removeEventListener("wheel", stopAutoScroll);
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [members]);

  return (
    <div className="bg-white text-black font-sans pb-32">
      {/* Intro header */}
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

      {/* Spotlight: pinned while the portraits scroll. Uses svh so mobile browser bars don't shift it. */}
      {members.length > 0 && (
        <section
          ref={spotlightRef}
          className="relative w-full h-svh overflow-hidden touch-pan-y"
        >
          <div
            className={[
              "absolute inset-0 flex flex-col justify-center gap-4 px-3",
              "md:flex-row md:items-center md:justify-between md:gap-10 md:px-5",
              "max-md:landscape:flex-row max-md:landscape:gap-5 max-md:landscape:px-5",
            ].join(" ")}
          >
            {/* IMAGE FRAME: scrolls one portrait at a time */}
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

                       {/* NAME FRAME: all names share one grid cell, so the frame grows to fit the longest one. Nothing is cut. */}
            <div
              className={[
                "relative grid w-full pointer-events-none",
                "md:flex-1 md:min-w-0",
                "max-md:landscape:flex-1",
              ].join(" ")}
            >
              {members.map((member, i) => (
                <div
                  key={member.id}
                  className="col-start-1 row-start-1 flex items-center justify-center md:justify-start min-h-20 md:min-h-25 py-2 px-2"
                >
                  <p
                    ref={(el) => {
                      nameRefs.current[i] = el;
                    }}
                    className="text-center md:text-left font-bold uppercase tracking-tighter leading-[0.95] text-[clamp(1.25rem,6.5vw,2.25rem)] md:text-5xl xl:text-6xl min-[1440px]:text-6xl"
                  >
                    {member.name}
                  </p>
                </div>
              ))}
            </div>

            {/* DESCRIPTION FRAME: same approach. Long descriptions wrap onto more lines instead of being cut. */}
            <div
              className={[
                "relative grid w-full pointer-events-none",
                "md:w-80 md:shrink-0",
                "max-md:landscape:w-[38vw]",
              ].join(" ")}
            >
              {members.map((member, i) => (
                <div
                  key={member.id}
                  className="col-start-1 row-start-1 flex items-center justify-center md:justify-end min-h-28 md:min-h-30 py-2 px-1"
                >
                  <p
                    ref={(el) => {
                      descRefs.current[i] = el;
                    }}
                    className="text-xs leading-relaxed font-bold uppercase tracking-widest text-center md:text-right text-black/70"
                  >
                    {member.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Teams;
