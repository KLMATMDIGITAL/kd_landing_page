const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const STORAGE_KEY = "kd_utm";

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

// Captures UTM params from the URL on first landing and persists them in
// sessionStorage, so attribution survives navigation from an ad/social link
// on the homepage through to a booking completed on /contact later in the
// same session — without needing a database.
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const found: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }

  if (Object.keys(found).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  }
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
