import type { Metadata } from "next";
import { BetaContent } from "@/components/sections/BetaContent";

export const metadata: Metadata = {
  title: "Beta Program — Pigeon",
  description:
    "Apply to be one of the first people to get a Pigeon. Beta testers receive a free device and help shape the product.",
  openGraph: {
    title: "Beta Program — Pigeon",
    description:
      "Apply to be one of the first people to get a Pigeon. Beta testers receive a free device and help shape the product.",
  },
  twitter: {
    title: "Beta Program — Pigeon",
    description:
      "Apply to be one of the first people to get a Pigeon. Beta testers receive a free device and help shape the product.",
  },
};

export default function BetaPage() {
  return <BetaContent />;
}
