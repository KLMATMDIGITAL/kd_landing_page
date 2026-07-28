// Not secrets — cal.com/klmatmdigital/intro is a public booking page URL.
export const CALCOM_USERNAME = "klmatmdigital";
export const CALCOM_EVENT_SLUG = "intro";

export const CALCOM_API_BASE = "https://api.cal.com/v2";

export function calcomApiKey(): string {
  const key = process.env.CALCOM_API_KEY;
  if (!key) {
    throw new Error(
      "CALCOM_API_KEY is not set — add it to .env.local (see the comment there for where to find it)."
    );
  }
  return key;
}
