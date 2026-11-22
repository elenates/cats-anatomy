"""Na veterině game cases (#73 stage 3), without a browser:
- every case belongs to a Kočičí nemoci card, ids unique, exactly one case per card,
- the three diagnosis options are cards, include the right one and are different,
- every finding is for an examination the child can choose, and every examination has an icon,
- every case has its own patient photo, and the photo exists and has its source card and licence row,
- texts are filled, there are two wrong treatments, each wrong answer says why, and no dose slipped in."""
import os, sys, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "content"))
import nemoci_content as N, veterina_pripady as V
fails = []
fotos = []
cards = {c["id"] for c in N.NEMOCI}
for v in V.VYSETRENI:
    if not os.path.exists(os.path.join(ROOT, "images", "veterina", "nastroje", v + ".svg")): fails.append(f"no icon for {v}")
    if v not in V.VYSETRENI_CS: fails.append(f"no Czech name for {v}")
seen, used = set(), set()
for p in V.PRIPADY:
    if p["id"] in seen: fails.append(f"duplicate case {p['id']}")
    seen.add(p["id"])
    if p["nemoc"] not in cards: fails.append(f"{p['id']}: card {p['nemoc']} missing")
    if p["nemoc"] in used: fails.append(f"{p['id']}: second case for {p['nemoc']}")
    used.add(p["nemoc"])
    m = p["moznosti"]
    if len(m) != 3 or len(set(m)) != 3 or p["nemoc"] not in m: fails.append(f"{p['id']}: options {m}")
    for o in m:
        if o not in cards: fails.append(f"{p['id']}: option {o} is not a card")
    if not p["nalezy"]: fails.append(f"{p['id']}: no findings")
    for k, t in p["nalezy"].items():
        if k not in V.VYSETRENI: fails.append(f"{p['id']}: finding for unknown exam {k}")
        if not t.strip(): fails.append(f"{p['id']}: empty finding {k}")
    for f in ("kocka", "pribeh", "lecba"):
        if not p.get(f, "").strip(): fails.append(f"{p['id']}: empty {f}")
    if not p.get("foto"): fails.append(f"{p['id']}: no patient photo")
    if p.get("foto"):
        f = os.path.join(ROOT, "images", "veterina", p["foto"] + ".webp")
        if not os.path.exists(f): fails.append(f"{p['id']}: photo {p['foto']} missing")
        z = open(os.path.join(ROOT, "data", "zdroje.js"), encoding="utf-8").read()
        l = open(os.path.join(ROOT, "sources", "image-licenses.md"), encoding="utf-8").read()
        rel = "images/veterina/" + p["foto"] + ".webp"
        if rel not in z or rel not in l: fails.append(f"{p['id']}: photo without source card or licence row")
    fotos.append(p.get("foto"))
    if len(p["spatne"]) != 2: fails.append(f"{p['id']}: needs two wrong treatments")
    for w in p["spatne"]:
        if not w.get("text", "").strip() or not w.get("proc", "").strip(): fails.append(f"{p['id']}: wrong treatment without text or why")
    if set(p.get("proc", {})) != set(m) - {p["nemoc"]}: fails.append(f"{p['id']}: every wrong diagnosis needs a why")
    text = " ".join([p["pribeh"], p["lecba"], *[w["text"] + " " + w["proc"] for w in p["spatne"]], *p.get("proc", {}).values(), *p["nalezy"].values()])
    if re.search(r"\d\s*(mg|ml|tablet|kapk)", text, re.I): fails.append(f"{p['id']}: looks like a dose")
for c in sorted(cards - used): fails.append(f"card {c} has no case")
if len(set(fotos)) != len(fotos): fails.append("two cases share a patient photo")
print(f"veterina cases: {len(V.PRIPADY)} cases for {len(cards)} cards")
if fails:
    print("\n".join("FAIL " + f for f in fails)); sys.exit(1)
print("OK")
