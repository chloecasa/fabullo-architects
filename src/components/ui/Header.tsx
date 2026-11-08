"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMenu } from "@/components/context/MenuProvider";

const Header = () => {
  const { isOpen, setIsOpen } = useMenu();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isJournalPreviewOpen, setIsJournalPreviewOpen] = useState(false);
  const [isOverHiddenSection, setIsOverHiddenSection] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      const footer = document.querySelector("footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;

      setIsMobileOrTablet(window.innerWidth < 1024);
      setIsPastHero(window.scrollY > window.innerHeight * 0.9);
      setIsFooterVisible(footerTop < window.innerHeight * 0.85);

      // Any section marked data-hide-header (e.g. the contact maps) hides the header
      // while it is under the header area at the top of the screen
      const headerZone = 90;
      const overHidden = Array.from(
        document.querySelectorAll("[data-hide-header]")
      ).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < headerZone && rect.bottom > 0;
      });
      setIsOverHiddenSection(overHidden);
    };

    updateHeader();
    window.addEventListener("resize", updateHeader);
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeader);
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  // The journal preview panel dispatches "journalPreview" (true on open, false on close)
  useEffect(() => {
    const onJournalPreview = (e: Event) => {
      setIsJournalPreviewOpen(Boolean((e as CustomEvent<boolean>).detail));
    };

    window.addEventListener("journalPreview", onJournalPreview);
    return () => window.removeEventListener("journalPreview", onJournalPreview);
  }, []);

  // Hide the header while the menu or the journal preview is open
  if (isOpen || isJournalPreviewOpen) return null;

  // Phones and tablets: logo always visible. Desktop: logo appears after scrolling past the hero.
  const hideHeader = isFooterVisible || isOverHiddenSection;
  const showMGK = !hideHeader && (isMobileOrTablet || isPastHero);
  const showMenu = (isMobileOrTablet || isPastHero) && !hideHeader;
  const showDesktopNav = !isMobileOrTablet && !isPastHero && !hideHeader;

  const linkClass =
    "text-black no-underline transition-opacity duration-300 hover:opacity-50";

  return (
    <div
      role="banner"
      className="pointer-events-none fixed inset-x-[12px] top-[11px] z-[2147483647] flex items-center justify-between md:inset-x-[20px] md:top-[18px] lg:top-[20px]"
    >
      <Link
        href="/"
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
        className="font-bold uppercase leading-none tracking-wide text-black no-underline text-[clamp(1.125rem,0.9rem+1vw,2rem)]"
        style={{
          pointerEvents: showMGK ? "auto" : "none",
          opacity: showMGK ? (isLogoHovered ? 0.5 : 1) : 0,
          transform: showMGK ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 350ms ease, transform 350ms ease",
        }}
      >
        FABULLO
      </Link>

      {/* Centred desktop nav. Do NOT add -translate-x-1/2 here: the inline transform already centres it. */}
      <nav
        className="absolute left-1/2 hidden items-center justify-center gap-[clamp(1.25rem,1rem+0.8vw,1.5rem)] font-bold uppercase tracking-wider text-[clamp(0.625rem,0.5rem+0.3vw,0.75rem)] lg:flex lg:h-10 xl:h-11"
        style={{
          transform: showDesktopNav
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-8px)",
          opacity: showDesktopNav ? 1 : 0,
          pointerEvents: showDesktopNav ? "auto" : "none",
          transition: "opacity 350ms ease, transform 350ms ease",
        }}
      >
        <Link href="/projects" className={linkClass}>Projects</Link>
        <Link href="/profile" className={linkClass}>Profile</Link>
        <Link href="/contact" className={linkClass}>Contact</Link>
      </nav>

      {/* MENU: larger text and a ~48px tap area on phones. -m-4 p-4 keeps its position unchanged. */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        className="pointer-events-auto -m-4 cursor-pointer border-0 bg-transparent p-4 font-bold uppercase leading-none tracking-wider text-black text-[clamp(1rem,0.9rem+0.5vw,1.25rem)]"
        style={{
          pointerEvents: showMenu ? "auto" : "none",
          opacity: showMenu ? (isMenuHovered ? 0.5 : 1) : 0,
          transform: showMenu ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 350ms ease, transform 350ms ease",
        }}
      >
        MENU
      </button>
    </div>
  );
};

export default Header;
