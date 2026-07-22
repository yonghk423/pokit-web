import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, narrowContainer } from "@/lib/cn";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit5.png",
  width: 512,
  height: 512,
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);
  const alternates = localeAlternates(rawLocale, "/support");

  return {
    title: dict.support.title,
    description: dict.support.description,
    alternates,
    openGraph: {
      title: dict.support.title,
      description: dict.support.description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: dict.support.title,
      description: dict.support.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dict = await getDictionary(rawLocale);

  return (
    <main className={cn(narrowContainer, "py-14 pb-24")}>
      <h1 className="m-0 mb-6 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
        {dict.support.title}
      </h1>
      <p className="text-muted leading-relaxed">{dict.support.intro}</p>
      <h2 className="mt-10 mb-3 label-caps">
        {dict.support.email}
      </h2>
      <p className="text-muted">
        <SupportEmailLink>{site.supportEmail}</SupportEmailLink>
      </p>
      <p className="mt-6 text-muted">
        <SupportEmailLink variant="button">{dict.support.sendMail}</SupportEmailLink>
      </p>
      <Link
        href={withLocale(rawLocale, "/")}
        className="mt-10 inline-block border-2 border-black bg-panel px-5 py-2 font-sans font-bold text-ink hover:bg-wash"
      >
        {dict.support.backHome}
      </Link>
    </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
