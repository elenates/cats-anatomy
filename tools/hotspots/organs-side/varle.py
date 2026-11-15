import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
import json
from shapely.geometry import Polygon, box
from shapely.ops import unary_union
exec(open("build.py").read().split("# nervous")[0])
import subprocess
hs=json.loads(subprocess.check_output(["node","-e","global.window={};require(process.argv[1]);const f=window.ATLAS_DATA.hotspots['organs-side'].layers.organy;delete f.varle;console.log(JSON.stringify(f))",os.path.join(ROOT,"data","hotspots-kostra.js")]))
others=unary_union([Polygon(p).buffer(0) for v in hs.values() for p in v])
g=vis["path2307"].intersection(box(1028,0,2000,900))
g=unary_union([g, g.buffer(13).intersection(body).difference(others.buffer(1.5))]).difference(others.buffer(1.2))
if g.geom_type!="Polygon": g=max(g.geoms,key=lambda x:x.area)
poly=[[round(x,1),round(y,1)] for x,y in list(g.simplify(0.6).exterior.coords)[:-1]]
print(round(g.area), [round(x) for x in g.bounds], len(poly))
json.dump(poly,open("varle.json","w"))
