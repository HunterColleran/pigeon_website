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

const INSPO_IMAGES = [
  { src: "/approach/device-braun-recorder.png", label: "Braun T3 Pocket Radio" },
  { src: "/approach/device-sony-walkman.png", label: "Sony Walkman" },
  { src: "/approach/device-gameboy.png", label: "Nintendo Game Boy" },
  { src: "/approach/device-rabbit-r1.png", label: "Rabbit R1" },
  { src: "/approach/device-ipod.png", label: "Apple iPod" },
  { src: "/approach/device-blackberry.png", label: "BlackBerry" },
  { src: "/approach/device-psone.png", label: "Sony PSone" },
  { src: "/approach/device-macro-keypad.png", label: "Macro Keypad" },
  { src: "/approach/device-tp7.png", label: "Teenage Engineering TP-7" },
  { src: "/approach/device-kodak-instamatic.png", label: "Kodak Instamatic" },
];

function InspoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const rafRef = useRef<number>(0);
  const dragOffset = useRef(0);
  const dragDecay = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function tick() {
      if (!el) return;
      // Always scroll ambiently
      el.scrollLeft += 0.5;
      // Apply drag offset that decays back to 0
      if (Math.abs(dragDecay.current) > 0.5) {
        el.scrollLeft += dragDecay.current * 0.08;
        dragDecay.current *= 0.95;
      } else {
        dragDecay.current = 0;
      }
      // Loop
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      if (el.scrollLeft < 0) {
        el.scrollLeft = el.scrollWidth / 2;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = scrollRef.current?.scrollLeft || 0;
    dragOffset.current = 0;
    dragDecay.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - startX.current;
    dragOffset.current = -dx;
    scrollRef.current.scrollLeft = scrollStart.current - dx * 0.3;
  }

  function onPointerUp() {
    if (isDragging.current) {
      dragDecay.current = dragOffset.current * 0.3;
    }
    isDragging.current = false;
  }

  return (
    <div className="relative mt-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-shadow to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-shadow to-transparent" />
      <div
        ref={scrollRef}
        className="flex cursor-grab gap-6 overflow-hidden active:cursor-grabbing"
        style={{ scrollbarWidth: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {[...INSPO_IMAGES, ...INSPO_IMAGES].map((img, i) => (
          <div
            key={`${img.label}-${i}`}
            className="flex-none select-none"
          >
            <div className="relative h-[200px] w-[200px] overflow-hidden rounded-xl md:h-[260px] md:w-[260px]">
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="pointer-events-none object-cover"
                sizes="260px"
              />
            </div>
            <p className="mt-2 font-mono text-[9px] tracking-[0.15em] uppercase text-concrete/30">
              {img.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StickyPhoto({
  children,
  className = "",
  baseRotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  baseRotate?: number;
}) {
  const [wiggling, setWiggling] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={constraintsRef} className={className}>
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
        whileTap={{ scale: 1.03 }}
        onTap={() => {
          setWiggling(true);
          setTimeout(() => setWiggling(false), 500);
        }}
        animate={
          wiggling
            ? {
                rotate: [baseRotate, baseRotate + 3, baseRotate - 3, baseRotate + 1.5, baseRotate],
              }
            : { rotate: baseRotate }
        }
        transition={
          wiggling
            ? { duration: 0.5, ease: "easeInOut" }
            : { type: "spring", stiffness: 300, damping: 20 }
        }
        className="cursor-grab active:cursor-grabbing"
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="mb-6 block font-mono text-[10px] tracking-[0.25em] uppercase text-signal-orange">
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
        {/* ── 01 · Our Approach — typographic hero with text-clip image ── */}
        <section id="approach-01" className="relative overflow-hidden bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionNumber n="01" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-[clamp(4rem,10vw,10rem)] font-bold leading-[0.95] tracking-tight text-signal-orange">
                Our
                <br />
                Approach
              </h1>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-16">
                <p className="max-w-lg text-[14px] leading-[1.9] text-concrete/60">
                  Instead of replacing your phone or installing software that locks it down or makes it worse, we&rsquo;re building a single-purpose device that let&rsquo;s you leave your phone behind while staying connected.
                </p>
                <p className="max-w-lg text-[14px] leading-[1.9] text-concrete/60">
                  The Pigeon quietly filters the noise, hardware creates a clear
                  boundary, and your attention stays where it belongs
                  &mdash; with your work, your people, and your life.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="h-[3px] w-full bg-signal-orange" />

        {/* ── Designed with Intent ── */}
        <section id="approach-02" className="relative bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="relative mx-auto max-w-6xl" style={{ minHeight: "clamp(500px, 55vw, 700px)" }}>
            {/* Center text — absolute centered */}
            <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
              <FadeIn>
                <div className="pointer-events-auto rounded-2xl bg-cloud/80 px-10 py-8 text-center shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] ring-1 ring-shadow/[0.06] backdrop-blur-md">
                  <SectionNumber n="02" />
                  <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.15] text-shadow">
                    Designed with intent, by us.
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-center text-[14px] leading-[1.9] text-asphalt/75">
                    Pigeon&rsquo;s electrical, mechanical, and firmware components were designed entirely in house.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Image 1 — 2D sketches, top-left */}
            <StickyPhoto
              className="absolute left-0 top-0 z-10 w-[28%]"
              baseRotate={-3}
            >
              <Image
                src="/approach/2d-sketches.png"
                alt="Pigeon 2D dimensioned sketches showing front and back views with component layout and MagSafe ring"
                width={600}
                height={800}
                className="pointer-events-none w-full rounded-xl shadow-[0_16px_60px_-12px_rgba(0,0,0,0.18)]"
                sizes="(max-width: 768px) 28vw, 200px"
              />
            </StickyPhoto>

            {/* Image 2 — inspiration sketch, top-right */}
            <StickyPhoto
              className="absolute right-[2%] top-[2%] z-20 w-[30%]"
              baseRotate={2.5}
            >
              <Image
                src="/approach/inspiration-sketch.png"
                alt="Pigeon concept sketch showing isometric view of the device with mode buttons and speaker grille"
                width={480}
                height={360}
                className="pointer-events-none aspect-[4/3] w-full rounded-xl object-cover shadow-[0_20px_70px_-12px_rgba(0,0,0,0.2)]"
                sizes="(max-width: 768px) 28vw, 220px"
              />
            </StickyPhoto>

            {/* Image 3 — MagSafe concept, bottom-right */}
            <StickyPhoto
              className="absolute bottom-[2%] right-[5%] z-30 w-[28%]"
              baseRotate={2}
            >
              <Image
                src="/concept-sketch-alt.png"
                alt="Pigeon concept sketch showing MagSafe ring on the back of the device"
                width={480}
                height={360}
                className="pointer-events-none aspect-[4/3] w-full rounded-xl object-cover shadow-[0_20px_70px_-12px_rgba(0,0,0,0.2)]"
                sizes="(max-width: 768px) 28vw, 200px"
              />
            </StickyPhoto>

            {/* Image 4 — concept sketches, bottom-left */}
            <StickyPhoto
              className="absolute bottom-[0%] left-[3%] z-30 w-[30%]"
              baseRotate={-1.5}
            >
              <Image
                src="/approach/concept-sketches.png"
                alt="Pigeon concept sketches showing multiple views with annotations"
                width={480}
                height={360}
                className="pointer-events-none aspect-[4/3] w-full rounded-xl object-cover shadow-[0_20px_70px_-12px_rgba(0,0,0,0.2)]"
                sizes="(max-width: 768px) 28vw, 220px"
              />
            </StickyPhoto>

            {/* Fact labels — positioned in clear gaps */}
            <StickyPhoto className="absolute left-[22%] top-[-30px] z-50" baseRotate={0}>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-shadow/70">
                MagSafe compatible.
              </p>
            </StickyPhoto>

            <StickyPhoto className="absolute right-[0%] top-[42%] z-50 text-right" baseRotate={0}>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-shadow/70">
                Compact &amp; pocketable.
              </p>
            </StickyPhoto>

            <StickyPhoto className="absolute left-[calc(3%-80px)] bottom-[calc(28%+70px)] z-50" baseRotate={0}>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-shadow/70">
                Designed to be fidgetable.
              </p>
            </StickyPhoto>

            <StickyPhoto className="absolute bottom-[calc(2%-50px)] right-[calc(28%-100px)] z-50" baseRotate={0}>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-shadow/70">
                Optimized for battery life<br />
                &amp; bluetooth range.
              </p>
            </StickyPhoto>
          </div>
        </section>

        {/* ── Inspiration — full-bleed background image with overlaid text ── */}
        <section id="approach-03" className="relative min-h-[70vh] overflow-hidden bg-shadow">
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
              <InspoCarousel />
            </div>
          </div>
        </section>

        {/* ── Pager — messy collage showcase ── */}
        <section id="approach-04" className="relative bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="flex flex-col items-center text-center">
                <SectionNumber n="04" />
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

        {/* ── 07 · The Team — staggered offset cards ── */}
        <section id="approach-05" className="bg-shadow px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionNumber n="05" />

              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-cloud/90">
                The team behind Pigeon.
              </h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.9] text-concrete/60">
                We build tools that help people step away from screens and return their attention to the world around them.
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
