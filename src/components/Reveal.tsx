"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";

export default function Reveal({
  children,
  className,
  x = 0,
  y = 28,
  duration = 0.9,
  delay = 0,
  start = "top 85%",
  triggerRef,
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  /** Fire based on a different element's scroll position instead of this
   * one's own — for a group of Reveals that must all trigger at the same
   * moment (ordered only by their own `delay`) rather than each firing
   * independently whenever its own position crosses `start`. */
  triggerRef?: React.RefObject<Element | null>;
  /** false = a clean position-only slide, no opacity involved at all —
   * for when a fade reads as too soft/slow and a hard cut into place is
   * wanted instead. */
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.set(el, fade ? { opacity: 0, x, y } : { x, y });
      gsap.to(el, {
        ...(fade ? { opacity: 1 } : {}),
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: triggerRef?.current ?? el,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [x, y, duration, delay, start, triggerRef, fade]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
