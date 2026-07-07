export default function CTAFooter() {
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
          href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@klmatmdigital.com&su=Let%27s%20Build%20Something%20Together"
          target="_blank"
          rel="noopener noreferrer"
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
