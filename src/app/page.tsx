import Hero from "@/components/Hero";
import Flagship from "@/components/Flagship";
import FocusAreas from "@/components/FocusAreas";
import CTAFooter from "@/components/CTAFooter";
import LazyBackgroundVideo from "@/components/LazyBackgroundVideo";
import CTAGrainGradient from "@/components/CTAGrainGradient";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Flagship />

        {/* Focus Areas + Footer share one continuous background video, same as the Figma frames */}
        <section className="relative w-full">
          <div className="absolute inset-0">
            <LazyBackgroundVideo
              src="/videos/kdcta-web.mp4"
              className="h-full w-full object-cover"
            />
            {/* Extends up past this section's own top edge, into Flagship —
                same fix as the Hero/Flagship seam: the blob's own canvas was
                getting hard-clipped at the section boundary whenever its
                animation drifted upward, which read as a sudden black cutoff.
                One continuous canvas + a gradual fade the whole way, instead
                of a hard edge, so it wanders into Flagship and back without
                ever being sharply cut. This section already paints on top of
                Flagship by normal DOM order (no z-index trick needed, unlike
                Hero which comes before Flagship). */}
            <div className="absolute inset-x-0 bottom-0 -top-[360px]">
              <CTAGrainGradient />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, #1a1918 0%, transparent 360px)",
                }}
              />
            </div>
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
