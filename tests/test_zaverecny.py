"""Závěrečný kvíz (M7 stage 3): card on Procvičování, 15 questions (6 find, 5 Co dělá, 4 Do které části),
spread over the sections, no repeats, find questions on the right picture, funny answers set aside,
score and missed list, Diplom with the typed name (not stored) and print layout, tablet and phone."""
import os, sys, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("zaverecny")
with sync_playwright() as p:
    b = browser(p)
    for vn in ("tablet", "phone"):
        pg = r.watch(b.new_page(viewport=VIEWPORTS[vn]))
        pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url("/procvicovani")); pg.wait_for_timeout(200)
        r.ok(pg.locator(".hub-group[data-game='zaverecny'] a").get_attribute("href") == "#/procvicovani/zaverecny", f"{vn}: card on Procvičování")
        Z = pg.evaluate("ATLAS_DATA.zaverecny"); H = pg.evaluate("ATLAS_DATA.hotspots")
        items = {s["id"]: {i["id"]: i for i in pg.evaluate(f"ATLAS_DATA['{s['id']}'].items")} for s in Z["sections"]}
        names = {s["id"]: s["cs"] for s in pg.evaluate("ATLAS_DATA.sections")}
        for game in range(12):   # random games: check the rules many times
            pg.goto(url("/procvicovani")); pg.goto(url("/procvicovani/zaverecny")); pg.wait_for_timeout(300)
            qs = pg.evaluate("document.querySelector('.final')._final.state().questions")
            kinds = collections.Counter(q["kind"] for q in qs)
            r.ok(len(qs) == 15 and kinds == collections.Counter(Z["counts"]), f"{vn}: 15 questions {dict(kinds)}")
            r.ok(len({q["id"] for q in qs}) == 15, f"{vn}: no structure twice")
            secs = collections.Counter(q["sec"] for q in qs)
            r.ok(len(secs) == 5 and min(secs.values()) >= 2, f"{vn}: spread over the sections {dict(secs)}")
            r.ok(not any(q["kind"] == "kam" and q["sec"] == "vnejsi" for q in qs), f"{vn}: no 'Do které části' from Vnější")
            r.ok(all(items[q["sec"]][q["id"]]["level"] == "zaklad" for q in qs), f"{vn}: Základ only")
        right = 0
        for i, q in enumerate(qs):
            it = items[q["sec"]][q["id"]]
            prompt = pg.locator(".quiz-prompt").inner_text()
            r.ok(prompt == Z["ui"][q["kind"]].replace("{name}", it["cs"]), f"{vn}: q{i} prompt {prompt}")
            want_right = i % 3 != 2
            if q["kind"] == "najdi":
                spots = [s.get_attribute("data-id") for s in pg.locator(".final .quiz-spot").all()]
                figs = [f["figure"] for s in Z["sections"] if s["id"] == q["sec"] for f in s["figures"]]
                on = [f for f in figs if q["id"] in H[f]["layers"][[x for x in H[f]["layers"]][0]]]
                r.ok(q["id"] in spots and on, f"{vn}: q{i} {q['id']} on its picture")
                others = [x for x in spots if x != q["id"] and q["id"] not in (H[on[0]].get("alsoCounts", {}).get(x, [])) and x not in H[on[0]].get("alsoCounts", {}).get(q["id"], [])]
                tgt = q["id"] if want_right or not others else others[0]
                if tgt != q["id"]: pass
                else: want_right = True
                pg.locator(f".final .quiz-spot[data-id='{tgt}']").first.focus(); pg.keyboard.press("Enter")
            else:
                btns = pg.locator(".final-answer")
                r.ok(btns.count() == 3, f"{vn}: q{i} three answers")
                if q["kind"] == "coDela":
                    texts = [x.inner_text() for x in btns.all()]
                    r.ok(it["coDela"] in texts, f"{vn}: q{i} right text offered")
                else:
                    texts = [x.inner_text() for x in btns.all()]
                    r.ok(names[q["sec"]] in texts and pg.locator(".final-answer[data-funny]").count() == 1, f"{vn}: q{i} sections + funny {texts}")
                    pg.click(".final-answer[data-funny]")
                    r.ok(pg.locator(".spoj-feedback.is-funny").count() == 1 and pg.locator(".final .quiz-verdict").count() == 0, f"{vn}: q{i} funny reply, question still open")
                sel = ".final-answer[data-ok]" if want_right else ".final-answer:not([data-ok]):not([data-funny])"
                pg.click(sel)
            pg.wait_for_timeout(60)
            v = pg.locator(".final .quiz-verdict")
            r.ok(v.count() == 1 and ("is-right" in v.get_attribute("class")) == want_right, f"{vn}: q{i} verdict")
            right += want_right
            if vn == "tablet" and i < 3: pg.screenshot(path=shot(f"m7-stage3-q{i}-{q['kind']}.png"))
            pg.locator(".final .quiz-next").click(); pg.wait_for_timeout(80)
        r.ok(pg.locator(".final-summary h2").inner_text() == f"Správně: {right} z 15", f"{vn}: score " + pg.locator(".final-summary h2").inner_text())
        r.ok(pg.locator(".final-summary .quiz-missed li").count() == 15 - right, f"{vn}: missed list")
        pg.fill("#diplom-name", "Bára"); pg.click(".diplom-box .quiz-next >> nth=0"); pg.wait_for_timeout(100)
        d = pg.locator(".diplom").inner_text()
        r.ok("Bára" in d and f"{right} z 15" in d, f"{vn}: diplom text")
        r.ok(pg.locator(".diplom-text em").inner_text() == Z["ui"]["diplomAtlas"], f"{vn}: atlas title in italics")
        r.ok("Bára" not in pg.evaluate("JSON.stringify(localStorage)+document.cookie"), f"{vn}: name not stored")
        pg.evaluate("window.print = function () { window.__printed = true; }")
        pg.click(".diplom-box .quiz-next >> nth=1"); pg.wait_for_timeout(50)
        r.ok(pg.evaluate("window.__printed === true && document.body.classList.contains('print-diplom')"), f"{vn}: print")
        if vn == "tablet":
            pg.screenshot(path=shot("m7-stage3-summary.png"), full_page=True)
            pg.emulate_media(media="print"); pg.screenshot(path=shot("m7-stage3-diplom-print.png")); pg.emulate_media(media="screen")
        hs = [a.get_attribute("href") for a in pg.locator(".final-summary > .quiz-actions a").all()]
        r.ok(hs == ["#/procvicovani"], f"{vn}: back link {hs}")
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{vn}: no sideways overflow")
        pg.close()
    b.close()
r.finish()
