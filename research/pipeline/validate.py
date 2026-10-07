#!/usr/bin/env python3
"""Integrity checks for the canonical research database. Exits non-zero on any error.

    python3 research/pipeline/validate.py
"""
import json, sys
from pathlib import Path

R = Path(__file__).resolve().parent.parent
J = lambda p, k: json.loads((R / p).read_text(encoding="utf-8"))[k]
V = json.loads((R / "schemas/vocabularies.json").read_text(encoding="utf-8"))

works = {w["work_id"]: w for w in J("normalized/works.json", "works")}
creators = {c["creator_id"] for c in J("normalized/creators.json", "creators")}
places = {p["place_id"]: p for p in J("normalized/places.json", "places")}
rels = J("normalized/relationships.json", "relationships")
claims = {c["claim_id"]: c for c in J("normalized/claims.json", "claims")}
evidence = {e["evidence_id"]: e for e in J("normalized/evidence.json", "evidence")}
routes = J("normalized/routes.json", "routes")
sources = {s["source_id"]: s for s in J("sources/source_registry.json", "sources")}
conflicts = {c["conflict_id"]: c for c in J("conflicts/conflicts.json", "conflicts")}

errors, warnings = [], []
err = errors.append


def unique(items, key, label):
    seen = set()
    for i in items:
        if i[key] in seen:
            err(f"duplicate {label} id {i[key]}")
        seen.add(i[key])


unique(rels, "wpr_id", "relationship")
unique(routes, "route_id", "route")

for p in places.values():
    g = p["geometry"]
    if p["place_type"] not in V["place_type"]:
        err(f"{p['place_id']}: place_type {p['place_type']!r}")
    if p["existence_status"] not in V["existence_status"]:
        err(f"{p['place_id']}: existence_status {p['existence_status']!r}")
    if (g["lat"] is None) != (g["lon"] is None):
        err(f"{p['place_id']}: half a coordinate")
    if g["lat"] is not None:
        if g["precision"] not in V["coord_precision"]:
            err(f"{p['place_id']}: coord precision {g['precision']!r}")
        if g["coord_source_id"] not in sources:
            err(f"{p['place_id']}: coordinates without a registered source")
    if p["part_of"] and p["part_of"] not in places:
        err(f"{p['place_id']}: part_of {p['part_of']} missing")

# two place records must not share an external identifier
for key in ("wikidata", "osm"):
    seen = {}
    for p in places.values():
        v = p["external_ids"].get(key)
        if v and v in seen:
            err(f"duplicate place entity: {p['place_id']} and {seen[v]} share {key} {v}")
        if v:
            seen[v] = p["place_id"]

for r in rels:
    rid = r["wpr_id"]
    if r["relationship_type"] not in V["relationship_type"]:
        err(f"{rid}: relationship_type")
    if r["verification_status"] not in V["verification_status"]:
        err(f"{rid}: verification_status")
    if r["spatial_role"] and r["spatial_role"] not in V["spatial_role"]:
        err(f"{rid}: spatial_role {r['spatial_role']!r}")
    if r["mention_type"] and r["mention_type"] not in V["mention_type"]:
        err(f"{rid}: mention_type {r['mention_type']!r}")
    if r["place_id"] not in places:
        err(f"{rid}: place missing")
    if r["work_id"] and r["work_id"] not in works:
        err(f"{rid}: work missing")
    if r["creator_id"] not in creators:
        err(f"{rid}: creator missing")
    if not r["work_id"] and r["relationship_type"] not in ("biographical_place",):
        err(f"{rid}: only biographical relationships may lack a work")
    if not r["claim_ids"]:
        err(f"{rid}: no claims")
    for c in r["claim_ids"]:
        if c not in claims:
            err(f"{rid}: claim {c} missing")
    if r["relationship_type"] in ("textual_place", "inferred_place") and r["verification_status"] == "verified" and not r["locators"]:
        err(f"{rid}: verified textual relationship without a locator")

for c in claims.values():
    cid = c["claim_id"]
    if c["claim_type"] not in V["claim_type"]:
        err(f"{cid}: claim_type {c['claim_type']!r}")
    if c["verification_status"] not in V["verification_status"]:
        err(f"{cid}: verification_status")
    ev = [evidence[e] for e in c["evidence_ids"] if e in evidence]
    if len(ev) != len(c["evidence_ids"]):
        err(f"{cid}: evidence record missing")
    supporting = [e for e in ev if e["stance"] == "supports"]
    if c["verification_status"] != "unresolved" and not supporting:
        err(f"{cid}: status {c['verification_status']} with no supporting evidence")
    if c["verification_status"] == "verified":
        ok = any(
            (e["evidence_type"] == "primary_text_quote" and e["machine_checked_against_source"])
            or sources[e["source_id"]]["tier"] == 1
            for e in supporting
        )
        if not ok:
            err(f"{cid}: 'verified' needs a checked primary quotation or a Tier-1 record")
    if all(sources[e["source_id"]]["tier"] == 4 for e in supporting) and supporting and c["verification_status"] not in ("unresolved",):
        err(f"{cid}: Tier-4 sources alone cannot support status {c['verification_status']}")
    if c["verification_status"] == "conflicting" and c["conflict_id"] not in conflicts:
        err(f"{cid}: conflicting claim without a conflict record")
    if c["conflict_id"] and c["conflict_id"] not in conflicts:
        err(f"{cid}: conflict {c['conflict_id']} missing")

for e in evidence.values():
    if e["source_id"] not in sources:
        err(f"{e['evidence_id']}: source missing")
    if e["claim_id"] not in claims:
        err(f"{e['evidence_id']}: claim missing")
    if e["evidence_type"] not in V["evidence_type"]:
        err(f"{e['evidence_id']}: evidence_type")
    if e["stance"] not in V["evidence_stance"]:
        err(f"{e['evidence_id']}: stance")
    if e["evidence_type"] == "primary_text_quote" and len(e["quote"].split()) > 40:
        warnings.append(f"{e['evidence_id']}: quotation longer than 40 words")

rel_ids = {r["wpr_id"] for r in rels}
for rt in routes:
    orders = [s["order"] for s in rt["stops"]]
    if orders != list(range(1, len(orders) + 1)):
        err(f"{rt['route_id']}: stop order not contiguous")
    for s in rt["stops"]:
        if s["place_id"] not in places or s["wpr_id"] not in rel_ids:
            err(f"{rt['route_id']}: stop {s['order']} has a dangling reference")

for c in conflicts.values():
    for cid in c["claim_ids"]:
        if cid not in claims:
            err(f"{c['conflict_id']}: claim {cid} missing")
    if len(c["positions"]) < 2:
        err(f"{c['conflict_id']}: a conflict needs at least two positions")

for s in sources.values():
    if str(s["tier"]) not in V["source_tier"]:
        err(f"{s['source_id']}: tier")

print(f"{len(places)} places, {len(rels)} relationships, {len(claims)} claims, {len(evidence)} evidence, "
      f"{len(sources)} sources, {len(routes)} routes, {len(conflicts)} conflicts")
for w in warnings:
    print("warning:", w)
for e in errors:
    print("ERROR:", e)
print("OK" if not errors else f"{len(errors)} error(s)")
sys.exit(1 if errors else 0)
