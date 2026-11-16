import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
from shapely.geometry import Polygon
from shapely.ops import unary_union
from PIL import Image, ImageDraw
P=lambda pts: Polygon(pts).buffer(0)
G={}
G["remenovy-sval"]=P([(1262,100),(1275,90),(1350,86),(1420,84),(1478,82),(1478,134),(1420,130),(1350,122),(1290,115),(1262,108)])
G["primy-sval-bricni"]=P([(640,312),(700,315),(800,320),(900,325),(980,330),(1040,338),(1060,350),(1030,385),(990,398),(900,400),(800,396),(700,392),(645,388),(635,350)])
G["pilovity-sval"]=P([(836,138),(900,142),(1007,150),(1100,148),(1112,160),(1105,215),(1090,250),(1050,268),(1000,288),(965,295),(950,278),(895,275),(870,250),(855,220),(845,180)])
G["zevni-mezizeberni-svaly"]=P([(645,175),(670,140),(693,121),(760,128),(836,146),(845,180),(855,220),(870,250),(895,275),(950,278),(965,295),(930,305),(880,300),(820,303),(740,302),(680,300),(650,280),(643,230)])
G["vnitrni-sikmy-sval-bricni"]=P([(410,75),(625,78),(632,150),(640,200),(643,240),(640,300),(636,330),(636,385),(560,383),(450,368),(345,345),(350,250),(370,170),(395,100)])
G["remenovy-sval"]=G["remenovy-sval"].buffer(6)   # widened into M. occipitoscapularis / longissimus (no cards)
W,H=1500,507
res={}; taken=None; frame=Polygon([(0,0),(W,0),(W,H),(0,H)])
for k in ["remenovy-sval","primy-sval-bricni","pilovity-sval","zevni-mezizeberni-svaly","vnitrni-sikmy-sval-bricni"]:
    g=G[k].intersection(frame)
    if taken is not None: g=g.difference(taken.buffer(1.5))
    taken=g if taken is None else unary_union([taken,g])
    parts=[g] if g.geom_type=="Polygon" else list(g.geoms)
    res[k]=[[[round(x,1),round(y,1)] for x,y in list(p.simplify(0.8).exterior.coords)[:-1]] for p in parts if p.area>80]
json.dump(res,open("hs73.json","w"))
im=Image.open(os.path.join(ROOT,"images/svaly/muscles-deep.webp")).convert("RGBA"); ov=Image.new("RGBA",im.size); d=ImageDraw.Draw(ov)
cols=[(220,40,40),(40,120,220),(30,160,60),(200,120,0),(150,40,200)]
for i,(k,ps) in enumerate(res.items()):
    for p in ps: d.polygon([tuple(q) for q in p],fill=cols[i]+(70,),outline=cols[i]+(255,))
    print(k,len(ps),[round(Polygon(p).area) for p in ps])
Image.alpha_composite(im,ov).save("ov73.png")
