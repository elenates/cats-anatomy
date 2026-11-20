"""Kočičí rentgen (#43), stage 3c: clickable bones on Straus-Durkheim 1845 Pl. XI (images/rentgen/1845/kostra.webp).

The bones are the light pixels inside the dark body shading of the plate. Each bone gets a rough hand-drawn
region (in plate pixels); its clickable area is the bone pixels inside that region, closed and filled, and a
little widened for taps. Joints are circles on the joint. The tail lies outside the shading, so it is drawn as
a line along the vertebrae. Areas are cut against each other in ORDER (earlier wins).
Writes tools/rentgen/1845/pl11.json and the check picture tools/rentgen/1845/check-pl11.png."""
import json, os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
import shapely, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
IMG = os.path.join(ROOT, "images/rentgen/1845/kostra.webp")
a = np.array(Image.open(IMG).convert("L")).astype(float); H, W = a.shape
dark = nd.binary_closing(a < 170, iterations=3)
lab, n = nd.label(dark); body = lab == (1 + np.argmax(nd.sum(dark, lab, range(1, n + 1))))
SIL = nd.binary_fill_holes(nd.binary_closing(body, iterations=6))
BONE = SIL & (a >= 150)

P = lambda *pts: Polygon(pts).buffer(0)
L = lambda w, *pts: LineString(pts).buffer(w / 2, cap_style=1)
C = lambda x, y, r=12: Point(x, y).buffer(r)
def half(p0, p1, w, side):
    """One side of a band from p0 to p1 (side +1 = left of the direction p0 -> p1, -1 = right)."""
    p0, p1 = np.array(p0, float), np.array(p1, float); u = (p1 - p0) / np.linalg.norm(p1 - p0); v = np.array([-u[1], u[0]]) * side
    q = [p0, p1, p1 + v * w / 2, p0 + v * w / 2]
    return Polygon([tuple(x) for x in q]).buffer(1.5)

# region: geometry; mask: True = bone pixels inside the region, False = the region itself; grow: tap widening
R = {
  # joints (circles, Základ / Pro zvídavé as in data/kostra.js)
  "ramenni-kloub": ([C(388, 372, 13)], False, 0),
  "loketni-kloub": ([C(413, 462), C(484, 450)], False, 0),
  "zapestni-kloub": ([C(366, 616, 11), C(506, 620, 11)], False, 0),
  "kycelni-kloub": ([C(838, 300, 13)], False, 0),
  "kolenni-kloub": ([C(693, 393, 13), C(743, 433, 13)], False, 0),
  "hlezenni-kloub": ([C(756, 570, 12), C(888, 556, 12)], False, 0),
  # head
  "zuby": ([P((214, 250), (236, 246), (285, 238), (292, 250), (262, 262), (234, 270), (224, 284), (212, 270))], True, 3),
  "dolni-celist": ([P((222, 266), (262, 260), (292, 250), (300, 236), (312, 244), (312, 262), (296, 276), (262, 284), (232, 290), (220, 282))], True, 3),
  "lebka": ([P((200, 262), (206, 236), (224, 210), (240, 192), (262, 176), (300, 168), (330, 172), (340, 196), (338, 226), (318, 240), (300, 232), (262, 244), (230, 252), (210, 268))], True, 3),
  # spine
  "nosic": ([P((334, 205), (352, 200), (360, 222), (340, 228))], True, 3),
  "cepovec": ([P((338, 228), (360, 222), (368, 252), (344, 256))], True, 3),
  "krcni-obratle": ([P((330, 200), (356, 196), (372, 236), (382, 300), (378, 336), (356, 338), (346, 300), (336, 248))], True, 3),
  "kost-krizova": ([P((800, 246), (852, 252), (858, 268), (806, 270))], True, 3),
  "panev": ([P((770, 258), (800, 252), (840, 270), (892, 288), (894, 316), (862, 324), (830, 318), (802, 302), (774, 284))], True, 3),
  "hrudni-obratle": ([P((466, 252), (560, 228), (690, 222), (694, 270), (560, 282), (476, 292))], True, 3),
  "bederni-obratle": ([P((694, 216), (790, 228), (800, 250), (800, 272), (694, 272))], True, 3),
  "ocasni-obratle": ([L(9, (852, 262), (880, 266), (912, 278), (928, 300), (932, 340), (938, 400), (948, 460), (958, 500), (972, 540), (990, 570), (1010, 600), (1032, 620))], False, 0),
  # trunk
  "lopatka": ([P((376, 290), (404, 264), (440, 258), (470, 270), (476, 300), (436, 332), (410, 368), (394, 386), (378, 352))], True, 3),
  "klicni-kost": ([L(7, (343, 354), (354, 357), (366, 361))], False, 0),  # the thin rod in front of the shoulder joint
  "zebra": ([P((400, 300), (470, 290), (560, 282), (640, 280), (660, 320), (640, 400), (600, 420), (470, 414), (404, 396), (396, 340))], True, 2),
  # front legs (far leg on the left, near leg on the right); long bones are bands along the bone
  "kost-pazni": ([L(16, (338, 350), (408, 452)), L(18, (394, 384), (482, 442))], False, 0),
  "kost-vretenni": ([half((414, 462), (370, 612), 20, 1), half((498, 456), (500, 612), 20, 1)], False, 0),
  "kost-loketni": ([half((414, 462), (370, 612), 20, -1), C(416, 452, 7), half((498, 456), (500, 612), 20, -1), C(500, 444, 7)], False, 0),
  "kosti-zapestni": ([P((352, 616), (376, 616), (374, 636), (348, 636)), P((494, 620), (518, 620), (520, 640), (494, 640))], True, 3),
  "kosti-zaprstni": ([P((340, 636), (374, 636), (366, 668), (334, 668)), P((490, 640), (522, 640), (522, 672), (490, 672))], True, 3),
  "prsty-predni": ([P((316, 666), (370, 666), (366, 704), (312, 704)), P((474, 670), (526, 670), (528, 706), (472, 706))], True, 3),
  # hind legs (leg 1: knee at 693, leg 2: knee at 743)
  "ceska": ([C(684, 384, 9), C(734, 424, 9)], False, 0),
  "kost-stehenni": ([L(18, (836, 300), (696, 388)), L(18, (834, 318), (746, 428))], False, 0),
  "kost-lytkova": ([L(7, (710, 425), (717, 450), (730, 480), (743, 510), (756, 540)), L(7, (772, 496), (820, 524), (872, 552))], False, 0),
  "kost-holenni": ([L(16, (692, 404), (693, 420), (700, 450), (715, 480), (732, 510), (750, 540), (756, 552)), L(18, (746, 448), (760, 470), (800, 498), (840, 524), (882, 546))], False, 0),
  "kost-patni": ([L(14, (758, 556), (774, 590)), L(14, (892, 520), (896, 548))], False, 0),
  "kosti-nartni": ([L(15, (762, 602), (746, 664)), L(16, (893, 580), (894, 664))], False, 0),
  "hrudni-kost": ([L(14, (470, 414), (520, 422), (592, 424))], False, 0),
  "prsty-zadni": ([P((694, 664), (752, 664), (750, 702), (690, 702)), P((850, 664), (906, 664), (908, 702), (850, 702))], True, 3),
}
ORDER = list(R)
NESTED = {"pater": ["krcni-obratle", "hrudni-obratle", "bederni-obratle", "kost-krizova", "ocasni-obratle"],
          "krcni-obratle": ["nosic", "cepovec"], "panev": ["kost-krizova"], "lebka": ["zuby", "dolni-celist"]}

