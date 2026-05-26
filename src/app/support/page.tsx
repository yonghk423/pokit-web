import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/landing";

export const metadata: Metadata = {
  title: "지원",
  description: "POKIT 앱 및 홍보 사이트 문의 안내",
};

export default function SupportPage() {
  return (
    <div className="subpage">
      <header className="subpage-header">
        <Link href="/" className="logo">
          {site.name}
        </Link>
      </header>
      <main className="subpage-main prose">
        <h1>지원</h1>
        <p className="lead">
          POKIT 앱 사용 문의·버그 신고·홍보 사이트 관련 문의를 받고 있어요.
        </p>

        <h2>이메일</h2>
        <p>
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </p>
        <p>
          앱 내 「고객센터」 메일 흐름과 동일하게 답변해 드려요. iOS 버전과
          증상을 알려주시면 더 빠르게 도와드릴 수 있어요.
        </p>

        <h2>자주 묻는 질문</h2>
        <p>
          Android 지원, 데이터 저장, 플로우 의미 등은{" "}
          <Link href="/#faq">홈 FAQ</Link>를 참고해 주세요.
        </p>

        <h2>App Store</h2>
        <p>
          <a href={site.appStoreUrl} target="_blank" rel="noopener noreferrer">
            App Store에서 POKIT 받기
          </a>
        </p>
        <p className="ios-note">iPhone 전용 · {site.minIos}</p>

        <p className="back">
          <Link href="/">← 홈으로</Link>
        </p>
      </main>
    </div>
  );
}
