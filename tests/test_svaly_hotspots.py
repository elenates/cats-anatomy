"""Svaly hotspots (M5 stage 3): ids exist in data/svaly.js, every muscle has a hotspot,
polygons are valid and do not overlap except where a figure lists them under "nested"."""
import os, sys, json, subprocess, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon
from shapely.ops import unary_union

r = Run("svaly hotspots")
js = "global.window={};require('./data/svaly.js');require('./data/hotspots-kostra.js');console.log(JSON.stringify({s:window.ATLAS_DATA.svaly,h:window.ATLAS_DATA.hotspots}))"
d = json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))
ids = {i["id"] for i in d["s"]["items"]}
figs = {k: v for k, v in d["h"].items() if v.get("content") == "svaly"}
r.ok(sorted(figs) == ["muscles-deep", "muscles-hindleg", "muscles-superficial"], f"svaly figures: {sorted(figs)}")
seen = set()
for fid, fig in figs.items():
    layer = fig["layers"]["svaly"]; nested = fig.get("nested", {})
    geo = {}
    for k, polys in layer.items():
        r.ok(k in ids, f"{fid}: {k} not in data/svaly.js")
        seen.add(k)
        ps = [Polygon(q) for q in polys]
        r.ok(all(p.is_valid and p.area > 80 for p in ps), f"{fid}/{k}: invalid or tiny polygon")
        r.ok(all(0 <= x <= fig["width"] and 0 <= y <= fig["height"] for q in polys for x, y in q), f"{fid}/{k}: point outside the image")
        geo[k] = unary_union(ps)
    for a, b in itertools.combinations(geo, 2):
        if b in nested.get(a, []) or a in nested.get(b, []):
            continue
        r.ok(geo[a].intersection(geo[b]).area < 1, f"{fid}: {a} overlaps {b}")
    for big, small in nested.items():
        for s in small:
            r.ok(geo[s].difference(geo[big].buffer(2)).area < 20, f"{fid}: {s} not inside {big}")
r.ok(seen == ids, f"muscles without a hotspot: {sorted(ids - seen)}")
r.finish()
