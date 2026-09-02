import type { Dictionary } from "@/i18n/types";

const dictionary: Dictionary = {
  meta: {
    siteTitle: "POKIT — 日々のウェルネスルーチン",
    siteDescription:
      "小さな日常ルーチンでウェルネスを育てるガイドとアプリ。POKITで日常・ルーチン・ウェルネスの話をどうぞ。",
  },
  header: {
    tagline: "日常ルーチンとウェルネスのためのポケットガイド",
    openMenu: "メニューを開く",
    homeAria: "POKIT ホーム",
    allStories: "すべてのストーリー",
    app: "App",
    contact: "Contact",
    categoriesAria: "カテゴリー",
  },
  footer: {
    tagline: "日常ルーチンとウェルネスで、一日を整える。",
    sections: "セクション",
    information: "Information",
    allStories: "すべてのストーリー",
    support: "サポート",
    briefing: "ウェルネスブリーフィング",
    newArrivals: "ルーチン道具",
    app: "アプリ紹介",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "日常ルーチン・ウェルネスインテリジェンス by POKIT",
    sections: {
      weekly: {
        nav: "今週",
        kicker: "今週",
        title: "日常の一週間をひらく話",
      },
      newArrivals: {
        nav: "ルーチン道具",
        kicker: "ルーチン道具",
        title: "生産性とウェルネスを支える道具",
      },
      routine: {
        nav: "ルーチン",
        kicker: "ルーチン",
        title: "いま始めやすい日常ルーチン",
      },
      commute: {
        nav: "移動・休憩",
        kicker: "移動・休憩",
        title: "移動と休みのあいだの日常",
      },
      space: {
        nav: "空間",
        kicker: "空間",
        title: "日常の空間を組み直す話",
      },
      sleep: {
        nav: "睡眠・夜",
        kicker: "睡眠・夜",
        title: "一日を閉じる夜のルーチン",
      },
      wellness: {
        nav: "ウェルネス",
        kicker: "ウェルネス",
        title: "日常ウェルネス、体のための10分",
      },
    },
    storiesAria: (label) => `${label}のストーリー`,
    radioEmpty: (sectionNav) =>
      `Home Page → ${sectionNav} でストーリーを3つつないでください。`,
    viewAllStories: "日常・ルーチン・ウェルネスの話をすべて見る →",
    carouselPrev: (label) => `${label} 前へ`,
    carouselNext: (label) => `${label} 次へ`,
  },
  archive: {
    label: "Archive",
    allStories: "すべてのストーリー",
    storiesIn: (label) => `${label}のストーリー`,
    search: "検索",
    searchPlaceholder: "タイトル、説明、キーワード",
    searchSubmit: "検索",
    clearSearch: "検索をクリア",
    clearFilters: "フィルター解除 · すべてのストーリーを見る",
    searchResults: (term, total, start, end) =>
      `"${term}" の検索結果 ${total}件 · ${start}–${end}件目`,
    searchNoResults: (term) => `"${term}" に合うストーリーはありません。`,
    totalRange: (total, start, end, sortLabel) =>
      `全${total}件 · ${start}–${end}件目 (${sortLabel})`,
    empty: "まだ公開されたストーリーはありません。",
    noSearchMatch: "別の検索語を試すか、検索をクリアしてください。",
    studioHint: "Sanity Studioで公開すると、ここに表示されます。",
    backHome: "← ホームへ",
    pageSuffix: (page, search) =>
      search ? ` (${page}ページ · "${search}")` : ` (${page}ページ)`,
    descriptionAll:
      "日常ルーチンとウェルネスガイド。POKITに公開されたすべてのストーリーをどうぞ。",
    descriptionCategory: (label) =>
      `${label}。日常のルーチンとウェルネスの話 | POKIT`,
    descriptionSection: (label) =>
      `${label}。日常ルーチン・ウェルネスの話 | POKIT`,
    descriptionSearch: (term) =>
      `"${term}" の検索結果。日常・ルーチン・ウェルネスの話をPOKITで。`,
    paginationAria: "ストーリー一覧のページ",
    prev: "← 前へ",
    next: "次へ →",
    viewModeAria: "表示方法",
    viewLabel: "表示",
    viewGrid: "ギャラリー",
    viewList: "リスト",
    sortAria: "並び順",
    sortNewest: "新しい順",
    sortOldest: "古い順",
  },
  article: {
    backHome: "← Back to POKIT",
    koreanOnlyBanner:
      "この記事の日本語版はまだありません。韓国語の原文を表示しています。",
    relatedStories: (label) => `${label}のストーリー`,
    viewMore: "もっと見る →",
    addToPokit: {
      ariaLabel: "このルーチンをPOKITアプリに入れる",
      title: "このルーチンをアプリに入れてみよう",
      button: "POKITに入れる",
      sent: "アプリで続きを保存できます",
      fallback: "POKITアプリで日常ルーチンを記録し、ウェルネスを守ろう。",
      download: "App Storeでダウンロード",
      qrAria: "POKITアプリ App Store QRコード",
      qrHint: "スマホのカメラでスキャンしてインストール",
    },
  },
  appDownload: {
    kicker: "日常ルーチンとウェルネスをポケットに",
    title: "POKITアプリで日常ルーチンを記録し、ウェルネスを守ろう。",
    download: "App Storeでダウンロード",
    qrAria: "POKITアプリ App Store QRコード",
    qrHint: "スマホのカメラでスキャンしてインストール",
  },
  appPage: {
    metaTitle: "POKITアプリ",
    metaDescription:
      "一日の始まりと終わりを決め、ルーチン・やること・メモ・記録をひとつに。POKITアプリで日常を軽やかに。",
    kicker: "App",
    title: "一日を入れるポケット、POKIT",
    lead: "一日が何時に始まって何時に終わるかだけ決めておけば、今日はずっとシンプル。ルーチンもやることもメモも記録も、アプリひとつに入れておこう。",
    download: "App Storeで入手",
    featuresHeading: "アプリを開くと、こう使います",
    features: [
      {
        id: "routines",
        title: "今日のルーチン、ここから",
        body: "はじめて開くと、まず一日の始まりと終わりを決めます。そのあと今日のルーチンがひと画面に並びます。大事なものを示して、終わったらチェック。足りなければその場で追加できます。",
        imageAlt: "POKITアプリの今日のルーチン一覧画面",
      },
      {
        id: "memo",
        title: "ロック画面にも残るメモ",
        body: "よく見るメモはロック画面にも出せます。アプリで書いておけば、スマホを起こすたびに目に入ります。",
        imageAlt: "iPhoneのロック画面に表示されるPOKITクイックメモ",
      },
      {
        id: "notes",
        title: "今日のノート、一日を書き残す",
        body: "今日あったこと、チェックリスト、短い考えをひとつに書けます。文も、タスクも、箇条書きも混ぜてOKです。",
        imageAlt: "POKITアプリの今日のノート画面",
      },
      {
        id: "todos",
        title: "やること、大事な順に",
        body: "やることに時間と優先度をつけて入れたら終わり。タップでチェック、長押しで完了できます。",
        imageAlt: "POKITアプリのやること一覧画面",
      },
      {
        id: "history",
        title: "どれだけ続いたか、ふりかえる",
        body: "今週・今月どれだけできたかが一目でわかります。よく続けているルーチンもすぐ見つかります。",
        imageAlt: "POKITアプリの月間ヒストリー・完了記録画面",
      },
      {
        id: "library",
        title: "読んでいる本をまとめる",
        body: "読んでいる本と読み終わった本を分けて置けます。読書ルーチンのそばにあると続きやすいです。",
        imageAlt: "POKITアプリのマイライブラリー画面",
      },
    ],
    galleryHeading: "画面から見てみよう",
    galleryLead: "ルーチンから記録まで、よく使う画面だけ集めました。",
    ctaKicker: "今すぐ始める",
    ctaTitle: "POKITを入れて、今日から少しずつ埋めていこう。",
  },
  notFound: {
    title: "ページが見つかりません",
    description: "アドレスが変わったか、ページが削除された可能性があります。",
    home: "ホームへ",
    allStories: "すべてのストーリー",
  },
  support: {
    title: "サポート",
    description: "POKITお問い合わせ",
    intro: "サイト・アプリに関するご質問は、下のメールへどうぞ。",
    email: "メール",
    sendMail: "メールを送る",
    backHome: "← ホームへ",
  },
  briefing: {
    nav: "ウェルネスブリーフィング",
    kicker: "週間ブリーフィング",
    hubTitle: "ウェルネスブリーフィング",
    hubDescription:
      "公的機関・国際機関のニュースをPOKITが要約し、日常ルーチンにつなげます。原文は出典で確認してください。",
    weekTitle: (weekLabel) => `${weekLabel} ウェルネスブリーフィング`,
    weekDescription: (title) =>
      `${title}。日常ルーチン・ウェルネス視点の週間キュレーション | POKIT`,
    sourceLabel: "出典",
    readSourceLabel: "原文を見る",
    editorNoteLabel: "POKITノート",
    relatedLabel: "あわせて読みたい話",
    archiveTitle: "過去のブリーフィング",
    empty: "まだ公開されたブリーフィングはありません。",
    backToHub: "← ブリーフィング一覧",
    viewFull: "すべて見る",
    metaDescriptionFromItems: (headlines) => {
      const joined = headlines.slice(0, 3).join(" · ");
      return joined
        ? `${joined}。POKIT週間ウェルネスブリーフィング`
        : "公的・国際のウェルネスニュースを日常ルーチンにつなげるPOKIT週間ブリーフィング";
    },
  },
  newArrivals: {
    nav: "ルーチン道具",
    kicker: "ルーチン道具",
    hubTitle: "ルーチン道具",
    hubDescription:
      "生産性・健康・ウェルネスを高める道具を、場面と一緒におすすめします。新商品の羅列ではなく、実際にルーチンに足す方法です。",
    weekTitle: (weekLabel) => `${weekLabel} ルーチン道具`,
    weekDescription: (title) =>
      `${title}。日常ルーチンを支える道具のおすすめ | POKIT`,
    sourceLabel: "根拠",
    readSourceLabel: "出典を見る",
    productLabel: "参考リンク",
    archiveTitle: "過去のルーチン道具",
    empty: "まだ公開されたルーチン道具リストはありません。",
    backToHub: "← ルーチン道具一覧",
    viewFull: "すべて見る",
    viewAll: "道具すべて",
    metaDescriptionFromItems: (names) => {
      const joined = names.slice(0, 3).join(" · ");
      return joined
        ? `${joined}。POKITルーチン道具のおすすめ`
        : "生産性とウェルネスを支える道具をおすすめするPOKITルーチン道具";
    },
  },
  categories: {
    Weekly: "今週",
    Routine: "ルーチン",
    Commute: "移動・休憩",
    Space: "空間",
    Sleep: "睡眠・夜",
    Wellness: "ウェルネス",
    design: "空間",
  },
  sectionHeading: {
    viewAll: "もっと見る",
  },
  languageSwitcher: {
    label: "Language",
    ko: "한국어",
    en: "English",
    ja: "日本語",
  },
  dates: {
    intl: "ja-JP",
  },
};

export default dictionary;
