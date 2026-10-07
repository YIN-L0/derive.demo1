"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MOODS = ["Tender", "Restless", "Luminous", "Melancholy", "Awake"] as const;
export type Mood = (typeof MOODS)[number];

export type Entry = {
  placeId: string; // site id
  saved: boolean;
  checkedInAt?: string;
  note?: string;
  mood?: Mood;
  updatedAt: string;
};

type JournalState = {
  entries: Record<string, Entry>;
  toggleSave: (placeId: string) => void;
  checkIn: (placeId: string) => void;
  setNote: (placeId: string, note: string, mood?: Mood) => void;
  remove: (placeId: string) => void;
};

const now = () => new Date().toISOString();

const upsert = (
  entries: Record<string, Entry>,
  placeId: string,
  patch: Partial<Entry>,
): Record<string, Entry> => ({
  ...entries,
  [placeId]: {
    ...entries[placeId],
    ...patch,
    saved: patch.saved ?? entries[placeId]?.saved ?? false,
    placeId,
    updatedAt: now(),
  },
});

// Entries are keyed by site id. Tier 2: replace this persist() layer with Supabase tables (check_ins, notes, saves).
export const useJournal = create<JournalState>()(
  persist(
    (set) => ({
      entries: {},
      toggleSave: (id) =>
        set((s) => ({ entries: upsert(s.entries, id, { saved: !s.entries[id]?.saved }) })),
      checkIn: (id) =>
        set((s) => ({
          entries: upsert(s.entries, id, {
            checkedInAt: s.entries[id]?.checkedInAt ?? now(),
          }),
        })),
      setNote: (id, note, mood) =>
        set((s) => ({ entries: upsert(s.entries, id, { note, mood }) })),
      remove: (id) =>
        set((s) => {
          const next = { ...s.entries };
          delete next[id];
          return { entries: next };
        }),
    }),
    { name: "derive.journal.v2", skipHydration: true },
  ),
);
