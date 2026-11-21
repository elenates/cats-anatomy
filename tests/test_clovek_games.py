"""Kočka a člověk games (#72 stage 5): the three buttons on the screen and in Procvičování; Má to kočka, člověk, nebo oba?
(data, a full game, funny answer, wrong answer, hint, summary); Najdi kost u člověka (questions on the two human
skeletons, a right tap); Spoj, co patří k sobě (rounds from the chosen parts, conflicts, Kde ji najdeš texts); phone."""
import os, sys, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("clovek games")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport=VIEWPORTS["tablet"]))
    pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url("/clovek")); pg.wait_for_timeout(300)
    hs = [a.get_attribute("href") for a in pg.locator(".screen-games a").all()]
    r.ok(hs == ["#/clovek/kdo-ma", "#/clovek/najdi", "#/clovek/spoj"], f"game buttons {hs}")
    pg.goto(url("/procvicovani")); pg.wait_for_timeout(200)
    hs = [a.get_attribute("href") for a in pg.locator(".hub-group[data-section='clovek'] a").all()]
    r.ok(hs == ["#/clovek/kdo-ma?od=procvicovani", "#/clovek/najdi?od=procvicovani", "#/clovek/spoj?od=procvicovani"], f"Procvičování {hs}")

    # ----- Má to kočka, člověk, nebo oba? -----
    K = pg.evaluate("ATLAS_DATA.kdoMa"); C = {i["id"]: i for i in pg.evaluate("ATLAS_DATA.clovek.items")}
    ids = [x["id"] for x in K["items"]]
    r.ok(len(ids) == len(set(ids)), "kdoMa: unique ids")
    for x in K["items"]:
        r.ok(x["a"] in ("kocka", "clovek", "oba") and x["q"].endswith("?") and x["text"], f"kdoMa {x['id']}: fields")
        r.ok(x["card"] is None or x["card"] in C, f"kdoMa {x['id']}: card {x['card']}")
    r.ok({x["a"] for x in K["items"]} == {"kocka", "clovek", "oba"}, "kdoMa: all three answers are used")
    pg.goto(url("/clovek/kdo-ma")); pg.wait_for_timeout(300)
    st = "document.querySelector('.kdo-ma')._kdo.state"
    total = pg.evaluate(st + ".list.length")
    r.ok(total == K["questions"], f"{total} questions")
    by_q = {x["q"]: x for x in K["items"]}
    for n in range(total):
        it = by_q[pg.locator(".quiz-prompt").inner_text()]
        r.ok(pg.locator(".kdo-answers button[data-id]").count() == 3 and pg.locator(".kdo-answers button[data-funny]").count() == 1, f"q{n}: 3 answers + 1 funny")
        r.ok(pg.locator(".quiz-more .hint-btn").count() == (1 if it["card"] else 0), f"q{n}: hint button")
        if n == 0:
            pg.click(".kdo-answers button[data-funny]")
            r.ok(pg.locator(".spoj-feedback.is-funny").count() == 1 and pg.locator(".kdo-answers button[data-funny]").is_disabled(), "funny answer set aside")
        if n == 1:   # wrong answer
            wrong = [k for k in ("kocka", "clovek", "oba") if k != it["a"]][0]
            pg.click(f".kdo-answers button[data-id='{wrong}']")
            r.ok(pg.locator(".spoj-feedback.is-wrong").count() == 1 and pg.locator(f".kdo-answers .is-right[data-id='{it['a']}']").count() == 1, "wrong answer: right one shown")
        else:
            if n == 2 and it["card"]:
                pg.click(".quiz-more .hint-btn"); pg.wait_for_timeout(100)
                r.ok(pg.locator("dialog.info-dialog[open][data-mode='hint']").count() == 1, "hint opens the card")
                r.ok(C[it["card"]]["srovnani"] in pg.locator("dialog.info-dialog").inner_text(), "hint card shows the comparison")
                pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
            pg.click(f".kdo-answers button[data-id='{it['a']}']")
            r.ok(pg.locator(".spoj-feedback.is-right").count() == 1, f"q{n}: right")
        r.ok(it["text"] in pg.locator(".quiz-explain").inner_text(), f"q{n}: explanation")
        pg.click(".kdo-card .quiz-next"); pg.wait_for_timeout(60)
    score = pg.evaluate(st + ".score")
    r.ok(score in (total - 1, total - 2), f"score {score} of {total} (one wrong, maybe one hint)")
    r.ok(pg.locator(".quiz-summary a").get_attribute("href") == "#/clovek", "back link")
    pg.screenshot(path=shot("clovek-kdo-ma.png"), full_page=True)

    # ----- Najdi kost u člověka -----
    pg.goto(url("/clovek/najdi")); pg.wait_for_timeout(400)
    qz = "document.querySelector('.quiz')._quiz"
    pool = pg.evaluate(qz + ".pool")
    r.ok(len(pool) >= 10 and all(C[i]["level"] == "zaklad" for i in pool), f"Najdi pool {len(pool)}")
    for n in range(3):
        target = pg.evaluate(qz + ".state.list[" + qz + ".state.i]")
        target = target if isinstance(target, str) else target.get("id", target)
        r.ok(pg.evaluate(qz + ".figure()") in ("clovek-zepredu", "clovek-zboku"), "question on a human skeleton")
        pg.evaluate(f"id => {qz}.answer(id)", target); pg.wait_for_timeout(100)
        r.ok(pg.locator(".quiz-feedback").inner_text().strip() != "", f"Najdi q{n}: answered")
        pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(150)
    r.ok(pg.locator(".atlas-credit a").count() >= 1, "Najdi: picture credit")

    # ----- Spoj, co patří k sobě -----
    S = pg.evaluate("ATLAS_DATA.spojClovek")
    r.ok(all(i in C and C[i]["level"] == "zaklad" for i in S["only"]), "Spoj: parts exist, Základ")
    for _ in range(4):
        pg.goto(url("/clovek")); pg.goto(url("/clovek/spoj")); pg.wait_for_timeout(200)
        rounds = pg.evaluate("document.querySelector('.spoj')._spoj.state().rounds.map(r=>r.map(i=>i.id))")
        flat = [i for x in rounds for i in x]
        r.ok(len(rounds) == 3 and all(len(x) == 4 for x in rounds) and len(set(flat)) == 12, f"Spoj rounds {rounds}")
        r.ok(all(i in S["only"] for i in flat), "Spoj: only the chosen parts")
        for x in rounds:
            for a, c in itertools.combinations(x, 2):
                r.ok(not any(a in g and c in g for g in S["conflicts"]), f"Spoj conflict {a} + {c}")
    for rnd in range(3):
        ids = pg.eval_on_selector_all(".spoj-name", "els=>els.map(e=>e.dataset.id)")
        for i in ids:
            r.ok(pg.locator(f".spoj-answer[data-id='{i}']").inner_text().endswith(C[i]["kdeJe"]), f"Spoj answer {i}")
            pg.click(f".spoj-name[data-id='{i}']"); pg.click(f".spoj-answer[data-id='{i}']")
        pg.click(".spoj-game .quiz-next"); pg.wait_for_timeout(100)
    r.ok(pg.locator(".quiz-summary h2").inner_text().endswith("12 z 12"), "Spoj score " + pg.locator(".quiz-summary h2").inner_text())
    r.ok(pg.locator(".quiz-summary a").get_attribute("href") == "#/clovek", "Spoj back link")

    # ----- phone -----
    ph = r.watch(b.new_page(viewport=VIEWPORTS["phone"]))
    for g in ["kdo-ma", "najdi", "spoj"]:
        ph.goto(url("/clovek/" + g)); ph.wait_for_timeout(300)
        r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, f"phone {g}: no sideways scroll")
    b.close()
r.finish()
