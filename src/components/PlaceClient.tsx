"use client";

import { useEffect, useState } from "react";
import type { LatLng } from "@/data/types";
import { useI18n } from "@/i18n/client";
import { fmt } from "@/i18n/dictionaries";
import { distanceM, distanceToPathM, formatDistance, walkingMinutes } from "@/lib/geo";
import { useLocation } from "@/lib/location";
import { MOODS, type Mood, useJournal } from "@/lib/store";

/** "420 m away · 5 min walk" — only when we know where the reader is, in Paris. */
export function LiveDistance({ point, paths = [] }: { point: LatLng; paths?: LatLng[][] }) {
  const { dict } = useI18n();
  const { status, fix, resume } = useLocation();
  useEffect(() => {
    resume();
  }, [resume]);
  if (status !== "live" || !fix) return null;
  const d = Math.min(distanceM(fix.position, point), ...paths.map((p) => distanceToPathM(fix.position, p)));
  return (
    <span className="label inline-flex items-center gap-2 bg-paper px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
      {fmt(dict.units.away, { d: formatDistance(d, dict.units) })} · {fmt(dict.units.minWalk, { n: walkingMinutes(d) })}
    </span>
  );
}

/** Save / I'm here / note — kept per site in the local journal. */
export function PlaceActions({ siteId }: { siteId: string }) {
  const { dict } = useI18n();
  const entry = useJournal((s) => s.entries[siteId]);
  const { toggleSave, checkIn, setNote } = useJournal();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [mood, setMood] = useState<Mood | undefined>();

  const openEditor = () => {
    setDraft(entry?.note ?? "");
    setMood(entry?.mood);
    setEditing((e) => !e);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => toggleSave(siteId)} className={`btn ${entry?.saved ? "btn-solid" : ""}`}>
          {entry?.saved ? dict.actions.saved : dict.actions.save}
        </button>
        <button
          onClick={() => checkIn(siteId)}
          className={`btn ${entry?.checkedInAt ? "border-accent bg-accent text-white hover:bg-accent hover:text-white" : ""}`}
        >
          {entry?.checkedInAt ? dict.actions.here : dict.actions.checkIn}
        </button>
        <button onClick={openEditor} className="btn">
          {entry?.note ? dict.actions.editNote : dict.actions.note}
        </button>
      </div>
      {editing && (
        <div className="sheet-in flex flex-col gap-3 border hairline p-4">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={dict.actions.placeholder}
            rows={4}
            className="display w-full resize-none bg-transparent text-[18px] italic outline-none placeholder:text-mute"
          />
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(mood === m ? undefined : m)}
                className={`label border px-2 py-1 text-[9.5px] ${mood === m ? "border-ink bg-ink text-paper" : "hairline text-ink-2"}`}
              >
                {dict.moods[m]}
              </button>
            ))}
          </div>
          <button
            className="btn btn-solid self-end"
            onClick={() => {
              setNote(siteId, draft.trim(), mood);
              setEditing(false);
            }}
          >
            {dict.actions.keep}
          </button>
        </div>
      )}
      {!editing && entry?.note && (
        <blockquote className="border-l-2 border-accent pl-4">
          <p className="display text-[18px] italic">{entry.note}</p>
          {entry.mood && <p className="label mt-2 text-mute">{dict.journal.mood} — {dict.moods[entry.mood]}</p>}
        </blockquote>
      )}
    </div>
  );
}
