import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SupportEmailLink } from "@/components/support-email-link";
import { appName, site } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { getPrivacyMessages } from "@/i18n/get-privacy-messages";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = createTranslator(await getPrivacyMessages(locale));
  const title = t("웹사이트 개인정보 처리 안내");
  const description = t("pokitstory.com의 방문 통계, 브라우저 저장 및 웹 체험 데이터 처리에 대한 안내입니다.");
  const alternates = localeAlternates(locale, "/privacy");
  return { title, description, alternates,
    openGraph: { title, description, siteName: appName(locale), url: alternates.canonical, locale: localeOpenGraph(locale), type: "website" } };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [messages, common] = await Promise.all([getPrivacyMessages(locale), getCommonMessages(locale)]);
  const t = createTranslator(messages);
  const commonT = createTranslator(common);
  const sections = [
    { id: "scope", title: t("적용 범위"), body: t("이 안내는 pokitstory.com 웹사이트 이용에 적용됩니다. 오늘의 주인공 앱의 데이터 처리에 관한 문의는 아래 연락처로 보내주세요.") },
    { id: "analytics", title: t("방문 통계와 서비스 개선"), body: t("이 사이트는 Google Analytics를 사용해 페이지 조회, 유입 경로, 접속 환경과 앱 소개·다운로드 링크 클릭 등을 측정합니다. 이 통계는 사이트 이용 현황을 이해하고 콘텐츠와 화면을 개선하는 데 사용합니다. 다운로드 링크 클릭은 앱 설치 완료와 구분합니다.") },
    { id: "storage", title: t("쿠키와 브라우저 저장"), body: t("선택한 언어는 쿠키에 기억합니다. 방문 통계 기능에서도 쿠키가 사용될 수 있습니다. 글 목록의 보기 방식이나 앱 설치 안내를 닫은 상태 등은 브라우저 저장소에 보관될 수 있습니다. 쿠키와 저장된 사이트 데이터는 브라우저 설정에서 삭제하거나 제한할 수 있습니다.") },
    { id: "demo", title: t("웹 체험에 입력한 내용"), body: t("앱 소개 페이지의 웹 체험에서 입력한 메모와 할 일은 해당 화면의 메모리에서만 관리합니다. 새로고침하면 초기화되며, 이 기능은 입력 내용을 서버에 저장하거나 앱으로 자동 이전하지 않습니다.") },
    { id: "services", title: t("외부 서비스와 링크"), body: t("콘텐츠와 이미지 제공에는 Sanity를, 방문 통계에는 Google Analytics를 사용합니다. 앱 다운로드 버튼은 Apple App Store로 연결됩니다. 이러한 외부 서비스의 데이터 처리에 관한 자세한 내용은 각 서비스의 개인정보 관련 안내를 확인해주세요.") },
  ];
  return <main className="mx-auto max-w-[48rem] px-6 py-14 text-[#151518] max-sm:px-5">
    <header className="mb-10 border-b border-black/10 pb-8">
      <h1 className="m-0 font-sans text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight tracking-[-0.04em]">{t("웹사이트 개인정보 처리 안내")}</h1>
      <p className="mt-5 text-sm leading-7 text-black/60">{t("pokitstory.com의 방문 통계, 브라우저 저장 및 웹 체험 데이터 처리에 대한 안내입니다.")}</p>
      <p className="mt-3 text-xs text-black/50">{t("안내 갱신일")}: <time dateTime="2026-10-27">2026-10-27</time></p>
    </header>
    {sections.map(section => <section key={section.id} id={section.id} className="mb-9">
      <h2 className="mb-3 font-sans text-lg font-semibold tracking-[-0.02em]">{section.title}</h2>
      <p className="m-0 text-[0.96rem] leading-8 text-black/75">{section.body}</p>
    </section>)}
    <section aria-labelledby="privacy-contact-title" className="mb-10 border-t border-black/10 pt-8">
      <h2 id="privacy-contact-title" className="mb-3 text-lg font-semibold">{t("개인정보 관련 문의")}</h2>
      <p className="mb-4 text-sm leading-7 text-black/75">{t("웹사이트의 개인정보 처리에 관한 문의는 아래 이메일로 보내주세요.")}</p>
      <SupportEmailLink className="break-all text-sm">{site.supportEmail}</SupportEmailLink>
    </section>
    <Link href={withLocale(locale, "/")} className="text-sm underline underline-offset-4">{commonT("홈으로")}</Link>
  </main>;
}
