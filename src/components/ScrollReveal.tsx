"use client";

import { useEffect, useMemo, useRef } from "react";
import { getGsap } from "@/lib/gsap";

// Ported from reactbits.dev's ScrollReveal (text-animations/scroll-reveal),
// adapted to this project's GSAP setup: uses the shared getGsap() singleton
// instead of re-registering ScrollTrigger, and scopes cleanup to this
// instance's own triggers via gsap.context() — the original's cleanup calls
// ScrollTrigger.getAll().forEach(t => t.kill()), which would tear down every
// other scroll animation on the page, not just this component's.
//
// Word opacity/blur are scrubbed directly to scroll position (not a one-time
// play-on-enter): starts once the element's top crosses the vertical middle
// of the viewport, finishes shortly after (top 20%) — so it's done well
// before the section settles into its centered resting position, rather than
// starting the instant the section's edge peeks into view.
export default function ScrollReveal({
  children,
  className,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 0,
  blurStrength = 7,
  boldWords = 0,
}: {
  children: string;
  className?: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  /** Bolds the first N non-whitespace word tokens (e.g. a leading brand name). */
  boldWords?: number;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => children.split(/(\s+)/), [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const { gsap } = getGsap();
    const wordElements = el.querySelectorAll<HTMLElement>("[data-word]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          rotate: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 50%",
            end: "top 20%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top 50%",
            end: "top 20%",
            scrub: true,
          },
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            filter: "blur(0px)",
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              start: "top 50%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [words, enableBlur, baseOpacity, baseRotation, blurStrength]);

  let nonSpaceIndex = -1;

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => {
        if (word.match(/^\s+$/)) return word;
        nonSpaceIndex++;
        const isBold = nonSpaceIndex < boldWords;
        return (
          <span
            key={i}
            data-word
            className={`inline-block ${isBold ? "font-bold" : ""}`}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}
