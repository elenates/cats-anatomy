import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
from shapely.geometry import Polygon
from shapely.ops import unary_union
from PIL import Image, ImageDraw
P=lambda pts: Polygon(pts).buffer(0)
G={}
G["zvykaci-sval"]=P([(1050,262),(1068,246),(1100,242),(1128,255),(1142,268),(1146,300),(1110,303),(1070,300),(1050,292)])
G["trapezovy-sval"]=unary_union([
  P([(650,238),(700,240),(746,249),(760,280),(773,318),(740,300),(700,275),(670,252)]),   # j
  P([(746,249),(800,247),(874,247),(866,280),(851,325),(842,329),(810,318),(774,315),(760,280)])])  # h
G["deltovy-sval"]=unary_union([
  P([(776,318),(810,311),(840,329),(855,356),(860,388),(849,415),(833,406),(817,388),(805,356),(787,338)]),  # i
  P([(864,356),(892,343),(903,356),(901,384),(892,402),(874,411),(864,415),(858,393)])])  # g
G["trojhlavy-sval-pazni"]=P([(687,538),(678,502),(705,447),(742,393),(774,361),(801,352),(817,370),(842,402),(844,425),(833,465),(819,481),(787,493),(733,520),(701,543)])
G["siroky-sval-zadovy"]=P([(474,244),(560,240),(650,238),(700,272),(740,298),(775,318),(762,345),(740,380),(715,410),(695,440),(680,457),(661,432),(630,395),(586,357),(542,314),(500,280)])
G["prsni-svaly"]=P([(540,492),(580,478),(620,462),(655,450),(672,452),(690,465),(700,490),(692,520),(680,545),(660,555),(620,552),(580,545),(545,538),(532,530)])
G["zevni-sikmy-sval-bricni"]=P([(301,300),(330,258),(387,246),(474,244),(500,280),(542,314),(586,357),(630,395),(661,432),(672,450),(655,450),(620,462),(580,478),(540,492),(530,532),(480,528),(420,522),(350,515),(301,505)])
G["svaly-ocasu"]=P([(40,380),(70,340),(110,305),(150,285),(195,268),(215,265),(215,282),(170,300),(130,325),(110,345),(90,370),(65,400),(50,415),(42,410)])
S={}
S["krejcovsky-sval"]=P([(262,272),(298,272),(300,330),(298,420),(296,500),(285,505),(275,440),(265,360),(258,300)])
S["napinac-stehenni-povazky"]=P([(192,312),(225,300),(258,296),(262,340),(262,400),(245,415),(220,380),(200,345)])
S["dvojhlavy-sval-stehenni"]=P([(105,350),(130,340),(160,360),(185,385),(210,400),(240,420),(262,450),(268,520),(258,580),(235,610),(190,622),(150,622),(120,600),(110,560),(103,480),(100,400)])
S["sval-poloslasity"]=P([(82,400),(100,385),(108,420),(108,500),(106,560),(100,585),(88,590),(82,560),(78,480)])
GROUP=P([(78,410),(100,350),(125,330),(160,308),(200,300),(240,282),(262,272),(298,272),(301,330),(300,505),(290,540),(268,580),(240,610),(195,625),(150,625),(118,605),(105,575),(85,590),(78,540),(76,470)])
# Widen thin items into neighbouring areas that are not items (outline, fascia, other 1901 muscles without a card).
G["svaly-ocasu"]=G["svaly-ocasu"].buffer(8).difference(GROUP)
G["deltovy-sval"]=G["deltovy-sval"].buffer(5).difference(unary_union([G["trojhlavy-sval-pazni"],G["trapezovy-sval"]]))
S["sval-poloslasity"]=S["sval-poloslasity"].buffer(9).difference(S["dvojhlavy-sval-stehenni"])
GROUP=unary_union([GROUP,S["sval-poloslasity"]])
W,H=1250,705
def carve(G,order,taken=None):
    res={}; frame=Polygon([(0,0),(W,0),(W,H),(0,H)])
    for k in order:
        g=G[k].intersection(frame)
        if taken is not None: g=g.difference(taken.buffer(1.5))
        taken=g if taken is None else unary_union([taken,g])
        parts=[g] if g.geom_type=="Polygon" else list(g.geoms)
        res[k]=[[[round(x,1),round(y,1)] for x,y in list(p.simplify(0.8).exterior.coords)[:-1]] for p in parts if p.area>80]
    return res, taken
main,taken=carve(G,["svaly-ocasu","zvykaci-sval","deltovy-sval","trojhlavy-sval-pazni","trapezovy-sval","prsni-svaly","siroky-sval-zadovy","zevni-sikmy-sval-bricni"])
grp=GROUP.difference(taken.buffer(1.5))
main["svaly-stehna"]=[[[round(x,1),round(y,1)] for x,y in list(grp.simplify(0.8).exterior.coords)[:-1]]]
sub,_=carve({k:v.intersection(grp) for k,v in S.items()},["sval-poloslasity","krejcovsky-sval","napinac-stehenni-povazky","dvojhlavy-sval-stehenni"])
main.update(sub)
json.dump(main,open("hs68.json","w"))
im=Image.open(os.path.join(ROOT,"images/svaly/muscles-superficial.webp")).convert("RGBA"); ov=Image.new("RGBA",im.size); d=ImageDraw.Draw(ov)
cols=[(220,40,40),(40,120,220),(30,160,60),(200,120,0),(150,40,200),(0,170,170),(230,0,130),(120,120,0),(90,90,90),(255,100,0),(0,90,255),(0,200,90),(200,0,0)]
for i,(k,ps) in enumerate(main.items()):
    for p in ps: d.polygon([tuple(q) for q in p],fill=cols[i%len(cols)]+(60,) if k!="svaly-stehna" else None,outline=cols[i%len(cols)]+(255,))
    print(k,len(ps),[round(Polygon(p).area) for p in ps])
Image.alpha_composite(im,ov).save("ov68.png")
