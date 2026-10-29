import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "@/components/yourday-story.module.css";
import { appName } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { localeAlternates } from "@/lib/locale-path";
import { getYourdayStoryArticles } from "@/sanity/lib/yourday-stories";
import walk from "@/assets/app-demo/walk.webp";
import coffee from "@/assets/app-demo/coffee.webp";
import books from "@/assets/app-demo/books.webp";

const illustrations = [walk, coffee, books];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const t = createTranslator(await getAppPageMessages(rawLocale));
  const title = t("하루를 붙잡는 세 가지 방식");
  const description = t("일기 한 줄, 메모 한 조각. 오늘을 내 방식으로 남기는 이야기들입니다.");
  return {
    title: `${title} | ${appName(rawLocale)}`,
    description,
    alternates: localeAlternates(rawLocale, "/app/yourday-story"),
  };
}

export default async function YourdayStoryIndex({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const [messages, articles] = await Promise.all([
    getAppPageMessages(locale), getYourdayStoryArticles(locale),
  ]);
  const t = createTranslator(messages);

  return <main className={styles.page} data-yourday-story>
    <div className={styles.shell}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{appName(locale)} <span aria-hidden="true">/</span> JOURNAL &amp; NOTES</p>
        <h1>{t("하루를 붙잡는 세 가지 방식")}</h1>
        <p className={styles.intro}>{t("일기 한 줄, 메모 한 조각. 오늘을 내 방식으로 남기는 이야기들입니다.")}</p>
        <p className={styles.count}>{t("일기와 메모에 관한 이야기")}</p>
      </section>
      <section className={styles.grid} aria-label={t("일기와 메모에 관한 이야기")}>
        {articles.length ? articles.map((article, index) => <Link className={styles.card} key={article.slug} href={`/${locale}/app/yourday-story/${article.slug}`}>
          <div className={styles.art}><Image src={illustrations[index % illustrations.length]} alt="" sizes="(max-width: 760px) 112px, 320px" /></div>
          <div className={styles.cardBody}>
            <p className={styles.cardNumber}>0{index + 1} <span aria-hidden="true">/</span> {article.kicker || t("일기와 메모")}</p>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <span className={styles.read}>{t("읽어보기")} ↗</span>
          </div>
        </Link>) : <p className={styles.empty}>{t("새로운 이야기를 준비하고 있어요.")}</p>}
      </section>
      <p className={styles.footerNote}>{t("오늘의 주인공에서 일기와 메모를 남기는 방법을 함께 살펴봐요.")}</p>
    </div>
  </main>;
}
