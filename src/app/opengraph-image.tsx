import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "KLMATM DIGITAL — Engineering purposeful digital products.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const heading = "KLMATM DIGITAL";
  const tagline = "Engineering purposeful digital products.";

  // Bundled locally rather than fetched from Google Fonts at build time —
  // network access isn't guaranteed inside every build environment, but a
  // local file always is. Two separate fonts (not one subset shared across
  // both text blocks) so satori doesn't bleed serif-italic glyphs into the
  // sans tagline for overlapping letters.
  const [instrumentSerifItalic, interSemiBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/InstrumentSerif-Italic.ttf")),
    readFile(join(process.cwd(), "assets/Inter-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 35%, #2a241c 0%, #131210 60%)",
        }}
      >
        <div
          style={{
            fontFamily: "Instrument Serif",
            fontStyle: "italic",
            fontSize: 96,
            color: "#fff5e6",
            textAlign: "center",
            letterSpacing: -1,
          }}
        >
          {heading}
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 30,
            color: "#FFDDA9",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: instrumentSerifItalic,
          style: "italic",
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
