"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CountUp } from "@/components/ui/CountUp";
import Link from "next/link";

type State =
  | { step: "form" }
  | { step: "transmitting" }
  | { step: "done"; reservationNumber: number; isNew: boolean };

function SignalWaves() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-8 w-8 rounded-full border border-signal-orange/30"
            animate={{
              scale: [1, 5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.45,
              ease: "easeOut",
            }}
          />
        ))}
        <motion.div
          className="relative h-2.5 w-2.5 rounded-full bg-signal-orange"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

const cornerBase =
  "absolute h-3 w-3 border-signal-orange/0 transition-all duration-300 group-focus-within:border-signal-orange/60";

export function ReservationForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ step: "form" });
  const [error, setError] = useState("");
  const reduced = useReducedMotion();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setState({ step: "transmitting" });

    try {
      const [res] = await Promise.all([
        fetch("/api/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
        new Promise((r) => setTimeout(r, 1500)),
      ]);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      const data = await res.json();
      setState({
        step: "done",
        reservationNumber: data.reservationNumber,
        isNew: data.isNew,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState({ step: "form" });
    }
  }

  const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative min-h-[140px]">
      <AnimatePresence mode="wait">
        {state.step === "form" && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={transition}
          >
            <div className="group relative">
              {/* Animated focus corners */}
              <div className="pointer-events-none absolute -inset-2">
                <div
                  className={`${cornerBase} left-0 top-0 border-l-2 border-t-2`}
                />
                <div
                  className={`${cornerBase} right-0 top-0 border-r-2 border-t-2`}
                />
                <div
                  className={`${cornerBase} bottom-0 left-0 border-b-2 border-l-2`}
                />
                <div
                  className={`${cornerBase} bottom-0 right-0 border-b-2 border-r-2`}
                />
              </div>

              <div className="flex items-stretch border border-shadow/12 transition-colors duration-300 focus-within:border-signal-orange/50">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-mono text-sm text-shadow placeholder:text-asphalt/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="cursor-pointer border-l border-shadow/12 bg-signal-orange px-6 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase text-cloud transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
                >
                  Reserve &rarr;
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-2 font-mono text-[11px] text-signal-orange">
                {error}
              </p>
            )}
          </motion.form>
        )}

        {state.step === "transmitting" && (
          <motion.div
            key="transmitting"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.9 }}
            transition={transition}
          >
            <SignalWaves />
          </motion.div>
        )}

        {state.step === "done" && (
          <motion.div
            key="done"
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asphalt/40">
              Reservation confirmed
            </p>
            <p className="font-display text-5xl font-bold text-shadow md:text-6xl">
              #<CountUp target={state.reservationNumber} />
            </p>
            {!state.isNew && (
              <p className="font-mono text-[11px] text-asphalt/50">
                Already reserved &mdash; here&rsquo;s your spot.
              </p>
            )}
            <Link
              href="/letter"
              className="mt-3 font-mono text-[11px] tracking-[0.15em] text-signal-orange transition-colors duration-300 hover:text-signal-orange/70"
            >
              Read our letter &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
