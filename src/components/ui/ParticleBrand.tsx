"use client";

import React, { useEffect, useRef } from "react";

interface ParticleBrandProps {
  spanRef: React.RefObject<HTMLSpanElement | null>;
  text: string;
}

interface Tile {
  hx: number; // home position (css px, canvas space)
  hy: number;
  x: number; // current position
  y: number;
  vx: number;
  vy: number;
  sx: number; // source rectangle in the glyph canvas (device px)
  sy: number;
  sw: number;
  sh: number;
  spin: number; // rotation direction and strength
}

const SPRING = 0.075; // pull back toward home
const FRICTION = 0.82; // how quickly motion dies down
const PUSH = 0.9; // strength of the pointer push

export default function ParticleBrand({ spanRef, text }: ParticleBrandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    const canvas = canvasRef.current;
    if (!span || !canvas) return;

    // Keep the static word for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let glyphs: HTMLCanvasElement | null = null;
    let tiles: Tile[] = [];
    let dpr = 1;
    let fontPx = 16;
    let pad = 0; // space around the word so overshooting glyphs are not clipped
    let tile = 1; // tile size in device px
    let cell = 1; // tile size in css px
    let raf = 0;
    let running = false;
    let hovering = false;
    let pointer = { x: -9999, y: -9999 };
    let resizeTimer: number | undefined;

    const build = () => {
      const cs = getComputedStyle(span);
      fontPx = parseFloat(cs.fontSize) || 16;
      const w = span.offsetWidth;
      const h = span.offsetHeight;
      if (!w || !h) return false;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      pad = Math.ceil(fontPx * 0.3);
      const cssW = w + pad * 2;
      const cssH = h + pad * 2;

      tile = Math.max(1, Math.round((fontPx / 60) * dpr));
      cell = tile / dpr;

      const devW = Math.round(cssW * dpr);
      const devH = Math.round(cssH * dpr);

      canvas.width = devW;
      canvas.height = devH;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.style.left = `${-pad}px`;
      canvas.style.top = `${-pad}px`;

      // Draw the word once, offscreen, with the same font and spacing as the DOM text
      const g0 = document.createElement("canvas");
      g0.width = devW;
      g0.height = devH;
      const g = g0.getContext("2d", { willReadFrequently: true });
      if (!g) return false;

      g.scale(dpr, dpr);
      g.font = `${cs.fontWeight} ${fontPx}px ${cs.fontFamily}`;
      (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
      g.fillStyle = "#ffffff";
      g.textBaseline = "alphabetic";

      // Place the baseline the same way the browser places it inside the line box
      const m = g.measureText(text);
      const asc = m.fontBoundingBoxAscent;
      const desc = m.fontBoundingBoxDescent;
      const baseline = pad + (h - (asc + desc)) / 2 + asc;
      g.fillText(text, pad, baseline);
      glyphs = g0;

      // Cut the word into a grid of tiles. Keep any tile that contains any ink.
      const data = g.getImageData(0, 0, devW, devH).data;
      tiles = [];
      for (let y = 0; y < devH; y += tile) {
        for (let x = 0; x < devW; x += tile) {
          const cw = Math.min(tile, devW - x);
          const ch = Math.min(tile, devH - y);
          let ink = false;
          for (let yy = y; yy < y + ch && !ink; yy++) {
            const row = yy * devW * 4;
            for (let xx = x; xx < x + cw; xx++) {
              if (data[row + xx * 4 + 3] > 0) {
                ink = true;
                break;
              }
            }
          }
          if (!ink) continue;

          const hx = x / dpr;
          const hy = y / dpr;
          tiles.push({
            hx, hy, x: hx, y: hy, vx: 0, vy: 0,
            sx: x, sy: y, sw: cw, sh: ch,
            spin: Math.random() * 2 - 1,
          });
        }
      }

      canvas.style.opacity = "1";
      return tiles.length > 0;
    };

    const draw = () => {
      if (!glyphs) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const t of tiles) {
        const cw = t.sw / dpr;
        const ch = t.sh / dpr;
        const disp = Math.hypot(t.x - t.hx, t.y - t.hy);

        // k is 0 at rest and 1 when clearly displaced
        const k = Math.min(1, disp / (cell * 2.5));

        if (k === 0) {
          ctx.drawImage(glyphs, t.sx, t.sy, t.sw, t.sh, t.hx, t.hy, cw, ch);
          continue;
        }

        // Displaced tiles shrink slightly (gaps open) and turn a little
        const shrink = 1 - k * 0.22;
        const w = cw * shrink;
        const h = ch * shrink;

        ctx.save();
        ctx.translate(t.x + cw / 2, t.y + ch / 2);
        ctx.rotate(k * t.spin * 0.35);
        ctx.drawImage(glyphs, t.sx, t.sy, t.sw, t.sh, -w / 2, -h / 2, w, h);
        ctx.restore();
      }
    };

    const frame = () => {
      const reach = fontPx * 0.4;
      let moving = false;

      for (const t of tiles) {
        if (hovering) {
          const cx = t.x + cell / 2;
          const cy = t.y + cell / 2;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 0.001) {
            const f = 1 - d / reach;
            const push = f * f * PUSH;
            t.vx += (dx / d) * push;
            t.vy += (dy / d) * push;
          }
        }

        t.vx += (t.hx - t.x) * SPRING;
        t.vy += (t.hy - t.y) * SPRING;
        t.vx *= FRICTION;
        t.vy *= FRICTION;
        t.x += t.vx;
        t.y += t.vy;

        const energy =
          Math.abs(t.vx) + Math.abs(t.vy) + Math.abs(t.x - t.hx) + Math.abs(t.y - t.hy);
        if (energy > 0.02) moving = true;
      }

      draw();

      if (moving || hovering) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const rebuild = () => {
      cancelAnimationFrame(raf);
      running = false;
      const ok = build();
      if (ok) {
        // Hide the DOM word, the canvas draws it now
        span.style.color = "transparent";
        draw();
      } else {
        span.style.color = "";
      }
    };

    // Pointer position in canvas space. Undo any GSAP scale on the span.
    const toCanvas = (e: PointerEvent) => {
      const r = span.getBoundingClientRect();
      const sx = r.width ? span.offsetWidth / r.width : 1;
      const sy = r.height ? span.offsetHeight / r.height : 1;
      return {
        x: (e.clientX - r.left) * sx + pad,
        y: (e.clientY - r.top) * sy + pad,
      };
    };

    const onEnter = (e: PointerEvent) => {
      hovering = true;
      pointer = toCanvas(e);
      kick();
    };
    const onMove = (e: PointerEvent) => {
      pointer = toCanvas(e);
    };
    const onLeave = () => {
      hovering = false;
      pointer = { x: -9999, y: -9999 };
      kick();
    };

    span.addEventListener("pointerenter", onEnter);
    span.addEventListener("pointermove", onMove);
    span.addEventListener("pointerleave", onLeave);

    document.fonts?.ready.then(() => {
      if (!cancelled) rebuild();
    });

    // Rebuild when the word changes size (the footer's fit script, or a window resize)
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!cancelled) rebuild();
      }, 150);
    });
    ro.observe(span);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      span.removeEventListener("pointerenter", onEnter);
      span.removeEventListener("pointermove", onMove);
      span.removeEventListener("pointerleave", onLeave);
      span.style.color = "";
    };
  }, [spanRef, text]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ opacity: 0 }}
    />
  );
}
