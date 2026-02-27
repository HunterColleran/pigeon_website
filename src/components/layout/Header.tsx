"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12 md:py-5 ${
        scrolled ? "bg-shadow/90 backdrop-blur-sm" : ""
      }`}
    >
      <Link href="/" aria-label="Pigeon — Home">
        <Image
          src="/logos/logo_horizontal_white-tp.svg"
          alt="Pigeon"
          width={120}
          height={32}
          priority
          className="h-4 w-auto opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-5"
        />
      </Link>

      <nav className="flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] uppercase md:gap-8">
        <Link
          href="/approach"
          className="text-concrete/50 transition-colors duration-300 hover:text-cloud"
        >
          Our Approach
        </Link>
        <Link
          href="/letter"
          className="text-concrete/50 transition-colors duration-300 hover:text-cloud"
        >
          Letter
        </Link>
        <Link
          href="/#reserve"
          className="border border-concrete/25 px-3 py-1.5 text-concrete/55 transition-all duration-300 hover:border-signal-orange/40 hover:text-signal-orange"
        >
          Reserve
        </Link>
      </nav>
    </header>
  );
}
