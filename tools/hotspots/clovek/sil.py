# Ink silhouettes of the Stubbs line drawings: everything enclosed by the ink outlines.
# Usage: python3 sil.py <name> [close_px]  ->  sil_<name>.png (white = inside a bone)
import sys, os, numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
name = sys.argv[1]; k = int(sys.argv[2]) if len(sys.argv) > 2 else 5
im = cv2.imread(os.path.join(ROOT, "images", "clovek", name + ".webp"), cv2.IMREAD_GRAYSCALE)
ink = (im < 150).astype(np.uint8) * 255
closed = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
h, w = closed.shape
ff = closed.copy(); mask = np.zeros((h + 2, w + 2), np.uint8)
for x, y in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
    if ff[y, x] == 0: cv2.floodFill(ff, mask, (x, y), 128)
inside = np.where(ff == 128, 0, 255).astype(np.uint8)
inside = cv2.morphologyEx(inside, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
cv2.imwrite(os.path.join(HERE, f"sil_{name}.png"), inside)
print(name, inside.mean() / 255)
