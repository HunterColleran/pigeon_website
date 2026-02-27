import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LetterContent } from "@/components/sections/LetterContent";

export const metadata: Metadata = {
  title: "A Letter to the Consumer",
  description: "A letter to the consumer from Pigeon Group Co.",
};

export default function LetterPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-8 md:px-8 md:pt-12">
      <div className="mb-12 flex items-center justify-between gap-4 md:mb-20">
        <Link href="/" aria-label="Pigeon — Home">
          <Image
            src="/logos/logo_horizontal_white-tp.svg"
            alt="Pigeon"
            width={100}
            height={28}
            className="h-3.5 w-auto opacity-40 transition-opacity duration-300 hover:opacity-80 md:h-4"
          />
        </Link>
        <h1 className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal-orange/60">
          A Letter to the Consumer
        </h1>
      </div>

      <LetterContent />
    </main>
  );
}
