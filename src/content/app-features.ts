import koscreen0 from "@/assets/app-promo/your-day/renewal/ko/screen-01-your-scenes.webp";
import koscreen1 from "@/assets/app-promo/your-day/renewal/ko/screen-02-notes-and-todos.webp";
import koscreen2 from "@/assets/app-promo/your-day/renewal/ko/screen-03-day-overview.webp";
import koscreen3 from "@/assets/app-promo/your-day/renewal/ko/screen-04-mate-cards.webp";
import koscreen4 from "@/assets/app-promo/your-day/renewal/ko/screen-05-large-widget.webp";
import koscreen5 from "@/assets/app-promo/your-day/renewal/ko/screen-06-small-widget.webp";
import koipad0 from "@/assets/app-promo/your-day/renewal/ko/ipad-01-your-scenes.webp";
import koipad1 from "@/assets/app-promo/your-day/renewal/ko/ipad-02-notes-and-todos.webp";
import koipad2 from "@/assets/app-promo/your-day/renewal/ko/ipad-03-day-overview.webp";
import koipad3 from "@/assets/app-promo/your-day/renewal/ko/ipad-04-mate-cards.webp";
import koipad4 from "@/assets/app-promo/your-day/renewal/ko/ipad-05-large-widget.webp";
import koipad5 from "@/assets/app-promo/your-day/renewal/ko/ipad-06-small-widget.webp";
import koHero from "@/assets/app-promo/your-day/renewal/ko/hero.webp";
import enscreen0 from "@/assets/app-promo/your-day/renewal/en/screen-01-your-scenes.webp";
import enscreen1 from "@/assets/app-promo/your-day/renewal/en/screen-02-notes-and-todos.webp";
import enscreen2 from "@/assets/app-promo/your-day/renewal/en/screen-03-day-overview.webp";
import enscreen3 from "@/assets/app-promo/your-day/renewal/en/screen-04-mate-cards.webp";
import enscreen4 from "@/assets/app-promo/your-day/renewal/en/screen-05-large-widget.webp";
import enscreen5 from "@/assets/app-promo/your-day/renewal/en/screen-06-small-widget.webp";
import enipad0 from "@/assets/app-promo/your-day/renewal/en/ipad-01-your-scenes.webp";
import enipad1 from "@/assets/app-promo/your-day/renewal/en/ipad-02-notes-and-todos.webp";
import enipad2 from "@/assets/app-promo/your-day/renewal/en/ipad-03-day-overview.webp";
import enipad3 from "@/assets/app-promo/your-day/renewal/en/ipad-04-mate-cards.webp";
import enipad4 from "@/assets/app-promo/your-day/renewal/en/ipad-05-large-widget.webp";
import enipad5 from "@/assets/app-promo/your-day/renewal/en/ipad-06-small-widget.webp";
import enHero from "@/assets/app-promo/your-day/renewal/en/hero.webp";
import jascreen0 from "@/assets/app-promo/your-day/renewal/ja/screen-01-your-scenes.webp";
import jascreen1 from "@/assets/app-promo/your-day/renewal/ja/screen-02-notes-and-todos.webp";
import jascreen2 from "@/assets/app-promo/your-day/renewal/ja/screen-03-day-overview.webp";
import jascreen3 from "@/assets/app-promo/your-day/renewal/ja/screen-04-mate-cards.webp";
import jascreen4 from "@/assets/app-promo/your-day/renewal/ja/screen-05-large-widget.webp";
import jascreen5 from "@/assets/app-promo/your-day/renewal/ja/screen-06-small-widget.webp";
import jaipad0 from "@/assets/app-promo/your-day/renewal/ja/ipad-01-your-scenes.webp";
import jaipad1 from "@/assets/app-promo/your-day/renewal/ja/ipad-02-notes-and-todos.webp";
import jaipad2 from "@/assets/app-promo/your-day/renewal/ja/ipad-03-day-overview.webp";
import jaipad3 from "@/assets/app-promo/your-day/renewal/ja/ipad-04-mate-cards.webp";
import jaipad4 from "@/assets/app-promo/your-day/renewal/ja/ipad-05-large-widget.webp";
import jaipad5 from "@/assets/app-promo/your-day/renewal/ja/ipad-06-small-widget.webp";
import jaHero from "@/assets/app-promo/your-day/renewal/ja/hero.webp";
import type { StaticImageData } from "next/image";

