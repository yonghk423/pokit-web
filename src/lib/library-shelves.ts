import { localeToIntl, type Locale } from "@/i18n/config";
import { fetchAppleBooksShelf } from "@/lib/apple-books";

export type LibraryProvider = "yes24" | "apple-books";

export type LibraryBook = {
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  coverUrl: string;
  link: string;
  description: string;
};

export type LibraryCategory = {
  id: string;
  name: string;
};

export type LibraryCategoryGroup = {
  id: string;
  label: string;
  query?: string;
  children: { id: string; label: string; query?: string }[];
};

export type LibraryShelfSection = {
  id: string;
  query: string;
  name: string;
  title: string;
  books: LibraryBook[];
};

export type InitialLibraryData = {
  provider: LibraryProvider;
  hero: LibraryBook | null;
  feed: LibraryBook[];
  shelves: LibraryShelfSection[];
  categoryGroups: LibraryCategoryGroup[];
};

type ShelfSpec = {
  id: string;
  queries: Record<Locale, string>;
  labels: Record<Locale, { name: string; title: string }>;
};

const SHELF_SPECS: readonly ShelfSpec[] = [
  {
    id: "essays",
    queries: {
      ko: "산문집",
      en: "personal essays memoir",
      ja: "エッセイ集",
      "zh-TW": "散文 台灣",
    },
    labels: {
      ko: { name: "산문", title: "하루 끝에 천천히 펼치는 문장과 기록." },
      en: {
        name: "Essays",
        title: "Short reflections and quiet lines for the end of the day.",
      },
      ja: {
        name: "エッセイ",
        title: "一日の終わりにゆっくりひらく文章と記録。",
      },
      "zh-TW": {
        name: "散文",
        title: "在一天結束時慢慢翻開的句子與日常紀錄。",
      },
    },
  },
  {
    id: "fiction",
    queries: {
      ko: "소설",
      en: "literary fiction novel",
      ja: "短編小説",
      "zh-TW": "台灣 小說",
    },
    labels: {
      ko: { name: "소설", title: "잠시 다른 시간에 머무르게 하는 이야기." },
      en: {
        name: "Fiction",
        title: "Stories that let you linger in another quiet afternoon.",
      },
      ja: { name: "小説", title: "少しだけ別の時間に身を置ける物語。" },
      "zh-TW": {
        name: "小說",
        title: "讓人暫時停留在另一段時光裡的故事。",
      },
    },
  },
  {
    id: "walk",
    queries: {
      ko: "산책",
      en: "walking nature writing",
      ja: "散歩 エッセイ",
      "zh-TW": "散步 旅行 台灣",
    },
    labels: {
      ko: { name: "산책", title: "걷고 바라보며 일상의 감각을 깨우는 책." },
      en: {
        name: "Walks",
        title: "Books for noticing small details on an unhurried walk.",
      },
      ja: {
        name: "散歩",
        title: "歩いて眺めながら日常の感覚をひらく本。",
      },
      "zh-TW": {
        name: "散步",
        title: "一邊行走與觀察，重新感受日常細節的書。",
      },
    },
  },
  {
    id: "rest",
    queries: {
      ko: "휴식",
      en: "slow living mindfulness",
      ja: "暮らし 整える",
      "zh-TW": "慢活 療癒",
    },
    labels: {
      ko: { name: "휴식", title: "숨을 고르고 마음을 내려놓는 시간." },
      en: {
        name: "Rest",
        title: "Unwind your pace and leave room to breathe.",
      },
      ja: { name: "休息", title: "呼吸を整えて心をほどくひととき。" },
      "zh-TW": { name: "休息", title: "放慢步調、讓心靜下來的片刻。" },
    },
  },
  {
    id: "seasons",
    queries: {
      ko: "계절",
      en: "seasons nature essays",
      ja: "季節 エッセイ",
      "zh-TW": "生活 隨筆 咖啡",
    },
    labels: {
      ko: { name: "계절", title: "오늘의 날씨와 계절을 닮은 한 권." },
      en: {
        name: "Seasons",
        title: "Pages tuned to the light and weather of the season.",
      },
      ja: {
        name: "季節",
        title: "今日の空や季節の気配に寄り添う一冊。",
      },
      "zh-TW": {
        name: "季節",
        title: "貼近今日光線與季節氣息的一本書。",
      },
    },
  },
];

/** Curated fallback queries for zh-TW shelves if a single query returns few Traditional results */
const ZH_TW_FALLBACK_QUERIES: Record<string, string> = {
  essays: "龍應台 散文",
  fiction: "白先勇 小說",
  walk: "台北 旅行 散步",
  rest: "心靈 休息 生活",
  seasons: "四季 咖啡 風景",
};

