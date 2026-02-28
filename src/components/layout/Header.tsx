"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/approach", label: "Our Approach" },
  { href: "/letter", label: "Letter" },
  { href: "/beta", label: "Beta" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 font-mono text-[10px] tracking-[0.2em] uppercase md:flex md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-concrete/50 transition-colors duration-300 hover:text-cloud"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#reserve"
            className="border border-concrete/25 px-3 py-1.5 text-concrete/55 transition-all duration-300 hover:border-signal-orange/40 hover:text-signal-orange"
          >
            Reserve
          </Link>
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center justify-center md:hidden"
          aria-label="Open menu"
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M1 1h20M1 7h20M1 13h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-concrete/60" />
          </svg>
        </button>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-shadow/95 backdrop-blur-md md:hidden"
          >
            {/* Close button */}
            <div className="flex items-center justify-end px-6 py-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-concrete/60" />
                </svg>
              </button>
            </div>

            {/* Centered nav links */}
            <nav className="flex flex-1 flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-sm tracking-[0.2em] uppercase text-concrete/70 transition-colors duration-300 hover:text-cloud"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + navLinks.length * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/#reserve"
                  onClick={() => setMenuOpen(false)}
                  className="border border-concrete/25 px-5 py-2 font-mono text-sm tracking-[0.2em] uppercase text-concrete/55 transition-all duration-300 hover:border-signal-orange/40 hover:text-signal-orange"
                >
                  Reserve
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
