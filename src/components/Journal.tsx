"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useI18n } from "@/i18n/client";
import { fmt } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/store";

export type JournalSite = { id: string; name: string; works: string[]; hook: string; image?: string };
type Walk = { id: string; title: string; siteIds: string[] };

const DATE_LOCALE = { en: "en-GB", zh: "zh-CN", fr: "fr-FR" } as const;

export default function Journal({ sites, walks }: { sites: JournalSite[]; walks: Walk[] }) {
  const { locale, dict } = useI18n();
  const entries = useJournal((s) => s.entries);
  const remove = useJournal((s) => s.remove);
  const byId = useMemo(() => new Map(sites.map((s) => [s.id, s])), [sites]);
  const date = (iso: string) => new Date(iso).toLocaleDateString(DATE_LOCALE[locale], { day: "numeric", month: "short", year: "numeric" });

  const list = useMemo(
    () =>
      Object.values(entries)
        // Entries for sites no longer in the atlas are ignored rather than shown half-broken.
        .filter((e) => byId.has(e.placeId) && (e.saved || e.checkedInAt || e.note))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [entries, byId],
  );
  const visited = list.filter((e) => e.checkedInAt).length;

  return (
    <main className="px-4 md:px-8">
      <section className="grid gap-8 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="label text-mute">{dict.journal.kept}</p>
          <h1 className="display mt-3 text-[clamp(56px,9vw,150px)]">{dict.journal.title}</h1>
        </div>
        <dl className="grid grid-cols-3 self-end border-t border-ink pt-5 md:col-span-5">
          {[
            [dict.journal.visited, `${visited}/${sites.length}`],
            [dict.journal.saved, String(list.filter((e) => e.saved).length)],
            [dict.journal.notes, String(list.filter((e) => e.note).length)],
          ].map(([l, n]) => (
            <div key={l}>
              <dd className="display text-[44px] leading-none">{n}</dd>
              <dt className="label mt-2 text-mute">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-6 border-y hairline py-8 md:grid-cols-3">
        {walks.map((w) => {
          const done = w.siteIds.filter((id) => entries[id]?.checkedInAt).length;
          return (
            <Link key={w.id} href={`/${locale}/nearby?walk=${w.id}`} className="group">
              <div className="flex items-baseline justify-between">
                <span className="display text-[22px] group-hover:italic">{w.title}</span>
                <span className="label text-mute">{done}/{w.siteIds.length}</span>
              </div>
              <div className="mt-3 flex gap-1">
                {w.siteIds.map((id, i) => (
                  <span key={`${id}-${i}`} className={`h-[3px] flex-1 ${entries[id]?.checkedInAt ? "bg-accent" : "bg-line"}`} />
                ))}
              </div>
            </Link>
          );
        })}
      </section>

      {list.length === 0 ? (
        <section className="flex flex-col items-start gap-6 py-24 md:py-36">
          <p className="display max-w-2xl text-[clamp(32px,4vw,60px)] leading-[1.05]">
            {dict.journal.empty} <em className="text-mute italic">{dict.journal.emptyCta}</em>
          </p>
          <Link href={`/${locale}/nearby`} className="btn btn-solid">{dict.journal.start}</Link>
        </section>
      ) : (
        <section className="grid gap-x-4 gap-y-14 py-16 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => {
            const s = byId.get(e.placeId)!;
            return (
              <article key={e.placeId} className="group flex flex-col">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                    {s.image && <Image src={s.image} alt={s.name} fill sizes="(min-width: 1024px) 16vw, 50vw" className="photo object-cover" />}
                  </div>
                  <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 border border-dashed border-ink/30 text-mute">
                    <span className="display text-3xl">+</span>
                    <span className="label text-[9px]">{dict.journal.photoSoon}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="label text-mute">
                    {e.checkedInAt ? fmt(dict.journal.visitedOn, { date: date(e.checkedInAt) }) : fmt(dict.journal.savedOn, { date: date(e.updatedAt) })}
                  </span>
                  <span className="flex gap-1.5">
                    {e.checkedInAt && <span className="label bg-accent px-1.5 py-0.5 text-[9px] text-white">{dict.actions.here}</span>}
                    {e.saved && <span className="label border border-ink px-1.5 py-0.5 text-[9px]">{dict.actions.saved}</span>}
                  </span>
                </div>
                <h2 className="display mt-2 text-[28px] leading-tight">{s.name}</h2>
                <p className="display text-[15px] text-mute italic">{s.works.join(" · ")}</p>
                {e.note && (
                  <blockquote className="mt-4 border-l-2 border-accent pl-4">
                    <p className="display text-[18px] italic">{e.note}</p>
                  </blockquote>
                )}
                {e.mood && <p className="label mt-3 text-mute">{dict.journal.mood} — {dict.moods[e.mood]}</p>}
                <div className="mt-5 flex gap-5">
                  <Link href={`/${locale}/places/${s.id}`} className="label link-underline">{dict.journal.open}</Link>
                  <button onClick={() => remove(s.id)} className="label text-mute hover:text-ink">{dict.journal.remove}</button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
