"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SectionLabelProps {
  number: string;
  light?: boolean;
}

export function SectionLabel({ number, light = false }: SectionLabelProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="mb-10 flex items-center gap-3 md:mb-14">
      <motion.div
        className={`h-px w-10 origin-left md:w-16 ${
          light ? "bg-shadow/20" : "bg-concrete/18"
        }`}
        initial={reduced ? false : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <span
        className={`font-mono text-[10px] tracking-[0.25em] ${
          light ? "text-asphalt/55" : "text-concrete/30"
        }`}
      >
        {number}
      </span>
    </div>
  );
}
