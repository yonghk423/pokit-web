"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { GA_MEASUREMENT_ID, pageview } from "@/lib/gtag";

function GoogleAnalyticsPageView({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousLocation = useRef<string | null>(null);
  const query = searchParams.toString();

  useEffect(() => {
    // Wait for the inline bootstrap; gtag can then queue hits while its library loads.
    if (!ready) return;
    const location = new URL(query ? `${pathname}?${query}` : pathname, window.location.origin).href;
    if (previousLocation.current === location) return;
    pageview(location, previousLocation.current ?? document.referrer);
    previousLocation.current = location;
  }, [ready, pathname, query]);

  return null;
}

export function GoogleAnalytics() {
  const [ready, setReady] = useState(false);
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive" onReady={() => setReady(true)}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView ready={ready} />
      </Suspense>
    </>
  );
}
