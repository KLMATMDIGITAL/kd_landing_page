"use client";

import { GrainGradient } from "@paper-design/shaders-react";

export default function CTAGrainGradient() {
  return (
    // Backdrop behind the canvas — a resize-triggered WebGL context reset
    // briefly clears the canvas, and without this it flashes stark black
    // instead of this matching dark tone.
    <div className="h-full w-full" style={{ backgroundColor: "#1a1918" }}>
      <GrainGradient
        className="h-full w-full"
        colors={["#5d5144", "#988364", "#989289"]}
        colorBack="#1a1918"
        softness={0.7}
        intensity={0.06}
        noise={0.5}
        shape="blob"
        speed={2}
        scale={1}
        rotation={220}
        offsetX={0}
        offsetY={0}
      />
    </div>
  );
}
