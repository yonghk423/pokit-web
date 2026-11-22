import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

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

const promotionVisuals = {
  home: [
    { src: "calendar-themes.png", alt: "Daylight calendar themes" },
    { src: "calendar-moments.png", alt: "Daylight calendar filled with photos" },
    { src: "diary-space.png", alt: "Daylight personal diary" },
  ],
  archive: [
    { src: "year-archive.png", alt: "Daylight yearly photo archive" },
    { src: "diary-style.png", alt: "Daylight diary decorations" },
    { src: "diary-closeup.png", alt: "A page from a Daylight photo diary" },
  ],
  article: [
    { src: "diary-words.png", alt: "Writing a daily story in Daylight" },
    { src: "photo-editor.png", alt: "Editing a photo in Daylight" },
    { src: "diary-closeup.png", alt: "A page from a Daylight photo diary" },
  ],
} as const;

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
      className="my-6 flex min-h-[5.5rem] items-center justify-between gap-4 rounded-xl border border-[#d9a0af] bg-[#e7b4c1] px-4 py-3 text-ink sm:my-8 sm:px-5"
      aria-label="Daylight"
    >
      <div className="min-w-0">
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
      <div className="flex h-20 shrink-0 items-center gap-1" aria-label="Daylight app screens">
        {visuals.map((visual) => (
          <Image
            key={visual.src}
            src={`/daylight/promotion/${visual.src}`}
            alt={visual.alt}
            width={1290}
            height={2796}
            sizes="48px"
            className="h-full w-12 rounded-md border border-ink/10 bg-white object-cover object-top"
          />
        ))}
      </div>
    </aside>
  );
}
