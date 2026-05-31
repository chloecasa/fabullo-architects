"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TitleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const TitleReveal = ({ children, className = "", delay = 0.75 }: TitleRevealProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      titleRef.current,
      {
        yPercent: 110,
      },
      {
        yPercent: 0,
        duration: 1.1,
        delay,
        ease: "power4.out",
      }
    );
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        overflow: "hidden",
        paddingTop: "0.12em",
        paddingBottom: "0.08em",
      }}
    >
      <h1
        ref={titleRef}
        className="block"
        style={{ willChange: "transform" }}
      >
        {children}
      </h1>
    </div>
  );
};

export default TitleReveal;
