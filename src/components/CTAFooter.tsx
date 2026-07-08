"use client";

const EMAIL = "contact@klmatmdigital.com";
const SUBJECT = "Let's Build Something Together";

export default function CTAFooter() {
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(SUBJECT);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Try the Gmail app's own deep link first; if it's not installed, nothing
      // happens and the page stays visible, so fall back to a plain mailto —
      // which opens whichever mail app/client is actually available.
      const gmailAppUrl = `googlegmail:///co?to=${EMAIL}&subject=${subject}`;
      const mailtoUrl = `mailto:${EMAIL}?subject=${subject}`;
      let leftPage = false;
      const onVisibilityChange = () => {
        if (document.hidden) leftPage = true;
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.location.href = gmailAppUrl;
      setTimeout(() => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (!leftPage) {
          window.location.href = mailtoUrl;
        }
      }, 600);
    } else {
      // No fs=1 — opens as Gmail's normal compact compose popup, not full-screen.
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=${subject}`;
      window.open(gmailWebUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="contact" className="relative w-full pb-12 pt-16 md:pb-16 md:pt-24">
      <div className="edge flex flex-col items-center text-center">
        <h2
          className="font-serif italic leading-[1.1] text-cream text-glow"
          style={{ fontSize: "var(--heading-size)" }}
        >
          Have a product in mind?
        </h2>
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
          onClick={handleContactClick}
          className="group mt-8 inline-flex items-center bg-glass px-9 py-3 backdrop-blur-[5px] transition-colors hover:bg-white/10"
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
        </a>
      </div>

      <div className="edge mt-24 flex flex-col items-center gap-3 pt-6 text-center sm:mt-32 sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <p className="font-helvetica text-[12px] text-cream">
          © 2026 KLMATM DIGITAL, LLC. All rights reserved.
        </p>
        <div className="font-helvetica text-[12px] leading-relaxed text-cream sm:text-right">
          <p>Henrico, Virginia, USA</p>
          <p>contact@klmatmdigital.com</p>
        </div>
      </div>
    </section>
  );
}
