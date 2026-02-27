"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ReservationForm } from "@/components/ui/ReservationForm";
import { InteractiveDotGrid } from "@/components/ui/InteractiveDotGrid";

export function Reservation() {
  return (
    <section id="reserve" className="dot-grid-light relative bg-cloud">
      <InteractiveDotGrid light />

      <div className="relative z-10 px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-2xl">
          <SectionLabel number="03" light />

          <SectionReveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-shadow">
              Reserve your spot.
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-asphalt/75">
              We&rsquo;ll let you know when Pigeon is ready. The first 500
              reservations get something fun in the mail.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="mt-10">
              <ReservationForm />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
