"""O aplikaci a zdroje (M8): footer link on every screen, the page lists every image file once with author,
licence and changes, every listed file exists and has a row in sources/image-licenses.md, and the two
CC BY-SA pictures show their credit wherever they appear (atlas, quizzes, Doplň popisky, final quiz)."""
import os, sys, glob, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

r = Run("o aplikaci")
files = sorted(os.path.relpath(f, ROOT) for f in glob.glob(os.path.join(ROOT, "images", "*", "*.webp")))
rows = set(re.findall(r"^\| `(images/[^`]+)`", open(os.path.join(ROOT, "sources", "image-licenses.md"), encoding="utf-8").read(), re.M))
with sync_playwright() as p:
    b = browser(p)
    for vn in ("tablet", "phone"):
        pg = r.watch(b.new_page(viewport=VIEWPORTS[vn]))
        pg.goto(url()); pg.evaluate("localStorage.clear()")
        for h in ("", "/kostra", "/procvicovani/zaverecny"):
            pg.goto(url(h)); pg.wait_for_timeout(150)
            r.ok(pg.locator("#about-link").get_attribute("href") == "#/o-aplikaci", f"{vn}: footer link on '{h}'")
        pg.click("#about-link"); pg.wait_for_timeout(200)
        Z = pg.evaluate("ATLAS_DATA.zdroje")
        r.ok(pg.locator(".screen-title").inner_text() == Z["title"], f"{vn}: title")
        listed = pg.eval_on_selector_all("[data-file]", "els=>els.map(e=>e.dataset.file)")
        r.ok(sorted(listed) == files, f"{vn}: every image listed once; missing {set(files)-set(listed)}, extra {set(listed)-set(files)}")
        r.ok(set(files) <= rows, f"{vn}: licence rows missing for {set(files)-rows}")
        r.ok(pg.locator(".about-card").count() == len(Z["images"]), f"{vn}: one card per source")
        hrefs = pg.eval_on_selector_all(".about-section a", "els=>els.map(a=>a.getAttribute('href'))")
        r.ok(hrefs and all(h.startswith("https://") for h in hrefs), f"{vn}: links {hrefs}")
        txt = pg.locator("#app").inner_text()
        r.ok(txt.count("CC BY-SA 3.0") >= 2 and "Von.grzanka" in txt and "Persian Poet Gal" in txt and "MIT" in txt, f"{vn}: authors and licences")
        r.ok(pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), f"{vn}: no sideways overflow")
        if vn == "tablet": pg.screenshot(path=shot("m8-o-aplikaci.png"), full_page=True)
        # CC BY-SA pictures keep their credit everywhere
        for h, sel in [("/vnejsi", ".atlas-credit"), ("/organy", ".atlas-credit"), ("/vnejsi/kviz", ".quiz .atlas-credit"),
                       ("/organy/kviz", ".quiz .atlas-credit"), ("/procvicovani/popisky/cat-side", ".popisky .atlas-credit"),
                       ("/procvicovani/popisky/organs-side", ".popisky .atlas-credit")]:
            pg.goto(url(h)); pg.wait_for_timeout(300)
            c = pg.locator(sel).first
            r.ok(c.is_visible() and "CC BY-SA 3.0" in c.inner_text(), f"{vn}: credit on {h}")
        seen = set()
        for _ in range(15):
            pg.goto(url("/procvicovani")); pg.goto(url("/procvicovani/zaverecny")); pg.wait_for_timeout(250)
            for q in pg.evaluate("document.querySelector('.final')._final.state().questions"):
                if q["kind"] != "najdi" or q["sec"] not in ("vnejsi", "organy") or q["sec"] in seen: continue
                while pg.evaluate("document.querySelector('.final')._final.state().questions[document.querySelector('.final')._final.state().qi].id") != q["id"]:
                    st = pg.evaluate("document.querySelector('.final')._final.state()"); cur = st["questions"][st["qi"]]
                    if cur["kind"] == "najdi": pg.locator(".final .quiz-spot").first.focus(); pg.keyboard.press("Enter")
                    else: pg.click(".final-answer[data-ok]")
                    pg.locator(".final .quiz-next").click(); pg.wait_for_timeout(30)
                c = pg.locator(".final .atlas-credit")
                r.ok(c.is_visible() and "CC BY-SA 3.0" in c.inner_text(), f"{vn}: credit in the final quiz ({q['sec']})")
                seen.add(q["sec"]); break
            if len(seen) == 2: break
        r.ok(len(seen) == 2, f"{vn}: final quiz checked on the photo and the organ drawing ({seen})")
        pg.close()
    b.close()
r.finish()
