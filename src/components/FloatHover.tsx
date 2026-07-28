"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";

// Continuous, independent of any scroll trigger — a slow, small up-and-down
// bob that just runs forever once mounted, like the element is hovering in
// the air. Kept on its own nested element so it doesn't fight with a parent
// Reveal's entrance transform on the same node.
export default function FloatHover({
  children,
  className,
  distance = 8,
  duration = 2.6,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: `+=${distance}`,
        duration,
        delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, el);

    return () => ctx.revert();
  }, [distance, duration, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
