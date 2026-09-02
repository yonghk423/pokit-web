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

## (템플릿) YYYY-MM · 제목

### 문제
### 조치
### 결과
### 관련 파일
### 이력서용 한 줄
