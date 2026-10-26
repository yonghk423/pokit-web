"use client";

import Image from "next/image";
import Link from "next/link";
import { appName } from "@/config/site";
import { withLocale } from "@/lib/locale-path";
import { trackAppPromotion } from "@/lib/gtag";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { AppInstallMessages } from "@/i18n/get-app-install-messages";
import { cn } from "@/lib/cn";
import { isPokitAppContext } from "@/lib/pokit-bridge";

type Props = {
  locale: Locale;
  messages: AppInstallMessages;
  className?: string;
};

/** Shared browser download panel for article and tool previews. */
export function AppInstallCta({ locale, messages, className }: Props) {
  const t = createTranslator(messages);
  const [inApp, setInApp] = useState(false);
  const storeUrl = appStoreUrl(locale);
  useEffect(() => { setInApp(isPokitAppContext()); }, []);
  if (inApp) return null;

  return (
    <div className={cn("mt-5 max-w-[42rem] max-nav:mx-1 max-nav:mb-[max(1.75rem,env(safe-area-inset-bottom))]", className)}>
        <div className="rounded-[1rem] border border-black/10 bg-[#efebe4] px-5 py-5" data-app-promotion="reading-panel">
          <div className="mb-4 flex items-center gap-3"><Image src="/icon.png" alt="" width={42} height={42} className="rounded-[10px]" /><strong className="text-[1rem] tracking-[-0.03em]">{appName(locale)}</strong><span className="text-[0.6rem] text-black/50">iPhone &amp; iPad</span></div>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="m-0 font-sans text-[0.8rem] leading-snug text-ink/75">
                {t("POKIT 앱에서 일상 루틴을 기록하고, 웰니스를 지켜 보세요.")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span onClickCapture={() => trackAppPromotion("reading-panel", "store", locale)}><AppStoreBadge locale={locale} label={t("App Store에서 다운로드")} size="compact" /></span>
                <Link href={`${withLocale(locale, "/app")}#try-pokit`} onClick={() => trackAppPromotion("reading-panel", "try", locale)} className="text-[0.75rem] font-semibold underline underline-offset-4">{t("앱 직접 체험하기")} ↗</Link>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 rounded-md bg-white px-2 py-1.5 ring-1 ring-ink/8 max-nav:hidden">
              <QRCodeSVG
                value={storeUrl}
                size={56}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={t("POKIT 앱 App Store QR 코드")}
              />
              <p className="m-0 max-w-[4.5rem] text-center font-sans text-[0.55rem] font-medium leading-tight text-ink/50 normal-case">
                {t("휴대폰 카메라로 스캔해서 설치")}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
