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
        <h2
          className="text-center font-serif italic leading-[1.1] text-cream"
          style={{ fontSize: "var(--heading-size)" }}
        >
          Focus Areas
        </h2>

        <div className="mx-auto mt-14 grid grid-cols-1 gap-5 md:mt-20 md:max-w-[1080px] md:grid-cols-2 md:gap-7">
          {AREAS.map((area) => (
            <div
              key={area.number}
              className="relative flex flex-col rounded-2xl bg-[rgba(255,245,230,0.32)] p-7 backdrop-blur-md md:aspect-[4/3] md:p-9"
            >
              <svg
                className="absolute right-6 top-6 md:right-7 md:top-7"
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
          ))}
        </div>
      </div>
    </section>
  );
}
