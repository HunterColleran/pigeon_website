"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

interface ConceptSketchCardProps {
  light?: boolean;
}

export function ConceptSketchCard({ light = false }: ConceptSketchCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`group relative h-[280px] w-full cursor-pointer border transition-colors duration-500 [perspective:1000px] hover:border-signal-orange/25 sm:h-[360px] ${
          light ? "border-shadow/[0.08]" : "border-cloud/[0.06]"
        }`}
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped(!flipped);
          }
        }}
        aria-label="Click to flip concept sketch"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {/* Front */}
          <div
            className={`absolute inset-0 overflow-hidden [backface-visibility:hidden] ${
              light ? "bg-cloud" : "bg-shadow/50"
            }`}
          >
            <Image
              src="/concept-sketch.png"
              alt="Pigeon concept sketch — front view"
              fill
              className="object-contain p-8"
              sizes="(max-width: 640px) 100vw, 500px"
            />
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] ${
              light ? "bg-cloud" : "bg-shadow/50"
            }`}
          >
            <Image
              src="/concept-sketch-alt.png"
              alt="Pigeon concept sketch — alternate view"
              fill
              className="object-contain p-8"
              sizes="(max-width: 640px) 100vw, 500px"
            />
          </div>
        </motion.div>
      </div>

      <div
        className={`flex items-center justify-between font-mono text-[10px] tracking-[0.15em] ${
          light ? "text-asphalt/50" : "text-concrete/30"
        }`}
      >
        <span>Built to be glanced at.</span>
        <span className={light ? "text-asphalt/35" : "text-concrete/20"}>
          Click to flip
        </span>
      </div>
    </div>
  );
}
