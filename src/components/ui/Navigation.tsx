"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter, usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const previewByPath: Record<string, string> = {
  "/": "/media/menu/home.jpeg",
  "/projects": "/media/menu/projects.jpeg",
  "/profile": "/assets/images/Profile.webp",
  "/journal": "/media/menu/journal.jpeg",
  "/contact": "/media/menu/contact.jpeg",
};

const navLinks = ["Home", "Projects", "Profile", "Journal", "Contact"];

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}
interface SearchResultItem {
  id: string | number;
  title: string;
  img: string;
  slug: string;
  type: string; // Added this property to support {result.type}
}
const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const container = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const [searchQuery, setSearchQuery] = useState("");
  
  // States: Store dynamic database search results and loading states
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImg, setActiveImg] = useState("/assets/images/hero.png");

 useEffect(() => {
    if (!searchQuery) { // Changed 'query' to 'searchQuery'
      // Defer clearing search results to avoid synchronous cascading renders
      const timer = setTimeout(() => {
        setSearchResults([]);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Defer setting loading state
    const loadTimer = setTimeout(() => {
      setIsLoading(true);
    }, 0);

    // Wait exactly 300ms of typing inactivity before making the API request
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`); // Changed 'query' to 'searchQuery'
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]); // Changed 'query' to 'searchQuery'

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
    const timer = setTimeout(() => {
      if (topResult) {
        setActiveImg(topResult.img);
        return;
      }

      if (!searchQuery.trim()) {
        setActiveImg(previewByPath[pathname] || "/assets/images/hero.png");
      }
    }, 0);

    return () => clearTimeout(timer);
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
      {/* Component 1: Menu Overlay Container (Symmetrical Padding scale) */}
      <div
        ref={overlayRef}
        className={[
          "menu-overlay fixed left-0 top-0 flex h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white rounded-none",
          // 01. Mobile Min (320x640)
          "p-[12px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:p-[12px]",
          // 03. Tablet Port (768x1024)
          "md:p-[20px]",
          // 04. Tablet Land (1024x768)
          "lg:p-[20px]",
          // 05. Desktop Base (1280x800)
          "xl:p-[20px]",
          // 06. Original Widescreen (1440x794)
          "min-[1440px]:p-[20px]"
        ].join(" ")}
        style={{ pointerEvents: isOpen ? "all" : "none" }}
      >
        
        {/* Component 2: Grid column mapping (Fills full width on mobile/tablet as preview panel is hidden) */}
        <div className={[
          "grid h-full w-full rounded-none",
          // 01. Mobile Min (320x640)
          "grid-cols-1 gap-[12px]",
          // 02. Mobile Std (390x844)
          "min-[375px]:grid-cols-1 min-[375px]:gap-[12px]",
          // 03. Tablet Port (768x1024)
          "md:grid-cols-1 md:gap-[20px]",
          // 04. Tablet Land (1024x768)
          "lg:grid-cols-1 lg:gap-[20px]",
          // 05. Desktop Base (1280x800) - Displays split layout starting at xl: (1280px)
          "xl:grid-cols-[minmax(0,1.08fr)_minmax(520px,0.92fr)] xl:gap-[20px]",
          // 06. Original Widescreen (1440x794) - Standard split layout
          "min-[1440px]:grid-cols-[minmax(0,1.08fr)_minmax(520px,0.92fr)] min-[1440px]:gap-[20px]"
        ].join(" ")}>
          
          {/* Component 3: Active Hover Preview Panel (Hidden on mobile and tablet completely: hidden xl:block) */}
          <div className="menu-preview relative hidden overflow-hidden bg-black xl:block rounded-none">
            <img
              src={activeImg}
              alt=""
              className="menu-preview-img absolute inset-0 h-full w-full scale-105 object-cover opacity-30 blur-[18px] rounded-none"
            />
            <img
              src={activeImg}
              alt=""
              className="menu-preview-img absolute inset-[20px] h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover rounded-none"
            />
            <div className="absolute inset-0 bg-black/25 pointer-events-none rounded-none" />
          </div>

          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-none">
            <nav className="search-anim flex w-full items-start justify-between gap-[20px] rounded-none">
              
              {/* Component 4: Dynamic Search Input Bar */}
              <div className="w-full max-w-[520px] rounded-none">
                <input
                  type="text"
                  placeholder="Search project or journal"
                  className={[
                    "w-full border-b border-white/30 bg-transparent font-['LT_Superior'] font-medium uppercase tracking-[2px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-white rounded-none",
                    // 01. Mobile Min (320x640)
                    "text-xs py-1.5",
                    // 02. Mobile Std (390x844)
                    "min-[375px]:text-xs min-[375px]:py-1.5",
                    // 03. Tablet Port (768x1024)
                    "md:text-sm md:py-2.5",
                    // 04. Tablet Land (1024x768)
                    "lg:text-sm lg:py-2.5",
                    // 05. Desktop Base (1280x800)
                    "xl:text-sm xl:py-2.5",
                    // 06. Original Widescreen (1440x794)
                    "min-[1440px]:text-sm min-[1440px]:py-2.5"
                  ].join(" ")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery.trim() && (
                  <div className="mt-[10px] border-l border-white/40 rounded-none bg-black/40 backdrop-blur-sm">
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
                          className="flex w-full items-center gap-[10px] px-[12px] py-[10px] text-left transition-colors hover:bg-white/10 rounded-none"
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
                className="shrink-0 font-['LT_Superior'] text-sm font-bold uppercase tracking-[2px] text-white transition-opacity hover:opacity-40 border-none bg-transparent cursor-pointer p-0 m-0"
              >
                [Close]
              </button>
            </nav>

            {/* Component 5: Lower Menu Navigation Links (Responsive Sizing Array) */}
            <div className="pb-[20px] rounded-none">
              <div className="flex flex-col rounded-none">
                {navLinks.map((link) => {
                  const href = link === "Home" ? "/" : `/${link.toLowerCase()}`;
                  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

                  return (
                    <div key={link} className="overflow-hidden rounded-none">
                      <button
                        type="button"
                        onMouseEnter={() => handleHoverPreview(href)}
                        onClick={() => handleNavigate(href)}
                        className={[
                          "group relative inline-flex items-center overflow-hidden px-0 text-left font-['LT_Superior'] font-bold uppercase leading-[0.9] transition-opacity border-none bg-transparent cursor-pointer p-0 m-0",
                          isActive ? "text-white/35 pointer-events-none" : "text-white hover:opacity-75",
                          // 01. Mobile Min (320x640)
                          "text-[36px]",
                          // 02. Mobile Std (390x844)
                          "min-[375px]:text-[44px]",
                          // 03. Tablet Port (768x1024)
                          "md:text-[64px]",
                          // 04. Tablet Land (1024x768)
                          "lg:text-[74px]",
                          // 05. Desktop Base (1280x800)
                          "xl:text-[96px]",
                          // 06. Original Widescreen (1440x794)
                          "min-[1440px]:text-[112px]"
                        ].join(" ")}
                      >
                        <span className="menu-link-text relative block rounded-none">
                          {link}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Component 6: Footer Credits section */}
              <div className="mt-[40px] flex items-end justify-between gap-[20px] border-t border-white/20 pt-[14px] rounded-none">
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
