"""Doplň popisky (M7 stage 2): card on Procvičování with five pictures; on each picture the circles sit inside
their structure (not inside a smaller one drawn over it) and keep apart; tap label + circle, keyboard, a real
drag with the mouse, a wrong circle, rounds, score, end links, photo credit, phone."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from shapely.geometry import Polygon, Point
from shapely.ops import unary_union

r = Run("popisky")
with sync_playwright() as p:
    b = browser(p)
    for vn in ("tablet", "phone"):
        pg = r.watch(b.new_page(viewport=VIEWPORTS[vn]))
        pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url("/procvicovani")); pg.wait_for_timeout(200)
        P = pg.evaluate("ATLAS_DATA.popisky"); H = pg.evaluate("ATLAS_DATA.hotspots")
        links = [a.get_attribute("href") for a in pg.locator(".hub-group a[href^='#/procvicovani/popisky/']").all()]
        r.ok(links == ["#/procvicovani/popisky/" + f["figure"] for f in P["figures"]], f"{vn}: five pictures {links}")
        for f in P["figures"]:
            pg.goto(url("/procvicovani/popisky/" + f["figure"])); pg.wait_for_timeout(400)
            fig = H[f["figure"]]; lay = fig["layers"][f["layer"]]; nested = fig.get("nested", {})
            content = fig.get("content", "kostra")
            items = {i["id"]: i for i in pg.evaluate(f"ATLAS_DATA['{content}'].items")}
            st = pg.evaluate("document.querySelector('.popisky')._popisky.state()")
            gap = max(fig["width"], fig["height"]) * 0.07
            for rnd in st["rounds"]:
                r.ok(1 <= len(rnd) <= P["perRound"], f"{vn} {f['figure']}: round size {len(rnd)}")
                for a_ in rnd:
                    r.ok(items[a_]["level"] == "zaklad", f"{vn} {f['figure']}: {a_} is Základ")
                    s = st["spots"][a_]; pt = Point(s)
                    r.ok(unary_union([Polygon(q).buffer(0) for q in lay[a_]]).contains(pt), f"{vn} {f['figure']}: circle of {a_} inside it")
                    inner = [Polygon(q).buffer(0) for k in nested.get(a_, []) for q in lay.get(k, [])]
                    r.ok(not any(g.contains(pt) for g in inner), f"{vn} {f['figure']}: circle of {a_} not on a smaller part")
                for i, a_ in enumerate(rnd):
                    for c in rnd[i + 1:]:
                        r.ok(math.dist(st["spots"][a_], st["spots"][c]) >= gap - 0.01, f"{vn} {f['figure']}: {a_} and {c} too close")
            r.ok(pg.locator(".popisky .atlas-credit").is_visible() == bool(fig.get("credit")), f"{vn} {f['figure']}: credit shown when licensed")
            total = sum(len(x) for x in st["rounds"])
            for n, rnd in enumerate(st["rounds"]):
                r.ok(pg.locator(".popisky-spot").count() == len(rnd) and pg.locator(".popisky-label").count() == len(rnd), f"{vn} {f['figure']}: round {n} circles and labels")
                for i, a_ in enumerate(rnd):
                    if n == 0 and i == 0:   # a wrong circle first
                        other = [x for x in rnd if x != a_]
                        if other:
                            pg.click(f".popisky-label[data-id='{a_}']"); pg.locator(f".popisky-spot[data-id='{other[0]}']").focus(); pg.keyboard.press("Enter")
                            r.ok(pg.locator(".spoj-feedback.is-wrong").count() == 1, f"{vn} {f['figure']}: wrong circle")
                            pg.locator(f".popisky-spot[data-id='{a_}']").dispatch_event("click"); pg.wait_for_timeout(40)   # the label stays picked
                            r.ok(pg.locator(f".popisky-spot.is-right[data-id='{a_}']").count() == 1, f"{vn} {f['figure']}: {a_} placed after a miss")
                            continue
                    if vn == "tablet" and n == 0 and i == 1:   # a real drag with the mouse
                        lb = pg.locator(f".popisky-label[data-id='{a_}']").bounding_box(); cb = pg.locator(f".popisky-spot[data-id='{a_}'] circle").bounding_box()
                        pg.mouse.move(lb["x"] + 20, lb["y"] + lb["height"] / 2); pg.mouse.down()
                        pg.mouse.move(lb["x"] + 60, lb["y"] + 10, steps=4)
                        pg.mouse.move(cb["x"] + cb["width"] / 2, cb["y"] + cb["height"] / 2, steps=8); pg.mouse.up()
                    elif i % 2:
                        pg.locator(f".popisky-label[data-id='{a_}']").focus(); pg.keyboard.press("Enter")
                        pg.locator(f".popisky-spot[data-id='{a_}']").focus(); pg.keyboard.press("Enter")
                    else:
                        pg.click(f".popisky-label[data-id='{a_}']"); pg.locator(f".popisky-spot[data-id='{a_}']").dispatch_event("click")
                    pg.wait_for_timeout(40)
                    r.ok(pg.locator(f".popisky-spot.is-right[data-id='{a_}']").count() == 1, f"{vn} {f['figure']}: {a_} placed")
                if vn == "tablet" and n == 0 and f["figure"] == "skeleton": pg.screenshot(path=shot("m7-stage2-popisky.png"), full_page=True)
                pg.click(".popisky-game .quiz-next"); pg.wait_for_timeout(150)
            r.ok(pg.locator(".quiz-summary h2").inner_text().endswith(f"{total - 1} z {total}"), f"{vn} {f['figure']}: score " + pg.locator(".quiz-summary h2").inner_text())
            hs = [a.get_attribute("href") for a in pg.locator(".quiz-summary a").all()]
            r.ok(hs == ["#/procvicovani/popisky", "#/procvicovani"], f"{vn} {f['figure']}: end links {hs}")
            r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{vn} {f['figure']}: no sideways overflow")
        pg.goto(url("/procvicovani/popisky")); pg.wait_for_timeout(200)
        r.ok(pg.locator(".hub-group a").count() == 5, f"{vn}: Jiný obrázek shows the five pictures")
        if vn == "phone":
            pg.goto(url("/procvicovani/popisky/cat-side")); pg.wait_for_timeout(300); pg.screenshot(path=shot("m7-stage2-popisky-phone.png"), full_page=True)
        pg.close()
    b.close()
r.finish()
