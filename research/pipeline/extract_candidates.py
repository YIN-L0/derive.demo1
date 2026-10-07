#!/usr/bin/env python3
"""
Step 5 of the research workflow: extract CANDIDATE place mentions from a primary text.

This is a recall-oriented, rule-based pass. Its output is a discovery aid, never
evidence on its own: every candidate must be read in context and resolved to a
real-world entity (step 6) before it becomes a PLACE or a CLAIM.

    python3 extract_candidates.py <config.json> <out.csv>

config.json:
  {"work_id": "...", "lang": "fr|en", "files": [{"path": "...", "label": "v1"}],
   "divisions": [{"regex": "...", "level": "part|chapter|section"}],
   "start_regex": "...", "end_regex": "...", "context_chars": 90}

Texts are read from wherever the caller points; in-copyright texts must stay
outside the research workspace (only short context snippets are written out).
"""
import csv, json, re, sys
from pathlib import Path

U = r"A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŒ"
W = r"[\w'’\-]"
NAME = rf"[{U}]{W}+"
LINK = r"(?:de la |de l['’]|du |des |de |d['’]|aux |au |à la |la |le |les |l['’])"
SEQ = rf"(?:{LINK})*{NAME}(?:[ \-](?:{LINK})*{NAME})*"

GENERIC_FR = ("rue|boulevard|boulevards|quai|place|pont|faubourg|passage|avenue|barrière|carrefour|"
              "cité|impasse|allée|cours|jardin|café|théâtre|hôtel|église|palais|gare|marché|bal|"
              "restaurant|port|île|bois|chaussée|galerie|caserne|prison|cimetière|hôpital|collège|école")
GENERIC_EN = ("Rue|Boulevard|Avenue|Place|Quai|Pont|Café|Cafe|Hôtel|Hotel|Gare|Faubourg|Passage|Bal|"
              "Jardin|Palais|Bois|Villa|Impasse|Cité|Porte|Square|Lycée|Église|Théâtre|Carrefour")
EN_SUFFIX = "Street|Road|Square|Gardens|Garden|Bridge|Station|Lane|Row|Place|Hospital|Park|Hill|Circus|Embankment|Terrace|Crescent|Museum|Gallery|Theatre|Hotel|Restaurant|Cathedral|Abbey"

PATTERNS = {
    "fr": [
        ("generic+name", re.compile(rf"\b(?:{GENERIC_FR})\s+{SEQ}", re.I)),
        ("the+Name", re.compile(rf"\b(?:au|aux|du|des|le|la|les|l['’]|à|de|vers|devant|derrière|dans|sur|par)\s+((?:{NAME})(?:-{NAME})+)")),
    ],
    "en": [
        ("generic+name", re.compile(rf"\b(?:{GENERIC_EN})\s+{SEQ}")),
        ("name+suffix", re.compile(rf"\b{NAME}(?:[ \-](?:{LINK})?{NAME})*\s+(?:{EN_SUFFIX})\b")),
        ("the+Name", re.compile(rf"\b(?:the|at|in|to|from|near|of)\s+((?:the\s+)?{NAME}(?:[ \-](?:{LINK})?{NAME})*)")),
    ],
}


def main(cfg_path, out_path):
    cfg = json.loads(Path(cfg_path).read_text())
    ctx = cfg.get("context_chars", 90)
    divisions = [(re.compile(d["regex"]), d["level"]) for d in cfg["divisions"]]
    order = ["part", "chapter", "section"]
    rows = []
    for f in cfg["files"]:
        text = Path(f["path"]).read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n")
        if cfg.get("start_regex"):
            m = re.search(cfg["start_regex"], text, re.M)
            text = text[m.start():] if m else text
        if cfg.get("end_regex"):
            m = re.search(cfg["end_regex"], text, re.M)
            text = text[:m.start()] if m else text
        loc = dict(f.get("initial_locator", {}))
        paras = re.split(r"\n\s*\n", text)
        para_no = 0
        for para in paras:
            head = para.strip()
            hit = False
            for rx, level in divisions:
                m = rx.match(head)
                if m and len(head) < 80:
                    loc[level] = (m.group(1) if m.groups() else head).strip()
                    for lower in order[order.index(level) + 1:]:
                        loc.pop(lower, None)
                    para_no = 0
                    hit = True
                    break
            if hit:
                continue
            para_no += 1
            flat = re.sub(r"\s+", " ", para).strip()
            for kind, rx in PATTERNS[cfg["lang"]]:
                for m in rx.finditer(flat):
                    s = m.group(1) if m.groups() else m.group(0)
                    a, b = max(0, m.start() - ctx), min(len(flat), m.end() + ctx)
                    rows.append({
                        "work_id": cfg["work_id"], "file": f.get("label", ""),
                        "part": loc.get("part", ""), "chapter": loc.get("chapter", ""),
                        "section": loc.get("section", ""), "paragraph": para_no,
                        "pattern": kind, "candidate": s.strip(), "context": flat[a:b],
                    })
    with open(out_path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)
    print(f"{cfg['work_id']}: {len(rows)} candidate mentions -> {out_path}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
