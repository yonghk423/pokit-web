import Image, { type StaticImageData } from "next/image";
import { notFound } from "next/navigation";
import { AppScrollMotion } from "@/components/app-scroll-motion";
import { AppStoreBadge } from "@/components/app-store-badge";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/config/site";
import { appJsonLd } from "@/lib/json-ld";
import { DaylightFilmSequence } from "@/components/daylight-film-sequence";
import { DaylightCalendarSequence } from "@/components/daylight-calendar-sequence";
import blur from "@/content/daylight-blur.json";
import { isLocale, locales } from "@/i18n/config";
import { localeAlternates, withLocale } from "@/lib/locale-path";
import diaryColors from "@/assets/daylight/screens/diary-colors.png";
import diaryIcons from "@/assets/daylight/screens/diary-icons.png";
import calendarList from "@/assets/daylight/calendar-list.png";
import diaryPhotoReal from "@/assets/daylight/screens/story/diary-photo-real.png";
import diaryClipsEn from "@/assets/daylight/intro-en/diary-clips.webp";
import diaryBinsEn from "@/assets/daylight/intro-en/diary-bins.webp";
import diaryCamerasEn from "@/assets/daylight/intro-en/diary-cameras.webp";
import styles from "@/components/app-intro.module.css";

const copy = {
  ko: {
    title: "서재 관리도 되는 포토 다이어리",
    seoTitle: "Daylight | 서재 관리가 되는 포토 다이어리",
    description: "사진과 글로 하루를 기록하고, 읽은 책과 독서 기록을 나만의 서재에 모아 관리하세요. Daylight에서 사진 일기와 서재를 한곳에 담을 수 있어요.",
    faqTitle: "Daylight 포토 다이어리, 자주 묻는 질문",
    faqs: [
      ["Daylight는 어떤 앱인가요?", "사진과 글로 하루를 기록하고, 읽은 책과 독서 기록을 서재에 모아 관리할 수 있는 iOS 포토 다이어리예요."],
      ["사진과 글을 함께 기록할 수 있나요?", "네. 사진을 고르고 그날의 짧은 글을 더해 한 페이지에 하루의 순간을 남길 수 있어요."],
      ["사진에 필름 느낌과 날짜를 넣을 수 있나요?", "네. 다양한 필름 색감을 고르고 사진에 문구나 날짜를 표시할 수 있어요."],
      ["달력도 꾸밀 수 있나요?", "네. 다양한 디자인의 달력을 골라 다이어리에서 사용할 수 있어요."],
    ],
    nav: ["다이어리", "달력", "필름", "아이템", "기록 모아보기", "일러스트 달력"],
    intro: "마음에 남은 사진에 그날의 이야기를 적고, 읽은 책과 독서 기록은 나만의 서재에 모아보세요.",
    features: [
      ["01 / 다이어리", "글자색과 배경색을 고르고,\n작은 아이콘을 더해요.", "글자색과 종이 배경색을 각각 바꾸고, 어울리는 아이콘으로 오늘의 기록을 마무리해 보세요."],
      ["02 / 달력", "달력도 취향에 맞게\n골라 펼쳐보세요.", "종이와 가죽, 클립의 질감부터 차분한 색과 선명한 색까지. 다양한 달력 디자인을 한눈에 둘러볼 수 있어요."],
      ["03 / 필름", "같은 사진도,\n필름에 따라 다르게.", "따뜻한 빛과 차분한 색감까지. 필름을 바꿔가며 사진에 어울리는 분위기를 찾아보세요."],
      ["04 / 아이템", "작은 아이템으로\n페이지에 개성을 더해요.", "클립과 카메라, 휴지통을 비롯한 다양한 아이템으로 다이어리를 취향에 맞게 꾸밀 수 있어요."],
      ["05 / 나의 기록", "사진이 모이면\n하루의 이야기가 돼요.", "사진과 짧은 글을 한 페이지에 차곡차곡 담아, 평범했던 하루도 다시 펼쳐보고 싶은 기록으로 남겨보세요."],
      ["06 / 일러스트 달력", "달력마다 다른 풍경을\n매달 새롭게 만나요.", "계절과 취미를 담은 다양한 일러스트 달력으로, 오늘을 기록하는 화면에도 새로운 분위기를 더할 수 있어요."],
    ],
    closing: ["오늘의 순간을", "나만의 페이지에 담아보세요."], get: "App Store에서 받기", support: "앱 지원",
    alt: ["다이어리 글자색, 배경색과 아이콘 선택 화면", "다이어리 글자색, 배경색과 아이콘 선택 화면", "다양한 디자인의 달력 목록 화면", "필름을 적용한 사진 편집 화면", "필름을 적용한 사진 편집 화면", "다양한 휴지통 아이템 목록 화면", "다양한 카메라 아이템 목록 화면", "사진과 글로 하루를 기록한 다이어리 화면", "다양한 분위기의 일러스트 달력 화면"],
    itemAlts: ["다이어리 클립 목록", "다이어리 휴지통 목록", "다이어리 카메라 목록"],
    filmLabels: ["따뜻한 색감", "흑백", "차가운 색감"],
  },
  en: {
    title: "A photo diary with a personal bookshelf",
    seoTitle: "Daylight | Photo Diary and Personal Bookshelf",
    description: "Keep a photo diary on your iPhone and organize the books you've read and your reading notes on your personal bookshelf in Daylight.",
    faqTitle: "Daylight photo diary: frequently asked questions",
    faqs: [
      ["What is Daylight?", "Daylight is an iOS photo diary where you can capture your day in photos and words and keep the books you've read and your reading notes on a personal bookshelf."],
      ["Can I keep photos and writing together?", "Yes. Choose a photo, add a few words about the day, and keep the moment together on one diary page."],
      ["Can I add a film look and date to a photo?", "Yes. Choose from different film looks, then add a caption or the photo date."],
      ["Can I customize the calendar?", "Yes. Choose from a variety of calendar designs and use your favorite in the diary."],
    ],
    nav: ["Diary", "Calendar", "Film", "Items", "Photo diary", "Illustrated calendars"],
    intro: "Add a few words to the photos you want to remember, and bring the books you've read and your reading notes together on your personal bookshelf.",
    features: [
      ["01 / DIARY", "Choose your colors.\nAdd a little icon.", "Set the text and paper colors separately, then finish today's entry with an icon that feels right."],
      ["02 / CALENDAR", "Find a calendar\nthat feels like yours.", "Browse a range of calendar designs, from paper and leather textures to calm neutrals and vivid colors."],
      ["03 / FILM", "One photo,\na different feeling.", "From warm light to cooler tones, try different films and find the mood that suits your photo."],
      ["04 / ITEMS", "Make each page\na little more personal.", "Decorate your diary with a growing collection of clips, cameras, bins, and other small items."],
      ["05 / YOUR STORY", "Photos add up\nto a story of your day.", "Gather photos and a few words on one page, turning ordinary moments into a diary you will want to open again."],
      ["06 / ILLUSTRATED CALENDARS", "A new scene\nfor every month.", "Bring a fresh mood to your daily pages with illustrated calendars inspired by seasons, hobbies, and little moments."],
    ],
    closing: ["Keep today's moment", "on a page of your own."], get: "Get it on the App Store", support: "App support",
    alt: ["Diary text, background color, and icon selection screen", "Diary text, background color, and icon selection screen", "Calendar list with a variety of designs", "Three film looks shown side by side", "Three film looks shown side by side", "Diary bin item collection", "Diary camera item collection", "A diary page filled with photos and writing", "Illustrated calendar scenes in different moods"],
    itemAlts: ["Diary clip collection", "Diary bin collection", "Diary camera collection"],
    filmLabels: ["Warm", "Black & white", "Cool blue"],
  },
  ja: {
    title: "本棚も管理できるフォトダイアリー",
    seoTitle: "Daylight｜本棚も管理できるフォトダイアリー",
    description: "写真と言葉で一日を記録し、読んだ本や読書記録は自分の本棚にまとめましょう。写真日記と本棚をDaylightひとつで管理できます。",
    faqTitle: "Daylightフォトダイアリー よくある質問",
    faqs: [
      ["Daylightはどんなアプリですか？", "写真と言葉で一日を記録し、読んだ本や読書記録を本棚にまとめて管理できるiOS向けフォトダイアリーです。"],
      ["写真と文章を一緒に残せますか？", "はい。写真を選び、その日の短い言葉を添えて、一日のひとコマを一ページに残せます。"],
      ["写真にフィルムの雰囲気や日付を加えられますか？", "はい。さまざまなフィルムの色合いを選び、写真に文章や日付を表示できます。"],
      ["カレンダーをカスタマイズできますか？", "はい。いろいろなデザインから選び、日記で使えます。"],
    ],
    nav: ["日記", "カレンダー", "フィルム", "アイテム", "写真日記", "イラストカレンダー"],
    intro: "心に残った写真にその日の言葉を添えて、読んだ本や読書記録は自分だけの本棚にまとめましょう。",
    features: [
      ["01 / 日記", "文字と背景に色を。\n小さなアイコンも。", "文字色と紙の背景色を別々に選び、アイコンを添えて今日の記録を仕上げましょう。"],
      ["02 / カレンダー", "お気に入りの一枚を\n選んで開く。", "紙や革、クリップの質感から落ち着いた色、鮮やかな色まで、さまざまなデザインを見比べられます。"],
      ["03 / フィルム", "同じ写真も、\nフィルムで変わる。", "あたたかな光からクールな色味まで、写真にぴったりの雰囲気を見つけましょう。"],
      ["04 / アイテム", "小物でページに\n自分らしさを。", "クリップやカメラ、ごみ箱など、さまざまなアイテムで日記を飾れます。"],
      ["05 / 写真日記", "写真が集まると、\n一日の物語になる。", "写真と短い言葉を一ページに重ねて、何気ない一日も、また開きたくなる記録に残しましょう。"],
      ["06 / イラストカレンダー", "月ごとに変わる\n新しい風景。", "季節や好きなことを描いたカレンダーで、毎日の記録に新しい雰囲気を添えられます。"],
    ],
    closing: ["今日のひとコマを", "自分だけのページに。"], get: "App Storeで入手", support: "アプリサポート",
    alt: ["日記の文字色、背景色、アイコン選択画面", "日記の文字色、背景色、アイコン選択画面", "さまざまなデザインのカレンダー一覧", "フィルムを適用した写真編集画面", "フィルムを適用した写真編集画面", "日記アイテムのごみ箱コレクション", "日記アイテムのカメラコレクション", "写真と文章で一日を記録した日記画面", "さまざまな雰囲気のイラストカレンダー"],
    itemAlts: ["日記のクリップ一覧", "日記のごみ箱一覧", "日記のカメラ一覧"],
    filmLabels: ["あたたかな色合い", "モノクロ", "涼しげな色合い"],
  },
  "zh-TW": {
    title: "也能管理個人書櫃的照片日記",
    seoTitle: "Daylight｜照片日記與個人書櫃",
    description: "用照片與文字記錄每天的生活，把讀過的書和閱讀筆記整理到個人書櫃。在 Daylight 裡，一次管理照片日記與書櫃。",
    faqTitle: "Daylight 照片日記常見問題",
    faqs: [
      ["Daylight 是什麼樣的 App？", "Daylight 是一款 iOS 照片日記 App，可以用照片和文字記錄生活，也能把讀過的書與閱讀筆記整理到個人書櫃。"],
      ["可以把照片和文字記錄在一起嗎？", "可以。選一張照片，寫下幾句當天的心情，就能把生活片刻留在同一頁。"],
      ["可以為照片加上底片效果和日期嗎？", "可以。你可以挑選不同的底片色調，也能在照片上顯示文字或日期。"],
      ["月曆可以自訂樣式嗎？", "可以。挑選喜歡的月曆設計，就能在手帳中使用。"],
    ],
    nav: ["手帳", "月曆", "底片", "小物", "照片日記", "插畫月曆"],
    intro: "為想留下的照片寫幾句當天的故事，再把讀過的書和閱讀筆記收進自己的書櫃。",
    features: [
      ["01 / 手帳", "挑選文字與背景色，\n再加上一個小圖示。", "分別選擇文字顏色和紙張背景色，再用合適的圖示為今天的日記收尾。"],
      ["02 / 月曆", "挑一本喜歡的月曆，\n慢慢翻開。", "從紙張、皮革與夾子的質感，到沉穩或鮮明的色彩，一次瀏覽多種月曆設計。"],
      ["03 / 底片", "同一張照片，\n呈現不同心情。", "從溫暖光感到清爽冷色，試試不同底片，找到最適合照片的氛圍。"],
      ["04 / 小物", "用喜歡的小物，\n裝飾每一頁。", "用夾子、相機、紙簍等各式小物，依照喜好裝飾你的手帳。"],
      ["05 / 照片日記", "照片一張張累積，\n成為一天的故事。", "把照片和幾句話收進同一頁，讓平凡的日常也成為想再次翻開的紀錄。"],
      ["06 / 插畫月曆", "每個月，都是\n一幅新的風景。", "用季節與日常靈感繪成的月曆，為每天的紀錄添上不同的氛圍。"],
    ],
    closing: ["把今天的片刻", "收藏在自己的頁面。"], get: "在 App Store 下載", support: "應用程式支援",
    alt: ["手帳文字顏色、背景顏色與圖示選擇畫面", "手帳文字顏色、背景顏色與圖示選擇畫面", "多種設計的月曆列表畫面", "套用底片的照片編輯畫面", "套用底片的照片編輯畫面", "多款手帳紙簍小物", "多款手帳相機小物", "以照片與文字記錄一天的手帳畫面", "多種氛圍的插畫月曆畫面"],
    itemAlts: ["手帳夾子列表", "手帳紙簍列表", "手帳相機列表"],
    filmLabels: ["暖色調", "黑白", "冷色調"],
  },
} as const;

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return locales.map(locale => ({ locale })); }

