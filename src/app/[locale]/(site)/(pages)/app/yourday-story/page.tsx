import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import books from "@/assets/app-demo/books.webp";
import coffee from "@/assets/app-demo/coffee.webp";
import walk from "@/assets/app-demo/walk.webp";
import { appName } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { cn, monoContainer } from "@/lib/cn";
import { localeAlternates, withLocale } from "@/lib/locale-path";
import { getYourdayStoryArticles } from "@/sanity/lib/yourday-stories";

const illustrations = [walk, coffee, books];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const t = createTranslator(await getAppPageMessages(rawLocale));
  const title = t("심심할 때 읽기 좋은 이야기");
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
    getAppPageMessages(locale),
    getYourdayStoryArticles(locale),
  ]);
  const t = createTranslator(messages);

  return (
    <main className="pb-8">
      <section className={cn(monoContainer, "pt-10 pb-16 max-nav:pt-8")}>
        <header className="mb-10 max-nav:mb-8">
          <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.08em] text-muted uppercase">
            {t("일기와 메모")}
          </p>
          <h1 className="m-0 mt-3 max-w-[40rem] font-sans text-[clamp(2.35rem,5.5vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
            {t("심심할 때 읽기 좋은 이야기")}
          </h1>
          <p className="mt-4 mb-0 max-w-[36rem] font-sans text-[0.95rem] leading-relaxed text-muted">
            {t("일기 한 줄, 메모 한 조각. 오늘을 내 방식으로 남기는 이야기들입니다.")}
          </p>
        </header>

        {articles.length > 0 ? (
          <ul
            className="m-0 list-none border-t border-ink/10 p-0"
            aria-label={t("하루를 담는 이야기")}
          >
            {articles.map((article, index) => (
              <li key={article.slug} className="border-b border-ink/10">
                <Link
                  href={withLocale(locale, `/app/yourday-story/${article.slug}`)}
                  className="group/list grid grid-cols-[minmax(0,1fr)_minmax(7rem,11rem)] items-start gap-x-6 gap-y-3 py-7 no-underline transition-colors max-archive:grid-cols-1"
                >
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="m-0 font-sans text-[0.72rem] leading-none tracking-[0.01em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                        {" · "}
                        {article.kicker || t("일기와 메모")}
                      </p>
                      <span
                        className="mt-[-0.15rem] flex size-6 shrink-0 items-center justify-center font-sans text-[1.15rem] font-light leading-none text-ink/40 transition-colors group-hover/list:text-ink"
                        aria-hidden
                      >
                        +
                      </span>
                    </div>
                    <h2 className="m-0 mt-3 font-sans text-[clamp(1.15rem,2.2vw,1.45rem)] font-extrabold leading-[1.22] tracking-[-0.025em] text-ink">
                      {article.title}
                    </h2>
                    {article.description ? (
                      <p className="mt-3 mb-0 max-w-[42rem] line-clamp-2 font-sans text-[0.88rem] leading-[1.6] text-muted">
                        {article.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[0.85rem] bg-[#ebe7df] max-archive:max-w-[12rem]">
                    <Image
                      src={illustrations[index % illustrations.length]}
                      alt=""
                      fill
                      sizes="(max-width: 560px) 100vw, 176px"
                      className="object-contain transition-transform duration-500 group-hover/list:scale-[1.03]"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-[1.1rem] border border-ink/10 bg-white/60 px-5 py-8 font-sans text-[0.92rem] text-muted">
            {t("새로운 이야기를 준비하고 있어요.")}
          </p>
        )}

        <p className="mt-10 mb-0 max-w-[42rem] font-sans text-[0.9rem] leading-relaxed text-muted">
          {t("오늘의 주인공에서 일기와 메모를 남기는 방법을 함께 살펴봐요.")}
        </p>

        <p className="mt-14 mb-0 border-t border-ink/8 pt-8">
          <Link
            href={withLocale(locale, "/app")}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-[0.8rem] font-semibold text-white no-underline transition-colors hover:bg-indigo"
          >
            ← {appName(locale)}
          </Link>
        </p>
      </section>
    </main>
  );
}
