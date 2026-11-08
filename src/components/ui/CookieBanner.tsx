"use client";
import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage blocked (e.g. some private modes): show the banner anyway
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem("cookie-consent", value);
    } catch {
      // Ignore: the banner will just reappear on next visit
    }
    setIsVisible(false);
    if (value === "accepted") {
      window.dispatchEvent(new Event("cookie-consent-updated"));
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 w-full z-50 bg-black text-white border-t border-white px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-10 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none"
    >
      {/* Description */}
      <div className="max-w-3xl">
        <p className="text-sm font-medium leading-snug">
          We use minimalist performance cookies to analyze project traffic and optimize your portfolio experience. By accepting, you consent to our use of these analytics. Read our{" "}
          <a href="/privacy" className="underline hover:opacity-70 active:opacity-70">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline hover:opacity-70 active:opacity-70">
            Terms & Conditions
          </a>{" "}
          for more information.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
        <button
          onClick={() => saveConsent("declined")}
          className="min-h-11 border border-white bg-transparent text-white px-5 py-2 text-xs font-bold uppercase hover:opacity-70 active:opacity-70 cursor-pointer"
        >
          Decline
        </button>
        <button
          onClick={() => saveConsent("accepted")}
          className="min-h-11 bg-white text-black border border-white px-6 py-2 text-xs font-bold uppercase hover:opacity-70 active:opacity-70 cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
