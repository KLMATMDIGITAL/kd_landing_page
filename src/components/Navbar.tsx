"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Work", href: "#flagship" },
  { label: "Approach", href: "#focus-areas" },
  { label: "Contact", href: "#contact" },
];

const GAP_PX = 32; // matches gap-8, the same spacing every other nav item shares

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroHeight, setHeroHeight] = useState(900);
  const [navXRange, setNavXRange] = useState<[number, number]>([0, 0]);
  const [kdTextWidth, setKdTextWidth] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const kdRef = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();

  // 0 at the top of the hero, 1 well before the hero ends — the whole nav transition
  // finishes early and fast, tracking the scrollbar directly with no spring/snap.
  const navProgress = useTransform(scrollY, [0, heroHeight * 0.32], [0, 1], {
    clamp: true,
  });

  const kdWidth = useTransform(navProgress, [0, 1], [0, kdTextWidth]);
  const kdMarginRight = useTransform(navProgress, [0, 1], [-GAP_PX, 0]);
  const kdOpacity = useTransform(navProgress, [0, 1], [0, 1]);
  const logoOpacity = useTransform(navProgress, [0, 1], [1, 0]);
  const navX = useTransform(navProgress, [0, 1], navXRange);

  useEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      const nav = navRef.current;
      const kd = kdRef.current;
      if (row && nav && kd) {
        const rowWidth = row.clientWidth;
        const measuredKdTextWidth = kd.scrollWidth;
        // Solve for the nav's width with KD fully collapsed, whatever the current
        // scroll position actually is (robust to reloading mid-scroll).
        const navWidthNow = nav.offsetWidth;
        const navWidthAtStart =
          navWidthNow - kdWidth.get() - kdMarginRight.get() - GAP_PX;
        const navWidthAtEnd = navWidthAtStart + measuredKdTextWidth + GAP_PX;
        // At progress 0 it's already flush right (no shift needed); at progress 1 it
        // needs to have moved left by however much centers the now-wider pill.
        const shiftAtEnd = (rowWidth - navWidthAtEnd) / 2;
        setNavXRange([0, -shiftAtEnd]);
        setKdTextWidth(measuredKdTextWidth);
      }
      setHeroHeight(Math.max(window.innerHeight, 720));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 edge py-6 md:py-8">
      <div ref={rowRef} className="relative flex h-12 items-center">
        <motion.div
          style={{ opacity: logoOpacity }}
          className="absolute left-0 flex flex-col leading-[0.95] font-helvetica"
        >
          <span className="text-[20px] font-bold tracking-wide text-cream">
            KLMATM
          </span>
          <span className="text-[25px] font-normal tracking-wide text-cream">
            DIGITAL
          </span>
        </motion.div>

        {/* Desktop nav — elongates and slides toward center as "KD" grows into its own space */}
        <motion.nav
          ref={navRef}
          style={{ x: navX }}
          className="relative ml-auto hidden items-center gap-8 overflow-hidden rounded-[5px] bg-glass py-3.5 px-8 backdrop-blur-[5px] md:flex"
        >
          <motion.a
            ref={kdRef}
            href="/#hero"
            aria-label="Back to top"
            style={{
              width: kdWidth,
              marginRight: kdMarginRight,
              opacity: kdOpacity,
            }}
            className="inline-block overflow-hidden whitespace-nowrap font-helvetica text-[17px] font-bold text-cream"
          >
            KD
          </motion.a>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-helvetica text-[17px] font-normal text-cream/90 transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="ml-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-[20px] bg-glass backdrop-blur-[5px] md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            {menuOpen ? (
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="text-cream"
              />
            ) : (
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="text-cream"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex flex-col gap-1 overflow-hidden rounded-[20px] bg-glass p-3 backdrop-blur-[5px] md:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-helvetica text-[20px] font-regular text-cream/90 transition-colors hover:text-cream rounded-lg px-3 py-2.5 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
