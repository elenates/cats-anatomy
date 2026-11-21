"""Kočka a člověk screen (#72 stage 4): menu, tabs and views, both pictures with one toolbar, a tap on either picture
selects the partner in the other one and fills the shared card (Stejné / Jiné badge, comparison, cat card in a pop-up),
cat parts without a human partner, the Klouby layer on both, every human hotspot has a card, Zajímavosti with the
tiger pictures, credits, phone layout."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("clovek screen")
VIEWS = ["kostra/na-ctyrech", "kostra/zepredu", "kostra/zboku", "kostra/zezadu", "organy", "rozmnozovaci/muz", "rozmnozovaci/zena"]
with sync_playwright() as p:
    b = browser(p); pg = r.watch(b.new_page(viewport={"width": 1280, "height": 900}))
    pg.goto(url()); pg.evaluate("localStorage.clear()"); pg.goto(url()); pg.wait_for_timeout(200)
    r.ok(pg.locator("a.menu-card[href='#/clovek']").count() == 1, "Kočka a člověk is active in the menu")
    C = pg.evaluate("ATLAS_DATA.clovek"); ui = pg.evaluate("ATLAS_DATA.ui")
    items = {i["id"]: i for i in C["items"]}

    pg.goto(url("/clovek")); pg.wait_for_timeout(400)
    r.ok(pg.locator(".fig-tab[aria-current='page']").first.inner_text() == ui["clovekTabKostra"], "Kostra is the first tab")
    r.ok(pg.locator(".clovek-bar .atlas-toolbar").count() == 1 and pg.locator(".atlas-toolbar").count() == 1, "one toolbar above both pictures")
    r.ok(pg.locator(".atlas-card").count() == 1 and pg.locator(".clovek-card .card-empty").inner_text() == ui["clovekEmpty"], "one shared card")

    for v in VIEWS:
        pg.goto(url("/clovek/" + v)); pg.wait_for_timeout(400)
        hum = pg.evaluate("document.querySelector('.clovek-human')._atlas.visible()")
        r.ok(len(hum) > 0 and pg.locator(".clovek-cat .hotspot").count() > 0, f"{v}: hotspots on both pictures")
        r.ok(pg.locator(".clovek-human .atlas-credit a").count() >= 1, f"{v}: human picture credit with a link")
        for hid in hum:   # every human hotspot fills the card; its cat partner is selected when it is on the cat picture
            pg.evaluate("id => document.querySelector('.clovek-human')._atlas.select(id)", hid); pg.wait_for_timeout(30)
            it = items[hid]
            card = pg.locator(".clovek-card").inner_text()
            r.ok(it["cs"] in card and it["srovnani"] in card, f"{v}/{hid}: card with the comparison")
            r.ok(pg.locator(".clovek-card .vztah-" + it["vztah"]).count() == 1, f"{v}/{hid}: {it['vztah']} badge")
            cat_sel = pg.evaluate("document.querySelector('.clovek-cat')._atlas.selected")
            cat_vis = pg.evaluate("document.querySelector('.clovek-cat')._atlas.visible()")
            if it["kocka"] and it["kocka"] in cat_vis:
                r.ok(cat_sel == it["kocka"], f"{v}/{hid}: cat partner {it['kocka']} selected (got {cat_sel})")
            else:
                r.ok(cat_sel is None, f"{v}/{hid}: nothing selected on the cat")
        # a tap on the cat selects the human partner
        cat_vis = pg.evaluate("document.querySelector('.clovek-cat')._atlas.visible()")
        both = [c for c in cat_vis if any(i["kocka"] == c and i["id"] in hum for i in C["items"])]
        if both:
            c = both[0]; h = [i for i in C["items"] if i["kocka"] == c][0]["id"]
            pg.evaluate("id => document.querySelector('.clovek-cat')._atlas.select(id)", c); pg.wait_for_timeout(50)
            r.ok(pg.evaluate("document.querySelector('.clovek-human')._atlas.selected") == h, f"{v}: cat {c} selects human {h}")

    # cat part with no human part on this picture: the card says so and offers the cat card
    pg.goto(url("/clovek/kostra/na-ctyrech")); pg.wait_for_timeout(400)
    pg.evaluate("document.querySelector('.clovek-cat')._atlas.select('ocasni-obratle')"); pg.wait_for_timeout(50)
    r.ok(ui["clovekCatOnly"] in pg.locator(".clovek-card").inner_text(), "cat-only part: note in the card")
    r.ok(pg.evaluate("document.querySelector('.clovek-human')._atlas.selected") is None, "cat-only part: nothing on the human")
    # cat card in the pop-up
    pg.evaluate("document.querySelector('.clovek-human')._atlas.select('lopatka')"); pg.wait_for_timeout(50)
    pg.locator(".clovek-card [data-cat='lopatka']").click(); pg.wait_for_timeout(150)
    r.ok(pg.locator("dialog.info-dialog[open]").count() == 1 and pg.locator("dialog.info-dialog .card-title").inner_text() == "Lopatka", "cat card opens in a pop-up")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
    # Klouby on both pictures
    pg.locator(".clovek-bar [data-layer='klouby']").click(); pg.wait_for_timeout(200)
    r.ok(pg.evaluate("document.querySelector('.clovek-cat')._atlas.state.layer") == "klouby", "cat picture follows the Klouby layer")
    pg.evaluate("document.querySelector('.clovek-human')._atlas.select('kolenni-kloub')"); pg.wait_for_timeout(50)
    r.ok(pg.evaluate("document.querySelector('.clovek-cat')._atlas.selected") == "kolenni-kloub", "knee joint selected on the cat")
    pg.locator(".clovek-bar [data-layer='kosti']").click(); pg.wait_for_timeout(100)
    # Popisky on both pictures
    pg.locator(".clovek-bar [data-toggle='popisky']").click(); pg.wait_for_timeout(200)
    r.ok(pg.locator(".clovek-cat .atlas-label").count() > 0 and pg.locator(".clovek-human .atlas-label").count() > 0, "Popisky on both pictures")
    pg.locator(".clovek-bar [data-toggle='popisky']").click(); pg.wait_for_timeout(100)

    # Zajímavosti
    pg.goto(url("/clovek/zajimavosti/tygr-stoji")); pg.wait_for_timeout(300)
    r.ok(pg.locator(".fakt").count() == len(C["fakta"]), "all fact cards")
    r.ok(pg.locator("#fakt-tygr-stoji.is-focus img").count() == 2, "tiger card: two pictures, focused")
    r.ok(pg.locator(".fakt .vztah-stejne").count() == sum(1 for f in C["fakta"] if f["vztah"] == "stejne"), "Stejné badges")
    r.ok(pg.evaluate("[...document.images].every(i => i.complete && i.naturalWidth > 0)"), "pictures load")
    pg.screenshot(path=shot("clovek-fakta.png"), full_page=True)

    # Co je jiné?
    pg.goto(url("/clovek/rozdily")); pg.wait_for_timeout(300)
    jine = [i for i in C["items"] if i["vztah"] == "jine"]
    fj = [f for f in C["fakta"] if f["vztah"] == "jine" and f.get("rozdil") is not False]
    r.ok(pg.locator(".rozdily .fakt").count() == len(jine) + len(fj), f"Co je jiné?: {len(jine)} parts + {len(fj)} fact cards")
    r.ok(pg.locator("#rozdil-tygr-stoji").count() == 0, "the standing tiger is not a difference")
    for i in jine:
        r.ok(i["srovnani"] in pg.locator("#rozdil-" + i["id"]).inner_text(), f"Co je jiné? {i['id']}: comparison")
    for i in jine:
        pg.goto(url("/clovek/rozdily")); pg.wait_for_timeout(200)
        pg.click(f"[data-show='{i['id']}']"); pg.wait_for_timeout(350)
        r.ok(pg.evaluate("document.querySelector('.clovek-human')._atlas.selected") == i["id"] and i["cs"] in pg.locator(".clovek-card").inner_text(),
             f"Ukaž na obrázku {i['id']}: selected on {pg.evaluate('location.hash')}")
    pg.goto(url("/clovek/rozdily")); pg.wait_for_timeout(200)
    pg.click("#rozdil-ocas a"); pg.wait_for_timeout(300)
    r.ok(pg.locator("#fakt-ocas.is-focus").count() == 1, "fact card link opens Zajímavosti")
    pg.evaluate("localStorage.clear()")

    # phone
    ph = r.watch(b.new_page(viewport=VIEWPORTS["phone"]))
    for v in ["kostra/zepredu", "organy", "zajimavosti", "rozdily"]:
        ph.goto(url("/clovek/" + v)); ph.wait_for_timeout(400)
        r.ok(ph.evaluate("document.documentElement.scrollWidth") <= 392, f"phone {v}: no sideways scroll")
    ph.goto(url("/clovek/kostra/na-ctyrech")); ph.wait_for_timeout(400)
    ph.evaluate("document.querySelector('.clovek-human')._atlas.select('lebka')"); ph.wait_for_timeout(100)
    ph.screenshot(path=shot("clovek-phone.png"), full_page=True)
    b.close()
r.finish()
