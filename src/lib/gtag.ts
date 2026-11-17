export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export function pageview(url: string, referrer: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_location: url,
    page_title: document.title,
    page_referrer: referrer,
  });
}

/** Measures promotional link clicks, not App Store installs. */
export function trackAppPromotion(placement: string, destination: "store" | "try" | "intro", locale: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "app_promotion_click", { placement, destination, app_locale: locale });
}
