"""Kočičí rentgen (#43), stage 3c: the clickable "special thing" on each X-ray of the Zajímavé rentgeny gallery.

Hand-drawn shapes in image pixels (images/rentgen/skutecny/<id>.webp). Some marks are only approximate:
- brezi-kocka: the kittens are hard to tell apart at 6 weeks, so the whole belly beside the spine is marked
  (not the stomach and not the spine);
- mocove-kameny: the file page says only "urinary stones"; the mark is the group of round bright shadows
  in the belly, which is where they look like stones.
Writes tools/rentgen/skutecny/galerie.json and the check picture tools/rentgen/skutecny/check-galerie.png."""
import json, os
from PIL import Image, ImageDraw
from shapely.geometry import Polygon, LineString, Point, box
from shapely.ops import unary_union
import shapely

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
P = lambda *pts: Polygon(pts).buffer(0)
L = lambda w, *pts: LineString(pts).buffer(w / 2, cap_style=1)
C = lambda x, y, r: Point(x, y).buffer(r)

# image id: [(area id, label, shapes)]
G = {
  "brezi-kocka": [("kotata", "Koťata v bříšku", [
      P((60, 400), (150, 260), (390, 240), (390, 900), (150, 880), (60, 700)),
      P((470, 560), (700, 420), (860, 480), (900, 620), (820, 820), (620, 900), (470, 880))])],
  "mikrocip": [("mikrocip", "Mikročip", [L(44, (742, 520), (852, 516))])],
  "jehla": [("jehla", "Spolknutá jehla", [L(40, (540, 505), (910, 712))])],
  "prsty-navic": [("prsty-navic", "Prsty navíc", [P((276, 340), (372, 340), (376, 470), (276, 472)),
                                                 P((500, 356), (596, 356), (598, 490), (500, 490))])],
  "kontrastni-latka": [("kontrastni-latka", "Kontrastní látka v žaludku a ve střevech", [
      P((100, 260), (170, 215), (300, 215), (345, 300), (350, 420), (330, 640), (260, 640), (220, 520), (110, 400)),
      P((790, 150), (940, 145), (950, 260), (930, 470), (780, 470), (770, 260))])],
  "zlomena-panev": [("zlomenina", "Zlomená pánev", [P((290, 495), (348, 486), (350, 566), (292, 570)),
                                                    P((366, 476), (442, 476), (444, 570), (366, 570))])],
  "mocove-kameny": [("kameny", "Močové kameny", [P((496, 260), (580, 250), (600, 205), (660, 200), (664, 262), (610, 306), (496, 306))])],
  "kolicek-v-koleni": [("kolicek", "Kovový kolíček", [L(22, (116, 262), (119, 254), (216, 252))])],
  "munchkin": [("kratke-nohy", "Munchkin: krátké nohy", [box(81, 0, 688, 334), box(81, 385, 688, 719), box(81, 780, 688, 1133)]),
               ("bezne-nohy", "Kočka s běžnými nohami", [box(766, 0, 1418, 334), box(766, 385, 1418, 719), box(766, 780, 1418, 1133)])],
}

def rings(g):
    out = []
    for p in ([g] if g.geom_type == "Polygon" else list(g.geoms)):
        p = shapely.set_precision(p.simplify(1.0), 0.1)
        out.append([[round(x, 1), round(y, 1)] for x, y in list(p.exterior.coords)[:-1]])
    return out

def main():
    data, tiles = {}, []
    for n, areas in G.items():
        im = Image.open(os.path.join(ROOT, f"images/rentgen/skutecny/{n}.webp")).convert("RGB"); W, H = im.size
        frame = box(0, 0, W, H)
        data[n] = {"image": f"images/rentgen/skutecny/{n}.webp", "width": W, "height": H,
                   "areas": [{"id": a, "label": lab, "shapes": rings(unary_union(s).intersection(frame))} for a, lab, s in areas]}
        ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
        for i, a in enumerate(data[n]["areas"]):
            col = [(255, 60, 60), (60, 160, 255)][i % 2]
            for r in a["shapes"]: d.polygon([tuple(q) for q in r], fill=col + (70,), outline=col + (255,), width=3)
        t = Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB"); t.thumbnail((420, 420)); tiles.append(t)
    sheet = Image.new("RGB", (3 * 420, 3 * 420), "black")
    for i, t in enumerate(tiles): sheet.paste(t, ((i % 3) * 420, (i // 3) * 420))
    sheet.save(os.path.join(HERE, "check-galerie.png"))
    json.dump(data, open(os.path.join(HERE, "galerie.json"), "w"), ensure_ascii=False)
    print({n: [a["id"] for a in d["areas"]] for n, d in data.items()})

if __name__ == "__main__":
    main()
