"""Kočičí rentgen (#43), stage 4: Pl. XI in the X-ray look of the screen (dark blue cat, glowing white bones).

Inside the dark body shading of the plate, the plate's brightness is mapped from dark blue (shading) to white
(bones); the paper around the cat turns almost black. The tail lies outside the shading, so the tail area of
pl11.json is coloured from the drawing's strokes instead. A light blur adds a soft glow.
Writes images/rentgen/1845/kostra-rentgen.webp (same size as Pl. XI). Run after build_pl11.py;
fit_pl1.py then moves this picture onto the Pl. I cat for the magnifying glass."""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
SRC = os.path.join(ROOT, "images/rentgen/1845/kostra.webp"); OUT = os.path.join(ROOT, "images/rentgen/1845/kostra-rentgen.webp")
BLUE, WHITE, BG = np.array([12, 30, 68.]), np.array([235, 245, 255.]), np.array([6, 12, 26.])

def main():
    a = np.array(Image.open(SRC).convert("L")).astype(float); H, W = a.shape
    dark = nd.binary_closing(a < 170, iterations=3)
    lab, n = nd.label(dark); body = lab == (1 + np.argmax(nd.sum(dark, lab, range(1, n + 1))))
    sil = nd.binary_fill_holes(nd.binary_closing(body, iterations=6))
    edge = sil & ~nd.binary_erosion(sil, iterations=5)
    sil &= ~(edge & (a > 212))                        # paper caught in the outline's corners
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    for p in json.load(open(os.path.join(HERE, "pl11.json")))["areas"]["ocasni-obratle"]: d.polygon([tuple(q) for q in p], fill=255)
    tail = (np.array(m) > 0) & ~sil
    v = np.clip((a - 105) / 120, 0, 1) ** 1.4
    out = np.where(sil[..., None], BLUE * (1 - v[..., None]) + WHITE * v[..., None], BG)
    tv = np.clip((235 - a) / 80, 0, 1) * 0.5 + 0.45
    out = np.where(tail[..., None], BLUE * (1 - tv[..., None]) + WHITE * tv[..., None], out)
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    glow = np.maximum(np.array(img), np.array(img.filter(ImageFilter.GaussianBlur(3))))
    Image.blend(img, Image.fromarray(glow), 0.5).save(OUT, quality=86, method=6)
    print(OUT, os.path.getsize(OUT) // 1024, "KB")

if __name__ == "__main__":
    main()
