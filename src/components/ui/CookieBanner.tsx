"use client";
import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or declined cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay on load for animation smoothness
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    // Initialize your Vercel Web Analytics or Google Analytics scripts here [26]
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[var(--bg-base)] border-t border-[var(--text-primary)] z-50 px-[20px] py-[25px] md:px-[40px] md:py-[20px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-transform duration-500 ease-out select-none">
      {/* Description */}
      <div className="max-w-3xl">
        <p className="text-xs md:text-sm font-medium leading-tight">
          We use minimalist performance cookies to analyze project traffic and optimize your portfolio experience. By accepting, you consent to our use of these analytics. Read our{" "}
          <a href="/privacy" className="underline hover:opacity-50 transition-opacity duration-300">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline hover:opacity-50 transition-opacity duration-300">
            Terms & Conditions
          </a>{" "}
          for more information.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
        <button
          onClick={handleDecline}
          className="rounded-none border border-[var(--text-primary)] px-5 py-2 text-xs font-bold uppercase transition-opacity duration-300 hover:opacity-50 cursor-pointer"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="rounded-none bg-[var(--text-primary)] text-[var(--bg-base)] border border-[var(--text-primary)] px-6 py-2 text-xs font-bold uppercase transition-opacity duration-300 hover:opacity-50 cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
