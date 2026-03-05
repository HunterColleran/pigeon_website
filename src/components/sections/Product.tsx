"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { SpecTable } from "@/components/ui/SpecTable";
import { ReservationForm } from "@/components/ui/ReservationForm";
import Image from "next/image";

export function Product() {
  return (
    <section id="reserve" className="dot-grid-light relative overflow-hidden bg-cloud">
      <div className="relative z-10">
        {/* Title + Full-width product hero */}
        <SectionReveal>
          <h2 className="pt-20 text-center font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] text-shadow md:pt-32">
            The Pigeon
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative mx-auto aspect-[3/2] w-full max-w-2xl">
              <Image
                src="/pigeon-render.png"
                alt="Pigeon smart pager — 3D render showing display, bumper buttons, and speaker grille"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 640px"
                priority
              />
            </div>
          </div>
        </SectionReveal>

        {/* Product info — two columns */}
        <div className="px-6 pb-20 md:px-12 md:pb-32">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-start md:gap-16">
              {/* Left — subtitle, price, form */}
              <div>
                <SectionReveal delay={0.15}>
                  <p className="max-w-md text-[14px] leading-relaxed text-asphalt/70">
                    A bluetooth connected smart pager that filters notifications
                    and allows you to stay connected while leaving your phone
                    behind.
                  </p>
                </SectionReveal>

                <SectionReveal delay={0.15}>
                  <div className="mt-8">
                    <div className="flex items-baseline gap-3">
                      <p className="font-display text-[clamp(1.2rem,2vw,1.5rem)] font-bold text-asphalt/40 line-through">
                        $129
                      </p>
                      <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-shadow">
                        Free Reservation
                      </p>
                    </div>
                  </div>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                  <div className="mt-8 max-w-md">
                    <p className="mb-3 text-[14px] leading-relaxed text-asphalt/55">
                      Reserve your Pigeon and be part of the first batch.
                    </p>
                    <ReservationForm />
                  </div>
                </SectionReveal>
              </div>

              {/* Right — specs (always visible) */}
              <div>
                <SectionReveal delay={0.25}>
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-asphalt/50">
                    Specifications
                  </p>
                  <SpecTable light compact />
                </SectionReveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
