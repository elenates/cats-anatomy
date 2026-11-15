"""Tap the middle of every hotspot on the organ figures and check the right card opens."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon

r = Run("hotspot clicks (organ figure)")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1280, "height": 900}))
    pg.goto(url("/organy")); pg.evaluate("localStorage.clear()"); pg.goto(url("/organy")); pg.wait_for_timeout(300)
    fig = pg.evaluate("ATLAS_DATA.hotspots['organs-side']")
    names = {i["id"]: i["cs"] for i in pg.evaluate("ATLAS_DATA.organy.items")}
    r.ok(pg.locator(".hotspot").count() == 14, "14 Základ hotspots")
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(200)
    r.ok(pg.locator(".hotspot").count() == 20, "20 hotspots with Pro zvídavé")
    box = pg.locator(".atlas-svg").bounding_box(); sc = box["width"] / fig["width"]
    for k, polys in fig["layers"]["organy"].items():
        g = max([Polygon(q).buffer(0) for q in polys], key=lambda x: x.area); pt = g.representative_point()
        pg.mouse.click(box["x"] + pt.x * sc, box["y"] + pt.y * sc); pg.wait_for_timeout(80)
        t = pg.locator(".card-title").inner_text() if pg.locator(".card-title").count() else None
        r.ok(t == names[k], f"{k} -> {t}")
    pg.locator("[data-toggle='popisky']").click(); pg.wait_for_timeout(300)
    pg.screenshot(path=shot("organs-popisky.png"))
    b.close()
r.finish()
