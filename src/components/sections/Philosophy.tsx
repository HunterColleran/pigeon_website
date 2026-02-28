"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";


export function Philosophy() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.2);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      };

  return (
    <section className="relative overflow-hidden bg-shadow">
      {/* Full-bleed orange divider */}
      <div className="h-[3px] w-full bg-signal-orange" />

      <div className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Inset card — floating */}
          <div className="border border-cloud/[0.08] px-8 py-12 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6),0_8px_24px_-8px_rgba(0,0,0,0.4)] md:px-14 md:py-16 md:-mx-8 md:rotate-[-0.4deg]">
            <div
              ref={ref}
              className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-20"
            >
              {/* Left — heading */}
              <motion.p
                className="max-w-xl font-display text-[clamp(1.5rem,3.5vw,2.6rem)] font-bold leading-[1.25] text-cloud/90"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                The internet used to be a destination. It was a place to
                connect and be curious.
              </motion.p>

              {/* Right — body */}
              <motion.div
                variants={container}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="flex flex-col gap-5 text-[14px] leading-[1.9] text-concrete/75"
              >
                <motion.p variants={item}>
                  Now it&rsquo;s impossible to log off. Technology demands more
                  and more of us every day. It&rsquo;s built to keep us engaged
                  and monetize every second of our lives.
                </motion.p>
                <motion.p
                  variants={item}
                  className="border-l-2 border-signal-orange/50 pl-4 font-medium text-cloud/85"
                >
                  Pigeon was made to redefine our relationship with technology
                  and create a future built for us, not them.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
