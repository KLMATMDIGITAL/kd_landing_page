"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { getGsap } from "@/lib/gsap";

// Lenis intercepts native scroll entirely, so ScrollTrigger's own native-scroll
// tracking never fires unless we explicitly tell it to recheck on every Lenis tick.
function GsapLenisBridge() {
  useLenis(() => {
    getGsap().ScrollTrigger.update();
  });
  return null;
}

// Lenis measures the scrollable height once (root/window mode) and doesn't
// know when React grows the page later — e.g. a form section mounting new
// fields. Without this, users get stuck unable to scroll past whatever
// height existed at the last measurement, even though the content is taller.
function LenisResizeObserver() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [lenis]);

  return null;
}

export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    setChecked(true);
    const onChange = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Avoid rendering with native scroll then swapping to Lenis after mount —
  // wait for the reduced-motion check first.
  if (!checked || !enabled) return null;

  return (
    <>
      <ReactLenis
        root
        options={{
          duration: 1.1,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          syncTouch: false,
        }}
      />
      <GsapLenisBridge />
      <LenisResizeObserver />
    </>
  );
}
