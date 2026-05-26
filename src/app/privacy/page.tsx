import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/landing";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "POKIT 홍보 웹사이트 방문자 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="subpage">
      <header className="subpage-header">
        <Link href="/" className="logo">
          {site.name}
        </Link>
      </header>
      <main className="subpage-main prose">
        <h1>개인정보 처리방침</h1>
        <p className="lead">
          POKIT 홍보 웹사이트(이하 「사이트」)는 방문·문의 시 최소한의
          정보만 처리합니다. 앱 내 데이터 저장 방식과는 별도로 안내해요.
        </p>

        <h2>1. 수집하는 정보</h2>
        <ul>
          <li>사이트 방문 시: 서버·호스팅 로그(IP, 브라우저, 접속 시각 등)</li>
          <li>문의 시: 이메일 주소 및 문의 내용(직접 보내신 경우)</li>
          <li>Analytics를 사용하는 경우: 익명화된 이용 통계</li>
        </ul>

        <h2>2. 이용 목적</h2>
        <ul>
          <li>사이트 운영·보안·장애 대응</li>
          <li>문의 응대</li>
          <li>서비스 개선(Analytics 사용 시)</li>
        </ul>

        <h2>3. 보관 기간</h2>
        <p>
          관련 법령 및 운영 정책에 따른 기간 동안 보관 후 파기합니다.
        </p>

        <h2>4. 앱 데이터와의 구분</h2>
        <p>
          POKIT iOS 앱의 일과 데이터는 사용자 iPhone 기기 안에만 저장됩니다.
          앱 데이터는 이 사이트 서버로 전송되지 않습니다.
        </p>

        <h2>5. 문의</h2>
        <p>
          개인정보 관련 문의:{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </p>

        <p className="back">
          <Link href="/">← 홈으로</Link>
        </p>
      </main>
    </div>
  );
}
