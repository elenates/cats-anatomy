"""Shared helpers for the browser tests (Playwright + Chrome, app opened over file://)."""
import os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INDEX = "file://" + os.path.join(ROOT, "index.html")
OUT = os.path.join(ROOT, "tests", "out")          # screenshots (git-ignored)
os.makedirs(OUT, exist_ok=True)
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
VIEWPORTS = {"tablet": {"width": 1024, "height": 768}, "phone": {"width": 390, "height": 844},
             "desktop": {"width": 1440, "height": 900}}

def url(h=""):
    return INDEX + (("#" + h) if h and not h.startswith("#") else h)

def shot(name):
    return os.path.join(OUT, name)

class Run:
    """Collects page errors and failed checks; finish() prints them and sets the exit code."""
    def __init__(self, name):
        self.name, self.errs, self.fails = name, [], []
    def ok(self, cond, msg):
        if not cond: self.fails.append(msg)
    def watch(self, pg):
        pg.on("pageerror", lambda e: self.errs.append(str(e)))
        pg.on("console", lambda m: m.type == "error" and self.errs.append(m.text))
        return pg
    def finish(self):
        status = "PASS" if not (self.errs or self.fails) else "FAIL"
        print(f"{status} {self.name}")
        for e in self.errs: print("  page error:", e)
        for f in self.fails: print("  failed:", f)
        sys.exit(0 if status == "PASS" else 1)

def browser(p):
    kw = {"executable_path": CHROME} if os.path.exists(CHROME) else {}
    return p.chromium.launch(**kw)

def tap(pg, item_id):
    """Select a hotspot by keyboard (independent of screen position)."""
    pg.locator(f".hotspot[data-id='{item_id}']").first.focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)

def hrefs(pg, sel=".card-link a"):
    return [a.get_attribute("href") for a in pg.locator(sel).all()]
