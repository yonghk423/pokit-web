"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import { isPokitAppContext } from "@/lib/pokit-bridge";

type Props = {
  locale: Locale;
  copy: Dictionary["article"]["addToPokit"];
  className?: string;
};

/** Shared browser download panel for article and tool previews. */
export function AppInstallCta({ locale, copy, className }: Props) {
  const [inApp, setInApp] = useState(false);
  const storeUrl = appStoreUrl(locale);
  useEffect(() => { setInApp(isPokitAppContext()); }, []);
  if (inApp) return null;

  return (
    <div className={cn("mt-5 max-w-[42rem] max-nav:mx-1 max-nav:mb-[max(1.75rem,env(safe-area-inset-bottom))]", className)}>
        <div className="rounded-[0.85rem] border border-ink/10 bg-ink/[0.03] px-3.5 pt-3 pb-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="m-0 font-sans text-[0.8rem] leading-snug text-ink/75">
                {copy.fallback}
              </p>
              <div className="mt-2.5 hidden max-nav:block">
                <AppStoreBadge locale={locale} label={copy.download} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 rounded-md bg-white px-2 py-1.5 ring-1 ring-ink/8 max-nav:hidden">
              <QRCodeSVG
                value={storeUrl}
                size={56}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
              <p className="m-0 max-w-[4.5rem] text-center font-sans text-[0.55rem] font-medium leading-tight text-ink/50 normal-case">
                {copy.qrHint}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
