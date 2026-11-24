import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appStoreUrl, site } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getSupportMessages } from "@/i18n/get-support-messages";
import { localeAlternates } from "@/lib/locale-path";

import diaryWords from "@/assets/daylight/promotion/diary-words.webp";
import photoEditor from "@/assets/daylight/promotion/photo-editor.webp";
import diaryCloseup from "@/assets/daylight/promotion/diary-closeup.webp";
import calendarThemes from "@/assets/daylight/promotion/calendar-themes.webp";

const copy = {
  ko: {
    title: "Daylight 앱 지원",
    intro: "Daylight는 사진과 글로 하루를 기록하는 포토 다이어리예요. 사진에 필름을 입히거나 달력을 꾸미다가 궁금한 점이 생기면 아래 이메일로 문의해 주세요.",
    featuresTitle: "Daylight 사용법",
    features: [
      ["하루 기록하기", "Diary에서 날짜를 고르고 My story에 하루의 생각이나 메모를 적어보세요. 약속이나 계획은 Events에 기록하고 Calendar에서 날짜별로 확인할 수 있어요."],
      ["사진에 필름 입히기", "Photo에서 사진을 열고 Film에서 원하는 색감을 고르세요. Brightness로 밝기를, Grain으로 입자감을 조절할 수 있어요. 일부 필름에는 Pro 표시가 있어요."],
      ["사진에 글과 날짜 넣기", "Classic Polaroid를 선택하면 사진에 여백이 생겨요. Show text와 Show date로 문구와 촬영 날짜의 표시 여부를 각각 선택하세요."],
      ["달력 디자인 바꾸기", "Store에서 일러스트나 종이 스타일을 고르고 적용한 뒤 Diary의 달력에서 확인하세요."],
    ],
    faqTitle: "자주 묻는 질문",
    faq: [
      ["편집한 사진을 아이폰 사진 앱에 저장하려면?", "편집 화면 아래의 아래쪽 화살표를 눌러 사진 앱에 저장하세요. 다른 앱으로 보내려면 공유 버튼을 사용하세요. Pro 필름을 선택한 뒤 저장이 막히면 무료 필름을 선택하거나 구독 상태를 확인하세요."],
      ["사진의 날짜나 색감을 다시 바꾸려면?", "Show date를 켜고 날짜 선택에서 표시할 날짜를 고르세요. 색감만 처음부터 조정하려면 편집 패널의 Reset all을 사용하세요."],
      ["사진이 열리지 않거나 필름 적용이 멈췄어요.", "사진을 불러올 수 없다는 안내가 뜨면 편집기를 닫고 같은 사진을 다시 여세요. 보정 실패 안내가 뜨면 해당 안내를 눌러 다시 시도하세요."],
      ["달력을 다운로드했는데 화면이 그대로예요.", "Store에서 다운로드한 달력을 열고 적용하기를 누르세요. 그림을 불러오지 못했다면 네트워크 연결을 확인한 뒤 다운로드를 다시 시도하세요."],
      ["Pro를 이용 중인데 다시 결제하라고 나와요.", "구매에 사용한 Apple 계정인지 확인한 뒤 앱 설정에서 구매 복원을 선택하세요. 복원 후에도 잠겨 있다면 문제가 생긴 필름이나 달력 이름을 메일에 적어주세요."],
      ["설정에서 다이어리를 초기화하면 무엇이 지워지나요?", "이 기기의 앱에 추가한 사진, 일기, 일정, 다운로드한 달력이 삭제되고 설정이 기본값으로 돌아갑니다. 되돌릴 수 없습니다. 아이폰 사진 보관함의 원본과 기존 Google Drive 백업은 유지됩니다."],
    ],
    contact: "이메일로 문의하기",
    guide: "문제를 알려주실 때",
    detail: "어떤 화면에서 무엇을 하려고 했는지, 실제로 어떤 일이 일어났는지 알려주세요. 가능하면 iPhone 기종과 iOS 버전, Daylight 앱 버전도 함께 적어주세요.",
  },
  en: {
    title: "Daylight app support",
    intro: "Daylight is a photo diary for capturing your day in pictures and words. If you have a question about writing an entry, applying a film look, or decorating your calendar, email us below.",
    featuresTitle: "Using Daylight",
    features: [
      ["Write a diary entry or plan an event", "In Diary, choose a date and use My story to write about your day. Use Events for plans and appointments. Open Calendar to revisit a date."],
      ["Apply a film look", "Open a picture in Photo, then select Film and choose a look. Adjust Brightness to lighten or darken the photo, or Grain to add texture. Some looks are marked Pro."],
      ["Show a caption or date", "Choose Classic Polaroid for a print-style frame. Use Show text and Show date to choose whether the caption and date appear on the photo."],
      ["Change your calendar design", "Open Store to browse illustrated calendars and paper styles. Apply a design, then return to Diary to see it on your calendar."],
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      ["How do I save an edited picture to my iPhone?", "Tap the down arrow in the editor to download the picture to Photos. To send it to another app, tap Share. If a Pro film prevents export, choose a free film or check your subscription."],
      ["How do I change the printed date or start the adjustments again?", "Turn on Show date and use the date picker to choose the date printed on the photo. To start the color adjustments again, select Reset all in the photo editor."],
      ["What if my photo will not open or an adjustment fails?", "If the editor says it could not load the photo, close it and open the same picture again. If an adjustment fails, tap the retry message in the editor."],
      ["Why is my old calendar still showing after a download?", "Open the downloaded design in Store and select Apply calendar. If the artwork fails to load, check your connection and select Retry download."],
      ["I already have Pro. How do I unlock my film or calendar?", "Check that you are using the Apple account that made the purchase, then select Restore purchases in the app settings. If the item remains locked, include its name when you email support."],
      ["What happens if I reset the diary on this device?", "Reset removes photos added to the app, diary entries, events and downloaded calendars, and restores the default settings. This cannot be undone. Originals in your iPhone photo library and existing Google Drive backups are kept."],
    ],
    contact: "Email support",
    guide: "Reporting a problem",
    detail: "Tell us which screen you were on, what you tried to do, and what happened. If possible, include your iPhone model, iOS version, and Daylight app version.",
  },
  ja: {
    title: "Daylight アプリサポート",
    intro: "Daylight は、写真と言葉で一日を残すフォトダイアリーです。日記の書き方や写真のフィルム、カレンダーの着せ替えについてご不明な点があれば、メールでお問い合わせください。",
    featuresTitle: "Daylight の使い方",
    features: [
      ["日記や予定を書く", "Diary で日付を選び、My story にその日の出来事を書きます。約束や予定は Events に記録し、Calendar で日付ごとに見返せます。"],
      ["フィルムを選ぶ", "Photo で写真を開き、Film で好みの色合いを選びます。Brightness で明るさを、Grain で粒状感を調整できます。一部のフィルムには Pro の表示があります。"],
      ["写真に文章や日付を表示する", "Classic Polaroid を選ぶと写真に余白が付きます。Show text と Show date で文章と日付の表示を個別に切り替えられます。"],
      ["カレンダーを着せ替える", "Store でイラストや用紙のデザインを選んで適用すると、Diary のカレンダーで確認できます。"],
    ],
    faqTitle: "よくある質問",
    faq: [
      ["編集した写真を iPhone に保存するには？", "編集画面の下向き矢印で写真アプリに保存します。他のアプリに送るには共有を選びます。Pro フィルムで保存できない場合は無料フィルムを選ぶか、契約状況を確認してください。"],
      ["写真の日付や色調を変更するには？", "Show date をオンにし、日付選択で表示する日を指定します。色調の調整をやり直すには編集画面で Reset all を選びます。"],
      ["写真を開けない、または調整に失敗したときは？", "写真を読み込めない場合は編集画面を閉じて、同じ写真を開き直してください。調整に失敗した場合は再試行のメッセージをタップします。"],
      ["ダウンロードしたカレンダーが表示されません。", "Store でダウンロード済みのデザインを開き、適用を選びます。画像の読み込みに失敗した場合は接続を確認し、再ダウンロードしてください。"],
      ["購入済みの Pro を復元するには？", "購入時と同じ Apple アカウントで、アプリ設定の購入を復元を選びます。解決しない場合は、対象のフィルム名やカレンダー名を添えてご連絡ください。"],
      ["この端末の日記をリセットするとどうなりますか？", "アプリに追加した写真、日記、予定、ダウンロード済みのカレンダーが削除され、設定が初期値に戻ります。取り消せません。写真アプリの元画像と既存の Google Drive バックアップは残ります。"],
    ],
    contact: "メールで問い合わせる",
    guide: "不具合を報告するときは",
    detail: "どの画面で何をしようとしたか、実際に何が起きたかをお知らせください。可能であれば、iPhone の機種、iOS と Daylight のバージョンもご記入ください。",
  },
  "zh-TW": {
    title: "Daylight App 支援",
    intro: "Daylight 是一本用照片和文字記錄生活的照片手帳。如果你在寫日記、套用底片效果或裝飾月曆時有任何疑問，歡迎來信詢問。",
    featuresTitle: "Daylight 使用指南",
    features: [
      ["寫日記與安排行程", "在 Diary 選擇日期，於 My story 寫下當天的心情。約會或計畫可以記在 Events，再到 Calendar 按日期回顧。"],
      ["為照片套用底片效果", "在 Photo 開啟照片，點選 Film 挑選色調。用 Brightness 調整亮度，或用 Grain 增加顆粒感。部分效果標有 Pro。"],
      ["顯示文字與日期", "選擇 Classic Polaroid 可為照片加上留白相框。使用 Show text 和 Show date 分別切換文字與日期的顯示。"],
      ["更換月曆樣式", "到 Store 瀏覽插畫月曆與紙張樣式。套用喜歡的設計後，回到 Diary 即可查看。"],
    ],
    faqTitle: "常見問題",
    faq: [
      ["如何將編輯好的照片存到 iPhone？", "點選編輯器下方的向下箭頭，將圖片存入「照片」。若要傳送到其他 App，請點選分享。若 Pro 底片無法匯出，可改選免費底片或確認訂閱狀態。"],
      ["如何變更照片上的日期或重新調色？", "開啟 Show date，使用日期選擇器指定照片上顯示的日期。若想重新調色，在照片編輯器選擇 Reset all。"],
      ["照片無法開啟或調整失敗怎麼辦？", "若顯示無法載入照片，請關閉編輯器並重新開啟同一張照片。若調整失敗，請點選編輯器中的重試提示。"],
      ["下載了月曆，為什麼仍顯示舊樣式？", "在 Store 開啟已下載的樣式，再選擇套用月曆。如果無法載入插圖，請檢查網路連線並重新下載。"],
      ["已購買 Pro，要如何恢復使用？", "確認目前使用的是購買時的 Apple 帳號，再到 App 設定選擇恢復購買。若仍無法使用，請來信並附上底片或月曆名稱。"],
      ["重設這部裝置的手帳會刪除什麼？", "加入 App 的照片、日記、行程與下載的月曆都會被刪除，設定也會恢復預設值。此操作無法復原。iPhone 相簿中的原始照片與既有的 Google Drive 備份會保留。"],
    ],
    contact: "寄信聯絡我們",
    guide: "回報問題時",
    detail: "請告訴我們你在哪個畫面、想進行什麼操作，以及實際發生的情況。若方便，也請附上 iPhone 機型、iOS 版本與 Daylight 版本。",
  },
};

