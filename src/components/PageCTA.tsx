"use client";

import BlurText from "./BlurText";
import Reveal from "./Reveal";
import CTAButton from "./CTAButton";
import { usePageTransition } from "./PageTransitionProvider";

// The same "question, then button" bookend the homepage ends on (Hero's own
// heading+button, CTAFooter) — reused here so About/Approach close on a
// proper CTA instead of just running out of content.
export default function PageCTA({
  question,
  buttonLabel,
  href,
}: {
  question: string;
  buttonLabel: string;
  href: string;
}) {
  const { navigate } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <BlurText
        text={question}
        delay={50}
        animateBy="words"
        direction="bottom"
        className="justify-center font-serif italic leading-[1.1] text-cream text-glow text-[length:var(--heading-size)]"
      />
      <Reveal y={20} duration={0.7} delay={0.15} className="mt-11">
        <CTAButton href={href} label={buttonLabel} onClick={handleClick} />
      </Reveal>
    </div>
  );
}
