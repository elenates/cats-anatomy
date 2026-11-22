"""Ordinace, the vet game (#73 stage 4c): the waiting room with every patient and Náhodný pacient; every case played
through: the story, every examination with its finding („Nic důležitého.“ when the case has none), the button to go
on only after an examination, „Co kočce je?“ with a why for each wrong card, „Co pomůže?“ with a why for each wrong
treatment, the end with Pozor!, the link to the card and the next patient; the paw in the waiting room afterwards
(only while the page is open); the dental X-ray with Ferda's X-ray finding; phone layout."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("veterina game")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1280, "height": 900}))
    pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(300)
    V = pg.evaluate("ATLAS_DATA.veterina"); N = pg.evaluate("ATLAS_DATA.nemoci"); ui = pg.evaluate("ATLAS_DATA.ui")
    cards = {c["id"]: c for c in N["items"]}
    r.ok(pg.locator(".screen-title").inner_text() == ui["vetOrdinace"], "Ordinace title")
    r.ok(pg.locator("[data-pacient]").count() == 31 and pg.locator(".vet-tlapka").count() == 0, "31 patients, no paws yet")
    for c in V["pripady"]:
        a = pg.locator(f"[data-pacient='{c['id']}']")
        r.ok(c["jmeno"] in a.inner_text() and a.locator("img").get_attribute("src") == f"images/veterina/{c['foto']}.webp", f"{c['id']}: waiting-room card")
    pg.screenshot(path=shot("veterina-cekarna.png"))

    done = []
    for c in V["pripady"]:
        pg.goto(url("/veterina/ordinace/" + c["id"])); pg.wait_for_timeout(150)
        r.ok(pg.locator(".screen-title").inner_text() == c["jmeno"] and c["pribeh"] in pg.locator(".vet-patient").inner_text(), f"{c['id']}: story")
        r.ok(pg.locator(".vet-patient img").evaluate("i => i.complete && i.naturalWidth > 0"), f"{c['id']}: photo loads")
        nxt = pg.locator(".vet-s-vysetreni .quiz-next")
        r.ok(nxt.is_disabled(), f"{c['id']}: no going on before an examination")
        r.ok(pg.locator(".vet-exam").count() == len(V["vysetreni"]), f"{c['id']}: all examinations")
        for v in V["vysetreni"]:
            pg.click(f".vet-exam[data-exam='{v['id']}']")
            t = pg.locator(f"[data-nalez='{v['id']}'] .card-p").inner_text()
            r.ok(t == c["nalezy"].get(v["id"], V["nic"]), f"{c['id']}/{v['id']}: finding")
        pg.click(f".vet-exam[data-exam='{V['vysetreni'][0]['id']}']")
        r.ok(pg.locator("[data-nalez]").count() == len(V["vysetreni"]), f"{c['id']}: a second tap does not repeat the finding")
        r.ok(not nxt.is_disabled(), f"{c['id']}: can go on"); nxt.click(); pg.wait_for_timeout(50)
        opts = pg.eval_on_selector_all(".vet-s-coje [data-option]", "els => els.map(e => [e.dataset.option, e.textContent])")
        r.ok(sorted(o for o, _ in opts) == sorted(c["moznosti"]) and all(t == cards[o]["cs"] for o, t in opts), f"{c['id']}: three cards")
        r.ok(pg.locator(".vet-s-pomuze").count() == 0, f"{c['id']}: treatment not shown yet")
        for o in c["moznosti"]:
            if o == c["nemoc"]: continue
            pg.click(f".vet-s-coje [data-option='{o}']")
            fb = pg.locator(".vet-s-coje .vet-fb").inner_text()
            r.ok(ui["vetSpatne"] in fb and c["proc"][o] in fb, f"{c['id']}: why not {o}")
            r.ok(pg.locator(f".vet-s-coje [data-option='{o}']").is_disabled(), f"{c['id']}: {o} cannot be tried again")
        pg.click(f".vet-s-coje [data-option='{c['nemoc']}']")
        r.ok(ui["vetSpravne"] in pg.locator(".vet-s-coje .vet-fb").inner_text() and pg.locator(".vet-s-pomuze").count() == 1, f"{c['id']}: right card, on to treatment")
        texts = dict(pg.eval_on_selector_all(".vet-s-pomuze [data-option]", "els => els.map(e => [e.dataset.option, e.textContent])"))
        r.ok(texts.get("lecba") == c["lecba"] and [texts.get(f"spatne-{i}") for i in (0, 1)] == [w["text"] for w in c["spatne"]], f"{c['id']}: three treatments")
        for i, w in enumerate(c["spatne"]):
            pg.click(f".vet-s-pomuze [data-option='spatne-{i}']")
            r.ok(w["proc"] in pg.locator(".vet-s-pomuze .vet-fb").inner_text(), f"{c['id']}: why not treatment {i}")
        r.ok(pg.locator(".vet-s-konec").count() == 0, f"{c['id']}: no end before the right treatment")
        pg.click(".vet-s-pomuze [data-option='lecba']"); pg.wait_for_timeout(50)
        end = pg.locator(".vet-s-konec")
        r.ok(end.count() == 1 and ui["vetHotovo"] in end.inner_text(), f"{c['id']}: end")
        r.ok((end.locator(".nemoc-pozor").count() == 1) == bool(c["pozor"]) and (not c["pozor"] or c["pozor"] in end.inner_text()), f"{c['id']}: Pozor!")
        r.ok(end.locator(f"a[href='#/veterina/nemoci/{c['nemoc']}']").count() == 1, f"{c['id']}: link to the card")
        done.append(c["id"])
        if c["id"] == "ferda":
            r.ok(pg.locator("[data-nalez='rentgen'] .vet-nalez-obr").evaluate("i => i.naturalWidth > 0"), "ferda: dental X-ray with the X-ray finding")
            pg.screenshot(path=shot("veterina-pripad.png"), full_page=True)
        if len(done) == 3:
            pg.click(".vet-s-konec a.quiz-secondary"); pg.wait_for_timeout(150)
            r.ok(sorted(pg.eval_on_selector_all(".vet-pacient.is-cured", "els => els.map(e => e.dataset.pacient)")) == sorted(done) and pg.locator(".vet-tlapka").count() == 3, "paws on the treated cats")
            pg.click(".vet-random"); pg.wait_for_timeout(150)
            h = pg.evaluate("location.hash").split("/")[-1]
            r.ok(h in [x["id"] for x in V["pripady"]] and h not in done, f"Náhodný pacient picks an untreated cat ({h})")

    # the card link and Další pacient
    pg.click(".vet-s-konec .vet-dalsi"); pg.wait_for_timeout(150)
    r.ok(pg.evaluate("location.hash").startswith("#/veterina/ordinace/") and pg.evaluate("location.hash") != "#/veterina/ordinace/" + done[-1], "Další pacient opens another case")
    pg.goto(url("/veterina/ordinace/mourek")); pg.wait_for_timeout(100)
    pg.click(".vet-exam[data-exam='prohmatat']"); pg.click(".vet-s-vysetreni .quiz-next")
    pg.click(".vet-s-coje [data-option='ucpana-mocova-trubice']"); pg.click(".vet-s-pomuze [data-option='lecba']")
    pg.click(".vet-s-konec a.part-link"); pg.wait_for_timeout(300)
    r.ok(pg.locator("dialog.info-dialog[open]").get_attribute("data-id") == "ucpana-mocova-trubice", "the end link opens the card")
    # paws last only while the page is open
    pg.reload(); pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(200)
    r.ok(pg.locator(".vet-tlapka").count() == 0, "paws are gone after a reload")

    ph = r.watch(b.new_page(viewport=VIEWPORTS["phone"]))
    ph.goto(url("/veterina/ordinace")); ph.wait_for_timeout(300)
    r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, "phone waiting room: no sideways scroll")
    ph.goto(url("/veterina/ordinace/pepina")); ph.wait_for_timeout(300)
    for v in ("prohmatat", "rentgen", "teplomer"): ph.click(f".vet-exam[data-exam='{v}']")
    ph.click(".vet-s-vysetreni .quiz-next"); ph.click(".vet-s-coje [data-option='zacpa']") if ph.locator(".vet-s-coje [data-option='zacpa']").count() else None
    r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, "phone case: no sideways scroll")
    ph.screenshot(path=shot("veterina-pripad-phone.png"), full_page=True)
    b.close()
r.finish()
