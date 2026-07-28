"use client";

import { GrainGradient } from "@paper-design/shaders-react";

// Config from https://shaders.paper.design/grain-gradient — warm gold/cream
// palette, wave shape, dimmed low (intensity + wrapper opacity) so it reads
// as a faint tint across the whole page rather than a bright hero blob.
export default function PageGrainGradient({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 opacity-25 ${className}`}>
      <GrainGradient
        className="h-full w-full"
        colors={["#9d8772", "#ffdca8", "#fff5e5"]}
        colorBack="#1b1a18"
        softness={0.7}
        intensity={0.025}
        noise={0.5}
        shape="wave"
        speed={2}
        scale={1}
        rotation={0}
        offsetX={0}
        offsetY={0}
      />
    </div>
  );
}
