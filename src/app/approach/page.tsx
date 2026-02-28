import type { Metadata } from "next";
import { ApproachContent } from "@/components/sections/ApproachContent";

export const metadata: Metadata = {
  title: "Our Approach — Pigeon",
  description:
    "We don't believe the solution to screen addiction is better screen management — it's separation. Learn why we're building Pigeon.",
  openGraph: {
    title: "Our Approach — Pigeon",
    description:
      "We don't believe the solution to screen addiction is better screen management — it's separation.",
  },
  twitter: {
    title: "Our Approach — Pigeon",
    description:
      "We don't believe the solution to screen addiction is better screen management — it's separation.",
  },
};

export default function ApproachPage() {
  return <ApproachContent />;
}
