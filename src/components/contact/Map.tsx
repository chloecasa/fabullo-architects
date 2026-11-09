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
    phone: "+61 2 9211 1111",
    email: "hello@fabullo.com",
    mapSrc:
      "https://www.google.com/maps?q=1/91%20Campbell%20Street%20Surry%20Hills%20NSW%202010&output=embed",
  },
  {
    name: "Avalon Beach",
    address: "7/55 avalon parade AVALON BEACH NSW 2107",
    phone: "+61 2 9211 1111",
    email: "hello@fabullo.com",
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
         <section
      ref={wrapperRef}
      data-map-section
      className="flex w-full flex-col gap-12 bg-white py-12 rounded-none md:block md:gap-0 md:py-0"
    >
      {locations.map((location, index) => (
        <div
          key={location.name}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className={[
            "relative w-full overflow-hidden bg-white rounded-none px-3 pb-6 md:px-0 md:pb-0",
            // Mobile: height follows content. Tablet and up: original fixed heights.
            "md:h-[680px]",
            "lg:h-[640px]",
            "xl:h-[750px]",
            "min-[1440px]:h-[794px]",
          ].join(" ")}
        >
          {/* Map frame: 4:3 on phones, original absolute box from md up */}
          <div
            className={[
              "map-frame relative w-full aspect-[4/3] overflow-hidden bg-zinc-300 rounded-none",
              "md:absolute md:left-[20px] md:right-[20px] md:top-[20px] md:aspect-auto md:h-[400px]",
              "lg:h-[380px]",
              "xl:h-[460px]",
              "min-[1440px]:h-[496px]",
            ].join(" ")}
          >
            <iframe
              src={location.mapSrc}
              title={`${location.name} map`}
              className={`h-full w-full border-0 grayscale rounded-none ${
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
                className="absolute inset-0 cursor-pointer bg-transparent rounded-none"
                aria-label={`Activate ${location.name} map`}
              />
            )}
          </div>

          {/* Location name */}
          <h2
            className={[
              "map-copy relative mt-6 font-bold font-['LT_Superior'] uppercase leading-none text-black text-3xl rounded-none",
              "sm:text-4xl",
              "md:absolute md:mt-0 md:left-[20px] md:top-[440px] md:text-4xl",
              "lg:left-[20px] lg:top-[420px] lg:text-5xl",
              "xl:left-[20px] xl:top-[500px] xl:text-6xl",
              "min-[1440px]:left-[19px] min-[1440px]:top-[539px] min-[1440px]:text-6xl",
            ].join(" ")}
          >
            {location.name}
          </h2>

          {/* Address */}
          <div
            className={[
              "map-copy relative mt-4 max-w-[280px] font-medium font-['LT_Superior'] uppercase text-black text-sm leading-snug rounded-none",
              "md:absolute md:mt-0 md:max-w-none md:left-[20px] md:top-[520px] md:w-auto md:text-sm",
              "lg:left-[20px] lg:top-[490px] lg:text-lg",
              "xl:left-[20px] xl:top-[590px] xl:text-xl",
              "min-[1440px]:left-[20px] min-[1440px]:top-[628px] min-[1440px]:text-2xl",
            ].join(" ")}
          >
            {location.address}
          </div>

          {/* Phone and email: stacked on phones, original absolute spots from md up */}
          <div className="mt-2 flex flex-col items-start md:contents">
            <a
              href={`tel:${location.phone.replace(/\s/g, "")}`}
              className={[
                "map-copy relative inline-flex min-h-[44px] items-center font-medium font-['LT_Superior'] uppercase text-black text-sm transition-opacity hover:opacity-50 rounded-none",
                "md:absolute md:min-h-0 md:right-[20px] md:top-[520px] md:text-xs",
                "lg:right-[20px] lg:top-[490px] lg:text-sm",
                "xl:right-[20px] xl:top-[590px] xl:text-base",
                "min-[1440px]:right-[20px] min-[1440px]:top-[628px] min-[1440px]:text-base",
              ].join(" ")}
            >
              {location.phone}
            </a>

            {location.email && (
              <a
                href={`mailto:${location.email}`}
                className={[
                  "map-copy relative inline-flex min-h-[44px] items-center font-medium font-['LT_Superior'] uppercase text-black text-sm underline transition-opacity hover:opacity-50 rounded-none",
                  "md:absolute md:min-h-0 md:right-[20px] md:top-[550px] md:text-xs",
                  "lg:right-[20px] lg:top-[520px] lg:text-sm",
                  "xl:right-[20px] xl:top-[625px] xl:text-base",
                  "min-[1440px]:right-[20px] min-[1440px]:top-[665px] min-[1440px]:text-base",
                ].join(" ")}
              >
                {location.email}
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Map;
