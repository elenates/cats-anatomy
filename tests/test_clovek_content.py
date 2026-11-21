"""Kočka a člověk content checks (#72 stage 2), without a browser:
- gen_clovek.py rebuilds data/clovek.js byte for byte,
- ids are unique; level, vztah, figs and content values are known,
- every cat partner (kocka) is an item of the cat content it names (kostra / organy),
- every reference id has a row in sources/references.md and every item and fact card has refs,
- a fact card picture exists in images/clovek/."""
import os, sys, re, json, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
fails = []

path = os.path.join(ROOT, "data", "clovek.js")
before = open(path, "rb").read()
subprocess.run([sys.executable, "-B", os.path.join(ROOT, "tools", "content", "gen_clovek.py")], check=True, capture_output=True)
if open(path, "rb").read() != before:
    open(path, "wb").write(before)
    fails.append("data/clovek.js differs from what gen_clovek.py generates")

js = "global.window={};" + "".join(f"require({json.dumps(os.path.join(ROOT, 'data', n + '.js'))});" for n in ("clovek", "kostra", "organy")) + \
     "const D=window.ATLAS_DATA;console.log(JSON.stringify({c:D.clovek,kostra:D.kostra.items.map(x=>x.id),organy:D.organy.items.map(x=>x.id)}))"
d = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
known = set(re.findall(r"^\|\s*([A-Z][A-Za-z0-9-]+)\s*\|", open(os.path.join(ROOT, "sources", "references.md"), encoding="utf-8").read(), re.M))
FIGS = {"na-ctyrech", "zepredu", "zboku", "zezadu", "organy", "muz", "zena"}
FIG_FILE = {"na-ctyrech": "kostra-na-ctyrech", "zepredu": "kostra-zepredu", "zboku": "kostra-zboku", "zezadu": "kostra-zezadu",
            "organy": "organy", "muz": "rozmnozovaci-muz", "zena": "rozmnozovaci-zena"}
for f in FIG_FILE.values():
    if not os.path.exists(os.path.join(ROOT, "images", "clovek", f + ".webp")): fails.append(f"images/clovek/{f}.webp missing")

seen = set()
for it in d["c"]["items"]:
    i = it.get("id")
    if i in seen: fails.append(f"item {i}: duplicate id")
    seen.add(i)
    for f in ("cs", "la", "kdeJe", "srovnani"):
        if not it.get(f): fails.append(f"item {i}: missing {f}")
    if it.get("level") not in ("zaklad", "zvidave"): fails.append(f"item {i}: bad level")
    if it.get("vztah") not in ("stejne", "jine"): fails.append(f"item {i}: bad vztah")
    if not it.get("figs") or set(it["figs"]) - FIGS: fails.append(f"item {i}: bad figs {it.get('figs')}")
    if it.get("kocka"):
        if it.get("content") not in ("kostra", "organy"): fails.append(f"item {i}: bad content")
        elif it["kocka"] not in d[it["content"]]: fails.append(f"item {i}: cat partner {it['kocka']} not in {it['content']}")
        if it["kocka"] != i and i not in ("kostrc", "prsty-ruky", "prsty-nohy"): fails.append(f"item {i}: id differs from cat partner {it['kocka']}")
    elif it.get("content"): fails.append(f"item {i}: content without a cat partner")
    if not it.get("refs"): fails.append(f"item {i}: no refs")
    for r in it.get("refs", []):
        if r not in known: fails.append(f"item {i}: ref {r} not in references.md")

for f in d["c"]["fakta"]:
    i = f.get("id")
    if i in seen: fails.append(f"fakta {i}: duplicate id")
    seen.add(i)
    if not (f.get("cs") and f.get("text") and f.get("refs")): fails.append(f"fakta {i}: missing field")
    if f.get("vztah") not in ("stejne", "jine"): fails.append(f"fakta {i}: bad vztah")
    for r in f.get("refs", []):
        if r not in known: fails.append(f"fakta {i}: ref {r} not in references.md")
    if f.get("image") and not os.path.exists(os.path.join(ROOT, "images", "clovek", f["image"] + ".webp")): fails.append(f"fakta {i}: no image file")

print("PASS clovek content" if not fails else "FAIL clovek content")
for f in fails: print("  failed:", f)
sys.exit(1 if fails else 0)
