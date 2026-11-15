import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
import json
from shapely.geometry import Polygon, box
from shapely.ops import unary_union
from sil import silhouette
P=lambda pts: Polygon(pts).buffer(0)
OUT={}
def out(g):
    for q in ([g] if g.geom_type=="Polygon" else list(getattr(g,"geoms",[]))):
        if q.geom_type=="Polygon" and len(q.interiors) and q.area>40: print("HOLE!", round(q.area))
    parts=[g] if g.geom_type=="Polygon" else [x for x in getattr(g,"geoms",[]) if x.geom_type=="Polygon"]
    return [[[round(x,1),round(y,1)] for x,y in list(p.simplify(0.8).exterior.coords)[:-1]] for p in parts if p.area>40]
def carve(order, G, gap=1.5):
    taken=None; R={}
    for k in order:
        g=G[k] if taken is None else G[k].difference(taken.buffer(gap))
        R[k]=g; taken=g if taken is None else unary_union([taken,g])
    return R
# ---- stomach (Fig. 97)
s=silhouette("stomach")
jic=s.intersection(box(195,0,300,50))
vr=s.intersection(box(93,98,140,150))
duo=unary_union([s.intersection(box(0,0,52,330)), s.intersection(box(0,0,93,148))]).difference(vr)
zal=s.difference(unary_union([jic,vr,duo]).buffer(1)).intersection(box(0,0,318,330))
OUT["stomach"]=({"jicen":jic,"vratnik":vr,"dvanactnik":duo,"zaludek":zal},{})
# ---- pancreas-spleen (Fig. 102)
s=silhouette("pancreas-spleen",min_area=3000)
duo=P([(10,300),(40,240),(90,205),(150,190),(200,195),(205,255),(150,265),(110,300),(100,400),(105,520),(110,640),(130,700),(190,700),(200,760),(170,800),(100,800),(50,770),(40,700),(25,620),(10,500)])
sli=P([(105,280),(210,255),(330,275),(420,300),(480,340),(540,330),(600,300),(640,230),(700,235),(770,320),(775,420),(720,490),(660,535),(600,470),(560,420),(480,460),(430,420),(330,440),(320,520),(270,560),(240,640),(160,660),(120,600),(110,420)])
spl=P([(800,150),(820,70),(880,8),(945,30),(970,100),(968,200),(950,300),(935,380),(915,460),(895,530),(870,575),(800,602),(700,600),(625,592),(620,570),(700,560),(800,555),(860,520),(885,440),(900,350),(895,280),(870,230),(840,200)])
zal=P([(690,140),(780,160),(840,200),(870,230),(895,280),(900,350),(885,440),(860,520),(800,555),(700,560),(620,570),(625,592),(600,670),(520,672),(480,640),(480,600),(510,580),(560,585),(630,560),(700,550),(778,535),(780,420),(775,320),(740,240),(700,190)])
G={"slezina":spl.intersection(s),"slinivka":sli.intersection(s),"dvanactnik":duo.intersection(s),"zaludek":zal.intersection(s)}
OUT["pancreas-spleen"]=(carve(["slinivka","slezina","dvanactnik","zaludek"],G),{})
# ---- lungs (Fig. 106)
s=silhouette("lungs",min_area=300)
tr=P([(235,55),(248,45),(272,52),(262,110),(240,160),(222,190),(200,185),(212,140),(228,95)])
br=P([(190,190),(232,190),(265,200),(272,240),(262,300),(250,330),(235,320),(240,260),(220,215),(215,260),(210,330),(205,390),(190,390),(192,300),(195,240)])
G={"prudusnice":tr.intersection(s.buffer(3)),"prudusky":br}
G["plicni-laloky"]=s.difference(G["prudusnice"].buffer(1.5))
R=carve(["prudusnice","prudusky","plicni-laloky"],{"prudusnice":G["prudusnice"],"prudusky":G["prudusky"].difference(G["prudusnice"].buffer(1.5)),"plicni-laloky":G["plicni-laloky"]})
R["plicni-laloky"]=G["plicni-laloky"]  # nested: bronchi drawn inside the lobes
OUT["lungs"]=(R,{"plicni-laloky":["prudusky"]})
# ---- kidney (Fig. 108)
s=silhouette("kidney",min_area=300)
ure=P([(38,340),(40,355),(62,358),(65,330),(80,300),(100,285),(170,280),(170,262),(95,262),(60,285),(45,315)])
led=s.intersection(box(158,0,600,600))
OUT["kidney"]=({"ledvina":led,"mocovod":ure.difference(led.buffer(1.5))},{})
# ---- kidney section (Fig. 109)
s=silhouette("kidney-section",min_area=300)
vess=P([(322,215),(345,222),(400,230),(450,240),(460,300),(445,390),(420,395),(380,340),(340,300),(322,282)])
k=s.difference(vess)
k=max(k.geoms,key=lambda g:g.area) if k.geom_type!="Polygon" else k
pel=P([(232,190),(255,185),(290,200),(318,225),(325,250),(300,275),(290,300),(260,305),(240,295),(228,270),(222,245),(230,215)])
inner=k.buffer(-36)
kura=k.difference(inner.buffer(2.5)).difference(pel.buffer(1.5)).difference(box(0,249,240,252))
dren=inner.difference(pel.buffer(1.5))
ure=P([(325,262),(350,265),(380,300),(410,335),(440,360),(442,375),(420,380),(395,350),(365,315),(340,285),(320,280)]).difference(k.buffer(1.5))
OUT["kidney-section"]=({"ledvina":k,"ledvinova-kura":kura,"ledvinova-dren":dren,"ledvinova-panvicka":pel.intersection(k),"mocovod":ure},{"ledvina":["ledvinova-kura","ledvinova-dren","ledvinova-panvicka"]})
# ---- heart (Fig. 115), image cropped at y=530 (vessels above the heart removed)
from shapely import affinity
T=lambda g: affinity.translate(g,0,-530)
s=silhouette("heart",min_area=3000).intersection(box(46,0,480,800)).difference(box(0,80,160,125)).buffer(-2).buffer(2)
s=max(s.geoms,key=lambda g:g.area) if s.geom_type!="Polygon" else s
ao=T(P([(285,640),(300,600),(330,560),(370,545),(420,545),(455,560),(480,590),(490,630),(470,660),(430,650),(380,648),(330,660),(300,665)]))
pl=T(P([(265,690),(300,665),(350,660),(420,655),(480,670),(510,690),(505,712),(470,705),(420,700),(370,710),(320,730),(280,735)]))
body=s.intersection(box(0,70,600,800)).difference(unary_union([ao,pl]).buffer(1.5))
ps=T(P([(115,700),(135,650),(175,620),(230,610),(280,620),(290,650),(270,690),(240,730),(200,750),(150,750),(120,735)])).intersection(body)
ls=T(P([(300,790),(330,760),(370,740),(410,730),(440,760),(450,800),(430,850),(390,885),(350,880),(315,850)])).intersection(body)
leftside=T(P([(0,600),(232,600),(232,740),(250,850),(255,960),(265,1080),(280,1260),(0,1260)]))
rest=body.difference(unary_union([ps,ls]).buffer(1.5))
pk=rest.intersection(leftside); lk=rest.difference(leftside.buffer(1.5)).difference(box(440,276,600,279))
OUT["heart"]=({"srdce":body,"prava-komora":pk,"leva-komora":lk,"prava-sin":ps,"leva-sin":ls,"aorta":ao.intersection(s.buffer(4)),"plicnice":pl.intersection(silhouette("heart",min_area=3000))},{"srdce":["prava-komora","leva-komora","prava-sin","leva-sin"]})
# ---- heart open (Fig. 117)
s=silhouette("heart-open",min_area=3000)
ao=P([(290,250),(285,120),(300,40),(340,8),(390,15),(410,60),(400,100),(380,140),(360,200),(330,290)]).intersection(s)
body=s.difference(ao.buffer(1.5))
tc=P([(375,330),(420,300),(460,330),(470,400),(455,470),(420,480),(385,450),(370,400)]).intersection(body)
rv=unary_union([P([(40,660),(60,450),(110,320),(170,170),(230,140),(270,180),(300,290),(380,300),(400,340),(380,420),(400,500),(380,560),(340,620),(300,680),(240,705),(140,710),(70,690)]),
                 P([(400,110),(450,85),(510,95),(560,130),(600,200),(630,330),(600,345),(520,330),(460,330),(420,300),(400,230)])]).intersection(body).difference(tc.buffer(1.5))
