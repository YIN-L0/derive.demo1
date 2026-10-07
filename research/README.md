# Dérive — cultural-place research database

A source-backed, normalized database of the places connected to cultural works. It sits outside the product (`web/`) and is meant to be imported into it later. Nothing here is read by the app.

First batch (researched 2026-10-07): *Of Human Bondage*, *The Razor's Edge*, *Good Morning, Midnight*, *Tropic of Cancer*, *L'Éducation sentimentale*.

## Rules

1. Every factual statement is a **claim** with at least one **evidence** record pointing at an external **source**. Text written by a language model is never a source.
2. Confidence is recorded per claim, never per place.
3. A physical place exists once. Works attach to it through relationships.
4. Each relationship has exactly one type. "Named in the novel" and "the author lived here" are two records even when the place is the same.
5. Unknown, probable and conflicting are valid final answers. Sources that disagree get a conflict record; nobody silently picks one.
6. Quotations are short and exact. Every primary-text quotation in this batch was checked by script as an exact substring of the source text file before it was accepted (122 of them).

## Layout

| Path | What it holds |
|---|---|
| `sources/source_registry.json` | Every source consulted or inventoried: tier, licence, formats, whether it can be automated, whether it was actually used |
| `sources/source_inventory_by_work.csv` | The same, one row per work and source |
| `normalized/` | **The canonical database**: `works`, `creators`, `places`, `relationships`, `claims`, `evidence`, `routes` (JSON, with CSV mirrors) |
| `normalized/crosswalk_derive_sites.csv` | Places that already exist in the product, by its site id |
| `conflicts/conflicts.json` | Disagreements between sources, with each position and the open questions |
| `conflicts/review_queue.csv` | Everything a person should look at: unresolved, single-source, gaps, candidates not yet promoted |
| `verified/` | Subset whose status is `verified` |
| `exports/derive_atlas_export.csv` | One row per work and place in the product workbook's 23 columns |
| `exports/derive_atlas_export_extended.csv` | The same plus ids, Wikidata id, coordinate precision, review flags |
| `exports/derive_research_review.xlsx` | Workbook for reading and commenting. Not canonical |
| `exports/summary.json` | Counts per work and the list of shared places |
| `raw/` | Archived API responses (Wikidata, Nominatim, Paris open data), extractor output, public-domain texts, a snapshot of the existing atlas rows |
| `schemas/` | `entities.schema.json`, `vocabularies.json`, the product workbook's column header |
| `pipeline/` | `extract_candidates.py`, `validate.py`, `export.py` |

```bash
python3 research/pipeline/validate.py   # referential integrity, vocabularies, evidence rules
python3 research/pipeline/export.py     # rebuild exports/ and verified/
```

Both need only Python 3; `export.py` writes the Excel file if `openpyxl` is installed.

## Model

```
CREATOR ──< WORK ──< WORK_PLACE_RELATIONSHIP >── PLACE
                              │
                              └──< CLAIM ──< EVIDENCE >── SOURCE
WORK ──< ROUTE ──< stop → relationship
CLAIM >── CONFLICT
```

Relationship types: `textual_place`, `inferred_place`, `narrative_location`, `biographical_place`, `inspiration_place`, `composition_place`, `filming_location`, `adaptation_location`. Spatial roles, mention types and the rest are defined in `schemas/vocabularies.json`.

Two conventions worth knowing:

- A scene set at a named real place produces two relationships (`textual_place` and `narrative_location`) that share the same claims.
- A named venue whose real identity is not established (the "Hotel des Deux Ecoles", "Amitrano's", the "Brasserie Graf") is a `narrative_location` with status `unresolved` and its own place record without coordinates. It is not guessed onto the map.

### Status

| Status | Standard |
|---|---|
| `verified` | What a work says: read directly in a legitimately accessed text, quotation checked. Other facts: a Tier-1 institutional record states it |
| `strongly_supported` | The author's own statement; or one Tier-1/2 secondary statement; or two independent Tier-3 statements; or a structured record matched by name and context |
| `probable` | One Tier-3 source, or the researcher's inference with the reasoning written in the claim |
| `unresolved` | No adequate evidence |
| `conflicting` | Sources disagree; see the conflict record |

`verified` describes the evidence. It does not mean a person has reviewed the row: none of this batch has been.

Source tiers: 1 primary or institutional, 2 research project or open structured dataset, 3 specialist secondary, 4 discovery only. The validator rejects a claim above `unresolved` that rests only on Tier 4.

### Coordinates

Each place records where its coordinates came from and how literally to read them: `exact`, `street` (one representative point for a whole street), `zone`, `settlement`, `approximate`. Venues known only by street inherit the street's point and say so. 16 of 112 places have no coordinates because nothing sourced gives them.

## State of the data

| Work | Primary text available | Places | Verified | Strongly supported | Probable | Unresolved | Conflicting |
|---|---|---|---|---|---|---|---|
| Of Human Bondage | full (public domain, US) | 31 | 20 | 7 | 1 | 3 | 0 |
| The Razor's Edge | full, Canadian public-domain copy, not stored | 28 | 20 | 4 | 1 | 3 | 0 |
| Good Morning, Midnight | none | 6 | 1 | 1 | 2 | 2 | 0 |
| Tropic of Cancer | publisher's excerpt of the opening only | 21 | 10 | 2 | 6 | 1 | 2 |
| L'Éducation sentimentale | full, French (public domain) | 40 | 31 | 4 | 1 | 4 | 0 |

A place is counted once per work, at the weakest status among its relationships to that work.

Scope was deliberately narrow: Paris, plus the two disguised Kent towns in *Of Human Bondage*. London, Heidelberg, the Riviera, Chicago, India and Dijon's interior are untouched. See `conflicts/review_queue.csv`.

## Rights

- `raw/primary_texts/` holds only Project Gutenberg texts that are public domain in the United States. *Of Human Bondage* is still in copyright in life+70 countries until the end of 2035.
- *The Razor's Edge* was read in the Faded Page edition, which is public domain in Canada only and says not to download it where the book is in copyright. The text is not in this workspace; only short anchors are. Re-check them against a licensed edition before publishing.
- *Tropic of Cancer* anchors come from Grove Atlantic's public excerpt. The excerpt is not stored.
- Internet Archive scans of the three in-copyright novels are access-controlled. That was respected.
- Paris open data and OpenStreetMap are ODbL: attribution, and share-alike for derived databases. Wikidata is CC0. Kent Maps Online is CC BY 4.0. The Paris Atlas is a commercial site: cite, do not copy.

## Adding a work

1. Resolve identity (Wikidata, VIAF, BnF) and add the work and creator.
2. Add sources to the registry before using them, including the ones that turned out useless and why.
3. Look for an existing dataset or map first.
4. Get a legitimate primary text. Run `extract_candidates.py` with a small JSON config (file, language, heading patterns). Its output is a discovery list, not evidence.
5. Promote candidates: reuse an existing place if there is one (check `places.csv` by name and Wikidata id), otherwise create it.
6. Write claims with evidence. Resolve historic street names against `denominations-des-voies-caduques`.
7. Research biographical, composition and adaptation relationships separately from textual ones.
8. Record conflicts and open questions.
9. Run `validate.py`, then `export.py`.
