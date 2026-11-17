"""Content checks without a browser:
- every generator rebuilds its data file byte for byte (nobody edited a generated file by hand),
- every reference id used in the data files has a row in sources/references.md,
- every item has the fields the atlas card needs."""
import os, sys, re, json, subprocess, shutil, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
fails = []

GEN = {"kostra": "gen_kostra.py", "vnejsi": "gen_vnejsi.py", "organy": "gen_organy.py", "svaly": "gen_svaly.py", "smysly": "gen_smysly.py"}
for name, gen in GEN.items():
    path = os.path.join(ROOT, "data", name + ".js")
    before = open(path, "rb").read()
    subprocess.run([sys.executable, "-B", os.path.join(ROOT, "tools", "content", gen)], check=True, capture_output=True)
    after = open(path, "rb").read()
    if before != after:
        open(path, "wb").write(before)          # restore, so the check leaves no trace
        fails.append(f"data/{name}.js differs from what {gen} generates")

refs_md = open(os.path.join(ROOT, "sources", "references.md"), encoding="utf-8").read()
known = set(re.findall(r"^\|\s*([A-Z][A-Za-z0-9-]+)\s*\|", refs_md, re.M))
js = "global.window={};" + "".join(f"require({json.dumps(os.path.join(ROOT,'data',n+'.js'))});" for n in GEN) + \
     "console.log(JSON.stringify(Object.fromEntries(%s.map(n=>[n,window.ATLAS_DATA[n].items]))))" % json.dumps(list(GEN))
data = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
for name, items in data.items():
    for it in items:
        for f in ("id", "cs", "level", "kdeJe", "coDela"):
            if not it.get(f): fails.append(f"{name}/{it.get('id')}: missing {f}")
        if it.get("level") not in ("zaklad", "zvidave"): fails.append(f"{name}/{it['id']}: bad level")
        for r in it.get("refs", []):
            if r not in known: fails.append(f"{name}/{it['id']}: ref {r} not in references.md")
        if not it.get("refs"): fails.append(f"{name}/{it['id']}: no refs")

# Smysly fact cards: text and refs present, refs known, picture file exists.
_fjs = "global.window={};require(%s);console.log(JSON.stringify(window.ATLAS_DATA.smysly.fakta))" % json.dumps(os.path.join(ROOT, "data", "smysly.js"))
for f in json.loads(subprocess.run(["node", "-e", _fjs], capture_output=True, text=True, check=True).stdout):
    if not (f.get("id") and f.get("cs") and f.get("text") and f.get("refs")): fails.append(f"smysly/fakta/{f.get('id')}: missing field")
    for r in f.get("refs", []):
        if r not in known: fails.append(f"smysly/fakta/{f['id']}: ref {r} not in references.md")
    if f.get("image") and not os.path.exists(os.path.join(ROOT, "images", "smysly", f["image"] + ".webp")): fails.append(f"smysly/fakta/{f['id']}: no image file")

# Every image file has a row in sources/image-licenses.md (rule from the brief).
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_lic = open(os.path.join(_ROOT, "sources", "image-licenses.md"), encoding="utf-8").read()
for _d, _, _fs in os.walk(os.path.join(_ROOT, "images")):
    for _f in _fs:
        _rel = os.path.relpath(os.path.join(_d, _f), _ROOT).replace(os.sep, "/")
        if "| `" + _rel + "` |" not in _lic: fails.append(f"{_rel}: no row in sources/image-licenses.md")

print("PASS content" if not fails else "FAIL content")
for f in fails: print("  failed:", f)
sys.exit(1 if fails else 0)
