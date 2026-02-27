"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { InteractiveDotGrid } from "@/components/ui/InteractiveDotGrid";
import Image from "next/image";

export function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 40, damping: 15 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const lookX = useTransform(smoothX, [0, 1], [-3, 3]);
  const lookY = useTransform(smoothY, [0, 1], [-2, 2]);
  const upX = useTransform(smoothX, [0, 1], [-5, 5]);
  const upY = useTransform(smoothY, [0, 1], [-3, 3]);

  function handleMouseMove(e: React.MouseEvent) {
    if (reduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  const slide = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
          transition: {
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1] as const,
            delay,
          },
        };

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8, delay },
        };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="dot-grid relative min-h-dvh overflow-hidden bg-shadow"
    >
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        className="object-cover opacity-[0.15]"
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <InteractiveDotGrid />

      <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-8 pt-24 md:px-12 md:pb-12">
        {/* Title — vertically centered, left-aligned */}
        <div className="flex flex-1 items-center">
          <div className="flex flex-col">
            <motion.div style={reduced ? {} : { x: lookX, y: lookY }}>
              <motion.span
                {...slide(0.3)}
                className="block font-display text-[clamp(4rem,17vw,14rem)] font-extrabold leading-[0.88] tracking-tight text-cloud"
              >
                LOOK
              </motion.span>
            </motion.div>
            <motion.div style={reduced ? {} : { x: upX, y: upY }}>
              <motion.span
                {...slide(0.55)}
                className="block font-display text-[clamp(4rem,17vw,14rem)] font-extrabold leading-[0.88] tracking-tight text-cloud"
              >
                UP
                <motion.span
                  {...fade(1.0)}
                  className="inline-block text-signal-orange"
                >
                  .
                </motion.span>
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar — description left, CTA right */}
        <motion.div
          {...fade(1.3)}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-[280px] text-[13px] leading-relaxed text-concrete/55">
            Technology has failed us. It&rsquo;s time to take back our time
            and attention.
          </p>
          <Button
            onClick={() =>
              document
                .getElementById("reserve")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Reserve your spot &rarr;
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