const headers = {
  en: { image: "/daylight/header-en.webp", blur: "header-en" },
  ja: { image: "/daylight/header-ja.webp", blur: "header-ja" },
  ko: { image: "/daylight/header-ko.webp", blur: "header-ko" },
  "zh-TW": { image: "/daylight/header-zh-TW.webp", blur: "header-zh-TW" },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const text = copy[locale];
  const description = text.description;
  const headerImage = headers[locale].image;
  return {
    title: { absolute: text.seoTitle }, description, alternates: localeAlternates(locale, "/app"),
    openGraph: { title: text.seoTitle, description, images: [headerImage] },
    twitter: { card: "summary_large_image" as const, title: text.seoTitle, description },
  };
}

const screenshots: readonly (readonly StaticImageData[])[] = [
  [diaryColors, diaryIcons],
  [calendarList],
  [],
  [diaryClipsEn, diaryBinsEn, diaryCamerasEn],
  [diaryPhotoReal],
  [],
] as const;

export default async function AppIntroPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = copy[locale];
  const { image: headerImage, blur: headerKey } = headers[locale];

  return (
    <AppScrollMotion className={styles.page} lang={locale}>
      <JsonLd data={appJsonLd({
        description: text.description,
        locale,
        featureList: text.features.map(([label, , description]) => `${label.replace(/^\d+\s*\/\s*/, "")}: ${description.replaceAll("\n", " ")}`),
        screenshots: screenshots.flat().map((screen) => `${site.siteUrl}${screen.src}`),
      })} />
      <section className={styles.hero} aria-label="Daylight">
        <div className={styles.heroHeading}>
          <Image
            className={styles.heroBanner}
            src={headerImage}
            alt=""
            width={3840}
            height={1646}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blur[headerKey]}
            preload
          />
          <div className={styles.heroDownload}><AppStoreBadge locale={locale} label={text.get} /></div>
        </div>
        <nav className={styles.featureNav} aria-label={text.nav.join(" / ")}>
          {text.nav.map((label, index) => <a key={label} href={"#daylight-" + (index === 4 ? 4 : index === 5 ? 5 : index)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
        </nav>
      </section>
      <section className={styles.intro} data-reveal="text">
        <p className={styles.eyebrow}>DAYLIGHT <span aria-hidden="true">/</span> PHOTO DIARY</p>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
      </section>
      {text.features.map((feature, index) => (
        <section key={feature[0]} id={"daylight-" + index} className={`${styles.feature} ${index % 2 ? styles.reverse : ""} ${index === 3 ? styles.widgets : ""} ${[1, 4, 5].includes(index) ? styles.singleFeature : ""}`} aria-labelledby={"daylight-title-" + index}>
          <div className={styles.featureInner}>
            <div className={styles.featureCopy}>
              <p data-reveal="text" className={styles.eyebrow}>{feature[0]}</p>
              <h2 data-reveal="text" data-reveal-delay="80" id={"daylight-title-" + index}>{feature[1]}</h2>
              <p data-reveal="text" data-reveal-delay="160" className={styles.description}>{feature[2]}</p>
            </div>
            <div className={`${styles.screenPair} ${index === 1 ? styles.calendarShowcase : ""} ${index === 4 ? styles.singleScreenShowcase : ""}`}>
              {index === 2 ? <DaylightFilmSequence alt={text.alt[3]} labels={text.filmLabels} /> : index === 5 ? <DaylightCalendarSequence alt={text.alt[8]} locale={locale} /> : screenshots[index].map((screen, position) => (
                <figure key={screen.src} data-reveal={position % 2 ? "screen-right" : "screen-left"} data-reveal-delay={position * 160} className={styles.screen}>
                  <div className={styles.screenFrame}><Image src={screen} alt={index === 3 ? text.itemAlts[position] : text.alt[index === 0 ? position : index === 1 ? 2 : index === 3 ? position + 5 : 7]} sizes={index === 1 || index === 4 ? "(max-width: 760px) 230px, 540px" : "(max-width: 760px) 44vw, (max-width: 1200px) 25vw, 280px"} placeholder="blur" /></div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className={styles.faqSection} aria-labelledby="daylight-faq-title">
        <div className={styles.faqInner}>
          <p className={styles.eyebrow}>DAYLIGHT <span aria-hidden="true">/</span> FAQ</p>
          <h2 id="daylight-faq-title">{text.faqTitle}</h2>
          <dl>
            {text.faqs.map(([question, answer]) => (
              <div key={question}>
                <dt>{question}</dt>
                <dd>{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className={styles.closing}>
        <p className={styles.eyebrow}>DAYLIGHT</p>
        <h2 data-reveal="text">{text.closing[0]}<br />{text.closing[1]}</h2>
        <div className={styles.actions}>
          <AppStoreBadge locale={locale} label={text.get} iconSrc="/daylight/daylight-app-icon-pink.png" className="border border-white/30" />
          <a className={styles.textLink} href={withLocale(locale, "/app/privacy")}>Daylight Privacy Policy (English)</a>
          <a className={styles.textLink} href={withLocale(locale, "/support")}>{text.support} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </AppScrollMotion>
  );
}
