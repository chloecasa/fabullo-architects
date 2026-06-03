// src/components/ui/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useMenu } from "@/components/context/MenuProvider";

const Header = () => {
  const { setIsOpen } = useMenu();

  return (
    <>
      {/* Phone + Tablet Header */}
      <header className="mobileTabletHeader">
        <button
          type="button"
          className="mobileTabletButton"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <span className="mobileTabletLines">
            <span />
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      {/* Desktop Header */}
      <header className="desktopHeader">
        <nav className="desktopNav">
          <Link href="/projects">Projects</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <style jsx>{`
        .mobileTabletHeader {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2147483647;
          width: 40px;
          height: 40px;
          display: block;
          pointer-events: auto;
        }

        .mobileTabletButton {
          position: relative;
          width: 40px;
          height: 40px;
          overflow: hidden;
          background: white;
          border: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;
        }

        .mobileTabletLines {
          position: absolute;
          left: 6px;
          top: 11px;
          display: inline-flex;
          width: 28px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 6px;
        }

        .mobileTabletLines span {
          width: 100%;
          height: 0;
          outline: 1px solid #8a8a8a;
          outline-offset: -0.5px;
        }

        .desktopHeader {
          position: fixed;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2147483647;
          display: none;
          pointer-events: auto;
        }

        .desktopNav {
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: center;
          width: 360px;
          height: 44px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (min-width: 1024px) {
          .mobileTabletHeader {
            display: none;
          }

          .desktopHeader {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
