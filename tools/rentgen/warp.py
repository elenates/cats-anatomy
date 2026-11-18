"""Kočičí rentgen (#43): fits a figure onto the photo and writes an overlay for checking:
tools/rentgen/check-<figure>.png (lines of the warped figure over the photo, photo landmarks as yellow rings).

- Body: thin-plate spline through the landmarks that the photo and the figure share (only "body_only" ones
  when the figure lists them).
- Legs (figures with "segments"): every leg segment is moved by its own straight-line transform from its two
  ends in the figure to the two photo points; across the bone it is scaled like the body. A bent or lifted leg
  then follows the photo. Pixels of the figure inside a segment's strip are drawn by that segment only.
Usage: python3 tools/rentgen/warp.py [skeleton|organs|muscles ...]"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.interpolate import RBFInterpolator
from scipy.ndimage import map_coordinates
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
L = json.load(open(os.path.join(HERE, "landmarks.json")))

def mx(fig, x):
    return L[fig]["width"] - x if L[fig]["mirror"] else x

def pts(fig):
    return {k: (mx(fig, x), y) for k, (x, y) in L[fig]["points"].items()}

def mapping(fig, smooth=None):
    """thin-plate spline photo -> figure (inv) and figure -> photo (fwd), figure in mirrored coordinates."""
    P, F = pts("photo"), pts(fig)
    use = L[fig].get("body_only")
    keys = [k for k in F if k in P and (not use or k in use)]
    if smooth is None: smooth = L[fig].get("smooth", 0.0)
    p = np.array([P[k] for k in keys], float); f = np.array([F[k] for k in keys], float)
    return keys, RBFInterpolator(p, f, kernel="thin_plate_spline", smoothing=smooth), RBFInterpolator(f, p, kernel="thin_plate_spline", smoothing=smooth)

def body_scale(fig):
    P, F = pts("photo"), pts(fig)
    return np.hypot(*np.subtract(P["tailbase"], P["nose"])) / np.hypot(*np.subtract(F["tailbase"], F["nose"]))

class Segment:
    """Straight-line transform of one leg segment: figure strip (mirrored coords) -> photo."""
    def __init__(self, fig, s, cross):
        P = pts("photo")
        self.name = s["name"]; self.w = s["width"] / 2
        self.f0 = np.array([mx(fig, s["fig"][0][0]), s["fig"][0][1]], float); self.f1 = np.array([mx(fig, s["fig"][1][0]), s["fig"][1][1]], float)
        self.q0 = np.array(P[s["from"]], float); self.q1 = np.array(P[s["to"]], float)
        self.lf = np.linalg.norm(self.f1 - self.f0); self.lq = np.linalg.norm(self.q1 - self.q0)
        self.uf = (self.f1 - self.f0) / self.lf; self.vf = np.array([-self.uf[1], self.uf[0]])
        self.uq = (self.q1 - self.q0) / self.lq; self.vq = np.array([-self.uq[1], self.uq[0]])
        self.cross = cross
    def local(self, f):   # figure point -> (t along 0..1, n across in figure px)
        d = f - self.f0
        return d @ self.uf / self.lf, d @ self.vf
    def inside(self, f, pad=0.0):
        t, n = self.local(f)
        return (t >= -pad) & (t <= 1 + pad) & (np.abs(n) <= self.w)
    def fwd(self, f):
        t, n = self.local(f)
        return self.q0 + np.outer(t, self.q1 - self.q0) + np.outer(n * self.cross, self.vq)
    def inv(self, q):
        d = q - self.q0
        t = d @ self.uq / self.lq; n = d @ self.vq / self.cross
        return self.f0 + np.outer(t, self.f1 - self.f0) + np.outer(n, self.vf)

def segments(fig):
    c = body_scale(fig)
    return [Segment(fig, s, c) for s in L[fig].get("segments", [])]

def forward(fig, f):
    """figure points (mirrored coords, N x 2) -> photo points, legs by their segment."""
    _, _, tps = mapping(fig); f = np.asarray(f, float); out = tps(f)
    done = np.zeros(len(f), bool)
    for s in segments(fig):
        m = s.inside(f) & ~done
        if m.any(): out[m] = s.fwd(f[m]); done |= m
    return out

def silhouette(scale=1, grow=6):
    """The cat in the photo (white background removed), grown by a few pixels, as a 0..1 mask."""
    from scipy.ndimage import binary_dilation, gaussian_filter, zoom
    a = np.array(Image.open(os.path.join(ROOT, L["photo"]["image"])).convert("RGB")).astype(int)
    m = (a < 238).any(axis=2)
    if grow > 0: m = binary_dilation(m, iterations=grow)   # (iterations=0 would grow without end)
    m = m.astype(float)
    m = gaussian_filter(m, 1.5)
    return zoom(m, scale, order=1) if scale != 1 else m

_SRC_CACHE = {}
def source_points(fig, scale=1):
    """For every pixel of the photo frame (x scale): where it comes from in the figure (mirrored coords), and
    whether that pixel is drawn (inside a leg strip of its own segment, or a body pixel outside all strips)."""
    key = (fig, scale)
    if key in _SRC_CACHE: return _SRC_CACHE[key]
    _, inv, _ = mapping(fig)
    ph = L["photo"]; W, H = ph["width"] * scale, ph["height"] * scale
    yy, xx = np.mgrid[0:H, 0:W]
    q = np.c_[xx.ravel(), yy.ravel()].astype(float) / scale
    src = inv(q); owner = np.full(len(q), -1)
    segs = segments(fig)
    body_in_seg = np.zeros(len(q), bool)
    for s_ in segs: body_in_seg |= s_.inside(src)
    for i, s_ in enumerate(segs):            # a segment draws the photo pixels whose source lies in its strip
        f = s_.inv(q); m = s_.inside(f) & (owner < 0)
        src[m] = f[m]; owner[m] = i
    keep = (owner >= 0) | ~body_in_seg       # the body spline does not draw leg strips
    _SRC_CACHE[key] = (src, keep, W, H)
    return _SRC_CACHE[key]

def warp_array(fig, arr, scale=1, order=1):
    """Warps any array the size of the (mirrored) figure image onto the photo frame."""
    src, keep, W, H = source_points(fig, scale)
    sh, sw = arr.shape[:2]
    inside = (src[:, 0] >= 0) & (src[:, 0] < sw) & (src[:, 1] >= 0) & (src[:, 1] < sh) & keep
    chans = arr[..., None] if arr.ndim == 2 else arr
    out = np.zeros((len(src), chans.shape[2]))
    for c in range(chans.shape[2]):
        out[:, c] = map_coordinates(chans[..., c].astype(float), [src[:, 1], src[:, 0]], order=order, mode="constant", cval=0)
    out[~inside] = 0
    return out.reshape(H, W, chans.shape[2]) if arr.ndim == 3 else out.reshape(H, W)

def warp_image(fig, scale=1, clip=True):
    """The figure warped onto the photo frame (RGBA, photo size x scale), bilinear sampling. clip: nothing is
    drawn outside the cat (stray letters and line ends of the figure)."""
    src = Image.open(os.path.join(ROOT, L[fig]["image"])).convert("RGBA")
    if L[fig]["mirror"]: src = src.transpose(Image.FLIP_LEFT_RIGHT)
    out = warp_array(fig, np.array(src), scale)
    if clip: out[..., 3] *= silhouette(scale)[: out.shape[0], : out.shape[1]]
    return Image.fromarray(out.clip(0, 255).astype(np.uint8)), segments(fig)

if __name__ == "__main__":
    photo = Image.open(os.path.join(ROOT, L["photo"]["image"])).convert("RGBA")
    for fig in sys.argv[1:] or ["skeleton", "organs", "muscles"]:
        w, segs = warp_image(fig)
        a = np.array(w).astype(float)
        if fig in ("skeleton", "muscles"):
            lum = a[..., :3].mean(axis=2); alpha = np.clip((235 - lum) / 120, 0, 1) * (a[..., 3] / 255)
            a[..., :3] = [200, 0, 60] if fig == "skeleton" else [0, 60, 200]; a[..., 3] = alpha * 255
        else:
            grey = (np.abs(a[..., 0] - a[..., 1]) < 8) & (np.abs(a[..., 1] - a[..., 2]) < 8) & (a[..., 0] > 150)
            a[..., 3] = np.where(grey, 0, a[..., 3] * 0.75)
        ov = Image.alpha_composite(photo, Image.fromarray(a.astype(np.uint8)))
        d = ImageDraw.Draw(ov); P = pts("photo")
        for k in P: x, y = P[k]; d.ellipse([x - 4, y - 4, x + 4, y + 4], outline=(255, 200, 0, 255), width=2)
        ov.save(os.path.join(HERE, f"check-{fig}.png")); print(fig, "segments:", len(segs))
