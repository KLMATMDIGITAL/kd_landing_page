// Pushes to window.dataLayer if a tag manager is present, otherwise a safe
// no-op. Lets conversion events (e.g. a confirmed booking) fire regardless
// of whether GTM/GA4 is wired up yet — nothing breaks either way.
export function pushDataLayerEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}
