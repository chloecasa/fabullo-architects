"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SubscribeModal from "@/components/contact/SubscribeModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactSection = () => {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      revealRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact-section"
      className={[
        "relative bg-white text-black overflow-hidden w-full",
        // Mobile: height follows content (stacked layout, no overlap)
        "h-auto py-8",
        // Tablet and up: original fixed heights
        "md:py-0 md:h-[1024px]",
        "lg:h-[768px]",
        "xl:h-[800px]",
        "min-[1440px]:h-[800px]",
      ].join(" ")}
    >
      <div
        ref={revealRef}
        className={[
          "relative w-full will-change-transform",
          // Mobile: stacked column with side padding
          "flex flex-col gap-6 px-4",
          // Tablet and up: absolute layout
          "md:block md:px-0 md:h-full",
        ].join(" ")}
      >
        {/* Image */}
        <div
          className={[
            "relative w-full aspect-[4/3] overflow-hidden",
            "md:absolute md:left-0 md:aspect-auto",
            "md:w-[700px] md:h-[727px] md:top-[26px]",
            "lg:w-[904px] lg:h-[496px] lg:top-[26px]",
            "xl:w-[1180px] xl:h-[496px] xl:top-[20px]",
            "min-[1440px]:w-[1320px] min-[1440px]:h-[496px] min-[1440px]:top-[20px]",
          ].join(" ")}
        >
          <img
            src="/assets/images/contactsec.jpg"
            alt="Architectural perspective"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Paragraph */}
        <p
          className={[
            "relative w-full max-w-[420px] text-left font-['LT_Superior'] font-bold text-black/70 text-[15px] leading-snug",
            "md:absolute md:max-w-none md:text-justify md:leading-tight",
            "md:w-75 md:left-[388px] md:top-[850px] md:text-sm",
            "lg:w-110 lg:left-[448px] lg:top-[576px] lg:text-sm",
            "xl:w-[520px] xl:left-[644px] xl:top-[543px] xl:text-xl",
            "min-[1440px]:w-[580px] min-[1440px]:left-[680px] min-[1440px]:top-[636px] min-[1440px]:text-xl",
          ].join(" ")}
        >
          We make sure to cater to what you need. Make your idea come to life
          and make living for you
        </p>

        {/* Get in touch link */}
        <Link
          href="/contact"
          scroll={true}
          data-cursor="click"
          className={[
            "inline-flex flex-wrap items-baseline self-start font-bold uppercase tracking-tighter leading-none text-black no-underline cursor-none",
            "transition-opacity hover:opacity-40 focus-visible:opacity-40 outline-none",
            // Mobile: fluid sizes so it fits 320px+ without touching the paragraph
            "max-w-full",
            "md:block md:whitespace-nowrap md:absolute",
            "md:left-[10px] md:top-[834px]",
            "lg:left-[20px] lg:top-[558px]",
            "xl:left-[20px] xl:top-[518px]",
            "min-[1440px]:left-[20px] min-[1440px]:top-[518px]",
          ].join(" ")}
        >
          <span
            className={[
              "font-bold uppercase tracking-tight",
              "text-[clamp(56px,20vw,96px)]",
              "md:text-[192px]",
              "lg:text-[218px]",
              "xl:text-[320px]",
              "min-[1440px]:text-[340px]",
            ].join(" ")}
          >
            Get
          </span>

          <span
            className={[
              "font-bold uppercase tracking-tight ml-2",
              "text-[clamp(24px,8vw,36px)]",
              "md:text-[68px]",
              "lg:text-[100px]",
              "xl:text-[120px]",
              "min-[1440px]:text-[130px]",
            ].join(" ")}
          >
            in touch
          </span>
        </Link>
      </div>

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </section>
  );
};

export default ContactSection;
