"use client";

import type { SpringOptions } from "framer-motion";
import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Adapted from the reactbits/21st.dev "TiltedCard" recipe: mouse position
// drives a spring-eased 3D tilt (rotateX/rotateY) plus a small cursor-side
// tooltip. The original is built around a single <img>; here the card's
// existing content (icon, number, title, description) sits on its own
// translateZ layer instead of an image, so the TEXT is what visibly "pops"
// in 3D as you move the cursor — no image, per the ask, keeping the same
// transparent/blurred card surface this site already uses.
const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltCard({
  children,
  className = "",
  tooltipText,
  rotateAmplitude = 10,
  scaleOnHover = 1.03,
}: {
  children: ReactNode;
  className?: string;
  tooltipText?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateTooltip = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetY - lastY;
    rotateTooltip.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    if (tooltipText) opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateTooltip.set(0);
    setLastY(0);
  }

  return (
    <div
      ref={ref}
      className={`group relative [perspective:800px] ${className}`}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="h-full w-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY, scale }}
      >
        <div className="h-full [transform:translateZ(30px)] [transform-style:preserve-3d]">
          {children}
        </div>
      </motion.div>

      {tooltipText && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-[3] hidden rounded-[4px] bg-cream px-[10px] py-[4px] font-helvetica text-[11px] text-[#1a1918] opacity-0 shadow-md sm:block"
          style={{ x, y, opacity, rotate: rotateTooltip }}
        >
          {tooltipText}
        </motion.div>
      )}
    </div>
  );
}
