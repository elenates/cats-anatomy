"""Game "Spoj, co patří k sobě": funny answers, a wrong pair, three rounds, summary, restart."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("spoj")
with sync_playwright() as p:
    b = browser(p)
    for vn, vp in [("tablet", VIEWPORTS["tablet"]), ("phone", VIEWPORTS["phone"])]:
        pg = r.watch(b.new_page(viewport=vp))
        pg.goto(url("/kostra")); pg.evaluate("localStorage.clear()"); pg.goto(url("/kostra/spoj")); pg.wait_for_timeout(300)
        r.ok(pg.locator(".screen-title").inner_text() == "Spoj, co patří k sobě", f"{vn}: title")
        for rnd in range(3):
            ids = pg.eval_on_selector_all(".spoj-name", "els=>els.map(e=>e.dataset.id)")
            r.ok(len(ids) == 4 and pg.locator(".spoj-answer[data-funny]").count() == 2, f"{vn} round {rnd}: 4 pairs + 2 funny")
            if rnd == 0:
                pg.click(".spoj-answer[data-funny]")
                r.ok(pg.locator(".spoj-feedback.is-funny").count() == 1, f"{vn}: funny reply")
                pg.click(f".spoj-name[data-id='{ids[0]}']"); pg.click(f".spoj-answer[data-id='{ids[1]}']")
                r.ok(pg.locator(".spoj-feedback.is-wrong").count() == 1, f"{vn}: wrong pair")
            for idv in ids:
                pg.click(f".spoj-name[data-id='{idv}']"); pg.click(f".spoj-answer[data-id='{idv}']")
            pg.click(".spoj-game .quiz-next"); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-summary h2").inner_text().endswith("11 z 12"), f"{vn}: score " + pg.locator(".quiz-summary h2").inner_text())
        pg.click(".quiz-summary button"); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-progress").inner_text().startswith("Kolo 1"), f"{vn}: restart")
        pg.close()
    b.close()
r.finish()
