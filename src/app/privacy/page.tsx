import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pigeon Group collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy — Pigeon",
    description:
      "How Pigeon Group collects, uses, and protects your personal information.",
  },
  twitter: {
    title: "Privacy Policy — Pigeon",
    description:
      "How Pigeon Group collects, uses, and protects your personal information.",
  },
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
      </div>

      <article className="space-y-10 text-[15px] leading-[1.9] text-concrete/70">
        <p className="text-concrete/40 font-mono text-[10px] tracking-[0.15em] uppercase">
          Last updated: February 28, 2026
        </p>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            Who we are
          </h2>
          <p>
            Pigeon Group Co. (&ldquo;Pigeon,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;) is a hardware company based in Phoenix, Arizona.
            We&rsquo;re building a compact smart pager that filters your
            phone&rsquo;s notifications and delivers only what matters.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            What we collect
          </h2>
          <p className="mb-3">
            We collect only the information you voluntarily provide:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-2 text-concrete/60">
            <li>
              <strong className="text-concrete/70">Reservation form:</strong>{" "}
              email address
            </li>
            <li>
              <strong className="text-concrete/70">Beta application:</strong>{" "}
              name, email, phone number, city, state, country, phone operating
              system, daily screen time, occupation, age range, and gender
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            How we use it
          </h2>
          <ul className="list-inside list-disc space-y-2 pl-2 text-concrete/60">
            <li>To contact you about your reservation or beta application</li>
            <li>To select and onboard beta testers</li>
            <li>
              To send product updates related to Pigeon (you can unsubscribe at
              any time)
            </li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your personal information with third
            parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            Where we store it
          </h2>
          <p>
            Your data is stored securely in a hosted PostgreSQL database managed
            by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-orange/70 underline decoration-signal-orange/30 underline-offset-2 transition-colors duration-300 hover:text-signal-orange"
            >
              Supabase
            </a>
            . All connections are encrypted via TLS. We do not store payment
            information &mdash; we do not currently process payments on this
            site.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            Cookies &amp; analytics
          </h2>
          <p>
            This site does not use cookies, tracking pixels, or third-party
            analytics. We do not track your browsing behavior.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            Your rights
          </h2>
          <p>
            You can request access to, correction of, or deletion of your
            personal data at any time by emailing us. We will respond within 30
            days.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud/90">
            Contact
          </h2>
          <p>
            If you have questions about this policy or your data, reach out:
          </p>
          <p className="mt-3 font-mono text-[13px] tracking-[0.02em]">
            <a
              href="mailto:hunter@pigeongroup.co"
              className="text-signal-orange/70 transition-colors duration-300 hover:text-signal-orange"
            >
              hunter@pigeongroup.co
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
