import { isLocale } from "@/i18n/config";

// Published Sanity slug has a double "n"; retain inbound links using "evening".
const articleSlugAliases = new Map([
  ["foot-soak-evening", "foot-soak-evenning"],
]);

/** Resolve retired article URLs directly to their final localized address. */
export function articleRedirectPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const localized = isLocale(segments[0] ?? "");
  const locale = localized ? segments.shift()! : "en";

  if (segments[0] !== "articles") return null;
  const slug = segments.length === 2 ? segments[1] : undefined;
  const alias = slug ? articleSlugAliases.get(slug) : undefined;

  if (localized && !alias) return null;
  if (alias) return `/${locale}/articles/${alias}`;
  return `/${locale}${pathname}`;
}
