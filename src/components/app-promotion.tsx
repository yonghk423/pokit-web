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

export function AppPromotion({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <aside
      className="my-6 flex min-h-[5.5rem] items-center justify-between gap-4 rounded-xl border border-[#e9bdca] bg-[#f9e9ee] px-4 py-3 text-ink sm:my-8 sm:px-5"
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
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#e7bdc9] bg-[#fff8fa] px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5 shrink-0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.75" y="4.25" width="14.5" height="13" rx="2" />
            <path d="M6.25 2.75v3M13.75 2.75v3M2.75 8h14.5" />
          </svg>
          <span>{text.action}</span>
          <span aria-hidden="true" className="ml-0.5">↗</span>
        </Link>
      </div>
      <Image
        src="/daylight/promotion/diary.png"
        alt="Daylight photo diary screen"
        width={1290}
        height={2796}
        sizes="44px"
        className="h-[4.5rem] w-auto shrink-0 rounded-md border border-ink/10 object-cover object-top sm:h-20"
      />
    </aside>
  );
}
