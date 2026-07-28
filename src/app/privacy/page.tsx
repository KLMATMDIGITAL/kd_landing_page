import type { Metadata } from "next";
import PageGrainGradient from "@/components/PageGrainGradient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — KLMATM DIGITAL",
  description: "How KLMATM DIGITAL collects, uses, and protects your information.",
  alternates: {
    canonical: "/privacy",
  },
};

const sectionClass = "mt-10 first:mt-0";
const headingClass = "font-serif text-[1.5rem] text-white";
const bodyClass = "mt-3 font-helvetica text-[16px] leading-[1.6] text-cream/75";

export default function PrivacyPage() {
  return (
    <main className="relative w-full overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40">
      <PageGrainGradient />

      <div className="edge relative z-10">
        <div className="mx-auto max-w-[720px]">
          <h1 className="font-serif italic text-[2.75rem] leading-[1.15] text-cream text-glow md:text-[3.5rem]">
            Privacy Policy
          </h1>
          <p className="mt-4 font-helvetica text-[14px] text-cream/50">
            Last updated: 2026
          </p>

          <div className={sectionClass}>
            <h2 className={headingClass}>Information We Collect</h2>
            <p className={bodyClass}>
              When you book a call through this site, we collect your name,
              email address, and time zone. We do not collect payment
              information on this site.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>How We Use Your Information</h2>
            <p className={bodyClass}>
              We use this information to schedule and confirm your call, send
              calendar invites and reminders, and respond to your inquiries.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Third-Party Services</h2>
            <p className={bodyClass}>
              Scheduling is handled by Cal.com. Your name, email, and selected
              time are shared with Cal.com to create the booking and send
              confirmations and reminders. Their handling of this data is
              governed by Cal.com&apos;s own privacy policy.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Cookies &amp; Analytics</h2>
            <p className={bodyClass}>
              We use Vercel Speed Insights, a privacy-focused performance
              monitoring tool that reports aggregated page performance
              without collecting personally identifiable information. We do
              not currently use advertising or tracking cookies.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Data Retention</h2>
            <p className={bodyClass}>
              We retain booking-related information for as long as necessary
              to provide our services and to comply with legal obligations.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Your Rights</h2>
            <p className={bodyClass}>
              You may request access to, correction of, or deletion of your
              personal information at any time by emailing{" "}
              <a
                href="mailto:contact@klmatmdigital.com"
                className="text-[#FFDDA9] underline underline-offset-2"
              >
                contact@klmatmdigital.com
              </a>
              .
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Children&apos;s Privacy</h2>
            <p className={bodyClass}>
              This site is not directed at children, and we do not knowingly
              collect information from children.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>Changes to This Policy</h2>
            <p className={bodyClass}>
              We may update this policy from time to time. The date at the
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
