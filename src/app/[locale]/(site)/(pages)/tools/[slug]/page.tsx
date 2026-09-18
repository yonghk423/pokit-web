import { notFound, permanentRedirect } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";
import { isValidToolSlug } from "@/lib/routine-tool-path";

export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Legacy tool URLs redirect to the home preview modal. */
export default async function RoutineToolPage({ params }: Props) {
  const { locale: rawLocale, slug: rawSlug } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const slug = decodeURIComponent(rawSlug);
  if (!isValidToolSlug(slug)) {
    notFound();
  }

  permanentRedirect(
    `${withLocale(rawLocale, "/")}?tool=${encodeURIComponent(slug)}`,
  );
}
