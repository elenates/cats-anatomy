# Fig. 95 (tongue, images/smysly/tongue.webp): hotspots for the Jazyk tab.
# Legend (1901): a filiform papillae, b/b' fungiform papillae (b' the row of very large ones at the borders),
# c vallate papillae, d tonsils, e epiglottis. The tongue outline comes from the ink edge of each row;
# the papillae areas follow the 1901 text: filiform in front, fungiform over the middle behind them,
# vallate in two rows converging to a V. The root of the tongue behind them stays without a hotspot.
# Overlay check: ov95.png.
import os, json
import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import Polygon, LineString, box
from shapely.ops import unary_union
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
IMG = os.path.join(ROOT, "images/smysly/tongue.webp")
a = np.array(Image.open(IMG).convert("L")); H, W = a.shape
P = lambda pts: Polygon(pts).buffer(0)
L, R = [], []
for y in range(12, 861, 4):
    xs = np.nonzero(a[y] < 140)[0]; xs = xs[(xs > 100) & (xs < 545)]
    L.append((int(xs.min()) - 1, y)); R.append((int(xs.max()) + 1, y))
LOW_L = [(206, 900), (200, 960), (200, 1030), (206, 1080), (212, 1110)]
LOW_R = [(512, 880), (507, 950), (505, 1030), (497, 1080), (490, 1110)]
tongue = P([(372, 6)] + R + LOW_R + list(reversed(LOW_L)) + list(reversed(L)))
A_B = 720                                   # filiform (a) in front of this row, fungiform (b) behind it
G = {}
G["hrazene-papily"] = unary_union([LineString([(508, 878), (430, 940)]).buffer(17), LineString([(204, 905), (290, 935)]).buffer(17)])
G["nitkovite-papily"] = tongue.intersection(box(0, 0, W, A_B))
G["houbovite-papily"] = tongue.intersection(box(0, A_B, W, 1100))
G["hrtanova-priklopka"] = P([(342, 1138), (365, 1150), (395, 1170), (415, 1200), (415, 1240), (400, 1270), (370, 1285), (335, 1285),
                             (300, 1278), (277, 1255), (265, 1215), (275, 1180), (305, 1155)])
G["krcni-mandle"] = unary_union([P([(48, 1112), (85, 1108), (108, 1130), (112, 1170), (100, 1205), (75, 1222), (50, 1215), (40, 1180), (38, 1140)]),
                                 P([(600, 1118), (632, 1120), (652, 1145), (655, 1190), (645, 1225), (615, 1235), (585, 1215), (572, 1180), (578, 1140)])])
order = ["hrazene-papily", "nitkovite-papily", "houbovite-papily", "hrtanova-priklopka", "krcni-mandle"]
res = {}; taken = Polygon(); frame = Polygon([(0, 0), (W, 0), (W, H), (0, H)])
for k in order:
    g = G[k].intersection(frame).difference(taken)
    if k == "hrazene-papily": g = g.intersection(tongue)
    g = g.buffer(-0.3, join_style=2).buffer(0.3, join_style=2)   # open pinch points where a band meets the outline
    taken = unary_union([taken, g]); res[k] = g
from shapes import finalize
out = finalize(res, list(res), tol=1.0 if "95" in __file__ or "173" in __file__ else 0.8)
json.dump(out, open(os.path.join(HERE, "hs95.json"), "w"))
im = Image.open(IMG).convert("RGBA"); ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
cols = [(220, 40, 40), (40, 120, 220), (30, 160, 60), (200, 120, 0), (150, 40, 200)]
for i, (k, ps) in enumerate(out.items()):
    for p in ps: d.polygon([tuple(q) for q in p], fill=cols[i] + (70,), outline=cols[i] + (255,))
    print(k, len(ps), [round(Polygon(p).area) for p in ps])
Image.alpha_composite(im, ov).save(os.path.join(HERE, "ov95.png"))
