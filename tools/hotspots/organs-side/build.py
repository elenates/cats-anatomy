import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
import json
from shapely.geometry import Polygon, box, LineString
from shapely.ops import unary_union, split
o=json.load(open("outlines.json"))
P=lambda k: Polygon(o[k]).buffer(0)
order=["path4255","path4295","path4334","path2274","path2307","path2296","path4321","path4270","path4272","path4274","path4310","path2285"]
vis={}
for i,k in enumerate(order):
    later=unary_union([P(x) for x in order[i+1:]]) if i+1<len(order) else None
    vis[k]=P(k) if later is None else P(k).difference(later)
body=P("path2220")
H=lambda pts: Polygon(pts)
G={}
# nervous
G["mozek"]=vis["path4255"].intersection(box(0,0,250,800))
G["micha"]=vis["path4255"].difference(box(0,0,250,800))
# oral cavity + oesophagus
G["ustni-dutina"]=vis["path4295"].intersection(box(0,0,232,800))
eso2=vis["path4321"].intersection(box(0,0,705,330))
G["jicen"]=unary_union([vis["path4295"].difference(box(0,0,232,800)),eso2])
gb=H([(640,330),(718,330),(737,358),(737,410),(640,410)])
G["zlucnik"]=vis["path4321"].intersection(gb)
G["zaludek"]=vis["path4321"].difference(box(0,0,705,330)).difference(gb)
G["jatra"]=vis["path4334"]
# respiratory
resp=unary_union([vis["path4270"],vis["path4272"]])
lungcut=H([(370,345),(430,291),(430,100),(900,100),(900,800),(370,800)])
G["nosni-dutina"]=resp.intersection(box(0,0,190,800))
G["prudusnice"]=resp.difference(box(0,0,190,800)).difference(lungcut)
G["plice"]=resp.intersection(lungcut)
G["srdce"]=vis["path4274"]
G["branice"]=vis["path4310"]
G["slezina"]=vis["path2296"]
# intestines
cut=[(760,150),(800,263),(853,265),(933,267),(1020,277),(1070,291),(1087,303),(1200,303),(1200,150)]
top=vis["path2274"].intersection(H(cut))
G["konecnik"]=top.intersection(box(1050,0,1300,800))
G["tluste-strevo"]=top.difference(box(1050,0,1300,800))
G["tenke-strevo"]=vis["path2274"].difference(H(cut))
# urinary
ol=vis["path2285"]
G["ledvina"]=ol.intersection(box(0,0,2000,280))
G["mocovy-mechyr"]=ol.intersection(box(0,352,918,900))
G["mocovod"]=ol.difference(box(0,0,2000,280)).difference(box(0,352,918,900)).difference(box(918,300,2000,900))
# widen thin structures into tap-friendly areas (inside the body, not into other organs)
def widen(order_, r):
    for k in order_:
        others=unary_union([v for kk,v in G.items() if kk!=k])
        G[k]=unary_union([G[k], G[k].buffer(r).intersection(body).difference(others.buffer(1.5))])
widen(["micha","jicen","prudusnice","mocovod","branice","slezina","konecnik","zlucnik","ustni-dutina","nosni-dutina"],7)
widen(["micha","konecnik","nosni-dutina","ustni-dutina"],14)
def out(g):
    parts=[g] if g.geom_type=="Polygon" else [x for x in getattr(g,"geoms",[]) if x.geom_type=="Polygon"]
    return [[[round(x,1),round(y,1)] for x,y in list(p.simplify(0.6).exterior.coords)[:-1]] for p in parts if p.area>60]
res={}
taken=None
for k in ["srdce","zlucnik","konecnik","mocovod","ustni-dutina","nosni-dutina","slezina","branice","jicen","prudusnice","mozek","micha","plice","jatra","zaludek","ledvina","mocovy-mechyr","tluste-strevo","tenke-strevo"]:
    polys=out(G[k])
    g=unary_union([Polygon(p).buffer(0) for p in polys])
    if taken is not None:
        g=g.difference(taken.buffer(1.2)); polys=out(g)
        g=unary_union([Polygon(p).buffer(0) for p in polys])
    res[k]=polys; taken=g if taken is None else unary_union([taken,g])
order_ids=list(G)
res={k:res[k] for k in order_ids}
json.dump(res,open("hs.json","w"))
for k,v in res.items(): print(k, len(v), [round(Polygon(p).area) for p in v], sum(len(p) for p in v))
# overlap check
ks=list(res); 
for i in range(len(ks)):
    for j in range(i+1,len(ks)):
        a=unary_union([Polygon(p).buffer(0) for p in res[ks[i]]]); b=unary_union([Polygon(p).buffer(0) for p in res[ks[j]]])
        if a.intersection(b).area>1: print("OVERLAP",ks[i],ks[j],round(a.intersection(b).area))
