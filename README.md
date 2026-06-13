# pokit-web

Next.js + TypeScript 프로젝트. **새 컨셉으로 처음부터 다시 시작하는 상태**입니다.

## 현재 구조

| 경로 | 설명 |
|------|------|
| `/` | 빈 슬레이트 홈 |
| `/privacy` | 개인정보 처리방침 (임시) |
| `/support` | 지원 (임시) |

## 실행

```bash
cp .env.example .env.local   # 최초 1회 (키는 .env.local에만)
npm run dev
npm run build
```

## 환경 변수 (Unsplash)

로컬 `.env.local`에 Unsplash 키를 둡니다. Git에는 올라가지 않습니다.

| 변수 | 설명 |
|------|------|
| `UNSPLASH_ACCESS_KEY` | API Access Key |
| `UNSPLASH_SECRET_KEY` | Secret Key (서버 전용) |
| `UNSPLASH_APPLICATION_ID` | Application ID |

Vercel 배포 시 **Settings → Environment Variables**에 동일한 이름으로 등록하세요.

## 수정 위치

- **사이트 이름·URL·이메일**: `src/config/site.ts`
- **홈**: `src/app/page.tsx`
- **스타일**: `src/app/globals.css`

## 정리된 항목

이전에 있던 가이드, 랜딩 컴포넌트, 기사 이미지, 콘텐츠 파일은 모두 제거했습니다.  
Unsplash API 키(`.env.local`)는 이후 이미지 연동을 위해 **유지**해 두었습니다.
