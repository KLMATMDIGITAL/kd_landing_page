import Reveal from "./Reveal";
import BlurText from "./BlurText";
import TiltCard from "./TiltCard";
import GlowBorder from "./GlowBorder";

const AREAS = [
  {
    number: "01",
    title: ["High-Utility", "Micro-SaaS"],
    description:
      "We build streamlined, single-purpose software solutions designed to solve critical friction points in daily life and asset management.",
    icon: (
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z M5 7l7 4 7-4 M12 11v10" />
    ),
  },
  {
    number: "02",
    title: ["Hyper-Local", "Marketspaces"],
    description:
      "We architect curated, digital commerce platforms optimized for organic search, connecting premium regional service vendors with high-intent consumer demand.",
    icon: (
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    ),
  },
];

export default function FocusAreas() {
  return (
    <section id="focus-areas" className="relative w-full pb-24 pt-40 md:pb-32 md:pt-56">
      <div className="edge">
        <BlurText
          text="Focus Areas"
          delay={50}
          animateBy="words"
          direction="bottom"
          className="justify-center font-serif italic leading-[1.1] text-cream text-[length:var(--heading-size)]"
        />

        <div className="mx-auto mt-14 grid grid-cols-1 gap-5 md:mt-20 md:max-w-[1180px] md:grid-cols-2 md:gap-7">
          {AREAS.map((area, i) => (
            <Reveal
              key={area.number}
              x={i === 0 ? -220 : 220}
              y={0}
              duration={0.9}
              delay={i * 0.15}
              start="top 50%"
            >
              <GlowBorder
                color="255, 245, 230"
                borderWidth={3}
                className="rounded-2xl bg-[rgba(255,245,230,0.32)] backdrop-blur-md md:aspect-[10/7]"
              >
                <TiltCard className="h-full w-full" tooltipText={area.title.join(" ")}>
                  <div className="flex h-full flex-col p-8 md:p-10">
                    <div className="absolute right-6 top-6 h-[200px] w-[200px] md:right-7 md:top-7">
                      {/* Resting state: faint outline, as before */}
                      <svg
                        className="absolute inset-0"
                        width="200"
                        height="200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-cream)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ opacity: 0.1 }}
                      >
                        {area.icon}
                      </svg>
                      {/* Hover state: smoothly crossfades in — still just an
                          outline (fill stays none), only the stroke itself
                          becomes a vivid two-tone theme gradient instead of
                          the faint flat cream */}
                      <svg
                        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                        width="200"
                        height="200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={`url(#area-icon-gradient-${area.number})`}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <defs>
                          <linearGradient
                            id={`area-icon-gradient-${area.number}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="var(--color-cream)" />
                            <stop offset="100%" stopColor="var(--color-accent)" />
                          </linearGradient>
                        </defs>
                        {area.icon}
                      </svg>
                    </div>

                    <span className="font-serif text-[50px] text-cream">
                      {area.number}
                    </span>
                    <h3 className="mt-1 font-serif text-[2.25rem] leading-[1.15] text-white">
                      {area.title[0]}
                      <br />
                      {area.title[1]}
                    </h3>
                    <div className="mt-4 h-px w-12 bg-white" />
                    <p className="mt-4 font-helvetica text-[20px] leading-[1.2] tracking-[-0.05em] text-white">
                      {area.description}
                    </p>
                  </div>
                </TiltCard>
              </GlowBorder>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
