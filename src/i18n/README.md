# UI 번역 전환

홈 영상 영역부터 한글 원문 키와 JSON 리소스를 사용합니다. 나머지 UI는 기존
`getDictionary`를 사용하며, Sanity 콘텐츠 번역은 별도로 관리합니다.

## 리소스와 호출

- `messages/{ko,en,ja}/home-video.json`에 같은 한글 키를 등록합니다.
- 한국어 리소스의 키가 `HomeVideoMessages` 타입의 기준입니다. 다른 언어에
  필요한 키가 없으면 로더의 타입 검사에서 오류가 발생합니다.
- 서버에서는 `getHomeVideoMessages(locale)`로 현재 언어의 리소스를 읽고
  `createTranslator(messages)`로 번역 함수를 만들 수 있습니다.
- 클라이언트에는 리소스 객체만 props로 전달하고, 내부에서 같은 방식으로
  `t`를 만듭니다. 함수나 다른 언어의 리소스를 전달하지 않습니다.

```tsx
const t = createTranslator(videoMessages);
const label = t("영상 재생");
```

등록하지 않은 키는 타입 검사에서 거부합니다. 원문을 변경할 때는 세 언어의
키와 호출부를 함께 변경하고, 기존 번역이 여전히 적절한지 확인합니다.
같은 원문이라도 번역 맥락이 다르면 영역을 나누어 관리합니다.

현재 시범 영역은 고정 문구만 처리합니다. 동적 값 치환, 복수형,
자동 추출 및 기존 함수형 사전의 변환은 후속 단계에서 설계합니다.
