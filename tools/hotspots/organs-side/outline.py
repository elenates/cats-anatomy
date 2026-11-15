import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
os.chdir(HERE)
from playwright.sync_api import sync_playwright
import json
ids=["path4255","path4295","path4334","path2274","path2307","path2296","path4321","path4270","path4272","path4274","path4310","path2285","path2220"]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome"); pg=b.new_page()
    pg.goto('file://' + os.path.join(HERE, 'nolabels.svg'))  # not in the repo: Scheme_cat_anatomy.svg with the 19 labels and leader lines removed
    res=pg.evaluate("""(ids)=>{const svg=document.documentElement;const o={};
      for(const id of ids){const e=document.getElementById(id);const L=e.getTotalLength();const m=e.getCTM();const n=Math.max(60,Math.ceil(L/0.7));const pts=[];
        for(let i=0;i<n;i++){const q=e.getPointAtLength(L*i/n);const P=svg.createSVGPoint();P.x=q.x;P.y=q.y;const r=P.matrixTransform(m);pts.push([r.x,r.y]);}
        o[id]=pts;} return o;}""", ids)
    b.close()
S=1500/1957
out={k:[[round((3*x-843)*S,1),round((3*y-135)*S,1)] for x,y in v] for k,v in res.items()}
json.dump(out,open("outlines.json","w"))
print({k:len(v) for k,v in out.items()})
