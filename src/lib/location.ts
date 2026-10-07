"use client";

import { create } from "zustand";
import type { LatLng } from "@/data/types";
import { PARIS_CENTER, PARIS_RADIUS_KM, distanceM } from "./geo";

/**
 * Live location, shared by every page so the watch survives client navigation.
 *
 * idle        — not started (we only ask after a tap, or if permission was already granted)
 * locating    — waiting for the first fix
 * live        — following the user in Paris
 * far         — we have a fix, but it's outside Paris; distances use the map centre
 * denied      — the user or browser refused permission
 * unavailable — no fix (indoors, timeout, no signal); the watch keeps trying
 * unsupported — no Geolocation API, or not a secure (https) context
 */
export type LocationStatus = "idle" | "locating" | "live" | "far" | "denied" | "unavailable" | "unsupported";

type Fix = { position: LatLng; accuracy: number; at: number };

type LocationState = {
  status: LocationStatus;
  fix?: Fix;
  /** Distance from central Paris in km, when status is "far". */
  farKm?: number;
  start: () => void;
  stop: () => void;
  /** Start without prompting if the user already granted permission. */
  resume: () => Promise<void>;
};

const PREF_KEY = "derive.location.enabled";
const remember = (on: boolean) => {
  try {
    if (on) localStorage.setItem(PREF_KEY, "1");
    else localStorage.removeItem(PREF_KEY);
  } catch {}
};
const remembered = () => {
  try {
    return localStorage.getItem(PREF_KEY) === "1";
  } catch {
    return false;
  }
};

let watchId: number | null = null;

export const useLocation = create<LocationState>((set, get) => ({
  status: "idle",

  start: () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator) || !window.isSecureContext) {
      set({ status: "unsupported" });
      return;
    }
    if (watchId !== null) return;
    set({ status: get().fix ? get().status : "locating" });
    remember(true);
    watchId = navigator.geolocation.watchPosition(
      (p) => {
        const position: LatLng = [p.coords.latitude, p.coords.longitude];
        const km = distanceM(position, PARIS_CENTER) / 1000;
        set({
          fix: { position, accuracy: p.coords.accuracy, at: p.timestamp },
          status: km > PARIS_RADIUS_KM ? "far" : "live",
          farKm: km > PARIS_RADIUS_KM ? km : undefined,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          remember(false);
          get().stop();
          set({ status: "denied", fix: undefined });
        } else if (!get().fix) {
          // Timeouts and lost signal: keep watching, but tell the user.
          set({ status: "unavailable" });
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
  },

  stop: () => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
  },

  resume: async () => {
    if (watchId !== null || typeof navigator === "undefined") return;
    try {
      const perm = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
      if (perm?.state === "granted") return get().start();
      if (perm?.state === "denied") return set({ status: "denied" });
    } catch {
      // Safari < 16 has no Permissions API for geolocation.
    }
    if (remembered()) get().start();
  },
}));

/** The position distances should be measured from right now, if it is the user's. */
export const liveOrigin = (s: Pick<LocationState, "status" | "fix">): LatLng | undefined =>
  s.status === "live" ? s.fix?.position : undefined;
