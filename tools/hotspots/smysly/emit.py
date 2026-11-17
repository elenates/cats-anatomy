# Writes the four Smysly figures into data/hotspots-kostra.js: appends them the first time, later replaces
# their polygons (only the smysly layer of these four figures). After the first emit, small changes can also
# go through tools/hotspot-editor.html.
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
def num(v): return str(int(v)) if float(v).is_integer() else str(v)
def polys(ps): return "[" + ",".join("[" + ",".join("[%s,%s]" % (num(x), num(y)) for x, y in p) + "]" for p in ps) + "]"
FIGS = [("eye", "hs167.json", 560, 661, "Fig. 167"),
        ("inner-ear", "hs173.json", 432, 333, "Fig. 173"),
        ("eardrum", "hs170.json", 667, 468, "Fig. 170"),
        ("tongue", "hs95.json", 728, 1653, "Fig. 95")]
p = os.path.join(ROOT, "data", "hotspots-kostra.js")
s = open(p, encoding="utf-8").read()
new = []
for fid, fn, w, h, fig in FIGS:
    hs = json.load(open(os.path.join(HERE, fn)))
    rows = ",\n".join('      "%s": %s' % (k, polys(v)) for k, v in hs.items())
    key = 'window.ATLAS_DATA.hotspots["%s"]' % fid
    if key in s:
        start = s.index(key); a = s.index("    smysly: {\n", start) + len("    smysly: {\n"); b = s.index("\n    }\n  },", a)
        s = s[:a] + rows + s[b:]
    else:
        new.append('%s = {\n  image: "images/smysly/%s.webp",\n  width: %d,\n  height: %d,\n  figure: "Reighard & Jennings 1901, %s",\n  content: "smysly",\n  layers: {\n    smysly: {\n%s\n    }\n  },\n  nested: {},\n  alsoCounts: {}\n};\n'
                   % (key, fid, w, h, fig, rows))
if new: s = s.rstrip("\n") + "\n\n" + "\n".join(new)
open(p, "w", encoding="utf-8").write(s)
print("written", [f[0] for f in FIGS])
