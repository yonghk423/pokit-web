import type { Metadata } from "next";
import { site } from "@/config/site";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import { notFound } from "next/navigation";
import { HomePreviewShell } from "@/components/home-preview-shell";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { createTranslator } from "@/i18n/create-translator";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { getAppInstallMessages } from "@/i18n/get-app-install-messages";
import { getHomeMessages } from "@/i18n/get-home-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const t = createTranslator(await getCommonMessages(rawLocale));
  const alternates = localeAlternates(rawLocale, "/");

  return {
    title: t("POKIT — 일상 웰니스 루틴"),
    description: t("일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱. POKIT에서 일상·루틴·웰니스 이야기를 만나보세요."),
    alternates,
    openGraph: {
      title: t("POKIT — 일상 웰니스 루틴"),
      description: t("일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱. POKIT에서 일상·루틴·웰니스 이야기를 만나보세요."),
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [
        {
          url: "/pokit-logo.png",
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t("POKIT — 일상 웰니스 루틴"),
      description: t("일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱. POKIT에서 일상·루틴·웰니스 이야기를 만나보세요."),
      images: ["/pokit-logo.png"],
    },
  };
}

export default async function HomeLayout({ children, modal, params }: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [dict, homeMessages, installMessages] = await Promise.all([
    getDictionary(locale),
    getHomeMessages(locale),
    getAppInstallMessages(locale),
  ]);
  const t = createTranslator(homeMessages);
  return (
    <HomePreviewShell locale={locale}
      closeLabel={t("목록으로")}
      installMessages={installMessages}
      toolKicker={dict.newArrivals.kicker}>
      {children}
      {modal}
    </HomePreviewShell>
  );
}
