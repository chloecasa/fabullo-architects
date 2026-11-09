"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

// Every time the route changes, go to the top of the new page.
// Lenis keeps its own scroll position, so it has to be reset too.
export default function ScrollToTopOnRoute() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Keep in-page anchors such as /contact#map working
    if (window.location.hash) return;

    // Stop the browser restoring the old position on back and forward
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const toTop = () => {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    };

    toTop();

    // The new page can change height as images and maps load, so check again shortly after
    const timer = window.setTimeout(toTop, 150);
    return () => window.clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
}
