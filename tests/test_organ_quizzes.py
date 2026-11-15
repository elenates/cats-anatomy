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
    for name,vp in [("tablet",{"width":1024,"height":768}),("phone",{"width":390,"height":844})]:
        pg=b.new_page(viewport=vp); pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: m.type=="error" and errs.append(m.text))
        pg.goto(root); pg.evaluate("localStorage.clear()"); pg.goto(root+"#/organy"); pg.wait_for_timeout(300)
        hs=[a.get_attribute("href") for a in pg.locator(".screen-games a").all()]
        ok(hs==["#/organy/kviz","#/organy/soustavy-kviz"], name+f": organy buttons {hs}")
        # Najdi orgán
        pg.goto(root+"#/organy/kviz"); pg.wait_for_timeout(400)
        ok(pg.locator(".screen-title").inner_text()=="Kvíz: Najdi orgán", name+": najdi title")
        pool=pg.evaluate("document.querySelector('.atlas.quiz')._quiz.pool")
        ok(len(pool)==14 and "varle" in pool, name+f": pool {len(pool)}")
        for i in range(10):
            st=pg.evaluate("document.querySelector('.atlas.quiz')._quiz.state")
            tid=st["list"][st["i"]]
            right = i%2==0
            target = tid if right else [x for x in pool if x!=tid][0]
            pg.locator(f".quiz-spot[data-id='{target}']").focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(80)
            pg.locator(".quiz-feedback .quiz-next").click(); pg.wait_for_timeout(80)
        ok(pg.locator(".quiz-prompt").inner_text()=="Správně: 5 z 10", name+": najdi score "+pg.locator(".quiz-prompt").inner_text())
        ok(pg.locator(".quiz-summary a").get_attribute("href")=="#/organy" and pg.locator(".quiz-summary a").inner_text()=="Zpět na vnitřní orgány", name+": najdi back")
        # Soustavy kviz from organy
        pg.goto(root+"#/organy/soustavy-kviz"); pg.wait_for_timeout(400)
        ok(pg.locator(".screen-title").inner_text()=="Kvíz: Tělesné soustavy", name+": sk title")
        host=".soustavy-kviz"
        for i in range(8):
            st=pg.evaluate(f"document.querySelector('{host}')._sk.state")
            it=st["list"][st["i"]]
            ok(pg.locator(".sk-option").count()==4 and pg.locator(".sk-option[data-funny]").count()==1, name+f": q{i} options")
            ok(pg.locator(".system-fade").count()==1 and pg.locator(".sk-spot").count()==1, name+f": q{i} figure")
            ok(pg.locator(".quiz-prompt").inner_text().startswith("Do které soustavy patří ") and it["cs"][1:] in pg.locator(".quiz-prompt").inner_text(), name+f": q{i} prompt")
            if i==0:
                pg.locator(".sk-option[data-funny]").click(); pg.wait_for_timeout(60)
                ok(pg.locator(".spoj-feedback.is-funny").count()==1 and pg.locator(".quiz-next:visible").count()==0, name+": funny no penalty")
            if i%3==0:
                pg.locator(f".sk-option[data-id]:not([data-id='{it['soustava']}'])").first.click()
                ok(pg.locator(".spoj-feedback.is-wrong").count()==1 and pg.locator(f".sk-option.is-right[data-id='{it['soustava']}']").count()==1, name+": wrong shows right")
            else:
                pg.locator(f".sk-option[data-id='{it['soustava']}']").click()
            pg.wait_for_timeout(60)
            if name=="tablet" and i==0: pg.screenshot(path=shot("m4-s8-soustavy-kviz.png"))
            pg.locator(".sk-card .quiz-next").click(); pg.wait_for_timeout(80)
        ok(pg.locator(".quiz-prompt").inner_text()=="Správně: 5 z 8", name+": sk score "+pg.locator(".quiz-prompt").inner_text())
        ok(pg.locator(".quiz-missed li").count()==3, name+": sk missed")
        ok(pg.locator(".quiz-summary a").get_attribute("href")=="#/organy", name+": sk back organy")
        pg.locator(".quiz-summary button").click(); pg.wait_for_timeout(100)
        ok(pg.locator(".quiz-progress").inner_text()=="Otázka 1 z 8", name+": again")
        # from soustavy
        pg.goto(root+"#/soustavy"); pg.wait_for_timeout(300)
        ok([a.get_attribute("href") for a in pg.locator(".screen-games a").all()]==["#/soustavy/kviz"], name+": soustavy button")
        pg.goto(root+"#/soustavy/kviz"); pg.wait_for_timeout(300)
        ok(pg.locator(".back-link").get_attribute("href")=="#/soustavy" and pg.locator(".sk-option").count()==4, name+": sk from soustavy")
        if name=="tablet":
            pg.goto(root+"#/organy"); pg.wait_for_timeout(300); pg.screenshot(path=shot("m4-s8-organy.png"))
        pg.close()
    b.close()
print("errors:",errs); print("fails:",fails); sys.exit(1 if errs or fails else 0)
