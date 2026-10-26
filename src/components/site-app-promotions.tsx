"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppPromotion } from "@/components/app-promotion";
import { AppStoreBadge } from "@/components/app-store-badge";
import { appName } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { AppDownloadMessages } from "@/i18n/get-app-download-messages";
import { trackAppPromotion } from "@/lib/gtag";
import { withLocale } from "@/lib/locale-path";
import styles from "./app-promotion.module.css";

export function SiteAppPromotions({ locale, messages, position }: { locale: Locale; messages: AppDownloadMessages; position: "top" | "bottom" }) {
  const pathname = usePathname();
  const t = createTranslator(messages);
  const [dismissed, setDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (position !== "bottom") return;
    try { setDismissed(sessionStorage.getItem("your-day-install-dismissed") === "1"); } catch { /* Storage is optional. */ }
    const update = () => setScrolled(window.scrollY > 480);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [position]);
  if (pathname === withLocale(locale, "/app") || pathname?.startsWith(`${withLocale(locale, "/app")}/`)) return null;
  if (position === "top") return <aside className={styles.strip} aria-label={`${appName(locale)} · ${t("앱 소개")}`} data-app-promotion="top-strip" data-hide-in-pokit-app>
    <Link href={withLocale(locale, "/app")} className={styles.stripIntro} onClick={() => trackAppPromotion("top-strip", "intro", locale)}><Image src="/icon.png" alt="" width={30} height={30} /><strong>{appName(locale)}</strong><span>{t("나의 하루를, 한 장면씩.")}</span></Link>
    <Link className={styles.stripAction} href={`${withLocale(locale, "/app")}#try-pokit`} onClick={() => trackAppPromotion("top-strip", "try", locale)}>{t("앱 직접 체험하기")} <span aria-hidden="true">↗</span></Link>
  </aside>;
  const home = pathname === withLocale(locale, "/") || pathname === `/${locale}/`;
  return <div data-hide-in-pokit-app>
    {!home && <div className={styles.footerBanner}><AppPromotion locale={locale} messages={messages} placement="site-footer" /></div>}
    {!dismissed && <>
      <div className={styles.dockSpace} />
      <aside className={`${styles.dock} ${scrolled ? styles.dockVisible : ""}`} aria-label={`${appName(locale)} · ${t("App Store에서 받기")}`} aria-hidden={!scrolled} inert={!scrolled} data-app-promotion="mobile-install">
        <Image src="/icon.png" alt="" width={38} height={38} />
        <Link className={styles.dockBrand} href={withLocale(locale, "/app")} onClick={() => trackAppPromotion("mobile-install", "intro", locale)}><strong>{appName(locale)}</strong><small>iPhone &amp; iPad</small></Link>
        <span onClickCapture={() => trackAppPromotion("mobile-install", "store", locale)}><AppStoreBadge locale={locale} label={t("App Store에서 받기")} size="compact" /></span>
        <button type="button" aria-label={t("앱 설치 안내 닫기")} onClick={() => { setDismissed(true); try { sessionStorage.setItem("your-day-install-dismissed", "1"); } catch { /* Storage is optional. */ } }}>×</button>
      </aside>
    </>}
  </div>;
}
