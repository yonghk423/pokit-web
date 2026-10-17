import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { WellnessNewsDigest } from "@/components/wellness-news-digest";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getBriefingMessages } from "@/i18n/get-briefing-messages";
import { createBriefingDescription } from "@/content/briefing-copy";
import { briefingWeekPath } from "@/lib/briefing-path";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import {
  getLatestWellnessDigest,
  listWellnessDigests,
} from "@/sanity/lib/fetch";

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
  const t = createTranslator(await getBriefingMessages(locale));
  const latest = await getLatestWellnessDigest(locale);
  const description = latest
    ? createBriefingDescription(t,
      latest.items.map((item) => item.headline),
    )
    : t("공공기관·국제기구 소식을 POKIT이 요약하고, 일상 루틴으로 연결합니다. 원문은 출처에서 확인하세요.");
  const alternates = localeAlternates(locale, "/briefing");

  return {
    title: t("웰니스 브리핑"),
    description,
    alternates,
    openGraph: {
      title: t("웰니스 브리핑"),
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(locale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: t("웰니스 브리핑"),
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function BriefingHubPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const t = createTranslator(await getBriefingMessages(locale));
  const [latest, archive] = await Promise.all([
    getLatestWellnessDigest(locale),
    listWellnessDigests(locale),
  ]);

  const pastWeeks = archive.filter((item) => item.weekOf !== latest?.weekOf);
  const description = latest
    ? createBriefingDescription(t,
      latest.items.map((item) => item.headline),
    )
    : t("공공기관·국제기구 소식을 POKIT이 요약하고, 일상 루틴으로 연결합니다. 원문은 출처에서 확인하세요.");

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: t("웰니스 브리핑"), path: "/briefing" },
          ],
          locale,
        )}
      />
      {latest && (
        <JsonLd
          data={briefingCollectionJsonLd({
            locale,
            path: "/briefing",
            name: t("웰니스 브리핑"),
            description,
            items: latest.items,
            datePublished: latest.weekOf,
          })}
        />
      )}

      {latest ? (
        <WellnessNewsDigest
          digest={latest}
          locale={locale}
          kicker={t("주간 브리핑")}
          sourceLabel={t("출처")}
          readSourceLabel={t("원문 보기")}
          showExtras
          editorNoteLabel={t("POKIT 노트")}
          relatedLabel={t("같이 읽으면 좋은 이야기")}
          titleAs="h1"
        />
      ) : (
        <section className={cn(monoContainer, sectionSpacing)}>
          <h1 className="m-0 text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.03em]">
            {t("웰니스 브리핑")}
          </h1>
          <p className="mt-4 font-sans text-muted">{t("아직 발행된 브리핑이 없습니다.")}</p>
        </section>
      )}

      {latest?.weekOf && (
        <p className={cn(monoContainer, "pb-4 font-sans text-[0.9rem]")}>
          <Link
            href={briefingWeekPath(locale, latest.weekOf)}
            className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
          >
            {t("전체 보기 → {{week}}", { week: latest.weekOf })}
          </Link>
        </p>
      )}

      {pastWeeks.length > 0 && (
        <section className={cn(monoContainer, "border-t border-ink/10 py-12 pb-16")}>
          <h2 className="m-0 mb-6 text-[1.25rem] font-extrabold tracking-[-0.02em]">
            {t("지난 브리핑")}
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {pastWeeks.map((item) => (
              <li key={item.weekOf}>
                <Link
                  href={briefingWeekPath(locale, item.weekOf)}
                  className="font-sans text-[0.95rem] font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
                >
                  <time dateTime={item.weekOf}>{item.weekOf}</time>
                  <span className="mx-2 text-muted">·</span>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
