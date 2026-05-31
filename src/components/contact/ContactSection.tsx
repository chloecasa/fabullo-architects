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
   <section ref={sectionRef} id="contact-section" className="relative min-h-screen bg-white text-black overflow-hidden">
    <div ref={revealRef} className="grid min-h-screen grid-cols-[1fr_320px] grid-rows-[66vh_34vh] will-change-transform">
        <div className="relative row-start-1 col-start-1 overflow-hidden">
          <img
            src="/assets/images/Contact/Contact.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        

        <div className="row-start-2 col-span-2 relative px-4 pt-8">
          <p className="absolute left-[33.2vw] top-15 max-w-[520px] text-base uppercase leading-none">
            We make sure to cater to what you need. Make your idea come to life
            and make living for you
          </p>

          <Link
  href="/contact"
  scroll={true}
  data-cursor="click"
  className="cursor-none block whitespace-nowrap text-[clamp(5rem,17vw,260px)] font-bold uppercase leading-[0.76] tracking-[-0.04em] transition-opacity hover:opacity-40"
>
            Get<span className="text-[clamp(4rem,10vw,150px)]">in touch</span>
          </Link>
        </div>
      </div>

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </section>
  );
};

export default ContactSection;
