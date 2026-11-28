# POKIT

일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱입니다.

웹에서는 한 주의 리듬, 출퇴근·공간·수면·몸 풀기 같은 장면을 짧은 이야기로 전하고, iOS 앱에서는 루틴·할 일·메모·기록을 한곳에서 이어 갑니다. 글에서 읽은 루틴은 앱으로 담을 수 있습니다.

- 웹: [www.pokitstory.com](https://www.pokitstory.com)
- 앱: [App Store](https://apps.apple.com/kr/app/id6762331629)

## 무엇이 있나요

### 매거진 웹

한국어·영어·일본어로 읽을 수 있는 일상 웰니스 매거진입니다.

| 섹션 | 내용 |
|------|------|
| 이번 주 | 한 주 리듬과 짧은 계획 |
| 루틴 | 아침·낮에 반복하기 좋은 습관 |
| 이동·휴식 | 출근·환승·이동 중 짧은 회복 |
| 공간 | 자리·가방·책상 배치 |
| 잠·저녁 | 하루를 닫는 취침 경계 |
| 웰니스 | 몸 풀기와 가벼운 활동 |
| 웰니스 브리핑 | 주간 건강·웰니스 요약 |
| 루틴 도구 | 생산성·웰니스에 도움이 되는 도구 소개 |

### POKIT 앱 (iOS)

- 하루의 시작과 끝을 정하고 오늘의 루틴을 한 화면에 모읍니다.
- 잠금화면 메모, 오늘 노트, 할 일, 히스토리, 서재를 지원합니다.
- 웹 기사에서 앱으로 루틴을 바로 담을 수 있습니다.

문의: pokit.app.help@gmail.com

## Daylight GEO 점검

AI 답변 노출과 GEO 준비 상태를 확인하는 로컬 MCP 서버와 Markdown 리포터입니다. Google Search Console API에서 AI Overview / AI Mode `searchAppearance` 행만 GEO 성과로 집계합니다. 일반 검색 전체 클릭·노출·검색어·순위는 GEO 성과에 섞지 않습니다. API가 AI 전용 행을 반환하지 않으면 GEO 성과 자료가 없다고 표시합니다.

기술 상태는 한국어·영어·일본어·번체 중국어 페이지의 공개 접근, `SoftwareApplication` JSON-LD, robots.txt의 OAI-SearchBot 정책, 언어별 사이트맵을 별도 섹션에서 점검합니다. 기술 점검 통과는 AI 인용·노출 성과를 뜻하지 않습니다. 매일은 확인 가능한 GEO 신호에 근거해 페이지 개선 가설과 변경 사항을 기록하며, 데이터나 출처가 없으면 성과를 지어내거나 반복 콘텐츠를 만들지 않습니다.

```sh
npm run geo:daily # GEO 전용 Markdown 일일 리포트
npm run geo:mcp   # MCP 서버 (stdio)
```

Search Console 연동은 선택 사항입니다. 서비스 계정 키는 저장소에 넣지 말고 로컬 환경에 보관하세요. Google Search Console에서 해당 서비스 계정에 속성 읽기 권한을 부여한 뒤 `.env.local`에 다음 두 항목을 설정합니다.

```dotenv
GSC_SERVICE_ACCOUNT_KEY_FILE=/absolute/path/to/read-only-service-account.json
GSC_SITE_URL=sc-domain:pokitstory.com
```

연동하지 않아도 기술 점검은 실행되며, GEO 성과는 연결되지 않았다고 표시됩니다. 일반 Google 검색 실적은 대체 수치로 사용하지 않습니다. GEO 개선은 독창성·신뢰성·사람에게 유용한 정보와 크롤링 가능성에 근거해야 하며, 불필요한 스키마나 대량 생성 콘텐츠를 추가하지 않습니다.

오전 9시 예약 점검은 이 명령을 실행하고, 로그인하지 않은 ChatGPT 웹에서 고정 질문마다 별도의 새 채팅을 열어 웹 검색을 켭니다. 질문은 다이어리 앱, 독서 기록·서재 관리 앱, 사진 일기와 서재를 함께 쓰는 앱, 온라인 책장을 다루며 앱 이름은 넣지 않습니다. 예약 리포트에는 질문별 Daylight 추천 여부, App Store 다운로드 링크, 실제 인용 URL을 기록합니다. 온라인 책장 질문에서는 PokitStory 웹 책장 인용 여부도 기록합니다. OpenAI API 키는 필요하지 않습니다. 비로그인 상태나 웹 검색을 확인할 수 없으면 예약 리포트에 그 사유를 기록합니다.
