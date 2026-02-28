"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";

import { SpecTable } from "@/components/ui/SpecTable";
import { ReservationForm } from "@/components/ui/ReservationForm";
import { InteractiveDotGrid } from "@/components/ui/InteractiveDotGrid";
import Image from "next/image";

export function Product() {
  return (
    <section id="reserve" className="dot-grid-light relative overflow-hidden bg-cloud">
      <InteractiveDotGrid light />

      <div className="relative z-10 px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-12">
            {/* Left column — render + reserve CTA */}
            <div className="flex flex-col gap-6">
              <SectionReveal delay={0.15}>
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src="/pigeon-render.png"
                    alt="Pigeon smart pager — 3D render showing display, bumper buttons, and speaker grille"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <div className="border-t border-shadow/[0.06] pt-6">
                  <p className="font-display text-lg font-bold text-shadow">
                    Reserve your spot.
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-asphalt/65">
                    We&rsquo;ll let you know when Pigeon is ready. The first 500
                    reservations get something fun in the mail on us.
                  </p>
                  <div className="mt-4">
                    <ReservationForm />
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Right column — title + subtitle + compact specs */}
            <div className="row-start-1 flex flex-col md:row-start-auto">
              <SectionReveal>
                <div className="md:text-right">
                  <h2 className="font-display text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold leading-[1.1] text-shadow">
                    Meet Pigeon.
                  </h2>
                  <div className="mt-2 h-px w-16 bg-signal-orange/40 md:ml-auto" />
                </div>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-asphalt/75 md:ml-auto md:text-right">
                  A bluetooth connected smart pager that filters notifications
                  and allows you to stay connected while leaving your phone
                  behind.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.25}>
                <div className="mt-8">
                  <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.25em] text-asphalt/50">
                    Specifications
                  </p>
                  <SpecTable light compact />
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
