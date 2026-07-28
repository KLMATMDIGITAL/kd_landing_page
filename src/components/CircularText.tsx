"use client";

import { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import type { Transition } from "framer-motion";

// Ported from reactbits.dev's CircularText, adapted to this project's
// existing framer-motion install (the original imports from the renamed
// "motion/react" package — same API, so only the import changed). The
// looping from/to tween shape below is valid at runtime but isn't part of
// framer-motion's exported Transition type, hence the casts.
type OnHoverBehavior = "slowDown" | "speedUp" | "pause" | "goBonkers";

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number): Transition =>
  ({
    rotate: getRotationTransition(duration, from),
    scale: { type: "spring", damping: 20, stiffness: 300 },
  }) as unknown as Transition;

export default function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}: {
  text: string;
  spinDuration?: number;
  onHover?: OnHoverBehavior;
  className?: string;
}) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      // Fades in on the same 0.2s/1s beat as the Hero heading/subtext/button
      // and the navbar's own entrance, so this reads as one synchronized
      // reveal rather than a separate, later arrival.
      opacity: 1,
      transition: {
        ...getTransition(spinDuration, start),
        opacity: { duration: 1, delay: 0.2, ease: "easeOut" },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, text]);

  const handleHoverStart = () => {
    const start = rotation.get();
    let transitionConfig: Transition;
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case "pause":
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        } as unknown as Transition;
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({ rotate: start + 360, scale: scaleVal, transition: transitionConfig });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={`relative rounded-full text-center ${className}`}
      style={{ rotate: rotation, transformOrigin: "50% 50%" }}
      initial={{ rotate: 0, opacity: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span
            key={i}
            className="absolute inset-0 text-[9px] font-helvetica font-semibold uppercase tracking-[0.04em] text-cream/90 sm:text-[10px] lg:text-[11px]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}
