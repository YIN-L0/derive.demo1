# DÉRIVE — Paris (demo)

The map that turns cities into living books, films, paintings and memories.
Tier-1 demo from `Derive_MVP_roadmap_and_Claude_prompt.docx`: landing page, map, three walks, place cards, a local journal and a community preview.

**The walks**

| # | Walk | Work | Stops |
|---|------|------|-------|
| 01 | Before Sunset | Richard Linklater, 2004 (film) | 8 real filming locations, in the order they appear in the film |
| 02 | A Moveable Feast | Ernest Hemingway, 1964 (memoir) | 9 addresses from his 1920s Paris |
| 03 | The Sun Also Rises | Ernest Hemingway, 1926 (novel) | 8 settings from the Paris chapters, in chapter order |

23 places in total. Every summary is original writing, and the sources are listed on `/credits`.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Requires Node 20+.

## Deploy (Vercel)

```bash
npx vercel           # or import the repo at vercel.com/new, framework: Next.js
```

No environment variables are required. Optional:

| Variable | Effect |
|----------|--------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Use Mapbox `light-v11` tiles instead of the default base map |

The default base map is [OpenFreeMap](https://openfreemap.org) vector tiles (free, no key, no usage cap), recoloured into the site palette in `src/lib/mapStyle.ts`. If OpenFreeMap is unreachable, the map falls back to OpenStreetMap raster tiles.

## Structure

```
src/
  app/
    page.tsx               landing
    map/                   map explorer (?route=…&place=…)
    routes/, routes/[id]/  walk index + detail (statically generated)
    journal/               check-ins, saves, notes (localStorage)
    community/             preview, clearly labelled as sample content
    credits/               research sources + photo licences
  components/
    MapView.tsx            Leaflet map (client only), pins, route line
    MapExplorer.tsx        route picker, filters, near-me, stop list
    PlaceCard.tsx          place detail: scene, why it matters, Save / Check in / Note
    Photo.tsx              monochrome photo, or a typographic plate if no image exists
  data/
    types.ts               Place / Route model (from the brief)
    places.ts, routes.ts   seed content
    credits.json           Wikimedia Commons author + licence per image
  lib/store.ts             zustand + persist → localStorage
public/img/                photos, named by place id
```

**Adding a place:** add it to `data/places.ts`, reference it from a route in `data/routes.ts`, and optionally drop `public/img/<id>.jpg` with a matching entry in `credits.json`.

## Design

- Paper `#f4f3ef`, ink `#111`, one accent (sunset rust `#a8432a`) reserved for story beats and check-ins.
- Bodoni Moda for display type. Inter Tight for the small, tracked, uppercase UI text.
- Photos are grayscale at rest and turn to colour on hover or when a place is opened. The map is a custom vector style (`src/lib/mapStyle.ts`) using the same paper and ink colours.

## Tier 2: adding Supabase

1. **Store:** `src/lib/store.ts` is the only persistence layer. Keep the same actions (`toggleSave`, `checkIn`, `setNote`, `remove`) and implement them against Supabase tables: `saves`, `check_ins`, `notes (place_id, user_id, body, mood)`. Components don't need to change.
2. **Content:** move `places` / `routes` into Postgres tables with the same shape as `data/types.ts` (`route_stops` as a join table with `order` and `narrative_beat`). Fetch them in the server components (`routes/[id]/page.tsx` already runs on the server).
3. **Auth:** add Supabase Auth and replace the "Kept on this device" journal with a per-user journal. Import localStorage entries on first sign-in.
4. **Submissions:** `/community` already has the review UI shape (status, confidence, sources per stop) for the contributor + admin-review flow.
