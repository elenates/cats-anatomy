"""Quiz Najdi sval (M5 stage 6): button on the Svaly screen, 10 questions over Figs. 68 and 90
(each question shows the figure with the asked muscle), score, missed list, back link, tall-figure limit,
real taps on the drawing, tablet and phone."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon

r = Run("svaly quiz")
with sync_playwright() as p:
    b = browser(p)
    for name in ("tablet", "phone"):
        vp = VIEWPORTS[name]
        pg = r.watch(b.new_page(viewport=vp))
        pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url("/svaly")); pg.wait_for_timeout(300)
        hs = [a.get_attribute("href") for a in pg.locator(".screen-games a").all()]
        r.ok(hs == ["#/svaly/kviz", "#/svaly/skok"], f"{name}: Svaly buttons {hs}")
        pg.goto(url("/svaly/kviz")); pg.wait_for_timeout(400)
        r.ok(pg.locator(".screen-title").inner_text() == "Kvíz: Najdi sval", f"{name}: title")
        Q = "document.querySelector('.atlas.quiz')._quiz"
        pool = pg.evaluate(Q + ".pool")
        zak = pg.evaluate("ATLAS_DATA.svaly.items.filter(i=>i.level==='zaklad').map(i=>i.id)")
        r.ok(sorted(pool) == sorted(zak), f"{name}: pool = all 12 Základ muscles ({len(pool)})")
        H = pg.evaluate("ATLAS_DATA.hotspots")
        seen = set()
        for i in range(10):
            st = pg.evaluate(Q + ".state"); tid = st["list"][st["i"]]; f = pg.evaluate(Q + ".figure()"); seen.add(f)
            r.ok(tid in H[f]["layers"]["svaly"], f"{name}: q{i} {tid} is on the shown figure {f}")
            r.ok(pg.locator(".quiz-prompt").inner_text() == "Najdi: " + pg.evaluate(f"ATLAS_DATA.svaly.items.find(x=>x.id==='{tid}').cs"), f"{name}: q{i} prompt")
            r.ok(pg.locator(".quiz-spot[data-id='svaly-stehna']").count() == (1 if f == "muscles-superficial" else 0), f"{name}: q{i} only Základ spots of {f}")
            if f == "muscles-hindleg":
                h = pg.locator(".quiz-svg").bounding_box()["height"]
                r.ok(h <= vp["height"] * 0.85 + 2, f"{name}: hind leg height {h}")
            spots = [s.get_attribute("data-id") for s in pg.locator(".quiz-spot").all()]
            target = tid if i % 2 == 0 else [x for x in spots if x != tid][0]
            if i == 0 and name == "tablet":
                # a real tap in the middle of the target polygon
                g = max([Polygon(q).buffer(0) for q in H[f]["layers"]["svaly"][tid]], key=lambda x: x.area); pt = g.representative_point()
                pg.locator(".quiz-svg").scroll_into_view_if_needed(); box = pg.locator(".quiz-svg").bounding_box(); sc = box["width"] / H[f]["width"]
                pg.mouse.click(box["x"] + pt.x * sc, box["y"] + pt.y * sc)
            else:
                pg.locator(f".quiz-spot[data-id='{target}']").focus(); pg.keyboard.press("Enter")
            pg.wait_for_timeout(80)
            r.ok(pg.locator(".quiz-verdict.is-right" if i % 2 == 0 else ".quiz-verdict.is-wrong").count() == 1, f"{name}: q{i} verdict")
            pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(80)
        r.ok(pg.locator(".quiz-prompt").inner_text() == "Správně: 5 z 10", f"{name}: score " + pg.locator(".quiz-prompt").inner_text())
        r.ok(pg.locator(".quiz-missed li").count() == 5, f"{name}: missed list")
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/svaly" and a.inner_text() == "Zpět na svaly", f"{name}: back link")
        if name == "tablet": pg.screenshot(path=shot("m5-stage6-quiz-result.png"))
        pg.locator(".quiz-summary button").click(); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-progress").inner_text() == "Otázka 1 z 10", f"{name}: again")
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{name}: no sideways overflow")
        pg.close()
    b.close()
r.finish()
