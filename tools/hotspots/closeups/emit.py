import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
import json
from PIL import Image
R=json.load(open('hs.json'))
p=os.path.join(ROOT, 'data', 'hotspots-kostra.js'); s=open(p).read()
i=s.find('\nwindow.ATLAS_DATA.hotspots["stomach"]')
if i>0: s=s[:i].rstrip('\n')+'\n'
num=lambda v: int(v) if float(v).is_integer() else v
js=lambda q: json.dumps([[[num(x),num(y)] for x,y in poly] for poly in q],separators=(',',':'))
fign={"stomach":97,"pancreas-spleen":102,"lungs":106,"kidney":108,"kidney-section":109,"heart":115,"heart-open":117,"brain":137}
blocks=[]
for f,(G,N) in R.items():
    W,H=Image.open(os.path.join(ROOT, "images", "organy", f + ".webp")).size
    L=['',f'window.ATLAS_DATA.hotspots["{f}"] = {{',f'  image: "images/organy/{f}.webp",',f'  width: {W},',f'  height: {H},',
       f'  figure: "Reighard & Jennings 1901, Fig. {fign[f]}",','  content: "organy",','  layers: {','    organy: {']
    ks=[k for k in G if G[k]]
    for i,k in enumerate(ks): L.append('      '+json.dumps(k)+': '+js(G[k])+(',' if i<len(ks)-1 else ''))
    L+=['    }','  },',f'  nested: {json.dumps(N,separators=(",",":"))},','  alsoCounts: {}','};']
    blocks.append('\n'.join(L))
open(p,'w').write(s.rstrip('\n')+'\n'+'\n'.join(blocks)+'\n')
