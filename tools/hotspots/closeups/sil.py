import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
import numpy as np
from PIL import Image
from scipy import ndimage
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
import cv2
def silhouette(name, thr=200, close=5, min_area=500):
    im=np.array(Image.open(os.path.join(ROOT, "images", "organy", name + ".webp")).convert("L"))
    ink=im<thr
    ink=ndimage.binary_closing(ink,structure=np.ones((close,close)),iterations=2)
    filled=ndimage.binary_fill_holes(ink)
    filled=ndimage.binary_opening(filled,structure=np.ones((3,3)))
    lab,n=ndimage.label(filled)
    polys=[]
    for i in range(1,n+1):
        m=(lab==i).astype(np.uint8)
        if m.sum()<min_area: continue
        cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        for c in cs:
            if len(c)>=3: polys.append(Polygon(c[:,0,:]).buffer(0))
    return unary_union(polys)
