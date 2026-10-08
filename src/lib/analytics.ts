export type AnalyticsEvent =
  | "hero_explore_work"
  | "hero_discover_brands"
  | "project_open"
  | "ecosystem_select"
  | "brand_external_click"
  | "speaking_enquiry_click"
  | "contact_route_click"
  | "contact_submit";
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function initAnalytics() {
  const id = import.meta.env.VITE_GA4_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id) || navigator.doNotTrack === "1") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
}
export function track(
  event: AnalyticsEvent,
  params: Record<string, string | number> = {},
) {
  if (import.meta.env.VITE_GA4_ID && navigator.doNotTrack !== "1")
    window.gtag?.("event", event, params);
}
