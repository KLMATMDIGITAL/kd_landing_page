import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@next/third-parties/google";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import Navbar from "@/components/Navbar";
import OrganizationSchema from "@/components/OrganizationSchema";
import UtmCapture from "@/components/UtmCapture";
import StickyMobileCta from "@/components/StickyMobileCta";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://klmatmdigital.com"),
  title: "KLMATM DIGITAL — Engineering purposeful digital products.",
  description:
    "KLMATM DIGITAL designs high-utility mobile apps and digital marketplace platforms that simplify complex workflows and connect regional ecosystems.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KLMATM DIGITAL — Engineering purposeful digital products.",
    description:
      "We design and deploy high-utility mobile applications and targeted digital marketplaces engineered to simplify complex workflows and connect regional ecosystems.",
    url: "/",
    siteName: "KLMATM DIGITAL",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLMATM DIGITAL — Engineering purposeful digital products.",
    description:
      "We design and deploy high-utility mobile applications and targeted digital marketplaces engineered to simplify complex workflows and connect regional ecosystems.",
  },
  verification: { google: "y0oKH5wbS7MHs8P3-5jJAa_vBID61bWVJJM3JSX7nZA" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-bg text-cream font-sans"
        suppressHydrationWarning
      >
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        <OrganizationSchema />
        <UtmCapture />
        <SmoothScroll />
        <PageTransitionProvider>
          <Navbar />
          {children}
          <StickyMobileCta />
        </PageTransitionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
