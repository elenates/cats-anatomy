"""tools/hotspot-editor.html must load every figure and export data/hotspots-kostra.js byte for byte."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("hotspot editor round-trip")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1400, "height": 1000}))
    pg.goto("file://" + os.path.join(ROOT, "tools", "hotspot-editor.html")); pg.wait_for_timeout(300)
    text = pg.evaluate("window.__hotspotEditor.fileText()")
    with open(os.path.join(ROOT, "data", "hotspots-kostra.js"), encoding="utf-8") as f:
        r.ok(text == f.read(), "export differs from data/hotspots-kostra.js")
    figs = pg.evaluate("Object.keys(window.__hotspotEditor.figures())")
    for fig in figs:
        pg.select_option("#figure", fig); pg.wait_for_timeout(150)
        for layer in pg.evaluate("[...document.querySelectorAll('#layer option')].map(o=>o.value)"):
            pg.select_option("#layer", layer); pg.click("#check"); pg.wait_for_timeout(100)
            r.ok(pg.inner_text("#report").strip() != "", f"{fig}/{layer}: empty check report")
    b.close()
r.finish()
