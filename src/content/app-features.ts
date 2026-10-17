import type { AppPageMessages } from "@/i18n/get-app-page-messages";

/** Feature IDs and display order are shared by every locale. */
export function getAppFeatures(t: (key: keyof AppPageMessages) => string) {
  return [
    {
      id: "routines" as const,
      title: t("오늘의 루틴, 여기서 시작"),
      body: t("약을 챙겨 먹는 일, 체중을 기록하는 일,\n필요한 값을 직접 입력해 변화를 관리하는 일,\n오늘 해야 할 일을 하나씩 체크하는 일.\n\n우리에게 필요한 루틴은 저마다 다릅니다.\n\n그런데 필요한 것마다 다른 앱을 찾아 사용하다 보면\n정작 꾸준히 이어가는 일은 더 복잡해지곤 합니다.\n\nPOKIT은 다양한 루틴을 하나의 포켓에 담아\n나에게 필요한 방식으로 기록하고 이어갈 수 있도록 합니다.\n\n오늘 필요한 루틴을 꺼내고,\n하나씩 나의 하루를 채워보세요."),
      imageAlt: t("POKIT 앱 오늘 루틴 목록 화면"),
    },
    {
      id: "puzzle" as const,
      title: t("루틴을 성공할 때마다 완성되는 나만의 사진 퍼즐"),
      body: t("진행 중인 루틴이 하나든 몇 개든,\n완료한 횟수만큼 사진 퍼즐 조각이 채워집니다.\n\n체크만 쌓이는 밋밋한 히스토리 대신,\n내가 고른 사진이 조금씩 완성되는 모습을 볼 수 있어요.\n그 작은 완성감이 이어지게 하려고 만든 기능입니다."),
      imageAlt: t("POKIT 앱 사진 퍼즐 화면"),
    },
    {
      id: "memo" as const,
      title: t("잠금화면에도 남기는 메모"),
      body: t("오늘 챙길 말을 메모에 적어 두면, 잠금화면에서도 바로 보여요.\n아침·낮·저녁에 할 일을 짧게 남겨 두고,\n폰을 켤 때마다 눈앞에서 다시 만날 수 있습니다.\n\n앱을 깊게 들어가지 않아도, 하루를 더 빠르게 챙길 수 있어요."),
      imageAlt: t("잠금화면에 표시된 POKIT 하루 메모"),
    },
    {
      id: "widgets" as const,
      title: t("홈 화면에서 쓱- 위젯으로 더 빠르게 챙기는 일상"),
      body: t("앱을 열지 않아도, 홈 화면에서 오늘의 루틴을 한눈에.\n체중·약·횟수·메모처럼 자주 보는 것들을 위젯으로 꺼내 두면,\n잠금이 풀린 자리에서 바로 확인하고 이어서 챙길 수 있어요.\n\n작은 카드 몇 장이 하루의 속도를 조금 더 가볍게 만듭니다."),
      imageAlt: t("iPhone 홈 화면에 배치된 POKIT 위젯들"),
    },
    {
      id: "notes" as const,
      title: t("오늘 노트, 하루를 적어 두기"),
      body: t("오늘의 생각을, 오늘의 기록으로. 길게 쓰지 않아도 괜찮아요. 오늘 있었던 일, 떠오른 생각, 내일 해야 할 일까지. 지금의 하루를 편한 방식으로 남겨보세요."),
      imageAlt: t("POKIT 앱 오늘 노트 화면"),
    },
    {
      id: "todos" as const,
      title: t("루틴이 아닌 일, 투두리스트로"),
      body: t("매일 반복할 필요는 없는데, 오늘은 끝내야 하는 일이 있습니다. 그런 일은 루틴으로 만들지 않아도 됩니다. 할 일 목록에 짧게 적어 두고, 하나씩 지워 가세요."),
      imageAlt: t("POKIT 앱 할 일 목록 화면"),
    },
    {
      id: "history" as const,
      title: t("얼마나 했는지, 돌아보기"),
      body: t("지나온 하루를, 다시 바라보기. 이번 주에는 어떤 루틴을 지켰는지, 이번 달에는 무엇을 자주 했는지. 쌓여가는 기록을 보며 나의 하루를 천천히 돌아보세요."),
      imageAlt: t("POKIT 앱 월간 히스토리·완료 기록 화면"),
    },
    {
      id: "library" as const,
      title: t("읽는 책, 어디까지인지"),
      body: t("읽고 있는 책도, 나만의 포켓에. 지금 읽는 책, 읽을 예정인 책, 다 읽은 책까지 한곳에 담아두세요. 몇 쪽까지 왔는지도 남겨 두면 다음에 펼칠 때가 조금 더 가벼워집니다."),
      imageAlt: t("POKIT 앱 내 서재 화면"),
    },
  ];
}

export type AppFeatureId = ReturnType<typeof getAppFeatures>[number]["id"];
