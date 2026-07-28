"use client";

import { useEffect, useRef, useState } from "react";
import type { PaperShaderElement } from "@paper-design/shaders";
import { usePageTransition } from "@/components/PageTransitionProvider";

// Shared lifecycle management for every GrainGradient instance on the site.
//
// 1. Self-heals from WebGL context loss. The shader library has no built-in
//    recovery for this — under GPU memory pressure (common on mobile with
//    several animated canvases mounted at once) the browser can silently
//    drop a context, and the canvas then stays permanently blank until a
//    full page reload. Remounting the shader (via a changing `key`) on
//    `webglcontextlost` forces a fresh context instead of staying dead.
// 2. Pauses animation while its own container is scrolled off-screen, so
//    below-the-fold shaders (CTA, Flagship overlay) don't spend GPU/main
//    thread time animating before they've ever been seen.
// 3. Pauses animation while the curtain page-transition is covering the
//    viewport — freeing up the main thread/GPU for that animation
//    specifically, since contention here is what caused the curtain to
//    occasionally stutter or skip straight to the next page.
export function useGrainGradientController(speed: number) {
  const shaderRef = useRef<PaperShaderElement>(null);
  const [key, setKey] = useState(0);
  const { isTransitioning } = usePageTransition();

  useEffect(() => {
    const el = shaderRef.current;
    if (!el) return;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setKey((k) => k + 1);
    };
    el.addEventListener("webglcontextlost", onContextLost, true);
    return () => el.removeEventListener("webglcontextlost", onContextLost, true);
  }, [key]);

  useEffect(() => {
    const el = shaderRef.current;
    if (!el) return;
    let isVisible = false;
    const applySpeed = () =>
      el.paperShaderMount?.setSpeed(isVisible && !isTransitioning ? speed : 0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        applySpeed();
      },
      // Positive rootMargin resumes animation slightly before the section is
      // actually scrolled into view, so it's had a few real frames to render
      // by the time it's visible instead of showing its still-blank initial
      // paint.
      { threshold: 0, rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [key, isTransitioning, speed]);

  return { shaderRef, key };
}
