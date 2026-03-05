"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GlobalDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lightRef = useRef(false);
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const SPACING = 24;
    const BASE_R = 1;
    const INFLUENCE = 160;

    function draw() {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      const { x: mx, y: my } = mouseRef.current;
      if (mx < -500) return;

      const light = lightRef.current;
      const PEAK = light ? 0.22 : 0.32;
      const RGB = light ? "15,17,19" : "242,243,244";

      const sC = Math.max(0, Math.floor((mx - INFLUENCE) / SPACING));
      const eC = Math.ceil((mx + INFLUENCE) / SPACING);
      const sR = Math.max(0, Math.floor((my - INFLUENCE) / SPACING));
      const eR = Math.ceil((my + INFLUENCE) / SPACING);

      for (let r = sR; r <= eR; r++) {
        for (let c = sC; c <= eC; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          const d = Math.hypot(x - mx, y - my);
          if (d > INFLUENCE) continue;

          const t = 1 - d / INFLUENCE;
          const radius = (BASE_R + t * 0.8) * dpr;
          const opacity = PEAK * t * t;

          ctx.beginPath();
          ctx.arc(x * dpr, y * dpr, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${RGB},${opacity})`;
          ctx.fill();
        }
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      draw();
    }

    function detectLight(e: MouseEvent) {
      // Temporarily hide canvas so elementFromPoint sees through it
      canvas!.style.pointerEvents = "none";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const section = el.closest("[data-dot-light], .bg-cloud, .dot-grid-light");
        lightRef.current = !!section;
      }
    }

    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      detectLight(e);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }

    function onLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
