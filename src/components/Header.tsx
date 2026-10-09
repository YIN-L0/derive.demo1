"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { useJournal } from "@/lib/store";
import LangSwitch from "./LangSwitch";

export default function Header({ tone = "solid" }: { tone?: "solid" | "overlay" }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useJournal((s) => Object.values(s.entries).filter((e) => e.saved || e.checkedInAt).length);
  const overlay = tone === "overlay" && !open;
  const nav = [
    { href: `/${locale}/nearby`, label: dict.nav.nearby },
    { href: `/${locale}/walks`, label: dict.nav.walks },
    { href: `/${locale}/journal`, label: `${dict.nav.journal}${count ? ` (${count})` : ""}` },
    { href: `/${locale}/community`, label: dict.nav.community },
  ];

  return (
    <>
      <header
        className={`${tone === "overlay" ? "absolute" : "sticky border-b hairline bg-paper/95 backdrop-blur"} inset-x-0 top-0 z-[1000] ${
          overlay ? "text-white" : "text-ink"
        }`}
      >
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <nav className="flex items-center gap-6">
            <button className="label md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              {open ? dict.nav.close : dict.nav.menu}
            </button>
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`label hidden md:inline ${
                  pathname.startsWith(n.href) ? "underline underline-offset-4" : "opacity-80 hover:opacity-100"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href={`/${locale}`} className="display text-[22px] tracking-[0.32em] md:text-[26px]" aria-label="Dérive">
            DÉRIVE
          </Link>
          <LangSwitch className="justify-end" />
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[999] flex flex-col justify-between bg-paper px-4 pt-24 pb-safe md:hidden">
          <nav className="flex flex-col gap-2">
            {[{ href: `/${locale}`, label: dict.nav.home }, ...nav, { href: `/${locale}/sources`, label: dict.nav.sources }].map(
              (n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="display rise text-5xl"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-end justify-between">
            <p className="label text-mute">{dict.brand.edition}</p>
            <LangSwitch />
          </div>
        </div>
      )}
    </>
  );
}
