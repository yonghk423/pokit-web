"use client";

import { QRCodeSVG } from "qrcode.react";
import { site } from "@/config/site";

export function AppDownload() {
  return (
    <section id="app" className="newsletter-block mono-container">
      <div>
        <p>Want more stories like these in your pocket?</p>
        <h2>POKIT 앱에서 루틴을 기록하고, 하루를 정리하세요.</h2>
      </div>
      <div className="app-download__actions">
        <a href={site.appStoreUrl} className="app-download__button">
          App Store에서 다운로드
        </a>
        <div className="app-download__qr">
          <QRCodeSVG
            value={site.appStoreUrl}
            size={132}
            bgColor="#ffffff"
            fgColor="#1a1a1a"
            role="img"
            aria-label="POKIT 앱 App Store QR 코드"
          />
          <p>iPhone 카메라로 스캔해서 설치</p>
        </div>
      </div>
    </section>
  );
}
