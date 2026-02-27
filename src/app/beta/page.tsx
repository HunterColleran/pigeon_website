import type { Metadata } from "next";
import { BetaContent } from "@/components/sections/BetaContent";

export const metadata: Metadata = {
  title: "Beta Program — Pigeon",
  description:
    "Apply to be a Pigeon beta tester. Help us shape the future of notification filtering.",
};

export default function BetaPage() {
  return <BetaContent />;
}
