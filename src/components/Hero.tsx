"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { getGsap } from "@/lib/gsap";
import BlurWords from "./BlurWords";
import HeroGrainGradient from "./HeroGrainGradient";
import CircularText from "./CircularText";
import CTAButton from "./CTAButton";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLSpanElement>(null);
  const buttonRevealRef = useRef<HTMLDivElement>(null);

  // Native scroll listener — the only path when Lenis is off (prefers-reduced-motion).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lenis takes over native scroll entirely when active, so the listener above
  // never fires in that case — this is the actual path when smooth scroll is on.
  useLenis((lenis) => {
    setScrolled(lenis.scroll > 5);
  });

  // One-time entrance choreography on load — not scroll-triggered, since the
  // Hero is always visible on first paint.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const heading = headingRef.current;
    const subtextEl = subtextRef.current;
    const buttonReveal = buttonRevealRef.current;
    if (!heading || !subtextEl || !buttonReveal) return;

    const { gsap } = getGsap();
    const headingWords = heading.querySelectorAll("[data-word]");
    const words = subtextEl.querySelectorAll("[data-word]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      // Heading, subtext, and button all start together (same beat as the
      // navbar's own entrance, which shares this 0.2s delay) instead of the
      // subtext waiting for the heading to finish — one unhurried wave
      // instead of two sequential ones. Heading's per-word duration/stagger
      // is slowed down so it doesn't read as rushed next to the subtext's
      // naturally longer (more words) blur-in.
      tl.set(headingWords, { opacity: 0, filter: "blur(10px)" })
        .set(words, { opacity: 0, filter: "blur(10px)" })
        .set(buttonReveal, { yPercent: 100 })
        .to(
          headingWords,
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.08,
            ease: "power2.out",
          },
          0
        )
        .to(
          words,
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          0
        )
        .to(buttonReveal, { yPercent: 0, duration: 0.9, ease: "power3.out" }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      className="relative z-10 flex h-screen min-h-[720px] w-full items-center bg-bg"
    >
      {/* One continuous shader canvas — taller than the section itself and
          unclipped (no overflow-hidden on the section), painting on top of
          Flagship via the section's own z-10. The fade is a gradient overlay
          covering the whole extra height, so the animated blobs dim
          gradually as they drift down rather than ever being hard-clipped
          by a box edge — they can wander into Flagship and back without a
          visible cutoff. */}
      <div className="absolute inset-x-0 top-0 h-[calc(100%+480px)]">
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <HeroGrainGradient />
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent calc(100% - 480px), #1a1918 100%)",
          }}
        />
      </div>

      <div className="edge relative z-10 w-full">
        <div className="mx-auto max-w-[920px] text-center">
          <h1
            ref={headingRef}
            className="font-serif italic leading-[1.1] text-cream text-glow"
            style={{ fontSize: "var(--heading-size)" }}
          >
            <BlurWords>Engineering purposeful</BlurWords>
            <br />
            <BlurWords>digital products.</BlurWords>
          </h1>
          <p className="mt-5 font-helvetica text-[18px] leading-[1.35] tracking-[-0.05em] text-cream">
            <BlurWords ref={subtextRef}>
              We design and deploy high-utility mobile applications and
              targeted digital marketplaces engineered to simplify complex
              workflows and connect regional ecosystems.
            </BlurWords>
          </p>

          <div className="mt-11 flex justify-center overflow-hidden">
            <div ref={buttonRevealRef}>
              <CTAButton href="#flagship" label="Explore Our Portfolio" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-[var(--edge-padding)] z-10 sm:bottom-16 md:bottom-20">
        <CircularText
          text="KLMATM DIGITAL • ENGINEERING PURPOSEFUL PRODUCTS • "
          spinDuration={22}
          onHover="speedUp"
          className="h-[110px] w-[110px] sm:h-[140px] sm:w-[140px] md:h-[170px] md:w-[170px] lg:h-[190px] lg:w-[190px]"
        />
      </div>

      <AnimatePresence>
        {!scrolled && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: [0, 6, 0],
              transition: {
                // Same 0.2s/1s beat as the circular text and the rest of the
                // Hero entrance, so this doesn't read as arriving separately.
                opacity: { duration: 1, delay: 0.2, ease: "easeOut" },
                y: { duration: 1.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" },
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
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
