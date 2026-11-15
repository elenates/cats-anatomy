import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
import json, math
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
from shapely import affinity
from PIL import Image, ImageDraw
def ell(cx,cy,rx,ry,rot=0):
    e=affinity.scale(Point(cx,cy).buffer(1,resolution=24),rx,ry); return affinity.rotate(e,rot)
def band(pts,r): return LineString(pts).buffer(r,cap_style=1)
F={}
F["ledvina"]=unary_union([ell(100,130,97,128,8), ell(400,150,95,122,-10)])
F["mocovy-mechyr"]=ell(478,712,85,93,-15)
F["vajecnik"]=Polygon([(410,335),(425,320),(448,318),(466,330),(472,355),(468,385),(456,402),(435,407),(417,398),(408,370)])
F["deloha"]=unary_union([band([(85,440),(150,560),(270,725)],22), band([(452,420),(420,520),(370,610),(300,725)],22),
   Polygon([(240,700),(325,700),(342,760),(322,812),(282,826),(250,802),(234,752)])])
M={}
M["varle"]=unary_union([Polygon([(52,420),(65,408),(85,410),(105,425),(112,450),(110,480),(102,500),(85,507),(70,500),(58,480),(50,450)]),
   Polygon([(140,415),(160,405),(180,408),(193,425),(196,455),(189,485),(172,500),(150,501),(137,485),(132,460),(132,435)])])
M["mocovy-mechyr"]=Polygon([(200,185),(230,178),(270,177),(300,185),(325,200),(340,225),(346,260),(336,290),(312,312),(280,319),(255,305),(235,275),(215,235),(200,205)])
def carve(G,order,W,H):
    taken=None; res={}
    frame=Polygon([(0,0),(W,0),(W,H),(0,H)])
    for k in order:
        g=G[k].intersection(frame)
        if taken is not None: g=g.difference(taken.buffer(1.5))
        taken=g if taken is None else unary_union([taken,g])
        parts=[g] if g.geom_type=="Polygon" else list(g.geoms)
        res[k]=[[[round(x,1),round(y,1)] for x,y in list(p.simplify(0.8).exterior.coords)[:-1]] for p in parts if p.area>80]
    return res
out={"repro-female":carve(F,["mocovy-mechyr","vajecnik","deloha","ledvina"],566,900),
     "repro-male":carve(M,["varle","mocovy-mechyr"],350,523)}
json.dump(out,open("hs.json","w"))
cols=[(220,40,40),(40,120,220),(30,160,60),(200,120,0)]
for fig,res in out.items():
    im=Image.open(os.path.join(ROOT, "images", "organy", fig + ".webp")).convert("RGB"); ov=Image.new("RGBA",im.size); d=ImageDraw.Draw(ov)
    for i,(k,ps) in enumerate(res.items()):
        for p in ps: d.polygon([tuple(q) for q in p],fill=cols[i]+(70,),outline=cols[i]+(255,))
        print(fig,k,len(ps),[round(Polygon(p).area) for p in ps])
    Image.alpha_composite(im.convert("RGBA"),ov).save(f"ov_{fig}.png")
