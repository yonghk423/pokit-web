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
    support: "アプリサポート",
    briefing: "ウェルネスブリーフィング",
    newArrivals: "ルーチン道具",
    app: "アプリ紹介",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "日常ルーチン・ウェルネス by POKIT",
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
    radioEmpty: (sectionNav) =>
      `Home Page → ${sectionNav} でストーリーを3つつないでください。`,
    viewAllStories: "日常・ルーチン・ウェルネスの話をすべて見る →",
    heroLine1: "日常ルーチンとウェルネス。",
    heroAccent: "ポケット",
    heroRest: "ガイド。",
    feedTitle: "最新のストーリー",
    workLine1: "一日の場面を",
    workAccent: "ルーチンで",
    workRest: "つなぐ。",
    labsLine1: "一日をつかむ",
    labsAccent: "ルーチン",
    labsRest: "道具。",
    aboutTitle:
      "POKITは、小さな日常ルーチンでウェルネスを育てるポケットガイドです。",
    aboutBody:
      "今週のリズムから移動・空間・眠り・からだほぐしまで。\n負担の少ないひと場面が、一日を変えていきます。",
    aboutCta: "アプリを見る",
    exploreAll: "すべて見る",
    closePreview: "一覧へ",
  },
  article: {
    backHome: "← Back to POKIT",
    koreanOnlyBanner:
      "このページの日本語版はまだありません。韓国語の原文を表示しています。",
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
  notFound: {
    title: "ページが見つかりません",
    description: "アドレスが変わったか、ページが削除された可能性があります。",
    home: "ホームへ",
    allStories: "すべてのストーリー",
  },
  support: {
    title: "POKITサポート",
    description: "POKITの紹介、画面ガイド、よくある質問、お問い合わせ。",
    intro: "サイト・アプリに関するご質問は、下のメールへどうぞ。",
    email: "メール",
    sendMail: "メールを送る",
    contactCta: "お問い合わせ",
    contactHint: "困ったことがあればメールください",
    backHome: "← ホームへ",
    help: "サポート · FAQ",
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
    pastTools: "これまでの道具",
    empty: "まだ公開されたルーチン道具リストはありません。",
    backToHub: "← ルーチン道具一覧",
    viewFull: "すべて見る",
    viewAll: "道具すべて",
    allTools: "すべての道具",
    allToolsCount: (total) => `全${total}件`,
    metaDescriptionFromItems: (names) => {
      const joined = names.slice(0, 3).join(" · ");
      return joined
        ? `${joined}。POKITルーチン道具のおすすめ`
        : "生産性とウェルネスを支える道具をおすすめするPOKITルーチン道具";
    },
    localeFallbackBanner:
      "このページの日本語版はまだありません。韓国語を表示しています。",
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
