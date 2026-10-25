import type { SupportCopy } from "@/content/support-types";
import type { SupportMessages } from "@/i18n/get-support-messages";

/** Section IDs, order and block structure are shared by every locale. */
export function createSupportCopy(t: (key: keyof SupportMessages) => string): SupportCopy {
  return {
    title: t("POKIT 지원 정보"),
    description: t("오늘 카드, 하루의 장면, 스토리를 쓰는 방법과 문의 창구입니다."),
    kicker: t("Support"),
    lead: [
      t("기록하고, 챙기고, 다정하게."),
      t("계정 없이 쓰는 iOS 앱입니다. 화면 문구는 한국어, 영어, 日本語를 따르며, 기기 언어에 맞춰 나옵니다."),
    ],
    appStore: t("App Store에서 보기"),
    tocLabel: t("바로 가기"),
    sections: [
      {
        id: "today",
        title: t("오늘"),
        blocks: [
          { type: "p", text: t("오늘 챙길 일을 카드에 담습니다. 영양제, 체중, 할 일, 독서처럼 종류를 고르고, 끝나면 표시합니다.") },
          {
            type: "list",
            items: [
              t("카드를 눌러 내용을 적고, 완료를 표시합니다."),
              t("한 장씩 넘기거나, 여러 장을 한눈에 볼 수 있습니다."),
              t("아래 알약 탭에서 오늘과 스토리를 오갑니다."),
            ],
          },
        ],
      },
      {
        id: "scenes",
        title: t("오늘의 주인공"),
        blocks: [
          { type: "p", text: t("하루를 장면으로 이어 갑니다. 기상, 아침, 집중, 산책, 독서, 휴식.") },
          {
            type: "list",
            items: [
              t("장면을 눌러 오늘의 이야기를 채웁니다."),
              t("장면마다 메모와 할 일이 붙습니다."),
              t("비어 있는 장면부터 시작해도 됩니다."),
            ],
          },
        ],
      },
      {
        id: "story",
        title: t("스토리"),
        blocks: [
          { type: "p", text: t("pokitstory의 글을 앱에서 읽습니다. 마음에 남는 글은 오늘의 주인공에 저장합니다.") },
          {
            type: "list",
            items: [
              t("글을 읽다가 저장하면, 오늘의 주인공 장면에 남습니다."),
              t("글을 읽으려면 인터넷이 필요합니다. 카드와 장면 기록은 기기에 남습니다."),
            ],
          },
        ],
      },
      {
        id: "keep",
        title: t("기록"),
        blocks: [
          { type: "p", text: t("기록은 이 기기에 저장됩니다. 회원 가입이나 클라우드 로그인은 없습니다.") },
          {
            type: "list",
            items: [
              t("앱을 지우거나 기기를 바꾸면 기록이 따라오지 않을 수 있습니다."),
              t("처음부터 다시 시작하려면 설정에서 앱 데이터 초기화를 사용합니다. 저장된 기록과 예약 알림이 지워지며, 되돌릴 수 없습니다."),
              t("화면 언어는 기기 언어를 따릅니다. 한국어, 일본어, 그 외에는 영어입니다."),
            ],
          },
        ],
      },
      {
        id: "faq",
        title: t("질문"),
        blocks: [
          {
            type: "faq",
            q: t("데이터는 어디에 저장되나요?"),
            a: t("이 기기에만 저장됩니다. 앱을 삭제하거나 기기를 바꾸면 복구되지 않을 수 있습니다."),
          },
          {
            type: "faq",
            q: t("계정은 필요한가요?"),
            a: t("필요하지 않습니다. App Store에서 설치하면 바로 씁니다."),
          },
          {
            type: "faq",
            q: t("인터넷이 꼭 필요한가요?"),
            a: t("카드와 장면은 기기에서 씁니다. 스토리 글을 읽을 때와 앱을 업데이트할 때는 네트워크가 필요합니다."),
          },
          {
            type: "faq",
            q: t("Android에서도 쓸 수 있나요?"),
            a: t("현재 POKIT은 iOS 앱입니다."),
          },
        ],
      },
      {
        id: "contact",
        title: t("문의"),
        blocks: [
          {
            type: "p",
            text: t("문제가 생기거나 제안이 있으면 메일로 보내 주세요. 앱 안 설정에서 문의하기를 누르면 기기와 앱 버전이 함께 적힙니다."),
          },
        ],
      },
    ],
  };
}
