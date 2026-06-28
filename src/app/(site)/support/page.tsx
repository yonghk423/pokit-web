import Link from "next/link";
import type { Metadata } from "next";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "지원",
  description: `${site.name} 문의 안내`,
};

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-[42rem] px-4 py-12 pb-20">
        <h1 className="m-0 mb-4 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.04em]">
          지원
        </h1>
        <p className="text-muted">
          사이트·앱 관련 문의는 아래 이메일로 보내 주세요.
        </p>
        <h2 className="mt-8 mb-2 font-sans text-[0.95rem] font-black">
          이메일
        </h2>
        <p className="text-muted">
          <SupportEmailLink>{site.supportEmail}</SupportEmailLink>
        </p>
        <p className="text-muted">
          <SupportEmailLink variant="button">메일 보내기</SupportEmailLink>
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
