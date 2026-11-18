"""Kočičí rentgen stage 2 (#43): the landmark file is complete and consistent: every image exists with the
stated size, every point lies inside its image, each figure shares enough landmarks with the photo, and the
fitted mapping keeps the landmarks' order (no fold) along the body: nose -> withers -> back -> croup -> tail,
and every leg segment of the skeleton ends on its two photo points."""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from PIL import Image
sys.path.insert(0, os.path.join(ROOT, "tools", "rentgen"))
import numpy as np
import warp

r = Run("rentgen landmarks")
L = json.load(open(os.path.join(ROOT, "tools", "rentgen", "landmarks.json")))
for name in ("photo", "skeleton", "organs", "muscles"):
    f = L[name]
    im = Image.open(os.path.join(ROOT, f["image"]))
    r.ok(im.size == (f["width"], f["height"]), f"{name}: size {im.size}")
    for k, (x, y) in f["points"].items():
        r.ok(0 <= x < f["width"] and 0 <= y < f["height"], f"{name}: {k} outside the image")
for fig, need in (("skeleton", 16), ("organs", 18), ("muscles", 12)):
    keys, inv, fwd = warp.mapping(fig)
    r.ok(len(keys) >= need, f"{fig}: {len(keys)} shared landmarks")
    F = warp.pts(fig); P = warp.pts("photo")
    err = max(np.hypot(*(fwd(np.array([F[k]], float))[0] - P[k])) for k in keys)
    r.ok(err < 40, f"{fig}: landmarks land within 40 px of their photo points (max {err:.1f})")
    line = [k for k in ("nose", "poll", "withers", "back", "croup", "tailbase") if k in keys]
    xs = [fwd(np.array([F[k]], float))[0][0] for k in line]
    r.ok(all(a < b for a, b in zip(xs, xs[1:])), f"{fig}: body line keeps its order {line}")
# leg segments: both ends land on their photo points, the strip stays inside the photo frame
P = warp.pts("photo")
for sg in warp.segments("skeleton"):
    a, b = sg.fwd(np.array([sg.f0, sg.f1]))
    r.ok(np.hypot(*(a - sg.q0)) < 0.5 and np.hypot(*(b - sg.q1)) < 0.5, f"segment {sg.name}: ends on its photo points")
    r.ok(0.3 < sg.lq / sg.lf < 2.0, f"segment {sg.name}: length ratio {sg.lq / sg.lf:.2f}")
r.finish()
