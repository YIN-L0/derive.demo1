"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap } from "react-leaflet";
import type { Place, Route } from "@/data/types";
import { placeById } from "@/data/places";
import { loadDeriveStyle } from "@/lib/mapStyle";
import { PARIS_CENTER } from "./paris";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Props = {
  places: Place[];
  route?: Route;
  selectedId?: string;
  visited: Set<string>;
  userPos?: [number, number];
  onSelect: (id: string) => void;
  interactive?: boolean;
};

function pinIcon(label: string | undefined, state: { active: boolean; visited: boolean; muted: boolean }) {
  if (!label) {
    // Places outside the active route: a quiet dot, not a numbered stop.
    const dot = ["pin-dot", state.active && "is-active", state.visited && "is-visited", state.muted && "pin-muted"]
      .filter(Boolean)
      .join(" ");
    return L.divIcon({ className: "", html: `<div class="${dot}"></div>`, iconSize: [13, 13], iconAnchor: [6.5, 6.5] });
  }
  const cls = ["pin", state.active && "is-active", state.visited && "is-visited", state.muted && "pin-muted"]
    .filter(Boolean)
    .join(" ");
  return L.divIcon({
    className: "",
    html: `<div class="${cls}">${label}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// The bundler doesn't ship MapLibre's worker; `postinstall` copies it into /public.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const OSM_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

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

const meIcon = L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });

function Camera({ route, selected, userPos, places }: { route?: Route; selected?: Place; userPos?: [number, number]; places: Place[] }) {
  const map = useMap();

  useEffect(() => {
    const pts = (route ? route.stops.map((s) => placeById(s.placeId)!) : places).map(
      (p) => [p.lat, p.lng] as [number, number],
    );
    if (pts.length) map.flyToBounds(L.latLngBounds(pts), { padding: [60, 60], duration: 0.9, maxZoom: 15 });
    // Re-frame only when the route or filter set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.id, places.length, map]);

  useEffect(() => {
    map.invalidateSize();
    if (selected) map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 15), { duration: 0.7 });
  }, [selected, map]);

  useEffect(() => {
    if (userPos) map.flyTo(userPos, 15, { duration: 0.9 });
  }, [userPos, map]);

  return null;
}

export default function MapView({ places, route, selectedId, visited, userPos, onSelect, interactive = true }: Props) {
  const line = useMemo(
    () => route?.stops.map((s) => placeById(s.placeId)!).map((p) => [p.lat, p.lng] as [number, number]),
    [route],
  );
  const selected = places.find((p) => p.id === selectedId);

  return (
    <MapContainer
      center={PARIS_CENTER}
      zoom={14}
      zoomControl={false}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      attributionControl
      className="h-full w-full"
    >
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
      {interactive && <ZoomControl position="bottomright" />}

      {line && (
        <Polyline positions={line} pathOptions={{ color: "#111", weight: 1.25, dashArray: "2 6", lineCap: "square" }} />
      )}

      {places.map((p) => {
        const order = route?.stops.find((s) => s.placeId === p.id)?.order;
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pinIcon(order ? String(order).padStart(2, "0") : undefined, {
              active: p.id === selectedId,
              visited: visited.has(p.id),
              muted: !!route && !order,
            })}
            zIndexOffset={p.id === selectedId ? 1000 : order ? 500 : 0}
            eventHandlers={{ click: () => onSelect(p.id) }}
            title={p.title}
          />
        );
      })}

      {userPos && <Marker position={userPos} icon={meIcon} />}

      {interactive && <Camera route={route} selected={selected} userPos={userPos} places={places} />}
    </MapContainer>
  );
}
