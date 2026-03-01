"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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


const SECTION_IDS = [
  "approach-01",
  "approach-02",
  "approach-03",
  "approach-04",
  "approach-05",
  "approach-06",
  "approach-07",
];

function SectionDotNav() {
  const [active, setActive] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          const idx = SECTION_IDS.indexOf(id);
          if (idx !== -1) setActive(idx);
        }
      },
      { threshold: [0, 0.25, 0.5], rootMargin: "-10% 0px -10% 0px" }
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    const el = document.getElementById(SECTION_IDS[idx]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      aria-label="Page sections"
    >
      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() => scrollTo(i)}
          className="group relative flex h-4 w-4 items-center justify-center"
          aria-label={`Section ${String(i + 1).padStart(2, "0")}`}
        >
          <span
            className={`block h-2 w-2 rounded-full transition-all duration-300 ${
              i === active
                ? "bg-signal-orange scale-125"
                : "bg-concrete/20 group-hover:bg-concrete/50"
            }`}
          />
          <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded bg-shadow/90 px-2 py-1 font-mono text-[10px] tracking-[0.15em] text-concrete/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {String(i + 1).padStart(2, "0")}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function ApproachContent() {
  const reduced = useReducedMotion();

  return (
    <>
      <Header />
      <ScrollProgress />
      <SectionDotNav />
      <main>
        {/* Hero */}
        <section id="approach-01" className="relative h-[70vh] min-h-[480px] overflow-hidden bg-shadow">
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
        <section id="approach-02" className="bg-shadow px-6 py-28 md:px-12 md:py-40">
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
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#c4a882] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
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
        <section id="approach-03" className="bg-shadow">
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
        <section id="approach-04" className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            {/* Why a Modern Pager */}
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
              <FadeIn>
                <Image
                  src="/approach/motorola-pager.png"
                  alt="Motorola Advisor pager displaying a message"
                  width={400}
                  height={400}
                  className="max-w-[400px] w-full object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
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
                <div className="relative aspect-[4/3] max-w-[480px] overflow-hidden rounded-xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.15),0_8px_24px_-8px_rgba(0,0,0,0.1)] md:ml-auto">
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
        <section id="approach-05" className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-20">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
                  <Image
                    src="/approach/inspiration-sketch.png"
                    alt="Pigeon concept sketch showing isometric view of the device with mode buttons and speaker grille"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                </div>

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
              </div>
            </FadeIn>

          </div>
        </section>

        {/* The Product — concept sketches + app */}
        <section id="approach-06" className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
              <FadeIn>
                <div>
                  <SectionNumber n="06" light />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                    Designed with intent.
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-asphalt/75">
                    Pigeon&rsquo;s mechanical and electrical components were
                    designed in house. The device is optimized for bluetooth
                    range, speed and battery life.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-asphalt/75">
                    We want you to leave the device out on your desk or the
                    table. Every component was built intentionally for your
                    enjoyment and fidgetability.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <Image
                  src="/approach/2d-sketches.png"
                  alt="Pigeon 2D dimensioned sketches showing front and back views with component layout and MagSafe ring"
                  width={600}
                  height={800}
                  className="w-full rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </FadeIn>
            </div>

          </div>
        </section>


        {/* The Team */}
        <section id="approach-07" className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionNumber n="07" />
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                The team behind Pigeon.
              </h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.9] text-concrete/60">
                A small team building something we believe in.
              </p>
            </FadeIn>
            <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-16">
              <FadeIn delay={0.1}>
                <div>
                  <div className="mb-5 h-28 w-28 overflow-hidden rounded-full">
                    <Image
                      src="/approach/team-hunter.png"
                      alt="Hunter Colleran"
                      width={224}
                      height={224}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <p className="font-display text-lg font-bold text-cloud/90">Hunter Colleran</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-signal-orange/60">
                    CEO, Hardware &amp; Engineering
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.9] text-concrete/60">
                    Leads electrical engineering, firmware, software, and business operations. Obsessed with building things that respect people&rsquo;s time.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div>
                  <div className="mb-5 h-28 w-28 overflow-hidden rounded-full">
                    <Image
                      src="/approach/team-grant.png"
                      alt="Grant Taylor"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="font-display text-lg font-bold text-cloud/90">Grant Taylor</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-signal-orange/60">
                    Cofounder, Industrial Design &amp; Brand
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.9] text-concrete/60">
                    Owns mechanical design, enclosure specs, CMF, and brand identity. Makes sure Pigeon feels as good as it works.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div>
                  <div className="mb-5 h-28 w-28 overflow-hidden rounded-full">
                    <Image
                      src="/approach/team-jack.png"
                      alt="Jack Dimond"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="font-display text-lg font-bold text-cloud/90">Jack Dimond</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-signal-orange/60">
                    Design, Storytelling &amp; Animation
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.9] text-concrete/60">
                    Shapes the story behind Pigeon through design, writing, and animation. Turns ideas into something people feel.
                  </p>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.4}>
              <p className="mt-20 font-mono text-[11px] tracking-[0.15em] uppercase text-concrete/30">
                Built in Phoenix, AZ.
              </p>
            </FadeIn>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
