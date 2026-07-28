import type { Metadata } from "next";
import ScrollVelocity from "@/components/ScrollVelocity";
import ProcessTimeline from "@/components/ProcessTimeline";
import PageGrainGradient from "@/components/PageGrainGradient";
import PageCTA from "@/components/PageCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Approach — KLMATM DIGITAL",
  description:
    "How KLMATM DIGITAL turns daunting real-world processes into clear, guided digital products.",
  alternates: {
    canonical: "/approach",
  },
  openGraph: {
    title: "Approach — KLMATM DIGITAL",
    description:
      "How KLMATM DIGITAL turns daunting real-world processes into clear, guided digital products.",
    url: "/approach",
  },
};

export default function ApproachPage() {
  return (
    <main className="relative w-full overflow-hidden pb-12 pt-40 md:pb-16 md:pt-56">
      <PageGrainGradient />

      {/* Full-bleed, outside the "edge" padded column on purpose — the
          marquee should run edge to edge of the viewport, not be confined
          to the centered content width like the rest of the page. */}
      <div className="relative z-10 w-full">
        <ScrollVelocity
          texts={[
            "FROM FRICTION TO A CLEAR NEXT STEP • ",
            "GUIDED WORKFLOWS, BUILT TO LAST • ",
          ]}
          velocity={40}
          numCopies={6}
        />
      </div>

      <div className="edge relative z-10">
        <div className="mx-auto max-w-[820px] text-center">
          <p className="mx-auto mt-7 max-w-[620px] font-helvetica text-[19px] leading-[1.5] tracking-[-0.03em] text-cream/80">
            Our approach turns daunting, real-world processes into clear,
            manageable steps — the same discipline whether we&apos;re
            shipping a consumer utility or architecting a workflow behind
            the scenes.
          </p>
        </div>

        <div className="mt-20 md:mt-28">
          <ProcessTimeline />
        </div>

        <div className="mt-24 md:mt-32">
          <PageCTA
            question="Ready to put this into practice?"
            buttonLabel="Start a Conversation"
            href="/contact"
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