/** Curated Apple Books topic directory for en / ja / zh-TW */
const APPLE_BOOK_CATEGORIES: Record<
  Exclude<Locale, "ko">,
  LibraryCategoryGroup[]
> = {
  en: [
    {
      id: "en-essays",
      label: "Essays & Memoir",
      query: "personal essays memoir",
      children: [
        { id: "en-essays-personal", label: "Personal Essays", query: "personal essays" },
        { id: "en-essays-memoir", label: "Literary Memoir", query: "literary memoir" },
        { id: "en-essays-letters", label: "Letters & Diaries", query: "diaries letters literature" },
        { id: "en-essays-food", label: "Food Writing", query: "food memoir essays" },
        { id: "en-essays-art", label: "Writing & Craft", query: "on writing craft" },
      ],
    },
    {
      id: "en-fiction",
      label: "Fiction & Literature",
      query: "literary fiction novel",
      children: [
        { id: "en-fiction-lit", label: "Literary Fiction", query: "literary fiction" },
        { id: "en-fiction-short", label: "Short Stories", query: "short stories anthology" },
        { id: "en-fiction-classics", label: "Modern Classics", query: "modern classic novel" },
        { id: "en-fiction-translated", label: "Translated Fiction", query: "japanese novel translated" },
        { id: "en-fiction-poetry", label: "Poetry", query: "contemporary poetry" },
      ],
    },
    {
      id: "en-wellness",
      label: "Rest & Mindfulness",
      query: "slow living mindfulness",
      children: [
        { id: "en-well-slow", label: "Slow Living", query: "slow living" },
        { id: "en-well-sleep", label: "Sleep & Rest", query: "rest sleep recovery" },
        { id: "en-well-mind", label: "Mindfulness", query: "everyday mindfulness" },
        { id: "en-well-habits", label: "Daily Rituals", query: "daily rituals habits" },
        { id: "en-well-calm", label: "Calm & Solitude", query: "solitude quiet living" },
      ],
    },
    {
      id: "en-nature",
      label: "Walks & Nature",
      query: "walking nature writing",
      children: [
        { id: "en-nat-walk", label: "Walking", query: "art of walking" },
        { id: "en-nat-seasons", label: "Seasons", query: "seasons nature essays" },
        { id: "en-nat-gardens", label: "Gardens & Plants", query: "garden writing essays" },
        { id: "en-nat-travel", label: "Travel Literature", query: "literary travel writing" },
        { id: "en-nat-sea", label: "Forests & Sea", query: "forest nature memoir" },
      ],
    },
    {
      id: "en-design",
      label: "Space & Design",
      query: "interior design home living",
      children: [
        { id: "en-des-home", label: "Home & Spaces", query: "quiet home living" },
        { id: "en-des-arch", label: "Architecture", query: "architecture essay" },
        { id: "en-des-min", label: "Minimalism", query: "simple living minimalism" },
        { id: "en-des-photo", label: "Photography & Art", query: "art aesthetics essays" },
      ],
    },
    {
      id: "en-humanities",
      label: "Philosophy & Psychology",
      query: "everyday philosophy psychology",
      children: [
        { id: "en-hum-phil", label: "Everyday Philosophy", query: "stoicism philosophy daily" },
        { id: "en-hum-psych", label: "Psychology", query: "emotional psychology" },
        { id: "en-hum-hist", label: "Cultural History", query: "cultural history" },
        { id: "en-hum-sci", label: "Science & Wonder", query: "popular science nature" },
      ],
    },
  ],
  ja: [
    {
      id: "ja-essays",
      label: "エッセイ・随筆",
      query: "エッセイ集",
      children: [
        { id: "ja-ess-daily", label: "日常エッセイ", query: "日常 エッセイ" },
        { id: "ja-ess-food", label: "食のエッセイ", query: "食 エッセイ" },
        { id: "ja-ess-travel", label: "旅エッセイ", query: "旅 エッセイ" },
        { id: "ja-ess-diary", label: "日記・記録", query: "日記 エッセイ" },
        { id: "ja-ess-books", label: "読書・書評", query: "読書 エッセイ" },
      ],
    },
    {
      id: "ja-fiction",
      label: "小説・文学",
      query: "短編小説",
      children: [
        { id: "ja-fic-short", label: "短編小説", query: "短編小説" },
        { id: "ja-fic-lit", label: "純文学", query: "純文学 小説" },
        { id: "ja-fic-bunko", label: "名作文学", query: "日本文学 名作" },
        { id: "ja-fic-poetry", label: "詩歌・俳句", query: "詩集 現代詩" },
        { id: "ja-fic-mystery", label: "ミステリー", query: "ミステリー 小説" },
      ],
    },
    {
      id: "ja-living",
      label: "暮らし・整える",
      query: "暮らし 整える",
      children: [
        { id: "ja-liv-life", label: "丁寧な暮らし", query: "丁寧な暮らし" },
        { id: "ja-liv-room", label: "部屋・インテリア", query: "インテリア 暮らし" },
        { id: "ja-liv-coffee", label: "珈琲・お茶", query: "コーヒー 暮らし" },
        { id: "ja-liv-cook", label: "季節の料理", query: "季節 料理 エッセイ" },
        { id: "ja-liv-min", label: "片づけ・習慣", query: "片づけ 暮らし" },
      ],
    },
    {
      id: "ja-walk",
      label: "散歩・旅・季節",
      query: "散歩 エッセイ",
      children: [
        { id: "ja-wlk-town", label: "街歩き", query: "街歩き エッセイ" },
        { id: "ja-wlk-season", label: "四季の随筆", query: "季節 エッセイ" },
        { id: "ja-wlk-kyoto", label: "京都・旅の本", query: "京都 散歩" },
        { id: "ja-wlk-nature", label: "植物・自然", query: "植物 エッセイ" },
      ],
    },
    {
      id: "ja-rest",
      label: "心と休息",
      query: "休む 心 エッセイ",
      children: [
        { id: "ja-rst-sleep", label: "眠り・休息", query: "睡眠 休む" },
        { id: "ja-rst-mind", label: "マインドフルネス", query: "マインドフルネス" },
        { id: "ja-rst-psych", label: "心理学", query: "心理学 心" },
        { id: "ja-rst-phil", label: "哲学・思想", query: "哲学 入門" },
      ],
    },
    {
      id: "ja-art",
      label: "芸術・デザイン",
      query: "デザイン 美術 エッセイ",
      children: [
        { id: "ja-art-design", label: "デザイン", query: "デザイン 思考" },
        { id: "ja-art-arch", label: "建築・空間", query: "建築 エッセイ" },
        { id: "ja-art-craft", label: "民藝・手仕事", query: "民藝 手仕事" },
        { id: "ja-art-music", label: "音楽・映画", query: "映画 エッセイ" },
      ],
    },
  ],
  "zh-TW": [
    {
      id: "tw-essays",
      label: "散文・隨筆",
      query: "散文 台灣",
      children: [
        { id: "tw-ess-tw", label: "台灣散文", query: "散文 台灣" },
        { id: "tw-ess-daily", label: "生活隨筆", query: "生活 隨筆" },
        { id: "tw-ess-food", label: "飲食書寫", query: "飲食 散文 台灣" },
        { id: "tw-ess-family", label: "記憶與情感", query: "龍應台 散文" },
        { id: "tw-ess-reading", label: "閱讀與書寫", query: "閱讀 書寫 散文" },
      ],
    },
    {
      id: "tw-fiction",
      label: "文學・小說",
      query: "台灣 小說",
      children: [
        { id: "tw-fic-tw", label: "台灣文學", query: "台灣 文學 小說" },
        { id: "tw-fic-classic", label: "經典小說", query: "白先勇 小說" },
        { id: "tw-fic-short", label: "短篇故事", query: "短篇 小說" },
        { id: "tw-fic-poetry", label: "現代詩", query: "現代詩 詩集" },
      ],
    },
    {
      id: "tw-rest",
      label: "慢活・療癒",
      query: "慢活 療癒",
      children: [
        { id: "tw-rst-slow", label: "慢活日常", query: "慢活" },
        { id: "tw-rst-heal", label: "自我療癒", query: "療癒 心理" },
        { id: "tw-rst-rest", label: "好好休息", query: "休息 生活" },
        { id: "tw-rst-mind", label: "正念與冥想", query: "正念 靜心" },
        { id: "tw-rst-emotion", label: "情緒照顧", query: "情緒 和解" },
      ],
    },
    {
      id: "tw-walk",
      label: "散步・旅行",
      query: "散步 旅行 台灣",
      children: [
        { id: "tw-wlk-taipei", label: "台北散步", query: "台北 散步" },
        { id: "tw-wlk-tainan", label: "台南漫旅", query: "台南 旅行" },
        { id: "tw-wlk-cafe", label: "咖啡館日常", query: "咖啡 散步" },
        { id: "tw-wlk-nature", label: "山林與自然", query: "自然 散文 台灣" },
      ],
    },
    {
      id: "tw-living",
      label: "生活風格・美學",
      query: "生活 美學 空間",
      children: [
        { id: "tw-liv-space", label: "整理與空間", query: "整理 生活 空間" },
        { id: "tw-liv-tea", label: "茶與咖啡", query: "咖啡 茶 生活" },
        { id: "tw-liv-art", label: "設計與藝術", query: "設計 美學" },
        { id: "tw-liv-season", label: "四季風景", query: "四季 風景" },
      ],
    },
    {
      id: "tw-humanities",
      label: "人文・哲學",
      query: "哲學 心理 人文",
      children: [
        { id: "tw-hum-phil", label: "日常哲學", query: "哲學 思考" },
        { id: "tw-hum-psych", label: "心理探索", query: "心理 諮商" },
        { id: "tw-hum-history", label: "台灣歷史", query: "台灣 歷史" },
      ],
    },
  ],
};

