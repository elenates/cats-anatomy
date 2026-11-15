import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import INDEX, shot, browser
from shapely.geometry import Polygon
from shapely.ops import unary_union
from playwright.sync_api import sync_playwright
root=INDEX
errs=[];fails=[]
def ok(c,m):
    if not c: fails.append(m)
with sync_playwright() as p:
    b=browser(p)
    pg=b.new_page(viewport={"width":1280,"height":900}); pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: m.type=="error" and errs.append(m.text))
    pg.goto(root); pg.evaluate("localStorage.clear()"); pg.goto(root+"#/organy"); pg.wait_for_timeout(300)
    ok(pg.locator(".parts .part-link").count()==6, "6 close-up links")
    H=pg.evaluate("ATLAS_DATA.hotspots")
    R={k:[v["layers"]["organy"], v.get("nested") or {}] for k,v in H.items() if v.get("content")=="organy" and k!="organs-side"}
    parts=pg.evaluate("ATLAS_DATA.organy.parts"); names={i["id"]:i["cs"] for i in pg.evaluate("ATLAS_DATA.organy.items")}
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(100)
    for prt in parts:
        for n,f in enumerate(prt["figures"],1):
            pg.goto(root+f"#/organy/{prt['id']}/{n}"); pg.wait_for_timeout(300)
            ok(pg.locator(".screen-title").inner_text()==prt["cs"], f"title {prt['id']}")
            ok(("Obrázek" in pg.locator(".atlas-credit").inner_text()), f"credit {f['figure']}")
            G,N=R[f["figure"]]; kids={c for v in N.values() for c in v}
            box=pg.locator(".atlas-svg").bounding_box(); vb=pg.evaluate("document.querySelector('.atlas-svg').viewBox.baseVal.width"); sc=box["width"]/vb
            for k,polys in G.items():
                if k in N: continue  # parent hidden under its children at Pro zvídavé
                g=max([Polygon(q).buffer(0) for q in polys],key=lambda x:x.area); pt=g.representative_point()
                ay=box["y"]+pt.y*sc+pg.evaluate("scrollY"); pg.evaluate(f"scrollTo(0,{ay-400})"); pg.wait_for_timeout(50)
                box=pg.locator(".atlas-svg").bounding_box()
                pg.mouse.click(box["x"]+pt.x*sc, box["y"]+pt.y*sc); pg.wait_for_timeout(60)
                t=pg.locator(".card-title").inner_text() if pg.locator(".card-title").count() else None
                ok(t==names[k], f"{f['figure']}:{k} -> {t}")
            if f["figure"]=="heart":
                ok(pg.locator(".fig-note").count()==1, "heart note"); pg.screenshot(path=shot("m4-stage5c-heart.png"))
            if f["figure"]=="kidney-section": pg.screenshot(path=shot("m4-stage5c-kidney.png"))
    # organ card link to close-up
    pg.goto(root+"#/organy"); pg.wait_for_timeout(300)
    pg.locator(".hotspot[data-id='srdce']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
    hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
    ok("#/organy/srdce/1" in hs, f"srdce links {hs}")
    pg.locator(".hotspot[data-id='slezina']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
    hs=[a.get_attribute("href") for a in pg.locator(".card-link a").all()]
    ok(hs==["#/organy/zaludek/2","#/soustavy/obehova"], f"slezina links {hs}")
    # on close-up, no self link; extras on other tab
    pg.goto(root+"#/organy/srdce/1"); pg.wait_for_timeout(300)
    pg.locator(".hotspot[data-id='prava-komora']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
    ok([a.get_attribute("href") for a in pg.locator(".card-link a").all()]==["#/soustavy/obehova"], "no self link, only the system")
    ok("trojcípá" in pg.locator(".atlas-card").inner_text().lower(), "extras list chlopeň")
    pg.screenshot(path=shot("m4-stage5c-heart-card.png"))
    # Základ: close-up shows organ only
    pg.locator("[data-toggle='zvidave']").click(); pg.wait_for_timeout(150)
    ids=pg.evaluate("[...document.querySelectorAll('.hotspot')].map(h=>h.dataset.id)")
    ok(sorted(set(ids))==["aorta","plicnice","srdce"] or sorted(set(ids))==["srdce"], f"zaklad heart {sorted(set(ids))}")
    b.close()
print("errors",errs); print("fails",fails); sys.exit(1 if errs or fails else 0)
