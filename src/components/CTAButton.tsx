"use client";

import { motion } from "framer-motion";

// Extracted from Hero's own CTA button so About/Approach can end on the same
// "question + button" bookend the homepage uses, with different copy.
export default function CTAButton({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      className="inline-flex items-center gap-5 overflow-hidden bg-glass py-3 pl-9 pr-3 backdrop-blur-[5px] transition-colors hover:bg-white/10"
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 20,
      }}
    >
      <motion.span
        variants={{
          initial: { textShadow: "0 0 0px rgba(255,245,230,0)" },
          hover: { textShadow: "0 0 20px rgba(255,245,230,0.7)" },
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="font-serif text-[25px] text-cream"
      >
        {label}
      </motion.span>
      <motion.span
        variants={{
          initial: {
            backgroundColor: "#9d8771",
            boxShadow: "0 0 0px rgba(255,245,230,0)",
            opacity: 1,
          },
          hover: {
            backgroundColor: "#fff5e6",
            boxShadow: "0 0 20px rgba(255,245,230,0.7)",
            opacity: 0.85,
          },
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
      >
        {/* Primary arrow: slides out to top-right */}
        <motion.svg
          variants={{
            initial: { x: 0, y: 0, color: "#fff5e6" },
            hover: { x: 28, y: -28, color: "#9d8771" },
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="absolute"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 7H17V17"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 17L17 7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        {/* Secondary arrow: slides in from bottom-left */}
        <motion.svg
          variants={{
            initial: { x: -28, y: 28, color: "#fff5e6" },
            hover: { x: 0, y: 0, color: "#9d8771" },
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="absolute"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 7H17V17"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 17L17 7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.span>
    </motion.a>
  );
}
