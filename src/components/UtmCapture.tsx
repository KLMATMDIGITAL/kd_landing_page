"use client";

import { useState } from "react";
import { captureUtmParams } from "@/lib/utm";

// Mounted once, site-wide — captures UTM params on whichever page a visitor
// first lands on (not just /contact), so attribution isn't lost if they
// browse before booking.
export default function UtmCapture() {
  useState(() => captureUtmParams());
  return null;
}
