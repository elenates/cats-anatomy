"""Hints and cards in the games (scripts/infocard.js), the child's wish (2026-11-20).
Every game has a hint on the question screen that opens the card in a pop-up over the game (the round goes on),
and after an answer (right and wrong) a "Přečti si kartičku" button with the full card.
- Najdi (Kostra, organs, Smysly), Do které soustavy patří?, Závěrečný kvíz: "💡 Nápověda" button per question.
- Spoj and Doplň popisky: a 💡 next to each name / label.
- A hint is the whole card, even before answering (Lenka, 2026-11-20); a question answered after its hint is
  right but does not count (score / first try), and the game says so.
- Escape and "Zavřít" close the pop-up; the game state stays."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

def dlg(pg):
    return pg.evaluate("""() => { const d = document.querySelector('.info-dialog');
      return d ? { open: d.open, id: d.dataset.id, mode: d.dataset.mode, title: d.querySelector('.card-title').textContent,
        heads: [...d.querySelectorAll('.card-h')].map(h => h.textContent), hidden: !!d.querySelector('.info-hidden') } : null; }""")

def close(pg, key=False):
    if key: pg.keyboard.press("Escape")
    else: pg.click(".info-dialog .info-ok")
    pg.wait_for_timeout(100)

r = Run("quiz cards")
with sync_playwright() as p:
    b = browser(p)
    for vn in ("tablet", "phone"):
        pg = r.watch(b.new_page(viewport=VIEWPORTS[vn]))
        pg.goto(url("/")); pg.evaluate("localStorage.clear()")

        # Najdi kost
        pg.goto(url("/kostra/kviz")); pg.wait_for_timeout(300)
        st = pg.evaluate("document.querySelector('.quiz')._quiz.state")
        target = st["list"][0]
        pg.click(".hint-btn"); pg.wait_for_timeout(100)
        d = dlg(pg)
        r.ok(d and d["open"] and d["id"] == target and d["mode"] == "hint" and "Kde je?" in d["heads"] and "Co dělá?" in d["heads"], f"{vn} najdi: hint {d}")
        close(pg, key=True)
        r.ok(not dlg(pg)["open"] and pg.evaluate("document.querySelector('.quiz')._quiz.state.i") == 0, f"{vn} najdi: closed, same question")
        pg.evaluate(f"document.querySelector('.quiz')._quiz.answer({target!r})"); pg.wait_for_timeout(100)
        st = pg.evaluate("document.querySelector('.quiz')._quiz.state")
        r.ok(st["score"] == 0 and st["missed"] == [target] and pg.locator(".hint-note").count() == 1, f"{vn} najdi: right after a hint does not count {st['score']}")
        pg.locator(".quiz-next").click(); pg.wait_for_timeout(100)
        st = pg.evaluate("document.querySelector('.quiz')._quiz.state"); target = st["list"][1]
        pg.evaluate(f"document.querySelector('.quiz')._quiz.answer({target!r})"); pg.wait_for_timeout(100)
        r.ok(pg.evaluate("document.querySelector('.quiz')._quiz.state.score") == 1 and pg.locator(".hint-note").count() == 0, f"{vn} najdi: right without a hint counts")
        pg.locator(".quiz-next").click(); pg.wait_for_timeout(100)
        target = pg.evaluate("document.querySelector('.quiz')._quiz.state.list[2]")
        other = [x for x in pg.evaluate("document.querySelector('.quiz')._quiz.pool") if x != target][0]
        pg.evaluate(f"document.querySelector('.quiz')._quiz.answer({other!r})"); pg.wait_for_timeout(100)
        ids = pg.eval_on_selector_all(".quiz-more .more-btn", "els => els.map(e => e.dataset.more)")
        r.ok(ids == [target, other], f"{vn} najdi: cards after a wrong answer {ids}")
        pg.click(f".quiz-more .more-btn[data-more='{other}']"); pg.wait_for_timeout(100)
        d = dlg(pg)
        r.ok(d["open"] and d["id"] == other and d["mode"] == "card" and "Co dělá?" in d["heads"], f"{vn} najdi: full card {d}")
        if vn == "tablet": pg.screenshot(path=shot("quiz-card-tablet.png"))
        close(pg)
        r.ok(pg.locator(".quiz-next").is_visible(), f"{vn} najdi: game goes on")

        # Spoj
        pg.goto(url("/kostra/spoj")); pg.wait_for_timeout(300)
        names = pg.eval_on_selector_all(".spoj-name", "els => els.map(e => e.dataset.id)")
        r.ok(pg.locator(".spoj-names .hint-icon").count() == len(names), f"{vn} spoj: a hint per name")
        n0 = names[0]
        pg.click(f".hint-icon[data-hint='{n0}']"); pg.wait_for_timeout(100)
        d = dlg(pg)
        r.ok(d["open"] and d["mode"] == "hint" and "Co dělá?" in d["heads"], f"{vn} spoj: whole card as a hint {d}")
        if vn == "tablet": pg.screenshot(path=shot("quiz-hint-spoj-tablet.png"))
        close(pg)
        pg.click(f".spoj-name[data-id='{n0}']"); pg.click(f".spoj-answer[data-id='{n0}']"); pg.wait_for_timeout(100)
        r.ok(pg.locator(f".quiz-more .more-btn[data-more='{n0}']").count() == 1, f"{vn} spoj: card after a right pair")
        r.ok(pg.evaluate(f"document.querySelector('.spoj')._spoj.state().failed[{n0!r}]") is True and "nápovědou" in pg.locator(".spoj-feedback").inner_text(), f"{vn} spoj: hinted name is not first try")
        pg.click(f".hint-icon[data-hint='{n0}']"); pg.wait_for_timeout(100)
        r.ok(dlg(pg)["mode"] == "card", f"{vn} spoj: card without the hint badge once the pair is found")
        close(pg)
        n1 = names[1]
        pg.click(f".spoj-name[data-id='{n1}']"); pg.click(f".spoj-answer[data-id='{names[2]}']"); pg.wait_for_timeout(100)
        pg.click(f".quiz-more .more-btn[data-more='{n1}']"); pg.wait_for_timeout(100)
        d = dlg(pg)
        r.ok(d["id"] == n1 and "Co dělá?" in d["heads"], f"{vn} spoj: card after a wrong pair {d}")
        close(pg)

        # Do které soustavy patří?
        pg.goto(url("/organy/soustavy-kviz")); pg.wait_for_timeout(300)
        r.ok(pg.locator(".sk-card .hint-btn").count() == 1, f"{vn} soustavy: hint")
        pg.click(".sk-card .hint-btn"); pg.wait_for_timeout(100)
        r.ok(dlg(pg)["open"], f"{vn} soustavy: hint opens"); close(pg)
        sys_right = pg.evaluate("(() => { const it = ATLAS_DATA.organy.items.find(i => i.id === document.querySelector('.sk-card .hint-btn').dataset.hint); return it.soustava; })()")
        pg.click(f".sk-option[data-id='{sys_right}']"); pg.wait_for_timeout(100)
        r.ok(pg.locator(".sk-card .more-btn").count() == 1 and pg.locator(".sk-card .hint-btn").count() == 0, f"{vn} soustavy: card after the answer")
        r.ok("nápovědou" in pg.locator(".sk-card .spoj-feedback").inner_text(), f"{vn} soustavy: right after a hint does not count")

        # Doplň popisky
        pg.goto(url("/procvicovani/popisky/skeleton")); pg.wait_for_timeout(400)
        labels = pg.eval_on_selector_all(".popisky-label", "els => els.map(e => e.dataset.id)")
        r.ok(len(labels) > 0 and pg.locator(".popisky-labels .hint-icon").count() == len(labels), f"{vn} popisky: a hint per label")
        pg.click(f".popisky-labels .hint-icon[data-hint='{labels[0]}']"); pg.wait_for_timeout(100)
        r.ok(dlg(pg)["id"] == labels[0], f"{vn} popisky: hint"); close(pg)
        r.ok(pg.locator(f".popisky-label[data-id='{labels[0]}']").get_attribute("aria-pressed") == "false", f"{vn} popisky: hint does not pick the label")
        pg.click(f".popisky-label[data-id='{labels[0]}']"); pg.locator(f".popisky-spot[data-id='{labels[0]}']").focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(100)
        r.ok(pg.locator(f".quiz-more .more-btn[data-more='{labels[0]}']").count() == 1, f"{vn} popisky: card after a right label")
        r.ok("nápovědou" in pg.locator(".popisky-card .spoj-feedback").inner_text(), f"{vn} popisky: hinted label is not first try")

        # Závěrečný kvíz: every question has a hint; "Co dělá?" hints leave out the answer
        pg.goto(url("/procvicovani")); pg.goto(url("/procvicovani/zaverecny")); pg.wait_for_timeout(300)
        qs = pg.evaluate("document.querySelector('.final, [data-kind]') && document.querySelector('#app')")
        state = pg.evaluate("(() => { const c = [...document.querySelectorAll('#app *')].find(e => e._final); return c._final.state(); })()")
        seen = set()
        for i, q in enumerate(state["questions"]):
            r.ok(pg.locator(".hint-btn").count() == 1, f"{vn} final {i}: hint")
            pg.click(".hint-btn"); pg.wait_for_timeout(80)
            d = dlg(pg)
            r.ok(d["id"] == q["id"] and "Co dělá?" in d["heads"], f"{vn} final {i} ({q['kind']}): hint {d}")
            close(pg); seen.add(q["kind"])
            if q["kind"] == "najdi":
                pg.locator(f".quiz-spot[data-id='{q['id']}']").focus(); pg.keyboard.press("Enter")
            else:
                pg.locator(".final-answer[data-ok='1']").click()
            pg.wait_for_timeout(80)
            r.ok(pg.locator(f".quiz-more .more-btn[data-more='{q['id']}']").count() == 1, f"{vn} final {i}: card after the answer")
            pg.locator(".quiz-next").last.click(); pg.wait_for_timeout(80)
        r.ok(seen == {"najdi", "coDela", "kam"}, f"{vn} final: all kinds {seen}")
        r.ok(pg.evaluate("(() => { const c = [...document.querySelectorAll('#app *')].find(e => e._final); return c._final.state().score; })()") == 0, f"{vn} final: right answers after hints do not count")
        pg.close()
    b.close()
r.finish()
