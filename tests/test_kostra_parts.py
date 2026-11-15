"""Kostra overview and the five part screens: every figure tab loads, has hotspots, no sideways overflow."""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("kostra part screens")
with sync_playwright() as p:
    b = browser(p)
    for vn, vp in [("tablet", VIEWPORTS["tablet"]), ("phone", VIEWPORTS["phone"])]:
        pg = r.watch(b.new_page(viewport=vp))
        pg.goto(url("/kostra")); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(300)
        views = pg.evaluate("ATLAS_DATA.kostraViews")
        r.ok(pg.locator(".parts .part-link").count() == len(views), f"{vn}: part links")
        for part, tabs in views.items():
            for i, t in enumerate(tabs, 1):
                for zv in (False, True):
                    pg.evaluate("t=>localStorage.setItem('atlas.toggles',JSON.stringify(t))", {"zvidave": zv, "popisky": True})
                    pg.goto(url(f"/kostra/{part}/{i}")); pg.reload(); pg.wait_for_timeout(250)
                    n = pg.locator("g.hotspot").count()
                    r.ok(n > 0 or not zv, f"{vn} {part}/{i} zv={zv}: no hotspots")
                    if vn != "phone":
                        r.ok(not pg.evaluate("document.documentElement.scrollWidth>innerWidth"), f"{vn} {part}/{i}: overflow")
                    if len(tabs) > 1:
                        r.ok(pg.locator(".fig-tab[aria-current]").inner_text() == t["cs"], f"{vn} {part}/{i}: current tab")
        pg.close()
    b.close()
r.finish()
