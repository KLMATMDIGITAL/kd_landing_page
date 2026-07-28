import type { Metadata } from "next";
import PageGrainGradient from "@/components/PageGrainGradient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — KLMATM DIGITAL",
  description: "The terms that govern your use of the KLMATM DIGITAL website.",
  alternates: {
    canonical: "/terms",
  },
};

const sectionClass = "mt-10 first:mt-0";
const headingClass = "font-serif text-[1.5rem] text-white";
const bodyClass = "mt-3 font-helvetica text-[16px] leading-[1.6] text-cream/75";

export default function TermsPage() {
  return (
    <main className="relative w-full overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40">
      <PageGrainGradient />

      <div className="edge relative z-10">
        <div className="mx-auto max-w-[720px]">
          <h1 className="font-serif italic text-[2.75rem] leading-[1.15] text-cream text-glow md:text-[3.5rem]">
            Terms of Service
          </h1>
          <p className="mt-4 font-helvetica text-[14px] text-cream/50">
            Last updated: 2026
          </p>

          <div className={sectionClass}>
            <h2 className={headingClass}>Acceptance of Terms</h2>
            <p className={bodyClass}>
              By using this website, you agree to these terms. If you do not
              agree, please do not use the site.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Use of the Site</h2>
            <p className={bodyClass}>
              This site is provided to share information about KLMATM
              DIGITAL and to let visitors book an introductory call with us.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>No Engagement Until Agreed Separately</h2>
            <p className={bodyClass}>
              Booking a call through this site does not, by itself, create a
              contract for services. Any project engagement is governed by a
              separate, signed agreement between you and KLMATM DIGITAL, LLC.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Intellectual Property</h2>
            <p className={bodyClass}>
              The content, design, and branding of this site are owned by
              KLMATM DIGITAL, LLC and may not be reproduced without
              permission.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Third-Party Services</h2>
            <p className={bodyClass}>
              Call booking is provided through Cal.com. By booking a call,
              you also agree to Cal.com&apos;s own terms of service.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Limitation of Liability</h2>
            <p className={bodyClass}>
              This site and its content are provided &quot;as is&quot;
              without warranties of any kind. KLMATM DIGITAL, LLC is not
              liable for any damages arising from your use of this site.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Governing Law</h2>
            <p className={bodyClass}>
              These terms are governed by the laws of the Commonwealth of
              Virginia, USA.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Changes to These Terms</h2>
            <p className={bodyClass}>
              We may update these terms from time to time. The date at the
              top of this page reflects the most recent revision.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Contact</h2>
            <p className={bodyClass}>
              KLMATM DIGITAL, LLC — Henrico, Virginia, USA
              <br />
              contact@klmatmdigital.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
