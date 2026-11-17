"""Milestone 6 (Smysly) figures: crop the 1901 page scans from the Internet Archive
(item anatomyofcat00reig, H. Holt 1901), clean the paper tone, save lossless WebP.
Usage: python3 m6_figures.py <folder with anatomyofcat00reig_NNNN.jpg> <out folder>
Each region is a search box; the crop is the bounding box of the ink inside it plus a margin."""
import sys, os
import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]
FIGS = {   # name: (leaf, search box x0, y0, x1, y1)
    "tongue":       ("0251", 1030, 645, 1760, 2312),   # Fig. 95,  page 227
    "third-eyelid": ("0434", 280, 770, 590, 1042),      # Fig. 165, page 410
    "eye":          ("0437", 1200, 1405, 1785, 2072),   # Fig. 167, page 413
    "eardrum":      ("0446", 180, 1610, 860, 2082),     # Fig. 170, page 422
    "inner-ear":    ("0449", 1290, 1440, 1740, 1790),   # Fig. 173, page 425
}
MARGIN = 12
for name, (leaf, x0, y0, x1, y1) in FIGS.items():
    page = Image.open(os.path.join(SRC, f"anatomyofcat00reig_{leaf}.jpg")).convert("L")
    a = np.asarray(page.crop((x0, y0, x1, y1)), dtype=np.float32)
    paper = np.percentile(a, 75)                        # tone of the old paper
    ink = a < paper - 60
    ys, xs = np.nonzero(ink)
    bx0, by0 = max(xs.min() - MARGIN, 0), max(ys.min() - MARGIN, 0)
    bx1, by1 = min(xs.max() + MARGIN, a.shape[1]), min(ys.max() + MARGIN, a.shape[0])
    c = a[by0:by1, bx0:bx1]
    lo, hi = 40.0, paper - 8                            # levels: paper -> white, keep line detail
    c = np.clip((c - lo) / (hi - lo) * 255, 0, 255).astype(np.uint8)
    out = os.path.join(OUT, name + ".webp")
    Image.fromarray(c).save(out, "WEBP", lossless=True)
    print(name, "leaf", leaf, "page box", tuple(int(v) for v in (x0 + bx0, y0 + by0, x0 + bx1, y0 + by1)), "size", c.shape[::-1], "paper", round(paper), os.path.getsize(out))
