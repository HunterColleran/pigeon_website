"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InteractiveDotGridProps {
  light?: boolean;
}

export function InteractiveDotGrid({ light = false }: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const SPACING = 24;
    const BASE_R = 1;
    const INFLUENCE = 160;
    const PEAK = light ? 0.22 : 0.32;
    const RGB = light ? "15,17,19" : "242,243,244";

    function draw() {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      const { x: mx, y: my } = mouseRef.current;
      if (mx < -500) return;

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
      const rect = parent!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      draw();
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
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
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, light]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
