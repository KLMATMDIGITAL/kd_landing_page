import { NextRequest, NextResponse } from "next/server";
import {
  CALCOM_API_BASE,
  CALCOM_EVENT_SLUG,
  CALCOM_USERNAME,
  calcomApiKey,
} from "@/lib/calcom";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const timeZone = searchParams.get("timeZone");

  if (!start || !end || !timeZone) {
    return NextResponse.json(
      { error: "Missing required query params: start, end, timeZone." },
      { status: 400 }
    );
  }

  if (!rateLimit(`slots:ip:${clientIp(request)}`, 30, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
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

  const url = new URL(`${CALCOM_API_BASE}/slots`);
  url.searchParams.set("eventTypeSlug", CALCOM_EVENT_SLUG);
  url.searchParams.set("username", CALCOM_USERNAME);
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  url.searchParams.set("timeZone", timeZone);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2024-09-04",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.message || "Failed to fetch availability." },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
