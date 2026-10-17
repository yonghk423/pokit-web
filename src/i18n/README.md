# UI 번역 전환

공통 UI·카테고리·404, 홈, 앱 소개·다운로드, 게시글 목록·상세·미리보기, 지원, 브리핑, 루틴 도구 영역은 한글 원문 키와 JSON 리소스를 사용합니다.
각 화면은 필요한 영역의 로더를 사용하며, Sanity 콘텐츠 번역은 별도로 관리합니다.

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
- 게시글 상세 문구는 `getArticleMessages(locale)`로 읽습니다. 관련 이야기 제목은
  영어일 때만 카테고리 표시명을 소문자로 바꿔 `{{label}}`에 전달합니다.
- 앱 저장·다운로드 안내는 `getAppInstallMessages(locale)`로 읽습니다.
  게시글 상세·게시글 미리보기·루틴 도구 미리보기가 같은 리소스를 공유합니다.
  클라이언트에는 현재 언어의 메시지 객체만 전달하고 저장·전송 동작은 그대로 유지합니다.
- 지원 페이지는 `getSupportMessages(locale)`로 읽고 `createSupportCopy(t)`로 구성합니다.
  섹션 ID·순서와 문단·목록·FAQ·문제 해결 블록은 `src/content/support-copy.ts`에서
  공통으로 정의하며, 번역 문구는 `support.json`에서만 관리합니다.
- 브리핑 목록·주차별 상세는 `getBriefingMessages(locale)`로 읽습니다.
  `createBriefingDescription(t, headlines)`는 기존처럼 앞의 세 제목을 연결하고,
  결과가 비어 있으면 별도 기본 설명을 사용합니다. 날짜 형식과 Sanity 본문은 유지합니다.
- 루틴 도구 목록·주차별 상세·홈 라벨은 `getNewArrivalsMessages(locale)`로 읽습니다.
  `createNewArrivalsDescription(t, names)`는 앞의 세 도구 이름을 연결하고,
  결과가 비어 있으면 기존 기본 설명을 사용합니다. 도구 본문·일본어 콘텐츠 대체
  정책은 기존대로 유지합니다. 현재 미사용인 번역 미제공 문구도 리소스에 보관합니다.

## 필요한 문구만 전달

카테고리 이름은 `createCategoryLabels(t)`와 `CategoryLabels`, 언어 선택 문구는
`LanguageLabels` 타입을 사용합니다. 홈의 섹션 ID·메뉴·CMS 기본 제목은
`createHomeSectionLabels(navT, contentT)`와 `HomeSectionLabels`로 관리합니다.
Sanity 조회에는 필요한 카테고리 이름 또는 섹션 기본 문구만 전달합니다.

기존 통합 사전과 호환 객체는 제거했습니다. 날짜 locale은 `config.ts`의
`localeToIntl(locale)`을 사용하며 번역 사전에 별도로 보관하지 않습니다.

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
복수형과 자동 추출은 후속 단계에서 설계합니다.
