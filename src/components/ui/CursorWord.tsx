"use client";

import { useEffect, useState } from "react";

const CursorWord = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
const [label, setLabel] = useState("");
const [cursorColor, setCursorColor] = useState(""); // Stores 'black' or 'white'

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });

     const target = event.target as HTMLElement;
    const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;

    setLabel(cursorTarget?.dataset.cursor ?? "");
    setCursorColor(cursorTarget?.getAttribute("data-cursor-color") ?? "");
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!label) return null;

  return (
    <div
      className={`pointer-events-none fixed z-[9999] text-sm font-bold uppercase ${
        cursorColor === "black"
          ? "text-black"
          : cursorColor === "white"
          ? "text-white"
          : label === "[VIEW LOCAL PROJECT]" || label === "[ CLOSE ]"
          ? "text-white"
          : "text-black"
      }`}
      style={{
        left: position.x + 14,
        top: position.y + 14,
      }}
    >
      {label}
    </div>
  );
};

export default CursorWord;
