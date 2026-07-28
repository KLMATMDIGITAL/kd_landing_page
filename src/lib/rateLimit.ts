// Process-local, in-memory rate limiting. Good enough for a low-traffic,
// single-tenant booking form; it resets on cold start and isn't shared
// across serverless instances/regions. If abuse traffic ever outgrows this,
// swap the Maps below for a shared store (e.g. Upstash Redis / Vercel KV).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

const bookedEmails = new Map<string, number>();

export function hasRecentBooking(email: string): boolean {
  const expiresAt = bookedEmails.get(email);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    bookedEmails.delete(email);
    return false;
  }
  return true;
}

export function markBooked(email: string, windowMs: number) {
  bookedEmails.set(email, Date.now() + windowMs);
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
