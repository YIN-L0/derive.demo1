import type { Site } from "@/data/types";
import { distanceM } from "./geo";

/**
 * Straight-line length of a walk through its sites, in story order. Consecutive
 * stories at the same site add nothing. Real streets add roughly 20–30 %.
 */
export function walkLength(sites: Site[]) {
  let total = 0;
  for (let i = 1; i < sites.length; i++) total += distanceM([sites[i - 1].lat, sites[i - 1].lng], [sites[i].lat, sites[i].lng]);
  return total;
}
