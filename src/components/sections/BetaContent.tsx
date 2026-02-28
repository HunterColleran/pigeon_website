"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InteractiveDotGrid } from "@/components/ui/InteractiveDotGrid";
import { BetaApplicationForm } from "@/components/ui/BetaApplicationForm";

export function BetaContent() {
  const reduced = useReducedMotion();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="dot-grid relative flex h-[50vh] min-h-[360px] items-end overflow-hidden bg-shadow">
          <InteractiveDotGrid />
          <div className="absolute inset-0 bg-gradient-to-t from-shadow via-shadow/60 to-transparent" />
          <div className="relative z-10 w-full px-6 pb-16 md:px-12 md:pb-20">
            <motion.div
              className="mx-auto max-w-3xl"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
            >
              <p className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-orange">
                Beta Program
              </p>
              <h1 className="max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] text-cloud">
                Help us build Pigeon.
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-concrete/60">
                We&rsquo;re looking for people who want to test early prototypes
                and shape what Pigeon becomes. Apply below.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Orange divider */}
        <div className="h-[3px] w-full bg-signal-orange" />

        {/* Form section */}
        <section className="bg-shadow px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-3xl">
            <BetaApplicationForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