/** Editorial-first order for YES24 top-level domestic categories */
const PRIORITY_CATEGORY_IDS = [
  "001001047", // 에세이
  "001001046", // 소설/시/희곡
  "001001019", // 인문
  "001001007", // 예술
  "001001009", // 여행
  "001001001", // 가정 살림
  "001001011", // 건강 취미
  "001001026", // 자기계발
  "001001010", // 역사
  "001001002", // 자연과학
  "001001025", // 경제 경영
  "001001022", // 사회 정치
];

const NOISE_PATTERN =
  /기출|수능|모의고사|토익|TOEIC|자격증|문제집|형사법|행정법|민법|공무원|필기|실기|전산회계|컴퓨터활용|수험|합격|교재|워크북|단어장|라이트\s*\d|202[67]\s|학원|특강|내신|국어\s*영역|영어\s*영역|초등\s*\d|중학\s*\d|고등\s*\d|만화|코믹스|학습만화|동화|세트|어린이|주니어|육아|잉글리시|수영책|BOOKK|부크크|컬러링/i;

function isCuratedBook(book: LibraryBook): boolean {
  if (!book.itemId || !book.title || !book.coverUrl) return false;
  const text = `${book.title} ${book.publisher} ${(book.description ?? "").slice(0, 140)}`;
  return !NOISE_PATTERN.test(text);
}

