"use client";

import React, { useCallback, useEffect, useRef } from "react";

export interface PreviewSlide {
  title?: string;
  image: string;
  textLeft?: string;
  textRight?: string;
}

interface PreviewPanelVersion3Props {
  panelRef: React.RefObject<HTMLDivElement | null>;
  activeSlide: number;
  slides: PreviewSlide[];
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSetSlide: (index: number) => void; // kept for the parent; slides now change by swiping
  onClose: () => void;
}

// break-words + min-w-0 so long words never overflow or get clipped
const bodyText =
  "min-w-0 text-base md:text-sm font-semibold text-justify whitespace-pre-line break-words leading-relaxed";

// Room under the last block so the dots never cover any text
const bottomSafePadding = { paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" };

// Image columns stay pinned to the screen height on desktop while the
// text column scrolls, so images are never stretched, squashed or cut off.
const stickyImageCol =
  "relative overflow-hidden md:self-start md:sticky md:top-0 md:h-svh";

// Inline style so no global CSS (button { background: ... }) can ever give it a background
const noBg: React.CSSProperties = {
  background: "none",
  backgroundColor: "transparent",
  boxShadow: "none",
  border: 0,
};

const SWIPE_MIN_DISTANCE = 50; // px a finger/mouse must travel sideways
const WHEEL_MIN_DELTA = 20; // trackpad horizontal scroll threshold
const WHEEL_NEW_GESTURE_GAP = 150; // ms of silence that marks a new trackpad swipe

const PreviewPanelVersion3 = ({
  panelRef,
  activeSlide,
  slides,
  onPrevSlide,
  onNextSlide,
  onClose,
}: PreviewPanelVersion3Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheelAt = useRef(0);

  const goPrev = useCallback(() => {
    if (activeSlide > 0) onPrevSlide();
  }, [activeSlide, onPrevSlide]);

  const goNext = useCallback(() => {
    if (activeSlide < slides.length - 1) onNextSlide();
  }, [activeSlide, slides.length, onNextSlide]);

  useEffect(() => {
    // Notify Header that the preview panel is open
    window.dispatchEvent(new CustomEvent("journalPreview", { detail: true }));

    return () => {
      // Notify Header that the preview panel is closed
      window.dispatchEvent(new CustomEvent("journalPreview", { detail: false }));
    };
  }, []);

  // Start each slide at the top when the user moves to it
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeSlide]);

  // Keyboard: left / right arrows
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  // Swipe with a finger or a dragged mouse. Vertical scrolling is left to the
  // browser (touch-action: pan-y), so reading long text still works.
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx < 0) goNext(); // swipe left  -> next
    else goPrev(); //        swipe right -> previous
  };

  const handlePointerCancel = () => {
    pointerStart.current = null;
  };

  // Two-finger horizontal swipe on a trackpad / horizontal mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < WHEEL_MIN_DELTA) return;

    const now = Date.now();
    const isNewGesture = now - lastWheelAt.current > WHEEL_NEW_GESTURE_GAP;
    lastWheelAt.current = now; // inertia events keep extending the same gesture
    if (!isNewGesture) return;

    if (e.deltaX > 0) goNext();
    else goPrev();
  };

  return (
    // Outer box: the one the parent animates (panelRef). It never scrolls itself.
    // Everything inside is positioned against it (absolute, not fixed), so the
    // controls stay put even if a parent applies a transform during the animation.
    <div
      ref={panelRef}
      className="fixed inset-0 bg-white opacity-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2000 }}
    >
      {/* Scroll area: scrolls vertically, swipes horizontally between slides */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        data-lenis-prevent-touch
        data-lenis-prevent-wheel
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onWheel={handleWheel}
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain select-none"
        style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
      >
        {/* Slide 1: title */}
        {activeSlide === 0 && (
          <div className="flex flex-col md:grid md:grid-cols-[39.5%_1fr] md:min-h-svh">
            <div className={`${stickyImageCol} h-[65svh] bg-zinc-400`}>
              <img src={slides[0].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="min-w-0 px-5 pt-8 md:px-10 md:pt-16" style={bottomSafePadding}>
              <h3 className="text-2xl md:text-4xl font-bold leading-tight uppercase whitespace-pre-line break-words max-w-[720px]">
                {slides[0].title}
              </h3>
            </div>
          </div>
        )}

        {/* Slide 2: full-width image on top, two text blocks below */}
        {activeSlide === 1 && (
          <div className="flex flex-col md:min-h-svh">
            <div className="relative h-[50svh] md:h-[62svh] shrink-0 overflow-hidden">
              <img src={slides[1].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="min-w-0 flex flex-col gap-10 px-5 pt-8 md:flex-1 md:grid md:grid-cols-2 md:items-end md:gap-10 md:px-10 md:pt-8" style={bottomSafePadding}>
              <p className={`${bodyText} md:max-w-md`}>{slides[1].textLeft}</p>
              <p className={`${bodyText} md:max-w-md md:justify-self-end`}>{slides[1].textRight}</p>
            </div>
          </div>
        )}

        {/* Slide 3: text on the left, image on the right */}
        {activeSlide === 2 && (
          <div className="flex flex-col md:grid md:grid-cols-[1fr_59%] md:min-h-svh">
            <div className={`${stickyImageCol} h-[50svh] md:order-2`}>
              <img src={slides[2].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="min-w-0 flex flex-col gap-10 px-5 pt-8 md:order-1 md:justify-end md:px-10 md:pt-16" style={bottomSafePadding}>
              <p className={`${bodyText} md:max-w-sm`}>{slides[2].textLeft}</p>
              <p className={`${bodyText} md:max-w-sm`}>{slides[2].textRight}</p>
            </div>
          </div>
        )}
      </div>

      {/* Slide dots: indicator only, not clickable, no background so no text is ever covered */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-1 pt-3 pointer-events-none"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        aria-hidden="true"
      >
        {slides.map((_, index) => (
          <span
            key={index}
            className={`block h-1.5 rounded-full bg-zinc-400 transition-all ${
              activeSlide === index ? "w-7" : "w-1.5"
            }`}
          />
        ))}
      </div>

      {/* Close: text only, no background. Top right on phones, bottom right on desktop */}
      <button
        type="button"
        className="absolute right-5 top-4 md:top-auto md:right-8 md:bottom-8 z-30 -m-3 p-3 font-mono font-bold text-sm text-red-800 hover:text-black transition-colors outline-none appearance-none"
        style={noBg}
        onClick={onClose}
      >
        [ CLOSE ]
      </button>
    </div>
  );
};

export default PreviewPanelVersion3;
