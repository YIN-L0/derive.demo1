"use client";

import { useState } from "react";
import type { Place, Route } from "@/data/types";
import { MOODS, type Mood, useJournal } from "@/lib/store";
import { creditFor } from "@/lib/media";
import Photo from "./Photo";

const CATEGORY_LABEL: Record<Place["category"], string> = {
  film: "Film",
  literature: "Literature",
  art: "Art",
  "artist-life": "Artist life",
  partner: "Partner",
};

type Props = {
  place: Place;
  route?: Route;
  onClose: () => void;
  onStep?: (dir: -1 | 1) => void;
};

export default function PlaceCard({ place, route, onClose, onStep }: Props) {
  const entry = useJournal((s) => s.entries[place.id]);
  const { toggleSave, checkIn, setNote } = useJournal();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry?.note ?? "");
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood);
  const credit = creditFor(place.id);
  const stop = route?.stops.find((s) => s.placeId === place.id);

  return (
    <article className="sheet-in flex h-full flex-col overflow-y-auto bg-paper">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-paper-2">
        <Photo id={place.id} alt={place.title} sizes="(min-width: 768px) 420px, 100vw" color />
        <button
          onClick={onClose}
          className="label absolute top-3 right-3 bg-paper px-3 py-2 hover:bg-ink hover:text-paper"
        >
          Close ✕
        </button>
        {credit && (
          <a
            href={credit.source}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 left-3 text-[9px] tracking-wide text-white/80 drop-shadow"
          >
            Photo: {credit.author} · {credit.license}
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-7 px-5 pt-6 pb-8 md:px-7">
        <div className="flex items-center justify-between text-mute">
          <span className="label">
            {CATEGORY_LABEL[place.category]} — {place.arrondissement}
          </span>
          {route && stop && (
            <span className="label">
              {route.index} · Stop {stop.order}/{route.stops.length}
            </span>
          )}
        </div>

        <header>
          {stop && <p className="display mb-2 text-lg text-accent italic">{stop.narrativeBeat}</p>}
          <h2 className="display text-[40px] leading-[0.95]">{place.title}</h2>
          <p className="label mt-3 text-mute">{place.address}</p>
        </header>

        <ul className="border-y hairline divide-y divide-line">
          {place.works.map((w) => (
            <li key={w.title} className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="display text-[17px] italic">{w.title}</span>
              <span className="label shrink-0 text-mute">
                {[w.type, w.creator, w.year].filter(Boolean).join(" · ")}
              </span>
            </li>
          ))}
        </ul>

        <section>
          <h3 className="label mb-2 text-mute">The scene</h3>
          <p className="text-[14px] leading-relaxed text-ink-2">{place.context}</p>
        </section>
        <section>
          <h3 className="label mb-2 text-mute">Why it matters</h3>
          <p className="text-[14px] leading-relaxed text-ink-2">{place.storyImpact}</p>
        </section>

        <div className="flex flex-wrap gap-1.5">
          {place.tags.map((t) => (
            <span key={t} className="label border hairline px-2 py-1 text-[9.5px] text-ink-2">
              {t}
            </span>
          ))}
        </div>

        {place.sourceLabel && (
          <p className="label flex items-center gap-2 text-mute">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink" /> Source — {place.sourceLabel}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => toggleSave(place.id)} className={`btn ${entry?.saved ? "btn-solid" : ""}`}>
            {entry?.saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={() => checkIn(place.id)}
            className={`btn ${entry?.checkedInAt ? "border-accent bg-accent text-white hover:bg-accent" : ""}`}
          >
            {entry?.checkedInAt ? "Here ✓" : "Check in"}
          </button>
          <button onClick={() => setEditing((e) => !e)} className="btn">
            {entry?.note ? "Edit note" : "Note"}
          </button>
        </div>

        {editing && (
          <div className="sheet-in flex flex-col gap-3 border hairline p-4">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What did it feel like to stand here?"
              rows={4}
              className="display w-full resize-none bg-transparent text-[18px] italic outline-none placeholder:text-mute"
            />
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(mood === m ? undefined : m)}
                  className={`label border px-2 py-1 text-[9.5px] ${
                    mood === m ? "border-ink bg-ink text-paper" : "hairline text-ink-2"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              className="btn btn-solid self-end"
              onClick={() => {
                setNote(place.id, draft.trim(), mood);
                setEditing(false);
              }}
            >
              Keep in journal
            </button>
          </div>
        )}
        {!editing && entry?.note && (
          <blockquote className="border-l-2 border-accent pl-4">
            <p className="display text-[18px] italic">{entry.note}</p>
            {entry.mood && <p className="label mt-2 text-mute">Mood — {entry.mood}</p>}
          </blockquote>
        )}

        {onStep && route && (
          <div className="mt-auto flex justify-between border-t hairline pt-4">
            <button className="label link-underline" onClick={() => onStep(-1)}>
              ← Previous stop
            </button>
            <button className="label link-underline" onClick={() => onStep(1)}>
              Next stop →
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
