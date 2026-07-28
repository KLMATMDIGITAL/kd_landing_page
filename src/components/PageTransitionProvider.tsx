"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

type PageTransitionContextValue = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null
);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider"
    );
  }
  return ctx;
}

const DOOR_DURATION = 0.7;
const DOOR_EASE = [0.65, 0, 0.35, 1] as const;
// Gives the newly-navigated page a beat to paint under full cover before the
// doors start opening, so there's never a flash of half-rendered content.
const REVEAL_HOLD_MS = 180;
// Safety net: if the animation's own promise never settles for any reason,
// this guarantees the sequence still advances instead of permanently
// wedging navigate() behind a pending transition that never clears.
const SAFETY_TIMEOUT_MS = DOOR_DURATION * 1000 + 1000;

// The curtain-door transition briefly covers the entire viewport in solid
// gold. iOS Safari's dynamic status-bar tinting samples page color around
// navigation and can latch onto that gold instead of the static theme-color
// meta tag once the doors reopen — toggling the attribute nudges Safari to
// re-read and re-sync it.
function reaffirmThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const current = meta.getAttribute("content");
  meta.setAttribute("content", "");
  requestAnimationFrame(() => meta.setAttribute("content", current ?? "#131210"));
}

function settleWithin<T>(promise: Promise<T>, ms: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    promise.then(finish, finish);
    setTimeout(finish, ms);
  });
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const [active, setActive] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);
  const coveredRef = useRef(false);
  const openedRef = useRef(true);

  const openDoors = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    coveredRef.current = false;
    pendingHrefRef.current = null;

    settleWithin(
      Promise.all([
        leftControls.start({
          x: "-100%",
          transition: { duration: DOOR_DURATION, ease: DOOR_EASE },
        }),
        rightControls.start({
          x: "100%",
          transition: { duration: DOOR_DURATION, ease: DOOR_EASE },
        }),
      ]),
      SAFETY_TIMEOUT_MS
    ).then(() => {
      setActive(false);
      reaffirmThemeColor();
    });
  }, [leftControls, rightControls]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || pendingHrefRef.current) return;

      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        router.push(href);
        return;
      }

      pendingHrefRef.current = href;
      openedRef.current = false;
      setActive(true);

      settleWithin(
        Promise.all([
          leftControls.start({
            x: "0%",
            transition: { duration: DOOR_DURATION, ease: DOOR_EASE },
          }),
          rightControls.start({
            x: "0%",
            transition: { duration: DOOR_DURATION, ease: DOOR_EASE },
          }),
        ]),
        SAFETY_TIMEOUT_MS
      ).then(() => {
        coveredRef.current = true;
        router.push(href);
        // Fallback in case router.push never resolves into a matching
        // pathname (e.g. a navigation error) — the doors still open instead
        // of leaving the site permanently covered and unnavigable.
        setTimeout(openDoors, SAFETY_TIMEOUT_MS + REVEAL_HOLD_MS);
      });
    },
    [pathname, router, leftControls, rightControls, openDoors]
  );

  useEffect(() => {
    if (!coveredRef.current || pendingHrefRef.current !== pathname) return;
    const t = setTimeout(openDoors, REVEAL_HOLD_MS);
    return () => clearTimeout(t);
  }, [pathname, openDoors]);

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
      <motion.div
        initial={{ x: "-100%" }}
        animate={leftControls}
        className={`fixed inset-y-0 left-0 z-[999] w-1/2 bg-[#FFDDA9] ${
          active ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={rightControls}
        className={`fixed inset-y-0 right-0 z-[999] w-1/2 bg-[#FFDDA9] ${
          active ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
    </PageTransitionContext.Provider>
  );
}
