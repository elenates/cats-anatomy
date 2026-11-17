# Fig. 170 (tympanic membrane from the inner side, images/smysly/eardrum.webp): hotspots for the
# Pro zvídavé part of the Ucho tab. Legend (1901): a bony ring, b/b' malleus, c tympanic membrane, d incus,
# e lenticular process, f chorda tympani, g its cartilaginous support.
# Only the parts the letters b, b', c, d point to get a hotspot; the striated piece below the malleus head
# (between e and g) stays without one. Traced by hand. Overlay check: ov170.png.
import os, json
from PIL import Image, ImageDraw
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
IMG = os.path.join(ROOT, "images/smysly/eardrum.webp")
W, H = Image.open(IMG).size
P = lambda pts: Polygon(pts).buffer(0)
G = {}
G["kladivko"] = unary_union([
    P([(418, 140), (420, 112), (440, 100), (465, 100), (485, 115), (490, 140), (478, 158), (455, 162), (432, 160)]),   # head b'
    LineString([(212, 241), (300, 238), (372, 232), (412, 214), (425, 175), (430, 150)]).buffer(9),                    # handle b and neck
    P([(342, 133), (380, 136), (420, 142), (420, 158), (400, 152), (360, 148)])])                                         # anterior process
G["kovadlinka"] = P([(470, 140), (492, 142), (505, 160), (525, 185), (540, 205), (545, 218), (530, 220), (510, 205), (492, 192), (470, 190), (458, 170)])
G["bubinek"] = P([(168, 222), (190, 190), (235, 172), (290, 168), (345, 175), (380, 195), (405, 235), (415, 285), (402, 322), (368, 345), (310, 357), (250, 352), (200, 333), (172, 298), (163, 258)])
order = ["kladivko", "kovadlinka", "bubinek"]
res = {}; taken = Polygon(); frame = Polygon([(0, 0), (W, 0), (W, H), (0, H)])
for k in order:
    g = G[k].intersection(frame).difference(taken); taken = unary_union([taken, g]); res[k] = g
from shapes import finalize
out = finalize(res, list(res), tol=1.0 if "95" in __file__ or "173" in __file__ else 0.8)
json.dump(out, open(os.path.join(HERE, "hs170.json"), "w"))
im = Image.open(IMG).convert("RGBA"); ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
cols = [(220, 40, 40), (40, 120, 220), (30, 160, 60)]
for i, (k, ps) in enumerate(out.items()):
    for p in ps: d.polygon([tuple(q) for q in p], fill=cols[i] + (70,), outline=cols[i] + (255,))
    print(k, len(ps), [round(Polygon(p).area) for p in ps])
Image.alpha_composite(im, ov).save(os.path.join(HERE, "ov170.png"))
