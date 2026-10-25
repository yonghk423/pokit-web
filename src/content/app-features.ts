import type { StaticImageData } from "next/image";

import enCard from "@/assets/app-promo/your-day/en/03-routine.webp";
import enDay from "@/assets/app-promo/your-day/en/01-your-day.webp";
import enOverview from "@/assets/app-promo/your-day/en/04-overview.webp";
import enScenes from "@/assets/app-promo/your-day/en/02-story.webp";
import jaCard from "@/assets/app-promo/your-day/ja/03-routine.webp";
import jaDay from "@/assets/app-promo/your-day/ja/01-your-day.webp";
import jaOverview from "@/assets/app-promo/your-day/ja/04-overview.webp";
import jaScenes from "@/assets/app-promo/your-day/ja/02-story.webp";
import koCard from "@/assets/app-promo/your-day/ko/03-routine.webp";
import koDay from "@/assets/app-promo/your-day/ko/01-your-day.webp";
import koOverview from "@/assets/app-promo/your-day/ko/04-overview.webp";
import koScenes from "@/assets/app-promo/your-day/ko/02-story.webp";
import type { Locale } from "@/i18n/config";
import type { AppPageMessages } from "@/i18n/get-app-page-messages";

type Key = keyof AppPageMessages;

export const appBoards = [
  {
    id: "day",
    index: "01",
    label: "하루" satisfies Key,
    alt: "나의 하루가, 한 편의 이야기요" satisfies Key,
  },
  {
    id: "scenes",
    index: "02",
    label: "장면" satisfies Key,
    alt: "오늘의 장면을 차곡차곡 모아요" satisfies Key,
  },
  {
    id: "card",
    index: "03",
    label: "카드" satisfies Key,
    alt: "챙기고 싶은 일상, 카드 한 장에" satisfies Key,
  },
  {
    id: "overview",
    index: "04",
    label: "한눈" satisfies Key,
    alt: "나의 루틴을 한눈에 펼쳐봐요" satisfies Key,
  },
] as const;

const boardArt: Record<Locale, readonly StaticImageData[]> = {
  ko: [koDay, koScenes, koCard, koOverview],
  en: [enDay, enScenes, enCard, enOverview],
  ja: [jaDay, jaScenes, jaCard, jaOverview],
};

export function appBoardArt(locale: Locale) {
  return boardArt[locale];
}
