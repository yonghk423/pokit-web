import type { StaticImageData } from "next/image";

import type { Locale } from "@/i18n/config";

import dailyMemoEditorEn from "@/assets/app-screens/en/daily-memo-editor.webp";
import dailyMemoLockEn from "@/assets/app-screens/en/daily-memo-lock.webp";
import firstLaunchEn from "@/assets/app-screens/en/first-launch.webp";
import historyEn from "@/assets/app-screens/en/history.webp";
import homeWidgetsEn from "@/assets/app-screens/en/home-widgets.webp";
import libraryEn from "@/assets/app-screens/en/library.webp";
import lockScreenMemoEn from "@/assets/app-screens/en/lock-screen-memo.webp";
import memoEditorEn from "@/assets/app-screens/en/memo-editor.webp";
import routinesEn from "@/assets/app-screens/en/routines.webp";
import todayNoteEn from "@/assets/app-screens/en/today-note.webp";
import todosEn from "@/assets/app-screens/en/todos.webp";
import dailyMemoEditor from "@/assets/app-screens/kr/daily-memo-editor.webp";
import dailyMemoLock from "@/assets/app-screens/kr/daily-memo-lock.webp";
import firstLaunch from "@/assets/app-screens/kr/first-launch.webp";
import history from "@/assets/app-screens/kr/history.webp";
import homeWidgets from "@/assets/app-screens/kr/home-widgets.webp";
import library from "@/assets/app-screens/kr/library.webp";
import lockScreenMemo from "@/assets/app-screens/kr/lock-screen-memo.webp";
import memoEditor from "@/assets/app-screens/kr/memo-editor.webp";
import routines from "@/assets/app-screens/kr/routines.webp";
import todayNote from "@/assets/app-screens/kr/today-note.webp";
import todos from "@/assets/app-screens/kr/todos.webp";

export type AppScreenFile =
  | "first-launch.webp"
  | "routines.webp"
  | "todos.webp"
  | "memo-editor.webp"
  | "lock-screen-memo.webp"
  | "today-note.webp"
  | "library.webp"
  | "history.webp"
  | "home-widgets.webp"
  | "daily-memo-editor.webp"
  | "daily-memo-lock.webp";

const KO: Record<AppScreenFile, StaticImageData> = {
  "first-launch.webp": firstLaunch,
  "routines.webp": routines,
  "todos.webp": todos,
  "memo-editor.webp": memoEditor,
  "lock-screen-memo.webp": lockScreenMemo,
  "today-note.webp": todayNote,
  "library.webp": library,
  "history.webp": history,
  "home-widgets.webp": homeWidgets,
  "daily-memo-editor.webp": dailyMemoEditor,
  "daily-memo-lock.webp": dailyMemoLock,
};

const EN: Record<AppScreenFile, StaticImageData> = {
  "first-launch.webp": firstLaunchEn,
  "routines.webp": routinesEn,
  "todos.webp": todosEn,
  "memo-editor.webp": memoEditorEn,
  "lock-screen-memo.webp": lockScreenMemoEn,
  "today-note.webp": todayNoteEn,
  "library.webp": libraryEn,
  "history.webp": historyEn,
  "home-widgets.webp": homeWidgetsEn,
  "daily-memo-editor.webp": dailyMemoEditorEn,
  "daily-memo-lock.webp": dailyMemoLockEn,
};

/** Static import so Next.js can optimize + generate blur at build time. */
export function appScreen(locale: Locale, file: AppScreenFile): StaticImageData {
  if (locale !== "ko") {
    return EN[file];
  }
  return KO[file];
}

/** Cream shell while the optimized image paints (matches app UI canvas). */
export const APP_SCREEN_SHELL = "#f0ebe3";
