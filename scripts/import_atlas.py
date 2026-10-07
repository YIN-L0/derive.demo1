#!/usr/bin/env python3
"""
Import the Dérive Spatial Narrative Atlas (EN + ZH workbooks) into src/data/atlas/atlas.json.

The workbooks are the source of truth for the original three works. Reviewed
additions in atlas.json are preserved when those workbooks are reimported.
This script only
reshapes them: it never rewrites facts. Editorial layers that the workbook does
not contain (map coordinates for rows without them, curiosity hooks, French
translations) live in src/data/atlas/*.ts and are merged at build time.

    python3 scripts/import_atlas.py

Requires: openpyxl (pip install openpyxl)
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
EN_FILE = ROOT / "database" / "Derive_Spatial_Narrative_Atlas_EN_v3.xlsx"
ZH_FILE = ROOT / "database" / "Derive_Spatial_Narrative_Atlas_ZH_v3.xlsx"
OUT = ROOT / "src" / "data" / "atlas" / "atlas.json"

# Workbook column -> field key. Columns are read by position so the EN and ZH
# sheets (which have translated headers) line up exactly.
COLUMNS = [
    "work", "place", "address", "coordinates", "relationship", "mention", "when",
    "people", "anchor", "happened", "consequence", "spatialFunction", "why",
    "thenNow", "practical", "biography", "inspiration", "routeNode", "related",
    "evidenceChain", "sourceTier", "confidence", "sources",
]
# Fields whose ZH value is a real translation. The rest are language-neutral
# (names, addresses, quotations in the work's original language, URLs).
TRANSLATED = {
    "relationship", "mention", "when", "people", "happened", "consequence",
    "spatialFunction", "why", "thenNow", "practical", "biography", "inspiration",
    "routeNode", "related", "evidenceChain", "confidence",
}

WORKS = [
    ("Before Sunset", "before-sunset"),
    ("The Sun Also Rises", "sun-also-rises"),
    ("A Moveable Feast", "moveable-feast"),
]

# (work id, start of the workbook "Place" cell) -> (story id, site id).
# A site is a physical location; a story is one work's relationship to it.
# Two works can share a site (La Closerie des Lilas, Place de la Contrescarpe).
IDS = [
    ("before-sunset", "Shakespeare and Company", "bs-shakespeare", "shakespeare-co-bucherie"),
    ("before-sunset", "Rue Saint-Julien-le-Pauvre", "bs-saint-julien", "rue-saint-julien-le-pauvre"),
    ("before-sunset", "Rue Galande", "bs-galande", "rue-galande"),
    ("before-sunset", "Rue des Jardins-Saint-Paul", "bs-jardins-saint-paul", "rue-des-jardins-saint-paul"),
    ("before-sunset", "Rue Charlemagne", "bs-charlemagne", "rue-charlemagne"),
    ("before-sunset", "Rue Eginhard", "bs-eginhard", "rue-eginhard"),
    ("before-sunset", "Le Pure Café", "bs-pure-cafe", "le-pure-cafe"),
    ("before-sunset", "Coulée verte", "bs-coulee-verte", "coulee-verte"),
    ("before-sunset", "Quai de la Tournelle", "bs-tournelle", "quai-de-la-tournelle"),
    ("before-sunset", "Quai Henri IV", "bs-henri-iv", "quai-henri-iv"),
    ("before-sunset", "Cour de l", "bs-etoile-dor", "cour-etoile-dor"),
    ("sun-also-rises", "Café Napolitain", "sar-napolitain", "cafe-napolitain"),
    ("sun-also-rises", "Bal musette", "sar-bal-musette", "bal-musette"),
    ("sun-also-rises", "Place de la Contrescarpe →", "sar-taxi", "contrescarpe"),
    ("sun-also-rises", "Hôtel de Crillon", "sar-crillon", "hotel-de-crillon"),
    ("sun-also-rises", "La Rotonde", "sar-rotonde", "la-rotonde"),
    ("sun-also-rises", "Le Select", "sar-select", "le-select"),
    ("sun-also-rises", "Le Dôme", "sar-dome", "le-dome"),
    ("sun-also-rises", "Dingo Bar", "sar-dingo", "dingo-bar"),
    ("sun-also-rises", "La Closerie des Lilas", "sar-closerie", "closerie-des-lilas"),
    ("sun-also-rises", "Madame Lecomte", "sar-lecomte", "madame-lecomte"),
    ("sun-also-rises", "Chapter 8 night walk", "sar-night-walk", "night-walk-ch8"),
    ("moveable-feast", "Place de la Contrescarpe /", "mf-contrescarpe", "contrescarpe"),
    ("moveable-feast", "74 Rue du Cardinal Lemoine", "mf-cardinal-lemoine", "cardinal-lemoine-74"),
    ("moveable-feast", "Rue Descartes", "mf-descartes", "rue-descartes"),
    ("moveable-feast", "Shakespeare and Company", "mf-odeon", "shakespeare-co-odeon"),
    ("moveable-feast", "27 Rue de Fleurus", "mf-fleurus", "rue-de-fleurus-27"),
    ("moveable-feast", "La Closerie des Lilas", "mf-closerie", "closerie-des-lilas"),
    ("moveable-feast", "Michaud", "mf-michaud", "michauds"),
    ("moveable-feast", "113 Rue Notre-Dame-des-Champs", "mf-notre-dame-des-champs", "notre-dame-des-champs-113"),
    ("moveable-feast", "Ritz Paris", "mf-ritz", "ritz-bar-hemingway"),
]

# The workbook's free-text "Place Relationship Type" is mapped onto a fixed
# vocabulary so different kinds of link never collapse into one "location".
# The original text is kept alongside (relationshipText) for the evidence view.
RELATIONS = [
    (r"\bfilming location\b", "filming-location"),
    (r"stands in for", "stand-in"),
    (r"constructed narrative continuity", "constructed-continuity"),
    (r"\bnarrative (location|route|embarkation|transition)", "narrative-setting"),
    (r"\btextual(-recalled)? (place|route)\b", "named-in-work"),
    (r"\binferred\b|probable historical identification", "inferred"),
    (r"\bbiographical\b|literary-history|memoir-origin", "lived-or-worked"),
    (r"\bcomposition place\b", "written-here"),
    (r"\binspiration place\b", "inspiration"),
    (r"\bmemoir-recalled\b", "recalled-in-memoir"),
    (r"\b(textual route|spatial narrative entity)\b", "route"),
]

CONFIDENCE = {
    "very high": "very-high",
    "high": "high",
    "medium-high": "medium-high",
    "medium": "medium",
    "low": "low",
}


def rows(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    sheets = {}
    for ws in wb.worksheets:
        data = [
            ["" if c is None else str(c).strip() for c in r]
            for r in ws.iter_rows(values_only=True)
            if any(c not in (None, "") for c in r)
        ]
        sheets[ws.title] = data
    return list(sheets.values())


def records(sheet, title_row=True):
    data = sheet[1:] if title_row else sheet
    return data[0], data[1:]


def work_id(cell):
    for prefix, wid in WORKS:
        if cell.startswith(prefix):
            return wid
    sys.exit(f"Unknown work: {cell!r}")


def ids_for(wid, place):
    for w, prefix, story, site in IDS:
        if w == wid and place.startswith(prefix):
            return story, site
    sys.exit(f"No id mapping for {wid} / {place!r}. Add it to IDS in {__file__}.")


def node(text):
    """'4 — First impossible geographic jump' -> (4, 'First impossible geographic jump')."""
    m = re.match(r"\s*(\d+)\s*[—–-]\s*(.*)", text)
    return (int(m.group(1)), m.group(2).strip()) if m else (None, text)


def coordinates(text):
    m = re.search(r"(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)", text)
    if not m:
        return None
    return {"lat": float(m.group(1)), "lng": float(m.group(2)), "approximate": "approx" in text.lower()}


def main():
    en_sheets, zh_sheets = rows(EN_FILE), rows(ZH_FILE)
    _, en_rows = records(en_sheets[0])
    _, zh_rows = records(zh_sheets[0])
    if len(en_rows) != len(zh_rows):
        sys.exit(f"EN has {len(en_rows)} rows but ZH has {len(zh_rows)}")

    stories, seen = [], set()
    for en, zh in zip(en_rows, zh_rows):
        e = dict(zip(COLUMNS, en))
        z = dict(zip(COLUMNS, zh))
        wid = work_id(e["work"])
        story_id, site_id = ids_for(wid, e["place"])
        if story_id in seen:
            sys.exit(f"Duplicate story id {story_id}")
        seen.add(story_id)

        order, node_en = node(e["routeNode"])
        _, node_zh = node(z["routeNode"])
        rel_text = e["relationship"].lower()
        relations = []
        for pattern, rel in RELATIONS:
            if re.search(pattern, rel_text) and rel not in relations:
                relations.append(rel)

        text = {}
        for key in TRANSLATED:
            zh_value = z[key]
            # Some ZH cells were left in English (e.g. route-node titles); keep them
            # empty so the app falls back explicitly instead of showing English as Chinese.
            if key not in ("people", "related") and zh_value and not re.search(r"[一-鿿]", zh_value):
                zh_value = ""
            text[key] = {"en": e[key], "zh": zh_value}
        text["routeNode"] = {"en": node_en, "zh": node_zh if re.search(r"[一-鿿]", node_zh) else ""}

        stories.append({
            "id": story_id,
            "siteId": site_id,
            "workId": wid,
            "order": order,
            "place": e["place"],
            "address": e["address"],
            "atlasCoordinates": coordinates(e["coordinates"]),
            "relations": relations,
            "confidence": CONFIDENCE.get(e["confidence"].lower(), e["confidence"]),
            "sourceTier": e["sourceTier"],
            "anchor": e["anchor"],
            "sources": [s.strip() for s in re.split(r"\s+;\s+|\s*\n\s*", e["sources"]) if s.strip().startswith("http")],
            "text": text,
        })

    # Supporting sheets, kept for the method/credits page.
    def table(en_sheet, zh_sheet):
        hdr, body = en_sheet[0], en_sheet[1:]
        zbody = zh_sheet[1:]
        return [
            {h: {"en": a, "zh": b} for h, a, b in zip(hdr, er, zr)}
            for er, zr in zip(body, zbody)
        ]

    out = {
        "source": {"en": EN_FILE.name, "zh": ZH_FILE.name},
        "stories": stories,
        "ontology": table(en_sheets[1], zh_sheets[1]),
        "sourceRegistry": table(en_sheets[3], zh_sheets[3]),
    }
    # The original workbooks do not contain the independently reviewed books.
    # Refresh their own rows without deleting additions from the product atlas.
    if OUT.exists():
        previous = json.loads(OUT.read_text(encoding="utf-8"))
        workbook_work_ids = {story["workId"] for story in stories}
        additions = [story for story in previous["stories"] if story["workId"] not in workbook_work_ids]
        for story in additions:
            if story["id"] in seen:
                sys.exit(f"Duplicate preserved story id {story['id']}")
            seen.add(story["id"])
        out["stories"].extend(additions)
        for row in previous["sourceRegistry"]:
            if row not in out["sourceRegistry"]:
                out["sourceRegistry"].append(row)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"Wrote {len(stories)} stories to {OUT.relative_to(ROOT)}")
    for s in stories:
        print(f"  {s['id']:26} {s['order']!s:>3}  {s['confidence']:12} {', '.join(s['relations'])}")


if __name__ == "__main__":
    main()
