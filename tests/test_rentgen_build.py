"""Kočičí rentgen stage 3 (#43): the generated files are complete. data/rentgen-areas.js has the two layers, every
clickable structure of the organ drawing and Fig. 68 has a warped area, every area belongs to a structure
of its section, lies inside the photo and inside the cat; the three images exist at twice the photo size."""
import os, sys, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from PIL import Image
from shapely.geometry import Polygon
from shapely.ops import unary_union
import numpy as np

r = Run("rentgen build")
js = ("global.window={};for(const f of ['kostra','organy','svaly','hotspots-kostra','rentgen-areas'])require('./data/'+f+'.js');"
      "console.log(JSON.stringify(window.ATLAS_DATA))")
D = json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))
R = D["rentgenAreas"]; H = D["hotspots"]
r.ok([l["id"] for l in R["layers"]] == ["organy", "svaly"], "two layers (Kosti uses the 1845 atlas, data/rentgen-kosti.js)")
for f in [R["image"], R["base"]] + [l["image"] for l in R["layers"]]:
    im = Image.open(os.path.join(ROOT, f))
    want = (R["width"], R["height"]) if f == R["image"] else (R["width"] * R["scale"], R["height"] * R["scale"])
    r.ok(im.size == want, f"{f}: size {im.size}, want {want}")
want = {"organy": ("organs-side", ["organy"], "organy"),
        "svaly": ("muscles-superficial", ["svaly"], "svaly")}
cat = np.array(Image.open(os.path.join(ROOT, R["image"])).convert("RGB")).astype(int)
for m, (fig, layers, content) in want.items():
    ids = {k for l in layers for k in H[fig]["layers"][l]}
    got = R["areas"][m]
    r.ok(set(got) == ids, f"{m}: areas for every structure; missing {ids - set(got)}, extra {set(got) - ids}")
    items = {i["id"] for i in D[content]["items"]}
    for sid, v in got.items():
        r.ok(v["content"] == content and sid in items, f"{m}/{sid}: card in {content}")
        g = unary_union([Polygon(p).buffer(0) for p in v["polys"]])
        r.ok(g.area > 20, f"{m}/{sid}: area {g.area:.0f}")
        x0, y0, x1, y1 = g.bounds
        r.ok(x0 >= 0 and y0 >= 0 and x1 <= R["width"] and y1 <= R["height"], f"{m}/{sid}: inside the photo")
        pt = g.representative_point(); x, y = int(pt.x), int(pt.y)
        r.ok((cat[max(0, y - 3):y + 4, max(0, x - 3):x + 4] < 238).any(), f"{m}/{sid}: on the cat")
r.finish()
