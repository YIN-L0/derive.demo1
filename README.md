# Dérive — Context-aware Experiences → Location → Dynamic Content

A full-stack, context-aware system for spatial experiences. Location, map state, and user context together retrieve and present dynamic narrative content — stories, places, and media that change with where you are, not a static list on a map.

Content is treated as structured, sourced material: places, works, and stories connected by typed relations, with provenance and confidence attached. That structure is what lets the interface adapt to context without losing track of what is fact, what is interpretation, and what is uncertain.

What this system explores:
- Context-aware retrieval: how location, distance, and exploration history together decide which content is relevant right now.
- Multimodal spatial content: how text, images, and place-based narrative can be combined into an experience that feels situated, not just listed.
- Full-stack spatial UI: how map, list, and detail views stay consistent with each other as the user moves, filters, and explores.

Why this is hard: a map can show everything and still mean nothing. The work here is about relevance under movement — surfacing the right story at the right place, with the right level of confidence, at the right moment.

## Run

```bash
npm install          # also copies MapLibre's worker into public/maplibre (postinstall)
npm run dev          # http://localhost:3000
npm run build && npm start
```

Deploys to Vercel as-is; no environment variables required. Optional: `NEXT_PUBLIC_MAPBOX_TOKEN` switches the base map to Mapbox.

Live location needs **https** (or localhost). On a phone, test on the Vercel URL, not a LAN IP.

## Content: the Spatial Narrative Atlas

The research dataset is the source of truth:

```
database/Derive_Spatial_Narrative_Atlas_EN_v3.xlsx
database/Derive_Spatial_Narrative_Atlas_ZH_v3.xlsx
```

After editing either workbook:

```bash
pip install openpyxl
python3 scripts/import_atlas.py      # → src/data/atlas/atlas.json
```

The importer reshapes rows; it never rewrites facts. A new row needs an id mapping in `IDS` at the top of the script (it stops and tells you if one is missing), plus an entry in each editorial file below.

| File | What it holds | Who writes it |
|---|---|---|
| `src/data/atlas/atlas.json` | EN + ZH research text, relations, confidence, sources | generated |
| `src/data/atlas/sites.ts` | physical sites: coordinates, precision, status, route paths | editorial |
| `src/data/atlas/editorial.ts` | Nearby hook sentence, uncertainty notes, "impossible walk" notes | editorial |
| `src/data/atlas/fr/*.ts` | French translation of the atlas text | editorial |
| `src/data/atlas/works.ts` | the three works, in three languages | editorial |
| `src/data/media.ts` | photographs and period artworks with credits | editorial |

### Model

- **Site**: a physical place you can walk to (one pin).
- **Work**: a film, novel or memoir.
- **Story**: one work's relationship to one site. A site can carry several (La Closerie des Lilas is named in *The Sun Also Rises* *and* is where Hemingway wrote it).

Relationships are a fixed vocabulary and never merge into a generic "location": `named-in-work`, `inferred`, `lived-or-worked`, `written-here`, `inspiration`, `recalled-in-memoir`, `narrative-setting`, `filming-location`, `stand-in`, `constructed-continuity`, `route`.

Story fields are grouped by kind: **fact** (what happened, then & now, practical), **reading** (why it matters, spatial function; labelled "Editorial reading" in the UI) and **evidence** (relation wording, chain, source tier, confidence, sources). Site `precision` (`exact` / `street` / `zone` / `route`) and `coordSource` (`atlas` / `editorial`) say how literally to read a pin.

## How Nearby works

- `src/lib/location.ts`: one `watchPosition` shared by all pages. It starts on tap, or automatically if permission was already granted. A fix more than 25 km from Paris counts as "far". In that case, and when location is off, distances are measured from the map centre (marked with a crosshair).
- Follow mode keeps the camera on you. Dragging the map pauses following (Leaflet's `dragstart` fires only for gestures), and **Recentre** resumes it.
- `src/lib/nearby.ts`: sites are sorted by straight-line distance. Route stories (the Chapter 8 night walk, the taxi down rue Mouffetard) are measured to the nearest point on their line. The first page shows only places within 2 km; if there are none, it shows the closest. "Show more" adds 8 at a time. Filters (Film / Literature / Art / Artist) are ORed.
- The map and list are built from the same ranked array; pin numbers match card numbers.

## Structure

```
src/
  proxy.ts                     locale redirect (cookie → language), old /map /routes links
  i18n/                        locales, dictionaries (EN/ZH/FR UI text), client context
  app/[lang]/
    page.tsx                   home
    nearby/                    the primary screen
    places/[site]/             editorial place page (static, 29 × 3)
    walks/, walks/[work]/      a work's story in order, with real distances and jumps
    journal/                   saves, check-ins, notes (localStorage)
    sources/                   method, source registry, credits
  components/                  MapView, NearbyExplorer, PlaceClient, …
  data/atlas/                  see table above
  data/nearbyIndex.ts          compact single-language index sent to the Nearby screen
scripts/import_atlas.py
```

## Later (Tier 2)

`src/lib/store.ts` is the only persistence layer (journal, keyed by site id). Swap its `persist()` for Supabase tables (`saves`, `check_ins`, `notes`) without touching components. Move `atlas.json` + editorial files into Postgres with the same shape when content editing needs a UI.
