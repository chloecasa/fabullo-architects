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
      {
        yPercent: 100,
      },
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
        "relative bg-white text-black overflow-hidden rounded-none w-full",
        // 01. Mobile Min (320x458) - Locked height
        "h-[458px]",
        // 02. Mobile Std (390x458) - Locked height
        "min-[375px]:h-[458px]",
        // 03. Tablet Port (768x1024)
        "md:h-[1024px]",
        // 04. Tablet Land (1024x768)
        "lg:h-[768px]",
        // 05. Desktop Base (1280x800)
        "xl:h-[800px]",
        // 06. Original Widescreen (1440x800)
        "min-[1440px]:h-[800px]"
      ].join(" ")}
    >
      <div 
        ref={revealRef} 
        className="relative w-full h-full will-change-transform rounded-none"
      >
        
        {/* Component 1: Absolute Image Wrapper & Source */}
        <div className={[
          "overflow-hidden absolute left-0 rounded-none",
          // 01. Mobile Min (320x458) - Narrower width (was w-80 / 320px)
          "w-[304px] h-72 top-[10px]",
          // 02. Mobile Std (390x458) - Narrower width (was w-96 / 384px)
          "min-[375px]:w-[370px] min-[375px]:h-72 min-[375px]:top-[10px]",
          // 03. Tablet Port (768x1024)
          "md:w-[700px] md:h-[727px] md:top-[26px]",
          // 04. Tablet Land (1024x768)
          "lg:w-[904px] lg:h-[496px] lg:top-[26px]",
          // 05. Desktop Base (1280x800)
          "xl:w-[1180px] xl:h-[496px] xl:top-[20px]",
          // 06. Original Widescreen (1440x800)
          "min-[1440px]:w-[1320px] min-[1440px]:h-[496px] min-[1440px]:top-[20px]"
        ].join(" ")}>
          <img
            src="/assets/images/Contact/Contact.png"
            alt="Architectural perspective"
            className="h-full w-full object-cover rounded-none"
          />
        </div>

        {/* Component 2: Copy Description Paragraph */}
        <p className={[
          "absolute text-justify font-['LT_Superior'] font-bold text-black uppercase leading-tight rounded-none",
          // 01. Mobile Min (320x458)
          "w-35 left-[157px] top-[398px] text-[4px]",
          // 02. Mobile Std (390x458)
          "min-[375px]:w-40 min-[375px]:left-[201px] min-[375px]:top-[380px] min-[375px]:text-[4px]",
          // 03. Tablet Port (768x1024)
          "md:w-75 md:left-[388px] md:top-[850px] md:text-sm md:normal-case md:text-black/70",
          // 04. Tablet Land (1024x768)
          "lg:w-110 lg:left-[448px] lg:top-[576px] lg:text-sm lg:normal-case lg:text-black/70",
          // 05. Desktop Base (1280x800)
          "xl:w-[520px] xl:left-[644px] xl:top-[543px] xl:text-xl xl:normal-case xl:text-black/70",
          // 06. Original Widescreen (1440x800)
          "min-[1440px]:w-[580px] min-[1440px]:left-[680px] min-[1440px]:top-[636px] min-[1440px]:text-xl min-[1440px]:normal-case min-[1440px]:text-black/70"
        ].join(" ")}>
          We make sure to cater to what you need. Make your idea come to life
          and make living for you
        </p>

        {/* Component 3: "Get In Touch" Link Block */}
        <Link
          href="/contact"
          scroll={true}
          data-cursor="click"
          className={[
            "absolute justify-start font-bold uppercase tracking-tighter transition-opacity hover:opacity-40 cursor-none no-underline leading-none text-black rounded-none block whitespace-nowrap",
            // 01. Mobile Min (320x458)
            "left-[10px] top-[390px]",
            // 02. Mobile Std (390x458)
            "min-[375px]:left-[10px] min-[375px]:top-[370px]",
            // 03. Tablet Port (768x1024)
            "md:left-[10px] md:top-[834px]",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[558px]",
            // 05. Desktop Base (1280x800)
            "xl:left-[20px] xl:top-[518px]",
            // 06. Original Widescreen (1440x800)
            "min-[1440px]:left-[20px] min-[1440px]:top-[518px]"
          ].join(" ")}
        >
         {/* "Get" Portion */}
          <span className={[
            "font-bold uppercase tracking-tight",
            // 01. Mobile Min (320x458) - Scaled up (was text-7xl / 72px)
            "text-[72px]",
            // 02. Mobile Std (390x458) - Scaled up (was text-8xl / 96px)
            "min-[375px]:text-[96px]",
            // 03. Tablet Port (768x1024) - Scaled up (was md:text-[186px])
            "md:text-[192px]",
            // 04. Tablet Land (1024x768) - Scaled up (was lg:text-[200px])
            "lg:text-[218px]",
            // 05. Desktop Base (1280x800) - Scaled up (was xl:text-[282px])
            "xl:text-[320px]",
            // 06. Original Widescreen (1440x800) - Scaled up (was min-[1440px]:text-[282px])
            "min-[1440px]:text-[340px]"
          ].join(" ")}>
            Get
          </span>

          {/* "in touch" Portion */}
          <span className={[
            "font-bold uppercase tracking-tight ml-2",
            // 01. Mobile Min (320x458) - Scaled up (was text-3xl / 30px)
            "text-[32px]",
            // 02. Mobile Std (390x844) - Scaled up (was text-4xl / 36px)
            "min-[375px]:text-[36px]",
            // 03. Tablet Port (768x1024) - Scaled up (was md:text-6xl / 60px)
            "md:text-[68px]",
            // 04. Tablet Land (1024x768) - Scaled up (was lg:text-8xl / 96px)
            "lg:text-[100px]",
            // 05. Desktop Base (1280x800) - Scaled up (was xl:text-8xl / 96px)
            "xl:text-[120px]",
            // 06. Original Widescreen (1440x800) - Scaled up (was min-[1440px]:text-8xl / 96px)
            "min-[1440px]:text-[130px]"
          ].join(" ")}>
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
