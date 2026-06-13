export type Article = {
  slug: string;
  title: string;
  description?: string;
  kicker?: string;
  category: string;
  readTime: string;
  image: string;
  imageAlt: string;
};

const img = (id: string, width = 1200, height = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=82`;

export const categories = [
  { label: "Affairs", id: "affairs" },
  { label: "Wellness", id: "wellness" },
  { label: "Design", id: "design" },
  { label: "Routine", id: "routines" },
  { label: "Travel", id: "travel" },
  { label: "Shop", id: "shop" },
] as const;

export const featuredArticle: Article = {
  slug: "morning-10min-self",
  title: "아침 10분, 작은 의식으로 하루의 결을 바꾸는 방법",
  description:
    "바쁜 일정 속에서도 몸과 마음을 부드럽게 깨우는 아침 루틴. 침대 옆 물 한 잔, 짧은 스트레칭, 하루의 첫 문장을 기록하는 법을 모았습니다.",
  kicker: "The Briefing",
  category: "Routine",
  readTime: "4 min read",
  image: img("photo-1506126613408-eca07ce68773", 1400, 930),
  imageAlt: "아침 햇살이 들어오는 침실",
};

export const leadStories: Article[] = [
  {
    slug: "focus-25-5-break",
    title: "25분 집중, 5분 회복: 업무 리듬을 다시 설계하기",
    category: "Focus",
    readTime: "3 min read",
    image: img("photo-1499750310107-5fef28a66643", 700, 700),
    imageAlt: "노트북과 노트가 놓인 책상",
  },
  {
    slug: "hydration-habits",
    title: "하루 물 섭취를 습관으로 만드는 가장 현실적인 장치들",
    category: "Health",
    readTime: "3 min read",
    image: img("photo-1523362628745-0c100150b504", 700, 700),
    imageAlt: "물잔과 레몬",
  },
  {
    slug: "evening-wind-down",
    title: "잠들기 전 한 시간, 화면을 내려놓는 저녁의 기술",
    category: "Sleep",
    readTime: "4 min read",
    image: img("photo-1511295742362-92c96b1cf484", 700, 700),
    imageAlt: "침대 옆 조명과 책",
  },
  {
    slug: "walking-daily-benefits",
    title: "매일 걷는 사람들에게서 발견한 균형의 감각",
    category: "Movement",
    readTime: "3 min read",
    image: img("photo-1476480862126-209bfaa8edc8", 700, 700),
    imageAlt: "숲길을 걷는 사람",
  },
];

export const latestRadio = [
  { show: "The Wellness Desk", title: "일하는 몸을 위한 의자 밖 5분 스트레칭", length: "28 min" },
  { show: "Morning Note", title: "집중력이 흐트러지는 오후를 다시 정돈하는 법", length: "18 min" },
  { show: "City Rhythm", title: "잘 걷는 도시가 우리 몸에 남기는 것", length: "31 min" },
];

export const designAwards: Article[] = [
  {
    slug: "desk-focus-environment",
    title: "집중을 돕는 책상 환경: 물건을 덜어내는 디자인",
    category: "Design Awards",
    readTime: "5 min read",
    image: img("photo-1518455027359-f3f8164ba6bd", 900, 700),
    imageAlt: "정돈된 책상과 의자",
  },
  {
    slug: "home-workout-session",
    title: "좁은 집에서도 운동이 이어지는 가구 배치",
    category: "Design Awards",
    readTime: "4 min read",
    image: img("photo-1518611012118-696072aa579a", 900, 700),
    imageAlt: "요가 매트가 놓인 거실",
  },
  {
    slug: "minimal-morning-skincare",
    title: "아침 스킨케어를 줄이고도 피부 리듬을 지키는 법",
    category: "Beauty",
    readTime: "3 min read",
    image: img("photo-1598440947619-2c35fc9aa908", 900, 700),
    imageAlt: "스킨케어 제품과 수건",
  },
];

export const cityGuides: Article[] = [
  {
    slug: "sunday-20min-prep",
    title: "일요일 20분, 다음 주를 가볍게 만드는 준비",
    category: "City Guide",
    readTime: "4 min read",
    image: img("photo-1498837167922-ddd27525d352", 900, 700),
    imageAlt: "주방 테이블 위 식재료",
  },
  {
    slug: "chair-stretch-5min",
    title: "카페에서도 가능한 의자 스트레칭 루틴",
    category: "City Guide",
    readTime: "2 min read",
    image: img("photo-1500530855697-b586d89ba3ee", 900, 700),
    imageAlt: "햇빛이 들어오는 카페",
  },
  {
    slug: "simple-eating-out",
    title: "외식이 잦은 주간에도 균형을 잃지 않는 선택",
    category: "Food",
    readTime: "4 min read",
    image: img("photo-1512621776951-a57141f2eefd", 900, 700),
    imageAlt: "샐러드와 식탁",
  },
  {
    slug: "winter-dry-skin-basics",
    title: "건조한 계절, 피부 장벽을 지키는 기본 원칙",
    category: "Care",
    readTime: "3 min read",
    image: img("photo-1515377905703-c4788e51af15", 900, 700),
    imageAlt: "욕실 세면대와 화장품",
  },
];

export const shopItems = [
  { brand: "POKIT", name: "Routine Journal", price: "₩18,000" },
  { brand: "POKIT", name: "Desk Reset Cards", price: "₩12,000" },
  { brand: "POKIT", name: "Evening Wind-down Guide", price: "₩9,000" },
  { brand: "POKIT", name: "Weekly Wellness Planner", price: "₩15,000" },
];
