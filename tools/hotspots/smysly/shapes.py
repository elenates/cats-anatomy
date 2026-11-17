# Shared by build*.py: turns the hotspot shapes into plain polygon lists for data/hotspots-kostra.js.
# Shapes are simplified, snapped to a 0.1 px grid and cut against the ones already placed (in priority
# order), so neighbouring hotspots never overlap after rounding. The atlas draws plain polygons,
# so a ring-shaped part is cut through each hole.
import shapely
from shapely.geometry import Polygon, LineString
from shapely.ops import split

GRID = 0.1
def _polys(g):
    if g.is_empty: return []
    if g.geom_type == "Polygon": return [g]
    return [q for p in getattr(g, "geoms", []) for q in _polys(p)]

def _dehole(p):
    if not p.interiors: return [p]
    cx, cy = p.interiors[0].centroid.coords[0]; x0, y0, x1, y1 = p.bounds
    return [q for g in split(p, LineString([(x0 - 1, cy), (x1 + 1, cy)])).geoms for q in _dehole(g)]

def finalize(shapes, order, tol=0.8, min_area=80):
    out = {}; taken = Polygon()
    for k in order:
        g = shapely.set_precision(shapes[k].simplify(tol).buffer(0), GRID)
        g = shapely.set_precision(g.difference(taken), GRID)
        g = shapely.set_precision(g.buffer(-0.3, join_style=2).buffer(0.3, join_style=2).intersection(g), GRID)   # open pinch points
        pieces = [shapely.set_precision(q, GRID) for p in _polys(g) for q in _dehole(p)]
        rings = []
        for q in pieces:
            for f in _polys(q):
                if f.area <= min_area: continue
                rings.append([[round(x, 1), round(y, 1)] for x, y in list(f.exterior.coords)[:-1]])
        out[k] = rings
        taken = shapely.set_precision(shapely.union_all([taken, g]), GRID)
    # second pass on the final outlines: later items give way to earlier ones
    placed = Polygon(); final = {}
    for k in order:
        rings = []
        for r in out[k]:
            for f in _polys(Polygon(r).difference(placed.buffer(0.15, join_style=2))):   # 0.15 px gap: no slivers after rounding
                if f.area <= min_area: continue
                rr = [[round(x, 1), round(y, 1)] for x, y in list(f.exterior.coords)[:-1]]
                if Polygon(rr).is_valid: rings.append(rr)
        final[k] = rings
        placed = shapely.union_all([placed] + [Polygon(r) for r in rings])
    return final
