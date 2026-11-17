"""Quiz Najdi část oka, ucha nebo jazyka (M6 stage 5): button on every Smysly tab, 10 questions over Figs. 167,
173 and 95 (each question shows the figure with the asked structure), score, missed list, back link,
tall-figure limit, a real tap on the drawing, tablet and phone."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon

r = Run("smysly quiz")
with sync_playwright() as p:
    b = browser(p)
    for name in ("tablet", "phone"):
        vp = VIEWPORTS[name]
        pg = r.watch(b.new_page(viewport=vp))
        pg.goto(url()); pg.evaluate("localStorage.clear()")
        for h in ("/smysly", "/smysly/3", "/smysly/zajimavosti"):
            pg.goto(url(h)); pg.wait_for_timeout(200)
            hs = [a.get_attribute("href") for a in pg.locator(".screen-games a").all()]
            r.ok(hs[:1] == ["#/smysly/kviz"], f"{name}: quiz button on {h}: {hs}")
        pg.goto(url("/smysly/kviz")); pg.wait_for_timeout(400)
        r.ok(pg.locator(".screen-title").inner_text() == pg.evaluate("ATLAS_DATA.ui.quizTitleSmysly"), f"{name}: title")
        Q = "document.querySelector('.atlas.quiz')._quiz"
        pool = pg.evaluate(Q + ".pool")
        H = pg.evaluate("ATLAS_DATA.hotspots")
        want = [i["id"] for i in pg.evaluate("ATLAS_DATA.smysly.items") if i["level"] == "zaklad" and any(i["id"] in H[f]["layers"]["smysly"] for f in ("eye", "inner-ear", "tongue"))]
        r.ok(sorted(pool) == sorted(want) and len(pool) == 10, f"{name}: pool = the 10 Základ structures ({len(pool)})")
        seen = set()
        for i in range(10):
            st = pg.evaluate(Q + ".state"); tid = st["list"][st["i"]]; f = pg.evaluate(Q + ".figure()"); seen.add(f)
            r.ok(tid in H[f]["layers"]["smysly"], f"{name}: q{i} {tid} is on the shown figure {f}")
            r.ok(pg.locator(".quiz-prompt").inner_text() == "Najdi: " + pg.evaluate(f"ATLAS_DATA.smysly.items.find(x=>x.id==='{tid}').cs"), f"{name}: q{i} prompt")
            if f == "tongue":
                h = pg.locator(".quiz-svg").bounding_box()["height"]
                r.ok(h <= vp["height"] * 0.85 + 2, f"{name}: tongue height {h}")
            spots = [s.get_attribute("data-id") for s in pg.locator(".quiz-spot").all()]
            others = [x for x in spots if x != tid]
            wrong = i % 2 == 1 and others
            if i == 0 and name == "tablet":
                g = max([Polygon(q).buffer(0) for q in H[f]["layers"]["smysly"][tid]], key=lambda x: x.area); pt = g.representative_point()
                pg.locator(".quiz-svg").scroll_into_view_if_needed(); box = pg.locator(".quiz-svg").bounding_box(); sc = box["width"] / H[f]["width"]
                pg.mouse.click(box["x"] + pt.x * sc, box["y"] + pt.y * sc)
            else:
                pg.locator(f".quiz-spot[data-id='{others[0] if wrong else tid}']").focus(); pg.keyboard.press("Enter")
            pg.wait_for_timeout(80)
            r.ok(pg.locator(".quiz-verdict.is-wrong" if wrong else ".quiz-verdict.is-right").count() == 1, f"{name}: q{i} verdict")
            pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(80)
        r.ok(seen == {"eye", "inner-ear", "tongue"}, f"{name}: all three figures used {seen}")
        r.ok(pg.locator(".quiz-prompt").inner_text().startswith("Správně: "), f"{name}: score " + pg.locator(".quiz-prompt").inner_text())
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/smysly" and a.inner_text() == "Zpět na smysly", f"{name}: back link")
        if name == "tablet": pg.screenshot(path=shot("m6-stage5-quiz-result.png"))
        pg.locator(".quiz-summary button").click(); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-progress").inner_text() == "Otázka 1 z 10", f"{name}: again")
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{name}: no sideways overflow")
        if name == "tablet": pg.screenshot(path=shot("m6-stage5-quiz.png"))
        pg.close()
    b.close()
r.finish()
