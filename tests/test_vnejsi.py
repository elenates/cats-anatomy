import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import INDEX, shot, browser
import sys
from playwright.sync_api import sync_playwright
root=INDEX
errs=[]; fails=[]
def ok(c,m):
    if not c: fails.append(m)
with sync_playwright() as p:
    b=browser(p)
    for name,vp in [("tablet",{"width":1024,"height":768}),("phone",{"width":390,"height":844}),("desktop",{"width":1440,"height":900})]:
        pg=b.new_page(viewport=vp); pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: m.type=="error" and errs.append(m.text))
        pg.goto(root); pg.evaluate("localStorage.clear()"); pg.goto(root+"#/")
        card=pg.locator("a[href='#/vnejsi']")
        ok(card.count()==1, name+": menu link to vnejsi")
        card.first.click(); pg.wait_for_timeout(300)
        ok(pg.locator(".screen-title").inner_text()=="Vnější stavba těla", name+": title")
        ok(pg.locator(".atlas-svg").get_attribute("aria-label")=="Fotka kočky", name+": aria")
        cr=pg.locator(".atlas-credit")
        ok("Von.grzanka" in cr.inner_text() and "CC BY-SA 3.0" in cr.inner_text(), name+": credit text "+cr.inner_text())
        hrefs=[a.get_attribute("href") for a in cr.locator("a").all()]
        ok(hrefs==["https://commons.wikimedia.org/wiki/File:Felis_catus-cat_on_snow.jpg","https://creativecommons.org/licenses/by-sa/3.0/"], name+": credit links %s"%hrefs)
        ok(pg.locator(".card-empty").inner_text()=="Klepni na část těla na fotce.", name+": empty")
        ok(pg.locator(".seg").count()==0, name+": no layer switch (single layer)")
        n=pg.locator(".hotspot").count()
        ok(n==15, name+": 15 Základ hotspots, got %d"%n)
        # tap ocas -> card + bones link
        pg.locator(".hotspot[data-id='ocas']").first.click(force=True); pg.wait_for_timeout(200)
        ok(pg.locator(".card-title").inner_text()=="Ocas", name+": ocas card")
        lk=pg.locator(".card-link a")
        ok(lk.count()==1 and lk.get_attribute("href")=="#/kostra/pater-hrudnik", name+": ocas bones link")
        # ucho -> no bones link, only the Smysly tab (M6)
        pg.locator(".hotspot[data-id='ucho']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(200)
        ok(pg.locator(".card-title").inner_text()=="Ucho" and [a.get_attribute("href") for a in pg.locator(".card-link a").all()]==["#/smysly/2"], name+": ucho links only to Smysly")
        # zvidave on -> 17
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(200)
        ok(pg.locator(".hotspot").count()==17, name+": 17 with zvidave")
        ok(pg.locator(".card-extra-h").count()==0, name+": no 'Další v části' on vnejsi")
        # follow a link
        pg.locator(".hotspot[data-id='zadni-noha']").first.click(force=True); pg.wait_for_timeout(200)
        pg.locator(".card-link a").click(); pg.wait_for_timeout(400)
        ok(pg.url.endswith("#/kostra/panev-zadni"), name+": navigated "+pg.url)
        ok(pg.locator(".atlas-svg").get_attribute("aria-label")=="Obrázek kostry kočky", name+": kostra aria back")
        pg.go_back(); pg.wait_for_timeout(300)
        pg.screenshot(path=shot("m3-stage4-%s.png")%name, full_page=True)
        pg.close()
    b.close()
print("errors:",errs); print("fails:",fails); sys.exit(1 if errs or fails else 0)
