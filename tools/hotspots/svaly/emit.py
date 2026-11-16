# Appends the three Svaly figures to data/hotspots-kostra.js (run once; later changes go through tools/hotspot-editor.html).
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
def num(v): return str(int(v)) if float(v).is_integer() else str(v)
def polys(ps): return "[" + ",".join("[" + ",".join("[%s,%s]" % (num(x), num(y)) for x, y in p) + "]" for p in ps) + "]"
FIGS = [("muscles-superficial", "hs68.json", 1250, 705, "Fig. 68", {"svaly-stehna": ["dvojhlavy-sval-stehenni", "sval-poloslasity", "krejcovsky-sval", "napinac-stehenni-povazky"]}),
        ("muscles-deep", "hs73.json", 1500, 507, "Fig. 73", {}),
        ("muscles-hindleg", "hs90.json", 506, 1250, "Fig. 90", {})]
out = []
for fid, fn, w, h, fig, nested in FIGS:
    hs = json.load(open(os.path.join(HERE, fn)))
    rows = ",\n".join('      "%s": %s' % (k, polys(v)) for k, v in hs.items())
    out.append('window.ATLAS_DATA.hotspots["%s"] = {\n  image: "images/svaly/%s.webp",\n  width: %d,\n  height: %d,\n  figure: "Reighard & Jennings 1901, %s",\n  content: "svaly",\n  layers: {\n    svaly: {\n%s\n    }\n  },\n  nested: %s,\n  alsoCounts: {}\n};\n'
               % (fid, fid, w, h, fig, rows, json.dumps(nested, ensure_ascii=False, separators=(",", ":"))))
p = os.path.join(ROOT, "data", "hotspots-kostra.js")
s = open(p, encoding="utf-8").read()
assert 'hotspots["muscles-superficial"]' not in s, "already emitted"
open(p, "w", encoding="utf-8").write(s.rstrip("\n") + "\n\n" + "\n".join(out))
print("appended", [f[0] for f in FIGS])