OUT["heart-open"]=({"srdce":body,"prava-komora":rv,"trojcipa-chlopen":tc,"aorta":ao},{"srdce":["prava-komora","trojcipa-chlopen"]})
# ---- brain (Fig. 137)
s=silhouette("brain",min_area=300).intersection(P([(100,60),(228,55),(228,0),(300,0),(300,55),(425,60),(425,350),(375,350),(375,450),(320,450),(320,550),(200,550),(200,450),(145,450),(145,350),(100,350)]))
s=s.buffer(-3).buffer(3)
cb=P([(235,55),(236,20),(250,5),(268,8),(280,5),(292,20),(293,55),(275,62),(255,62)]).intersection(s)
rest=s.difference(cb.buffer(1.5))
hem=rest.intersection(box(0,0,600,356)); moz=rest.intersection(box(0,357,600,445)); pm=rest.intersection(box(0,446,600,600))
OUT["brain"]=({"mozek":s,"mozkove-hemisfery":hem,"mozecek":moz,"prodlouzena-micha":pm,"cichovy-bulbus":cb},{"mozek":["mozkove-hemisfery","mozecek","prodlouzena-micha","cichovy-bulbus"]})
res={}
for f,(G,N) in OUT.items():
    res[f]=({},N)
    for k,v in G.items():
        print("check",f,k); res[f][0][k]=out(v)
json.dump(res,open("hs.json","w"))
for f,(G,N) in res.items(): print(f,{k:(len(v),round(sum(Polygon(p).area for p in v))) for k,v in G.items()})
