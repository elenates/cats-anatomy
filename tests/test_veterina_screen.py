"""Na veterině screens (#73 stage 4b): menu item, the section start (Ordinace not ready yet, Kočičí nemoci),
the list grouped by the three badges with every card once, every card in the pop-up (badge, five headings, Pozor!,
picture, X-ray link into Zajímavé rentgeny, body parts that open their atlas card with a way back), a deep link
that opens a card, phone layout."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("veterina screen")
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1280, "height": 900}))
    pg.goto(url()); pg.wait_for_timeout(200)
    r.ok(pg.locator("a.menu-card[href='#/veterina']").count() == 1, "Na veterině is active in the menu")
    N = pg.evaluate("ATLAS_DATA.nemoci"); ui = pg.evaluate("ATLAS_DATA.ui")

    pg.goto(url("/veterina")); pg.wait_for_timeout(200)
    r.ok(pg.locator("h1.screen-title").inner_text() == "Na veterině", "section title")
    r.ok(pg.locator(".vet-menu .menu-card.is-soon").count() == 1 and ui["vetOrdinace"] in pg.locator(".vet-menu .is-soon").inner_text(), "Ordinace shown as not ready yet")
    pg.click("a.menu-card[href='#/veterina/nemoci']"); pg.wait_for_timeout(200)
    r.ok(pg.locator("h1.screen-title").inner_text() == ui["vetNemoci"], "Kočičí nemoci opens")

    heads = pg.locator(".nemoci-h").all_inner_texts()
    r.ok(heads == list(N["badges"].values()), f"groups in badge order: {heads}")
    ids = pg.evaluate("[...document.querySelectorAll('[data-nemoc]')].map(b => b.dataset.nemoc)")
    r.ok(sorted(ids) == sorted(c["id"] for c in N["items"]) and len(ids) == 31, "every card listed once")
    for c in N["items"]:
        r.ok(pg.locator(f"#skupina-{c['badge']} [data-nemoc='{c['id']}']").count() == 1, f"{c['id']} in its group")

    for c in N["items"]:
        pg.click(f"[data-nemoc='{c['id']}']"); pg.wait_for_timeout(60)
        d = pg.locator("dialog.info-dialog[open]")
        txt = d.inner_text()
        r.ok(d.count() == 1 and pg.locator("dialog .card-title").inner_text() == c["cs"], f"{c['id']}: pop-up")
        r.ok(pg.locator("dialog .card-badge.badge-" + c["badge"]).inner_text() == N["badges"][c["badge"]], f"{c['id']}: badge")
        r.ok(all(N["labels"][k] in txt and c[k] in txt for k in ("coToJe", "jakToPoznas", "jakToVetZjisti", "coPomuze", "jakTomuPredejit")), f"{c['id']}: five headings and texts")
        r.ok((pg.locator("dialog .nemoc-pozor").count() == 1) == bool(c["pozor"]), f"{c['id']}: Pozor! box")
        if c["obrazek"]:
            r.ok(pg.evaluate("document.querySelector('dialog .nemoc-obrazek img').naturalWidth") > 0, f"{c['id']}: picture loads")
        r.ok((pg.locator(f"dialog [data-rentgen='{c['rentgen']}']").count() == 1) if c["rentgen"] else pg.locator("dialog [data-rentgen]").count() == 0, f"{c['id']}: X-ray link")
        r.ok(pg.locator("dialog [data-telo]").count() == len(c["telo"]), f"{c['id']}: body parts")
        for t in c["telo"]:
            pg.click(f"dialog [data-telo='{t['content']}/{t['id']}']"); pg.wait_for_timeout(40)
            r.ok(pg.locator("dialog").get_attribute("data-id") == t["id"] and pg.locator("dialog .card-p").count() > 0, f"{c['id']}: {t['id']} card opens")
            pg.click(f"dialog [data-back='{c['id']}']"); pg.wait_for_timeout(40)
            r.ok(pg.locator("dialog").get_attribute("data-id") == c["id"], f"{c['id']}: back from {t['id']}")
        pg.keyboard.press("Escape"); pg.wait_for_timeout(60)
        r.ok(pg.locator("dialog.info-dialog[open]").count() == 0, f"{c['id']}: closes")
        r.ok(pg.evaluate("document.activeElement.dataset.nemoc") == c["id"], f"{c['id']}: focus back on the list button")

    # X-ray link goes to the gallery
    x = [c for c in N["items"] if c["rentgen"]][0]
    pg.click(f"[data-nemoc='{x['id']}']"); pg.wait_for_timeout(60)
    pg.click(f"dialog [data-rentgen='{x['rentgen']}']"); pg.wait_for_timeout(400)
    r.ok(pg.evaluate("location.hash") == "#/rentgen/zajimave/" + x["rentgen"] and pg.locator("dialog.info-dialog[open]").count() == 0, "X-ray link opens Zajímavé rentgeny")

    # deep link opens the card
    pg.goto(url("/veterina/nemoci/cukrovka")); pg.wait_for_timeout(300)
    r.ok(pg.locator("dialog.info-dialog[open]").get_attribute("data-id") == "cukrovka", "deep link opens the card")
    pg.screenshot(path=shot("veterina-card.png"))

    ph = r.watch(b.new_page(viewport=VIEWPORTS["phone"]))
    for h in ["/veterina", "/veterina/nemoci", "/veterina/nemoci/nemocne-zuby"]:
        ph.goto(url(h)); ph.wait_for_timeout(300)
        r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, f"phone {h}: no sideways scroll")
    ph.screenshot(path=shot("veterina-phone-card.png"))
    ph.keyboard.press("Escape"); ph.wait_for_timeout(100)
    ph.screenshot(path=shot("veterina-phone-list.png"), full_page=True)
    b.close()
r.finish()
