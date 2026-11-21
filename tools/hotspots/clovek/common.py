# Shared by build_*.py: rough hand polygons (read from gridded crops) are tightened to the ink silhouette of the
# drawing (sil.py), widened again for taps but only inside their own rough polygon, and carved in priority order
# with tools/hotspots/smysly/shapes.py (no overlaps, no holes). Writes hs_<fig>.json and an overlay ov_<fig>.png.
import os, sys, json, numpy as np, cv2
from shapely.geometry import Polygon, MultiPolygon, Point
from shapely.ops import unary_union
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(HERE, "..", "smysly"))
from shapes import finalize

P = lambda pts: Polygon(pts).buffer(0)
def U(*ps): return unary_union([p if hasattr(p, "area") else P(p) for p in ps])
def circle(x, y, r): return Point(x, y).buffer(r, 24)

def _mask(g, w, h):
    m = np.zeros((h, w), np.uint8)
    for p in (g.geoms if hasattr(g, "geoms") else [g]):
        if p.is_empty: continue
        cv2.fillPoly(m, [np.array(p.exterior.coords, np.int32)], 255)
        for i in p.interiors: cv2.fillPoly(m, [np.array(i.coords, np.int32)], 0)
    return m

def _poly(m):
    cs, hier = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    if hier is None: return Polygon()
    for i, c in enumerate(cs):
        if hier[0][i][3] != -1 or len(c) < 3: continue
        holes = [cs[j][:, 0, :] for j in range(len(cs)) if hier[0][j][3] == i and len(cs[j]) >= 3]
        out.append(Polygon(c[:, 0, :], holes).buffer(0))
    return unary_union(out)

def build(fig, image, layers, sil=None, fills=(), widen=10, raw=()):
    """layers: {layer: (order, {id: rough geometry})}. sil: silhouette png name or None (use the rough shapes).
    fills: geometries added to the silhouette where the ink outline leaks. raw: ids that skip the silhouette."""
    im = Image.open(os.path.join(ROOT, image)).convert("RGBA"); w, h = im.size
    S = None
    if sil:
        S = cv2.imread(os.path.join(HERE, sil), cv2.IMREAD_GRAYSCALE)
        for f in fills: S = np.maximum(S, _mask(f, w, h))
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * widen + 1, 2 * widen + 1))
    res = {}
    for layer, (order, shapes) in layers.items():
        tight = {}
        for i in order:
            g = shapes[i]
            if S is not None and i not in raw:
                r = _mask(g, w, h); t = cv2.bitwise_and(r, S)
                t = cv2.bitwise_and(cv2.dilate(t, k), r)
                g = _poly(t)
            tight[i] = g
        res[layer] = finalize(tight, order)
    json.dump(res, open(os.path.join(HERE, f"hs_{fig}.json"), "w"))
    cols = [(220,40,40),(40,120,220),(30,160,60),(200,120,0),(150,40,200),(0,170,170),(230,0,130),(120,120,0),(90,60,30),(0,90,160)]
    for layer, items in res.items():
        ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
        for n, (i, ps) in enumerate(items.items()):
            c = cols[n % len(cols)]
            for p in ps:
                d.polygon([tuple(q) for q in p], fill=c + (80,), outline=c + (255,))
            if ps:
                cx, cy = Polygon(max(ps, key=lambda p: Polygon(p).area)).representative_point().coords[0]
                d.text((cx - 20, cy - 5), i, fill=(0, 0, 0, 255))
        Image.alpha_composite(im, ov).convert("RGB").save(os.path.join(HERE, f"ov_{fig}_{layer}.png"))
        print(fig, layer, {i: len(ps) for i, ps in items.items() if True})
        missing = [i for i, ps in items.items() if not ps]
        if missing: print("  EMPTY:", missing)
    return res
