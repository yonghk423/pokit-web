# POKIT Web · Work Notes

이력서·포트폴리오용 작업 메모. README와 분리해 둔다.
항목을 추가할 때 **문제 → 조치 → 수치/결과** 순으로 짧게 남긴다.

---

## 2026-09 · `/app` 소개 페이지 이미지 로딩 최적화

### 문제
배포 환경에서 첫 페인트 시 앱 스크린샷 자리에 흰 배경(레이아웃 셸)만 먼저 보이다가 이미지가 늦게 채워짐.
원인: 시뮬레이터 PNG가 과도하게 큼(특히 lock-screen ~4MB). `next/image`만으로는 네트워크·디코딩 지연을 막기 어려움.

### 조치
1. 앱 스크린샷을 WebP로 변환 후 페이지·갤러리 경로를 `.webp`로 교체 (`public/app`, `public/app/en`)
2. `next/image`에 `placeholder="blur"` + 고정 `blurDataURL` 적용 (히어로·피처·갤러리)
3. 히어로 3장에 `priority` + `loading="eager"` + `fetchPriority="high"`로 LCP 후보 선로딩
4. 로케일별 에셋 분기: `ko`는 `/app/*`, `en`/`ja`는 `/app/en/*` (영문 UI 스크린샷)

### 결과 (원본 PNG → WebP)
| 에셋 | KO | EN |
|---|---|---|
| lock-screen-memo | 3955KB → 43KB (~99%↓) | 3979KB → 47KB (~99%↓) |
| library | 588KB → 102KB (~83%↓) | 632KB → 99KB (~84%↓) |
| first-launch | 1050KB → 68KB (~94%↓) | (영문 미제공, KO 유지) |
| 기타 스크린샷 | 대체로 70~77%↓ | 대체로 70~74%↓ |

체감: 초기 흰 박스 노출 감소, 첫 화면·피처 섹션 이미지 도착 시간 단축.

### 관련 파일
- `src/app/[locale]/(site)/app/page.tsx`
- `src/components/app-screen-gallery.tsx`
- `public/app/*.webp`, `public/app/en/*.webp`

### 이력서용 한 줄 (초안)
- Next.js 앱 소개 페이지에서 무거운 스크린샷 PNG를 WebP로 재인코딩하고 blur placeholder·히어로 priority 로딩을 적용해, 단일 에셋 기준 최대 약 99% 용량 절감 및 초기 이미지 플리커를 개선

---

## 2026-09 · `/app` Next.js 이미지 파이프라인

### 문제
배포에서 스크린샷이 늦게 채워지고, string `public/` 경로 + 수동 blur만으로는 Next 이미지 최적화의 이점을 거의 못 씀. 원본 WebP도 **1320×2868**로 표시 폭(~240px CSS, 2x≈480~512) 대비 과대.

### 조치
1. 표시 폭 기준 **폭 780** WebP로 재인코딩해 `src/assets/app-screens`(·`en/`)에 둠
2. `import` static `StaticImageData` → 빌드 타임 blur LQIP + `next/image` srcset (AVIF/WebP)
3. `next.config` `formats: ['image/avif','image/webp']`, `imageSizes: [96,128,256,384,640]`
4. `quality={75}`, `sizes="(max-width: 640px) 45vw, 240px"`(갤러리 52vw), 히어로 `priority` + `<link rel="preload" fetchPriority="high">`
5. 폰 프레임 배경은 앱 크림톤 `#f0ebe3` 유지 (CDN 지연 시 흰 셸 완화)

### 결과 (public 1320px WebP → assets 780px WebP)

| 에셋 | KO | EN |
|---|---|---|
| first-launch | 68KB → 35KB (~48%↓) | 70KB → 41KB (~42%↓) |
| routines | 62KB → 33KB (~47%↓) | 67KB → 35KB (~48%↓) |
| todos | 50KB → 26KB (~48%↓) | 65KB → 33KB (~49%↓) |
| memo-editor | 44KB → 23KB (~47%↓) | 60KB → 31KB (~49%↓) |
| lock-screen-memo | 43KB → 21KB (~51%↓) | 47KB → 23KB (~52%↓) |
| today-note | 47KB → 25KB (~46%↓) | 57KB → 28KB (~50%↓) |
| library | 102KB → 53KB (~48%↓) | 99KB → 45KB (~54%↓) |
| history | 60KB → 34KB (~43%↓) | 62KB → 34KB (~44%↓) |
| **합계 (8장)** | **476KB → 251KB (~47%↓)** | **527KB → 270KB (~49%↓)** |

해상도: 1320×2868 → 780×1695.

참고 (1차 PNG→WebP, 동일 시리즈 lock-screen): 3955KB → 43KB (~99%↓).  
1차+2차 누적 예: lock-screen PNG 약 4MB → 최종 assets 약 21KB.

런타임: `next/image`가 `sizes`에 맞춰 더 작은 후보(최대 640 imageSize)와 AVIF를 고를 수 있어, 네트워크 전송량은 위 파일 크기보다 더 작아질 수 있음. (배포 Lighthouse 수치 측정 시 이 칸에 추가)

### 관련 파일
- `src/assets/app-screens/**`
- `src/lib/app-screens.ts`
- `src/app/[locale]/(site)/app/page.tsx`
- `src/components/app-screen-gallery.tsx`
- `next.config.ts`

### 이력서용 한 줄 (초안)
- `/app` 스크린샷을 표시 폭(780)에 맞게 재인코딩하고 Next.js static import + `next/image` srcset·AVIF로 연결해, WebP 8장 합계 기준 약 47~49% 추가 용량 절감(예: KO 476KB→251KB). 이전에 PNG→WebP로 lock-screen 약 99% 절감한 파이프라인 위에 올린 2차 최적화

### 나중에 채울 성능 칸 (배포 후 측정)
- Lighthouse(모바일) `/app`: LCP / FCP 전후
- Network: 히어로 3장 전송 바이트·Content-Type(AVIF 여부)
- 체감: 흰 셸 노출 시간

---

## 2026-09 · `/app` 흰 셸 플리커 보강 (선행 UX)

### 문제
배포 환경에서 WebP·blur 적용 후에도 폰 프레임이 잠깐 흰색으로 보임.
원인: 셸/`bg-panel`(#fbf8ff)이 앱 스크린샷 크림톤보다 밝아, CDN·디코딩 지연 동안 흰 레이아웃처럼 보임.

### 조치
1. 폰 프레임·이미지 배경을 앱 UI 크림톤(`#f0ebe3`)으로 통일
2. 히어로 preload / 첫 피처 priority (이후 static import 파이프라인으로 이관)

### 관련 파일
- `src/lib/app-screens.ts`
- `src/app/[locale]/(site)/app/page.tsx`
- `src/components/app-screen-gallery.tsx`

---

## (템플릿) YYYY-MM · 제목

### 문제
### 조치
### 결과
### 관련 파일
### 이력서용 한 줄
