"use client";

import React from "react";

export interface PreviewSlide {
  title?: string;
  image: string;
  smallImage?: string;
  textLeft?: string;
  textMiddle?: string;
  textRight?: string;
}

interface PreviewPanelVersion1Props {
  panelRef: React.RefObject<HTMLDivElement | null>;
  activeSlide: number;
  slides: PreviewSlide[];
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSetSlide: (index: number) => void;
  onClose: () => void;
}

const PreviewPanelVersion1 = ({
  panelRef,
  activeSlide,
  slides,
  onPrevSlide,
  onNextSlide,
  onSetSlide,
  onClose,
}: PreviewPanelVersion1Props) => {
  return (
    <div
  ref={panelRef}
      className="fixed inset-0 bg-amber-50 opacity-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2000 }}
    >
      {activeSlide === 0 && (
        <div className="relative w-full h-full">
          <div className="absolute left-0 top-0 h-full w-[39.5vw] overflow-hidden">
            <img src={slides[0].image} alt="" className="w-full h-full object-cover" />
          </div>

          <h3 className="absolute left-[41vw] top-5 text-4xl font-bold leading-none uppercase max-w-[520px]">
            {slides[0].title}
          </h3>
        </div>
      )}

      {activeSlide === 1 && (
        <div className="relative w-full h-full">
          <div className="absolute right-0 top-0 h-full w-[49vw] overflow-hidden">
            <img src={slides[1].image} alt="" className="w-full h-full object-cover" />
          </div>

          <p className="absolute left-5 top-[18vh] w-96 text-sm font-semibold text-justify whitespace-pre-line">
            {slides[1].textLeft}
          </p>

          <p className="absolute left-[31vw] bottom-[18vh] w-72 text-sm font-semibold text-justify whitespace-pre-line">
            {slides[1].textRight}
          </p>
        </div>
      )}

      {activeSlide === 2 && (
        <div className="relative w-full h-full">
          <div className="absolute left-0 top-0 h-full w-[39.5vw] overflow-hidden">
            <img src={slides[2].image} alt="" className="w-full h-full object-cover" />
          </div>

          <p className="absolute left-[41vw] bottom-[14vh] w-72 text-sm font-semibold text-justify whitespace-pre-line">
            {slides[2].textLeft}
          </p>

          <p className="absolute right-[12vw] top-[27vh] w-72 text-sm font-semibold text-justify whitespace-pre-line">
            {slides[2].textRight}
          </p>

          <div className="absolute right-[4vw] bottom-0 w-96 h-[65vh] overflow-hidden">
            <img src={slides[2].smallImage} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {activeSlide > 0 && (
  <button
    type="button"
    onClick={onPrevSlide}
    className="absolute left-0 top-0 h-full w-1/2 z-10 cursor-w-resize"
    aria-label="Previous slide"
  />
)}

    {activeSlide < slides.length - 1 && (
  <button
    type="button"
    onClick={onNextSlide}
    className="absolute right-0 top-0 h-full w-1/2 z-10 cursor-e-resize"
    aria-label="Next slide"
  />
)}

      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSetSlide(index)}
            className={`h-1.5 rounded-full bg-zinc-400 transition-all ${
              activeSlide === index ? "w-7" : "w-1.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

     

      <button
        type="button"
        className="absolute right-8 bottom-8 font-mono font-bold text-red-800 hover:text-black transition-colors z-20"
        onClick={onClose}
      >
        [ CLOSE ]
      </button>
 </div>
  );
};

export default PreviewPanelVersion1;
