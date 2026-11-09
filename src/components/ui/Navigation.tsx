"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter, usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const previewByPath: Record<string, string> = {
  "/": "/assets/images/hero5.jpg",
  "/projects": "/assets/images/hero3.jpg",
  "/profile": "/assets/images/profile.jpg",
  "/contact": "/assets/images/contact.jpg",
};

const navLinks = ["Home", "Projects", "Profile", "Contact"];

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string | number;
  title: string;
  img: string;
  slug: string;
  type: string;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const container = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImg, setActiveImg] = useState("/assets/images/hero.png");

  useEffect(() => {
    if (!searchQuery) {
      const timer = setTimeout(() => {
        setSearchResults([]);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const loadTimer = setTimeout(() => setIsLoading(true), 0);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
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
      if (event.key === "Escape") onClose();

      if (event.key === "Enter" && topResult) {
        onClose();
        router.push(topResult.slug);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, router, topResult]);

  // Show the current page's image by default, or the top search result's image
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
      const mobilePreview = root.querySelector(".menu-preview-mobile");

      gsap.set(overlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(links, { y: 150 });
      gsap.set(search, { opacity: 0, y: -20 });
      gsap.set(preview, { opacity: 0, scale: 1.04 });
      gsap.set(mobilePreview, { opacity: 0, scale: 1.04 });

      tl.current = gsap
        .timeline({ paused: true })
        .set(root, { autoAlpha: 1 })
        .to(overlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power4.inOut",
        })
        .to(preview, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0.25)
        .to(mobilePreview, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0.25)
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

  // Works on desktop hover and on phone tap (the tap fires the same events)
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
        className="menu-overlay fixed inset-0 flex h-dvh overflow-hidden rounded-none bg-[#0a0a0a] p-3 text-white md:p-5"
        style={{ pointerEvents: isOpen ? "all" : "none" }}
      >
        <div className="grid h-full w-full gap-3 rounded-none md:gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(520px,0.92fr)] xl:gap-5">
          {/* Desktop preview panel (hover) */}
          <div className="menu-preview relative hidden overflow-hidden rounded-none bg-black xl:block">
            <img
              src={activeImg}
              alt=""
              className="menu-preview-img absolute inset-0 h-full w-full scale-105 object-cover opacity-30 blur-[18px] rounded-none"
            />
            <img
              src={activeImg}
              alt=""
              className="menu-preview-img absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover rounded-none"
            />
            <div className="pointer-events-none absolute inset-0 rounded-none bg-black/25" />
          </div>

          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-none">
            {/* Phone and tablet preview: full background behind the links (no hover needed) */}
            <div className="menu-preview-mobile pointer-events-none absolute inset-0 overflow-hidden bg-black xl:hidden">
              <img
                src={activeImg}
                alt=""
                className="menu-preview-img absolute inset-0 h-full w-full object-cover opacity-45 rounded-none"
              />
              {/* Dark gradient so the white links and search stay readable */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
            </div>

                      {/* Search bar at the top. Desktop: Close sits at the top right, beside the search. */}
            <nav className="search-anim relative z-10 flex w-full items-start justify-between gap-6 rounded-none">
              <div className="w-full max-w-[520px] rounded-none">
                <input
                  type="text"
                  placeholder="Search projects"
                  className="w-full rounded-none border-b border-white/30 bg-transparent py-2 font-['LT_Superior'] text-base font-medium uppercase tracking-[2px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-white md:py-2.5 md:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery.trim() && (
                  <div className="mt-2.5 rounded-none border-l border-white/40 bg-black/40 backdrop-blur-sm">
                    {isLoading ? (
                      <div className="animate-pulse px-3 py-2.5 font-mono text-[10px] uppercase tracking-[1px] text-white/45">
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.slice(0, 4).map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onMouseEnter={() => {
                            if (result.img) setActiveImg(result.img);
                          }}
                          onClick={() => handleNavigate(result.slug)}
                          className="flex w-full items-center gap-2.5 rounded-none px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                        >
                          <span className="font-mono text-[10px] uppercase text-white/45">
                            {result.type}
                          </span>
                          <span className="flex-1 font-['LT_Superior'] text-base font-bold uppercase text-white">
                            {result.title}
                          </span>
                          <span className="text-sm text-white/60">↗</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[1px] text-white/45">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop only: Close at the top right, on the same row as the search */}
              <button
                type="button"
                onClick={closeMenu}
                               className="-mr-3 hidden shrink-0 cursor-pointer border-none bg-transparent p-3 font-['LT_Superior'] text-xl font-bold uppercase leading-none tracking-[3px] text-white transition-opacity hover:opacity-40 lg:block"
              >
                [Close]
              </button>
            </nav>

            <div className="relative z-10 rounded-none pb-5">
              <div className="flex flex-col rounded-none">
                {navLinks.map((link) => {
                  const href = link === "Home" ? "/" : `/${link.toLowerCase()}`;
                  const isActive =
                    pathname === href || (href !== "/" && pathname.startsWith(href));

                  return (
                    <div key={link} className="overflow-hidden rounded-none">
                      <button
                        type="button"
                        onMouseEnter={() => handleHoverPreview(href)}
                        onFocus={() => handleHoverPreview(href)}
                        onClick={() => handleNavigate(href)}
                        className={[
                          "group relative inline-flex cursor-pointer items-center overflow-hidden border-none bg-transparent p-0 text-left font-['LT_Superior'] font-bold uppercase leading-[0.9] transition-opacity",
                          "text-[clamp(2.25rem,min(11.5vw,12svh),7rem)]",
                          isActive
                            ? "pointer-events-none text-white/35"
                            : "text-white hover:opacity-75",
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

              {/* Bottom row: credit on the left, hint and CLOSE on the right */}
              <div className="mt-10 flex items-end justify-between gap-5 rounded-none border-t border-white/20 pt-3.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  © FABULLO / 2025
                </p>

                <div className="flex items-end gap-5">
                  <p className="hidden whitespace-nowrap text-right font-mono text-[10px] uppercase leading-none tracking-widest text-white/35 [@media(hover:hover)_and_(min-width:768px)]:block">
                    Press Escape to close. Enter opens the first search result.
                  </p>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="-m-3 shrink-0 cursor-pointer border-none bg-transparent p-3 font-['LT_Superior'] text-sm font-bold uppercase leading-none tracking-[2px] text-white transition-opacity hover:opacity-40 lg:hidden"
                  >
                    [Close]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
