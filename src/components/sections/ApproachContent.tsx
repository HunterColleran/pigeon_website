"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.15);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionNumber({ n, light = false }: { n: string; light?: boolean }) {
  return (
    <span className={`mb-6 block font-mono text-[10px] tracking-[0.25em] uppercase ${light ? "text-asphalt/40" : "text-concrete/30"}`}>
      {n}
    </span>
  );
}

const inspoImages = [
  { src: "/approach/device-sony-walkman.png", alt: "Sony Walkman" },
  { src: "/approach/device-gameboy.png", alt: "Nintendo Game Boy" },
  { src: "/approach/device-braun-recorder.png", alt: "Braun Recorder" },
  { src: "/approach/device-psone.png", alt: "Sony PS One" },
  { src: "/approach/device-imac-g3.png", alt: "Apple iMac G3" },
  { src: "/approach/device-braun-clock.png", alt: "Braun Digital Clock" },
  { src: "/approach/device-blackberry.png", alt: "BlackBerry 6210" },
  { src: "/approach/device-ipod.png", alt: "Apple iPod" },
  { src: "/approach/device-kodak-instamatic.png", alt: "Kodak Instamatic 100" },
  { src: "/approach/device-rabbit-r1.png", alt: "Rabbit R1" },
  { src: "/approach/device-rabbit-r1-angle.png", alt: "Rabbit R1" },
  { src: "/approach/device-rabbit-r1-back.png", alt: "Rabbit R1" },
  { src: "/approach/device-tape-dispenser.png", alt: "Tape Dispenser" },
  { src: "/approach/device-macro-keypad.png", alt: "Macro Keypad" },
  { src: "/approach/device-tp7.png", alt: "Teenage Engineering TP-7" },
];

