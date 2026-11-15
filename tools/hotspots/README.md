# Hotspot build scripts (reference)

These scripts produced the first version of the organ hotspots in `data/hotspots-kostra.js`. They are here so the method can be checked and repeated. **For normal changes use `tools/hotspot-editor.html`**, which loads and exports `data/hotspots-kostra.js` exactly.

| Folder | Figures | Method |
|---|---|---|
| `organs-side/` | `organs-side` (whole-body organ drawing, *Scheme cat anatomy.svg*) | `outline.py` samples each organ shape of the SVG into `outlines.json` (included). It needs the SVG with labels removed as `nolabels.svg`, which is not in the repo. `build.py` computes the visible part of every organ by drawing order and cuts it into organs → `hs.json`. `varle.py` adds the testis (stage 7). |
| `closeups/` | stomach, pancreas-spleen, lungs, kidney, kidney-section, heart, heart-open, brain (1901 Figs.) | `sil.py` makes ink silhouettes from `images/organy/*.webp`. `build.py` carves them with hand-made cut polygons in priority order → `hs.json`. `emit.py` appended those blocks to the data file once; do not run it again. |
| `repro/` | repro-male, repro-female (Figs. 111, 112) | Hand polygons, ellipses and bands, carved in order → `hs.json`, plus overlay previews `ov_*.png`. |

Each `build.py` writes `hs.json` next to itself (git-ignored). Running them now reproduces the polygons that were imported into the data file.

Rules that apply to every hotspot:
- Polygons must not overlap (the tap would be ambiguous). The smallest polygon wins only for structures listed in `nested`.
- Polygons must have no holes; split rings with thin cuts.
- Thin structures are widened to about 44 px at tablet size, without taking area from neighbours.

Requirements: Python 3 with `shapely`, `numpy`, `scipy`, `opencv-python`, `Pillow`, `playwright` (only for `outline.py`) and Node.js (for `varle.py`).
