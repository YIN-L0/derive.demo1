import credits from "@/data/credits.json";

type Credit = { author: string; license: string; source: string };
const table = credits as Record<string, Credit>;

export const imageFor = (id: string): string | undefined =>
  table[id] ? `/img/${id}.jpg` : undefined;

export const creditFor = (id: string): Credit | undefined => table[id];

export const allCredits = Object.entries(table);
