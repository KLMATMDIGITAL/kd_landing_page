"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransitionProvider";

// Mobile-only floating CTA so the booking flow is always one tap away
// without scrolling back to a nav link or in-page button. Hidden on the
// contact page itself since the booking form is already right there.
export default function StickyMobileCta() {
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  if (pathname === "/contact") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 md:hidden"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <Link
        href="/contact"
        onClick={(e) => {
          e.preventDefault();
          navigate("/contact");
        }}
        className="group inline-flex items-center bg-glass px-7 py-3 shadow-lg backdrop-blur-[8px] transition-colors hover:bg-white/10"
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <span className="font-serif text-[17px] text-cream">Book a Call</span>
      </Link>
    </div>
  );
}
