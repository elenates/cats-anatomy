# Kočičí rentgen tools (#43)

- `landmarks.json`: matching points on the photo (`images/rentgen/cat-photo.webp`) and on three figures:
  - the skeleton (Fig. 1, mirrored);
  - the organ drawing;
  - the surface muscles (Fig. 68, mirrored).
  
  A point that a figure doesn't have is left out for that figure.
- `warp.py`: fits each figure onto the photo with a thin-plate spline through the shared points and writes `check-<figure>.png`. That file shows the warped figure over the photo, with the photo points as yellow rings. Run it with `python3 tools/rentgen/warp.py`.
- Known limits (accepted, the app will say the position is approximate):
  - The photo shows a walking cat, while the figures stand.
  - The back foreleg's paw is lifted and bent backwards. It is not matched on the skeleton, because matching it folds the warp. The bones of that paw therefore sit only roughly.
  - Fig. 68 has no lower legs and no tail. The organ drawing has no joints, so only its outline points are used.
