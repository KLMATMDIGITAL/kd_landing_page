"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";

// Same masked, abrupt slide technique as Hero/Navbar's entrance (overflow-hidden
// wrapper + a hard position tween, no opacity — a cut reveal, not a fade),
// but triggered on scroll into view instead of on mount, since this is used
// below the fold. direction is which edge it slides in FROM.
export default function SlideReveal({
  children,
  className,
  direction = "bottom",
  duration = 0.9,
  start = "top 85%",
  triggerRef,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "top" | "bottom";
  duration?: number;
  start?: string;
  /** Fire based on a different element's scroll position instead of this
   * one's own — to synchronize with another reveal (e.g. a heading) so both
   * play at the same scroll moment. */
  triggerRef?: React.RefObject<Element | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const { gsap } = getGsap();
    const fromPercent = direction === "top" ? -100 : 100;

    const ctx = gsap.context(() => {
      gsap.set(inner, { yPercent: fromPercent });
      gsap.to(inner, {
        yPercent: 0,
        duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: triggerRef?.current ?? wrap,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [direction, duration, start, triggerRef]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <div ref={innerRef} className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}
