"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const locations = [
  {
    name: "Surry Hills",
    address: "1/91 campbell street surry hills nsw 2010",
    phone: "+61 2 9211 4146",
    email: "architects@mckarchitects.com",
    mapSrc:
      "https://www.google.com/maps?q=1/91%20Campbell%20Street%20Surry%20Hills%20NSW%202010&output=embed",
  },
  {
    name: "Avalon Beach",
    address: "7/55 avalon parade AVALON BEACH NSW 2107",
    phone: "+61 2 9211 4262",
    email: "",
    mapSrc:
      "https://www.google.com/maps?q=7/55%20Avalon%20Parade%20Avalon%20Beach%20NSW%202107&output=embed",
  },
];

const Map = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeMap, setActiveMap] = useState<string | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const triggers: ScrollTrigger[] = [];

    const firstMap = sectionRefs.current[0];
    const secondMap = sectionRefs.current[1];

    if (firstMap) {
      const firstFrame = firstMap.querySelector(".map-frame");
      const firstCopy = firstMap.querySelectorAll(".map-copy");

      const trigger = ScrollTrigger.create({
        trigger: firstMap,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            firstFrame,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
          );

          gsap.fromTo(
            firstCopy,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              delay: 0.15,
              ease: "power3.out",
            }
          );
        },
      });

      triggers.push(trigger);
    }

    if (secondMap) {
      const secondFrame = secondMap.querySelector(".map-frame");
      const secondCopy = secondMap.querySelectorAll(".map-copy");

      gsap.set(secondMap, {
        clipPath: "inset(100% 0% 0% 0%)",
      });

      gsap.set(secondFrame, {
        y: 60,
      });

      const trigger = ScrollTrigger.create({
        trigger: secondMap,
        start: "top 80%",
        onEnter: () => {
          gsap.to(secondMap, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power4.inOut",
          });

          gsap.fromTo(
            secondCopy,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              delay: 0.35,
              ease: "power3.out",
            }
          );

          gsap.to(secondFrame, {
            y: 0,
            duration: 1,
            ease: "power4.out",
          });
        },
      });

      triggers.push(trigger);
    }

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={wrapperRef} className="w-full bg-white">
      {locations.map((location, index) => (
        <div
          key={location.name}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="relative h-[794px] w-full overflow-hidden bg-white"
        >
          <div className="map-frame absolute left-[20px] top-[20px] h-[496px] w-[calc(100%-40px)] overflow-hidden bg-zinc-300">
            <iframe
              src={location.mapSrc}
              title={`${location.name} map`}
              className={`h-full w-full border-0 grayscale ${
                activeMap === location.name ? "pointer-events-auto" : "pointer-events-none"
              }`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {activeMap !== location.name && (
              <button
                type="button"
                onClick={() => setActiveMap(location.name)}
                className="absolute inset-0 cursor-pointer bg-transparent"
                aria-label={`Activate ${location.name} map`}
              />
            )}
          </div>

          <h2 className="map-copy absolute left-[19px] top-[539px] justify-start text-black text-6xl font-bold font-['LT_Superior'] uppercase">
            {location.name}
          </h2>

          <div className="map-copy absolute left-[20px] top-[628px] justify-start text-black text-2xl font-medium font-['LT_Superior'] uppercase">
            {location.address}
          </div>

          {location.email && (
            <a
              href={`mailto:${location.email}`}
              className="map-copy absolute right-[20px] top-[665px] justify-start text-black text-base font-medium font-['LT_Superior'] underline uppercase transition-opacity hover:opacity-50"
            >
              {location.email}
            </a>
          )}

          <a
            href={`tel:${location.phone.replace(/\s/g, "")}`}
            className="map-copy absolute right-[20px] top-[628px] justify-start text-black text-base font-medium font-['LT_Superior'] uppercase transition-opacity hover:opacity-50"
          >
            {location.phone}
          </a>
        </div>
      ))}
    </section>
  );
};

export default Map;
