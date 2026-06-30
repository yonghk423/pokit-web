import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localeAlternates, withLocale } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);

  return {
    title: dict.support.title,
    description: dict.support.description,
    alternates: localeAlternates(rawLocale, "/support"),
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dict = await getDictionary(rawLocale);

  return (
    <main className="mx-auto max-w-[42rem] px-4 py-12 pb-20">
      <h1 className="m-0 mb-4 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.04em]">
        {dict.support.title}
      </h1>
      <p className="text-muted">{dict.support.intro}</p>
      <h2 className="mt-8 mb-2 font-sans text-[0.95rem] font-black">
        {dict.support.email}
      </h2>
      <p className="text-muted">
        <SupportEmailLink>{site.supportEmail}</SupportEmailLink>
      </p>
      <p className="text-muted">
        <SupportEmailLink variant="button">{dict.support.sendMail}</SupportEmailLink>
      </p>
      <Link href={withLocale(rawLocale, "/")} className="mt-8 inline-block font-sans text-green">
        {dict.support.backHome}
      </Link>
    </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
