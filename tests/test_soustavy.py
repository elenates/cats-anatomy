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
ZAK={"nervova":["mozek","micha"],"dychaci":["prudusnice","plice","branice"],"obehova":["srdce"],
     "travici":["jicen","jatra","zaludek","tenke-strevo","tluste-strevo"],"mocova":["ledvina","mocovy-mechyr"],"rozmnozovaci":["varle"]}
ZV={"nervova":[],"dychaci":["nosni-dutina"],"obehova":["slezina"],"travici":["ustni-dutina","zlucnik","konecnik"],"mocova":["mocovod"],"rozmnozovaci":[]}
with sync_playwright() as p:
    b=browser(p)
    for name,vp in [("tablet",{"width":1024,"height":768}),("phone",{"width":390,"height":844}),("desktop",{"width":1440,"height":900})]:
        pg=b.new_page(viewport=vp); pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: m.type=="error" and errs.append(m.text))
        pg.goto(root); pg.evaluate("localStorage.clear()"); pg.goto(root+"#/")
        ok(pg.locator("a[href='#/soustavy']").count()==1, name+": menu link")
        pg.locator("a[href='#/soustavy']").first.click(); pg.wait_for_timeout(300)
        ok(pg.locator(".screen-title").inner_text()=="Tělesné soustavy", name+": title")
        ok(pg.locator(".fig-tab").count()==6 and pg.locator(".fig-tab[aria-current='page']").inner_text()=="Nervová soustava", name+": tabs")
        ok(pg.locator(".atlas-figure.is-system").count()==1, name+": tinted")
        for sid in ZAK:
            pg.goto(root+"#/soustavy/"+sid); pg.wait_for_timeout(250)
            ids=sorted(h.get_attribute("data-id") for h in pg.locator(".hotspot").all())
            ok(ids==sorted(ZAK[sid]), name+f": {sid} zaklad {ids}")
            chips=pg.locator(".organ-chip").count(); ok(chips==len(ZAK[sid]), name+f": {sid} chips")
            ok(pg.locator(".card-p:not(.system-note)").count()==1, name+f": {sid} one text")
            ok(pg.locator(".system-note").count()==(1 if sid=="mocova" else 0), name+f": {sid} note")
            ok(pg.locator(".card-link a").count()==1, name+f": {sid} closeup link")
            ok((pg.locator(".card-empty").count()==2)==bool(ZV[sid]), name+f": {sid} zvidave hint")
        pg.goto(root+"#/soustavy/dychaci"); pg.wait_for_timeout(250)
        pg.locator(".organ-chip", has_text="Plíce").click(); pg.wait_for_timeout(200)
        ok(pg.locator(".card-title").inner_text()=="Plíce", name+": chip selects")
        hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
        ok(hs==["#/kostra/pater-hrudnik"], name+f": plice links {hs}")
        pg.locator(".card-close").click(); pg.wait_for_timeout(150)
        ok(pg.locator(".card-title").inner_text()=="Dýchací soustava", name+": back to intro")
        pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(200)
        ok(pg.locator(".hotspot").count()==4 and pg.locator(".card-p").count()==2, name+": zvidave dychaci")
        pg.goto(root+"#/soustavy/mocova"); pg.wait_for_timeout(250)
        ok("vylučovací soustava" in pg.locator(".system-note").inner_text(), name+": mocova note text")
        if name=="tablet": pg.screenshot(path=shot("m4-mocova-note.png"))
        if name=="tablet": pg.screenshot(path=shot("m4-stage6-dychaci.png"))
        for sid in ZAK:
            pg.goto(root+"#/soustavy/"+sid); pg.wait_for_timeout(250)
            ok(pg.locator(".hotspot").count()==len(ZAK[sid])+len(ZV[sid]), name+f": {sid} all")
            if name=="tablet": pg.screenshot(path=shot(f"m4-stage6-{sid}.png"))
        # organ screen -> system link
        pg.goto(root+"#/organy"); pg.wait_for_timeout(300)
        tap(pg,"ledvina")
        hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
        ok(hs==["#/organy/ledvina/1","#/soustavy/mocova"], name+f": ledvina links {hs}")
        ok(pg.locator(".card-link a[href='#/soustavy/mocova']").inner_text()=="Močová soustava →", name+": link text")
        pg.locator(".card-link a[href='#/soustavy/mocova']").click(); pg.wait_for_timeout(300)
        ok(pg.locator(".fig-tab[aria-current='page']").inner_text()=="Močová soustava", name+": navigated")
        pg.goto(root+"#/soustavy/rozmnozovaci"); pg.wait_for_timeout(250)
        ok([h.get_attribute("data-id") for h in pg.locator(".hotspot").all()]==["varle"], name+": rozm varle only")
        ok(pg.locator(".card-title").inner_text()=="Rozmnožovací soustava" and pg.locator(".card-p").count()==2, name+": rozm card (zvidave on)")
        ok([a.get_attribute("href") for a in pg.locator(".card-link a").all()]==["#/organy/varle"], name+": rozm closeup link")
        pg.locator(".organ-chip", has_text="Varle").click(); pg.wait_for_timeout(200)
        hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
        ok(pg.locator(".card-title").inner_text()=="Varle" and hs==["#/organy/varle/1"], name+f": varle card {hs}")
        pg.locator(".card-close").click(); pg.wait_for_timeout(150)
        if name=="tablet": pg.screenshot(path=shot("m4-stage7-rozmnozovaci.png"))
        pg.goto(root+"#/soustavy/nesmysl"); pg.wait_for_timeout(250)
        ok(pg.locator(".fig-tab[aria-current='page']").inner_text()=="Nervová soustava", name+": unknown -> first")
        pg.close()
    b.close()
print("errors:",errs); print("fails:",fails); sys.exit(1 if errs or fails else 0)
