"use client";

import Image from "next/image";
import Link from "next/link";
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

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="mb-6 block font-mono text-[10px] tracking-[0.25em] uppercase text-concrete/30">
      {n}
    </span>
  );
}

const inspoImages = [
  { src: "/approach/inspo-braun.png", alt: "Braun digital clock" },
  { src: "/approach/inspo-walkman.png", alt: "Sony Walkman" },
  { src: "/approach/inspo-gameboy.png", alt: "Nintendo Game Boy" },
  { src: "/approach/inspo-psone.png", alt: "Sony PS One" },
  { src: "/approach/inspo-imac.png", alt: "Apple iMac G3" },
  { src: "/approach/inspo-magsafe.png", alt: "MagSafe accessory" },
];

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
            <motion.div
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
            <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20">
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
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src="/approach/why-now.png"
                    alt="People walking across a crosswalk, all looking at their phones"
                    fill
                    className="object-cover"
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
                        is better screen management &mdash; it&rsquo;s
                        separation. Instead of asking people to rely on
                        willpower inside systems designed to capture attention,
                        we&rsquo;re building a modern, single-purpose device
                        that delivers only what truly matters.
                      </p>
                      <p className="font-mono text-[13px] tracking-[0.02em] text-concrete/70">
                        No feeds. No infinite scroll. No pressure to check one
                        more thing.
                      </p>
                    </div>
                    <p className="text-[14px] leading-[1.9] text-concrete/60">
                      AI quietly filters the noise, hardware creates a clear
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
                  <SectionNumber n="03" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                    Why a modern pager?
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-asphalt/75">
                    Phones are incredible &mdash; but they were designed to
                    capture and keep attention. Every alert competes equally,
                    pulling us out of conversations, sleep, focus, and the world
                    around us.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-asphalt/75">
                    Pagers are still relied on today because they deliver
                    what&rsquo;s urgent without distraction. A modern pager
                    builds on that idea: a single-purpose device for
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
                  <SectionNumber n="04" />
                  <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                    Why MagSafe?
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.9] text-asphalt/75">
                    MagSafe is already part of how people use their phones. It
                    powers wireless charging, holds wallets, mounts tripods,
                    props up stands, and snaps into car holders and power banks.
                    People understand the interaction &mdash; it&rsquo;s quick,
                    intuitive, and trusted.
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-asphalt/75">
                    That familiarity matters. It allows us to design a compact,
                    pocketable device that fits naturally into existing habits,
                    without asking people to learn a new system or carry
                    something awkward.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative aspect-square max-w-[400px] overflow-hidden md:ml-auto">
                  <Image
                    src="/approach/inspo-magsafe.png"
                    alt="Orange MagSafe compatible device"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
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
                    This is not nostalgia, but contrast: hardware people want to
                    hold and look at, with materials and form that stand apart
                    from the smooth, featureless slabs we carry today.
                  </p>
                </div>

                {/* Mood board grid */}
                <div className="grid grid-cols-3 gap-2">
                  {inspoImages.map((img, i) => (
                    <FadeIn key={img.src} delay={i * 0.08}>
                      <div className="relative aspect-square overflow-hidden bg-char">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-contain p-3 transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 33vw, 200px"
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* City image */}
            <FadeIn>
              <div className="relative mt-20 aspect-[2.4/1] overflow-hidden">
                <Image
                  src="/approach/inspiration-city.png"
                  alt="Pigeons on a wire with the Empire State Building in the background"
                  fill
                  className="object-cover opacity-70"
                  sizes="100vw"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* The Product — concept sketches + app */}
        <section className="bg-cloud px-6 py-28 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <SectionNumber n="06" />
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-[1.2] text-shadow">
                Designed with intent.
              </h2>
              <p className="mt-6 max-w-2xl text-[14px] leading-[1.9] text-asphalt/75">
                Pigeon has a companion app for users to connect and personalize
                their device. The device has four modes that filter
                notifications differently &mdash; while priority contacts can
                always reach you, no matter the mode.
              </p>
              <p className="mt-4 max-w-2xl border-l-2 border-signal-orange/50 pl-4 text-[14px] font-medium leading-[1.9] text-shadow/85">
                We want people to spend as little time in our app as possible
                &mdash; but when they&rsquo;re here, every interaction will feel
                designed and delightful.
              </p>
            </FadeIn>

            {/* App screenshots */}
            <FadeIn>
              <div className="relative mt-16 aspect-[16/9] overflow-hidden rounded-sm bg-shadow">
                <Image
                  src="/approach/app-screens.png"
                  alt="Pigeon companion app showing modes, priority contacts, and customization screens"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </FadeIn>

            {/* Concept sketches + Schematic side by side */}
            <div className="mt-20 grid gap-8 md:grid-cols-2 md:gap-12">
              <FadeIn>
                <div>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-asphalt/50">
                    Industrial design
                  </p>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#c4a882]">
                    <Image
                      src="/approach/concept-sketches.png"
                      alt="Pigeon concept sketches showing multiple views with annotations"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-asphalt/50">
                    Hardware engineering
                  </p>
                  <div className="relative aspect-[16/9] overflow-hidden bg-cloud">
                    <Image
                      src="/approach/schematic.png"
                      alt="Pigeon Smart Pager KiCad schematic — Visual Feedback subsystem"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative overflow-hidden bg-shadow px-6 py-28 md:px-12 md:py-40">
          <Image
            src="/approach/look-up.jpeg"
            alt="Looking up at buildings from the street"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-cloud">
                Look up.
              </h2>
              <p className="mt-6 text-[14px] leading-[1.9] text-concrete/60">
                Technology should serve people, not the other way around.
                We&rsquo;re building the tools to make that possible.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/#reserve"
                  className="bg-signal-orange px-8 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase text-cloud transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
                >
                  Reserve your spot &rarr;
                </Link>
                <Link
                  href="/letter"
                  className="font-mono text-[11px] tracking-[0.15em] text-concrete/50 transition-colors duration-300 hover:text-signal-orange"
                >
                  Read our letter &rarr;
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
