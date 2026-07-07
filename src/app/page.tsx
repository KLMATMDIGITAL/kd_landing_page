import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Flagship from "@/components/Flagship";
import FocusAreas from "@/components/FocusAreas";
import CTAFooter from "@/components/CTAFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Flagship />

        {/* Focus Areas + Footer share one continuous background photo, same as the Figma frames */}
        <section className="relative w-full">
          <div className="absolute inset-0">
            <Image
              src="/images/kd_cta.png"
              alt=""
              fill
              className="object-cover"
            />
            {/* Thin blend from the Flagship section's solid background into this photo */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-40"
              style={{
                background: "linear-gradient(to bottom, #1a1918 0%, transparent 100%)",
              }}
            />
          </div>
          <div className="relative z-10">
            <FocusAreas />
            <CTAFooter />
          </div>
        </section>
      </main>
    </>
  );
}
