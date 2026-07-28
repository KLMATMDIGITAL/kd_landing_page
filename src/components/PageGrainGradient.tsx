"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useGrainGradientController } from "@/lib/useGrainGradientController";

const SPEED = 2;

// Config from https://shaders.paper.design/grain-gradient — warm gold/cream
// palette, wave shape, dimmed low (intensity + wrapper opacity) so it reads
// as a faint tint across the whole page rather than a bright hero blob.
export default function PageGrainGradient({ className = "" }: { className?: string }) {
  const { shaderRef, key } = useGrainGradientController(SPEED);
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-25 ${className}`}
      style={{ backgroundColor: "#1b1a18" }}
    >
      {/* The canvas briefly clears on any resize-triggered WebGL context
          reset (viewport width/height change) — this backdrop shows through
          during that gap instead of a stark black flash. */}
      <GrainGradient
        key={key}
        ref={shaderRef}
        className="h-full w-full"
        colors={["#9d8772", "#ffdca8", "#fff5e5"]}
        colorBack="#1b1a18"
        softness={0.7}
        intensity={0.025}
        noise={0.5}
        shape="wave"
        speed={SPEED}
        scale={1}
        rotation={0}
        offsetX={0}
        offsetY={0}
      />
    </div>
  );
}
