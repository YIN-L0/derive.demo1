"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useJournal } from "@/lib/store";

const NAV = [
  { href: "/routes", label: "Routes" },
  { href: "/map", label: "Map" },
  { href: "/journal", label: "Journal" },
  { href: "/community", label: "Community" },
];

export default function Header({ tone = "solid" }: { tone?: "solid" | "overlay" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useJournal(
    (s) => Object.values(s.entries).filter((e) => e.saved || e.checkedInAt).length,
  );
  const overlay = tone === "overlay" && !open;

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
              {open ? "Close" : "Menu"}
            </button>
            {NAV.map((n) => (
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
          <Link href="/" className="display text-[22px] tracking-[0.32em] md:text-[26px]" aria-label="Dérive — home">
            DÉRIVE
          </Link>
          <div className="flex items-center justify-end gap-6">
            <span className="label hidden opacity-80 lg:inline">Paris · 48.85° N</span>
            <Link href="/journal" className="label">
              Journal ({count})
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[999] flex flex-col justify-between bg-paper px-4 pt-24 pb-8 md:hidden">
          <nav className="flex flex-col gap-2">
            {[{ href: "/", label: "Index" }, ...NAV].map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="display rise text-5xl"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="label text-mute">Paris · Collection 01 · Autumn 2026</p>
        </div>
      )}
    </>
  );
}
