import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

import calendarThemes from "@/assets/daylight/promotion/calendar-themes.webp";
import calendarMoments from "@/assets/daylight/promotion/calendar-moments.webp";
import diarySpace from "@/assets/daylight/promotion/diary-space.webp";
import yearArchive from "@/assets/daylight/promotion/year-archive.webp";
import diaryStyle from "@/assets/daylight/promotion/diary-style.webp";
import diaryCloseup from "@/assets/daylight/promotion/diary-closeup.webp";
import diaryWords from "@/assets/daylight/promotion/diary-words.webp";
import photoEditor from "@/assets/daylight/promotion/photo-editor.webp";
import photoStyle from "@/assets/daylight/promotion/photo-style.webp";
import diaryMoments from "@/assets/daylight/promotion/diary-moments.webp";
import calendarBright from "@/assets/daylight/promotion/calendar-bright.webp";
import diaryClothesline from "@/assets/daylight/promotion/diary-clothesline.webp";
import calendarFestival from "@/assets/daylight/promotion/calendar-festival.webp";

const copy = {
  ko: {
    eyebrow: "오늘의 순간을 기록하는 앱",
    title: "사진과 글로 오늘을 남겨보세요.",
    action: "Daylight 살펴보기",
  },
  en: {
    eyebrow: "A photo diary for your day",
    title: "Keep today in photos and words.",
    action: "Explore Daylight",
  },
  ja: {
    eyebrow: "毎日を記録するフォトダイアリー",
    title: "写真と言葉で今日を残そう。",
    action: "Daylightを見る",
  },
  "zh-TW": {
    eyebrow: "記錄日常的照片日記",
    title: "用照片和文字留下今天。",
    action: "認識 Daylight",
  },
} satisfies Record<Locale, { eyebrow: string; title: string; action: string }>;

type PromoVisual = { src: StaticImageData; alt: string };

const promotionVisuals = {
  home: [
    { src: calendarFestival, alt: "Daylight festival calendar" },
    { src: diaryMoments, alt: "Daylight diary moments" },
    { src: photoStyle, alt: "Daylight photo editor with film styles" },
    { src: diaryClothesline, alt: "Daylight diary with hanging photos" },
    { src: calendarBright, alt: "Daylight photo calendar" },
    { src: calendarThemes, alt: "Daylight calendar themes" },
    { src: calendarMoments, alt: "Daylight calendar filled with photos" },
    { src: diarySpace, alt: "Daylight personal diary" },
  ],
  archive: [
    { src: calendarBright, alt: "Daylight photo calendar" },
    { src: diaryClothesline, alt: "Daylight diary with hanging photos" },
    { src: calendarFestival, alt: "Daylight calendar themes" },
    { src: yearArchive, alt: "Daylight yearly photo archive" },
    { src: diaryStyle, alt: "Daylight diary decorations" },
    { src: diaryCloseup, alt: "A page from a Daylight photo diary" },
  ],
  article: [
    { src: diaryClothesline, alt: "Daylight diary with hanging photos" },
    { src: diaryMoments, alt: "Daylight diary moments" },
    { src: photoStyle, alt: "Daylight photo editor with film styles" },
    { src: diaryWords, alt: "Writing a daily story in Daylight" },
    { src: photoEditor, alt: "Editing a photo in Daylight" },
    { src: diaryCloseup, alt: "A page from a Daylight photo diary" },
  ],
} as const satisfies Record<string, readonly PromoVisual[]>;

export function AppPromotion({
  locale,
  placement = "article",
}: {
  locale: Locale;
  placement?: keyof typeof promotionVisuals;
}) {
  const text = copy[locale];
  const visuals = promotionVisuals[placement];

  return (
    <aside
      className="my-6 flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#d9a0af] bg-[#e7b4c1] px-4 py-3 text-ink max-[420px]:flex-col max-[420px]:items-stretch sm:my-8 sm:gap-4 sm:px-5 sm:py-4"
      aria-label="Daylight"
    >
      <div className="min-w-0 shrink-0">
        <p className="m-0 text-[0.68rem] font-medium tracking-wide text-muted">
          {text.eyebrow}
        </p>
        <p className="mt-0.5 mb-0 font-sans text-sm font-semibold leading-snug tracking-tight sm:text-base">
          {text.title}
        </p>
        <Link
          href={withLocale(locale, "/app")}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#d9a0af] bg-[#fff4f6] px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <Image
            src="/daylight/promotion/daylight-photo-calendar-icon.jpg"
            alt=""
            aria-hidden="true"
            width={1024}
            height={1024}
            sizes="24px"
            className="size-5 shrink-0 rounded object-cover"
          />
          <span>{text.action}</span>
          <span aria-hidden="true" className="ml-0.5">↗</span>
        </Link>
      </div>
      <div
        className="flex min-w-0 flex-1 items-end justify-end gap-1 max-[420px]:justify-center sm:gap-1.5"
        aria-label="Daylight app screens"
      >
        {visuals.map((visual, index) => (
          <Image
            key={`${visual.alt}-${index}`}
            src={visual.src}
            alt={visual.alt}
            sizes="(max-width: 420px) 22vw, 72px"
            quality={78}
            placeholder="blur"
            className={
              index >= 5
                ? "hidden h-[7.25rem] w-auto rounded-md border border-ink/10 bg-white object-contain lg:block sm:h-32"
                : index >= 3
                  ? "hidden h-[7.25rem] w-auto rounded-md border border-ink/10 bg-white object-contain sm:block sm:h-32"
                  : "h-[7.25rem] w-auto rounded-md border border-ink/10 bg-white object-contain sm:h-32"
            }
          />
        ))}
      </div>
    </aside>
  );
}
