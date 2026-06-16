import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "지원",
  description: `${site.name} 문의 안내`,
};

export default function SupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose-page">
        <h1>지원</h1>
        <p className="lead">
          사이트·앱 관련 문의는 아래 이메일로 보내 주세요.
        </p>
        <h2>이메일</h2>
        <p>
          <SupportEmailLink className="support-email-link">
            {site.supportEmail}
          </SupportEmailLink>
        </p>
        <p>
          <SupportEmailLink className="support-email-link support-email-link--button">
            메일 보내기
          </SupportEmailLink>
        </p>
        <Link href="/" className="back-link">← 홈으로</Link>
      </main>
      <SiteFooter />
    </>
  );
}
