"use client";

import { motion, Transition } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getGsap } from "@/lib/gsap";

// Ported from reactbits.dev's BlurText (text-animations/blur-text), adapted
// to this project's framer-motion install (the source uses the renamed
// "motion/react" package; this project has "framer-motion", same API).
// Also respects prefers-reduced-motion, per this project's convention.
//
// Trigger mechanism replaced entirely: the original (and an earlier version
// of this port) used IntersectionObserver, which has no notion of "how far
// down the viewport" — only "visible or not" — so it fired the instant a
// sliver of the element appeared, well before the section was anywhere near
// centered. Now uses the same GSAP ScrollTrigger `start`/`triggerRef` system
// as Reveal/SlideReveal, so this can be tuned or synchronized with other
// reveals on the page using the exact same percentage syntax and (optionally)
// the exact same trigger element.
type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  start?: string;
  /** Fire based on a different element's scroll position instead of this
   * one's own — to synchronize with another reveal (e.g. a button) so both
   * play at the same scroll moment. */
  triggerRef?: React.RefObject<Element | null>;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  start = "top 85%",
  triggerRef,
  animationFrom,
  animationTo,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setInView(true);
      return;
    }

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef?.current ?? el,
        start,
        onEnter: () => setInView(true),
        onEnterBack: () => setInView(true),
        onLeaveBack: () => setInView(false),
        // no onLeave — scrolling further down past it leaves it revealed,
        // same as every other reveal on this site
      });
    }, el);

    return () => ctx.revert();
  }, [start, triggerRef]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: "linear",
        };

        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
          >
            {segment === " " ? " " : segment}
            {animateBy === "words" && index < elements.length - 1 && " "}
          </motion.span>
        );
      })}
    </p>
  );
}
