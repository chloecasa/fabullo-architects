// src/components/Navigation.tsx
"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter, usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const previewByPath: Record<string, string> = {
  "/": "/assets/images/hero.png",
  "/projects": "/assets/projects/tareola.png",
  "/profile": "/assets/images/Profile.webp",
  "/journal": "/assets/images/hero.png",
  "/contact": "/assets/images/hero.png",
};

const navLinks = ["Home", "Projects", "Profile", "Journal", "Contact"];

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const container = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const [searchQuery, setSearchQuery] = useState("");
  
  // States: Store dynamic database search results and loading states [1]
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImg, setActiveImg] = useState("/assets/images/hero.png");

  // Debounced Database Fetcher: Protects the Neon database connection pool [1]
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Wait exactly 300ms of typing inactivity before making the API request [1]
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('SEARCH CLIENT ERROR:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms delay [1]

    return () => clearTimeout(delayDebounceFn); // Clear previous timeout if user continues typing [1]
  }, [searchQuery]);

  const topResult = searchResults[0] || null;

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      lenis?.start();
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Enter" && topResult) {
        onClose();
        router.push(topResult.slug); // Navigate using database slug
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, router, topResult]);

  useEffect(() => {
    if (topResult && topResult.img) {
      setActiveImg(topResult.img);
      return;
    }

    if (!searchQuery.trim()) {
      setActiveImg(previewByPath[pathname] || "/assets/images/hero.png");
    }
  }, [topResult, searchQuery, pathname]);

  useGSAP(
    () => {
      gsap.set(container.current, { autoAlpha: 0 });
      const root = container.current;
if (!root) return;

const overlay = root.querySelector(".menu-overlay");
const links = root.querySelectorAll(".menu-link-text");
const search = root.querySelector(".search-anim");
const preview = root.querySelector(".menu-preview");

gsap.set(overlay, {
  clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
});
gsap.set(links, { y: 150 });
gsap.set(search, { opacity: 0, y: -20 });
gsap.set(preview, { opacity: 0, scale: 1.04 });

      tl.current = gsap
  .timeline({ paused: true })
  .set(root, { autoAlpha: 1 })
  .to(overlay, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1,
    ease: "power4.inOut",
  })
  .to(preview, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0.25)
  .to(search, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.45)
  .to(links, { y: 0, duration: 0.85, stagger: 0.08, ease: "power3.out" }, 0.45);
    },
    { scope: container }
  );

  useGSAP(
    () => {
      if (isOpen) {
        tl.current?.play();
      } else {
        tl.current?.reverse();
      }
    },
    [isOpen]
  );

  const closeMenu = () => {
    if (!container.current) return;

    const links = container.current.querySelectorAll(".menu-link-text");

    gsap.to(links, {
      y: -80,
      opacity: 0,
      duration: 0.35,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => {
        onClose();
        gsap.set(links, { opacity: 1, y: 0 });
      },
    });
  };

  const handleNavigate = (href: string) => {
    closeMenu();
    setTimeout(() => {
      router.push(href);
    }, 260);
  };

  const handleHoverPreview = (href: string) => {
    if (searchQuery.trim() || !container.current) return;

    const nextImg = previewByPath[href] || "/assets/images/hero.png";
    const previewImages = container.current.querySelectorAll(".menu-preview-img");

    gsap.to(previewImages, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setActiveImg(nextImg);
        gsap.to(previewImages, { opacity: 1, duration: 0.35 });
      },
    });
  };

  return (
    <div
      ref={container}
      className="relative"
      style={{ zIndex: 2000, visibility: "hidden" }}
    >
      <div
        ref={overlayRef}
        className="menu-overlay fixed left-0 top-0 flex h-screen w-screen overflow-hidden bg-[#0a0a0a] p-[20px] text-white"
        style={{ pointerEvents: isOpen ? "all" : "none" }}
      >
        <div className="grid h-full w-full grid-cols-1 gap-[20px] lg:grid-cols-[minmax(0,1.08fr)_minmax(520px,0.92fr)]">
          <div className="menu-preview relative hidden overflow-hidden bg-black lg:block">
            <img
              src={activeImg}
              alt=""
              className="menu-preview-img absolute inset-0 h-full w-full scale-105 object-cover opacity-30 blur-[18px]"
            />
            <img
              src={activeImg}
              alt=""
              className="menu-preview-img absolute inset-[20px] h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover"
            />
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          </div>

          <div className="relative flex h-full flex-col justify-between overflow-hidden">
            <nav className="search-anim flex w-full items-start justify-between gap-[20px]">
              <div className="w-full max-w-[520px]">
                <input
                  type="text"
                  placeholder="Search project or journal"
                  className="w-full border-b border-white/30 bg-transparent py-2.5 font-['LT_Superior'] text-sm font-medium uppercase tracking-[2px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery.trim() && (
                  <div className="mt-[10px] border-l border-white/40">
                    {isLoading ? (
                      <div className="px-[12px] py-[10px] font-mono text-[10px] uppercase tracking-[1px] text-white/45 animate-pulse">
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.slice(0, 4).map((result) => (
                        <button
                          key={result.id} // Unique ID returned by API
                          type="button"
                          onMouseEnter={() => {
                            if (result.img) setActiveImg(result.img);
                          }}
                          onClick={() => handleNavigate(result.slug)} // Dynamic slug routing
                          className="flex w-full items-center gap-[10px] px-[12px] py-[10px] text-left transition-colors hover:bg-white/10"
                        >
                          <span className="font-mono text-[10px] uppercase text-white/45">{result.type}</span>
                          <span className="flex-1 font-['LT_Superior'] text-base font-bold uppercase text-white">
                            {result.title}
                          </span>
                          <span className="text-sm text-white/60">↗</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-[12px] py-[10px] font-mono text-[10px] uppercase tracking-[1px] text-white/45">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="shrink-0 font-['LT_Superior'] text-sm font-bold uppercase tracking-[2px] text-white transition-opacity hover:opacity-40"
              >
                [Close]
              </button>
            </nav>

            <div className="pb-[20px]">
              <div className="flex flex-col">
                {navLinks.map((link) => {
                  const href = link === "Home" ? "/" : `/${link.toLowerCase()}`;
                  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

                  return (
                    <div key={link} className="overflow-hidden">
                      <button
                        type="button"
                        onMouseEnter={() => handleHoverPreview(href)}
                        onClick={() => handleNavigate(href)}
                        className={`group relative inline-flex items-center overflow-hidden px-0 text-left font-['LT_Superior'] text-[clamp(3.5rem,7vw,112px)] font-bold uppercase leading-[0.9] transition-opacity ${
                          isActive ? "text-white/35" : "text-white hover:opacity-75"
                        }`}
                      >
                        <span className="menu-link-text relative block">
                          {link}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-[40px] flex items-end justify-between gap-[20px] border-t border-white/20 pt-[14px]">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  © MGK ARCHITECTS / 2025
                </p>
                <p className="hidden whitespace-nowrap text-right font-mono text-[10px] uppercase leading-none tracking-widest text-white/35 md:block">
                  Press Escape to close. Enter opens the first search result.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
