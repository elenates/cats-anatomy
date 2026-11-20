"""Kočičí rentgen (#43), stage 3c: fits the skeleton (Pl. XI) onto the cat (Pl. I) for the magnifying glass.

Both plates show the cat walking to the left in nearly the same pose. A thin-plate spline through a few points
the plates share (nose, eye, ear, the four paws, back, tail) moves the skeleton plate a little so that it sits
under the cat. Only small moves are needed (the largest is about 50 px on a 1200 px plate).
Writes images/rentgen/1845/kostra-na-kocce.webp (Pl. XI in the X-ray look of xray_1845.py, moved onto Pl. I,
same size as Pl. I; the magnifying glass shows it),
tools/rentgen/1845/pl11-on-pl1.json (the clickable areas of pl11.json moved the same way) and the check picture
tools/rentgen/1845/check-fit.png (the moved skeleton over the cat, half transparent, points as rings).
Run after build_pl11.py and xray_1845.py."""
import json, os
import numpy as np
from PIL import Image, ImageDraw
from scipy.interpolate import RBFInterpolator
from scipy.ndimage import map_coordinates
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
CAT = os.path.join(ROOT, "images/rentgen/1845/kocka.webp"); SKEL = os.path.join(ROOT, "images/rentgen/1845/kostra.webp")
XRAY = os.path.join(ROOT, "images/rentgen/1845/kostra-rentgen.webp")

# point: (Pl. I cat, Pl. XI skeleton), plate pixels
POINTS = {
  "nos": ((162, 235), (203, 254)),
  "oko": ((198, 198), (244, 219)),
  "ucho": ((214, 92), (232, 112)),
  "temeno": ((262, 110), (300, 150)),
  "hrudnik-dole": ((300, 420), (360, 420)),
  "predni-tlapka-vzadu": ((288, 668), (344, 686)),
  "predni-tlapka-vpredu": ((455, 682), (500, 686)),
  "zadni-tlapka-vpredu": ((690, 682), (719, 684)),
  "zadni-tlapka-vzadu": ((852, 680), (881, 684)),
  "hrbet": ((650, 208), (650, 232)),
  "kohoutek": ((420, 236), (470, 262)),
  "koren-ocasu": ((890, 290), (894, 269)),
  "spicka-ocasu": ((1030, 640), (1035, 622)),
  "bricho": ((640, 470), (650, 450)),
}

def fit():
    c = np.array([v[0] for v in POINTS.values()], float); s = np.array([v[1] for v in POINTS.values()], float)
    corners = np.array([[0, 0], [1200, 0], [0, 877], [1200, 877]], float)  # keep the plate edges in place
    c2, s2 = np.vstack([c, corners]), np.vstack([s, corners])
    inv = RBFInterpolator(c2, s2, kernel="thin_plate_spline", smoothing=2.0)   # cat -> skeleton
    fwd = RBFInterpolator(s2, c2, kernel="thin_plate_spline", smoothing=2.0)   # skeleton -> cat
    return inv, fwd

def main():
    inv, fwd = fit()
    cat = Image.open(CAT).convert("RGB"); W, H = cat.size
    yy, xx = np.mgrid[0:H, 0:W]; q = inv(np.c_[xx.ravel(), yy.ravel()].astype(float))
    def warp(path):
        sk = np.array(Image.open(path).convert("RGB")).astype(float)
        out = np.stack([map_coordinates(sk[..., i], [q[:, 1], q[:, 0]], order=1, mode="nearest").reshape(H, W) for i in range(3)], -1)
        return Image.fromarray(out.clip(0, 255).astype(np.uint8))
    warp(XRAY).save(os.path.join(ROOT, "images/rentgen/1845/kostra-na-kocce.webp"), quality=86, method=6)
    moved = warp(SKEL)  # the plain plate, only for the check picture
    a = json.load(open(os.path.join(HERE, "pl11.json")))
    def move(ring):
        r = np.array(ring + [ring[0]], float); dense = []
        for p0, p1 in zip(r[:-1], r[1:]):
            n = max(1, int(np.hypot(*(p1 - p0)) // 6)); dense += [p0 + (p1 - p0) * t / n for t in range(n)]
        return [[round(x, 1), round(y, 1)] for x, y in fwd(np.array(dense))]
    areas = {k: [move(r) for r in rs] for k, rs in a["areas"].items()}
    json.dump({"width": W, "height": H, "areas": areas, "nested": a["nested"]}, open(os.path.join(HERE, "pl11-on-pl1.json"), "w"))
    chk = Image.blend(cat, moved, 0.5); d = ImageDraw.Draw(chk)
    for (cx, cy), _ in POINTS.values(): d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], outline=(255, 200, 0), width=2)
    chk.save(os.path.join(HERE, "check-fit.png"))
    print("largest move", round(float(np.max(np.hypot(*(q - np.c_[xx.ravel(), yy.ravel()]).T))), 1), "px")

if __name__ == "__main__":
    main()
