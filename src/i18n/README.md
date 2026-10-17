# UI 번역 전환

공통 UI·카테고리·404, 홈, 앱 소개·다운로드, 게시글 목록 영역은 한글 원문 키와 JSON 리소스를 사용합니다.
나머지 UI는 기존 `getDictionary`를 사용하며, Sanity 콘텐츠 번역은 별도로 관리합니다.

## 리소스와 호출

- `messages/{ko,en,ja}/` 아래 영역별 JSON에 같은 한글 키를 등록합니다.
- 한국어 리소스의 키가 각 영역의 메시지 타입 기준입니다. 다른 언어에
  필요한 키가 없으면 로더의 타입 검사에서 오류가 발생합니다.
- 서버에서는 `getHomeVideoMessages(locale)`로 현재 언어의 리소스를 읽고
  `createTranslator(messages)`로 번역 함수를 만들 수 있습니다.
- 클라이언트에는 리소스 객체만 props로 전달하고, 내부에서 같은 방식으로
  `t`를 만듭니다. 함수나 다른 언어의 리소스를 전달하지 않습니다.
- 앱 소개는 `getAppPageMessages(locale)`, 다운로드는
  `getAppDownloadMessages(locale)`로 읽습니다. 긴 기능 소개 본문은 서버에서
  번역하고, 클라이언트의 다운로드 영역에는 다운로드 리소스만 전달합니다.
- 기능 ID와 순서는 `src/content/app-features.ts`에서 한 번만 정의합니다.
  이미지 선택과 갤러리는 이 ID를 사용하고, 번역 JSON에는 문구만 저장합니다.
- 게시글 목록은 `getArchiveMessages(locale)`로 읽습니다. 검색 결과 수·표시 범위와
  메타데이터는 서버에서 번역합니다. 보기·정렬 컨트롤에는 번역한 문자열만 전달합니다.
  페이지 제목의 접미사는 검색어 유무에 따라 별도 키를 사용합니다.
- `common.json`은 헤더·푸터 문구, 언어 선택, 카테고리, 사이트 메타데이터,
  404 문구를 관리합니다. 현재 별도의 푸터 컴포넌트는 없습니다.
- 홈은 `home.json`, 영상은 `home-video.json`, 섹션 메뉴는 `home-section-nav.json`,
  섹션 제목은 `home-section-content.json`으로 나눕니다. 같은 한국어라도 영어에서
  Tools/Routine tools처럼 용도에 따라 번역이 다르면 별도 영역을 사용합니다.

## 기존 화면과의 연결

`getDictionary`는 아직 전환하지 않은 화면을 위해 기존 객체 형태를 제공합니다.
공통·홈 문구는 `createCommonCopy`와 `createHomeCopy`에서 JSON을 번역해 구성하며,
언어별 TypeScript 사전에 같은 문구를 중복 보관하지 않습니다. 카테고리와 홈 섹션의
ID 매핑도 이 공통 구성 함수에서 한 번만 정의합니다. 남은 TypeScript 사전의 타입은
`LegacyDictionary`이며 게시글 상세·지원·브리핑·루틴 도구 문구가 남아 있습니다.

```tsx
const t = createTranslator(videoMessages);
const label = t("영상 재생");
```

등록하지 않은 키는 타입 검사에서 거부합니다. 원문을 변경할 때는 세 언어의
키와 호출부를 함께 변경하고, 기존 번역이 여전히 적절한지 확인합니다.
같은 원문이라도 번역 맥락이 다르면 영역을 나누어 관리합니다.

## 동적 문구

`getHomeMessages(locale)`로 홈의 동적 문구를 읽습니다. 한국어 키에서 `{{label}}`처럼
인자 이름을 선언하고 모든 언어에서 같은 이름을 사용합니다. 언어별 어순은 자유롭게 바꿀 수 있습니다.

```tsx
const t = createTranslator(await getHomeMessages(locale));
t("{{label}} 이전", { label: "루틴" });
// 영어 리소스: "Previous: {{label}}"
```

인자는 문자열 또는 숫자입니다. 필수 인자의 누락·오타와 고정 문구에 인자를
전달하는 호출은 타입 검사에서 거부합니다. 값은 한 번만 치환하며 HTML로 해석하거나
이스케이프하지 않습니다. JSX에서는 React가 출력값을 이스케이프합니다.

`npm run test:i18n`은 런타임 동작과 모든 JSON 리소스의 키·인자 이름 일치를
검사합니다(Node.js 22.6 이상). `npx tsc --noEmit`은 호출부와 타입 오류 사례를 검사합니다.
복수형, 자동 추출 및 나머지 함수형 사전의 변환은 후속 단계에서 설계합니다.
