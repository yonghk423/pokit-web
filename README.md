# pokit-web

Next.js + Sanity CMS 매거진 사이트.

## 실행

```bash
npm install
npm run dev
```

- 사이트: http://localhost:3000
- Studio: http://localhost:3000/studio

## Sanity 초기 설정

1. [sanity.io](https://www.sanity.io) 계정 생성
2. 프로젝트 루트에서:

```bash
npx sanity@latest init
```

기존 Next.js 프로젝트에 연동 → Studio embed `/studio`.

Sanity project ID는 `src/sanity/env.ts`에 기본값으로 설정되어 있습니다. 로컬에서 덮어쓰려면 `.env.local`을 사용하세요.

또는 [sanity.io/manage](https://www.sanity.io/manage)에서 프로젝트를 확인할 수 있습니다.

3. CORS 허용:

```bash
npx sanity cors add http://localhost:3000
npx sanity cors add https://pokitstory.com
npx sanity cors add https://www.pokitstory.com
```

4. Studio(`/studio`)에서 **Home Page** singleton과 **Article** 문서 생성·발행

## Vercel 배포

Sanity project ID는 `src/sanity/env.ts` 기본값으로 동작합니다. Vercel Environment Variables는 선택 사항입니다(덮어쓰기용).

배포 후 홈에 기사 섹션과 `cdn.sanity.io` 이미지가 보여야 합니다.

## 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 (Sanity homePage 또는 fallback) |
| `/articles/[slug]` | 기사 상세 |
| `/studio` | Sanity Studio (embedded) |
| `/privacy`, `/support` | 정책·지원 |

| 코드 | 설명 |
|------|------|
| `sanity.config.ts` | Studio 설정 |
| `src/sanity/schemaTypes/` | article, homePage 스키마 |
| `src/sanity/lib/fetch.ts` | 홈 콘텐츠 fetch |
| `src/config/site.ts` | 사이트 이름·URL |

## 수정 위치

- **사이트 이름·URL**: `src/config/site.ts`
- **홈 레이아웃**: `src/app/page.tsx`
- **스타일**: `src/app/globals.css`
- **콘텐츠 스키마**: `src/sanity/schemaTypes/`
