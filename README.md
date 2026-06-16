# pokit-web

Next.js + Sanity CMS 매거진 사이트.

## 실행

```bash
cp .env.example .env.local   # Sanity project ID 입력
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

기존 Next.js 프로젝트에 연동 → Studio embed `/studio` → `.env.local`에 project ID 추가.

또는 [sanity.io/manage](https://www.sanity.io/manage)에서 프로젝트 생성 후 ID를 `.env.local`에 직접 입력.

3. CORS 허용:

```bash
npx sanity cors add http://localhost:3000
npx sanity cors add https://pokitstory.com
npx sanity cors add https://www.pokitstory.com
```

4. Studio(`/studio`)에서 **Home Page** singleton과 **Article** 문서 생성·발행

## Vercel 배포 (중요)

`NEXT_PUBLIC_*` 변수는 **빌드 시점**에 코드에 박힙니다. Vercel 대시보드 → Project → Settings → Environment Variables에 아래를 등록한 뒤 **반드시 Redeploy** 하세요.

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p1a0jtm8` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

배포 후 홈에 기사 섹션이 보이고 `cdn.sanity.io` 이미지가 로드되어야 합니다. env 없이 배포하면 기사·커버 이미지가 전부 비어 있습니다.

Sanity env가 없으면 홈은 빈 상태로 렌더됩니다.

## 환경 변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity 프로젝트 ID |
| `NEXT_PUBLIC_SANITY_DATASET` | dataset (기본: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API 버전 (기본: `2026-05-15`) |

Vercel 배포 시 Environment Variables에 동일하게 등록하세요.

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
