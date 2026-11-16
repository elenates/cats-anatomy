"""Spoj, co patří k sobě with muscles (M5 stage 6): button on Svaly, 3 rounds of 3 + 2 funny,
no two muscles of one conflicts group in a round, funny reply, wrong pair, summary, back link, restart."""
import os, sys, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("svaly spoj")
with sync_playwright() as p:
    b = browser(p)
    for vn, vp in [("tablet", VIEWPORTS["tablet"]), ("phone", VIEWPORTS["phone"])]:
        pg = r.watch(b.new_page(viewport=vp))
        pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url("/svaly")); pg.wait_for_timeout(300)
        hs = [a.get_attribute("href") for a in pg.locator(".screen-games a").all()]
        r.ok(hs == ["#/svaly/kviz", "#/svaly/spoj", "#/svaly/skok"], f"{vn}: Svaly buttons {hs}")
        conflicts = pg.evaluate("ATLAS_DATA.spojSvaly.conflicts")
        items = {i["id"]: i for i in pg.evaluate("ATLAS_DATA.svaly.items")}
        for _ in range(5):   # random rounds: check the conflicts rule a few times
            pg.goto(url("/svaly")); pg.goto(url("/svaly/spoj")); pg.wait_for_timeout(200)
            rounds = pg.evaluate("document.querySelector('.spoj')._spoj.state().rounds.map(r=>r.map(i=>i.id))")
            r.ok(len(rounds) == 3 and all(len(x) == 3 for x in rounds), f"{vn}: 3 rounds of 3 {rounds}")
            flat = [i for x in rounds for i in x]
            r.ok(len(set(flat)) == len(flat) and all(items[i]["level"] == "zaklad" for i in flat), f"{vn}: no repeats, Základ only")
            for x in rounds:
                for a, c in itertools.combinations(x, 2):
                    r.ok(not any(a in g and c in g for g in conflicts), f"{vn}: conflict {a} + {c}")
        r.ok(pg.locator(".screen-title").inner_text() == "Spoj, co patří k sobě", f"{vn}: title")
        r.ok(pg.locator(".spoj-h").first.inner_text() == "Svaly", f"{vn}: column heading")
        for rnd in range(3):
            ids = pg.eval_on_selector_all(".spoj-name", "els=>els.map(e=>e.dataset.id)")
            r.ok(pg.locator(".spoj-answer[data-funny]").count() == 2, f"{vn} round {rnd}: 2 funny")
            for idv in ids:
                r.ok(pg.locator(f".spoj-answer[data-id='{idv}']").inner_text().endswith(items[idv]["coDela"]), f"{vn}: answer text {idv}")
            if rnd == 0:
                pg.click(".spoj-answer[data-funny]")
                r.ok("sval" in pg.locator(".spoj-feedback.is-funny").inner_text() or pg.locator(".spoj-feedback.is-funny").count() == 1, f"{vn}: funny reply")
                pg.click(f".spoj-name[data-id='{ids[0]}']"); pg.click(f".spoj-answer[data-id='{ids[1]}']")
                r.ok(pg.locator(".spoj-feedback.is-wrong").count() == 1, f"{vn}: wrong pair")
            for idv in ids:
                pg.click(f".spoj-name[data-id='{idv}']"); pg.click(f".spoj-answer[data-id='{idv}']")
            if vn == "tablet" and rnd == 0: pg.screenshot(path=shot("m5-stage6-spoj.png"), full_page=True)
            pg.click(".spoj-game .quiz-next"); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-summary h2").inner_text().endswith("8 z 9"), f"{vn}: score " + pg.locator(".quiz-summary h2").inner_text())
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/svaly" and a.inner_text() == "Zpět na svaly", f"{vn}: back link")
        pg.click(".quiz-summary button"); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-progress").inner_text().startswith("Kolo 1"), f"{vn}: restart")
        pg.close()
    b.close()
r.finish()
