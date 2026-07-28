import Link from "next/link";

// Copyright/address block extracted from CTAFooter so it can also sit at
// the bottom of secondary pages (About, Approach, Contact) without dragging
// along CTAFooter's own "Have a product in mind?" CTA, which those pages
// already have their own version of.
export default function Footer({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? "text-[#1a1918]" : "text-cream";
  const linkColor = dark ? "text-[#1a1918]/70" : "text-cream/70";

  return (
    <div className="edge mt-24 flex flex-col items-center gap-3 pt-6 text-center sm:mt-32 sm:flex-row sm:items-end sm:justify-between sm:text-left">
      <div className="flex flex-col items-center gap-1.5 sm:items-start">
        <p className={`font-helvetica text-[12px] ${textColor}`}>
          © 2026 KLMATM DIGITAL, LLC. All rights reserved.
        </p>
        <div className={`flex gap-3 font-helvetica text-[12px] ${linkColor}`}>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
      <div className={`font-helvetica text-[12px] leading-relaxed ${textColor} sm:text-right`}>
        <p>Henrico, Virginia, USA</p>
        <p>contact@klmatmdigital.com</p>
      </div>
    </div>
  );
}