export function sanitizeBookText(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, "\n")
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

function cleanBook(raw: LibraryBook): LibraryBook {
  return {
    ...raw,
    title: sanitizeBookText(raw.title).replace(/^\[예스리커버\]\s*/i, "").trim(),
    description: sanitizeBookText(raw.description),
  };
}

function booksFunctionUrl(): string {
  const projectUrl =
    process.env.POKITSTORY_SUPABASE_URL?.trim() ||
    "https://wvvtyaxsedpqiscogrwk.supabase.co";
  return `${projectUrl.replace(/\/$/, "")}/functions/v1/pokitstory-books`;
}

async function fetchYes24SearchBooks(query: string): Promise<LibraryBook[]> {
  try {
    const response = await fetch(booksFunctionUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "search", query, page: 1 }),
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    const payload = (await response.json().catch(() => null)) as {
      items?: LibraryBook[];
    } | null;
    if (!payload || !Array.isArray(payload.items)) return [];
    return payload.items.filter(isCuratedBook).map(cleanBook);
  } catch {
    return [];
  }
}

async function fetchYes24Categories(): Promise<LibraryCategory[]> {
  try {
    const response = await fetch(booksFunctionUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "categories" }),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    const payload = (await response.json().catch(() => null)) as {
      categories?: LibraryCategory[];
    } | null;
    if (!payload || !Array.isArray(payload.categories)) return [];
    return payload.categories;
  } catch {
    return [];
  }
}

function buildYes24CategoryGroups(
  categories: LibraryCategory[],
  locale: Locale,
): LibraryCategoryGroup[] {
  const parents = new Map<string, LibraryCategoryGroup>();

  for (const cat of categories) {
    const parts = cat.name
      .split(">")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 2) {
      parents.set(cat.id, {
        id: cat.id,
        label: parts[1],
        children: [],
      });
    }
  }

  for (const cat of categories) {
    const parts = cat.name
      .split(">")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 3) {
      const parentId = cat.id.slice(0, 9);
      const group = parents.get(parentId);
      if (group) {
        group.children.push({
          id: cat.id,
          label: parts.slice(2).join(" · "),
        });
      }
    }
  }

  const all = Array.from(parents.values());
  const priorityMap = new Map(
    PRIORITY_CATEGORY_IDS.map((id, idx) => [id, idx]),
  );
  const collatorLocale = localeToIntl(locale);

  return all.sort((a, b) => {
    const pa = priorityMap.get(a.id) ?? 999;
    const pb = priorityMap.get(b.id) ?? 999;
    if (pa !== pb) return pa - pb;
    return a.label.localeCompare(b.label, collatorLocale);
  });
}

