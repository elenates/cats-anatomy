# Fig. 173 (membranous labyrinth, images/smysly/inner-ear.webp): hotspots for the Ucho tab.
# Legend (1901): a vestibule, b cochlea, c/d/e semicircular canals, g scala vestibuli, h fenestra cochleae,
# i fenestra vestibuli. The outline comes from the ink mask (letters masked out); the canals are their ink
# tubes widened for taps; cochlea | vestibule split by a hand-drawn line (g, h on the cochlea side; a, i on
# the vestibule side). Overlay check: ov173.png.
import os, json
import numpy as np, cv2
from PIL import Image, ImageDraw
from shapely.geometry import Polygon
from shapely.ops import unary_union
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
IMG = os.path.join(ROOT, "images/smysly/inner-ear.webp")
a = np.array(Image.open(IMG).convert("L")); H, W = a.shape
ink = (a < 150).astype(np.uint8)
LETTERS = [(55, 0, 80, 48), (5, 248, 48, 310), (245, 0, 295, 50), (305, 50, 352, 104), (393, 188, 432, 228),
           (352, 262, 395, 310), (182, 262, 220, 310), (236, 268, 262, 333)]
for x0, y0, x1, y1 in LETTERS: ink[y0:y1, x0:x1] = 0
LEADERS = [((126, 40), (130, 86)), ((258, 40), (234, 116)), ((190, 262), (186, 238)), ((246, 280), (228, 226)), ((40, 262), (52, 240))]
for p, q in LEADERS: cv2.line(ink, p, q, 0, 7)
def polys(mask, min_area=150):
    cs, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    for i, c in enumerate(cs):
        if hier[0][i][3] != -1 or len(c) < 3: continue
        holes = [cs[j][:, 0, :] for j in range(len(cs)) if hier[0][j][3] == i and len(cs[j]) >= 3 and cv2.contourArea(cs[j]) > 60]
        p = Polygon(c[:, 0, :], holes).buffer(0)
        if p.area >= min_area: out.append(p)
    return unary_union(out)
closed = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(closed)
main = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
filled = main.copy(); cv2.floodFill(filled, None, (0, 0), 2); filled = (filled != 2).astype(np.uint8)
body_all = polys(filled)
CUT_X = 262                                  # the canals start at their roots right of the vestibule
body = body_all.intersection(Polygon([(0, 0), (CUT_X, 0), (CUT_X, H), (0, H)]))
tubes = polys(cv2.dilate(main, np.ones((11, 11), np.uint8))).intersection(Polygon([(CUT_X - 10, 0), (W, 0), (W, H), (CUT_X - 10, H)]))
SPLIT = Polygon([(0, 0), (215, 0), (232, 95), (250, 125), (245, 160), (205, 172), (168, 176), (160, 210), (158, 250), (150, 333), (0, 333)])
G = {}
G["polokruhove-kanalky"] = tubes
G["hlemyzd"] = unary_union([body.intersection(SPLIT), Polygon([(22, 200), (35, 184), (58, 184), (68, 210), (62, 250), (46, 263), (28, 252), (19, 226)])])  # apex of the spiral (outline opened by the b leader)
G["hlemyzd"] = unary_union([Polygon(p.exterior) for p in getattr(G["hlemyzd"], "geoms", [G["hlemyzd"]])])  # no holes in the spiral
G["predsin"] = body.difference(SPLIT)
order = ["polokruhove-kanalky", "hlemyzd", "predsin"]
res = {}; taken = Polygon()
for k in order:
    g = G[k].difference(taken); taken = unary_union([taken, g]); res[k] = g
from shapely.geometry import LineString
from shapely.ops import split
def dehole(p):
    # the atlas draws plain polygons (no holes): cut a ring-shaped part through each hole
    if not p.interiors: return [p]
    cx, cy = p.interiors[0].centroid.coords[0]; x0, y0, x1, y1 = p.bounds
    pieces = split(p, LineString([(x0 - 1, cy), (x1 + 1, cy)]))
    return [q for g in pieces.geoms for q in dehole(g)]
from shapes import finalize
out = finalize(res, list(res), tol=1.0 if "95" in __file__ or "173" in __file__ else 0.8)
json.dump(out, open(os.path.join(HERE, "hs173.json"), "w"))
im = Image.open(IMG).convert("RGBA"); ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
cols = [(220, 40, 40), (40, 120, 220), (30, 160, 60)]
for i, (k, ps) in enumerate(out.items()):
    for p in ps: d.polygon([tuple(q) for q in p], fill=cols[i] + (70,), outline=cols[i] + (255,))
    print(k, len(ps), [round(Polygon(p).area) for p in ps])
Image.alpha_composite(im, ov).save(os.path.join(HERE, "ov173.png"))
