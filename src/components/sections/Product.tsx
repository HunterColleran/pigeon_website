"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SpecTable } from "@/components/ui/SpecTable";
import { ReservationForm } from "@/components/ui/ReservationForm";
import { InteractiveDotGrid } from "@/components/ui/InteractiveDotGrid";
import Image from "next/image";

export function Product() {
  return (
    <section id="reserve" className="dot-grid-light relative overflow-hidden bg-cloud">
      <InteractiveDotGrid light />

      <div className="relative z-10 px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
            {/* Left column — sketch + reserve CTA */}
            <div className="flex flex-col gap-12">
              <SectionReveal delay={0.15}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src="/pigeon-render.png"
                    alt="Pigeon smart pager — 3D render showing display, bumper buttons, and speaker grille"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                </div>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <div className="border-t border-shadow/[0.06] pt-8">
                  <p className="font-display text-xl font-bold text-shadow">
                    Reserve your spot.
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-asphalt/65">
                    We&rsquo;ll let you know when Pigeon is ready. The first 500
                    reservations get something fun in the mail on us.
                  </p>
                  <div className="mt-5">
                    <ReservationForm />
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Right column — title + subtitle + specs */}
            <div className="row-start-1 flex flex-col md:row-start-auto">
              <SectionLabel number="02" light />

              <SectionReveal>
                <div className="md:text-right">
                  <h2 className="font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.1] text-shadow">
                    Meet Pigeon.
                  </h2>
                  <div className="mt-3 h-px w-20 bg-signal-orange/40 md:ml-auto" />
                </div>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-asphalt/75 md:ml-auto md:text-right">
                  A bluetooth connected smart pager that filters notifications
                  and allows you to stay connected while leaving your phone
                  behind.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.25}>
                <div className="mt-12">
                  <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-asphalt/50">
                    Specifications
                  </p>
                  <SpecTable light />
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
