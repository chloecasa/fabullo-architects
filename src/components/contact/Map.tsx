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
    <section ref={wrapperRef} className="w-full bg-white rounded-none">
      {locations.map((location, index) => (
        <div
          key={location.name}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className={[
            "relative overflow-hidden bg-white rounded-none w-full",
            // 01. Mobile Min (320x640) - Compact Sizing
            "h-[480px]",
            // 02. Mobile Std (390x844) - Standard Phone Sizing
            "min-[375px]:h-[520px]",
            // 03. Tablet Port (768x1024) - Portrait iPad Sizing
            "md:h-[680px]",
            // 04. Tablet Land (1024x768) - Landscape iPad Sizing
            "lg:h-[640px]",
            // 05. Desktop Base (1280x800) - Laptop Display Sizing
            "xl:h-[750px]",
            // 06. Original Widescreen (1440x794) - Figma Sizing
            "min-[1440px]:h-[794px]"
          ].join(" ")}
        >
          {/* Component 1: Map Frame Container Wrapper */}
          <div className={[
            "map-frame absolute overflow-hidden bg-zinc-300 rounded-none",
            // 01. Mobile Min (320x640) - Symmetrical margins & compact height
            "left-[12px] right-[12px] top-[12px] w-auto h-[260px]",
            // 02. Mobile Std (390x844) - Symmetrical margins & standard height
            "min-[375px]:left-[12px] min-[375px]:right-[12px] min-[375px]:top-[12px] min-[375px]:w-auto min-[375px]:h-[300px]",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:right-[20px] md:top-[20px] md:w-auto md:h-[400px]",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:right-[20px] lg:top-[20px] lg:w-auto lg:h-[380px]",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:right-[20px] xl:top-[20px] xl:w-auto xl:h-[460px]",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[20px] min-[1440px]:right-[20px] min-[1440px]:top-[20px] min-[1440px]:w-auto min-[1440px]:h-[496px]"
          ].join(" ")}>
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

          {/* Component 2: Main Sizing Title (Surry Hills / Avalon Beach) */}
          <h2 className={[
            "map-copy absolute justify-start text-black font-bold font-['LT_Superior'] uppercase rounded-none leading-none",
            // 01. Mobile Min (320x640) - Compact font size
            "left-[12px] top-[290px] text-2xl",
            // 02. Mobile Std (390x844) - Standard phone font size
            "min-[375px]:left-[12px] min-[375px]:top-[330px] min-[375px]:text-3xl",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:top-[440px] md:text-4xl",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[420px] lg:text-5xl",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:top-[500px] xl:text-6xl",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[19px] min-[1440px]:top-[539px] min-[1440px]:text-6xl"
          ].join(" ")}>
            {location.name}
          </h2>

          {/* Component 3: Location Address Paragraph */}
          <div className={[
            "map-copy absolute justify-start text-black font-medium font-['LT_Superior'] uppercase rounded-none",
            // 01. Mobile Min (320x640) - Narrow width to prevent email collision
            "left-[12px] top-[340px] w-[200px] text-[10px] leading-normal",
            // 02. Mobile Std (390x844) - Narrow width to prevent email collision
            "min-[375px]:left-[12px] min-[375px]:top-[390px] min-[375px]:w-[200px] min-[375px]:text-[11px] min-[375px]:leading-normal",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:top-[520px] md:w-auto md:text-sm",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[490px] lg:w-auto lg:text-lg",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:top-[590px] xl:w-auto xl:text-xl",
            // 06. Original Widescreen (1440x794)
            "min-[1440px]:left-[20px] min-[1440px]:top-[628px] min-[1440px]:w-auto min-[1440px]:text-2xl"
          ].join(" ")}>
            {location.address}
          </div>

          {/* Component 4: Location Email Link (Anchored to fluid right margin) */}
          {location.email && (
            <a
              href={`mailto:${location.email}`}
              className={[
                "map-copy absolute justify-start text-black font-medium font-['LT_Superior'] underline uppercase transition-opacity hover:opacity-50 rounded-none",
                // 01. Mobile Min (320x640)
                "right-[12px] top-[365px] text-[10px]",
                // 02. Mobile Std (390x844)
                "min-[375px]:right-[12px] min-[375px]:top-[415px] min-[375px]:text-[11px]",
                // 03. Tablet Port (768x1024)
                "md:right-[20px] md:top-[550px] md:text-xs",
                // 04. Tablet Land (1024x768)
                "lg:right-[20px] lg:top-[520px] lg:text-sm",
                // 05. Desktop Base (1280x800)
                "xl:right-[20px] xl:top-[625px] xl:text-base",
                // 06. Original Widescreen (1440x794)
                "min-[1440px]:right-[20px] min-[1440px]:top-[665px] min-[1440px]:text-base"
              ].join(" ")}
            >
              {location.email}
            </a>
          )}

          {/* Component 5: Location Phone Link (Anchored to fluid right margin) */}
          <a
            href={`tel:${location.phone.replace(/\s/g, "")}`}
            className={[
              "map-copy absolute justify-start text-black font-medium font-['LT_Superior'] uppercase transition-opacity hover:opacity-50 rounded-none",
              // 01. Mobile Min (320x640)
              "right-[12px] top-[340px] text-[10px]",
              // 02. Mobile Std (390x844)
              "min-[375px]:right-[12px] min-[375px]:top-[390px] min-[375px]:text-[11px]",
              // 03. Tablet Port (768x1024)
              "md:right-[20px] md:top-[520px] md:text-xs",
              // 04. Tablet Land (1024x768)
              "lg:right-[20px] lg:top-[490px] lg:text-sm",
              // 05. Desktop Base (1280x800)
              "xl:right-[20px] xl:top-[590px] xl:text-base",
              // 06. Original Widescreen (1440x794)
              "min-[1440px]:right-[20px] min-[1440px]:top-[628px] min-[1440px]:text-base"
            ].join(" ")}
          >
            {location.phone}
          </a>
        </div>
      ))}
    </section>
  );
};

export default Map;
