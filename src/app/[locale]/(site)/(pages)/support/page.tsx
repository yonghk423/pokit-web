import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportEmailLink } from "@/components/support-email-link";
import { createSupportCopy } from "@/content/support-copy";
import type { SupportBlock } from "@/content/support-types";
import { appStoreUrl, site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getSupportMessages } from "@/i18n/get-support-messages";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit-logo.png",
  width: 512,
  height: 512,
} as const;

function SupportBlockView({ block }: { block: SupportBlock }) {
  if (block.type === "p") {
    return <p className="m-0 whitespace-pre-line font-sans text-[0.95rem] leading-[1.85] text-ink/75">{block.text}</p>;
  }

  if (block.type === "h3") {
    return (
      <h3 className="m-0 mt-5 font-sans text-base font-semibold leading-snug text-ink">
        {block.text}
      </h3>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="m-0 grid list-disc gap-2 pl-5 marker:text-ink/40">
        {block.items.map((item) => (
          <li
            key={item}
            className="pl-1 font-sans text-[0.95rem] leading-[1.85] text-ink/75"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "faq") {
    return (
      <article className="border-b border-ink/10 py-5 first:pt-0 last:border-0 last:pb-0">
        <h3 className="m-0 font-sans text-base font-semibold leading-[1.6]">
          {block.q}
        </h3>
        <p className="mt-3 mb-0 whitespace-pre-line font-sans text-[0.95rem] leading-[1.85] text-ink/75">{block.a}</p>
      </article>
    );
  }

  return (
    <article className="border-b border-ink/10 py-5 first:pt-0 last:border-0 last:pb-0">
      <h3 className="m-0 font-sans text-base font-semibold leading-[1.6]">
        {block.title}
      </h3>
      <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
        {block.items.map((item) => (
          <li key={item} className="font-sans text-[0.95rem] leading-[1.85] text-ink/75">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const t = createTranslator(await getSupportMessages(rawLocale));
  const copy = createSupportCopy(t);
  const alternates = localeAlternates(rawLocale, "/support");

  return {
    title: copy.title,
    description: copy.description,
    alternates,
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: copy.title,
      description: copy.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const t = createTranslator(await getSupportMessages(locale));
  const copy = createSupportCopy(t);
  const storeUrl = appStoreUrl(locale);

  return (
    <main className="mx-auto w-full max-w-[68rem] px-6 pb-20 pt-12 font-sans text-ink nav:px-10 nav:pt-20">
      <header>
        <p className="m-0 text-xs font-medium tracking-[0.08em] text-ink/50">{copy.kicker}</p>
        <div className="mt-4 grid gap-7 nav:grid-cols-[17rem_minmax(0,1fr)] nav:gap-12">
          <h1 className="m-0 break-keep text-[clamp(1.75rem,3vw,2rem)] font-medium leading-[1.2] tracking-[-0.04em]">{copy.title}</h1>
          <div>
            <div className="grid gap-4">
              {copy.lead.map(paragraph => (
                <p key={paragraph} className="m-0 whitespace-pre-line text-[0.95rem] leading-[1.85] text-ink/75">{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <a href={storeUrl} className="text-ink underline decoration-ink/35 underline-offset-4 hover:decoration-ink">{copy.appStore}</a>
              <SupportEmailLink className="text-ink decoration-ink/35 underline-offset-4 hover:decoration-ink">{t("메일 보내기")}</SupportEmailLink>
            </div>
          </div>
        </div>
      </header>

      <nav className="my-12 border-y border-ink/15 py-5 nav:my-16" aria-label={copy.tocLabel}>
        <p className="m-0 mb-3 text-xs text-ink/50">{copy.tocLabel}</p>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
          {copy.sections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-sm text-ink/75 underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink">{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {copy.sections.map(section => (
          <section key={section.id} id={section.id} className="grid scroll-mt-24 gap-6 border-b border-ink/15 py-10 first:pt-0 last:border-0 nav:grid-cols-[17rem_minmax(0,1fr)] nav:gap-12 nav:py-12">
            <div>
              <h2 className="m-0 text-xl font-medium leading-snug tracking-[-0.025em] nav:sticky nav:top-24">{section.title}</h2>
            </div>
            <div className="min-w-0">
              <div className="grid gap-5">
                {section.blocks.map((block, index) => (
                  <SupportBlockView key={`${section.id}-${block.type}-${index}`} block={block} />
                ))}
              </div>
              {section.id === "contact" ? (
                <div className="mt-6 grid justify-items-start gap-3">
                  <p className="m-0 text-sm text-ink/60">{t("이메일")}</p>
                  <SupportEmailLink className="break-all text-base text-ink decoration-ink/35">{site.supportEmail}</SupportEmailLink>
                  <SupportEmailLink className="mt-2 text-sm text-ink decoration-ink/35">{t("메일 보내기")}</SupportEmailLink>
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
      <Link href={withLocale(locale, "/")} className="mt-8 inline-block text-sm text-ink/65 underline decoration-ink/30 underline-offset-4 hover:text-ink">{t("← 홈으로")}</Link>
    </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
