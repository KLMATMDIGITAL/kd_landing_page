"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import BlurText from "./BlurText";
import SlideReveal from "./SlideReveal";
import GrainOverlay from "./GrainOverlay";
import ScrollReveal from "./ScrollReveal";
import FloatHover from "./FloatHover";

export default function Flagship() {
  const collageRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="flagship"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#1a1918] py-28 md:py-32"
    >
      <GrainOverlay />
      <div className="edge relative z-10 grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-8">
        <Reveal className="max-w-[520px]" start="top 50%">
          <BlurText
            text="Flagship Project"
            delay={50}
            animateBy="words"
            direction="bottom"
            className="font-serif italic leading-[1.1] text-cream text-[length:var(--heading-size)]"
          />

          <div className="mt-9 flex items-center gap-4">
            <SlideReveal
              direction="top"
              start="top 50%"
              className="relative h-20 w-20 shrink-0 rounded-xl"
            >
              <Image
                src="/images/legacystep-icon.png"
                alt="LegacyStep"
                fill
                className="object-cover"
              />
            </SlideReveal>
            <SlideReveal direction="bottom" start="top 50%">
              <span className="font-serif text-[50px] text-cream">
                LegacyStep
              </span>
            </SlideReveal>
          </div>

          <ScrollReveal
            enableBlur={false}
            className="mt-6 font-helvetica text-[29px] leading-[1.35] tracking-[-0.05em] text-cream"
          >
            A secure, intuitive estate organization and digital legacy
            management platform. Designed to eliminate the administrative
            burden of end-of-life planning, the LegacyStep app provides
            families with a centralized, secure vault and smart checklist to
            organize vital records, digital assets, and estate workflows
            seamlessly.
          </ScrollReveal>

          <Reveal y={0} duration={0.4} start="top 50%">
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-glass px-5 py-2.5">
              <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-cream" />
              <span className="font-helvetica text-[13px] text-cream">
                Coming Soon to the iOS App Store
              </span>
            </div>
          </Reveal>
        </Reveal>

        {/* In-flow on mobile so it never overlaps the copy above — bleeds to the right screen edge only */}
        <Reveal
          delay={0.15}
          className="relative -mr-[var(--edge-padding)] w-[calc(100%+var(--edge-padding))] md:hidden"
        >
          <Image
            src="/images/phone-ss-1.png"
            alt="LegacyStep app shown on three phones"
            width={2981}
            height={2229}
            className="h-auto w-full object-contain object-right"
          />
        </Reveal>
      </div>

      {/* Desktop: three-layer phone collage — the two background phones sit apart at the same depth,
          the hand+phone layer sits above them (z-order) but lower on screen, bleeding off the right edge.
          Positioning transform lives on the outer static wrapper — Reveal's own GSAP-driven transform
          (for the fade/slide-in) must go on a nested element, since GSAP writes directly to the inline
          `transform` style and would otherwise overwrite either the -translate-y-[42%] offset here, or
          the rotate-[deg] utility on phone-ss-2/3's own static wrapper below.
          Entrance: ss1 slides in first, then ss2+ss3 slide in together, all from the right, as a smooth
          fade+slide (not the abrupt masked slide used elsewhere on the site). After landing, ss2/ss3
          get a slow, continuous hover bob — ss1 stays still. */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-10 hidden w-[62vw] max-w-[1150px] -translate-y-[42%] md:block">
        <div ref={collageRef} className="relative aspect-[1150/820]">
          {/* All three share collageRef as their trigger (instead of each firing off
              its own position) — ss1 sits lower in this layout than ss2/ss3, so
              letting each fire independently meant ss1's own "top 50%" was reached
              later regardless of its smaller delay, playing it last instead of
              first. One shared trigger means only each element's own `delay`
              controls the order. */}
          {/* phone-hand-3: back layer, left side — slides in from the top */}
          <div className="absolute left-[13%] top-[6%] w-[23%] -rotate-[8deg]">
            <Reveal
              x={0}
              y={-90}
              duration={0.8}
              delay={0.35}
              start="top 50%"
              triggerRef={collageRef}
            >
              <FloatHover distance={16} duration={1.3}>
                <Image
                  src="/images/phone-ss-3.png"
                  alt=""
                  width={1000}
                  height={2229}
                  className="h-auto w-full"
                />
              </FloatHover>
            </Reveal>
          </div>
          {/* phone-hand-2: back layer, right side, far apart from phone-hand-3 — slides in from the bottom */}
          <div className="absolute left-[71%] top-0 w-[25%] rotate-[6deg]">
            <Reveal
              x={0}
              y={90}
              duration={0.8}
              delay={0.35}
              start="top 50%"
              triggerRef={collageRef}
            >
              <FloatHover distance={14} duration={1.5} delay={0.4}>
                <Image
                  src="/images/phone-ss-2.png"
                  alt=""
                  width={1000}
                  height={2269}
                  className="h-auto w-full"
                />
              </FloatHover>
            </Reveal>
          </div>
          {/* phone-hand-0: front layer, hand + phone, bleeding past the right edge — slides in
              first, stays still afterward (no hover) */}
          <div className="absolute left-[31%] top-[24%] w-[72%]">
            <Reveal
              x={90}
              y={0}
              duration={0.8}
              delay={0.1}
              start="top 50%"
              triggerRef={collageRef}
            >
              <Image
                src="/images/phone-ss-1.png"
                alt="LegacyStep app shown on three phones, one held in hand"
                width={2981}
                height={2229}
                className="h-auto w-full"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
