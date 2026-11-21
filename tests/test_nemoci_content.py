"""Kočičí nemoci content checks (#73 stage 3), without a browser:
- ids unique, every Czech field filled, badge known,
- every body link (telo) is an item of the cat content it names (kostra / organy / vnejsi),
- every source id named on a card has a row in SOURCES, and every SOURCES row is used,
- no medicine name or dose (Lenka's rule): no digits with mg/ml/tablet units."""
import os, sys, re, json, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "content"))
import nemoci_content as N
fails = []

js = "global.window={};" + "".join(f"require({json.dumps(os.path.join(ROOT, 'data', n + '.js'))});" for n in ("kostra", "organy", "vnejsi")) + \
     "const D=window.ATLAS_DATA;console.log(JSON.stringify({kostra:D.kostra.items.map(x=>x.id),organy:D.organy.items.map(x=>x.id),vnejsi:D.vnejsi.items.map(x=>x.id)}))"
ids = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)

FIELDS = ("cs", "coToJe", "jakToPoznas", "jakToVetZjisti", "coPomuze", "jakTomuPredejit")
src_ids = {r[0] for r in N.SOURCES}
used = set()
seen = set()
for c in N.NEMOCI:
    if c["id"] in seen: fails.append(f"duplicate id {c['id']}")
    seen.add(c["id"])
    for f in FIELDS:
        if not c.get(f, "").strip(): fails.append(f"{c['id']}: empty {f}")
    if c["badge"] not in ("pohotovost", "bezny", "starsi", "zdrava"): fails.append(f"{c['id']}: badge {c['badge']}")
    for content, part in c["telo"]:
        if part not in ids.get(content, []): fails.append(f"{c['id']}: telo {content}/{part} not found")
    refs = set(re.findall(r"\b([A-Z][A-Z0-9]+(?:-[A-Z0-9]+)+)\b", c["sources"]))
    if not refs: fails.append(f"{c['id']}: no sources")
    for r in refs - src_ids: fails.append(f"{c['id']}: source {r} has no SOURCES row")
    used |= refs
    text = " ".join(c.get(f, "") for f in FIELDS + ("pozor",))
    if re.search(r"\d\s*(mg|ml|tablet|kapk)", text, re.I): fails.append(f"{c['id']}: looks like a dose")
for r in sorted(src_ids - used): fails.append(f"SOURCES row {r} is not used by any card")

print(f"nemoci content: {len(N.NEMOCI)} cards, {len(src_ids)} sources")
if fails:
    print("\n".join("FAIL " + f for f in fails)); sys.exit(1)
print("OK")
