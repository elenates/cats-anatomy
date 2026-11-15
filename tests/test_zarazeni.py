"""Card "Zařazení kočky v přírodě" in the menu: 5 rows (8 with Pro zvídavé), Latin with the toggle, link to the spine."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("zarazeni card")
with sync_playwright() as p:
    b = browser(p)
    for name, vp, tog in [("tablet", VIEWPORTS["tablet"], {}), ("tablet-latin", VIEWPORTS["tablet"], {"zvidave": True, "latinsky": True}), ("phone", VIEWPORTS["phone"], {})]:
        pg = r.watch(b.new_page(viewport=vp))
        pg.goto(url()); pg.evaluate("t=>localStorage.setItem('atlas.toggles',JSON.stringify(t))", tog); pg.reload()
        pg.click(".zar-summary"); pg.wait_for_timeout(200)
        rows = 8 if tog.get("zvidave") else 5     # Pro zvídavé adds živočichové, strunatci, kočka (rod)
        r.ok(pg.locator(".zar-row").count() == rows, f"{name}: {rows} rows")
        r.ok((pg.locator(".zar-la").count() > 0) == bool(tog.get("latinsky")), f"{name}: latin")
        if name == "tablet":
            pg.click("text=Prohlédni si kočičí páteř"); pg.wait_for_timeout(300)
            r.ok(pg.url.endswith("#/kostra/pater-hrudnik"), f"{name}: spine link")
        pg.close()
    b.close()
r.finish()
