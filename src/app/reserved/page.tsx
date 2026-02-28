import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "You're Reserved",
  description: "Your Pigeon reservation is confirmed.",
};

export default async function ReservedPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const { n } = await searchParams;
  const number = n ? parseInt(n, 10) : null;

  return (
    <>
      <Header />
      <main className="dot-grid-light flex min-h-dvh flex-col items-center justify-center bg-cloud px-6 text-center">
        {number && !isNaN(number) ? (
          <div className="flex flex-col items-center gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asphalt/40">
              Reservation confirmed
            </p>
            <p className="font-display text-6xl font-bold text-shadow md:text-8xl">
              #{number.toLocaleString()}
            </p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-asphalt/60">
              Your spot is saved. We&rsquo;ll reach out when Pigeon is ready.
            </p>
            <div className="mt-4 flex gap-6 font-mono text-[10px] tracking-[0.15em] uppercase">
              <Link
                href="/letter"
                className="text-signal-orange transition-colors duration-300 hover:text-signal-orange/70"
              >
                Read our letter &rarr;
              </Link>
              <Link
                href="/"
                className="text-asphalt/40 transition-colors duration-300 hover:text-shadow"
              >
                Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <p className="font-display text-3xl font-bold text-shadow">
              Reserve your spot.
            </p>
            <Link
              href="/#reserve"
              className="font-mono text-[10px] tracking-[0.15em] uppercase text-signal-orange transition-colors duration-300 hover:text-signal-orange/70"
            >
              Go to reservation &rarr;
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