import enDay from "@/assets/app-promo/your-day/en/03-day-overview.webp";
import enHome from "@/assets/app-promo/your-day/en/06-small-widget.webp";
import enMates from "@/assets/app-promo/your-day/en/04-mate-cards.webp";
import enNotes from "@/assets/app-promo/your-day/en/02-notes-and-todos.webp";
import enScenes from "@/assets/app-promo/your-day/en/01-your-scenes.webp";
import enWidget from "@/assets/app-promo/your-day/en/05-large-widget.webp";
import jaDay from "@/assets/app-promo/your-day/ja/03-day-overview.webp";
import jaHome from "@/assets/app-promo/your-day/ja/06-small-widget.webp";
import jaMates from "@/assets/app-promo/your-day/ja/04-mate-cards.webp";
import jaNotes from "@/assets/app-promo/your-day/ja/02-notes-and-todos.webp";
import jaScenes from "@/assets/app-promo/your-day/ja/01-your-scenes.webp";
import jaWidget from "@/assets/app-promo/your-day/ja/05-large-widget.webp";
import koDay from "@/assets/app-promo/your-day/ko/03-day-overview.webp";
import koHome from "@/assets/app-promo/your-day/ko/06-small-widget.webp";
import koMates from "@/assets/app-promo/your-day/ko/04-mate-cards.webp";
import koNotes from "@/assets/app-promo/your-day/ko/02-notes-and-todos.webp";
import koScenes from "@/assets/app-promo/your-day/ko/01-your-scenes.webp";
import koWidget from "@/assets/app-promo/your-day/ko/05-large-widget.webp";
import type { Locale } from "@/i18n/config";
import type { AppPageMessages } from "@/i18n/get-app-page-messages";

type Key = keyof AppPageMessages;

export const appBoards = [
  {
    id: "scenes",
    index: "01",
    label: "장면" satisfies Key,
    alt: "나의 하루를, 한 장면씩." satisfies Key,
  },
  {
    id: "notes",
    index: "02",
    label: "메모" satisfies Key,
    alt: "떠오른 생각과 작은 할 일을 함께." satisfies Key,
  },
  {
    id: "day",
    index: "03",
    label: "하루" satisfies Key,
    alt: "흩어진 순간이 나만의 한 페이지로." satisfies Key,
  },
  {
    id: "mates",
    index: "04",
    label: "메이트" satisfies Key,
    alt: "하루를 챙기는 작은 메이트." satisfies Key,
  },
  {
    id: "widget",
    index: "05",
    label: "위젯" satisfies Key,
    alt: "앱을 열기 전에도, 오늘이 보여요." satisfies Key,
  },
  {
    id: "home",
    index: "06",
    label: "홈" satisfies Key,
    alt: "기억하고 싶은 순간, 홈 화면 가까이에." satisfies Key,
  },
] as const;

const boardArt: Record<Locale, readonly StaticImageData[]> = {
  ko: [koScenes, koNotes, koDay, koMates, koWidget, koHome],
  en: [enScenes, enNotes, enDay, enMates, enWidget, enHome],
  ja: [jaScenes, jaNotes, jaDay, jaMates, jaWidget, jaHome],
};

export function appBoardArt(locale: Locale) {
  return boardArt[locale];
}

const screenArt: Record<Locale, readonly StaticImageData[]> = {
  ko: [koscreen0, koscreen1, koscreen2, koscreen3, koscreen4, koscreen5],
  en: [enscreen0, enscreen1, enscreen2, enscreen3, enscreen4, enscreen5],
  ja: [jascreen0, jascreen1, jascreen2, jascreen3, jascreen4, jascreen5],
};
export function appScreenArt(locale: Locale) { return screenArt[locale]; }

const ipadArt: Record<Locale, readonly StaticImageData[]> = {
  ko: [koipad0, koipad1, koipad2, koipad3, koipad4, koipad5],
  en: [enipad0, enipad1, enipad2, enipad3, enipad4, enipad5],
  ja: [jaipad0, jaipad1, jaipad2, jaipad3, jaipad4, jaipad5],
};
export function appTabletArt(locale: Locale) { return ipadArt[locale]; }

const heroArt = { ko: koHero, en: enHero, ja: jaHero };
export function appHeroArt(locale: Locale) { return heroArt[locale]; }
