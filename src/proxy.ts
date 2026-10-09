import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, hasLocale } from "@/i18n/config";

// Paths from the first demo, kept working for links already shared with testers.
const LEGACY: Record<string, string> = {
  "/map": "/nearby",
  "/routes": "/walks",
  "/credits": "/sources",
};

/** Every page lives under /en, /zh or /fr. Anything else is redirected to the visitor's language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return;

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  const locale = hasLocale(cookie) ? cookie : DEFAULT_LOCALE;

  let rest = pathname === "/" ? "" : pathname;
  for (const [from, to] of Object.entries(LEGACY)) {
    if (rest === from || rest.startsWith(`${from}/`)) {
      rest = (to === "/" ? "" : to) + rest.slice(from.length);
      break;
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${rest}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, static files (anything with an extension) and the image optimizer.
  matcher: ["/((?!_next/|img/|maplibre/|favicon\\.ico|.*\\..*).*)"],
};
