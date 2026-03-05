"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { motion } from "framer-motion";
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
        {/* ── 01 · Hero — stark, minimal, full-bleed image ── */}
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

        {/* ── 02 · Separation — bordered card manifesto with background image ── */}
        <section id="approach-02" className="relative overflow-hidden bg-shadow">
          <Image
            src="/approach/concept-sketches.png"
            alt="Pigeon concept sketches showing multiple views with annotations"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-shadow/60 via-transparent to-shadow/60" />
          <div className="relative z-10 h-[3px] w-full bg-signal-orange" />
          <div className="px-6 py-28 md:px-12 md:py-40">
            <div className="mx-auto max-w-6xl">
              <div className="border border-cloud/[0.08] bg-shadow/90 px-8 py-12 backdrop-blur-sm shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6),0_8px_24px_-8px_rgba(0,0,0,0.4)] md:px-14 md:py-16">
                <FadeIn>
                  <SectionNumber n="01" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                    Leave your phone behind.
                  </h2>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
                    <div className="flex flex-col gap-4 text-[14px] leading-[1.9] text-concrete/60">
                      <p>
                        Instead of replacing your phone or installing software that locks it down or makes it worse, we&rsquo;re building a single-purpose device that let&rsquo;s you leave your phone behind while staying connected.
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

        {/* ── 04 · Pager + MagSafe — large centered showcase ── */}
        <section id="approach-03" className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            {/* Why a Modern Pager — centered image hero with text below */}
            <FadeIn>
              <div className="flex flex-col items-center text-center">
                <SectionNumber n="02" light />
                <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.15] text-shadow">
                  Why a pager?
                </h2>
                <p className="mt-4 max-w-lg text-[14px] leading-[1.9] text-asphalt/65">
                  A modern pager was a natural form factor for a companion device.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-14 grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
                <div className="mx-auto max-w-[360px]">
                  <Image
                    src="/approach/motorola-pager.png"
                    alt="Motorola Advisor pager displaying a message"
                    width={400}
                    height={400}
                    className="w-full object-contain"
                    sizes="360px"
                  />
                </div>
                <p className="text-[14px] leading-[1.9] text-asphalt/75">
                  Pagers are still relied on today by first responders and healthcare workers because they deliver
                  what&rsquo;s urgent without distraction. A modern, bluetooth-connected pager
                  builds on that idea &mdash; a single-purpose device for
                  time-sensitive messages, and notifications that truly
                  require your attention.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Inspiration — full-bleed background image with overlaid text ── */}
        <section id="approach-04" className="relative min-h-[70vh] overflow-hidden bg-shadow">
          <Image
            src="/approach/inspiration-sketch.png"
            alt="Pigeon concept sketch showing isometric view of the device with mode buttons and speaker grille"
            fill
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-shadow via-shadow/80 to-transparent" />
          <div className="relative z-10 flex min-h-[70vh] items-center px-6 py-28 md:px-12 md:py-40">
            <div className="mx-auto w-full max-w-6xl">
              <FadeIn>
                <div className="max-w-xl">
                  <SectionNumber n="03" />
                  <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.15] text-cloud/90">
                    Inspiration
                  </h2>
                  <p className="mt-8 text-[15px] leading-[2] text-concrete/65">
                    Pigeon draws from both modern premium hardware and the
                    retro-futurism of the late 20th century &mdash; devices
                    designed with texture, usefulness, and optimism.
                  </p>
                  <p className="mt-5 text-[15px] leading-[2] text-concrete/65">
                    We are building hardware people want to
                    hold and look at, with materials and form that stand apart
                    from the smooth, featureless slabs we carry today.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── MagSafe — narrow asymmetric layout ── */}
        <section id="approach-05" className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-[2fr_3fr] md:items-center md:gap-16">
              <FadeIn>
                <div>
                  <SectionNumber n="04" />
                  <h2 className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-[1.2] text-cloud/90">
                    Why MagSafe?
                  </h2>
                  <p className="mt-5 text-[14px] leading-[1.9] text-concrete/60">
                    MagSafe lets us design a compact,
                    pocketable device that fits naturally into existing habits.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-concrete/60">
                    Most of the time, the Pigeon sits snug on the back of your phone, and when it&rsquo;s time to be focused or present, you detach the Pigeon and leave your phone behind.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.15),0_8px_24px_-8px_rgba(0,0,0,0.1)]">
                  <Image
                    src="/concept-sketch-alt.png"
                    alt="Pigeon concept sketch showing MagSafe ring on the back of the device"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Designed with Intent — blueprint / technical drawing feel ── */}
        <section id="approach-06" className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionNumber n="05" light />
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.15] text-shadow">
                Designed with intent.
              </h2>
            </FadeIn>
            <div className="mt-14 grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-16">
              <FadeIn delay={0.15}>
                <div className="border border-shadow/[0.06] p-4 md:p-6">
                  <Image
                    src="/approach/2d-sketches.png"
                    alt="Pigeon 2D dimensioned sketches showing front and back views with component layout and MagSafe ring"
                    width={600}
                    height={800}
                    className="w-full"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col gap-8">
                  <div className="border-t border-shadow/[0.08] pt-5">
                    <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-asphalt/40">
                      Engineering
                    </p>
                    <p className="text-[14px] leading-[1.9] text-asphalt/75">
                      Mechanical and electrical components designed in house. Optimized for bluetooth range, speed and battery life.
                    </p>
                  </div>
                  <div className="border-t border-shadow/[0.08] pt-5">
                    <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-asphalt/40">
                      Form Factor
                    </p>
                    <p className="text-[14px] leading-[1.9] text-asphalt/75">
                      54 &times; 89 &times; 9.5mm. Under 50 grams. Designed to sit on your desk, live in your pocket, or snap to the back of your phone.
                    </p>
                  </div>
                  <div className="border-t border-shadow/[0.08] pt-5">
                    <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-asphalt/40">
                      Intention
                    </p>
                    <p className="text-[14px] leading-[1.9] text-asphalt/75">
                      Every component built intentionally for your enjoyment and fidgetability. Hardware you want to pick up.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── 07 · The Team — staggered offset cards ── */}
        <section id="approach-07" className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionNumber n="06" />
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                The team behind Pigeon.
              </h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.9] text-concrete/60">
                A small team building something we believe in.
              </p>
            </FadeIn>
            <div className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-3 md:gap-x-16">
              <FadeIn delay={0.1}>
                <div className="border-t border-cloud/[0.08] pt-8">
                  <div className="mb-6 h-32 w-32 overflow-hidden rounded-2xl">
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
                  <p className="mt-4 text-[14px] leading-[1.9] text-concrete/60">
                    Owns mechanical design, enclosure specs, CMF, and brand identity. Makes sure Pigeon feels as good as it works.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="border-t border-cloud/[0.08] pt-8">
                  <div className="mb-6 h-32 w-32 overflow-hidden rounded-2xl">
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
                    Cofounder, Hardware &amp; Engineering
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-concrete/60">
                    Leads electrical engineering, firmware, software, and business operations. Obsessed with building things that respect people&rsquo;s time.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="border-t border-cloud/[0.08] pt-8">
                  <div className="mb-6 h-32 w-32 overflow-hidden rounded-2xl">
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
                  <p className="mt-4 text-[14px] leading-[1.9] text-concrete/60">
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
