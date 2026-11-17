"""Smysly hotspots (M6 stage 3): every structure in data/smysly.js has a hotspot on its figure,
polygons are valid, inside the image, do not overlap, and each one is wide enough to tap."""
import os, sys, json, subprocess, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon
from shapely.ops import unary_union

r = Run("smysly hotspots")
js = "global.window={};require('./data/smysly.js');require('./data/hotspots-kostra.js');console.log(JSON.stringify({s:window.ATLAS_DATA.smysly,h:window.ATLAS_DATA.hotspots}))"
d = json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))
items = {i["id"]: i for i in d["s"]["items"]}
figs = {k: v for k, v in d["h"].items() if v.get("content") == "smysly"}
r.ok(sorted(figs) == ["eardrum", "eye", "inner-ear", "tongue"], f"smysly figures: {sorted(figs)}")
EARDRUM = {"bubinek", "kladivko", "kovadlinka"}
def fig_of(it):
    if it["organ"] == "oko": return "eye"
    if it["organ"] == "jazyk": return "tongue"
    return "eardrum" if it["id"] in EARDRUM else "inner-ear"
seen = set()
for fid, fig in figs.items():
    layer = fig["layers"]["smysly"]
    geo = {}
    for k, polys in layer.items():
        r.ok(k in items, f"{fid}: {k} not in data/smysly.js")
        if k not in items: continue
        seen.add(k)
        r.ok(fig_of(items[k]) == fid, f"{fid}: {k} belongs to {fig_of(items[k])}")
        ps = [Polygon(q) for q in polys]
        r.ok(all(p.is_valid and p.area > 80 for p in ps), f"{fid}/{k}: invalid or tiny polygon")
        r.ok(all(0 <= x <= fig["width"] and 0 <= y <= fig["height"] for q in polys for x, y in q), f"{fid}/{k}: point outside the image")
        g = unary_union(ps); geo[k] = g
        r.ok(not g.buffer(-5).is_empty, f"{fid}/{k}: narrower than 10 px everywhere")
    for a, b in itertools.combinations(geo, 2):
        r.ok(geo[a].intersection(geo[b]).area < 1, f"{fid}: {a} overlaps {b}")
r.ok(seen == set(items), f"structures without a hotspot: {sorted(set(items) - seen)}")
r.finish()
