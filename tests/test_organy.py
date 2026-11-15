import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import INDEX, shot, browser
import sys
from playwright.sync_api import sync_playwright
root=INDEX
errs=[]; fails=[]
def ok(c,m):
    if not c: fails.append(m)
def tap(pg,id):
    pg.locator(f".hotspot[data-id='{id}']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
with sync_playwright() as p:
    b=browser(p)
    for name,vp in [("tablet",{"width":1024,"height":768}),("phone",{"width":390,"height":844}),("desktop",{"width":1440,"height":900})]:
        pg=b.new_page(viewport=vp); pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: m.type=="error" and errs.append(m.text))
        pg.goto(root); pg.evaluate("localStorage.clear()"); pg.goto(root+"#/")
        ok(pg.locator("a[href='#/organy']").count()==1, name+": menu link")
        pg.locator("a[href='#/organy']").first.click(); pg.wait_for_timeout(300)
        ok(pg.locator(".screen-title").inner_text()=="Vnitřní orgány", name+": title")
        ok(pg.locator(".atlas-svg").get_attribute("aria-label")=="Obrázek vnitřních orgánů kočky", name+": aria")
        cr=pg.locator(".atlas-credit"); hrefs=[a.get_attribute("href") for a in cr.locator("a").all()]
        ok("Persian Poet Gal" in cr.inner_text() and hrefs==["https://commons.wikimedia.org/wiki/File:Scheme_cat_anatomy.svg","https://creativecommons.org/licenses/by-sa/3.0/"], name+": credit")
        ok(pg.locator(".card-empty").inner_text()=="Klepni na orgán na obrázku.", name+": empty")
        ok(pg.locator(".hotspot").count()==14, name+": 14 Základ")
        tap(pg,"srdce"); ok(pg.locator(".card-title").inner_text()=="Srdce", name+": srdce card")
        ok([a.get_attribute("href") for a in pg.locator(".card-link a").all()]==["#/kostra/pater-hrudnik","#/organy/srdce/1","#/soustavy/obehova"], name+": srdce link")
        tap(pg,"zaludek"); ok(pg.locator(".card-title").inner_text()=="Žaludek" and [a.get_attribute("href") for a in pg.locator(".card-link a").all()]==["#/organy/zaludek/1","#/soustavy/travici"], name+": zaludek closeup link")
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(200)
        ok(pg.locator(".hotspot").count()==20, name+": 20 zvidave")
        tap(pg,"zlucnik"); ok(pg.locator(".card-title").inner_text()=="Žlučník", name+": zlucnik")
        pg.locator("[data-toggle='latinsky']").click(); pg.wait_for_timeout(150)
        ok(pg.locator(".card-latin").inner_text()=="Vesica biliaris", name+": latin")
        pg.screenshot(path=shot(f"m4-stage4-{name}.png"), full_page=True)
        # vnejsi Břicho -> organy
        pg.goto(root+"#/vnejsi"); pg.wait_for_timeout(300)
        tap(pg,"bricho")
        hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
        ok(hs==["#/organy"], name+": bricho links %s"%hs)
        tap(pg,"hrudnik")
        hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
        ok(hs==["#/kostra/pater-hrudnik","#/organy"], name+": hrudnik links %s"%hs)
        if name=="tablet": pg.screenshot(path=shot("m4-stage4-hrudnik.png"))
        pg.locator(".card-link a[href='#/organy']").click(); pg.wait_for_timeout(300)
        ok(pg.url.endswith("#/organy"), name+": navigated")
        pg.close()
    b.close()
print("errors:",errs); print("fails:",fails); sys.exit(1 if errs or fails else 0)
