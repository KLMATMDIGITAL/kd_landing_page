"use client";

import { forwardRef } from "react";

const BlurWords = forwardRef<
  HTMLSpanElement,
  { children: string; className?: string }
>(function BlurWords({ children, className }, ref) {
  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.flatMap((word, i) => {
        const span = (
          <span key={i} data-word className="inline-block">
            {word}
          </span>
        );
        return i === 0 ? [span] : [" ", span];
      })}
    </span>
  );
});

export default BlurWords;
