"""Na veterině data checks (#73 stage 4a), without a browser:
- gen_veterina.py rebuilds data/nemoci.js and data/veterina.js byte for byte,
- the data files load in node and hold 32 cards and 32 cases,
- every card has its texts, a known badge, refs with a row in sources/references.md,
  atlas links to existing items, and an existing picture or gallery X-ray when it names one,
- every examination has an icon; every case points to a card, its three options are cards,
  its findings are for known examinations, and its photo exists."""
import os, sys, re, json, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
fails = []

paths = [os.path.join(ROOT, "data", n + ".js") for n in ("nemoci", "veterina")]
before = [open(p, "rb").read() for p in paths]
subprocess.run([sys.executable, "-B", os.path.join(ROOT, "tools", "content", "gen_veterina.py")], check=True, capture_output=True)
for p, b in zip(paths, before):
    if open(p, "rb").read() != b:
        open(p, "wb").write(b)
        fails.append(f"{os.path.relpath(p, ROOT)} differs from what gen_veterina.py generates")

names = ("nemoci", "veterina", "organy", "kostra", "vnejsi", "smysly", "rentgen")
js = "global.window={};" + "".join(f"require({json.dumps(os.path.join(ROOT, 'data', n + '.js'))});" for n in names) + \
     "const D=window.ATLAS_DATA;const ids=x=>(x.items||[]).map(i=>i.id);" \
     "console.log(JSON.stringify({n:D.nemoci,v:D.veterina,organy:ids(D.organy),kostra:ids(D.kostra),vnejsi:ids(D.vnejsi)," \
     "smysly:ids(D.smysly).concat((D.smysly.fakta||[]).map(f=>f.id)),galerie:Object.keys(D.rentgen.galerie)}))"
d = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
known = set(re.findall(r"^\|\s*([A-Z][A-Za-z0-9-]+)\s*\|", open(os.path.join(ROOT, "sources", "references.md"), encoding="utf-8").read(), re.M))

cards = {c["id"]: c for c in d["n"]["items"]}
if len(cards) != 32: fails.append(f"{len(cards)} cards, expected 32")
for k in ("coToJe", "jakToPoznas", "jakToVetZjisti", "coPomuze", "jakTomuPredejit", "pozor"):
    if not d["n"]["labels"].get(k): fails.append(f"no label for {k}")
for i, c in cards.items():
    for k in ("cs", "coToJe", "jakToPoznas", "jakToVetZjisti", "coPomuze", "jakTomuPredejit"):
        if not c.get(k): fails.append(f"card {i}: missing {k}")
    if c["badge"] not in d["n"]["badges"]: fails.append(f"card {i}: unknown badge {c['badge']}")
    if not c["refs"]: fails.append(f"card {i}: no refs")
    for r in c["refs"]:
        if r not in known: fails.append(f"card {i}: ref {r} not in references.md")
    for t in c["telo"]:
        if t["content"] not in ("organy", "kostra", "vnejsi", "smysly") or t["id"] not in d[t["content"]]:
            fails.append(f"card {i}: atlas link {t} not found")
    if c["obrazek"] and not os.path.exists(os.path.join(ROOT, "images", "veterina", c["obrazek"] + ".webp")):
        fails.append(f"card {i}: picture {c['obrazek']} missing")
    if c["rentgen"] and c["rentgen"] not in d["galerie"]: fails.append(f"card {i}: X-ray {c['rentgen']} not in the gallery")

ex = [v["id"] for v in d["v"]["vysetreni"]]
for v in d["v"]["vysetreni"]:
    if not v["cs"]: fails.append(f"examination {v['id']}: no name")
    if not os.path.exists(os.path.join(ROOT, "images", "veterina", "nastroje", v["id"] + ".svg")): fails.append(f"examination {v['id']}: no icon")
if not d["v"]["nic"]: fails.append("no text for an examination without a finding")
cases = d["v"]["pripady"]
if len(cases) != 32: fails.append(f"{len(cases)} cases, expected 32")
for p in cases:
    i = p["id"]
    if not p["jmeno"] or not p["kocka"].startswith(p["jmeno"]): fails.append(f"case {i}: bad name")
    if p["nemoc"] not in cards: fails.append(f"case {i}: card {p['nemoc']} not found")
    if len(p["moznosti"]) != 3 or p["nemoc"] not in p["moznosti"] or any(m not in cards for m in p["moznosti"]):
        fails.append(f"case {i}: bad options")
    for m in p["moznosti"]:
        if m != p["nemoc"] and not p["proc"].get(m): fails.append(f"case {i}: no why for {m}")
    for k in p["nalezy"]:
        if k not in ex: fails.append(f"case {i}: finding for unknown examination {k}")
    if len(p["spatne"]) != 2 or any(not w["text"] or not w["proc"] for w in p["spatne"]): fails.append(f"case {i}: bad wrong treatments")
    if not p["lecba"] or not p["pribeh"]: fails.append(f"case {i}: missing text")
    if not os.path.exists(os.path.join(ROOT, "images", "veterina", p["foto"] + ".webp")): fails.append(f"case {i}: photo missing")

print(f"veterina data: {len(cards)} cards, {len(cases)} cases, {len(ex)} examinations")
if fails:
    print("\n".join("FAIL " + f for f in fails)); sys.exit(1)
print("OK")
