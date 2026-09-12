import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportEmailLink } from "@/components/support-email-link";
import { getSupportCopy } from "@/content/support-copy";
import type { SupportBlock } from "@/content/support-types";
import { appStoreUrl, site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
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

function SupportBlockView({ block }: { block: SupportBlock }) {
  if (block.type === "p") {
    return <p className="m-0 text-[1.02rem] leading-relaxed text-muted">{block.text}</p>;
  }

  if (block.type === "h3") {
    return (
      <h3 className="m-0 mt-2 text-[1.05rem] font-extrabold tracking-[-0.02em]">
        {block.text}
      </h3>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="m-0 grid list-none gap-2.5 p-0">
        {block.items.map((item) => (
          <li
            key={item}
            className="border-l-2 border-black pl-3 text-[1.02rem] leading-relaxed text-muted"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "faq") {
    return (
      <article className="border-2 border-black bg-panel p-4">
        <h3 className="m-0 text-[1.02rem] font-extrabold leading-snug tracking-[-0.02em]">
          {block.q}
        </h3>
        <p className="mt-2 mb-0 text-[0.98rem] leading-relaxed text-muted">{block.a}</p>
      </article>
    );
  }

  return (
    <article className="border-2 border-black bg-beige p-4">
      <h3 className="m-0 text-[1.02rem] font-extrabold leading-snug tracking-[-0.02em]">
        {block.title}
      </h3>
      <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
        {block.items.map((item) => (
          <li key={item} className="text-[0.98rem] leading-relaxed text-muted">
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

  const copy = getSupportCopy(rawLocale);
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
  const dict = await getDictionary(locale);
  const copy = getSupportCopy(locale);
  const storeUrl = appStoreUrl(locale);

  return (
      <main className={cn(narrowContainer, "py-14 pb-24")}>
        <p className="m-0 label-caps text-muted">{copy.kicker}</p>
        <h1 className="mt-3 mb-0 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
          {copy.title}
        </h1>
        <div className="mt-6 grid gap-4">
          {copy.lead.map((paragraph) => (
            <p key={paragraph} className="m-0 text-[1.05rem] leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={storeUrl}
            className="inline-flex min-h-12 items-center border-2 border-black bg-black px-5 font-sans text-[0.78rem] font-extrabold tracking-[0.06em] text-white uppercase hover:opacity-90"
          >
            {copy.appStore}
          </a>
          <SupportEmailLink variant="button">{dict.support.sendMail}</SupportEmailLink>
        </div>

        <nav className="mt-10 border-2 border-black bg-beige p-4" aria-label={copy.tocLabel}>
          <p className="m-0 mb-3 label-caps text-ink">{copy.tocLabel}</p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {copy.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex border-2 border-black bg-panel px-2.5 py-1 text-[0.78rem] font-bold text-ink hover:bg-wash"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 grid gap-14">
          {copy.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="m-0 text-[clamp(1.35rem,3vw,1.8rem)] font-extrabold tracking-[-0.03em]">
                {section.title}
              </h2>
              <div className="mt-5 grid gap-4">
                {section.blocks.map((block, index) => (
                  <SupportBlockView
                    key={`${section.id}-${block.type}-${index}`}
                    block={block}
                  />
                ))}
                {section.id === "contact" ? (
                  <div className="grid gap-3">
                    <p className="m-0 text-[0.92rem] font-bold">{dict.support.email}</p>
                    <SupportEmailLink>{site.supportEmail}</SupportEmailLink>
                    <SupportEmailLink variant="button">
                      {dict.support.sendMail}
                    </SupportEmailLink>
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <Link
          href={withLocale(locale, "/")}
          className="mt-12 inline-block border-2 border-black bg-panel px-5 py-2 font-sans font-bold text-ink hover:bg-wash"
        >
          {dict.support.backHome}
        </Link>
      </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
