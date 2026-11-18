"""Kočičí rentgen stage 3 (#43): builds everything the screen needs from the fitted figures.

- images/rentgen/xray-base.webp: the cat as an X-ray film (dark blue body on a dark background);
- images/rentgen/layer-kosti.webp, layer-svaly.webp: the warped 1901 lines, glowing (white / pink), transparent;
- images/rentgen/layer-organy.webp: the warped organ drawing in its own colours, transparent;
  (all three at twice the photo size, so lines stay sharp on a tablet)
- data/rentgen.js: the clickable areas of the three figures warped onto the photo (photo pixels), clipped to the
  cat, with each structure's content (kostra / organy / svaly) and the figure's nesting;
- tools/rentgen/check-hotspots.png: all warped areas over the photo, for checking.
Run: python3 tools/rentgen/build.py"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
import shapely
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
import warp

SCALE = 2
LAYERS = [  # mode in the app, figure in landmarks.json, hotspot figure id, hotspot layers, content
    ("kosti", "skeleton", "skeleton", ["kosti", "klouby"], "kostra"),
    ("organy", "organs", "organs-side", ["organy"], "organy"),
    ("svaly", "muscles", "muscles-superficial", ["svaly"], "svaly"),
]

def hotspots():
    js = "global.window={};require('./data/hotspots-kostra.js');console.log(JSON.stringify(window.ATLAS_DATA.hotspots))"
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))

def silhouette_poly():
    m = warp.silhouette(1, grow=2) > 0.5
    import cv2
    cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(cs, key=cv2.contourArea)
    return Polygon(c[:, 0, :]).buffer(0)

def _unused_densify(p, step=6.0):
    out = []
    for i in range(len(p)):
        a, b = np.array(p[i], float), np.array(p[(i + 1) % len(p)], float)
        n = max(1, int(np.ceil(np.hypot(*(b - a)) / step)))
        out += [a + (b - a) * t for t in np.arange(n) / n]
    return np.array(out)

def rings(g):
    ps = [g] if g.geom_type == "Polygon" else [q for q in getattr(g, "geoms", []) if q.geom_type == "Polygon"]
    out = []
    for p in ps:
        p = shapely.set_precision(p.simplify(0.6), 0.1)
        if p.is_empty or p.area < 30: continue
        for q in ([p] if p.geom_type == "Polygon" else list(p.geoms)):
            out.append([[round(x, 1), round(y, 1)] for x, y in list(q.exterior.coords)[:-1]])
    return out

def build_areas(H, sil):
    """Each clickable area is filled into a mask on its figure, the mask is warped like the drawing, and its
    outline in the photo becomes the new area. (Warping only the outline tears areas that cross a joint.)"""
    import cv2
    areas = {}; nested = {}
    for mode, fig, figid, layers, content in LAYERS:
        h = H[figid]; f = warp.L[fig]
        for layer in layers:
            for sid, polys in h["layers"][layer].items():
                m = Image.new("L", (f["width"], f["height"]), 0); d = ImageDraw.Draw(m)
                for p in polys:
                    d.polygon([((f["width"] - x) if f["mirror"] else x, y) for x, y in p], fill=255)
                w = warp.warp_array(fig, np.array(m), 1) > 127
                cs, _ = cv2.findContours(w.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
                gs = [Polygon(c[:, 0, :]).buffer(0) for c in cs if len(c) >= 3]
                g = unary_union(gs).intersection(sil) if gs else Polygon()
                rs = rings(g)
                if rs: areas.setdefault(mode, {})[sid] = {"content": content, "polys": rs}
        for k, v in (h.get("nested") or {}).items(): nested[k] = v
    return areas, nested

def glow_layer(fig, color, scale, line=(245, 250, 255), strength=1.0):
    w, _ = warp.warp_image(fig, scale=scale)
    a = np.array(w).astype(float)
    lines = np.clip((215 - a[..., :3].mean(axis=2)) / 100, 0, 1) * (a[..., 3] / 255)
    glow = np.array(Image.fromarray((lines * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4 * scale))) / 255
    out = np.zeros(a.shape)
    lines = lines * strength
    alpha = np.clip(lines + glow * 0.55 * strength, 0, 1)
    col = np.array(color, float)
    mix = lines / np.maximum(alpha, 1e-6)
    out[..., :3] = col * (1 - mix[..., None]) + np.array(line, float) * mix[..., None]
    out[..., 3] = alpha * 255
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))

def organ_layer(scale):
    w, _ = warp.warp_image("organs", scale=scale)
    a = np.array(w).astype(float)
    sat = a[..., :3].max(axis=2) - a[..., :3].min(axis=2); lum = a[..., :3].mean(axis=2)
    grey = (sat < 18) & (lum > 70)                     # the grey cat and its grey outline; black organ borders stay
    a[..., 3] = np.where(grey, 0, a[..., 3])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))

def xray_base(scale):
    ph = Image.open(os.path.join(ROOT, warp.L["photo"]["image"])).convert("L")
    W, H = ph.size[0] * scale, ph.size[1] * scale
    g = np.array(ph.resize((W, H), Image.LANCZOS)).astype(float)
    sil = warp.silhouette(scale, grow=0)[:H, :W]
    bg = np.array([8, 14, 28], float)
    body = np.stack([18 + 0.22 * g, 36 + 0.32 * g, 66 + 0.42 * g], axis=2)
    img = bg * (1 - sil[..., None]) + body * sil[..., None]
    return Image.fromarray(img.clip(0, 255).astype(np.uint8))

if __name__ == "__main__":
    H = hotspots(); sil = silhouette_poly()
    areas, nested = build_areas(H, sil)
    ph = warp.L["photo"]
    data = {"image": ph["image"], "width": ph["width"], "height": ph["height"], "scale": SCALE,
            "base": "images/rentgen/xray-base.webp",
            "layers": [{"id": m, "image": f"images/rentgen/layer-{m}.webp"} for m, *_ in LAYERS],
            "areas": areas, "nested": nested}
    with open(os.path.join(ROOT, "data", "rentgen-areas.js"), "w", encoding="utf-8") as fh:
        fh.write("/*\n * Kočičí rentgen (#43): generated by tools/rentgen/build.py, do not edit by hand.\n"
                 " * areas: per layer (kosti / organy / svaly), the clickable areas of the 1901 figures and of the organ\n"
                 " * drawing, warped onto the photo (photo pixels) and clipped to the cat; content = where the structure's card is.\n"
                 " * nested: smaller structures drawn inside a bigger one (the smaller wins a tap). Positions are approximate.\n */\n"
                 "window.ATLAS_DATA = window.ATLAS_DATA || {};\nwindow.ATLAS_DATA.rentgenAreas = ")
        json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
        fh.write(";\n")
    out = os.path.join(ROOT, "images", "rentgen")
    xray_base(SCALE).save(os.path.join(out, "xray-base.webp"), "WEBP", quality=82)
    glow_layer("skeleton", [120, 180, 230], SCALE).save(os.path.join(out, "layer-kosti.webp"), "WEBP", quality=72, method=6)
    glow_layer("muscles", [220, 70, 90], SCALE, line=(255, 150, 160), strength=0.75).save(os.path.join(out, "layer-svaly.webp"), "WEBP", quality=65, method=6)
    organ_layer(SCALE).save(os.path.join(out, "layer-organy.webp"), "WEBP", quality=85, method=6)
    # check picture
    im = Image.open(os.path.join(ROOT, ph["image"])).convert("RGBA"); ov = Image.new("RGBA", im.size); d = ImageDraw.Draw(ov)
    cols = {"kosti": (230, 230, 60), "organy": (220, 40, 40), "svaly": (40, 110, 230)}
    for m, items in areas.items():
        for sid, v in items.items():
            for p in v["polys"]: d.polygon([tuple(q) for q in p], outline=cols[m] + (255,), fill=cols[m] + (40,))
    Image.alpha_composite(im, ov).save(os.path.join(HERE, "check-hotspots.png"))
    for m, items in areas.items(): print(m, len(items), "areas")
    for f in ("xray-base", "layer-kosti", "layer-svaly", "layer-organy"):
        print(f, os.path.getsize(os.path.join(out, f + ".webp")) // 1024, "KB")
