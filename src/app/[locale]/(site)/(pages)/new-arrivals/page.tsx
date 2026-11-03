import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HomePreviewShell } from "@/components/home-preview-shell";
import { JsonLd } from "@/components/json-ld";
import { ToolArchiveCard } from "@/components/tool-archive-card";
import { siteName } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppInstallMessages } from "@/i18n/get-app-install-messages";
import { getHomeMessages } from "@/i18n/get-home-messages";
import { getArchiveMessages } from "@/i18n/get-archive-messages";
import { getNewArrivalsMessages } from "@/i18n/get-new-arrivals-messages";
import { createNewArrivalsDescription } from "@/content/new-arrivals-copy";
import { cn, monoContainer } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { newArrivalsPath } from "@/lib/new-arrivals-path";
import { listAllRoutineTools } from "@/sanity/lib/fetch";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit-logo.png",
  width: 512,
  height: 512,
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale: Locale = rawLocale;
  const t = createTranslator(await getNewArrivalsMessages(locale));
  const tools = await listAllRoutineTools(locale);
  const description = tools.length
    ? createNewArrivalsDescription(t, tools.map((item) => item.name))
    : t("생산성·건강·웰니스를 높이는 도구를 장면과 함께 추천합니다. 신상 나열이 아니라, 실제로 루틴에 붙이는 방법입니다.");
  const title = t("모든 도구들");
  const alternates = localeAlternates(locale, "/new-arrivals");

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: siteName(),
      locale: localeOpenGraph(locale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function NewArrivalsHubPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const [toolMessages, archiveMessages, installMessages, homeMessages] = await Promise.all([
    getNewArrivalsMessages(locale),
    getArchiveMessages(locale),
    getAppInstallMessages(locale),
    getHomeMessages(locale),
  ]);
  const t = createTranslator(toolMessages);
  const homeT = createTranslator(homeMessages);
  const archiveT = createTranslator(archiveMessages);
  const tools = await listAllRoutineTools(locale);
  const description = tools.length
    ? createNewArrivalsDescription(t, tools.map((item) => item.name))
    : t("생산성·건강·웰니스를 높이는 도구를 장면과 함께 추천합니다. 신상 나열이 아니라, 실제로 루틴에 붙이는 방법입니다.");

  return (
    <HomePreviewShell
      locale={locale}
      closeLabel={homeT("목록으로")}
      installMessages={installMessages}
      toolKicker={t("루틴 도구")}
    >
    <main className="pb-8">
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: siteName(), path: "/" },
            { name: t("모든 도구들"), path: "/new-arrivals" },
          ],
          locale,
        )}
      />
      {tools.length > 0 && (
        <JsonLd
          data={briefingCollectionJsonLd({
            locale,
            path: "/new-arrivals",
            name: t("모든 도구들"),
            description,
            items: tools.map((item) => ({
              headline: item.name,
              summary: item.summary,
              sourceUrl: newArrivalsPath(locale),
            })),
          })}
        />
      )}

      <section className={cn(monoContainer, "pt-10 pb-16 max-nav:pt-8")}>
        <header className="mb-10 max-nav:mb-8">
          <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.08em] text-muted uppercase">
            {t("루틴 도구")}
          </p>
          <h1 className="m-0 mt-3 max-w-[40rem] font-sans text-[clamp(2.35rem,5.5vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
            {t("모든 도구들")}
          </h1>
          <p className="mt-4 mb-0 max-w-[36rem] font-sans text-[0.95rem] leading-relaxed text-muted">
            {tools.length > 0
              ? t("총 {{total}}개", { total: tools.length })
              : t("아직 발행된 루틴 도구 리스트가 없습니다.")}
          </p>
        </header>

        {tools.length > 0 ? (
          <div className="grid grid-cols-4 gap-x-4 gap-y-8 max-nav:grid-cols-2 max-archive:grid-cols-1">
            {tools.map((item) => (
              <ToolArchiveCard
                locale={locale}
                key={item.slug}
                item={item}
                kicker={t("루틴 도구")}
              />
            ))}
          </div>
        ) : null}

        <p className="mt-14 mb-0 border-t border-ink/8 pt-8">
          <Link
            href={withLocale(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-[0.8rem] font-semibold text-white no-underline transition-colors hover:bg-indigo"
          >
            {archiveT("← 홈으로")}
          </Link>
        </p>
      </section>
    </main>
    </HomePreviewShell>
  );
}
