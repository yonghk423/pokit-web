import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportEmailLink } from "@/components/support-email-link";
import { createSupportCopy } from "@/content/support-copy";
import type { SupportBlock } from "@/content/support-types";
import { appStoreUrl, site, appName } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getSupportMessages } from "@/i18n/get-support-messages";
import { cn, monoContainer } from "@/lib/cn";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit-logo.png",
  width: 512,
  height: 512,
} as const;

const paper = "bg-[#f4f3ef]";

function SupportBlockView({ block }: { block: SupportBlock }) {
  if (block.type === "p") {
    return (
      <p className="m-0 whitespace-pre-line font-sans text-[1.05rem] leading-[1.75] text-ink/75">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="m-0 grid list-none gap-3 p-0">
        {block.items.map((item) => (
          <li
            key={item}
            className="border-t border-ink/10 pt-3 font-sans text-[1.02rem] leading-[1.7] text-ink/80"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "faq") {
    return (
      <article className="border-t border-ink/10 pt-5">
        <h3 className="m-0 font-serif text-[clamp(1.35rem,2vw,1.7rem)] font-normal italic leading-[1.25] tracking-[-0.02em]">
          {block.q}
        </h3>
        <p className="mt-3 mb-0 whitespace-pre-line font-sans text-[1.02rem] leading-[1.7] text-ink/75">
          {block.a}
        </p>
      </article>
    );
  }

  return null;
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
      siteName: appName(rawLocale),
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
    <main className={cn(paper, "pb-20 text-ink")}>
      <header className={cn(monoContainer, "w-full pb-8 pt-14 nav:pb-12 nav:pt-20")}>
        <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.16em] text-ink/45">
          {copy.kicker}
        </p>
        <h1 className="m-0 mt-4 w-full text-left font-serif text-[clamp(3.2rem,8vw,7rem)] font-normal italic leading-[0.98] tracking-[-0.045em]">
          {copy.title}
        </h1>
        <div className="mt-8 flex w-full flex-col items-start gap-6 nav:flex-row nav:items-end nav:justify-between">
          <div className="grid max-w-3xl flex-1 gap-3">
            {copy.lead.map((paragraph) => (
              <p
                key={paragraph}
                className="m-0 text-left font-sans text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.6] tracking-[-0.02em] text-ink/70"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              href={storeUrl}
              className="font-sans text-[0.95rem] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              {copy.appStore}
            </a>
            <SupportEmailLink className="font-sans text-[0.95rem] text-ink decoration-ink/30 underline-offset-4 hover:decoration-ink">
              {t("메일 보내기")}
            </SupportEmailLink>
          </div>
        </div>
      </header>

      <nav
        aria-label={copy.tocLabel}
        className={cn(monoContainer, "grid w-full grid-cols-2 gap-3 pb-6 nav:grid-cols-6")}
      >
        {copy.sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex w-full items-center justify-center rounded-full border border-ink/15 px-3 py-3 text-center font-sans text-[0.92rem] tracking-[-0.01em] text-ink/80 transition-colors hover:bg-ink hover:text-[#f4f3ef]"
          >
            {String(index + 1).padStart(2, "0")} {section.title}
          </a>
        ))}
      </nav>

      {copy.sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-24 border-t border-ink/10"
        >
          <div
            className={cn(
              monoContainer,
              "grid w-full gap-6 py-12 nav:grid-cols-12 nav:gap-8 nav:py-16",
            )}
          >
            <p className="m-0 font-serif text-[3.5rem] italic leading-none tracking-[-0.04em] text-ink/20 nav:col-span-2">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="m-0 font-serif text-[clamp(2rem,3.4vw,3rem)] font-normal italic leading-[1.1] tracking-[-0.03em] nav:col-span-4">
              {section.title}
            </h2>
            <div className="grid min-w-0 content-start gap-5 nav:col-span-6">
              {section.blocks.map((block, blockIndex) => (
                <SupportBlockView
                  key={`${section.id}-${block.type}-${blockIndex}`}
                  block={block}
                />
              ))}
              {section.id === "contact" ? (
                <div className="grid justify-items-start gap-2 border-t border-ink/10 pt-5">
                  <p className="m-0 font-sans text-[0.78rem] tracking-[0.12em] text-ink/45">
                    {t("이메일")}
                  </p>
                  <SupportEmailLink className="break-all font-sans text-[1.15rem] text-ink decoration-ink/30">
                    {site.supportEmail}
                  </SupportEmailLink>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      <div className={cn(monoContainer, "border-t border-ink/10 pt-8")}>
        <Link
          href={withLocale(locale, "/")}
          className="font-sans text-[0.95rem] text-ink/70 underline decoration-ink/25 underline-offset-4 hover:text-ink"
        >
          {t("← 홈으로")}
        </Link>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
