"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMenu } from "@/components/context/MenuProvider";

const Header = () => {
  const { isOpen, setIsOpen } = useMenu();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // States to track hover on elements with inline style opacity
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      const footer = document.querySelector("footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;

      setIsMobileOrTablet(window.innerWidth < 1024);
      setIsPastHero(window.scrollY > window.innerHeight * 0.9);
      setIsFooterVisible(footerTop < window.innerHeight * 0.85);
    };

    updateHeader();

    window.addEventListener("resize", updateHeader);
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeader);
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  if (isOpen) return null;

  const showMGK = isPastHero && !isFooterVisible;
  const showMenu = (isMobileOrTablet || isPastHero) && !isFooterVisible;
  const showDesktopNav = !isMobileOrTablet && !isPastHero && !isFooterVisible;

  const readableText: React.CSSProperties = {
    color: "black",
  };

  return (
    <div
      role="banner"
      className={[
        "fixed flex items-center justify-between pointer-events-none z-[2147483647]",
        // 01. Mobile Min (320x640) - Pulled up with exact margins
        "top-[11px] left-[12px] right-[12px]",
        // 02. Mobile Std (390x844) - Pulled up with exact margins
        "min-[375px]:top-[11px] min-[375px]:left-[12px] min-[375px]:right-[12px]",
        // 03. Tablet Port (768x1024) - Pulled up to match top design line
        "md:top-[18px] md:left-[20px] md:right-[20px]",
        // 04. Tablet Land (1024x768) - Pulled up to match top design line
        "lg:top-[20px] lg:left-[20px] lg:right-[20px]",
        // 05. Desktop Base (1280x800) - Pulled up to match top design line
        "xl:top-[18px] xl:left-[20px] xl:right-[20px]",
        // 06. Original Widescreen (1440x794) - Pulled up to match top design line
        "min-[1440px]:top-[18px] min-[1440px]:left-[20px] min-[1440px]:right-[20px]"
      ].join(" ")}
    >
      <Link
        href="/"
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
        className={[
         "font-bold uppercase leading-none no-underline tracking-wide",
          // 01. Mobile Min (320x640) - Scaled up
          "text-[18px]",
          // 02. Mobile Std (390x844) - Scaled up
          "min-[375px]:text-[20px]",
          // 03. Tablet Port (768x1024) - Scaled up
          "md:text-[24px]",
          // 04. Tablet Land (1024x768) - Scaled up
          "lg:text-[26px]",
          // 05. Desktop Base (1280x800) - Your decided size
          "xl:text-[32px]",
          // 06. Original Widescreen (1440x794) - Your decided size
          "min-[1440px]:text-[32px]"
        ].join(" ")}
        style={{
          ...readableText,
          pointerEvents: showMGK ? "auto" : "none",
          opacity: showMGK ? (isLogoHovered ? 0.5 : 1) : 0,
          transform: showMGK ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 350ms ease, transform 350ms ease",
        }}
      >
        MGK
      </Link>

      <nav
        className={[
          "absolute left-1/2 flex items-center justify-center font-bold uppercase tracking-wider",
          // 01. Mobile Min (320x640) - Hidden
          // 02. Mobile Std (390x844) - Hidden
          // 03. Tablet Port (768x1024) - Hidden
          // 04. Tablet Land (1024x768) - Scaled down
          "lg:text-[10px] lg:gap-5 lg:h-10",
          // 05. Desktop Base (1280x800) - Scaled down
          "xl:text-[11px] xl:gap-6 xl:h-11",
          // 06. Original Widescreen (1440x794) - Standard size
          "min-[1440px]:text-xs min-[1440px]:gap-[24px] min-[1440px]:h-11"
        ].join(" ")}
        style={{
          transform: showDesktopNav
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-8px)",
          display: isMobileOrTablet ? "none" : "flex",
          opacity: showDesktopNav ? 1 : 0,
          pointerEvents: showDesktopNav ? "auto" : "none",
          transition: "opacity 350ms ease, transform 350ms ease",
        }}
      >
       <Link href="/projects" className="transition-opacity duration-300 hover:opacity-50" style={{ color: "black", textDecoration: "none" }}>
          Projects
        </Link>
        <Link href="/journal" className="transition-opacity duration-300 hover:opacity-50" style={{ color: "black", textDecoration: "none" }}>
          Journal
        </Link>
        <Link href="/profile" className="transition-opacity duration-300 hover:opacity-50" style={{ color: "black", textDecoration: "none" }}>
          Profile
        </Link>
        <Link href="/contact" className="transition-opacity duration-300 hover:opacity-50" style={{ color: "black", textDecoration: "none" }}>
          Contact
        </Link>
      </nav>

      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        className={[
          "border-0 p-0 m-0 bg-transparent cursor-pointer font-bold uppercase leading-none tracking-wider",
          // 01. Mobile Min (320x640) - Scaled up (was text-[10px])
          "text-[12px]",
          // 02. Mobile Std (390x844) - Scaled up (was text-[10px])
          "min-[375px]:text-[12px]",
          // 03. Tablet Port (768x1024) - Scaled up (was md:text-[11px])
          "md:text-[16px]",
          // 04. Tablet Land (1024x768) - Scaled up (was lg:text-[11px])
          "lg:text-[16px]",
          // 05. Desktop Base (1280x800) - Scaled up (was invalid xl:text-m)
          "xl:text-[18px]",
          // 06. Original Widescreen (1440x794) - Scaled up (was invalid min-[1440px]:text-m)
          "min-[1440px]:text-[18px]"
        ].join(" ")}
        style={{
          ...readableText,
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