const featureImages = [diaryWords, photoEditor, diaryCloseup, calendarThemes];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, intro } = copy[locale];
  return {
    title: { absolute: title },
    description: intro,
    alternates: localeAlternates(locale, "/support"),
    openGraph: { title, description: intro, images: [`/daylight/header-${locale}.webp`] },
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { title, intro, featuresTitle, features, faqTitle, faq, contact, guide, detail } = copy[locale];
  const t = createTranslator(await getSupportMessages(locale));
  const productFaq = [
    [t("어떤 다이어리 꾸미기 기능이 있나요?"), t("Daylight에서는 글자색과 종이 배경색을 각각 고르고 아이콘을 더할 수 있습니다. 클립, 카메라, 휴지통 등 다양한 다이어리 아이템도 선택할 수 있습니다.")],
    [t("Daylight는 어디에서 다운로드하나요?"), t("Daylight의 App Store 페이지에서 다운로드할 수 있습니다. 현재 가격과 기기 호환성은 App Store에서 확인해 주세요.")],
  ];

  return (
    <main className="min-h-screen bg-[#faf8f4] px-6 py-16 text-[#302e2a] sm:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-8">{intro}</p>
        <nav aria-label={title} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm underline underline-offset-4">
          <a href={appStoreUrl(locale)}>{t("App Store에서 보기")}</a>
          <a href="#features">{featuresTitle}</a>
          <a href="#questions">{faqTitle}</a>
          <a href="#contact">{contact}</a>
        </nav>
        <section id="features" className="mt-12 scroll-mt-6">
          <h2 className="text-2xl font-semibold">{featuresTitle}</h2>
          {features.map(([name, instructions], index) => (
            <article key={name} className="mt-5 grid grid-cols-[minmax(70px,22%)_1fr] items-center gap-5 border-t border-black/10 pt-5 sm:gap-8">
              <Image
                src={featureImages[index]}
                alt=""
                sizes="(max-width: 700px) 20vw, 145px"
                quality={75}
                placeholder="blur"
                className="h-auto w-full rounded-xl"
              />
              <div>
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="mt-2 leading-7">{instructions}</p>
              </div>
            </article>
          ))}
        </section>
        <section id="questions" className="mt-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-semibold">{faqTitle}</h2>
          {[...productFaq, ...faq].map(([question, answer]) => (
            <details key={question} className="border-t border-black/10 py-4">
              <summary className="cursor-pointer font-medium">{question}</summary>
              <p className="mt-3 leading-7">{answer}</p>
            </details>
          ))}
        </section>
        <section id="contact" className="mt-12 scroll-mt-6 border-y border-[#d9d3c9] py-7">
          <h2 className="text-xl font-semibold">{contact}</h2>
          <a className="mt-3 inline-block break-all underline underline-offset-4" href={`mailto:${site.supportEmail}?subject=${encodeURIComponent(title)}`}>
            {site.supportEmail}
          </a>
        </section>
        <h2 className="mt-8 text-xl font-semibold">{guide}</h2>
        <p className="mt-3 leading-7">{detail}</p>
      </div>
    </main>
  );
}
