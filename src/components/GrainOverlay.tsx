"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useGrainGradientController } from "@/lib/useGrainGradientController";

const SPEED = 1;

// The grain-only counterpart to HeroGrainGradient — same shape/rotation/noise
// "DNA" for a consistent feel, but the color entries match colorBack exactly
// (opaque, same hex), so no colored blob shapes ever show, only the animated
// noise texture. Two earlier bugs, both fixed:
// 1. Fully-transparent colors (alpha 0) meant zero grain wherever the shape's
//    "color" regions render, not just zero color — a large dead flat zone.
//    Keeping colors opaque (just color-matched to colorBack) fixes that.
// 2. `mix-blend-mode: overlay` mathematically compounds toward black when
//    both the backdrop and this layer are already dark — it's only neutral
//    around mid-gray. That darkened the entire section below its own base
//    color, which read as a hard black block. No blend mode needed at all
//    once the colors already match the background.
export default function GrainOverlay({ className = "" }: { className?: string }) {
  const { shaderRef, key } = useGrainGradientController(SPEED);
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundColor: "#1a1918" }}
    >
      {/* Backdrop behind the canvas — a resize-triggered WebGL context reset
          briefly clears the canvas, and without this it flashes stark black
          instead of this matching dark tone. */}
      <GrainGradient
        key={key}
        ref={shaderRef}
        className="h-full w-full"
        colors={["#1a1918"]}
        colorBack="#1a1918"
        softness={0.7}
        intensity={0.15}
        noise={0.6}
        shape="corners"
        speed={SPEED}
        scale={1}
        rotation={220}
        offsetX={0}
        offsetY={0}
      />
    </div>
  );
}
