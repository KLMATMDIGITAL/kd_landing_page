"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import Reveal from "./Reveal";

const STEPS = [
  {
    number: "01",
    title: "Understand the Friction",
    description:
      "Every product starts by mapping the real-world logistics people are stuck in — the paperwork, the passwords, the decisions nobody wants to make alone.",
  },
  {
    number: "02",
    title: "Architect the Workflow",
    description:
      "We turn that friction into a clear, structured system — a guided checklist instead of a wall of forms, a single vault instead of a dozen scattered accounts.",
  },
  {
    number: "03",
    title: "Design for Trust",
    description:
      "Secure encryption, privacy-first defaults, and haptic, stress-free interactions — the technical foundation has to earn the right to hold someone's vital records.",
  },
  {
    number: "04",
    title: "Ship & Support",
    description:
      "We deploy as a polished, high-utility mobile product and keep iterating with the people actually using it — not a prototype, a tool meant to last.",
  },
];

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      line.style.transform = "scaleY(1)";
      return;
    }

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.set(line, { scaleY: 0, transformOrigin: "top" });
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 65%",
          end: "bottom 75%",
          scrub: 0.6,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-[1040px]">
      {/* Line sits in its own gutter between the number column and the text
          column — never behind the (now much bigger) number glyphs — and
          starts inset from the top so it doesn't begin right at "01". */}
      <div className="absolute left-[72px] top-16 bottom-10 w-1 bg-white/10 md:left-[108px] md:top-20">
        <div
          ref={lineRef}
          className="w-full origin-top bg-[#FFDDA9]"
          style={{ height: "100%" }}
        />
      </div>

      <div className="flex flex-col gap-16 md:gap-24">
        {STEPS.map((step) => (
          <Reveal key={step.number} x={0} y={30} duration={0.8} start="top 75%">
            <div className="flex items-start gap-6 md:gap-10">
              <span className="w-[60px] shrink-0 font-helvetica text-[3.5rem] font-bold leading-none text-[#FFDDA9] md:w-[96px] md:text-[5.5rem]">
                {step.number}
              </span>
              <div className="pt-2 md:pt-4">
                <h3 className="font-serif text-[2.5rem] leading-[1.15] text-white md:text-[3rem]">
                  {step.title}
                </h3>
                <p className="mt-4 font-helvetica text-[19px] leading-[1.45] tracking-[-0.03em] text-cream/80 md:text-[21px]">
                  {step.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
