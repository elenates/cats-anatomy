"""Kočičí rentgen stage 3c (#43): data/rentgen-kosti.js is complete.
- kresba: the 1845 cat and the moved skeleton have the same size; the whole-cat view (cela) has the same structures; every bone and joint of Fig. 1 has an area,
  every area has a card in data/kostra.js, lies inside the picture and on the skeleton (not on the background);
- skutecny: X-rays A and B, each with bone areas that have cards and lie inside the picture;
- galerie: all 9 special X-rays (every image in images/rentgen/skutecny/ but A and B), each with a labelled area.
Nested lists name areas that exist."""
import os, sys, json, subprocess, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from PIL import Image
from shapely.geometry import Polygon
from shapely.ops import unary_union
import numpy as np

r = Run("rentgen kosti")
js = ("global.window={};for(const f of ['kostra','hotspots-kostra','rentgen-kosti'])require('./data/'+f+'.js');"
      "console.log(JSON.stringify(window.ATLAS_DATA))")
D = json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))
K = D["rentgenKosti"]; items = {i["id"] for i in D["kostra"]["items"]}
geo = lambda polys: unary_union([Polygon(p).buffer(0) for p in polys])

def check_bones(name, fig):
    im = Image.open(os.path.join(ROOT, fig["image"]))
    r.ok(im.size == (fig["width"], fig["height"]), f"{name}: image size {im.size}")
    for sid, v in fig["areas"].items():
        r.ok(v["content"] == "kostra" and sid in items, f"{name}/{sid}: card in kostra")
        g = geo(v["polys"]); x0, y0, x1, y1 = g.bounds
        r.ok(g.area > 20, f"{name}/{sid}: area {g.area:.0f}")
        r.ok(x0 >= -1 and y0 >= -1 and x1 <= fig["width"] + 1 and y1 <= fig["height"] + 1, f"{name}/{sid}: inside the picture")
    for parent, kids in fig["nested"].items():
        r.ok(parent in fig["areas"] and all(k in fig["areas"] for k in kids), f"{name}: nested {parent} {kids}")

kr = K["kresba"]
check_bones("kresba", kr)
sk = Image.open(os.path.join(ROOT, kr["skeleton"]))
r.ok(sk.size == (kr["width"], kr["height"]), f"kresba: moved skeleton {sk.size} has the size of the cat plate")
L = D["hotspots"]["skeleton"]["layers"]; want = set(L["kosti"]) | set(L["klouby"])
r.ok(want <= set(kr["areas"]), f"kresba: every bone and joint of Fig. 1 has an area; missing {want - set(kr['areas'])}")
a = np.array(sk.convert("L")).astype(int); paper = int(np.median(a[:40, :].ravel()))
for sid, v in kr["areas"].items():  # the area's middle lies on the drawing, not on the empty paper around it
    pt = geo(v["polys"]).representative_point(); x, y = int(pt.x), int(pt.y)
    r.ok(abs(a[max(0, y - 2):y + 3, max(0, x - 2):x + 3] - paper).max() > 25, f"kresba/{sid}: on the skeleton")

check_bones("kresba/cela", kr["cela"])
r.ok(set(kr["cela"]["areas"]) == set(kr["areas"]), "kresba/cela: the same structures as the magnifying glass")

r.ok([f["id"] for f in K["skutecny"]] == ["predni-cast", "zadni-cast"], "skutecny: A and B")
for f in K["skutecny"]:
    check_bones(f["id"], f)
    r.ok(len(f["areas"]) >= 8, f"{f['id']}: {len(f['areas'])} bones")

imgs = sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(ROOT, "images/rentgen/skutecny/*.webp")))
gal = [g["id"] for g in K["galerie"]]
r.ok(sorted(gal) == sorted(set(imgs) - {"predni-cast", "zadni-cast"}) and len(gal) == 9, f"galerie: all 9 X-rays {gal}")
for g in K["galerie"]:
    im = Image.open(os.path.join(ROOT, g["image"]))
    r.ok(im.size == (g["width"], g["height"]), f"galerie/{g['id']}: size")
    r.ok(len(g["areas"]) >= 1 and len({x["id"] for x in g["areas"]}) == len(g["areas"]), f"galerie/{g['id']}: areas")
    for x in g["areas"]:
        s = geo(x["shapes"]); x0, y0, x1, y1 = s.bounds
        r.ok(x["label"].strip() and s.area > 100, f"galerie/{g['id']}/{x['id']}: label and area")
        r.ok(x0 >= -1 and y0 >= -1 and x1 <= g["width"] + 1 and y1 <= g["height"] + 1, f"galerie/{g['id']}/{x['id']}: inside")
r.finish()
