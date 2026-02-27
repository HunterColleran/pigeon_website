"use client";

import { motion, useScroll } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      className="fixed right-0 top-0 z-50 h-dvh w-[2px] origin-top bg-signal-orange/70"
      style={{ scaleY: scrollYProgress }}
    />
  );
}
