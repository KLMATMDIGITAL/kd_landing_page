"use client";

import { useRef } from "react";
import Link from "next/link";
import BlurText from "./BlurText";
import SlideReveal from "./SlideReveal";
import Footer from "./Footer";
import { usePageTransition } from "./PageTransitionProvider";

export default function CTAFooter() {
  // Shared trigger so the heading and button fire at the exact same scroll
  // moment — each firing off its own position (default behavior) would mean
  // whichever sits higher (the heading) triggers slightly before the other,
  // same class of bug as the Flagship phone reveal ordering.
  const ctaRef = useRef<HTMLDivElement>(null);
  const { navigate } = usePageTransition();

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/contact");
  };

  return (
    <section id="contact" className="relative w-full pb-12 pt-16 md:pb-16 md:pt-24">
      <div ref={ctaRef} className="edge flex flex-col items-center text-center">
        <BlurText
          text="Have a product in mind?"
          delay={50}
          animateBy="words"
          direction="bottom"
          triggerRef={ctaRef}
          className="justify-center font-serif italic leading-[1.1] text-cream text-glow text-[length:var(--heading-size)]"
        />
        <SlideReveal direction="top" className="mt-8" triggerRef={ctaRef}>
          <Link
            href="/contact"
            onClick={handleContactClick}
            className="group inline-flex items-center bg-glass px-9 py-3 backdrop-blur-[5px] transition-colors hover:bg-white/10"
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <span className="font-serif text-[25px] text-cream transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_20px_rgba(255,245,230,0.7)]">
              Let&apos;s Build It
            </span>
          </Link>
        </SlideReveal>
      </div>

      <Footer />
    </section>
  );
}
