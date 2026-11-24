"""Ordinace, the vet game (#73 stage 4c, exam room #104 stage D): the cat onto the table, tools only then, the frightened-cat step for five patients; Ošetři kočku (stage F: every needed item, a wrong one says so); the waiting room with every patient and Náhodný pacient; every case played
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
    r.ok(pg.locator("[data-pacient]").count() == 32 and pg.locator(".vet-tlapka").count() == 0, "32 patients, no paws yet")
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
        r.ok(pg.locator(".vet-room-wrap .vet-exam").count() == len(V["vysetreni"]), f"{c['id']}: all examinations in the room")
        pg.wait_for_function("() => { const i = document.querySelector('.vet-cat img'); return i && i.complete && i.naturalWidth > 0; }", timeout=5000)
        r.ok(pg.locator(".vet-cat img").evaluate("i => i.complete && i.naturalWidth > 0") and
             pg.locator(".vet-cat img").get_attribute("src") == f"images/veterina/vyrezy/{c['id']}.webp", f"{c['id']}: cut-out loads")
        r.ok(pg.locator(".vet-exam:disabled").count() == len(V["vysetreni"]), f"{c['id']}: tools wait until the cat is on the table")
        pg.click(".vet-cat"); pg.wait_for_timeout(50)
        r.ok(pg.locator(".vet-room.is-on-table").count() == 1, f"{c['id']}: the cat is on the table")
        if c.get("strach"):
            S = V["strach"]; box = pg.locator(".vet-strach")
            r.ok(box.count() == 1 and c["strach"] in box.inner_text() and S["jak"] in box.inner_text(), f"{c['id']}: frightened, signs shown")
            r.ok(box.locator("img").evaluate("i => i.complete && i.naturalWidth > 0"), f"{c['id']}: frightened-cat photo loads")
            r.ok(pg.locator(".vet-exam:disabled").count() == len(V["vysetreni"]), f"{c['id']}: no examining a frightened cat")
            for i, w in enumerate(S["spatne"]):
                box.locator(f"[data-option='strach-{i}']").click()
                r.ok(w["proc"] in box.locator(".vet-fb").inner_text(), f"{c['id']}: why not frightened answer {i}")
            box.locator("[data-option='spravne']").click()
            r.ok(S["spravne"]["proc"] in box.inner_text() and S["doma"] in box.inner_text(), f"{c['id']}: the safe first step and the note for home")
        else:
            r.ok(pg.locator(".vet-strach").count() == 0, f"{c['id']}: calm cat, no frightened step")
        r.ok(pg.locator(".vet-exam:disabled").count() == 0, f"{c['id']}: tools ready")
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
        need, also = c["osetreni"], c["osetreniNavic"]
        if need or also:
            s5 = pg.locator(".vet-s-osetri")
            r.ok(s5.count() == 1 and s5.locator(".vet-room").count() == 1 and pg.locator(".vet-s-konec").count() == 0, f"{c['id']}: Ošetři kočku with the room")
            wrong = [t["id"] for t in V["lecba"] if t["id"] not in need + also + ["leky"]][0]
            s5.locator(f"[data-lecba='{wrong}']").click()
            r.ok(s5.locator(".vet-room-hint").inner_text() == ui["vetNepomuze"], f"{c['id']}: {wrong} does not help")
            s5.locator("[data-lecba='leky']").click()
            r.ok(s5.locator(".vet-leky").is_visible(), f"{c['id']}: Léky opens the drawer")
            s5.locator("[data-lek='lek-proti-alergii']").click()
            r.ok(s5.locator(".vet-room-hint").inner_text() == ui["vetNepomuze"], f"{c['id']}: lék proti alergii does not help")
            s5.locator(".vet-leky-zavrit").click()
            todo = need or also[:1]
            for i, t in enumerate(todo):
                if t.startswith("lek-"):
                    if s5.locator(".vet-leky").is_hidden(): s5.locator("[data-lecba='leky']").click()
                    s5.locator(f"[data-lek='{t}']").click()
                else:
                    if s5.locator(".vet-leky").is_visible(): s5.locator(".vet-leky-zavrit").click()
                    s5.locator(f"[data-lecba='{t}'], [data-exam='{t}']").first.click()
                last = i == len(todo) - 1
                r.ok(s5.locator(".vet-room-hint").inner_text() == (ui["vetOsetrenaHotovo"] if last else ui["vetChybi"]), f"{c['id']}: used {t}")
                r.ok((pg.locator(".vet-s-konec").count() == 1) == last, f"{c['id']}: end only after everything")
        else:
            r.ok(pg.locator(".vet-s-osetri").count() == 0, f"{c['id']}: healthy, nothing to use")
        pg.wait_for_timeout(50)
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
            r.ok(pg.locator(".vet-prekvapeni").count() == 0, "no surprise patient before enough cures")
            r.ok(pg.locator(".vet-prenosky").count() == 0, "no carriers before Rádža is cured")

    # The surprise patient (#104): the tiger cub Rádža, in the waiting room once enough cats are cured
    Z = V["zvlastni"][0]
    pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(150)
    tile = pg.locator(".vet-prekvapeni")
    r.ok(len(done) >= Z["odemknout"] and tile.count() == 1 and ui["vetPrekvapeni"] in tile.inner_text() and Z["kocka"] in tile.inner_text(), "surprise patient shown after cures")
    r.ok(tile.locator("img").evaluate("i => i.complete && i.naturalWidth > 0"), "surprise photo loads")
    for _ in range(12):
        pg.click(".vet-random"); pg.wait_for_timeout(60)
        r.ok(pg.evaluate("location.hash").split("/")[-1] != Z["id"], "Náhodný pacient never picks the surprise patient")
        pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(60)
    pg.click(".vet-prekvapeni"); pg.wait_for_timeout(150)
    r.ok(pg.locator(".screen-title").inner_text() == Z["jmeno"] and Z["pribeh"] in pg.locator(".vet-patient").inner_text(), "radza: story")
    r.ok(pg.locator(".vet-room-hint").inner_text() == Z["naStul"], "radza: put him on the table")
    pg.wait_for_function("() => { const i = document.querySelector('.vet-cat img'); return i && i.complete && i.naturalWidth > 0; }", timeout=5000)
    pg.click(".vet-cat"); pg.wait_for_timeout(50)
    box = pg.locator(".vet-strach")
    r.ok(Z["strach"] in box.inner_text() and V["strach"]["jak"] not in box.inner_text(), "radza: his own signs, not the cat ones")
    r.ok(box.locator("img").get_attribute("src") == f"images/veterina/{Z['strachFoto']}.webp" and box.locator("img").evaluate("i => i.naturalWidth > 0"), "radza: hissing tiger photo")
    r.ok(Z["texty"]["vetStrachH"] in box.inner_text() and Z["strachOtazka"] in box.inner_text(), "radza: Rádža se bojí, not kočka")
    for i, w in enumerate(Z["strachSpatne"]):
        box.locator(f"[data-option='strach-{i}']").click()
        r.ok(w["text"] in box.inner_text() and w["proc"] in box.locator(".vet-fb").inner_text(), f"radza: why not frightened answer {i}")
    box.locator("[data-option='spravne']").click()
    r.ok(Z["strachSpravne"]["proc"] in box.inner_text() and V["strach"]["doma"] not in box.inner_text(), "radza: step back and call the vet and keepers")
    for v in V["vysetreni"]:
        pg.click(f".vet-exam[data-exam='{v['id']}']")
        r.ok(pg.locator(f"[data-nalez='{v['id']}'] .card-p").inner_text() == Z["nalezy"].get(v["id"], V["nic"]), f"radza/{v['id']}: finding")
    r.ok(pg.locator(".vet-s-vysetreni .quiz-next").inner_text() == Z["vim"], "radza: own next button")
    pg.click(".vet-s-vysetreni .quiz-next"); pg.wait_for_timeout(50)
    q = pg.locator(".vet-s-coje")
    r.ok(Z["otazka"] in q.inner_text() and pg.locator(".vet-s-pomuze").count() == 0, "radza: what he needs, no diagnosis")
    for i, w in enumerate(Z["spatne"]):
        q.locator(f"[data-option='spatne-{i}']").click()
        r.ok(w["proc"] in q.locator(".vet-fb").inner_text(), f"radza: why not answer {i}")
    q.locator("[data-option='potrebuje']").click(); pg.wait_for_timeout(50)
    s5 = pg.locator(".vet-s-osetri")
    r.ok(s5.count() == 1 and Z["osetriNadpis"] in s5.inner_text() and Z["texty"]["vetOsetriIntro"] in s5.inner_text(), "radza: Ošetři Rádžu")
    s5.locator("[data-lecba='operace']").click()
    r.ok(s5.locator(".vet-room-hint").inner_text() == Z["texty"]["vetNepomuze"], "radza: a wrong item says so in his words")
    for i, t in enumerate(Z["osetreni"]):
        s5.locator(f"[data-lecba='{t}']").click()
        r.ok((pg.locator(".vet-s-konec").count() == 1) == (i == len(Z["osetreni"]) - 1), f"radza: used {t}")
    end = pg.locator(".vet-s-konec")
    r.ok(Z["hotovo"] in end.inner_text() and Z["pozor"] in end.inner_text() and end.locator("a.part-link").count() == 0, "radza: end, Pozor!, no card link")
    kl = [l for l in pg.locator(".vet-game").inner_text().split("\n") if "kočk" in l.lower() and l.strip() != "Pozor! " + Z["pozor"]]
    r.ok(not kl, f"radza: the game never calls him a cat {kl}")
    pg.screenshot(path=shot("veterina-radza.png"), full_page=True)

    # the card link and Další pacient
    pg.click(".vet-s-konec .vet-dalsi"); pg.wait_for_timeout(150)
    r.ok(pg.evaluate("location.hash").startswith("#/veterina/ordinace/") and pg.evaluate("location.hash") != "#/veterina/ordinace/" + Z["id"], "Další pacient opens another case")

    # The carrier patients (#113): closed carriers once Rádža is cured; the child chooses which one to open
    pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(150)
    P = {x["id"]: x for x in V["prenosky"]}
    box = pg.locator(".vet-prenosky")
    r.ok(box.count() == 1 and ui["vetPrenoskyH"] in box.inner_text() and box.locator(".vet-prenoska").count() == len(P), "carriers in the waiting room after Rádža")
    r.ok(all(x["jmeno"] not in box.inner_text() for x in P.values()) and box.locator("img[src$='prepravka.svg']").count() == len(P), "the carriers are closed: no names, no photos")
    r.ok(box.locator(".vet-prenoska").first.get_attribute("aria-label") == ui["vetOtevrit"].replace("{n}", "1"), "a closed carrier is named for the screen reader")
    for i in range(len(P)):
        pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(120)
        closed = pg.locator(".vet-prenoska:not(.is-open)")
        r.ok(closed.count() == len(P) - i, f"carrier {i + 1}: the opened ones stay open")
        closed.first.click(); pg.wait_for_timeout(150)
        Q = P[pg.evaluate("location.hash").split("/")[-1]]
        r.ok(pg.locator(".screen-title").inner_text() == Q["jmeno"] and Q["pribeh"] in pg.locator(".vet-patient").inner_text(), f"{Q['id']}: story")
        r.ok(pg.locator(".vet-room-hint").inner_text() == Q["naStul"], f"{Q['id']}: put on the table")
        pg.wait_for_function("() => { const i = document.querySelector('.vet-cat img'); return i && i.complete && i.naturalWidth > 0; }", timeout=5000)
        pg.click(".vet-cat"); pg.wait_for_timeout(50)
        r.ok(pg.locator(".vet-strach").count() == 0 and pg.locator(".vet-room-hint").inner_text() == Q["texty"]["vetNastroje"], f"{Q['id']}: no frightened step, own hint")
        for v in V["vysetreni"]:
            pg.click(f".vet-exam[data-exam='{v['id']}']")
            r.ok(pg.locator(f"[data-nalez='{v['id']}'] .card-p").inner_text() == Q["nalezy"].get(v["id"], V["nic"]), f"{Q['id']}/{v['id']}: finding")
        r.ok(pg.locator(".vet-s-vysetreni .quiz-next").inner_text() == Q["vim"], f"{Q['id']}: own next button")
        pg.click(".vet-s-vysetreni .quiz-next"); pg.wait_for_timeout(50)
        q = pg.locator(".vet-s-coje")
        r.ok(Q["otazka"] in q.inner_text() and pg.locator(".vet-s-pomuze").count() == 0, f"{Q['id']}: what it needs, no diagnosis")
        for j, w in enumerate(Q["spatne"]):
            q.locator(f"[data-option='spatne-{j}']").click()
            r.ok(w["proc"] in q.locator(".vet-fb").inner_text(), f"{Q['id']}: why not answer {j}")
        q.locator("[data-option='potrebuje']").click(); pg.wait_for_timeout(50)
        s5 = pg.locator(".vet-s-osetri")
        r.ok(Q["osetriNadpis"] in s5.inner_text() and Q["texty"]["vetOsetriIntro"] in s5.inner_text(), f"{Q['id']}: own treatment step")
        s5.locator("[data-lecba='operace']").click()
        r.ok(s5.locator(".vet-room-hint").inner_text() == Q["texty"]["vetNepomuze"], f"{Q['id']}: a wrong item says so in its words")
        for j, t in enumerate(Q["osetreni"]):
            if t.startswith("lek-"):
                s5.locator("[data-lecba='leky']").click(); s5.locator(f"[data-lek='{t}']").click(); s5.locator(".vet-leky-zavrit").click()
            else: s5.locator(f"[data-lecba='{t}'], [data-exam='{t}']").first.click()
            r.ok((pg.locator(".vet-s-konec").count() == 1) == (j == len(Q["osetreni"]) - 1), f"{Q['id']}: used {t}")
        end = pg.locator(".vet-s-konec")
        r.ok(Q["hotovo"] in end.inner_text() and Q["pozor"] in end.inner_text() and end.locator("a.part-link").count() == 0, f"{Q['id']}: end, Pozor!, no card link")
        kl = [l for l in pg.locator(".vet-game").inner_text().split("\n") if "kočk" in l.lower() and l.strip() != "Pozor! " + Q["pozor"]]
        r.ok(not kl, f"{Q['id']}: the game never calls it a cat {kl}")
        pg.screenshot(path=shot(f"veterina-{Q['id']}.png"), full_page=True)
    pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(150)
    r.ok(pg.locator(".vet-prenoska.is-open.is-cured").count() == len(P) and pg.locator(".vet-prenosky .vet-tlapka").count() == len(P), "both carrier patients open with a paw")
    for _ in range(10):
        pg.click(".vet-random"); pg.wait_for_timeout(50)
        r.ok(pg.evaluate("location.hash").split("/")[-1] not in list(P) + [V["narozeniny"]["id"]], "Náhodný pacient never picks a carrier patient or the birthday guest")
        pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(50)

    # The birthday guest (#113): only on 13–15 December by the device clock; the hidden address works on any day
    B = V["narozeniny"]
    days = pg.evaluate("[[12,12],[12,13],[12,14],[12,15],[12,16],[1,13]].map(d => Veterina.birthdayToday(new Date(2026, d[0] - 1, d[1])))")
    r.ok(days == [False, True, True, True, False, False], f"birthday only on 13–15 December {days}")
    today = pg.evaluate("Veterina.birthdayToday()")
    r.ok(pg.locator(".vet-narozeniny").count() == (1 if today else 0), "the birthday tile follows the date")
    pg.goto(url("/veterina/ordinace/" + B["id"])); pg.wait_for_timeout(200)
    r.ok(pg.locator(".screen-title").inner_text() == B["jmeno"] and B["pribeh"] in pg.locator(".vet-patient").inner_text(), "birthday: the hidden address opens the guest")
    r.ok(pg.locator(".vet-room-hint").inner_text() == B["naStul"] and pg.locator(".vet-krabice").is_disabled(), "birthday: the box waits for the cat")
    pg.wait_for_function("() => { const i = document.querySelector('.vet-cat img'); return i && i.complete && i.naturalWidth > 0; }", timeout=5000)
    pg.click(".vet-cat"); pg.wait_for_timeout(450)
    r.ok(pg.locator(".vet-room.is-on-table").count() == 1 and not pg.locator(".vet-krabice").is_disabled(), "birthday: the cat on the table, the box ready")
    pg.click(".vet-krabice"); pg.wait_for_timeout(100)
    end = pg.locator(".vet-s-konec")
    r.ok(pg.locator(".vet-krabice img").get_attribute("src").endswith("dort.svg") and B["hotovo"] in end.inner_text() and B["pozor"] in end.inner_text(), "birthday: the cake, Všechno nejlepší! and Pozor!")
    r.ok(pg.locator(".vet-krabice img").evaluate("i => i.naturalWidth > 0"), "birthday: the cake picture loads")
    pg.screenshot(path=shot("veterina-narozeniny.png"), full_page=True)
    pg.goto(url("/veterina/ordinace/mourek")); pg.wait_for_timeout(100)
    pg.click(".vet-cat"); pg.click(".vet-exam[data-exam='prohmatat']"); pg.click(".vet-s-vysetreni .quiz-next")
    pg.click(".vet-s-coje [data-option='ucpana-mocova-trubice']"); pg.click(".vet-s-pomuze [data-option='lecba']"); pg.click(".vet-s-osetri [data-lecba='cevka']"); pg.click(".vet-s-osetri [data-lecba='leky']"); pg.click(".vet-s-osetri [data-lek='lek-proti-bolesti']")
    pg.click(".vet-s-konec a.part-link"); pg.wait_for_timeout(300)
    r.ok(pg.locator("dialog.info-dialog[open]").get_attribute("data-id") == "ucpana-mocova-trubice", "the end link opens the card")
    # drag the cat onto the table; the keyboard; the treatment shelf only says it is for later
    pg.keyboard.press("Escape"); pg.goto(url("/veterina/ordinace/felix")); pg.wait_for_timeout(200)
    pg.locator(".vet-room").scroll_into_view_if_needed(); pg.evaluate("window.scrollBy(0, 200)"); pg.wait_for_timeout(100)
    cb = pg.locator(".vet-cat").bounding_box(); tb = pg.locator(".vet-table").bounding_box()
    pg.mouse.move(cb["x"] + cb["width"] / 2, cb["y"] + cb["height"] / 2); pg.mouse.down()
    pg.mouse.move(tb["x"] + tb["width"] / 2, tb["y"] + tb["height"] / 2, steps=8); pg.mouse.up(); pg.wait_for_timeout(50)
    r.ok(pg.locator(".vet-room.is-on-table").count() == 1, "the cat can be dragged onto the table")
    pg.click(".vet-lecba[data-lecba='leky']")
    r.ok(pg.locator(".vet-room-hint").inner_text() == ui["vetLecbaPolice"], "a treatment thing says it is for later")
    pg.goto(url("/veterina/ordinace/macek")); pg.wait_for_timeout(200)
    pg.focus(".vet-cat"); pg.keyboard.press("Enter"); pg.wait_for_timeout(50)
    r.ok(pg.locator(".vet-room.is-on-table").count() == 1, "the keyboard puts the cat on the table")
    # paws last only while the page is open
    pg.reload(); pg.goto(url("/veterina/ordinace")); pg.wait_for_timeout(200)
    r.ok(pg.locator(".vet-tlapka").count() == 0, "paws are gone after a reload")

    ph = r.watch(b.new_page(viewport=VIEWPORTS["phone"]))
    ph.goto(url("/veterina/ordinace")); ph.wait_for_timeout(300)
    r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, "phone waiting room: no sideways scroll")
    ph.evaluate("Veterina.cured.radza = true"); ph.goto(url("/veterina/ordinace/mourek")); ph.goto(url("/veterina/ordinace")); ph.wait_for_timeout(800)
    r.ok(ph.locator(".vet-prenosky").count() == 1 and ph.evaluate("document.documentElement.scrollWidth") <= 392, "phone: carriers fit the screen")
    ph.screenshot(path=shot("veterina-prenosky-phone.png"))
    ph.goto(url("/veterina/ordinace/pepina")); ph.wait_for_timeout(300)
    ph.click(".vet-cat")
    # The whole room fits the phone; the cabinet's things are a grid with names, big enough to tap
    rb = ph.locator(".vet-room").bounding_box()
    r.ok(rb["x"] >= 0 and rb["x"] + rb["width"] <= 391, "phone: the whole room fits the screen")
    tb = ph.locator(".vet-shelf [data-exam='stetoskop']").bounding_box()
    r.ok(tb["width"] >= 44 and tb["height"] >= 44 and ph.locator(".vet-shelf [data-exam='stetoskop'] .vet-tool-name").is_visible(), "phone: tools are big with names")
    r.ok(ph.locator(".vet-room").evaluate("e => getComputedStyle(e).touchAction") != "none", "phone: the room does not block scrolling")
    for v in ("prohmatat", "rentgen", "teplomer"): ph.click(f".vet-exam[data-exam='{v}']")
    ph.click(".vet-s-vysetreni .quiz-next"); ph.click(".vet-s-coje [data-option='zacpa']") if ph.locator(".vet-s-coje [data-option='zacpa']").count() else None
    r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, "phone case: no sideways scroll")
    ph.screenshot(path=shot("veterina-pripad-phone.png"), full_page=True)
    b.close()
r.finish()
