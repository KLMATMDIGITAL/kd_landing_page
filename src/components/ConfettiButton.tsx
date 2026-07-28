"use client";

import { forwardRef, useImperativeHandle, useRef, type ButtonHTMLAttributes } from "react";
import confetti from "canvas-confetti";

export type ConfettiButtonHandle = { fire: () => void };

type ConfettiButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const SIDE_CANNON_COLORS = ["#FFDDA9", "#ffffff", "#f5e9d8"];

// Side cannons: two bursts fired from screen-edge height (left + right, both
// at vertical center) angled inward, repeating on rAF for a few seconds —
// rather than a single burst from the button's own position.
function fireSideCannons() {
  const end = Date.now() + 3 * 1000;

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: SIDE_CANNON_COLORS,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: SIDE_CANNON_COLORS,
    });

    requestAnimationFrame(frame);
  };

  frame();
}

const ConfettiButton = forwardRef<ConfettiButtonHandle, ConfettiButtonProps>(
  function ConfettiButton({ children, ...props }, ref) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      fire: fireSideCannons,
    }));

    return (
      <button ref={buttonRef} {...props}>
        {children}
      </button>
    );
  }
);

export default ConfettiButton;
