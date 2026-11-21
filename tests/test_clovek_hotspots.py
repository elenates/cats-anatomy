"""Kočka a člověk hotspots (#72 stage 3), without a browser:
- every picture's image exists and its size matches width/height,
- every hotspot id is an item of data/clovek.js, and each item has polygons on exactly the pictures in its figs,
- polygons are valid, inside the image and big enough to tap,
- polygons of one layer do not overlap, except a nested item over its parts (pater over the spine sections)."""
import os, sys, json, subprocess
from shapely.geometry import Polygon
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
fails = []
js = "global.window={};" + "".join(f"require({json.dumps(os.path.join(ROOT, 'data', n + '.js'))});" for n in ("clovek", "hotspots-clovek")) + \
     "console.log(JSON.stringify({c:window.ATLAS_DATA.clovek.items,h:window.ATLAS_DATA.hotspots}))"
d = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
items = {i["id"]: i for i in d["c"]}
FIG = {"clovek-na-ctyrech": "na-ctyrech", "clovek-zepredu": "zepredu", "clovek-zboku": "zboku", "clovek-zezadu": "zezadu",
       "clovek-organy": "organy", "clovek-muz": "muz", "clovek-zena": "zena"}
if set(d["h"]) != set(FIG): fails.append(f"pictures: {sorted(d['h'])}")
drawn = {}
for fid, f in d["h"].items():
    if f.get("content") != "clovek": fails.append(f"{fid}: content is not clovek")
    path = os.path.join(ROOT, f["image"])
    if not os.path.exists(path): fails.append(f"{fid}: no image"); continue
    if Image.open(path).size != (f["width"], f["height"]): fails.append(f"{fid}: size differs from the image")
    nested = f.get("nested", {})
    for layer, hs in f["layers"].items():
        polys = []
        for i, ps in hs.items():
            if i not in items: fails.append(f"{fid}/{i}: not an item of data/clovek.js"); continue
            drawn.setdefault(i, set()).add(FIG[fid])
            if max(Polygon(p).area for p in ps) < 600: fails.append(f"{fid}/{i}: too small to tap")
            for p in ps:
                g = Polygon(p)
                if not g.is_valid: fails.append(f"{fid}/{i}: invalid polygon")
                x0, y0, x1, y1 = g.bounds
                if x0 < 0 or y0 < 0 or x1 > f["width"] or y1 > f["height"]: fails.append(f"{fid}/{i}: outside the image")
                polys.append((i, g))
        for a in range(len(polys)):
            for b in range(a + 1, len(polys)):
                (i, g), (j, k) = polys[a], polys[b]
                if i == j or j in nested.get(i, []) or i in nested.get(j, []): continue
                if g.intersection(k).area > 1: fails.append(f"{fid}: {i} overlaps {j}")
for i, it in items.items():
    if drawn.get(i, set()) != set(it["figs"]): fails.append(f"{i}: figs {sorted(it['figs'])}, drawn on {sorted(drawn.get(i, set()))}")
print("PASS clovek hotspots" if not fails else "FAIL clovek hotspots")
for f in fails[:40]: print("  failed:", f)
sys.exit(1 if fails else 0)
