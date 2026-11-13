# Kočičí tělo pod lupou

An interactive atlas of domestic cat anatomy for a 9-year-old learner (4th grade, Czech primary school).
All app content is in **Czech**; Latin names are an optional layer (off by default).

> Status: **v0.1 in progress** — Milestone 0 (project setup) done, Milestone 1 (Kostra / skeleton) in progress.
> Only the *Kostra* section is active; the other six sections are shown as "Připravujeme".

## How to run

No installation, no build step, no server.

- **Locally:** download or clone the repository and double-click `index.html`.
  The app works from `file://` because it uses no ES modules and no `fetch()`;
  all content data lives in plain `.js` files that assign to `window.ATLAS_DATA`.
- **Online:** GitHub Pages, deployed from the `main` branch, root folder
  (Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`).
  URL: `https://elenates.github.io/cats-anatomy/`

## Sections

| # | Section (cs) | Status |
|---|--------------|--------|
| 1 | Kostra | v0.1 in progress |
| 2 | Vnější stavba těla | planned |
| 3 | Vnitřní orgány | planned |
| 4 | Tělesné soustavy | planned |
| 5 | Svaly | planned |
| 6 | Smysly | planned |
| 7 | Procvičování | planned |

## Repository structure

```
cats-anatomy/
├── index.html              # app entry point (open this)
├── styles/main.css         # all styles, tablet-first
├── scripts/
│   ├── app.js              # hash routing, menu and section rendering
│   └── atlas.js            # atlas screen: figure, hotspots, labels, info card, toggles
├── data/
│   ├── sections.js         # the 7 sections and their status
│   ├── kostra.js           # Kostra content: 52 structures, Czech texts, Latin, refs
│   └── hotspots-kostra.js  # hotspot polygons per figure and layer (kosti / klouby)
├── images/kostra/          # skeleton.webp (Fig. 1), skull.webp (Fig. 40), lossless WebP
├── tools/
│   └── hotspot-editor.html # draw, check and export hotspots (open by double-click)
├── sources/
│   ├── image-licenses.md   # one row per image file: source, author, licence, changes
│   ├── figures.md          # original figure label keys mapped to data/kostra.js ids
│   └── references.md       # scientific references used for verification
├── LICENSE                 # MIT, applies to code only
└── README.md
```

## Editing hotspots

1. Open `tools/hotspot-editor.html` (double-click; works offline).
2. Pick the figure, the layer (`kosti` = bones, `klouby` = joints) and a structure.
3. Click on the figure to add points; click the first point or press Enter to close.
   Drag a point to move it, Alt+click to delete it, Ctrl/Cmd+Z to undo.
4. Press **Check overlaps and sizes**: no overlaps are allowed within a layer;
   structures narrower than 44 px on a tablet are listed (the app counts a tap
   within 22 px of a structure as a hit on the nearest one).
5. Press **Copy hotspots file** and paste it over `data/hotspots-kostra.js`.

## Content rules

- **Illustrations** are original public-domain figures from J. Reighard & H. S. Jennings,
  *Anatomy of the Cat* (1901), drawn by Louise Burridge Jennings. Figures are not redrawn;
  interactivity is a transparent SVG polygon overlay.
- **Verification-only sources** (IMAIOS vet-Anatomy, University of Minnesota, University of Illinois)
  are consulted for accuracy; their images are never copied.
- **Latin terms** are checked against *Nomina Anatomica Veterinaria*, 6th edition (2017).
- Every image has a row in [`sources/image-licenses.md`](sources/image-licenses.md) before it is used.
- Every anatomical claim is checked against at least one reference listed in
  [`sources/references.md`](sources/references.md).
- All child-facing Czech text is proofread by a native speaker.

## Licence

- **Code** (HTML, CSS, JavaScript): MIT, see [`LICENSE`](LICENSE).
- **Images:** not covered by the MIT licence. Each image keeps the status recorded in
  `sources/image-licenses.md` (the 1901 figures are public domain).
- **Text content** (Czech texts in `data/`): not covered by the MIT licence unless stated otherwise.
