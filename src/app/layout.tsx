import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "POKIT — 우선순위로 하루를 짜는 iOS 집중 앱",
    template: "%s | POKIT",
  },
  description:
    "데일리·위클리·먼슬리 투두와 루틴, 잠금화면 빠른 메모, 위클리·먼슬리 히스토리까지. 우선순위로 하루를 짜는 iPhone 전용 집중 앱.",
  openGraph: {
    title: "POKIT — 우선순위로 하루를 짜는 iOS 집중 앱",
    description:
      "데일리 루틴·위클리·먼슬리 계획·히스토리·잠금화면 빠른 메모. iPhone 전용 · 기기 로컬 저장.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
