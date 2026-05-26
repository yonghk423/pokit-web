/** POKIT 홍보 사이트 카피 */

export const site = {
  name: "POKIT",
  appStoreUrl: "https://apps.apple.com/app/id0000000000",
  supportEmail: "support@pokit.app",
  minIos: "iOS 17.0 이상",
} as const;

export const nav = [
  { label: "계획 주기", href: "#horizons" },
  { label: "기능", href: "#features" },
  { label: "사용 방법", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  headline: "시간표 말고, 순서.",
  subheadline:
    "데일리·위클리·먼슬리로 계획하고, 잠금화면에서 빠르게 적고, 오늘은 하나씩 집중하세요.",
  badges: [
    "데일리 · 위클리 · 먼슬리",
    "잠금화면 빠른 메모",
    "iPhone 전용 · 기기 저장",
  ],
  brandLine: "오늘, 순서대로, 하나씩",
} as const;

export const problems = [
  "할 일은 많은데, 오늘·이번 주·이번 달을 한눈에 못 봐요",
  "캘린더에 시간을 채우다 지치고, 루틴은 매번 다시 짜요",
  "떠오른 건 바로 적고 싶은데 앱을 열기까지 멈춰요",
] as const;

export const solutions = [
  "데일리·위클리·먼슬리로 오늘·이번 주·이번 달 투두를 나눠 관리해요",
  "데일리 루틴으로 반복 일과를 고정하고, 우선순위만 바꿔요",
  "잠금화면 빠른 메모로 적고, 실행은 집중 세션에서 하나씩 해요",
] as const;

/** 데일리 · 위클리 · 먼슬리 핵심 섹션 */
export const horizons = [
  {
    id: "daily",
    label: "데일리",
    title: "오늘 우선순위·루틴",
    description:
      "오늘 할 플로우를 순서대로 정하고, 데일리 루틴으로 반복 일과를 고정해요. 집중 구간 안에서 하루를 돌려요.",
    highlights: ["우선순위 데이플랜", "데일리 루틴", "집중 세션"],
  },
  {
    id: "weekly",
    label: "위클리",
    title: "이번 주 투두·전략",
    description:
      "이번 주에 꼭 할 일과 핵심 전략을 적어 두고, 완료한 투두는 위클리 히스토리로 남겨요.",
    highlights: ["주간 투두", "주간 전략", "위클리 히스토리"],
  },
  {
    id: "monthly",
    label: "먼슬리",
    title: "이번 달 투두·전략",
    description:
      "한 달 단위 목표와 투두를 관리하고, 지난 달에 했던 일은 먼슬리 히스토리에서 돌아봐요.",
    highlights: ["월간 투두", "월간 전략", "먼슬리 히스토리"],
  },
] as const;

export const lockScreenMemo = {
  title: "잠금화면에서 바로 적기",
  description:
    "떠오른 할 일을 잠금화면 빠른 메모로 줄 단위로 적어 두세요. 나중에 오늘·이번 주 플로우로 옮기면 됩니다.",
  note: "실행과 집중의 중심은 앱 안 세션 화면이에요.",
} as const;

export const steps = [
  {
    title: "데일리 루틴·집중 구간",
    description:
      "하루 시작·마무리와 데일리 루틴으로 오늘의 틀을 잡아요.",
  },
  {
    title: "데일리·위클리·먼슬리 담기",
    description:
      "오늘 순서, 이번 주·이번 달 투두와 전략을 각각 정해요.",
  },
  {
    title: "잠금화면·앱에서 빠르게 메모",
    description:
      "잠금화면 빠른 메모나 앱 내 메모로 떠오른 일을 바로 적어요.",
  },
  {
    title: "집중 세션으로 실행",
    description:
      "현재 플로우·진행도·남은 시간만 보며 하나씩 완료해요.",
  },
  {
    title: "히스토리·통계로 돌아보기",
    description:
      "위클리·먼슬리 투두 히스토리와 통계로 지난 실행을 확인해요.",
  },
] as const;

export const features = [
  {
    title: "데일리 데이플랜",
    description: "시간표 없이 오늘 순서만 정하고 우선순위대로 실행해요.",
    group: "daily",
  },
  {
    title: "데일리 루틴",
    description:
      "아침·저녁 등 반복 일과를 루틴으로 고정하고, 매일 같은 틀 위에서 돌려요.",
    group: "daily",
  },
  {
    title: "위클리 투두·전략",
    description: "이번 주 할 일과 핵심 전략을 한곳에서 관리해요.",
    group: "weekly",
  },
  {
    title: "먼슬리 투두·전략",
    description: "이번 달 목표·투두를 세우고 완료를 체크해요.",
    group: "monthly",
  },
  {
    title: "위클리·먼슬리 히스토리",
    description:
      "지난 주·지난 달에 완료한 투두 기록을 남기고, 나중에 다시 볼 수 있어요.",
    group: "history",
  },
  {
    title: "잠금화면 빠른 메모",
    description:
      "잠금화면에서 줄 단위로 적고, 오늘·주간 플로우로 이어 붙여요.",
    group: "memo",
  },
  {
    title: "앱 내 빠른 메모",
    description: "앱을 연 상태에서도 떠오른 할 일을 빠르게 적어요.",
    group: "memo",
  },
  {
    title: "집중 세션",
    description: "실행 중 현재 플로우·진행도·남은 시간만 봐요.",
    group: "daily",
  },
  {
    title: "집중 구간",
    description: "하루 시작·마무리로 데일리 집중 시간대를 설정해요.",
    group: "daily",
  },
  {
    title: "담기·고정 플로우",
    description: "자주 쓰는 항목·그룹을 카탈로그로 관리해요.",
    group: "daily",
  },
  {
    title: "목표 상세 설정",
    description: "독서·물·복약 등 카테고리별 맞춤 설정이 가능해요.",
    group: "daily",
  },
  {
    title: "통계",
    description: "완료·카테고리·주간 활동을 한눈에 볼 수 있어요.",
    group: "history",
  },
] as const;

export const featureGroupLabels: Record<string, string> = {
  daily: "데일리",
  weekly: "위클리",
  monthly: "먼슬리",
  history: "히스토리·통계",
  memo: "빠른 메모",
};

export const trust = [
  {
    title: "서버 없음",
    description: "계정 없이 iPhone 안에만 데이터가 저장돼요.",
  },
  {
    title: "기기 로컬 저장",
    description:
      "데일리·위클리·먼슬리 투두와 히스토리도 기기 안에만 남아요.",
  },
  {
    title: "iOS 전용",
    description: "잠금화면 메모·위젯 등 iPhone에 맞춰 설계했어요.",
  },
] as const;

export const faq = [
  {
    q: "Android는 있나요?",
    a: "없어요. POKIT은 iPhone 전용 앱이에요. App Store에서만 설치할 수 있습니다.",
  },
  {
    q: "데일리·위클리·먼슬리는 어떻게 다른가요?",
    a: "데일리는 오늘 순서와 루틴·집중, 위클리·먼슬리는 각각 이번 주·이번 달 투두·전략을 관리해요. 완료한 주·월 투두는 히스토리에 쌓여요.",
  },
  {
    q: "데일리 루틴은 뭔가요?",
    a: "매일 반복하는 일과를 미리 고정해 두는 기능이에요. 오늘 플로우에 담아 우선순위만 조정하면 됩니다.",
  },
  {
    q: "위클리·먼슬리 히스토리는 무엇인가요?",
    a: "이번 주·이번 달에 완료한 투두 기록을 남겨 두었다가, 지난 주·지난 달 실행을 다시 볼 수 있어요.",
  },
  {
    q: "잠금화면 빠른 메모가 되나요?",
    a: "네. 잠금화면에서 줄 단위로 적을 수 있어요. 실행과 집중의 중심은 앱 안 집중 세션이에요.",
  },
  {
    q: "계정 가입이 필요한가요?",
    a: "필요 없어요. 앱을 열고 바로 데일리·위클리·먼슬리를 시작할 수 있어요.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "일과·투두·히스토리 데이터는 모두 iPhone 기기 안에만 저장돼요.",
  },
  {
    q: "「플로우」가 뭔가요?",
    a: "오늘(또는 해당 주기에서) 실행할 항목·태스크 단위예요. 우선순위 순서대로 하나씩 집중해요.",
  },
  {
    q: "무료인가요, 구독인가요?",
    a: "가격은 App Store에 안내된 정책을 따릅니다. 스토어에서 최신 정보를 확인해 주세요.",
  },
  {
    q: "문의는 어디로 하면 되나요?",
    a: "하단 지원 페이지나 앱 내 고객센터 메일로 문의해 주세요.",
  },
] as const;
