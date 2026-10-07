# Reviewed integration — 7 October 2026

The existing product model is unchanged: `Work` metadata in `works.ts`, physical
`Site` entities in `sites.ts`, and ordered work–site `Story` records in
`atlas.json`. `index.ts` assembles those records with `editorial.ts` and optional
French translations. Several stories can share one site and one map pin.
Coordinates and their precision belong to the site. A story carries relations,
confidence, source URLs, and any uncertainty. Work sequences drive existing
walk pages; only separately sourced `paths` provide route geometry.

## Additions

| Work | Product ID | New stories |
| --- | --- | ---: |
| Of Human Bondage | `of-human-bondage` | 20 |
| The Razor's Edge | `razors-edge` | 10 |
| Good Morning, Midnight | `good-morning-midnight` | 2 |
| Tropic of Cancer | `tropic-of-cancer` | 9 |
| Sentimental Education | `education-sentimentale` | 25 |

66 stories, 52 new sites, and five reused production sites:
`closerie-des-lilas`, `le-dome`, `le-select`, `quai-de-la-tournelle`, and
`ritz-bar-hemingway`. Original IDs, site coordinates, stories, editorial entries,
and translations are preserved. The original story payload is protected by a
canonical SHA-256 comparison in the validator.

The research crosswalk's `contains` matches are not identities. Rue de Fleurus
is distinct from Stein's number 27, and boulevard des Capucines is distinct from
Café Napolitain. The Ritz story explicitly says that the hotel pin does not
identify the novel's historical bar with today's Bar Hemingway.

## Evidence and scope

Fresh copies of [Of Human Bondage](https://www.gutenberg.org/ebooks/351),
[Flaubert volume 1](https://www.gutenberg.org/ebooks/49773), and
[Flaubert volume 2](https://www.gutenberg.org/ebooks/52893) were checked independently
of the research's `verified` labels. Imported primary anchors matched after
whitespace/typographic normalization; chapter headings were also checked.
The import uses no primary quotations and no edition-dependent page numbers.

Selected passages were independently read in
[The Razor's Edge](https://www.fadedpage.com/books/20171032/html.php) and
[Grove Atlantic's authorized Tropic of Cancer excerpt](https://groveatlantic.com/book/tropic-of-cancer/).
The latter supplies opening-section stops only. It does not substantiate a
later scene or a composition address.

[University of Victoria's scholarly reading](https://maker.uvic.ca/rhys/)
supports two Rhys areas, Boulevard du Montparnasse and the Latin Quarter.
Both remain **probable**, with visible caveats, `inferred` relations, medium
product confidence, and no claimed primary chapter or precise venue.
The [Athens university hotel study](https://hotems.enl.uoa.gr/jean-rhyss-hotels-of-flux-and-comfort/)
supports the anonymity of Sasha's hotel, not a mappable address.

Every new site's supplied coordinates matched its named entity in a freshly
queried [Wikidata](https://www.wikidata.org/) response. Coordinates were copied,
not invented. Broad sites are marked `zone`; streets are representative points.
Existing shared-site coordinates take precedence over the research's points.
The audit includes entity IDs, source URLs, coordinates and response hashes.

Historical street mappings were checked against the City's archived
[former street-name records](https://opendata.paris.fr/explore/dataset/denominations-des-voies-caduques/).
Rue de Laval maps to rue Victor-Massé, and Paradis-Poissonnière to rue de Paradis;
modern doorway numbers are not inferred. Quai Napoléon covered today's quai aux
Fleurs **and quai de la Corse**. Its point is representative and does not locate
Frédéric's rooms. The Arnoux address “24 bis” is retained at street precision;
the number 13 commemorative plaque is not substituted.

These are curated reading itineraries. Partial routes and motorized journeys
in the research are not converted into invented walking polylines. New prose
uses the project's existing English fallback where translations are missing.
Existing credited site images are reused as illustrations; the Rhys cover
does not assert a Le Select scene.

## Deferred records

The complete relationship-by-relationship decision list is in
[web-integration.json](./web-integration.json). `covered` means that parallel
named-place evidence is already represented by one accepted story; it does not
automatically endorse additional scene claims. `defer` records retain their
research data and have a separate, conservative publication-review status.

Unlocated hotels, Amitrano's, Café de Versailles, American Express's historical
office, Brasserie Graf, the Pig and Lily, and unresolved Flaubert venues are
not pinned. Gravier's/Le Chat Blanc, Château de Madrid, the Bibliothèque
Nationale identification, modern academy/museum premises, and other historical
venue identifications need further checking. Rue Saint-Hyacinthe is not simply
equated with today's surviving rue Malebranche fragment.

Miller's Villa Borghese identification, writing/completion claims at Villa
Seurat and Clichy, Hôtel Central, and the Dijon chronology are not imported.
Conflicts remain open. Unchecked biographical claims and places outside the
existing Paris walking scope are deferred. No normalized research, source,
conflict, review-queue, or original workbook records were deleted or relabelled.

## Files changed

- `web/src/data/types.ts`: extend the existing work-ID union.
- `web/src/data/atlas/works.ts`: append five work definitions.
- `web/src/data/atlas/sites.ts`: append 52 sourced physical sites.
- `web/src/data/atlas/atlas.json`: append 66 stories and source-credit rows.
- `web/src/data/atlas/editorial.ts`: append hooks and visible uncertainty.
- `web/src/data/media.ts`: map new work covers to existing credited images.
- `web/scripts/import_atlas.py`: preserve additions when reimporting original workbooks.
- `web/scripts/validate_atlas.mjs`: integrity, preservation, and rendered-page tests.
- `research/review/web-integration.json`: provenance and all import/defer decisions.
- `research/review/WEB_INTEGRATION.md`: this report.

No frontend, styling, route implementation, or `mapStyle.ts` changes.

## Validation

- Existing research validator: pass (112 places, 203 relationships, 165 claims).
- TypeScript `--noEmit`: pass.
- ESLint and `git diff --check`: pass.
- Five Node tests: pass, including rendering the actual walk component for all
  five works in all three locales, reference integrity, sequences, duplicate
  IDs, duplicate coordinates, shared entities, and original-story preservation.
- Workbook reimport to a temporary output: complete atlas is unchanged.
- Production build using Node 22 and `next build --webpack`: pass, 285 pages.
- All 15 generated production HTML walk pages contain every expected stop and
  their map links. These are HTML/component checks, not a browser visual audit.

The default shell's Node 18 is too old for the installed Next version. The
default Turbopack build also fails because its CSS worker cannot bind a port
in this execution environment, including after escalation. Validation used the
installed Node 22 and webpack without changing package scripts or configuration.

Run the new checks with:

```sh
cd web
node --test scripts/validate_atlas.mjs
```