function InspoCarousel() {
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % inspoImages.length);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [reduced, next]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cloud">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={reduced ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={inspoImages[current].src}
            alt={inspoImages[current].alt}
            fill
            className="object-contain p-8"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </motion.div>
      </AnimatePresence>

      {/* Caption + dots */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 pb-4">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-asphalt/50">
          {inspoImages[current].alt}
        </p>
        <div className="flex gap-1.5">
          {inspoImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Show ${inspoImages[i].alt}`}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "bg-signal-orange"
                  : "bg-asphalt/20 hover:bg-asphalt/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ApproachContent() {
  const reduced = useReducedMotion();

  return (
    <>
      <Header />
      <ScrollProgress />
      <main>
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-shadow">
          <Image
            src="/approach/hero-pigeons.png"
            alt="Pigeons perched on a wire above a New York City intersection"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-shadow via-shadow/40 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-12 md:pb-24">
            <motion.div className="mx-auto w-full max-w-6xl"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <p className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-orange">
                Pigeon Group
              </p>
              <h1 className="max-w-3xl font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1.05] text-cloud">
                Our Approach
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-concrete/60">
                We build tools that help people step away from screens and
                return their attention to the world around them.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Now */}
        <section className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
              <FadeIn>
                <div>
                  <SectionNumber n="01" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                    Why now?
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-concrete/60">
                    Modern technology is optimized to capture and retain our
                    attention. Our time is being monetized through endless feeds,
                    notifications, and systems designed to keep us engaged.
                  </p>
                  <p className="mt-4 border-l-2 border-signal-orange/50 pl-4 text-[14px] font-medium leading-[1.9] text-cloud/85">
                    Pigeon exists to rewrite our relationship with technology by
                    building tools that respect attention, reduce digital noise,
                    and help people return to the real world.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#c4a882]">
                  <Image
                    src="/approach/concept-sketches.png"
                    alt="Pigeon concept sketches showing multiple views with annotations"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="bg-shadow">
          <div className="h-[3px] w-full bg-signal-orange" />
          <div className="px-6 py-28 md:px-12 md:py-40">
            <div className="mx-auto max-w-6xl">
              <div className="border border-cloud/[0.08] px-8 py-12 md:px-14 md:py-16">
                <FadeIn>
                  <SectionNumber n="02" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                    Separation, not management.
                  </h2>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
                    <div className="flex flex-col gap-4 text-[14px] leading-[1.9] text-concrete/60">
                      <p>
                        We don&rsquo;t believe the solution to screen addiction
                        is better screen management. Instead of asking people to rely on
                        willpower inside systems designed to capture attention,
                        we&rsquo;re building a modern, single-purpose device
                        that let&rsquo;s you leave your phone behind.
                      </p>
                      <p className="font-mono text-[13px] tracking-[0.02em] text-concrete/70">
                        No feeds. No infinite scroll. No pressure to check one
                        more thing.
                      </p>
                    </div>
                    <p className="text-[14px] leading-[1.9] text-concrete/60">
                      The Pigeon quietly filters the noise, hardware creates a clear
                      boundary, and your attention stays where it belongs
                      &mdash; with your work, your people, and your life.
                    </p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Why a Modern Pager + Why MagSafe — light section */}
        <section className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            {/* Why a Modern Pager */}
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
              <FadeIn>
                <div className="relative aspect-square max-w-[400px] overflow-hidden">
                  <Image
                    src="/approach/motorola-pager.png"
                    alt="Motorola Advisor pager displaying a message"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div>
                  <SectionNumber n="03" light />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                    Why a modern pager?
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-asphalt/75">
                    We aren&rsquo;t ready to replace our phones, despite their harm they provide immense convenience. A modern pager was a natural form factor for a companion device to your main phone.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-asphalt/75">
                    Pagers are still relied on today because they deliver
                    what&rsquo;s urgent without distraction. A modern pager
                    builds on that idea, a single-purpose device for
                    time-sensitive messages, loved ones, and moments that truly
                    require your attention.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Divider */}
            <div className="my-28 h-px w-full bg-shadow/[0.06] md:my-40" />

            {/* Why MagSafe */}
            <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20">
              <FadeIn>
                <div>
                  <SectionNumber n="04" light />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                    Why MagSafe?
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-asphalt/75">
                    MagSafe is already part of how people use their phones. It
                    powers wireless charging, holds wallets, mounts tripods,
                    props up stands, and snaps into car holders and power banks.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-asphalt/75">
                    It allows us to design a compact,
                    pocketable device that fits naturally into existing habits,
                    without asking people to wear or carry something new.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative aspect-[4/3] max-w-[480px] overflow-hidden md:ml-auto">
                  <Image
                    src="/concept-sketch-alt.png"
                    alt="Pigeon concept sketch showing MagSafe ring on the back of the device"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Inspiration — dark section */}
        <section className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-start md:gap-20">
                <div>
                  <SectionNumber n="05" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                    Inspiration
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-concrete/60">
                    Pigeon draws from both modern premium hardware and the
                    retro-futurism of the late 20th century &mdash; devices
                    designed with texture, usefulness, and optimism.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-concrete/60">
                    We are building hardware people want to
                    hold and look at, with materials and form that stand apart
                    from the smooth, featureless slabs we carry today.
                  </p>
                </div>

                {/* Ambient carousel */}
                <InspoCarousel />
              </div>
            </FadeIn>

          </div>
        </section>

        {/* The Product — concept sketches + app */}
        <section className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
              <FadeIn>
                <div>
                  <SectionNumber n="06" light />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                    Designed with intent.
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-asphalt/75">
                    Pigeon has a companion app for users to connect and personalize
                    their device. The device has four modes that filter
                    notifications differently &mdash; while priority contacts can
                    always reach you, no matter the mode.
                  </p>
                  <p className="mt-4 border-l-2 border-signal-orange/50 pl-4 text-[14px] font-medium leading-[1.9] text-shadow/85">
                    We want people to spend as little time in our app as possible
                    &mdash; but when they&rsquo;re here, every interaction will feel
                    designed and delightful.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-shadow">
                  <Image
                    src="/approach/app-screens.png"
                    alt="Pigeon companion app showing modes, priority contacts, and customization screens"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            </div>

          </div>
        </section>

        {/* Designed for Utility */}
        <section className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20">
              <FadeIn>
                <div>
                  <SectionNumber n="07" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                    Designed for utility.
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-concrete/60">
                    Pigeon&rsquo;s mechanical and electrical components were
                    designed in house. The device is optimized for bluetooth
                    range, speed and battery life.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-concrete/60">
                    We want you to leave the device out on your desk or the
                    table. Every component was built intentionally for your
                    enjoyment and fidgetability.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="relative aspect-[16/9] overflow-hidden bg-cloud">
                  <Image
                    src="/approach/schematic.png"
                    alt="Pigeon Smart Pager KiCad schematic — Visual Feedback subsystem"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
