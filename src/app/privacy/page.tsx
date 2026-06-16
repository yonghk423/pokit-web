import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: `${site.name} 개인정보 처리방침`,
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose-page">
        <h1>개인정보 처리방침</h1>
        <p className="lead">
          사이트를 새로 구성하는 중입니다. 정식 오픈 전에 이 내용을
          업데이트해 주세요.
        </p>
        <h2>문의</h2>
        <p>
          <SupportEmailLink className="support-email-link">
            {site.supportEmail}
          </SupportEmailLink>
        </p>
        <Link href="/" className="back-link">← 홈으로</Link>
      </main>
      <SiteFooter />
    </>
  );
}
