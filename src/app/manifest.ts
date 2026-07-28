import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KLMATM DIGITAL",
    short_name: "KLMATM",
    description:
      "KLMATM DIGITAL designs high-utility mobile apps and digital marketplace platforms that simplify complex workflows.",
    start_url: "/",
    display: "standalone",
    background_color: "#131210",
    theme_color: "#131210",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
