"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_NAMES, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/client";

function Switch({ className = "" }: { className?: string }) {
  const { locale } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const swap = (to: Locale) => pathname.replace(/^\/(en|zh|fr)(?=\/|$)/, `/${to}`) + (search ? `?${search}` : "");

  return (
    <div className={`flex items-center gap-2.5 ${className}`} role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={swap(l)}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={`label ${l === locale ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"}`}
        >
          {LOCALE_NAMES[l]}
        </Link>
      ))}
    </div>
  );
}

/** EN · 中文 · FR — keeps the current page and query when switching. */
export default function LangSwitch(props: { className?: string }) {
  return (
    <Suspense fallback={<div className={props.className} />}>
      <Switch {...props} />
    </Suspense>
  );
}
