"""Vnější stavba těla games (M7): buttons on the Vnější screen, quiz Najdi část těla on the cat photo
(all Základ body parts, photo credit with links, tap on the ear counts for Hlava), Spoj with body parts
(3 rounds of 4 + 2 funny, conflicts), end links, tablet and phone."""
import os, sys, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("vnejsi games")
with sync_playwright() as p:
    b = browser(p)
    for vn in ("tablet", "phone"):
        pg = r.watch(b.new_page(viewport=VIEWPORTS[vn]))
        pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url("/vnejsi")); pg.wait_for_timeout(300)
        hs = [a.get_attribute("href") for a in pg.locator(".screen-games a").all()]
        r.ok(hs == ["#/vnejsi/kviz", "#/vnejsi/spoj"], f"{vn}: Vnější buttons {hs}")
        r.ok(pg.locator(".atlas-svg").count() == 1, f"{vn}: atlas still there")
        # quiz
        pg.goto(url("/vnejsi/kviz")); pg.wait_for_timeout(400)
        r.ok(pg.locator(".screen-title").inner_text() == "Kvíz: Najdi část těla", f"{vn}: quiz title")
        Q = "document.querySelector('.atlas.quiz')._quiz"
        pool = pg.evaluate(Q + ".pool")
        zak = pg.evaluate("ATLAS_DATA.vnejsi.items.filter(i=>i.level==='zaklad').map(i=>i.id)")
        r.ok(sorted(pool) == sorted(zak), f"{vn}: pool = all Základ body parts ({len(pool)})")
        cr = pg.locator(".quiz .atlas-credit")
        r.ok(cr.is_visible() and cr.locator("a").count() >= 2, f"{vn}: photo credit with links")
        for i in range(10):
            st = pg.evaluate(Q + ".state"); tid = st["list"][st["i"]]
            target = "ucho" if tid == "hlava" else tid      # alsoCounts: a tap on the ear counts as the head
            pg.locator(f".quiz-spot[data-id='{target}']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(60)
            r.ok(pg.locator(".quiz-verdict.is-right").count() == 1, f"{vn}: q{i} {tid} right")
            pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(60)
        r.ok(pg.locator(".quiz-prompt").inner_text() == "Správně: 10 z 10", f"{vn}: score")
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/vnejsi" and a.inner_text() == "Zpět na vnější stavbu těla", f"{vn}: quiz back link")
        if vn == "tablet": pg.screenshot(path=shot("m7-vnejsi-quiz-result.png"))
        # Spoj
        conflicts = pg.evaluate("ATLAS_DATA.spojVnejsi.conflicts")
        items = {i["id"]: i for i in pg.evaluate("ATLAS_DATA.vnejsi.items")}
        for _ in range(5):
            pg.goto(url("/vnejsi")); pg.goto(url("/vnejsi/spoj")); pg.wait_for_timeout(200)
            rounds = pg.evaluate("document.querySelector('.spoj')._spoj.state().rounds.map(r=>r.map(i=>i.id))")
            r.ok(len(rounds) == 3 and all(len(x) == 4 for x in rounds), f"{vn}: 3 rounds of 4 {rounds}")
            flat = [i for x in rounds for i in x]
            r.ok(len(set(flat)) == len(flat) and all(items[i]["level"] == "zaklad" for i in flat), f"{vn}: no repeats, Základ only")
            for x in rounds:
                for a_, c in itertools.combinations(x, 2):
                    r.ok(not any(a_ in g and c in g for g in conflicts), f"{vn}: conflict {a_} + {c}")
        r.ok(pg.locator(".spoj-h").first.inner_text() == "Části těla", f"{vn}: column heading")
        for rnd in range(3):
            ids = pg.eval_on_selector_all(".spoj-name", "els=>els.map(e=>e.dataset.id)")
            r.ok(pg.locator(".spoj-answer[data-funny]").count() == 2, f"{vn} round {rnd}: 2 funny")
            for idv in ids:
                r.ok(pg.locator(f".spoj-answer[data-id='{idv}']").inner_text().endswith(items[idv]["coDela"]), f"{vn}: answer text {idv}")
            if rnd == 0:
                pg.click(".spoj-answer[data-funny]")
                r.ok(pg.locator(".spoj-feedback.is-funny").count() == 1, f"{vn}: funny reply")
            for idv in ids:
                pg.click(f".spoj-name[data-id='{idv}']"); pg.click(f".spoj-answer[data-id='{idv}']")
            if vn == "tablet" and rnd == 0: pg.screenshot(path=shot("m7-vnejsi-spoj.png"), full_page=True)
            pg.click(".spoj-game .quiz-next"); pg.wait_for_timeout(150)
        r.ok(pg.locator(".quiz-summary h2").inner_text().endswith("12 z 12"), f"{vn}: score " + pg.locator(".quiz-summary h2").inner_text())
        a = pg.locator(".quiz-summary a")
        r.ok(a.get_attribute("href") == "#/vnejsi" and a.inner_text() == "Zpět na vnější stavbu těla", f"{vn}: Spoj back link")
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{vn}: no sideways overflow")
        pg.close()
    b.close()
r.finish()
