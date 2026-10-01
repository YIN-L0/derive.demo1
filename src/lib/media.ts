import credits from "@/data/credits.json";
import artworks from "@/data/artworks.json";

type Credit = { author: string; license: string; source: string };
const table = credits as Record<string, Credit>;

export const imageFor = (id: string): string | undefined =>
  table[id] ? `/img/${id}.jpg` : undefined;

export const creditFor = (id: string): Credit | undefined => table[id];

export const allCredits = Object.entries(table);


export type Artwork = {
  image: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  note: string;
  license: string;
  source: string;
  width: number;
  height: number;
};
const art = artworks as Record<string, Artwork>;

/** Public-domain painting or period photograph paired with a place. */
export const artworkFor = (placeId: string): Artwork | undefined => art[placeId];

export const allArtworks = Object.entries(art);

/** Route covers: literary walks lead with an artwork, the film walk with a photograph. */
const COVER_ART: Record<string, string> = {
  "moveable-feast": "mf-saint-michel",
  "sun-also-rises": "sr-lecomte",
};
export const coverArtFor = (routeId: string): Artwork | undefined => art[COVER_ART[routeId]];
