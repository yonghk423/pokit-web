# pokit-web

POKIT iOS 앱 **홍보용** 원페이지 랜딩 (Next.js + TypeScript)

## 페이지

| 경로 | 설명 |
|------|------|
| `/` | 원페이지 랜딩 (Hero → 문제/해결 → 사용 방법 → 기능 → 프라이버시 → FAQ → 다운로드) |
| `/privacy` | 개인정보 처리방침 (초안) |
| `/support` | 지원·문의 안내 |

## 실행

```bash
npm run dev    # http://localhost:3000
npm run build
npm start
```

## 수정 위치

- **카피·링크**: `src/content/landing.ts` (App Store URL, 지원 메일 등)
- **랜딩 UI**: `src/components/landing/landing-page.tsx`
- **스타일**: `src/app/globals.css`
- **SEO 메타**: `src/app/layout.tsx`

## 출시 전 체크

- [ ] `site.appStoreUrl` — 실제 App Store 앱 ID
- [ ] `site.supportEmail` — 앱 고객센터와 동일 주소
- [ ] 히어로·기능 섹션 — 실제 앱 스크린샷으로 교체
- [ ] `public/sitemap.xml` · `robots.txt` — 확정 도메인 반영
