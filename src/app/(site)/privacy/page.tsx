import Link from "next/link";
import type { Metadata } from "next";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: `${site.name} 개인정보 처리방침`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[42rem] px-4 py-12 pb-20">
        <h1 className="m-0 mb-4 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.04em]">
          개인정보 처리방침
        </h1>
        <p className="text-muted">
          사이트를 새로 구성하는 중입니다. 정식 오픈 전에 이 내용을
          업데이트해 주세요.
        </p>
        <h2 className="mt-8 mb-2 font-sans text-[0.95rem] font-black">
          문의
        </h2>
        <p className="text-muted">
          <SupportEmailLink>{site.supportEmail}</SupportEmailLink>
        </p>
        <Link
          href="/"
          className="mt-8 inline-block font-sans text-green"
        >
          ← 홈으로
        </Link>
    </main>
  );
}