function dayIndex(): number {
  const now = new Date();
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
      86_400_000,
  );
}

function buildHeroAndFeed(shelves: LibraryShelfSection[]): {
  hero: LibraryBook | null;
  feed: LibraryBook[];
} {
  const pool: LibraryBook[] = [];
  for (let rank = 0; rank < 3; rank++) {
    for (const shelf of shelves) {
      const candidate = shelf.books[rank];
      if (candidate && candidate.description.length > 40) {
        pool.push(candidate);
      }
    }
  }

  const offset = pool.length > 0 ? dayIndex() % pool.length : 0;
  const rotated =
    pool.length > 0
      ? [...pool.slice(offset), ...pool.slice(0, offset)]
      : [];

  const hero = rotated[0] ?? shelves[0]?.books[0] ?? null;
  const feed = rotated.slice(1, 9);

  return {
    hero,
    feed: feed.length > 0 ? feed : shelves.flatMap((s) => s.books).slice(1, 9),
  };
}

async function fetchAppleShelfForSpec(
  spec: ShelfSpec,
  locale: Exclude<Locale, "ko">,
): Promise<LibraryBook[]> {
  const primaryQuery = spec.queries[locale];
  if (locale !== "zh-TW") {
    return fetchAppleBooksShelf(primaryQuery, locale, 30);
  }

  const fallbackQuery = ZH_TW_FALLBACK_QUERIES[spec.id];
  const [primary, secondary] = await Promise.all([
    fetchAppleBooksShelf(primaryQuery, locale, 30),
    fallbackQuery ? fetchAppleBooksShelf(fallbackQuery, locale, 24) : Promise.resolve([]),
  ]);

  const seen = new Set<number>();
  const merged: LibraryBook[] = [];
  for (const book of [...primary, ...secondary]) {
    if (seen.has(book.itemId)) continue;
    seen.add(book.itemId);
    merged.push(book);
  }
  return merged;
}

export async function getInitialLibraryData(
  locale: Locale,
): Promise<InitialLibraryData> {
  if (locale === "ko") {
    const [results, categories] = await Promise.all([
      Promise.all(
        SHELF_SPECS.map((spec) => fetchYes24SearchBooks(spec.queries.ko)),
      ),
      fetchYes24Categories(),
    ]);

    const seenGlobal = new Set<number>();
    const shelves: LibraryShelfSection[] = SHELF_SPECS.map((spec, idx) => {
      const unique: LibraryBook[] = [];
      for (const book of results[idx] ?? []) {
        if (seenGlobal.has(book.itemId)) continue;
        seenGlobal.add(book.itemId);
        unique.push(book);
        if (unique.length >= 10) break;
      }
      return {
        id: spec.id,
        query: spec.queries.ko,
        name: spec.labels.ko.name,
        title: spec.labels.ko.title,
        books: unique,
      };
    });

    const { hero, feed } = buildHeroAndFeed(shelves);
    return {
      provider: "yes24",
      hero,
      feed,
      shelves,
      categoryGroups: buildYes24CategoryGroups(categories, locale),
    };
  }

  // en / ja / zh-TW -> Apple Books (US / JP / US Traditional Chinese)
  const results = await Promise.all(
    SHELF_SPECS.map((spec) => fetchAppleShelfForSpec(spec, locale)),
  );

  const seenGlobal = new Set<number>();
  const shelves: LibraryShelfSection[] = SHELF_SPECS.map((spec, idx) => {
    const unique: LibraryBook[] = [];
    for (const book of results[idx] ?? []) {
      if (seenGlobal.has(book.itemId)) continue;
      seenGlobal.add(book.itemId);
      unique.push(book);
      if (unique.length >= 10) break;
    }
    return {
      id: spec.id,
      query: spec.queries[locale],
      name: spec.labels[locale].name,
      title: spec.labels[locale].title,
      books: unique,
    };
  });

  const { hero, feed } = buildHeroAndFeed(shelves);

  return {
    provider: "apple-books",
    hero,
    feed,
    shelves,
    categoryGroups: APPLE_BOOK_CATEGORIES[locale],
  };
}
