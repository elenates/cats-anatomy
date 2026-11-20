"""Kočičí rentgen stage 4 (#43): the screen.
- Menu item; mode tabs Kosti / Orgány / Svaly; Kosti views Kreslená kočka / Skutečný rentgen / Zajímavé rentgeny.
- Glass views (Kosti on the 1845 cat, Orgány and Svaly on the photo): the glass shows the X-ray picture; every
  structure can be reached by a tap inside its area (with Pro zvídavé on), and the list starts with the smallest one;
  Pro zvídavé off hides the extra structures; the whole-cat button swaps the picture and hides the glass; the
  keyboard moves the glass and picks the spot; a real tap on a touch screen works.
- Skutečný rentgen A and B: every bone can be reached; credits shown.
- Zajímavé rentgeny: 9 cards; on each X-ray, a tap on the special thing shows its text, a miss says so, and
  "Ukaž mi to" shows every area.
- Wildcat sentence and the approximate-position note; no page errors on tablet and phone."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

INTERIOR = """(polys) => {
  const g = Atlas.geom;
  for (const p of polys) {
    const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    let best = null;
    for (let i = 0; i <= 24; i++) for (let j = 0; j <= 24; j++) {
      const x = x0 + (x1 - x0) * i / 24, y = y0 + (y1 - y0) * j / 24;
      if (!g.pointInPoly(x, y, p)) continue;
      const d = Math.min(...p.map((q, k) => g.nearestOnPoly(x, y, p)[2]));
      if (!best || d > best.d) best = { x, y, d };
    }
    if (best) return [best.x, best.y];
  }
  return null;
}"""

def chips(pg):
    return pg.eval_on_selector_all(".rg-found .organ-chip", "els => els.map(e => e.dataset.id)")

def reach_all(r, pg, name, areas_js):
    """Every area: a pick at a point well inside it lists it."""
    ids = pg.evaluate(f"Object.keys({areas_js})")
    for sid in ids:
        pt = pg.evaluate(f"({INTERIOR})({areas_js}[{sid!r}].polys || {areas_js}[{sid!r}].shapes)")
        if not pt: r.ok(False, f"{name}/{sid}: no inner point"); continue
        pg.evaluate(f"document.querySelector('.rentgen')._rentgen.pickAt({pt[0]}, {pt[1]}, 1)")
        got = chips(pg)
        r.ok(sid in got, f"{name}/{sid}: listed at its own spot, got {got}")
    return ids

r = Run("rentgen screen")
with sync_playwright() as p:
    b = browser(p)
    pg = r.watch(b.new_page(viewport=VIEWPORTS["tablet"]))
    pg.goto(url("/")); pg.evaluate("localStorage.setItem('atlas.toggles', JSON.stringify({zvidave: true}))")
    r.ok(pg.locator("a.menu-card[href='#/rentgen']").count() == 1, "menu item")
    pg.goto(url("/rentgen")); pg.wait_for_timeout(500)
    tabs = pg.eval_on_selector_all(".fig-tab", "els => els.map(e => [e.textContent, e.getAttribute('aria-current')])")
    r.ok([t[0] for t in tabs] == ["Kosti", "Orgány", "Svaly", "Kreslená kočka", "Skutečný rentgen", "Zajímavé rentgeny"], f"tabs {tabs}")
    r.ok(tabs[0][1] == "page" and tabs[3][1] == "page", "Kosti / Kreslená kočka current")
    txt = pg.locator("#app").inner_text()
    r.ok("kočka divoká" in txt and "téměř stejně" in txt and "jen přibližně" in txt, "wildcat sentence and note")
    r.ok("Straus-Durkheim" in pg.locator(".rg-credits").inner_text(), "credit")
    r.ok("kostra-na-kocce.webp" in pg.locator(".rg-lens").evaluate("e => e.style.backgroundImage"), "glass shows the moved skeleton")
    K = "ATLAS_DATA.rentgenKosti.kresba.areas"
    reach_all(r, pg, "kresba", K)
    # the list starts with the smallest structure: the atlas vertebra inside the neck inside the spine
    pt = pg.evaluate(f"({INTERIOR})({K}.nosic.polys)")
    pg.evaluate(f"document.querySelector('.rentgen')._rentgen.pickAt({pt[0]}, {pt[1]}, 1)")
    got = chips(pg)
    r.ok(got[:1] == ["nosic"] and "krcni-obratle" in got and "pater" in got, f"smallest first {got}")
    r.ok(pg.locator(".rg-title").inner_text() == "Nosič", "card of the first one")
    r.ok(pg.locator(".rg-hl path[data-id='nosic']").count() == 1, "highlight")
    pg.click(".rg-found .organ-chip[data-id='pater']"); pg.wait_for_timeout(100)
    r.ok(pg.locator(".rg-hl path[data-id='pater']").count() == 1 and pg.locator(".rg-title").inner_text() == "Páteř", "other name switches")
    r.ok(pg.locator(".card-link a").get_attribute("href") == "#/kostra", "link to Kostra")
    # Pro zvídavé off hides the atlas vertebra
    pg.click(".toggle[data-toggle='zvidave']"); pg.wait_for_timeout(100)
    pg.evaluate(f"document.querySelector('.rentgen')._rentgen.pickAt({pt[0]}, {pt[1]}, 1)")
    r.ok("nosic" not in chips(pg) and "krcni-obratle" in chips(pg), f"zvidave off {chips(pg)}")
    pg.click(".toggle[data-toggle='zvidave']")
    # a miss
    pg.evaluate("document.querySelector('.rentgen')._rentgen.pickAt(5, 5, 1)")
    r.ok(pg.locator(".rg-card").inner_text().strip() == "Tady nic nenajdeš. Klepni na kočku.", "miss")
    # a real mouse click moves the glass there and picks
    box = pg.locator(".rg-stage").bounding_box()
    x, y = box["x"] + box["width"] * 0.38, box["y"] + box["height"] * 0.42
    pg.mouse.move(x, y); pg.mouse.click(x, y); pg.wait_for_timeout(150)
    lb = pg.locator(".rg-lens").bounding_box()
    r.ok(abs(lb["x"] + lb["width"] / 2 - x) < 3 and abs(lb["y"] + lb["height"] / 2 - y) < 3, "glass under the mouse")
    r.ok("zebra" in chips(pg), f"click on the chest: {chips(pg)}")
    # keyboard
    pg.focus(".rg-lens"); before = pg.evaluate("({...document.querySelector('.rentgen')._rentgen.pos})")
    pg.keyboard.press("ArrowRight"); pg.keyboard.press("Enter"); pg.wait_for_timeout(100)
    after = pg.evaluate("({...document.querySelector('.rentgen')._rentgen.pos})")
    r.ok(after["x"] > before["x"] and pg.locator(".rg-card").inner_text().strip() != "", "keyboard moves and picks")
    pg.screenshot(path=shot("rentgen-kresba-tablet.png"))
    # whole cat
    pg.click(".rg-whole-btn"); pg.wait_for_timeout(200)
    r.ok(pg.locator(".rg-whole-btn").get_attribute("aria-pressed") == "true" and pg.locator(".rg-whole-btn").inner_text() == "Zpět na lupu", "whole button")
    r.ok("kostra-rentgen.webp" in pg.locator(".rg-base").get_attribute("src") and pg.locator(".rg-lens").is_hidden(), "whole picture, no glass")
    r.ok(pg.locator(".rg-card").inner_text().strip() == "Klepni na místo, které tě zajímá.", "whole: card hint without the glass")
    reach_all(r, pg, "kresba/cela", "ATLAS_DATA.rentgenKosti.kresba.cela.areas")
    pg.screenshot(path=shot("rentgen-cela-tablet.png"))
    pg.click(".rg-whole-btn"); pg.wait_for_timeout(100)
    r.ok("kocka.webp" in pg.locator(".rg-base").get_attribute("src") and pg.locator(".rg-lens").is_visible(), "back to the glass")

    for m, layer in (("organy", "layer-organy"), ("svaly", "layer-svaly")):
        pg.goto(url("/rentgen/" + m)); pg.wait_for_timeout(400)
        r.ok(layer in pg.locator(".rg-lens").evaluate("e => e.style.backgroundImage"), f"{m}: glass shows the layer")
        r.ok(pg.locator(".fig-tab[aria-current='page']").count() == 1, f"{m}: one current tab")
        reach_all(r, pg, m, f"ATLAS_DATA.rentgenAreas.areas.{m}")
        pg.click(".rg-whole-btn"); pg.wait_for_timeout(150)
        r.ok(pg.locator(".rg-over img").count() == 1 and "xray-base" in pg.locator(".rg-base").get_attribute("src"), f"{m}: whole cat")
        pg.screenshot(path=shot(f"rentgen-{m}-tablet.png"))

    for n in (1, 2):
        pg.goto(url(f"/rentgen/skutecny/{n}")); pg.wait_for_timeout(400)
        r.ok(pg.locator(".rg-real-note").count() == 1 and pg.locator(".rg-credits .atlas-credit").count() == 1, f"real {n}: note and credit")
        reach_all(r, pg, f"skutecny{n}", f"ATLAS_DATA.rentgenKosti.skutecny[{n - 1}].areas")
        pg.screenshot(path=shot(f"rentgen-skutecny{n}-tablet.png"))

    pg.goto(url("/rentgen/zajimave")); pg.wait_for_timeout(400)
    cards = pg.eval_on_selector_all(".rg-gal-card", "els => els.map(e => e.dataset.id)")
    r.ok(len(cards) == 9, f"gallery cards {cards}")
    pg.screenshot(path=shot("rentgen-galerie-tablet.png"), full_page=True)
    T = pg.evaluate("ATLAS_DATA.rentgen.galerie")
    for gid in cards:
        pg.goto(url(f"/rentgen/zajimave/{gid}")); pg.wait_for_timeout(250)
        r.ok(pg.locator(".rg-gal-h").inner_text() == T[gid]["cs"], f"{gid}: title")
        r.ok("Najdi na snímku" in pg.locator(".rg-card").inner_text(), f"{gid}: task")
        areas = pg.evaluate(f"ATLAS_DATA.rentgenKosti.galerie.find(g => g.id === {gid!r}).areas")
        for a in areas:
            pt = pg.evaluate(f"({INTERIOR})({a['shapes']!r})")
            pg.evaluate(f"document.querySelector('.rentgen')._rentgen.pickAt({pt[0]}, {pt[1]}, 1)")
            r.ok(pg.locator(".rg-title").inner_text() == a["label"] and T[gid]["areas"][a["id"]] in pg.locator(".rg-card").inner_text(), f"{gid}/{a['id']}: text")
        pg.evaluate("document.querySelector('.rentgen')._rentgen.pickAt(-500, -500, 1)")
        r.ok("Tady to není" in pg.locator(".rg-card").inner_text(), f"{gid}: miss")
        pg.click(".rg-show"); pg.wait_for_timeout(100)
        r.ok(pg.locator(".rg-hl path").count() == len(areas), f"{gid}: Ukaž mi to")
        r.ok(pg.locator(".rg-credits .atlas-credit").count() >= 1, f"{gid}: credit")
    pg.screenshot(path=shot("rentgen-jehla-tablet.png"))

    # phone, real touch
    ph = r.watch(b.new_page(viewport=VIEWPORTS["phone"], has_touch=True, is_mobile=True))
    ph.goto(url("/rentgen")); ph.wait_for_timeout(500)
    box = ph.locator(".rg-stage").bounding_box()
    ph.touchscreen.tap(box["x"] + box["width"] * 0.38, box["y"] + box["height"] * 0.42); ph.wait_for_timeout(300)
    r.ok(len(chips(ph)) >= 1, f"phone tap: {chips(ph)}")
    r.ok(ph.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "phone: no sideways scroll")
    ph.screenshot(path=shot("rentgen-kresba-phone.png"), full_page=True)
    b.close()
r.finish()
