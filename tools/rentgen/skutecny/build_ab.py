"""Kočičí rentgen (#43), stage 3c: clickable bones on the two real X-rays.

A = images/rentgen/skutecny/predni-cast.webp (front of the body, head to the left).
B = images/rentgen/skutecny/zadni-cast.webp (back of the body, head to the right).
On a real X-ray bone and soft tissue overlap, so the areas are hand-drawn shapes in image pixels
(bands along long bones and the spine, circles on joints, polygons for flat bones), not masks.
Areas are cut against each other in ORDER (earlier wins); nested structures keep their full area.
Writes tools/rentgen/skutecny/ab.json and the check pictures check-a.png and check-b.png."""
import json, os
from PIL import Image, ImageDraw, ImageOps
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
import shapely

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
P = lambda *pts: Polygon(pts).buffer(0)
L = lambda w, *pts: LineString(pts).buffer(w / 2, cap_style=1)
C = lambda x, y, r: Point(x, y).buffer(r)

FIGS = {
  "predni-cast": {
    "image": "images/rentgen/skutecny/predni-cast.webp",
    "areas": {
      "ramenni-kloub": [C(398, 632, 38)],
      "lopatka": [P((400, 600), (470, 560), (560, 470), (640, 330), (720, 330), (700, 450), (560, 600), (470, 650))],
      "kost-pazni": [L(62, (372, 676), (340, 820), (318, 950), (306, 1050))],
      "krcni-obratle": [L(84, (210, 196), (300, 296), (400, 398), (500, 476), (566, 526))],
      "hrudni-obratle": [L(76, (600, 534), (760, 500), (900, 462), (1050, 414), (1200, 368), (1400, 312), (1600, 286))],
      "hrudni-kost": [L(40, (560, 732), (700, 760), (900, 786), (1050, 798), (1220, 808))],
      "zebra": [P((600, 572), (900, 502), (1200, 408), (1420, 348), (1600, 330), (1600, 860), (1300, 842), (1000, 818), (700, 778), (600, 744))],
    },
    "nested": {"pater": ["krcni-obratle", "hrudni-obratle"]},
  },
  "zadni-cast": {
    "image": "images/rentgen/skutecny/zadni-cast.webp",
    "areas": {
      "kycelni-kloub": [C(232, 268, 30)],
      "kolenni-kloub": [C(198, 940, 38), C(312, 930, 44)],
      "kost-stehenni": [L(38, (222, 292), (212, 600), (196, 900)), L(44, (258, 292), (282, 600), (310, 884))],
      "kost-holenni": [L(60, (170, 925), (80, 915), (0, 905))],
      "ocasni-obratle": [L(70, (0, 98), (160, 92), (330, 110))],
      "kost-krizova": [P((330, 104), (500, 112), (512, 202), (336, 172))],
      "panev": [P((0, 230), (120, 210), (300, 196), (480, 182), (560, 190), (560, 244), (420, 252), (330, 272), (332, 420), (150, 420), (30, 400), (0, 350))],
      "bederni-obratle": [P((500, 112), (1240, 104), (1240, 216), (512, 222))],
      "hrudni-obratle": [P((1240, 104), (1600, 104), (1600, 214), (1240, 216))],
      "zebra": [P((1160, 228), (1600, 214), (1600, 800), (1400, 790), (1260, 700), (1160, 520), (1150, 330))],
    },
    "nested": {"pater": ["ocasni-obratle", "kost-krizova", "bederni-obratle", "hrudni-obratle"], "panev": ["kost-krizova"]},
  },
}

def rings(g):
    out = []
    for p in ([g] if g.geom_type == "Polygon" else [q for q in getattr(g, "geoms", []) if q.geom_type == "Polygon"]):
        p = shapely.set_precision(p.simplify(1.0), 0.1)
        for q in ([p] if p.geom_type == "Polygon" else list(getattr(p, "geoms", []))):
            if q.geom_type == "Polygon" and q.area > 40: out.append([[round(x, 1), round(y, 1)] for x, y in list(q.exterior.coords)[:-1]])
    return out

def build(name, fig):
    im = Image.open(os.path.join(ROOT, fig["image"])); W, H = im.size
    frame = Polygon([(0, 0), (W, 0), (W, H), (0, H)])
    nested = fig["nested"]
    shapes = {k: unary_union(v).intersection(frame) for k, v in fig["areas"].items()}
    def related(a, b):  # a contains b or b contains a (directly or through a chain)
        def down(x): return set(nested.get(x, [])).union(*[down(c) for c in nested.get(x, [])]) if x in nested else set()
        return b in down(a) or a in down(b)
    res = {}
    for k in shapes:  # earlier areas win; a parent and its children overlap on purpose (the smaller one wins taps)
        res[k] = shapes[k].difference(unary_union([res[o] for o in res if not related(k, o)] or [Polygon()]))
    for parent, kids in nested.items():  # a parent drawn only through its parts (the spine) is the union of them
        if parent not in res: res[parent] = unary_union([res[k] for k in kids])
    out = {k: rings(v) for k, v in res.items() if not v.is_empty}
    bg = ImageOps.autocontrast(im.convert("L"), cutoff=1).convert("RGBA"); ov = Image.new("RGBA", bg.size); d = ImageDraw.Draw(ov)
    cols = [(230, 50, 50), (40, 120, 230), (30, 170, 60), (230, 140, 0), (160, 50, 200), (0, 170, 170), (220, 0, 140), (120, 120, 0)]
    for i, k in enumerate(out):
        if k in nested and k not in fig["areas"]: continue
        for p in out[k]: d.polygon([tuple(q) for q in p], fill=cols[i % 8] + (80,), outline=cols[i % 8] + (255,))
        x, y = Polygon(out[k][0]).representative_point().coords[0]; d.text((x, y), k, fill=(255, 255, 0, 255))
    Image.alpha_composite(bg, ov).convert("RGB").save(os.path.join(HERE, f"check-{name[0]}.png".replace("check-p", "check-a").replace("check-z", "check-b")))
    return {"width": W, "height": H, "areas": out, "nested": nested}

if __name__ == "__main__":
    data = {n: build(n, f) for n, f in FIGS.items()}
    json.dump(data, open(os.path.join(HERE, "ab.json"), "w"))
    print({n: {k: len(v) for k, v in d["areas"].items()} for n, d in data.items()})
