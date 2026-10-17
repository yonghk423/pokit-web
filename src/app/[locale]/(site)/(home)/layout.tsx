import type { Metadata } from "next";
import { site } from "@/config/site";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import { notFound } from "next/navigation";
import { HomePreviewShell } from "@/components/home-preview-shell";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);
  const alternates = localeAlternates(rawLocale, "/");

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    alternates,
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [
        {
          url: "/pokit-logo.png",
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      images: ["/pokit-logo.png"],
    },
  };
}

export default async function HomeLayout({ children, modal, params }: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <HomePreviewShell locale={locale}
      closeLabel={dict.home.closePreview}
      installCopy={dict.article.addToPokit}
      toolKicker={dict.newArrivals.kicker}>
      {children}
      {modal}
    </HomePreviewShell>
  );
}
