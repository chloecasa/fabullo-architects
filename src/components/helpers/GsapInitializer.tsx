"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function GsapInitializer() {
  useGSAP(() => {
    // Register all plugins here once
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Global GSAP settings
    gsap.config({
      nullTargetWarn: false, // Stops warnings if an element isn't found
    });

    // Refresh ScrollTrigger when images load
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  }, []);

  return null; // This component doesn't render anything
}
