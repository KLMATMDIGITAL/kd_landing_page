"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[720px] w-full items-end overflow-hidden bg-bg"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/kd_hero2.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Thin blend into the Flagship section's solid background so the seam isn't abrupt */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-40"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #1a1918 100%)",
          }}
        />
      </div>

      <div className="edge relative z-10 w-full pb-28 md:pb-32">
        <div className="max-w-[920px]">
          <h1
            className="font-serif italic leading-[1.1] text-cream text-glow"
            style={{ fontSize: "var(--heading-size)" }}
          >
            Engineering purposeful
            <br />
            digital products.
          </h1>
          <p className="mt-5 font-helvetica text-[18px] leading-[1.35] tracking-[-0.05em] text-cream">
            We design and deploy high-utility mobile applications and
            targeted digital marketplaces engineered to simplify complex
            workflows and connect regional ecosystems.
          </p>

          <motion.a
            href="#flagship"
            initial="initial"
            whileHover="hover"
            className="mt-11 inline-flex items-center gap-5 overflow-hidden bg-glass py-3 pl-9 pr-3 backdrop-blur-[5px] transition-colors hover:bg-white/10"
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
              Explore Our Portfolio
            </motion.span>
            <motion.span
              variants={{
                initial: { backgroundColor: "#9d8771", boxShadow: "0 0 0px rgba(255,245,230,0)", opacity: 1 },
                hover: { backgroundColor: "#fff5e6", boxShadow: "0 0 20px rgba(255,245,230,0.7)", opacity: 0.85 },
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
        </div>
      </div>

      <AnimatePresence>
        {!scrolled && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.25 },
              y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
          >
            <span className="font-helvetica text-[11px] tracking-[0.25em] text-cream/70">
              SCROLL
            </span>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <path
                d="M7 1V18M7 18L1 12M7 18L13 12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cream/70"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
