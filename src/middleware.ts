import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";

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
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
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
  redirectUrl.pathname = prefixPath(locale, pathname);

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
