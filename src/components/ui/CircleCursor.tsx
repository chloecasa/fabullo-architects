"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LABELS: { selector: string; label: string }[] = [
  { selector: "[data-cursor='view']", label: "VIEW" },
  { selector: "[data-cursor='open']", label: "OPEN" },
    { selector: "[data-cursor='close']", label: "CLOSE" },
];

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label";

export default function CircleCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    // Only on devices with a real mouse. Touch screens keep the normal pointer.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("has-circle-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: reduce ? 0 : 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: reduce ? 0 : 0.5, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: "auto" });
    };

    const onLeaveWindow = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, overwrite: "auto" });
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const labelled = LABELS.find((l) => target.closest(l.selector));

      if (labelled) {
        setLabel(labelled.label);
        gsap.to(ring, { scale: 3.4, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        gsap.to(dot, { scale: 0, duration: 0.2, overwrite: "auto" });
        return;
      }

      if (target.closest(INTERACTIVE)) {
        gsap.to(ring, { scale: 2, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        gsap.to(dot, { scale: 0.4, duration: 0.2, overwrite: "auto" });
      }
    };

    const onOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE) || LABELS.some((l) => target.closest(l.selector))) {
        setLabel("");
        gsap.to(ring, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        gsap.to(dot, { scale: 1, duration: 0.2, overwrite: "auto" });
      }
    };

    const onDown = () => gsap.to(ring, { scale: "-=0.3", duration: 0.15, overwrite: "auto" });
    const onUp = () => gsap.to(ring, { scale: "+=0.3", duration: 0.2, overwrite: "auto" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-circle-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, []);

  return (
    <>
      {/* Dot: exact pointer position */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2147483647] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
      />

      {/* Ring: trails behind, inverts against the background, expands with a label */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2147483646] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white opacity-0 mix-blend-difference"
      >
        {label && (
          <span className="font-mono text-[6px] uppercase leading-none tracking-widest text-white">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
