import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union
from PIL import Image, ImageDraw
P=lambda pts: Polygon(pts).buffer(0)
G={}
G["achillova-slacha"]=P([(150,672),(195,668),(160,710),(130,740),(108,765),(88,775),(82,760),(100,735),(125,705)])
G["achillova-slacha"]=G["achillova-slacha"].buffer(8)   # widened for taps; only outline and r/s (not items) around it
G["predni-sval-holenni"]=P([(410,490),(440,480),(450,520),(445,570),(430,610),(400,650),(370,680),(350,690),(345,660),(380,620),(398,580),(405,540)])
G["trojhlavy-sval-lytkovy"]=P([(213,473),(293,447),(420,440),(413,493),(407,500),(393,600),(353,640),(340,647),(293,660),(227,673),(193,667),(173,600),(193,513)])
G["ctyrhlavy-sval-stehenni"]=unary_union([
  P([(140,165),(165,158),(200,160),(215,175),(200,182),(160,185),(135,185)]),   # c
  P([(110,205),(150,192),(220,180),(276,197),(324,228),(359,262),(395,320),(410,360),(425,400),(435,420),(420,430),(390,420),(360,395),(310,370),(260,340),(207,305),(150,265),(105,235)]),  # d
  P([(360,405),(400,415),(430,425),(420,440),(380,440),(355,430)])])  # k
G["krejcovsky-sval"]=P([(179,14),(228,28),(270,65),(303,103),(340,155),(372,207),(400,260),(414,290),(428,340),(436,386),(425,420),(410,400),(395,360),(380,320),(359,262),(324,228),(276,197),(220,178),(200,160),(175,140),(168,100),(172,69),(175,40)])
G["stredni-sval-hyzdovy"]=P([(159,10),(170,30),(172,69),(160,120),(145,166),(120,200),(100,220),(80,212),(60,195),(48,150),(52,115),(76,62),(117,28)])
G["sval-poloblanity"]=P([(120,300),(160,320),(200,340),(241,360),(300,385),(359,414),(372,428),(330,438),(276,442),(220,445),(175,450),(150,420),(130,370)])
G["sval-poloslasity"]=P([(25,310),(50,295),(80,300),(103,295),(130,370),(150,420),(170,460),(175,500),(165,520),(130,515),(80,490),(45,450),(25,390)])
TEN=LineString([(48,180),(90,250),(130,320),(170,400),(213,473),(260,550),(300,610),(335,655)]).buffer(9)
W,H=506,1250
order=["achillova-slacha","predni-sval-holenni","trojhlavy-sval-lytkovy","ctyrhlavy-sval-stehenni","krejcovsky-sval","stredni-sval-hyzdovy","sval-poloblanity","sval-poloslasity"]
res={}; taken=TEN; frame=Polygon([(0,0),(W,0),(W,H),(0,H)])
for k in order:
    g=G[k].intersection(frame).difference(taken.buffer(1.5))
    taken=unary_union([taken,g])
    parts=[g] if g.geom_type=="Polygon" else list(g.geoms)
    res[k]=[[[round(x,1),round(y,1)] for x,y in list(p.simplify(0.8).exterior.coords)[:-1]] for p in parts if p.area>80]
json.dump(res,open("hs90.json","w"))
im=Image.open(os.path.join(ROOT,"images/svaly/muscles-hindleg.webp")).convert("RGBA"); ov=Image.new("RGBA",im.size); d=ImageDraw.Draw(ov)
cols=[(220,40,40),(40,120,220),(30,160,60),(200,120,0),(150,40,200),(0,170,170),(230,0,130),(120,120,0)]
for i,(k,ps) in enumerate(res.items()):
    for p in ps: d.polygon([tuple(q) for q in p],fill=cols[i]+(70,),outline=cols[i]+(255,))
    print(k,len(ps),[round(Polygon(p).area) for p in ps])
Image.alpha_composite(im,ov).crop((0,0,506,820)).save("ov90.png")
