"use client";

import Image from "next/image";
import Link from "next/link";
import { AppStoreBadge } from "@/components/app-store-badge";
import { appHeroArt } from "@/content/app-features";
import { appName } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { AppDownloadMessages } from "@/i18n/get-app-download-messages";
import { trackAppPromotion } from "@/lib/gtag";
import { withLocale } from "@/lib/locale-path";
import styles from "./app-promotion.module.css";

type Props = { locale: Locale; messages: AppDownloadMessages; placement: string; variant?: "banner" | "inline" };

export function AppPromotion({ locale, messages, placement, variant = "banner" }: Props) {
  const t = createTranslator(messages);
  return <aside className={`${styles.promotion} ${variant === "inline" ? styles.inline : ""}`} aria-label={`${appName(locale)} · ${t("앱 소개")}`} data-app-promotion={placement} data-hide-in-pokit-app>
    <div className={styles.copy}>
      <div className={styles.brand}><Image src="/icon.png" alt="" width={34} height={34} /><span>{appName(locale)}<small>iPhone &amp; iPad</small></span></div>
      <h2>{variant === "inline" ? t("읽고 떠오른 생각, 오늘의 기록으로.") : t("오늘을 나만의 이야기로.")}</h2>
      <p>{t("장면을 고르고, 메모를 남기고, 작은 할 일을 챙겨보세요.")}</p>
      <div className={styles.actions}>
        <span onClickCapture={() => trackAppPromotion(placement, "store", locale)}><AppStoreBadge locale={locale} label={t("App Store에서 받기")} size={variant === "inline" ? "compact" : "default"} className="border border-white/25" /></span>
        <Link href={`${withLocale(locale, "/app")}#try-pokit`} onClick={() => trackAppPromotion(placement, "try", locale)}>{t("설치 전에 직접 체험하기")} <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
    <div className={styles.art} aria-hidden="true"><Image src={appHeroArt(locale)} alt="" unoptimized /></div>
  </aside>;
}
