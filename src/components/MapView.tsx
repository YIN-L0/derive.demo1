"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Circle, MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import type { LatLng } from "@/data/types";
import { PARIS_CENTER } from "@/lib/geo";
import { loadDeriveStyle } from "@/lib/mapStyle";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// The bundler doesn't ship MapLibre's worker; `postinstall` copies it into /public.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const OSM_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  /** Number shown on the pin; matches the card number in the list. */
  rank?: number;
  visited?: boolean;
  /** Filtered-in but outside the visible list. */
  dim?: boolean;
};

/** `siteId` makes a route line tappable: tapping it selects its place. */
export type MapLine = { id: string; siteId?: string; points: LatLng[]; kind: "route" | "sequence" | "jump" };

/** Ask the camera to frame these points. A new `nonce` triggers a move even for the same points. */
export type CameraRequest = { points: LatLng[]; nonce: number; maxZoom?: number };

type Props = {
  pins: MapPin[];
  lines?: MapLine[];
  selectedId?: string;
  onSelect: (id: string) => void;
  user?: { position: LatLng; accuracy: number };
  /** While true, the camera stays on the user as they walk. */
  following: boolean;
  /** Called when the user drags the map themselves — the caller should stop following. */
  onUserPan: () => void;
  onCenterChange?: (center: LatLng) => void;
  camera?: CameraRequest;
};

/** Vector base map in Dérive's palette; falls back to OSM raster if OpenFreeMap is unreachable. */
function DeriveBaseMap() {
  const map = useMap();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let layer: L.Layer | undefined;
    let cancelled = false;
    loadDeriveStyle()
      .then((style) => {
        if (cancelled) return;
        layer = maplibreGL({ style, attributionControl: false });
        layer.getAttribution = () => `© <a href="https://openfreemap.org">OpenFreeMap</a> ${OSM_ATTRIBUTION}`;
        layer.addTo(map);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      layer?.remove();
    };
  }, [map]);

  return failed ? (
    <TileLayer className="map-tiles" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} attribution={OSM_ATTRIBUTION} />
  ) : null;
}

function pinIcon(p: MapPin, active: boolean) {
  if (p.rank === undefined) {
    const cls = ["pin-dot", active && "is-active", p.visited && "is-visited", p.dim && !active && "pin-muted"].filter(Boolean).join(" ");
    return L.divIcon({ className: "", html: `<div class="${cls}"></div>`, iconSize: [13, 13], iconAnchor: [6.5, 6.5] });
  }
  const cls = ["pin-rank", active && "is-active", p.visited && "is-visited"].filter(Boolean).join(" ");
  return L.divIcon({ className: "", html: `<div class="${cls}">${p.rank}</div>`, iconSize: [24, 24], iconAnchor: [12, 12] });
}

const meIcon = L.divIcon({
  className: "",
  html: '<div style="position:relative"><span class="me-pulse"></span><div class="me-dot"></div></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const LINE_STYLE: Record<MapLine["kind"], L.PathOptions> = {
  route: { color: "#111", weight: 3, dashArray: "2 7", lineCap: "round" },
  sequence: { color: "#111", weight: 1.25, opacity: 0.7 },
  jump: { color: "#a8432a", weight: 1.5, dashArray: "1 7", lineCap: "round" },
};

function Controller({ user, following, onUserPan, onCenterChange, camera }: Pick<Props, "user" | "following" | "onUserPan" | "onCenterChange" | "camera">) {
  const map = useMap();
  const wasFollowing = useRef(false);

  useMapEvents({
    // `dragstart` only fires for gestures, never for programmatic moves, so this is a reliable "the user took over".
    dragstart: () => onUserPan(),
    moveend: () => {
      const c = map.getCenter();
      onCenterChange?.([c.lat, c.lng]);
    },
  });

  // Keep Leaflet's size in sync when the layout around it changes (sheet, rotation, keyboard).
  useEffect(() => {
    const el = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);

  // Follow mode: jump to the user when it starts, then glide with each new fix.
  useEffect(() => {
    if (!following || !user) {
      wasFollowing.current = following && !!user;
      return;
    }
    if (!wasFollowing.current) map.flyTo(user.position, Math.max(map.getZoom(), 16), { duration: 0.8 });
    else map.panTo(user.position, { animate: true, duration: 0.6 });
    wasFollowing.current = true;
  }, [following, user, map]);

  useEffect(() => {
    if (!camera || !camera.points.length) return;
    if (camera.points.length === 1) map.flyTo(camera.points[0], Math.max(map.getZoom(), camera.maxZoom ?? 16), { duration: 0.7 });
    else map.flyToBounds(L.latLngBounds(camera.points), { padding: [48, 48], maxZoom: camera.maxZoom ?? 16, duration: 0.8 });
  }, [camera, map]);

  return null;
}

export default function MapView({ pins, lines = [], selectedId, onSelect, user, following, onUserPan, onCenterChange, camera }: Props) {
  return (
    <MapContainer center={PARIS_CENTER} zoom={13} zoomControl={false} attributionControl className="h-full w-full">
      {MAPBOX_TOKEN ? (
        <TileLayer
          className="map-tiles"
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
          tileSize={512}
          zoomOffset={-1}
          attribution={`© <a href="https://www.mapbox.com/">Mapbox</a> ${OSM_ATTRIBUTION}`}
        />
      ) : (
        <DeriveBaseMap />
      )}
      <ZoomControl position="bottomright" />

      {lines.map((l) => (
        <Polyline
          key={l.id}
          positions={l.points}
          pathOptions={{ ...LINE_STYLE[l.kind], interactive: !!l.siteId }}
          eventHandlers={l.siteId ? { click: () => onSelect(l.siteId!) } : undefined}
        />
      ))}

      {pins.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(p, p.id === selectedId)}
          zIndexOffset={p.id === selectedId ? 1000 : p.rank !== undefined ? 500 - p.rank : 0}
          eventHandlers={{ click: () => onSelect(p.id) }}
          title={p.title}
          keyboard
        />
      ))}

      {user && (
        <>
          {user.accuracy < 400 && (
            <Circle
              center={user.position}
              radius={user.accuracy}
              pathOptions={{ color: "#2563eb", weight: 1, opacity: 0.35, fillColor: "#2563eb", fillOpacity: 0.08 }}
              interactive={false}
            />
          )}
          <Marker position={user.position} icon={meIcon} zIndexOffset={2000} interactive={false} />
        </>
      )}

      <Controller user={user} following={following} onUserPan={onUserPan} onCenterChange={onCenterChange} camera={camera} />
    </MapContainer>
  );
}