def bone_area(g, grow):
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    for p in ([g] if g.geom_type == "Polygon" else g.geoms): d.polygon(list(p.exterior.coords), fill=255)
    mm = (np.array(m) > 0) & BONE
    mm = nd.binary_fill_holes(nd.binary_closing(mm, iterations=2))
    cs, _ = cv2.findContours(mm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    gs = [Polygon(c[:, 0, :]).buffer(0) for c in cs if len(c) >= 3 and cv2.contourArea(c) > 12]
    return unary_union(gs).buffer(grow).intersection(g.buffer(grow)) if gs else Polygon()

shapes = {}
for k, (geoms, use_mask, grow) in R.items():
    g = unary_union(geoms)
    shapes[k] = bone_area(g, grow) if use_mask else g

def rings(g):
    out = []
    for p in ([g] if g.geom_type == "Polygon" else [q for q in getattr(g, "geoms", []) if q.geom_type == "Polygon"]):
        p = shapely.set_precision(p.simplify(0.7), 0.1)
        for q in ([p] if p.geom_type == "Polygon" else list(getattr(p, "geoms", []))):
            if q.geom_type == "Polygon" and q.area > 20: out.append([[round(x, 1), round(y, 1)] for x, y in list(q.exterior.coords)[:-1]])
    return out

def related(a, b):  # a contains b or b contains a (directly or through a chain)
    def down(x): return set(NESTED.get(x, [])).union(*[down(c) for c in NESTED.get(x, [])]) if x in NESTED else set()
    return b in down(a) or a in down(b)
# earlier areas win; a parent and its children overlap on purpose (atlas rule: the smaller one wins taps)
res = {}
for k in ORDER:
    res[k] = shapes[k].difference(unary_union([res[o] for o in res if not related(k, o)] or [Polygon()]))
res["pater"] = unary_union([res[k] for k in NESTED["pater"]])  # the spine is the union of its parts
out = {k: rings(v) for k, v in res.items() if not v.is_empty}
json.dump({"width": W, "height": H, "areas": out, "nested": NESTED}, open(os.path.join(HERE, "pl11.json"), "w"))
im = Image.open(IMG).convert("RGBA"); ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
cols = [(230, 50, 50), (40, 120, 230), (30, 170, 60), (230, 140, 0), (160, 50, 200), (0, 170, 170), (220, 0, 140), (120, 120, 0)]
for i, k in enumerate(ORDER):  # pater is not drawn (it is the union of its parts)
    for p in out.get(k, []): d.polygon([tuple(q) for q in p], fill=cols[i % 8] + (90,), outline=cols[i % 8] + (255,))
Image.alpha_composite(im, ov).save(os.path.join(HERE, "check-pl11.png"))
print({k: len(v) for k, v in out.items()})
