"""Quiz "Najdi kost nebo orgán" on the skeleton: 10 questions, half right, score and restart."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("kostra quiz")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport=VIEWPORTS["tablet"]))
    pg.goto(url("/kostra/kviz")); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(400)
    q = "document.querySelector('.atlas.quiz')._quiz"
    pool = pg.evaluate(q + ".pool")
    also = pg.evaluate("ATLAS_DATA.hotspots.skeleton.alsoCounts || {}")   # e.g. a tap on the neck counts as Páteř
    r.ok(len(pool) >= 10, f"pool {len(pool)}")
    for i in range(10):
        st = pg.evaluate(q + ".state"); tid = st["list"][st["i"]]
        target = tid if i % 2 == 0 else [x for x in pool if x != tid and x not in also.get(tid, [])][0]
        pg.locator(f".quiz-spot[data-id='{target}']").focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(80)
        pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(80)
    r.ok(pg.locator(".quiz-prompt").inner_text() == "Správně: 5 z 10", "score " + pg.locator(".quiz-prompt").inner_text())
    r.ok(pg.locator(".quiz-summary a").get_attribute("href") == "#/kostra", "back link")
    b.close()
r.finish()
