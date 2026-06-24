"use client";

import { QRCodeSVG } from "qrcode.react";

import { site } from "@/config/site";
import { cn, monoContainer } from "@/lib/cn";

export function AppDownload() {
  return (
    <section
      id="app"
      className={cn(
        monoContainer,
        "mt-[2.7rem] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 border border-line bg-green px-4 py-8 text-white max-nav:grid-cols-1 max-nav:gap-5",
      )}
    >
      <div>
        <p className="m-0 font-sans text-[0.75rem] font-extrabold tracking-[0.1em] text-brand uppercase">
          Want more stories like these in your pocket?
        </p>
        <h2 className="mt-[0.55rem] mb-0 text-[clamp(1.6rem,3vw,2.7rem)] leading-[1.05] tracking-[-0.04em]">
          POKIT 앱에서 루틴을 기록하고, 하루를 정리하세요.
        </h2>
      </div>
      <div className="flex flex-col items-center gap-[0.85rem]">
        <a
          href={site.appStoreUrl}
          className="hidden min-h-[2.75rem] items-center justify-center bg-brand px-[1.2rem] font-sans text-[0.78rem] font-extrabold tracking-[0.08em] text-ink uppercase max-nav:inline-flex"
        >
          App Store에서 다운로드
        </a>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-[0.85rem] max-nav:hidden">
          <QRCodeSVG
            value={site.appStoreUrl}
            size={132}
            bgColor="#ffffff"
            fgColor="#1a1a1a"
            role="img"
            aria-label="POKIT 앱 App Store QR 코드"
          />
          <p className="m-0 font-sans text-[0.72rem] font-bold tracking-[0.04em] text-ink normal-case">
            iPhone 카메라로 스캔해서 설치
          </p>
        </div>
      </div>
    </section>
  );
}
