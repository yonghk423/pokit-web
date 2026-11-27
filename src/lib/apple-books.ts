import type { Locale } from "@/i18n/config";
import type { LibraryBook } from "@/lib/library-shelves";

type ITunesEbookResult = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  genres?: string[];
  releaseDate?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  description?: string;
  price?: number;
};

type ITunesSearchResponse = {
  resultCount?: number;
  results?: ITunesEbookResult[];
};

const SIMPLIFIED_ONLY_RE =
  /[书东业丛临为丽举义乌乐习乡买乱争亏亚产亲亿仅从仪们价众优伙会伟传伤伦体写军农关兴养刘刚创删剂剑剧劝办务动励劳势区医华协单卖卫厅历厉压厌县参双发变叙号叹听启员响团园围国图圆圣场坏块坚墙声处备复头夺奖妇妈学宁宝实宠审宽对寻导寿将尔尝层属岁岛币师带帮广庄庆库应庙废开张强归当录态怀总恋恶悦惊惧惨惯愤愿戏战扩扫扬扰抢护报担拟拥择损换据摆敌数断时显术机杀杂权条来杨极构标栏树样桥梦检楼欢欧气汉汇沟沧泽洁浅测济浑浓涛润涨渐渔湾湿满滨滚爱电画畅疗监盖盘矿确礼离种积称稳穷笔简类红约级纪纯纲纳纸纹线练组细织终经结绕绘给络绝统继绩绪续维绿编罗联脑脱脸艺节苏荣药获营蓝补装见观规视览觉触计认让训议讯记讲许论设访证评识词译诗诚话诞详语误说请读课谁调谈谋谢谨谱贝负贡财责贤败货质贫购贵贷贸费贺资赏赛赞赢赶赵跃车轨转轮软轻载较辑输辞边达迁过迈运还这进远违连迟适选逊递遗邓邮邻郑释鉴针钟钢钱铁银错长门闪闭问闲间闹闻阅队阳阴阵阶际陆陈险随隐难韩韵页顶项顺须顾顿预领频题颜风飞饭饮饰馆马驱验骏骗鱼鲁鲜鸟鸡鸣麦齐齿龄龙]/;

const ADULT_NOISE_RE =
  /\b(porn|xxx|nsfw|erotica|steamy|fetish|bdsm|hentai)\b/i;

