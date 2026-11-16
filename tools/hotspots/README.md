# Hotspot build scripts (reference)

These scripts produced the first version of the organ and muscle hotspots in `data/hotspots-kostra.js`. They are here so the method can be checked and repeated. **For normal changes use `tools/hotspot-editor.html`**, which loads and exports `data/hotspots-kostra.js` exactly.

| Folder | Figures | Method |
|---|---|---|
| `organs-side/` | `organs-side` (whole-body organ drawing, *Scheme cat anatomy.svg*) | `outline.py` samples each organ shape of the SVG into `outlines.json` (included). It needs the SVG with labels removed as `nolabels.svg`, which is not in the repo. `build.py` computes the visible part of every organ by drawing order and cuts it into organs → `hs.json`. `varle.py` adds the testis (stage 7). |
| `closeups/` | stomach, pancreas-spleen, lungs, kidney, kidney-section, heart, heart-open, brain (1901 Figs.) | `sil.py` makes ink silhouettes from `images/organy/*.webp`. `build.py` carves them with hand-made cut polygons in priority order → `hs.json`. `emit.py` appended those blocks to the data file once; do not run it again. |
| `repro/` | repro-male, repro-female (Figs. 111, 112) | Hand polygons, ellipses and bands, carved in order → `hs.json`, plus overlay previews `ov_*.png`. |
| `svaly/` | muscles-superficial, muscles-deep, muscles-hindleg (Figs. 68, 73, 90) | Hand polygons read from gridded crops, carved in order (`build68.py`, `build73.py`, `build90.py` → `hs68/73/90.json`, overlays `ov68/73/90.png`). Thin items are widened only into areas that have no card. On Fig. 90 the tenuissimus strip (g) is cut out, so a tap on it opens nothing. On Fig. 68 *Svaly stehna* is one group with the four single thigh muscles nested in it. `emit.py` appended the blocks to the data file once; do not run it again. |

Each `build.py` writes `hs.json` next to itself (git-ignored). Running them now reproduces the polygons that were imported into the data file.

Rules that apply to every hotspot:
- Polygons must not overlap (the tap would be ambiguous). The smallest polygon wins only for structures listed in `nested`.
- Polygons must have no holes; split rings with thin cuts.
- Thin structures are widened to about 44 px at tablet size, without taking area from neighbours.

Requirements: Python 3 with `shapely`, `numpy`, `scipy`, `opencv-python`, `Pillow`, `playwright` (only for `outline.py`) and Node.js (for `varle.py`).
