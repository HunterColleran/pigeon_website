import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Product } from "@/components/sections/Product";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollProgress />
      <main>
        <Hero />
        <Philosophy />
        <Product />
        <section className="relative h-[35vh] min-h-[240px] overflow-hidden bg-shadow">
          <Image
            src="/look-up-banner.png"
            alt="LOOK UP. — buildings looking up at the sky with Pigeon branding"
            fill
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-shadow via-transparent to-shadow/40" />
        </section>
      </main>
      <Footer />
    </>
  );
}