const EN_NOISE_RE =
  /\b(study guide|workbook|summary of|exam prep|test prep|flashcards|box set|boxed set|coloring book|trivia|crossword|sudoku|activity book|textbook|edition\s*\d|for kids|children'?s|bedtime stories for kids|billionaire)\b/i;

const JA_NOISE_RE =
  /コミック|漫画|マンガ|異世界|転生|電子単行本|分冊版|合本版|ライトノベル|ラノベ|問題集|過去問|資格|試験|対策|参考書|ドリル|児童書|絵本|学習まんが|攻略本|写真集|恋愛暴君|悪役令嬢|チート|スキル|ハーレム|勇者|魔王|召喚|追放|スローライフ～|【連載版】|（\d+）$|巻$/;

const ZH_TW_NOISE_RE =
  /漫畫|色情|情色|題庫|考試|測驗|檢定|攻略|寫真|輕小說|穿越|重生|反派千金|總裁|霸道|童顏|巨乳|公職|證照|國考|學測|指考|統測|會考|多益|TOEIC|簡體/i;

const JA_SCRIPT_RE = /[\u3040-\u30ff]/;
const CJK_RE = /[\u4e00-\u9fff]/;

function sanitizeText(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function highResArtwork(url: string | undefined): string {
  if (!url) return "";
  return url.replace(/100x100bb/i, "600x600bb");
}

function formatReleaseDate(iso: string | undefined): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  return `${match[1]}${match[2]}${match[3]}`;
}

function pickGenreLabel(genres: string[] | undefined, locale: Locale): string {
  if (!Array.isArray(genres) || genres.length === 0) return "";
  const skip = new Set(["Books", "ブック", "書籍", "图书", "Nonfiction"]);
  const preferred = genres.find((g) => g && !skip.has(g));
  if (preferred) return preferred;
  if (locale === "ja") return "Apple Books";
  if (locale === "zh-TW") return "Apple Books";
  return "Apple Books";
}

function isQualityAppleBook(
  raw: ITunesEbookResult,
  locale: Locale,
  strictCuration: boolean,
): boolean {
  if (!raw.trackId || !raw.trackName || !raw.artworkUrl100 || !raw.trackViewUrl) {
    return false;
  }

  const title = raw.trackName.trim();
  const author = (raw.artistName ?? "").trim();
  const desc = sanitizeText(raw.description).slice(0, 260);
  const combined = `${title} ${author} ${desc}`;

  if (locale === "en") {
    if (CJK_RE.test(title) || JA_SCRIPT_RE.test(title)) return false;
    if (ADULT_NOISE_RE.test(combined)) return false;
    if (strictCuration && EN_NOISE_RE.test(combined)) return false;
    return true;
  }

  if (locale === "ja") {
    if (!JA_SCRIPT_RE.test(title) && !CJK_RE.test(title)) return false;
    if (JA_NOISE_RE.test(title)) return false;
    if (strictCuration && JA_NOISE_RE.test(`${title} ${author}`)) return false;
    return true;
  }

  if (locale === "zh-TW") {
    if (!CJK_RE.test(title)) return false;
    if (JA_SCRIPT_RE.test(title)) return false;
    if (SIMPLIFIED_ONLY_RE.test(title) || SIMPLIFIED_ONLY_RE.test(author)) {
      return false;
    }
    if (strictCuration && SIMPLIFIED_ONLY_RE.test(desc.slice(0, 120))) {
      return false;
    }
    if (ZH_TW_NOISE_RE.test(`${title} ${author}`)) return false;
    return true;
  }

  return true;
}

function mapAppleBook(raw: ITunesEbookResult, locale: Locale): LibraryBook {
  return {
    itemId: raw.trackId ?? 0,
    title: sanitizeText(raw.trackName),
    author: sanitizeText(raw.artistName),
    publisher: pickGenreLabel(raw.genres, locale),
    pubDate: formatReleaseDate(raw.releaseDate),
    coverUrl: highResArtwork(raw.artworkUrl100),
    link: raw.trackViewUrl ?? "",
    description: sanitizeText(raw.description),
  };
}

export function appleBooksCountryForLocale(locale: Locale): "US" | "JP" {
  // Apple Books TW store only serves $0 public-domain texts;
  // US store carries full modern Traditional Chinese catalogs from Taiwanese publishers.
  return locale === "ja" ? "JP" : "US";
}

export async function fetchAppleBooksShelf(
  query: string,
  locale: Locale,
  limit = 28,
): Promise<LibraryBook[]> {
  const country = appleBooksCountryForLocale(locale);
  const params = new URLSearchParams({
    term: query,
    media: "ebook",
    entity: "ebook",
    country,
    limit: String(Math.min(limit, 50)),
  });

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?${params.toString()}`,
      {
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return [];
    const payload = (await response.json().catch(() => null)) as
      | ITunesSearchResponse
      | null;
    if (!payload || !Array.isArray(payload.results)) return [];

    const seenTitles = new Set<string>();
    const books: LibraryBook[] = [];

    for (const raw of payload.results) {
      if (!isQualityAppleBook(raw, locale, true)) continue;
      const mapped = mapAppleBook(raw, locale);
      const normTitle = mapped.title.toLowerCase().replace(/\s+/g, " ").trim();
      if (!normTitle || seenTitles.has(normTitle)) continue;
      seenTitles.add(normTitle);
      books.push(mapped);
    }

    return books;
  } catch {
    return [];
  }
}

export async function searchAppleBooks({
  query,
  locale,
  page = 1,
  pageSize = 20,
}: {
  query: string;
  locale: Locale;
  page?: number;
  pageSize?: number;
}): Promise<{ items: LibraryBook[]; page: number; hasMore: boolean }> {
  const country = appleBooksCountryForLocale(locale);
  const safePage = Math.max(1, Math.min(page, 8));
  // iTunes Search ignores `offset`; over-fetch and slice deterministically.
  const fetchLimit = Math.min(
    locale === "zh-TW" ? safePage * pageSize * 2 + 20 : safePage * pageSize + 20,
    200,
  );

  const params = new URLSearchParams({
    term: query,
    media: "ebook",
    entity: "ebook",
    country,
    limit: String(fetchLimit),
  });

  const response = await fetch(
    `https://itunes.apple.com/search?${params.toString()}`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    },
  );

  if (!response.ok) {
    throw new Error(`apple_books_http_${response.status}`);
  }

  const payload = (await response.json().catch(() => null)) as
    | ITunesSearchResponse
    | null;
  const rawList = Array.isArray(payload?.results) ? payload.results : [];

  const filtered: LibraryBook[] = [];
  const seenIds = new Set<number>();

  // First pass with locale quality filter
  for (const raw of rawList) {
    if (!raw.trackId || seenIds.has(raw.trackId)) continue;
    if (!isQualityAppleBook(raw, locale, false)) continue;
    seenIds.add(raw.trackId);
    filtered.push(mapAppleBook(raw, locale));
  }

  // Fallback: if user typed a foreign-language query (e.g. English title on ja/zh-TW page),
  // don't hide direct matches solely due to script check.
  if (filtered.length === 0 && rawList.length > 0) {
    for (const raw of rawList) {
      if (
        !raw.trackId ||
        !raw.trackName ||
        !raw.artworkUrl100 ||
        !raw.trackViewUrl ||
        seenIds.has(raw.trackId)
      ) {
        continue;
      }
      seenIds.add(raw.trackId);
      filtered.push(mapAppleBook(raw, locale));
    }
  }

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);
  const hasMore = filtered.length > end && safePage < 8;

  return { items, page: safePage, hasMore };
}
