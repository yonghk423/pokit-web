import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { isValidArticleSlug } from "@/lib/article-path";
import { POKIT_APP_HEADER } from "@/lib/pokit-app-header";

const PUBLIC_FILE = /\.[^/]+$/;

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) {
    return cookie;
  }

  const country = request.headers.get("x-vercel-ip-country");
  if (country === "KR") {
    return "ko";
  }
  if (country === "JP") {
    return "ja";
  }

  const accept = request.headers.get("accept-language") ?? "";
  if (/\bko\b/i.test(accept)) {
    return "ko";
  }
  if (/\bja\b/i.test(accept)) {
    return "ja";
  }

  return defaultLocale;
}

function prefixPath(locale: Locale, pathname: string) {
  if (pathname === "/") {
    return `/${locale}`;
  }
  return `/${locale}${pathname}`;
}

/** UA / query flags that the old beforeInteractive boot script handled. */
function isPokitAppRequest(request: NextRequest) {
  if (request.nextUrl.searchParams.get("pokit_app") === "1") {
    return true;
  }
  const ua = request.headers.get("user-agent") ?? "";
  return /POKIT/i.test(ua);
}

function withRequestHints(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  if (isPokitAppRequest(request)) {
    requestHeaders.set(POKIT_APP_HEADER, "1");
  }
  return requestHeaders;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  if (localeParam && isLocale(localeParam)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("locale");
    redirectUrl.pathname = prefixPath(localeParam, redirectUrl.pathname);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(LOCALE_COOKIE, localeParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) {
    const articleParam = request.nextUrl.searchParams.get("article");
    const isHome = pathname === `/${firstSegment}` || pathname === `/${firstSegment}/`;
    if (articleParam && isHome) {
      const slug = decodeURIComponent(articleParam);
      if (isValidArticleSlug(slug)) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = `/${firstSegment}/articles/${encodeURIComponent(slug)}`;
        redirectUrl.searchParams.delete("article");
        return NextResponse.redirect(redirectUrl, 308);
      }
    }

    const response = NextResponse.next({
      request: { headers: withRequestHints(request, pathname) },
    });
    const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
    if (cookie !== firstSegment) {
      response.cookies.set(LOCALE_COOKIE, firstSegment, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale = detectLocale(request);
  const redirectUrl = request.nextUrl.clone();
  const articleParam = request.nextUrl.searchParams.get("article");
  if (
    articleParam &&
    (pathname === "/" || pathname === "") &&
    isValidArticleSlug(decodeURIComponent(articleParam))
  ) {
    redirectUrl.pathname = `/${locale}/articles/${encodeURIComponent(decodeURIComponent(articleParam))}`;
    redirectUrl.searchParams.delete("article");
  } else {
    redirectUrl.pathname = prefixPath(locale, pathname);
  }

  const response = NextResponse.redirect(redirectUrl);
  if (!request.cookies.get(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
