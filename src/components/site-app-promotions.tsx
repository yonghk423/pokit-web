import { QRCodeSVG } from "qrcode.react";

import type { Locale } from "@/i18n/config";
const daylightAppStoreUrl =
  "https://apps.apple.com/kr/app/daylight-photo-diary/id6762331629";

const downloadCopy = {
  ko: { action: "App Store에서 받기", scan: "QR 코드를 스캔해 Daylight를 만나보세요" },
  en: { action: "Download on the App Store", scan: "Scan to download Daylight" },
  ja: { action: "App Storeでダウンロード", scan: "QRコードを読み取ってDaylightをダウンロード" },
  "zh-TW": { action: "在 App Store 下載", scan: "掃描 QR 碼下載 Daylight" },
};

export function SiteAppPromotions({ locale }: { locale: Locale }) {
  const copy = downloadCopy[locale];

  return (
    <aside
      aria-label={copy.action}
    >
      <a
        href={daylightAppStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-fit items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <QRCodeSVG
          value={daylightAppStoreUrl}
          size={88}
          marginSize={4}
          level="M"
          bgColor="#ffffff"
          fgColor="#302d29"
          title={copy.scan}
          className="shrink-0 rounded-md"
        />
        <span className="flex flex-col gap-1 text-left">
          <strong className="text-lg text-neutral-900">Daylight</strong>
          <span className="text-sm font-medium text-neutral-900">{copy.action} ↗</span>
          <span className="text-xs text-neutral-600">{copy.scan}</span>
        </span>
      </a>
    </aside>
  );
}
