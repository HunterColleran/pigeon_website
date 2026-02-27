"use client";

import { useState, useEffect, useRef } from "react";
import { SPECS } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function AnimatedValue({
  value,
  animate,
}: {
  value: string;
  animate: boolean;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || hasAnimated.current || reduced) return;

    const match = value.match(/(\d+\.?\d*)/);
    if (!match) return;

    hasAnimated.current = true;
    const numStr = match[1];
    const target = parseFloat(numStr);
    const isFloat = numStr.includes(".");
    const start = performance.now();
    const duration = 1000;

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = eased * target;
      const formatted = isFloat
        ? current.toFixed(1)
        : Math.round(current).toString();
      setDisplay(value.replace(numStr, formatted));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [animate, value, reduced]);

  return <>{display}</>;
}

interface SpecTableProps {
  light?: boolean;
}

export function SpecTable({ light = false }: SpecTableProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className="flex flex-col">
      {SPECS.map(({ label, value }, i) => (
        <div
          key={label}
          className={`group flex items-baseline justify-between gap-6 py-3 font-mono transition-colors duration-200 ${
            i < SPECS.length - 1
              ? light
                ? "border-b border-shadow/[0.08]"
                : "border-b border-cloud/[0.05]"
              : ""
          }`}
        >
          <span
            className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${
              light
                ? "text-asphalt/55 group-hover:text-asphalt/70"
                : "text-concrete/35 group-hover:text-concrete/55"
            }`}
          >
            {label}
          </span>
          <span
            className={`text-[13px] transition-colors duration-200 group-hover:text-signal-orange/80 ${
              light ? "text-shadow/80" : "text-concrete/70"
            }`}
          >
            <AnimatedValue value={value} animate={inView} />
          </span>
        </div>
      ))}
    </div>
  );
}
