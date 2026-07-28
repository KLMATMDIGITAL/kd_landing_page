"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { getGsap } from "@/lib/gsap";
import { usePageTransition } from "./PageTransitionProvider";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Approach", href: "/approach" },
  { label: "Contact", href: "/contact" },
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
  const logoRevealRef = useRef<HTMLDivElement>(null);
  const navPillRevealRef = useRef<HTMLDivElement>(null);
  const navPillWrapRef = useRef<HTMLDivElement>(null);
  const mobileToggleRevealRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { navigate } = usePageTransition();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  // One-time entrance on load — hard position slides, no opacity involved, so
  // there's no cross-fade, just an abrupt move into place. The logo slides
  // down from just above its own position; the nav pill / mobile menu toggle
  // slide up from just below theirs — both masked by an overflow-hidden
  // wrapper around them.
  //
  // The nav pill's own wrapper mask is temporary, unlike the others: once the
  // reveal finishes, the pill grows wider and shifts left as "KD" collapses
  // in on scroll, and a permanently-clipped wrapper would cut it off mid-scroll.
  // So that one wrapper's overflow-hidden is applied only for the reveal,
  // then cleared.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const logoReveal = logoRevealRef.current;
    const navPillReveal = navPillRevealRef.current;
    const navPillWrap = navPillWrapRef.current;
    const mobileToggleReveal = mobileToggleRevealRef.current;
    if (!logoReveal || !navPillReveal || !navPillWrap || !mobileToggleReveal)
      return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.set(logoReveal, { yPercent: -100 });
      gsap.set(navPillWrap, { overflow: "hidden" });
      gsap.set([navPillReveal, mobileToggleReveal], { yPercent: 100 });
      gsap.to(logoReveal, {
        yPercent: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.to([navPillReveal, mobileToggleReveal], {
        yPercent: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(navPillWrap, { overflow: "visible" });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Driven manually instead of framer-motion's own useScroll(): Lenis takes over
  // native scroll entirely when active, so the native "scroll" event this would
  // normally rely on never fires. Native listener below is the fallback path for
  // when Lenis is off (prefers-reduced-motion); the useLenis callback is the real
  // path the rest of the time.
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  const lenis = useLenis((lenisInstance) => {
    scrollY.set(lenisInstance.scroll);
  });

  // About/Approach/Contact are real pages now, not in-page anchors — clicking
  // one runs the curtain-doors transition and pushes the new route. The KD
  // logo stays dual-purpose: smooth-scroll to the top on the home page
  // itself (unchanged Lenis behavior), or curtain-transition home from any
  // other page.
  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      lenis?.scrollTo("#hero");
    } else {
      navigate("/");
    }
  };

  const goToPage = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  // Hover always wins: while hovering any link, that one link is full-bright
  // and the other two dim — including the actual current page's own link.
  // With nothing hovered, the current page's link (if it's one of these
  // three) stays bright and the other two dim; on the home page, where none
  // of them is "current", all three stay at full brightness.
  const isLinkDim = (href: string) => {
    if (hoveredHref) return hoveredHref !== href;
    const onOneOfTheseLinks = LINKS.some((l) => l.href === pathname);
    if (!onOneOfTheseLinks) return false;
    return pathname !== href;
  };

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

  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 edge py-6 md:py-8">
      <div ref={rowRef} className="relative flex h-12 items-center">
        {isHome ? (
          <>
            <div className="absolute left-0 overflow-hidden">
              <div ref={logoRevealRef}>
                <motion.a
                  href="/"
                  aria-label="Back to top"
                  onClick={goHome}
                  style={{ opacity: logoOpacity }}
                  className="flex flex-col leading-[0.95] font-helvetica"
                >
                  <span className="text-[20px] font-bold tracking-wide text-cream">
                    KLMATM
                  </span>
                  <span className="text-[25px] font-normal tracking-wide text-cream">
                    DIGITAL
                  </span>
                </motion.a>
              </div>
            </div>

            {/* Desktop nav — elongates and slides toward center as "KD" grows into its own space */}
            <div ref={navPillWrapRef} className="relative ml-auto hidden md:block">
              <div ref={navPillRevealRef}>
                <motion.nav
                  ref={navRef}
                  style={{ x: navX }}
                  className="flex items-center gap-8 overflow-hidden rounded-[5px] bg-glass py-3.5 px-8 backdrop-blur-[5px]"
                >
                  <motion.a
                    ref={kdRef}
                    href="/"
                    aria-label="Back to top"
                    onClick={goHome}
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
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => goToPage(e, link.href)}
                      onMouseEnter={() => setHoveredHref(link.href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      animate={{ opacity: isLinkDim(link.href) ? 0.4 : 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="font-helvetica text-[17px] font-normal text-cream"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </motion.nav>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Secondary pages: no scroll-driven morph at all — a small,
                static "KD" mark on mobile, and one centered pill (KD + links,
                already in its "contracted" shape) on desktop. */}
            <Link
              href="/"
              aria-label="Back to top"
              onClick={goHome}
              className="absolute left-0 font-helvetica text-[17px] font-bold text-cream md:hidden"
            >
              KD
            </Link>

            <div className="mx-auto hidden md:block">
              <nav className="flex items-center gap-8 rounded-[5px] bg-glass py-3.5 px-8 backdrop-blur-[5px]">
                <Link
                  href="/"
                  aria-label="Back to top"
                  onClick={goHome}
                  className="font-helvetica text-[17px] font-bold text-cream"
                >
                  KD
                </Link>
                {LINKS.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => goToPage(e, link.href)}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onMouseLeave={() => setHoveredHref(null)}
                    animate={{ opacity: isLinkDim(link.href) ? 0.4 : 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="font-helvetica text-[17px] font-normal text-cream"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* Mobile menu toggle */}
        <div className="ml-auto overflow-hidden rounded-[20px] md:hidden">
          <div ref={mobileToggleRevealRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[20px] bg-glass backdrop-blur-[5px]"
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
        </div>
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
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  goToPage(e, link.href);
                  setMenuOpen(false);
                }}
                animate={{ opacity: isLinkDim(link.href) ? 0.4 : 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="font-helvetica text-[20px] font-regular text-cream rounded-lg px-3 py-2.5 hover:bg-white/5"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
