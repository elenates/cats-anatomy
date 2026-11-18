"""Kočičí rentgen (#43): fits a figure onto the photo with a thin-plate spline through the matching landmarks
(tools/rentgen/landmarks.json) and writes an overlay for checking: tools/rentgen/check-<figure>.png.
Usage: python3 tools/rentgen/warp.py [skeleton|organs|muscles ...]"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.interpolate import RBFInterpolator
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
L = json.load(open(os.path.join(HERE, "landmarks.json")))

def pts(fig):
    f = L[fig]; out = {}
    for k, (x, y) in f["points"].items():
        out[k] = (f["width"] - x if f["mirror"] else x, y)
    return out

def mapping(fig, smooth=None):
    """photo -> figure coordinates (used to sample the figure image) and figure -> photo (for hotspots)."""
    P, F = pts("photo"), pts(fig)
    keys = [k for k in F if k in P]
    if smooth is None: smooth = L[fig].get("smooth", 0.0)
    p = np.array([P[k] for k in keys], float); f = np.array([F[k] for k in keys], float)
    inv = RBFInterpolator(p, f, kernel="thin_plate_spline", smoothing=smooth)
    fwd = RBFInterpolator(f, p, kernel="thin_plate_spline", smoothing=smooth)
    return keys, inv, fwd

def warp_image(fig, smooth=None):
    keys, inv, _ = mapping(fig, smooth)
    ph = L["photo"]; W, H = ph["width"], ph["height"]
    src = Image.open(os.path.join(ROOT, L[fig]["image"])).convert("RGBA")
    if L[fig]["mirror"]: src = src.transpose(Image.FLIP_LEFT_RIGHT)
    s = np.array(src); sh, sw = s.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    q = inv(np.c_[xx.ravel(), yy.ravel()].astype(float))
    qx = np.clip(np.round(q[:, 0]).astype(int), 0, sw - 1); qy = np.clip(np.round(q[:, 1]).astype(int), 0, sh - 1)
    inside = (q[:, 0] >= 0) & (q[:, 0] < sw) & (q[:, 1] >= 0) & (q[:, 1] < sh)
    out = s[qy, qx].copy(); out[~inside] = 0
    return Image.fromarray(out.reshape(H, W, 4)), keys

if __name__ == "__main__":
    photo = Image.open(os.path.join(ROOT, L["photo"]["image"])).convert("RGBA")
    for fig in sys.argv[1:] or ["skeleton", "organs", "muscles"]:
        w, keys = warp_image(fig)
        a = np.array(w).astype(float)
        if fig in ("skeleton", "muscles"):        # dark lines on white: keep the lines only
            lum = a[..., :3].mean(axis=2); alpha = np.clip((235 - lum) / 120, 0, 1) * (a[..., 3] / 255)
            a[..., :3] = [200, 0, 60] if fig == "skeleton" else [0, 60, 200]; a[..., 3] = alpha * 255
        else:
            grey = (np.abs(a[..., 0] - a[..., 1]) < 8) & (np.abs(a[..., 1] - a[..., 2]) < 8) & (a[..., 0] > 150)
            a[..., 3] = np.where(grey, 0, a[..., 3] * 0.75)
        ov = Image.alpha_composite(photo, Image.fromarray(a.astype(np.uint8)))
        d = ImageDraw.Draw(ov); P = pts("photo")
        for k in keys: x, y = P[k]; d.ellipse([x - 4, y - 4, x + 4, y + 4], outline=(255, 200, 0, 255), width=2)
        ov.save(os.path.join(HERE, f"check-{fig}.png")); print(fig, len(keys), "landmarks")
