import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-cloud/[0.06] bg-shadow px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 font-mono text-[10px] tracking-[0.15em] uppercase text-concrete/35 md:flex-row md:items-center md:justify-between">
        <span>&copy; {new Date().getFullYear()} Pigeon Group Co.</span>
        <span>Phoenix, AZ</span>
        <span>Technology should serve people.</span>
      </div>
      <div className="mx-auto mt-3 flex max-w-6xl flex-col gap-3 font-mono text-[10px] tracking-[0.15em] uppercase text-concrete/35 md:flex-row md:items-center md:gap-8">
        <a
          href="mailto:hunter@pigeongroup.co"
          className="hover:text-cloud transition-colors duration-300"
        >
          hunter@pigeongroup.co
        </a>
        <a
          href="tel:+16319652344"
          className="hover:text-cloud transition-colors duration-300"
        >
          (631) 965-2344
        </a>
        <Link
          href="/privacy"
          className="hover:text-cloud transition-colors duration-300"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
