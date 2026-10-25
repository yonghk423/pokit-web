"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { AppDownloadMessages } from "@/i18n/get-app-download-messages";

const QR_SIZE = 68;

type Props = {
  locale: Locale;
  messages: AppDownloadMessages;
};

/** Compact App Store + QR cluster for the home hero title row. */
export function HomeHeroDownload({ locale, messages }: Props) {
  const t = createTranslator(messages);
  return (
    <div
      data-hide-in-pokit-app
      className="flex shrink-0 flex-col items-end gap-2.5 max-nav:mt-3 max-nav:items-start"
    >
      <AppStoreBadge locale={locale} label={t("App Store에서 다운로드")} size="compact" />
      <div className="flex items-start gap-2.5">
        <div className="flex shrink-0 flex-col items-end gap-2 max-nav:items-start">
          <p className="m-0 mt-0.5 whitespace-nowrap text-right font-serif text-[0.78rem] font-normal italic leading-[1.45] tracking-[-0.02em] text-ink/60 max-nav:text-left">
            {t("POKIT - 루틴 습관 투두리스트")}
          </p>
          <Image
            src="/pokit-mark.png?v=20261025"
            alt=""
            width={QR_SIZE}
            height={QR_SIZE}
            unoptimized
            className="size-[68px] rounded-[0.35rem] object-cover ring-1 ring-ink/6"
          />
        </div>
        <a
          href={appStoreUrl(locale)}
          aria-label={t("App Store에서 다운로드")}
          className="hero-qr-nudge flex w-[6.75rem] flex-col items-center gap-1 rounded-[0.9rem] bg-white px-1.5 py-1.5 no-underline ring-1 ring-ink/6"
        >
          <p className="m-0 text-center font-sans text-[0.55rem] font-semibold tracking-[0.1em] text-green uppercase">
            {t("지금 스캔해 보세요")}
          </p>
          <div className="rounded-[0.35rem] bg-white p-0.5">
            <QRCodeSVG
              value={appStoreUrl(locale)}
              size={QR_SIZE}
              bgColor="#ffffff"
              fgColor="#181a2e"
              role="img"
              aria-label={t("POKIT 앱 App Store QR 코드")}
            />
          </div>
          <p className="m-0 px-0.5 text-center font-sans text-[0.55rem] font-semibold leading-snug tracking-[-0.01em] text-ink/65">
            {t("카메라로 비추면 바로 설치돼요")}
          </p>
        </a>
      </div>
    </div>
  );
}
