import type { LegacyDictionary } from "@/i18n/types";

const dictionary: LegacyDictionary = {
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
  dates: {
    intl: "ja-JP",
  },
};

export default dictionary;
