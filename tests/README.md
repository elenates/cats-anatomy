# Tests

Browser tests open the app over `file://` in Chrome with Playwright, on tablet, phone and desktop sizes as needed.

```
python3 tests/run_all.py          # all tests, exit code 1 if any fails
python3 tests/test_soustavy.py    # one test
```

- Requirements: `pip install playwright shapely`. Chrome at `/usr/bin/google-chrome`; set `CHROME=/path/to/chrome` to use another, or leave it unset to use Playwright's own Chromium (`playwright install chromium`).
- Screenshots go to `tests/out/` (git-ignored). They are handy for checking the layout by eye.
- `common.py` has the shared helpers: `url()`, `shot()`, `browser()`, `tap()` (select a hotspot by keyboard), `hrefs()`, and `Run`, which collects page errors and failed checks.

| Test | Covers |
|---|---|
| `test_kostra_parts.py` | Kostra overview and the five part screens, all figure tabs, both levels, no sideways overflow |
| `test_kostra_quiz.py` | "Najdi kost nebo orgán" on the skeleton |
| `test_spoj.py` | "Spoj, co patří k sobě": funny answers, wrong pair, three rounds, summary, restart |
| `test_zarazeni.py` | "Zařazení kočky v přírodě" card |
| `test_vnejsi.py` | Vnější stavba těla screen, photo credit, links to Kostra |
| `test_organy.py` | Vnitřní orgány screen, credit, cards and links |
| `test_hotspot_clicks.py` | Taps the middle of every organ hotspot and checks the card |
| `test_closeups.py` | All close-up screens: every hotspot tapped, tabs, notes, links |
| `test_soustavy.py` | Tělesné soustavy: organs per system at both levels, faded drawing, notes, links |
| `test_organ_quizzes.py` | "Najdi orgán" and "Do které soustavy patří?" (funny answers never count) |
| `test_content.py` | No browser: generators rebuild every data file byte for byte; every ref id exists in `sources/references.md`; every item has its card fields |
| `test_editor_roundtrip.py` | The hotspot editor loads every figure and exports `data/hotspots-kostra.js` byte for byte |

When a feature changes, update its test in the same PR. Each new section gets its own `test_<section>.py`.
