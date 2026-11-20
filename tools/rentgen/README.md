# Kočičí rentgen tools (#43)

- `landmarks.json`: matching points on the photo (`images/rentgen/cat-photo.webp`) and on three figures:
  - the skeleton (Fig. 1, mirrored);
  - the organ drawing;
  - the surface muscles (Fig. 68, mirrored).
  
  A point that a figure doesn't have is left out for that figure.
- `warp.py`: fits each figure onto the photo and writes `check-<figure>.png`, which shows the warped figure over the photo with the photo points as yellow rings. Run it with `python3 tools/rentgen/warp.py`.
  - **Body:** a thin-plate spline through the shared points. For the skeleton, only the `body_only` points are used.
  - **Skeleton legs:** each segment (upper arm, forearm, paw, thigh, shank, foot) is moved on its own, from its two ends in the figure to the two photo points. A bent or lifted leg therefore follows the photo.
  - **Silhouette:** nothing is drawn outside the cat's outline in the photo. This removes stray letters and line ends.
- Known limits (accepted; the app says that positions are approximate):
  - The photo shows a walking cat, while the figures stand.
  - Fig. 68 has no lower legs and no tail.
  - The organ drawing has no joints, so only its outline points are used.
  - The far upper arm of the skeleton has no segment of its own. It follows the body fit.
- `build.py` (stage 3): builds what the screen uses. Run it with `python3 tools/rentgen/build.py`. It creates:
  - `images/rentgen/xray-base.webp`: the cat as an X-ray film;
  - `layer-kosti.webp`: the glowing bones;
  - `layer-organy.webp`: the organs in colour;
  - `layer-svaly.webp`: the muscles in pink;
  - `data/rentgen-areas.js`: every clickable area of the three figures, warped onto the photo. Each area is filled into a mask, the mask is warped like the drawing, and its outline in the photo becomes the new area. This way an area that crosses a joint is not torn.

  The layer images are twice the photo size, so lines stay sharp on a tablet. `check-hotspots.png` shows all the warped areas over the photo.

## Kosti from the 1845 atlas and real X-rays (stage 3c)

Lenka found the warped Fig. 1 bones inaccurate, so the Kosti layer now uses real pictures instead (the Orgány and Svaly layers stay on the photo):

- `1845/build_pl11.py`: the clickable bones on Pl. XI (`images/rentgen/1845/kostra.webp`). Each bone is a rough hand-drawn region; its area is the light bone pixels inside the region (long bones, joints and the tail are bands and circles instead). Writes `1845/pl11.json` and `1845/check-pl11.png`.
- `1845/fit_pl1.py`: moves Pl. XI a little (thin-plate spline through 14 shared points) so that it sits on the Pl. I cat, for the magnifying glass. Writes `images/rentgen/1845/kostra-na-kocce.webp`, `1845/pl11-on-pl1.json` and `1845/check-fit.png`.
- `skutecny/build_ab.py`: bone areas on the real X-rays A (`predni-cast`) and B (`zadni-cast`). Bone and soft tissue overlap on an X-ray, so these are hand-drawn bands, circles and polygons. Writes `skutecny/ab.json`, `check-a.png`, `check-b.png`.
- `skutecny/build_galerie.py`: the special thing on each of the 9 X-rays of *Zajímavé rentgeny*. Writes `skutecny/galerie.json` and `check-galerie.png`.
- `build_kosti.py`: puts it all into `data/rentgen-kosti.js`.

Run in this order: `build_pl11.py`, `fit_pl1.py`, `build_ab.py`, `build_galerie.py`, `build_kosti.py`.

In every builder, areas are cut against each other in order (the earlier one wins), except a structure and its parts (`nested`), which overlap on purpose so that the smaller one wins a tap. The spine (`pater`) is the union of its parts.
