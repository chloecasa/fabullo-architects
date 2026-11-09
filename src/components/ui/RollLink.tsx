import Link from "next/link";
import React from "react";

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

interface RollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

// Hover: the text slides up out of its box and a copy slides in from below.
// Both copies are the same text, so the swap looks like one continuous movement.
export default function RollLink({ href, children, className = "" }: RollLinkProps) {
  const inner = (
    <span className="relative inline-flex overflow-hidden leading-[1.1]">
      <span
        className={`block transition-transform duration-500 ${EASE} group-hover:-translate-y-full`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 block translate-y-full transition-transform duration-500 ${EASE} group-hover:translate-y-0`}
      >
        {children}
      </span>
    </span>
  );

  const base = `group no-underline ${className}`;

  if (href.startsWith("mailto:") || href.startsWith("http")) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={base}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={base}>
      {inner}
    </Link>
  );
}
