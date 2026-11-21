"""Na veterině game cases (#73 stage 3), without a browser:
- every case belongs to a Kočičí nemoci card, ids unique, one case per card at most,
- the three diagnosis options are cards, include the right one and are different,
- every finding is for an examination the child can choose, and every examination has an icon,
- texts are filled, there are two wrong treatments, each wrong answer says why, and no dose slipped in."""
import os, sys, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "content"))
import nemoci_content as N, veterina_pripady as V
fails = []
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
    if len(p["spatne"]) != 2: fails.append(f"{p['id']}: needs two wrong treatments")
    for w in p["spatne"]:
        if not w.get("text", "").strip() or not w.get("proc", "").strip(): fails.append(f"{p['id']}: wrong treatment without text or why")
    if set(p.get("proc", {})) != set(m) - {p["nemoc"]}: fails.append(f"{p['id']}: every wrong diagnosis needs a why")
    text = " ".join([p["pribeh"], p["lecba"], *[w["text"] + " " + w["proc"] for w in p["spatne"]], *p.get("proc", {}).values(), *p["nalezy"].values()])
    if re.search(r"\d\s*(mg|ml|tablet|kapk)", text, re.I): fails.append(f"{p['id']}: looks like a dose")
print(f"veterina cases: {len(V.PRIPADY)} cases for {len(cards)} cards")
if fails:
    print("\n".join("FAIL " + f for f in fails)); sys.exit(1)
print("OK")
