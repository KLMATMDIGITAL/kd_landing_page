import type { Metadata } from "next";
import PageGrainGradient from "@/components/PageGrainGradient";
import CardSwap, { Card } from "@/components/CardSwap";
import PageCTA from "@/components/PageCTA";
import CurvedLoop from "@/components/CurvedLoop";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — KLMATM DIGITAL",
  description:
    "KLMATM DIGITAL is a digital utility and mobile software studio building empathetic, privacy-first tools for life's most complicated moments.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About — KLMATM DIGITAL",
    description:
      "KLMATM DIGITAL is a digital utility and mobile software studio building empathetic, privacy-first tools for life's most complicated moments.",
    url: "/about",
  },
};

const badgeClass =
  "inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 font-helvetica text-[13px] text-[#FFDDA9] ring-1 ring-[#FFDDA9]/30";
const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function AboutPage() {
  return (
    <main className="relative w-full overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40">
      <PageGrainGradient />

      <div className="edge relative z-10">
        <CurvedLoop
          marqueeText="Software with a bedside manner. ✦"
          speed={1.2}
          curveAmount={180}
          direction="left"
        />

        <div className="mt-4 grid grid-cols-1 items-center gap-16 md:mt-6 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
          <ScrollReveal
            enableBlur={false}
            boldWords={2}
            className="font-helvetica text-[26px] leading-[1.75] tracking-[-0.03em] text-cream/80"
          >
            KLMATM DIGITAL is a digital utility and mobile software studio.
            We design and deploy intuitive, secure tools that remove
            friction from complex life logistics and critical life
            transitions — for individuals, professionals, and the care
            networks around them.
          </ScrollReveal>

          <div className="relative h-[340px] sm:h-[620px] md:h-[760px]">
            <CardSwap
              width={620}
              height={420}
              cardDistance={95}
              verticalDistance={110}
              delay={3000}
              pauseOnHover
              skewAmount={5}
            >
              <Card customClass="flex flex-col justify-center gap-5 bg-[#1c1a17] p-12 ring-1 ring-[#FFDDA9]/25">
                <span className={badgeClass}>
                  <svg {...iconProps}>
                    <path d="M12 20s-7-4.35-9.5-8.5C.7 8.1 2 4.5 5.5 4c2-.28 3.7.72 4.5 2.2C10.8 4.72 12.5 3.72 14.5 4c3.5.5 4.8 4.1 3 7.5C19 15.65 12 20 12 20Z" />
                  </svg>
                  Empathetic
                </span>
                <h3 className="font-serif text-[2.6rem] leading-[1.15] text-white">
                  Empathetic by Design
                </h3>
                <p className="font-helvetica text-[19px] leading-[1.5] tracking-[-0.02em] text-cream/75">
                  Every product starts from the assumption that the person
                  using it is already overwhelmed — the interface has to
                  stay calm.
                </p>
              </Card>
              <Card customClass="flex flex-col justify-center gap-5 bg-[#1c1a17] p-12 ring-1 ring-[#FFDDA9]/25">
                <span className={badgeClass}>
                  <svg {...iconProps}>
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  Privacy
                </span>
                <h3 className="font-serif text-[2.6rem] leading-[1.15] text-white">
                  Privacy, First
                </h3>
                <p className="font-helvetica text-[19px] leading-[1.5] tracking-[-0.02em] text-cream/75">
                  Secure encryption and privacy-first defaults from the
                  first line of code — not a feature bolted on later.
                </p>
              </Card>
              <Card customClass="flex flex-col justify-center gap-5 bg-[#1c1a17] p-12 ring-1 ring-[#FFDDA9]/25">
                <span className={badgeClass}>
                  <svg {...iconProps}>
                    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
                    <path d="M3 12l9 5 9-5" />
                  </svg>
                  Simplified
                </span>
                <h3 className="font-serif text-[2.6rem] leading-[1.15] text-white">
                  Complexity, Simplified
                </h3>
                <p className="font-helvetica text-[19px] leading-[1.5] tracking-[-0.02em] text-cream/75">
                  We turn overwhelming administrative tasks into
                  structured, guided roadmaps anyone can follow alone.
                </p>
              </Card>
            </CardSwap>
          </div>
        </div>

        <div className="mt-32 md:mt-48">
          <PageCTA
            question="Curious how this would work for you?"
            buttonLabel="Let's Talk"
            href="/contact"
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
