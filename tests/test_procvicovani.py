"""Procvičování (M7 stage 1): active in the menu, one group per section with its games, every game opens,
and a game opened from here has back links (top and end screen) to Procvičování; opened from its section,
the links stay as before."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("procvicovani")
with sync_playwright() as p:
    b = browser(p)
    for vn in ("tablet", "phone"):
        pg = r.watch(b.new_page(viewport=VIEWPORTS[vn]))
        pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url()); pg.wait_for_timeout(200)
        r.ok(pg.locator("a.menu-card[href='#/procvicovani']").count() == 1, f"{vn}: Procvičování active in the menu")
        pg.goto(url("/procvicovani")); pg.wait_for_timeout(200)
        groups = pg.evaluate("ATLAS_DATA.procvicovani")
        r.ok(pg.locator(".hub-group[data-section]").count() == len(groups) == 6, f"{vn}: six groups")
        links = [(a.get_attribute("href"), a.inner_text()) for a in pg.locator(".hub-group[data-section] a").all()]
        r.ok(len(links) == 13 and all(h.endswith("?od=procvicovani") for h, _ in links), f"{vn}: 13 games {links}")
        if vn == "tablet": pg.screenshot(path=shot("m7-stage1-hub.png"), full_page=True)
        for h, t in links:
            pg.goto(url("/procvicovani")); pg.wait_for_timeout(100)
            pg.click(f".hub-group a[href='{h}']"); pg.wait_for_timeout(300)
            r.ok(pg.locator(".screen-title").inner_text() == t, f"{vn}: {h} title {pg.locator('.screen-title').inner_text()}")
            bl = pg.locator(".back-link")
            r.ok(bl.get_attribute("href") == "#/procvicovani" and bl.inner_text() == "← Zpět na procvičování", f"{vn}: {h} top back link")
        # end screens: quiz and Spoj
        pg.goto(url("/smysly/kviz?od=procvicovani")); pg.wait_for_timeout(300)
        Q = "document.querySelector('.atlas.quiz')._quiz"
        for i in range(10):
            st = pg.evaluate(Q + ".state"); tid = st["list"][st["i"]]
            pg.locator(f".quiz-spot[data-id='{tid}']").focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(50)
            pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(50)
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/procvicovani" and a.inner_text() == "Zpět na procvičování", f"{vn}: quiz end link")
        pg.goto(url("/svaly/spoj?od=procvicovani")); pg.wait_for_timeout(300)
        for rnd in range(3):
            for idv in pg.eval_on_selector_all(".spoj-name", "els=>els.map(e=>e.dataset.id)"):
                pg.click(f".spoj-name[data-id='{idv}']"); pg.click(f".spoj-answer[data-id='{idv}']")
            pg.click(".spoj-game .quiz-next"); pg.wait_for_timeout(100)
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/procvicovani", f"{vn}: Spoj end link")
        # opened from its section: unchanged
        pg.goto(url("/svaly/spoj")); pg.wait_for_timeout(300)
        r.ok(pg.locator(".back-link").get_attribute("href") == "#/svaly", f"{vn}: Spoj from Svaly keeps its back link")
        pg.goto(url("/organy/soustavy-kviz?od=procvicovani")); pg.wait_for_timeout(300)
        r.ok(pg.evaluate("ATLAS_DATA.returnTo && ATLAS_DATA.returnTo.href") == "#/procvicovani", f"{vn}: soustavy quiz knows the way back")
        pg.goto(url("/procvicovani")); pg.wait_for_timeout(200)
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{vn}: no sideways overflow")
        if vn == "phone": pg.screenshot(path=shot("m7-stage1-hub-phone.png"), full_page=True)
        pg.close()
    b.close()
r.finish()
