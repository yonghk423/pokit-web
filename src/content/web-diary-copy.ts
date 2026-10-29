import type { Locale } from "@/i18n/config";

export const webLocales = ["ko", "en", "ja", "zh-TW"] as const;
export type WebLocale = (typeof webLocales)[number];
export function isWebLocale(value: string): value is WebLocale { return webLocales.includes(value as WebLocale); }
export function webAppLocale(locale: WebLocale): Locale { return locale === "zh-TW" ? "en" : locale; }

export type WebDiaryCopy = {
  web: string;
  brandTagline: string;
  prototype: string;
  title: string;
  description: string;
  back: string;
  library: string;
  newDiary: string;
  empty: string;
  local: string;
  diaryTitle: string;
  untitled: string;
  date: string;
  save: string;
  saved: string;
  unsaved: string;
  loading: string;
  choose: string;
  coffee: string;
  walk: string;
  books: string;
  note: string;
  placeholder: string;
  add: string;
  update: string;
  cancel: string;
  edit: string;
  preview: string;
  first: string;
  firstHint: string;
  export: string;
  error: string;
  corrupt: string;
  conflict: string;
  reload: string;
  discard: string;
  limit: string;
  sceneCount: string;
  install: string;
  newTab: string;
};

export const webDiaryCopy: Record<WebLocale, WebDiaryCopy> = {
  "ko": {
    "web": "웹에서 사용하기",
    "brandTagline": "일상 루틴과 웰니스를 위한 포켓 가이드 · Your Day와 함께",
    "prototype": "웹 초안",
    "title": "오늘의 기록을, 한 장면씩.",
    "description": "장면을 고르고 이야기를 남기는 나만의 웹 일기입니다.",
    "back": "앱 소개",
    "library": "나의 일기",
    "newDiary": "새 일기",
    "empty": "아직 저장한 일기가 없어요. 첫 장면부터 남겨보세요.",
    "local": "이 브라우저에만 저장됩니다. 앱과 동기화되지 않으며, 사이트 데이터를 지우거나 다른 기기를 사용하면 기록을 불러올 수 없습니다. 중요한 기록은 내보내기로 보관해주세요.",
    "diaryTitle": "일기 제목",
    "untitled": "나의 하루",
    "date": "날짜",
    "save": "일기 저장",
    "saved": "이 브라우저에 저장했어요.",
    "unsaved": "저장하지 않은 변경 사항",
    "loading": "내 기록을 불러오는 중…",
    "choose": "장면 고르기",
    "coffee": "커피 한 잔",
    "walk": "잠깐의 산책",
    "books": "서점에서",
    "note": "이 장면의 이야기",
    "placeholder": "오늘 기억하고 싶은 순간을 적어보세요.",
    "add": "장면 담기",
    "update": "장면 수정하기",
    "cancel": "수정 취소",
    "edit": "이 장면 수정",
    "preview": "나의 페이지",
    "first": "첫 장면을 기다리고 있어요.",
    "firstHint": "오늘의 장면을 사진으로 고르고 짧은 이야기를 더해보세요.",
    "export": "기록 내보내기",
    "error": "기록을 저장할 수 없어요. 브라우저 저장 공간과 설정을 확인해주세요. 입력한 내용은 화면에 남아 있습니다.",
    "corrupt": "저장된 기록을 읽을 수 없어 덮어쓰지 않았습니다. 내보내기로 원본을 보관한 뒤 저장 데이터를 확인해주세요.",
    "conflict": "다른 탭에서 기록이 바뀌었습니다. 입력한 내용을 따로 보관한 뒤 최신 기록을 불러와주세요.",
    "reload": "최신 기록 불러오기",
    "discard": "저장하지 않은 내용을 두고 이동할까요?",
    "limit": "일기 하나에 장면을 20개까지 담을 수 있어요. 새 일기를 만들어 이어가세요.",
    "sceneCount": "{count}개의 장면",
    "install": "앱에서도 시작하기",
    "newTab": "새 탭에서 열림"
  },
  "en": {
    "web": "Use on the web",
    "brandTagline": "A pocket guide to daily routines and wellness, with Your Day",
    "prototype": "Web preview",
    "title": "Your story, one scene at a time.",
    "description": "A little space to keep your days in scenes and words.",
    "back": "About the app",
    "library": "My diaries",
    "newDiary": "New diary",
    "empty": "No diaries yet. Start with one small scene.",
    "local": "Saved only in this browser. Entries do not sync with the app or other devices. Clearing site data removes them. Export anything you want to keep.",
    "diaryTitle": "Diary title",
    "untitled": "My day",
    "date": "Date",
    "save": "Save diary",
    "saved": "Saved in this browser.",
    "unsaved": "Unsaved changes",
    "loading": "Opening your diaries…",
    "choose": "Choose a scene",
    "coffee": "A coffee break",
    "walk": "A little walk",
    "books": "At the bookshop",
    "note": "The story in this scene",
    "placeholder": "What would you like to remember?",
    "add": "Add scene",
    "update": "Update scene",
    "cancel": "Cancel edit",
    "edit": "Edit this scene",
    "preview": "My page",
    "first": "Your first scene goes here.",
    "firstHint": "Pick a photo for your moment, then add a few words.",
    "export": "Export diaries",
    "error": "Could not save. Check your browser storage settings and available space. Your writing is still on screen.",
    "corrupt": "The saved data could not be read, so it has not been overwritten. Export the original data before inspecting your browser storage.",
    "conflict": "Your diaries changed in another tab. Copy any unsaved writing before loading the latest version.",
    "reload": "Load latest diaries",
    "discard": "Leave without saving your changes?",
    "limit": "A diary can hold 20 scenes. Start another diary to keep writing.",
    "sceneCount": "{count} scenes",
    "install": "Start in the app",
    "newTab": "Opens in a new tab"
  },
  "ja": {
    "web": "ウェブで使う",
    "brandTagline": "日々のルーティンとウェルネスのポケットガイド。Your Dayとともに。",
    "prototype": "ウェブ版プレビュー",
    "title": "今日の記録を、ひとこまずつ。",
    "description": "シーンと言葉で残す、自分だけのウェブ日記です。",
    "back": "アプリ紹介",
    "library": "自分の日記",
    "newDiary": "新しい日記",
    "empty": "まだ日記がありません。最初のシーンを残してみましょう。",
    "local": "このブラウザにのみ保存され、アプリや別の端末とは同期されません。サイトデータを削除すると記録も消えます。大切な記録は書き出して保管してください。",
    "diaryTitle": "日記のタイトル",
    "untitled": "自分の一日",
    "date": "日付",
    "save": "日記を保存",
    "saved": "このブラウザに保存しました。",
    "unsaved": "未保存の変更があります",
    "loading": "日記を読み込み中…",
    "choose": "シーンを選ぶ",
    "coffee": "コーヒーのひととき",
    "walk": "短い散歩",
    "books": "本屋で",
    "note": "このシーンの物語",
    "placeholder": "今日覚えておきたい瞬間を書いてみましょう。",
    "add": "シーンを追加",
    "update": "シーンを更新",
    "cancel": "編集をやめる",
    "edit": "このシーンを編集",
    "preview": "自分のページ",
    "first": "最初のシーンを待っています。",
    "firstHint": "写真を選び、短い言葉を添えてみましょう。",
    "export": "記録を書き出す",
    "error": "保存できませんでした。ブラウザの保存設定や空き容量をご確認ください。入力内容は画面に残っています。",
    "corrupt": "保存データを読み込めなかったため、上書きしていません。元のデータを書き出してから確認してください。",
    "conflict": "別のタブで記録が変更されました。未保存の内容を控えてから、最新の記録を読み込んでください。",
    "reload": "最新の記録を読み込む",
    "discard": "変更を保存せずに移動しますか？",
    "limit": "ひとつの日記には20シーンまで追加できます。新しい日記で続けてください。",
    "sceneCount": "{count}シーン",
    "install": "アプリでも始める",
    "newTab": "新しいタブで開きます"
  },
  "zh-TW": {
  "web": "在網頁上使用",
  "brandTagline": "日常習慣與身心健康的口袋指南，與 Your Day 一起",
  "prototype": "網頁版預覽",
  "title": "把今天，一幕一幕記下來。",
  "description": "用場景與文字，留下屬於自己的日記。",
  "back": "認識 App",
  "library": "我的日記",
  "newDiary": "新增日記",
  "empty": "還沒有儲存的日記，從第一個場景開始吧。",
  "local": "日記只儲存在這個瀏覽器，不會與 App 或其他裝置同步。清除網站資料後，記錄也會消失。重要內容請匯出備份。",
  "diaryTitle": "日記標題",
  "untitled": "我的一天",
  "date": "日期",
  "save": "儲存日記",
  "saved": "已儲存在這個瀏覽器。",
  "unsaved": "有尚未儲存的變更",
  "loading": "正在讀取日記…",
  "choose": "選擇場景",
  "coffee": "一杯咖啡",
  "walk": "散步片刻",
  "books": "在書店裡",
  "note": "這個場景的故事",
  "placeholder": "寫下今天想記住的片刻。",
  "add": "加入場景",
  "update": "更新場景",
  "cancel": "取消編輯",
  "edit": "編輯這個場景",
  "preview": "我的一頁",
  "first": "等你留下第一個場景。",
  "firstHint": "先選一張照片，再添上幾句話，寫下今天的片刻。",
  "export": "匯出日記",
  "error": "無法儲存。請確認瀏覽器的儲存設定與可用空間，輸入的內容仍留在畫面上。",
  "corrupt": "無法讀取已儲存的資料，因此沒有覆寫。請先匯出原始資料，再檢查瀏覽器儲存空間。",
  "conflict": "日記已在另一個分頁更新。請先複製尚未儲存的文字，再載入最新記錄。",
  "reload": "載入最新記錄",
  "discard": "要放棄尚未儲存的變更並離開嗎？",
  "limit": "每本日記最多可加入 20 個場景，請新增另一本日記繼續記錄。",
  "sceneCount": "{count} 個場景",
  "install": "也在 App 開始記錄",
  "newTab": "在新分頁開啟"
}
};
