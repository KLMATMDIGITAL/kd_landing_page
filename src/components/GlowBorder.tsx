"use client";

import { useEffect, useRef } from "react";

// Tracks the cursor globally (not just while hovering this card) so the glow
// can react even when the mouse is just nearby — including the gap between
// two adjacent cards, where both cards' facing edges light up at once, each
// independently reacting to the same cursor position.
//
// Technique: a padding-box ring, its background a radial gradient centered
// at the cursor's position relative to this card (tracked via CSS vars, so
// it can sit outside the 0–100% box when the cursor is off-card), masked
// with mask-composite so only the border-width ring shows the gradient —
// concentrated on whichever edge is nearest the cursor, fading around the
// rest of the ring, and fading out entirely once the cursor is far away.
export default function GlowBorder({
  children,
  className,
  proximity = 200,
  color = "255, 245, 230",
  borderWidth = 1.5,
}: {
  children: React.ReactNode;
  className?: string;
  proximity?: number;
  color?: string;
  borderWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const closestX = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const closestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
      const dist = Math.hypot(e.clientX - closestX, e.clientY - closestY);
      const opacity = Math.max(0, 1 - dist / proximity);
      el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
      el.style.setProperty("--glow-opacity", String(opacity));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [proximity]);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
        style={{
          padding: borderWidth,
          opacity: "var(--glow-opacity, 0)",
          background: `radial-gradient(260px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${color}, 0.9), transparent 70%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
