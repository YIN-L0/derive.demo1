"use client";

import Link from "next/link";
import { useMemo } from "react";
import { placeById, places } from "@/data/places";
import { routes } from "@/data/routes";
import { useJournal } from "@/lib/store";
import Photo from "./Photo";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function Journal() {
  const entries = useJournal((s) => s.entries);
  const remove = useJournal((s) => s.remove);

  const list = useMemo(
    () =>
      Object.values(entries)
        .filter((e) => e.saved || e.checkedInAt || e.note)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [entries],
  );
  const checkedIn = list.filter((e) => e.checkedInAt).length;
  const saved = list.filter((e) => e.saved).length;
  const notes = list.filter((e) => e.note).length;

  return (
    <main className="px-4 md:px-8">
      <section className="grid gap-8 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="label text-mute">Kept on this device</p>
          <h1 className="display mt-3 text-[clamp(56px,9vw,150px)]">Journal</h1>
        </div>
        <dl className="grid grid-cols-3 self-end border-t border-ink pt-5 md:col-span-5">
          {[
            ["Visited", `${checkedIn}/${places.length}`],
            ["Saved", String(saved)],
            ["Notes", String(notes)],
          ].map(([l, n]) => (
            <div key={l}>
              <dd className="display text-[44px] leading-none">{n}</dd>
              <dt className="label mt-2 text-mute">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ——— Progress per walk ——— */}
      <section className="grid gap-6 border-y hairline py-8 md:grid-cols-3">
        {routes.map((r) => {
          const done = r.stops.filter((s) => entries[s.placeId]?.checkedInAt).length;
          return (
            <Link key={r.id} href={`/map?route=${r.id}`} className="group">
              <div className="flex items-baseline justify-between">
                <span className="display text-[22px] group-hover:italic">{r.title}</span>
                <span className="label text-mute">
                  {done}/{r.stops.length}
                </span>
              </div>
              <div className="mt-3 flex gap-1">
                {r.stops.map((s) => (
                  <span
                    key={s.placeId}
                    className={`h-[3px] flex-1 ${entries[s.placeId]?.checkedInAt ? "bg-accent" : "bg-line"}`}
                  />
                ))}
              </div>
            </Link>
          );
        })}
      </section>

      {list.length === 0 ? (
        <section className="flex flex-col items-start gap-6 py-24 md:py-36">
          <p className="display max-w-2xl text-[clamp(32px,4vw,60px)] leading-[1.05]">
            Nothing kept yet. <em className="italic text-mute">Go and stand somewhere a story happened.</em>
          </p>
          <Link href="/map?route=before-sunset" className="btn btn-solid">
            Start with Before Sunset
          </Link>
        </section>
      ) : (
        <section className="grid gap-x-4 gap-y-14 py-16 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => {
            const p = placeById(e.placeId);
            if (!p) return null;
            return (
              <article key={e.placeId} className="group flex flex-col">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                    <Photo id={p.id} alt={p.title} sizes="(min-width: 1024px) 16vw, 50vw" />
                  </div>
                  <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 border border-dashed border-ink/30 text-mute">
                    <span className="display text-3xl">+</span>
                    <span className="label text-[9px]">Your photo · soon</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="label text-mute">
                    {e.checkedInAt ? `Visited ${fmt(e.checkedInAt)}` : `Saved ${fmt(e.updatedAt)}`}
                  </span>
                  <span className="flex gap-1.5">
                    {e.checkedInAt && <span className="label bg-accent px-1.5 py-0.5 text-[9px] text-white">Here</span>}
                    {e.saved && <span className="label border border-ink px-1.5 py-0.5 text-[9px]">Saved</span>}
                  </span>
                </div>
                <h2 className="display mt-2 text-[28px]">{p.title}</h2>
                <p className="display text-[15px] text-mute italic">{p.works[0].title}</p>
                {e.note && (
                  <blockquote className="mt-4 border-l-2 border-accent pl-4">
                    <p className="display text-[18px] italic">{e.note}</p>
                  </blockquote>
                )}
                {e.mood && <p className="label mt-3 text-mute">Mood — {e.mood}</p>}
                <div className="mt-5 flex gap-5">
                  <Link href={`/map?place=${p.id}`} className="label link-underline">
                    Open
                  </Link>
                  <button onClick={() => remove(p.id)} className="label text-mute hover:text-ink">
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
