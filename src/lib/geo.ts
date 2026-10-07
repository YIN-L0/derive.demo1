import type { LatLng } from "@/data/types";

export const PARIS_CENTER: LatLng = [48.8566, 2.3522];
/** Beyond this, a GPS fix is "not in Paris" and distances are taken from the map instead. */
export const PARIS_RADIUS_KM = 25;
/** Average walking pace used for minute estimates (≈ 4.8 km/h). */
export const WALK_M_PER_MIN = 80;

const R = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in metres. */
export function distanceM(a: LatLng, b: LatLng) {
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Shortest distance in metres from a point to a polyline (city-scale planar approximation). */
export function distanceToPathM(p: LatLng, path: LatLng[]) {
  if (path.length === 1) return distanceM(p, path[0]);
  const k = Math.cos(rad(p[0]));
  const xy = (q: LatLng) => [rad(q[1]) * k * R, rad(q[0]) * R] as const;
  const [px, py] = xy(p);
  let best = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, ay] = xy(path[i]);
    const [bx, by] = xy(path[i + 1]);
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return best;
}

export const walkingMinutes = (m: number) => Math.max(1, Math.round(m / WALK_M_PER_MIN));

/** "420 m" / "1.4 km" with localized units. */
export function formatDistance(m: number, units: { m: string; km: string }) {
  if (m < 950) return `${Math.max(10, Math.round(m / 10) * 10)} ${units.m}`;
  return `${(m / 1000).toFixed(m < 9950 ? 1 : 0)} ${units.km}`;
}
