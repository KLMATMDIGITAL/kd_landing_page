import { NextRequest, NextResponse } from "next/server";
import {
  CALCOM_API_BASE,
  CALCOM_EVENT_SLUG,
  CALCOM_USERNAME,
  calcomApiKey,
} from "@/lib/calcom";
import { isValidEmail, isValidName } from "@/lib/bookingValidation";
import { clientIp, hasRecentBooking, markBooked, rateLimit } from "@/lib/rateLimit";

const MAX_DAYS_AHEAD = 30; // generous upper bound beyond the 14-day picker window
const REBOOK_WINDOW_MS = 24 * 60 * 60 * 1000;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

function sanitizeUtm(utm: unknown): Record<string, string> {
  if (!utm || typeof utm !== "object") return {};
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = (utm as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.slice(0, 200);
    }
  }
  return out;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { start, name, email, timeZone, company, utm } = body ?? {};

  // Honeypot: a hidden field real visitors never see or fill in.
  if (typeof company === "string" && company.trim().length > 0) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!start || !name || !email || !timeZone) {
    return NextResponse.json(
      { error: "Missing required fields: start, name, email, timeZone." },
      { status: 400 }
    );
  }

  if (!isValidName(name)) {
    return NextResponse.json(
      { error: "Please enter a valid name." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (typeof timeZone !== "string" || timeZone.length > 64) {
    return NextResponse.json({ error: "Invalid time zone." }, { status: 400 });
  }
  try {
    if (!Intl.supportedValuesOf("timeZone").includes(timeZone)) {
      return NextResponse.json({ error: "Invalid time zone." }, { status: 400 });
    }
  } catch {
    // Intl.supportedValuesOf unavailable in this runtime — skip rather than fail closed.
  }

  const startMs = new Date(start).getTime();
  const now = Date.now();
  const maxAheadMs = now + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000;
  if (Number.isNaN(startMs) || startMs <= now || startMs > maxAheadMs) {
    return NextResponse.json(
      { error: "Invalid or out-of-range time slot." },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const ip = clientIp(request);

  if (!rateLimit(`book:ip:${ip}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429 }
    );
  }
  if (!rateLimit(`book:email:${normalizedEmail}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many booking attempts with this email. Please try again later." },
      { status: 429 }
    );
  }
  if (hasRecentBooking(normalizedEmail)) {
    return NextResponse.json(
      {
        error:
          "You already have an upcoming call booked with us. Check your email for the confirmation — it includes a link to reschedule if you need a different time.",
      },
      { status: 429 }
    );
  }

  let apiKey: string;
  try {
    apiKey = calcomApiKey();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server misconfigured." },
      { status: 500 }
    );
  }

  const res = await fetch(`${CALCOM_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "cal-api-version": "2026-02-25",
    },
    body: JSON.stringify({
      eventTypeSlug: CALCOM_EVENT_SLUG,
      username: CALCOM_USERNAME,
      start,
      attendee: {
        name: name.trim(),
        email: normalizedEmail,
        timeZone,
      },
      metadata: sanitizeUtm(utm),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.message || "Failed to create booking." },
      { status: res.status }
    );
  }

  markBooked(normalizedEmail, REBOOK_WINDOW_MS);

  return NextResponse.json(data);
}
