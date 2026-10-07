import type { Category, LatLng, Precision, Relation, WorkId } from "@/data/types";
import { distanceM, distanceToPathM } from "./geo";

/** Places within this radius are "nearby"; beyond it we still list the closest. */
export const NEARBY_RADIUS_M = 2000;
export const PAGE_SIZE = 8;

/**
 * The compact, single-language slice of the atlas that the Nearby screen needs.
 * Built on the server so the phone never downloads the full research text.
 */
export type NearbyStory = {
  id: string;
  workId: WorkId;
  workTitle: string;
  medium: string;
  order: number;
  beat: string;
  hook: string;
  relations: Relation[];
  categories: Category[];
  path?: LatLng[];
  jump?: string;
};

export type NearbySite = {
  id: string;
  name: string;
  /** Localized "No longer exists" / "Probable location", when relevant. */
  status?: string;
  address: string;
  lat: number;
  lng: number;
  precision: Precision;
  categories: Category[];
  image?: string;
  stories: NearbyStory[];
};

export type Ranked = { site: NearbySite; distance: number };

/** Distance to a site: the pin, or anywhere along one of its route stories. */
export function siteDistance(origin: LatLng, site: NearbySite) {
  let d = distanceM(origin, [site.lat, site.lng]);
  for (const s of site.stories) if (s.path) d = Math.min(d, distanceToPathM(origin, s.path));
  return d;
}

/**
 * Every site matching the filters, sorted by real distance from `origin`.
 * No popularity, no personalisation: distance plus the user's interests.
 */
export function rankSites(sites: NearbySite[], origin: LatLng, filters: ReadonlySet<Category>): Ranked[] {
  return sites
    .filter((s) => filters.size === 0 || s.categories.some((c) => filters.has(c)))
    .map((site) => ({ site, distance: siteDistance(origin, site) }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * The visible slice of a ranking. The first page shows only what is within
 * 2 km; if nothing is, it shows the closest places instead. Each "show more"
 * adds a page, continuing past 2 km.
 */
export function visibleSlice(ranked: Ranked[], pages: number) {
  const within = ranked.filter((r) => r.distance <= NEARBY_RADIUS_M).length;
  const first = within > 0 ? Math.min(within, PAGE_SIZE) : PAGE_SIZE;
  const count = Math.min(ranked.length, first + Math.max(pages - 1, 0) * PAGE_SIZE);
  return { items: ranked.slice(0, count), within, hasMore: count < ranked.length, noneWithin: within === 0 };
}
