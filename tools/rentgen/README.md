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
