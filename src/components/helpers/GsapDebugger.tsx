"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GsapDebugger() {
  useEffect(() => {
    // Only show markers if we are in "Development" mode
    if (process.env.NODE_ENV === "development") {
      ScrollTrigger.defaults({
        markers: {
          startColor: "rgba(255,255,255,0.2)",
          endColor: "rgba(255,255,255,0.2)",
          fontSize: "10px",
        },
      });
    }
  }, []);

  return null;
}
