import type { Metadata } from "next";
import BlurText from "@/components/BlurText";
import BookingForm from "@/components/BookingForm";
import PageGrainGradient from "@/components/PageGrainGradient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — KLMATM DIGITAL",
  description:
    "Book a call directly with KLMATM DIGITAL — pick a day and time that works for you.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact — KLMATM DIGITAL",
    description:
      "Book a call directly with KLMATM DIGITAL — pick a day and time that works for you.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="relative w-full overflow-hidden pb-12 pt-40 md:pb-16 md:pt-56">
      <PageGrainGradient />

      <div className="edge relative z-10">
        <div className="mx-auto max-w-[820px] text-center">
          <BlurText
            text="Let's build something together."
            delay={50}
            animateBy="words"
            direction="bottom"
            className="justify-center font-serif italic leading-[1.1] text-cream text-glow text-[length:var(--heading-size)]"
          />
          <p className="mx-auto mt-7 max-w-[560px] font-helvetica text-[19px] leading-[1.5] tracking-[-0.03em] text-cream/80">
            Grab a slot directly on the calendar — no back-and-forth over
            email.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-[780px] md:mt-20">
          <BookingForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}
