"""Smysly screen (M6 stage 4): menu, four figure tabs + Zajímavosti, hotspots per level, every hotspot opens its
card, the Pro zvídavé-only eardrum tab, height limit of the tall tongue figure, fact cards (image, Pro zvídavé
text, links to the tabs), links from Vnější stavba těla, phone layout."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon

r = Run("smysly screen")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1280, "height": 900}))
    pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url()); pg.wait_for_timeout(200)
    r.ok(pg.locator("a.menu-card[href='#/smysly']").count() == 1, "Smysly is active in the menu")
    S = pg.evaluate("ATLAS_DATA.smysly"); H = pg.evaluate("ATLAS_DATA.hotspots")
    items = {i["id"]: i for i in S["items"]}
    for n, v in enumerate(S["views"], 1):
        pg.goto(url(f"/smysly/{n}")); pg.wait_for_timeout(300)
        r.ok(pg.locator(".fig-tab").count() == len(S["views"]) + 1, "five tabs")
        r.ok(pg.locator(".fig-tab[aria-current='page']").inner_text() == v["cs"], f"tab {n} current")
        r.ok(pg.locator(".fig-note").inner_text() == v["note"], f"tab {n} note")
        lay = H[v["figure"]]["layers"]["smysly"]
        z = sum(1 for k in lay if items[k]["level"] == "zaklad")
        r.ok(pg.locator(".hotspot").count() == z, f"{v['figure']}: {pg.locator('.hotspot').count()} Základ hotspots, expected {z}")
        if z == 0:
            r.ok("Pro zvídavé" in pg.locator(".atlas-card").inner_text(), "eardrum tab says: switch on Pro zvídavé")
        else:
            r.ok(pg.locator(".card-empty").inner_text() == pg.evaluate("ATLAS_DATA.ui.cardEmptySmysly"), f"tab {n} empty card text")
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(200)
        r.ok(pg.locator(".hotspot").count() == len(lay), f"{v['figure']}: all {len(lay)} hotspots at Pro zvídavé")
        fig = H[v["figure"]]
        for k, polys in lay.items():
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
            r.ok(h <= 900 * v["maxHeightVh"] / 100 + 2, f"tongue figure height {h}")
        pg.evaluate("scrollTo(0,0)"); pg.screenshot(path=shot(f"m6-stage4-tab{n}.png"), full_page=True)
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
    # Zajímavosti
    pg.goto(url("/smysly/zajimavosti")); pg.wait_for_timeout(300)
    r.ok(pg.locator(".fig-tab[aria-current='page']").inner_text() == pg.evaluate("ATLAS_DATA.ui.faktaTab"), "Zajímavosti tab current")
    r.ok(pg.locator(".fakt").count() == len(S["fakta"]), "all fact cards")
    r.ok([t.inner_text() for t in pg.locator(".fakt .card-title").all()] == [f["cs"] for f in S["fakta"]], "fact titles in order")
    img = pg.locator(".fakt img")
    r.ok(img.count() == 1 and pg.evaluate("document.querySelector('.fakt img').naturalWidth") > 0, "third eyelid picture loads")
    r.ok(pg.locator(".fakt figcaption").inner_text().startswith("Obrázek 165:"), "picture caption")
    zv = [f["zvidave"] for f in S["fakta"] if f["zvidave"]]
    r.ok(not any(t in pg.locator(".fakta").inner_text() for t in zv), "no Pro zvídavé texts at Základ")
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
    r.ok(all(t in pg.locator(".fakta").inner_text() for t in zv), "Pro zvídavé texts shown")
    pg.screenshot(path=shot("m6-stage4-fakta.png"), full_page=True)
    pg.goto(url("/smysly/1")); pg.wait_for_timeout(200)
    r.ok(pg.locator("[data-toggle='zvidave']").get_attribute("aria-pressed") == "true", "Pro zvídavé setting shared with the atlas")
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
    pg.goto(url("/smysly/zajimavosti")); pg.wait_for_timeout(200)
    for f in S["fakta"]:
        want = [f"#/smysly/{i + 1}" for i, v in enumerate(S["views"]) if f["organ"] and v["organ"] == f["organ"]][:1]
        got = [a.get_attribute("href") for a in pg.locator(f"#fakt-{f['id']} .card-link a").all()]
        r.ok(got == want, f"{f['id']} links {got}")
    # Vnější stavba těla -> Smysly
    for part, href in [("oko", "#/smysly/1"), ("ucho", "#/smysly/2"), ("nos", "#/smysly/zajimavosti/jacobsonuv-organ"), ("vousy", "#/smysly/zajimavosti/hmatove-vousy")]:
        pg.goto(url("/vnejsi")); pg.wait_for_timeout(300)
        pg.locator(f".hotspot[data-id='{part}']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
        hs = hrefs(pg)
        r.ok(href in hs, f"Vnější {part} links {hs}")
        pg.goto(url(href[1:])); pg.wait_for_timeout(400)
        if "zajimavosti/" in href:
            fid = href.rsplit("/", 1)[1]
            r.ok(pg.locator(f"#fakt-{fid}.is-focus").count() == 1, f"{fid} card highlighted")
            r.ok(pg.evaluate(f"(function(){{var b=document.getElementById('fakt-{fid}').getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}})()"), f"{fid} card scrolled into view")
    # phone: no page-wide sideways overflow
    pg.set_viewport_size(VIEWPORTS["phone"])
    for h in ("/smysly/1", "/smysly/4", "/smysly/zajimavosti"):
        pg.goto(url(h)); pg.wait_for_timeout(300)
        if pg.locator("[data-toggle='popisky']").count(): pg.locator("[data-toggle='popisky']").click(); pg.wait_for_timeout(300)
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"phone {h}: page overflows sideways")
        pg.screenshot(path=shot("m6-stage4-phone-" + h.rsplit("/", 1)[1] + ".png"), full_page=True)
        if pg.locator("[data-toggle='popisky']").count(): pg.locator("[data-toggle='popisky']").click(); pg.wait_for_timeout(100)
    b.close()
r.finish()
