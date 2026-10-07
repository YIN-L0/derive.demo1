import type { StyleSpecification } from "maplibre-gl";

/**
 * Base map: OpenFreeMap vector tiles (free, no API key, no usage cap),
 * recoloured from their Positron style into Dérive's paper-and-ink palette.
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
  "highway-name-minor": { "text-color": INK_SOFT, "text-halo-color": PAPER },
  "highway-name-major": { "text-color": INK_SOFT, "text-halo-color": PAPER },
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

let cached: Promise<StyleSpecification> | undefined;

export function loadDeriveStyle(): Promise<StyleSpecification> {
  cached ??= fetch(BASE_STYLE)
    .then((r) => r.json() as Promise<StyleSpecification>)
    .then((style) => ({
      ...style,
      layers: style.layers
        .filter((l) => !HIDDEN.has(l.id))
        .map((l) => {
          const paint = PAINT[l.id];
          return paint && "paint" in l ? ({ ...l, paint: { ...l.paint, ...paint } } as typeof l) : l;
        }),
    }));
  return cached;
}
