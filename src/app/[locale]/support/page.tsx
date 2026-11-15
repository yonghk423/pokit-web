import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { localeAlternates } from "@/lib/locale-path";

const copy = {
  ko: {
    title: "Daylight 앱 지원",
    intro: "Daylight는 사진과 글로 하루를 기록하는 포토 다이어리예요. 사진에 필름을 입히거나 달력을 꾸미다가 궁금한 점이 생기면 아래 이메일로 문의해 주세요.",
    contact: "이메일로 문의하기",
    guide: "문제를 알려주실 때",
    detail: "어떤 화면에서 무엇을 하려고 했는지, 실제로 어떤 일이 일어났는지 알려주세요. 가능하면 iPhone 기종과 iOS 버전, Daylight 앱 버전도 함께 적어주세요.",
  },
  en: {
    title: "Daylight app support",
    intro: "Daylight is a photo diary for capturing your day in pictures and words. If you have a question about writing an entry, applying a film look, or decorating your calendar, email us below.",
    contact: "Email support",
    guide: "Reporting a problem",
    detail: "Tell us which screen you were on, what you tried to do, and what happened. If possible, include your iPhone model, iOS version, and Daylight app version.",
  },
  ja: {
    title: "Daylight アプリサポート",
    intro: "Daylight は、写真と言葉で一日を残すフォトダイアリーです。日記の書き方や写真のフィルム、カレンダーの着せ替えについてご不明な点があれば、メールでお問い合わせください。",
    contact: "メールで問い合わせる",
    guide: "不具合を報告するときは",
    detail: "どの画面で何をしようとしたか、実際に何が起きたかをお知らせください。可能であれば、iPhone の機種、iOS と Daylight のバージョンもご記入ください。",
  },
  "zh-TW": {
    title: "Daylight App 支援",
    intro: "Daylight 是一本用照片和文字記錄生活的照片手帳。如果你在寫日記、套用底片效果或裝飾月曆時有任何疑問，歡迎來信詢問。",
    contact: "寄信聯絡我們",
    guide: "回報問題時",
    detail: "請告訴我們你在哪個畫面、想進行什麼操作，以及實際發生的情況。若方便，也請附上 iPhone 機型、iOS 版本與 Daylight 版本。",
  },
};

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
  const { title, intro, contact, guide, detail } = copy[locale];

  return (
    <main className="min-h-screen bg-[#faf8f4] px-6 py-16 text-[#302e2a] sm:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-8">{intro}</p>
        <section className="mt-12 border-y border-[#d9d3c9] py-7">
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
