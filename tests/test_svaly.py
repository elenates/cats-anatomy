"""Svaly screen (M5 stages 4–5): menu, three tabs, Jak kočka skáče, hotspots per level, every hotspot opens its card,
links Svaly <-> Kostra, the Pro zvídavé sentence, height limit of the tall hind-leg figure, phone layout."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon

r = Run("svaly screen")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1280, "height": 900}))
    pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url()); pg.wait_for_timeout(200)
    r.ok(pg.locator("a.menu-card[href='#/svaly']").count() == 1, "Svaly is active in the menu")
    views = pg.evaluate("ATLAS_DATA.svaly.views"); H = pg.evaluate("ATLAS_DATA.hotspots")
    items = {i["id"]: i for i in pg.evaluate("ATLAS_DATA.svaly.items")}
    expect = {"muscles-superficial": (9, 13), "muscles-deep": (0, 5), "muscles-hindleg": (3, 8)}
    for n, v in enumerate(views, 1):
        pg.goto(url(f"/svaly/{n}")); pg.wait_for_timeout(300)
        r.ok(pg.locator(".fig-tab").count() == 3, "three tabs")
        r.ok(pg.locator(".fig-tab[aria-current='page']").inner_text() == v["cs"], f"tab {n} current")
        r.ok(pg.locator(".fig-note").count() == (1 if v["note"] else 0), f"tab {n} note")
        z, zv = expect[v["figure"]]
        r.ok(pg.locator(".hotspot").count() == z, f"{v['figure']}: {pg.locator('.hotspot').count()} Základ hotspots, expected {z}")
        if z == 0:
            r.ok("Pro zvídavé" in pg.locator(".atlas-card").inner_text(), "deep figure says: switch on Pro zvídavé")
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(200)
        r.ok(pg.locator(".hotspot").count() == zv, f"{v['figure']}: {pg.locator('.hotspot').count()} hotspots at Pro zvídavé, expected {zv}")
        fig = H[v["figure"]]; nested = fig.get("nested", {})
        for k, polys in fig["layers"]["svaly"].items():
            if k in nested: continue      # covered by its single muscles at Pro zvídavé
            g = max([Polygon(q).buffer(0) for q in polys], key=lambda x: x.area); pt = g.representative_point()
            pg.evaluate("document.querySelector('.atlas-svg').scrollIntoView({block:'start'})")
            box = pg.locator(".atlas-svg").bounding_box(); sc = box["width"] / fig["width"]
            ty = box["y"] + pt.y * sc
            if ty > 860:
                pg.evaluate(f"scrollBy(0,{ty - 450})"); pg.wait_for_timeout(50); box = pg.locator(".atlas-svg").bounding_box()
            pg.mouse.click(box["x"] + pt.x * sc, box["y"] + pt.y * sc); pg.wait_for_timeout(60)
            t = pg.locator(".card-title").inner_text() if pg.locator(".card-title").count() else None
            r.ok(t == items[k]["cs"], f"{v['figure']}:{k} -> {t}")
        if v.get("maxHeightVh"):
            h = pg.locator(".atlas-svg").bounding_box()["height"]
            r.ok(h <= 900 * v["maxHeightVh"] / 100 + 2, f"hind leg figure height {h}")
            pg.screenshot(path=shot("m5-stage4-hindleg.png"), full_page=True)
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
        if n == 1: pg.screenshot(path=shot("m5-stage4-superficial.png"))
    # Svaly -> Kostra, and the Pro zvídavé sentence of the Achilles tendon
    pg.goto(url("/svaly/3")); pg.wait_for_timeout(300)
    pg.locator(".hotspot[data-id='achillova-slacha']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
    r.ok([a.get_attribute("href") for a in pg.locator(".card-link a").all()] == ["#/kostra/panev-zadni"], "Achilles -> Kostra hind leg")
    r.ok("společná patní šlacha" not in pg.locator(".atlas-card").inner_text(), "no Pro zvídavé sentence at Základ")
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(150)
    pg.locator(".hotspot[data-id='achillova-slacha']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
    r.ok("společná patní šlacha" in pg.locator(".atlas-card").inner_text(), "Pro zvídavé sentence shown")
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
    # Kostra -> Svaly
    for part, href in [("panev-zadni", "#/svaly/3"), ("predni-koncetiny", "#/svaly/1")]:
        bone = pg.evaluate(f"ATLAS_DATA.kostra.items.filter(i=>i.part==='{part}' && i.level==='zaklad')[0].id")
        pg.goto(url("/kostra")); pg.wait_for_timeout(300)
        pg.locator(f".hotspot[data-id='{bone}']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
        hs = [a.get_attribute("href") for a in pg.locator(".card-link a").all()]
        r.ok(href in hs, f"{bone} links {hs}")
    # Jak kočka skáče: button on the Svaly screen, 4 steps, lit muscles at Základ, prev/next, links
    pg.goto(url("/svaly/1")); pg.wait_for_timeout(300)
    r.ok(pg.locator("a.quiz-open[href='#/svaly/skok']").count() == 1, "Jak kočka skáče button")
    skok = pg.evaluate("ATLAS_DATA.svaly.skok")
    earlier = []
    for n, st in enumerate(skok["steps"], 1):
        pg.goto(url(f"/svaly/skok/{n}")); pg.wait_for_timeout(300)
        r.ok(pg.locator(".fig-note").inner_text() == skok["intro"], f"step {n} intro")
        r.ok(sorted(pg.eval_on_selector_all(".hotspot.is-also", "e=>e.map(x=>x.dataset.id)")) == sorted(earlier), f"step {n} earlier muscles lighter")
        r.ok(pg.locator(".organ-chip.is-also").count() == len(earlier), f"step {n} 'Pořád pracují' chips")
        r.ok(pg.locator(".fig-tab[aria-current='step']").inner_text() == f"{n}. {st['cs']}", f"step {n} tab")
        r.ok(sorted(pg.eval_on_selector_all(".hotspot", "e=>e.map(x=>x.dataset.id)")) == sorted(st["muscles"] + earlier), f"step {n} hotspots")
        r.ok(pg.locator(".organ-chip:not(.is-also)").count() == len(st["muscles"]), f"step {n} chips")
        r.ok(pg.locator(".system-fade").count() == (1 if st["muscles"] + earlier else 0), f"step {n} fade")
        r.ok([a.get_attribute("href") for a in pg.locator(".atlas-card .card-link a").all()] == [l["href"] for l in st["links"]], f"step {n} links")
        nav = [a.get_attribute("href") for a in pg.locator(".step-nav a").all()]
        want = ([f"#/svaly/skok/{n-1}"] if n > 1 else []) + ([f"#/svaly/skok/{n+1}"] if n < len(skok["steps"]) else [])
        r.ok(nav == want, f"step {n} nav {nav}")
        if st["muscles"]:
            chip = pg.locator(".organ-chip").first; name = chip.inner_text(); chip.click(); pg.wait_for_timeout(100)
            r.ok(pg.locator(".card-title").inner_text() == name, f"step {n} chip opens the muscle card")
        earlier += st["muscles"]
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(150)
    pg.goto(url("/svaly/skok/3")); pg.wait_for_timeout(200); pg.goto(url("/svaly/skok/4")); pg.wait_for_timeout(300)
    r.ok("0,15 sekundy" in pg.locator(".atlas-card").inner_text(), "step 4 Pro zvídavé sentence")
    pg.screenshot(path=shot("m5-stage5-skok-4.png"), full_page=True)
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
    # Popisky on, phone: no page-wide sideways overflow
    pg.set_viewport_size(VIEWPORTS["phone"])
    for n in (1, 3):
        pg.goto(url(f"/svaly/{n}")); pg.wait_for_timeout(300)
        pg.locator("[data-toggle='popisky']").click(); pg.wait_for_timeout(300)
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"phone tab {n}: page overflows sideways")
        pg.screenshot(path=shot(f"m5-stage4-phone-{n}.png"), full_page=True)
        pg.locator("[data-toggle='popisky']").click(); pg.wait_for_timeout(100)
    b.close()
r.finish()
