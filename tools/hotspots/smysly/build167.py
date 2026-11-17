# Fig. 167 (eye, images/smysly/eye.webp): hotspots for the Oko tab.
# Thin coats (retina, choroid) come from radial ink profiles around the centre of the eyeball;
# the front parts are traced by hand. Overlay check: ov167.png.
import os, json, math
import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import Polygon
from shapely.ops import unary_union
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
IMG = os.path.join(ROOT, "images/smysly/eye.webp")
a = np.array(Image.open(IMG).convert("L")); H, W = a.shape
CX, CY = 255, 330
P = lambda pts: Polygon(pts).buffer(0)

def runs(deg, r0=150, r1=300):
    t = math.radians(deg); out = []; cur = None
    for r in range(r0, r1):
        x = int(round(CX + r * math.cos(t))); y = int(round(CY - r * math.sin(t)))
        if not (0 <= x < W and 0 <= y < H): break
        ink = a[y, x] < 150
        if ink and cur is None: cur = r
        if not ink and cur is not None: out.append([cur, r - 1]); cur = None
    m = []
    for s, e in out:                      # merge runs split by 1-2 px of paper
        if m and s - m[-1][1] <= 3: m[-1][1] = e
        else: m.append([s, e])
    return m

def pt(deg, r): t = math.radians(deg); return (CX + r * math.cos(t), CY - r * math.sin(t))
def limit(deg):                           # stop before letters and leader lines
    d = deg % 360
    if 0 <= d <= 22: return 240
    if 22 < d <= 45: return 255
    if 125 <= d <= 185: return 268
    if 300 <= d < 360: return 232
    return 246

# whole silhouette: radial outer edge from 130° round the back to 45°, cornea traced over the top
angles = list(range(130, 405, 2))
outer = []
for d in angles:
    rr = [q for q in runs(d) if q[0] <= limit(d)]
    outer.append(pt(d, rr[-1][1] + 1))
CORNEA_OUT = [(400, 115), (350, 70), (300, 47), (260, 41), (200, 45), (150, 57), (105, 100)]
sil = P(outer + CORNEA_OUT)

# back coats: retina line, choroid, from 168° to 372°
ret_in, ch_s, ch_e = [], [], []
for d in range(168, 373, 2):
    rr = [q for q in runs(d) if q[0] <= limit(d)]
    inner = rr[:-1] if len(rr) > 1 else rr
    r_in = inner[0][0]
    mid = inner[1:] if len(inner) > 1 else inner
    ch = max(mid, key=lambda q: q[1] - q[0])
    if ch is inner[0]: s, e = r_in + 8, ch[1]
    else: s, e = ch[0], ch[1]
    ret_in.append((d, r_in)); ch_s.append((d, s)); ch_e.append((d, e))
def smooth(series):
    v = np.array([r for _, r in series], float); k = 5
    p = np.pad(v, k // 2, mode="edge")
    return [(series[i][0], float(np.median(p[i:i + k]))) for i in range(len(v))]
ret_in, ch_s, ch_e = smooth(ret_in), smooth(ch_s), smooth(ch_e)
band = lambda inner, outer_: P([pt(d, r) for d, r in inner] + [pt(d, r) for d, r in reversed(outer_)])
RET_GROW = 14   # the retina is a line; its tap area reaches 14 px into the vitreous
G = {}
G["sitnice"] = band([(d, r - RET_GROW) for d, r in ret_in], [(d, r - 0.5) for d, r in ch_s])
G["cevnatka"] = band([(d, r - 0.5) for d, r in ch_s], [(d, r + 6) for d, r in ch_e])   # widened 6 px into the sclera for taps
G["zrakovy-nerv"] = P([(205, 661), (205, 575), (214, 540), (228, 516), (282, 516), (296, 540), (304, 575), (304, 661)])
def half_ellipse(cx, cy, ax, by, top):
    return [(cx + ax * math.cos(t), cy - (by if top else -by) * math.sin(t)) for t in np.linspace(0, math.pi, 40)]
LCX, LCY = 252.5, 259
G["cocka"] = P(half_ellipse(LCX, LCY, 147, 113, True) + list(reversed(half_ellipse(LCX, LCY, 147, 103, False))))
G["duhovka"] = unary_union([
    P([(179, 148), (140, 151), (110, 162), (84, 181), (68, 201), (76, 212), (96, 196), (125, 179), (155, 166), (180, 158)]),
    P([(316, 145), (350, 145), (390, 158), (421, 179), (437, 200), (426, 209), (405, 191), (370, 171), (340, 161), (316, 155)])]).buffer(6)  # the iris is a thin strip: tap area widened by 6 px
G["rasnate-teleso"] = unary_union([
    P([(70, 209), (86, 222), (99, 256), (112, 259), (112, 267), (98, 268), (79, 288), (52, 306), (46, 282), (54, 236)]),
    P([(426, 207), (412, 232), (399, 253), (390, 256), (390, 263), (402, 262), (421, 280), (445, 306), (448, 280), (443, 232)])])
G["rohovka"] = P([(62, 150)] + CORNEA_OUT[::-1][:0] + [(105, 100), (150, 57), (200, 45), (260, 41), (300, 47), (350, 70), (400, 115), (425, 140),
                  (408, 146), (395, 135), (360, 105), (310, 80), (250, 70), (190, 77), (130, 110), (98, 150), (85, 168)])
G["predni-komora"] = P([(85, 178), (98, 150), (130, 110), (190, 77), (250, 70), (310, 80), (360, 105), (395, 135), (412, 158), (425, 178),
                        (390, 158), (350, 145), (316, 145), (300, 150), (253, 146), (205, 149), (179, 148), (140, 151), (110, 162)])
vit = P([pt(d, r) for d, r in ret_in] + [(410, 258), (253, 262), (105, 264)])
G["sklivec"] = vit
order = ["zrakovy-nerv", "cocka", "duhovka", "rasnate-teleso", "rohovka", "predni-komora", "sitnice", "cevnatka", "sklivec"]
frame = Polygon([(0, 0), (W, 0), (W, H), (0, H)])
res = {}; taken = Polygon()
for k in order:
    g = G[k].intersection(frame).difference(taken)
    if k not in ("zrakovy-nerv",): g = g.intersection(sil.buffer(1))
    taken = unary_union([taken, g]); res[k] = g
# posterior chamber (between iris, ciliary body and lens) stays without a hotspot
gap = unary_union([G["cocka"], G["duhovka"], G["rasnate-teleso"]]).convex_hull.difference(taken)
res["belima"] = sil.difference(taken).difference(gap)
from shapes import finalize
out = finalize(res, list(res), tol=1.0 if "95" in __file__ or "173" in __file__ else 0.8)
json.dump(out, open(os.path.join(HERE, "hs167.json"), "w"))
im = Image.open(IMG).convert("RGBA"); ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
cols = [(220, 40, 40), (40, 120, 220), (30, 160, 60), (200, 120, 0), (150, 40, 200), (0, 170, 170), (230, 0, 130), (120, 120, 0), (90, 90, 90), (255, 150, 0)]
for i, (k, ps) in enumerate(out.items()):
    for p in ps: d.polygon([tuple(q) for q in p], fill=cols[i] + (70,), outline=cols[i] + (255,))
    print(k, len(ps), [round(Polygon(p).area) for p in ps])
Image.alpha_composite(im, ov).save(os.path.join(HERE, "ov167.png"))
