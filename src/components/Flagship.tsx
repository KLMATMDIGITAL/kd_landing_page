import Image from "next/image";

export default function Flagship() {
  return (
    <section
      id="flagship"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#1a1918] py-28 md:py-32"
    >
      <div className="edge relative grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-8">
        <div className="max-w-[520px]">
          <h2
            className="font-serif italic leading-[1.1] text-cream"
            style={{ fontSize: "var(--heading-size)" }}
          >
            Flagship Project
          </h2>

          <div className="mt-9 flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/images/legacystep-icon.png"
                alt="LegacyStep"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-serif text-[50px] text-cream">
              LegacyStep
            </span>
          </div>

          <p className="mt-6 font-helvetica text-[25px] leading-[1.35] tracking-[-0.05em] text-cream">
            A secure, intuitive estate organization and digital legacy
            management platform. Designed to eliminate the administrative
            burden of end-of-life planning, the LegacyStep app provides
            families with a centralized, secure vault and smart checklist to
            organize vital records, digital assets, and estate workflows
            seamlessly.
          </p>

          <div className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-glass px-5 py-2.5">
            <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-cream" />
            <span className="font-helvetica text-[13px] text-cream">
              Coming Soon to the iOS App Store
            </span>
          </div>
        </div>

        {/* In-flow on mobile so it never overlaps the copy above — bleeds to the right screen edge only */}
        <div className="relative -mr-[var(--edge-padding)] w-[calc(100%+var(--edge-padding))] md:hidden">
          <Image
            src="/images/phone-ss-1.png"
            alt="LegacyStep app shown on three phones"
            width={2981}
            height={2229}
            className="h-auto w-full object-contain object-right"
          />
        </div>
      </div>

      {/* Desktop: three-layer phone collage — the two background phones sit apart at the same depth,
          the hand+phone layer sits above them (z-order) but lower on screen, bleeding off the right edge */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-10 hidden w-[62vw] max-w-[1150px] -translate-y-[42%] md:block">
        <div className="relative aspect-[1150/820]">
          {/* phone-hand-3: back layer, left side */}
          <div className="absolute left-[13%] top-[6%] w-[23%] -rotate-[8deg]">
            <Image
              src="/images/phone-ss-3.png"
              alt=""
              width={1000}
              height={2229}
              className="h-auto w-full"
            />
          </div>
          {/* phone-hand-2: back layer, right side, far apart from phone-hand-3 */}
          <div className="absolute left-[71%] top-0 w-[25%] rotate-[6deg]">
            <Image
              src="/images/phone-ss-2.png"
              alt=""
              width={1000}
              height={2269}
              className="h-auto w-full"
            />
          </div>
          {/* phone-hand-0: front layer, hand + phone, bleeding past the right edge */}
          <div className="absolute left-[31%] top-[24%] w-[72%]">
            <Image
              src="/images/phone-ss-1.png"
              alt="LegacyStep app shown on three phones, one held in hand"
              width={2981}
              height={2229}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
