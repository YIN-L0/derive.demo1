import type { StyleSpecification } from "maplibre-gl";

/**
 * Base map: OpenFreeMap vector tiles (free, no API key, no usage cap),
 * recoloured from their Positron style into Dérive's paper-and-ink palette,
 * with bolder main-street names and métro / RER stations added.
 */
const BASE_STYLE = "https://tiles.openfreemap.org/styles/positron";

const PAPER = "#f4f3ef";
const INK_SOFT = "#6f6c66";

// layer id → paint overrides
const PAINT: Record<string, Record<string, unknown>> = {
  background: { "background-color": PAPER },
  park: { "fill-color": "#e8e7e0" },
  landcover_wood: { "fill-color": "#e4e3db" },
  landuse_residential: { "fill-color": "#f0efea" },
  water: { "fill-color": "#dddbd4" },
  waterway: { "line-color": "#d4d2ca" },
  building: { "fill-color": "#eae8e2", "fill-outline-color": "#dcd9d2" },
  road_area_pier: { "fill-color": PAPER },
  road_pier: { "line-color": PAPER },
  highway_path: { "line-color": "#e6e4de" },
  highway_minor: { "line-color": "#fbfaf7" },
  highway_major_casing: { "line-color": "#d8d5cd" },
  highway_major_inner: { "line-color": "#fbfaf7" },
  highway_major_subtle: { "line-color": "#dedbd4" },
  railway: { "line-color": "#d8d5cd" },
  railway_transit: { "line-color": "#d8d5cd" },
  railway_service: { "line-color": "#d8d5cd" },
  "highway-name-path": { "text-color": "#9a968e", "text-halo-color": PAPER },
  "highway-name-minor": { "text-color": INK_SOFT, "text-halo-color": PAPER, "text-halo-width": 1.2 },
  "highway-name-major": { "text-color": "#2b2a27", "text-halo-color": PAPER, "text-halo-width": 1.6 },
  waterway_line_label: { "text-color": "#9a968e", "text-halo-color": PAPER },
  water_name_point_label: { "text-color": "#8a867e", "text-halo-color": PAPER },
  water_name_line_label: { "text-color": "#8a867e", "text-halo-color": PAPER },
  label_other: { "text-color": "#55524c", "text-halo-color": PAPER },
  label_village: { "text-color": "#33312d", "text-halo-color": PAPER },
  label_town: { "text-color": "#33312d", "text-halo-color": PAPER },
  label_city: { "text-color": "#111111", "text-halo-color": PAPER },
  label_city_capital: { "text-color": "#111111", "text-halo-color": PAPER },
};

// Noise we never want on a literary walking map of Paris.
const HIDDEN = new Set([
  "highway-shield-non-us",
  "highway-shield-us-interstate",
  "road_shield_us",
  "airport",
  "aeroway-taxiway",
  "aeroway-runway-casing",
  "aeroway-area",
  "aeroway-runway",
  // Rail lines (RER B under boulevard Saint-Michel, metro, SNCF): on a walking map
  // they read as unexplained dashed bands through the Latin Quarter.
  "railway",
  "railway_dashline",
  "railway_transit",
  "railway_transit_dashline",
  "railway_service",
  "railway_service_dashline",
  "tunnel_railway_transit",
]);

// layer id → layout overrides
const LAYOUT: Record<string, Record<string, unknown>> = {
  // The avenues and boulevards you navigate by: bold, slightly larger, repeated along the street.
  "highway-name-major": {
    "text-font": ["Noto Sans Bold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 12, 11, 14, 12.5, 17, 15],
    "symbol-spacing": 220,
    "text-letter-spacing": 0.02,
  },
  "highway-name-minor": { "text-size": ["interpolate", ["linear"], ["zoom"], 14, 10.5, 17, 13] },
};
const MINZOOM: Record<string, number> = { "highway-name-minor": 14.3 };

/**
 * Métro and RER stations. The base style doesn't draw them, but the tiles carry
 * them (poi layer, class "railway"): subclass "subway" is the métro, "station"
 * is RER / mainline. Walkers orient by them, so they sit under Dérive's pins.
 */
const isStation = ["all", ["==", ["get", "class"], "railway"], ["match", ["get", "subclass"], ["subway", "station"], true, false]];
const isRer = ["==", ["get", "subclass"], "station"];
// MapLibre zoom (512 px tiles) is one less than the Leaflet zoom shown to the user.
const STATION_MINZOOM = 13.3;
const STATION_LAYERS = [
  {
    id: "derive_station_dot",
    type: "circle",
    source: "openmaptiles",
    "source-layer": "poi",
    // Same threshold as the labels: a ring without a name is just noise.
    minzoom: STATION_MINZOOM,
    filter: isStation,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], STATION_MINZOOM, 2.5, 16, 4, 18, 6],
      // RER: solid. Métro: ring.
      "circle-color": ["case", isRer, "#55524c", PAPER],
      "circle-stroke-color": "#55524c",
      "circle-stroke-width": 1.4,
    },
  },
  {
    id: "derive_station_label",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "poi",
    minzoom: STATION_MINZOOM,
    filter: isStation,
    layout: {
      "text-field": ["concat", ["case", isRer, "RER  ", "M  "], ["coalesce", ["get", "name"], ["get", "name_en"]]],
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], STATION_MINZOOM, 9.5, 16, 11.5],
      "text-anchor": "top",
      "text-offset": [0, 0.7],
      "text-max-width": 8,
      "text-letter-spacing": 0.04,
      // Show the big interchanges first when labels compete.
      "symbol-sort-key": ["+", ["get", "rank"], ["case", isRer, 0, 10]],
      "text-optional": true,
    },
    paint: { "text-color": "#55524c", "text-halo-color": PAPER, "text-halo-width": 1.4 },
  },
] as unknown as StyleSpecification["layers"];

let cached: Promise<StyleSpecification> | undefined;

export function loadDeriveStyle(): Promise<StyleSpecification> {
  cached ??= fetch(BASE_STYLE)
    .then((r) => r.json() as Promise<StyleSpecification>)
    .then((style) => ({
      ...style,
      layers: [
        ...style.layers
          .filter((l) => !HIDDEN.has(l.id))
          .map((l) => {
            let next = l;
            const paint = PAINT[l.id];
            if (paint && "paint" in next) next = { ...next, paint: { ...next.paint, ...paint } } as typeof l;
            const layout = LAYOUT[l.id];
            if (layout) next = { ...next, layout: { ...("layout" in next ? next.layout : {}), ...layout } } as typeof l;
            if (MINZOOM[l.id] !== undefined) next = { ...next, minzoom: MINZOOM[l.id] } as typeof l;
            return next;
          }),
        ...STATION_LAYERS,
      ],
    }));
  return cached;
}
