# Content sources and generators

The child-facing content in `data/kostra.js`, `data/vnejsi.js` and `data/organy.js` is **generated**. Do not edit those files by hand.

| Data file | Content files (edit these) | Generator |
|---|---|---|
| `data/kostra.js` | `kostra_content.py` | `gen_kostra.py` |
| `data/vnejsi.js` | `vnejsi_content.py` | `gen_vnejsi.py` |
| `data/organy.js` | `organy_content.py` (organs on the whole-body drawing), `organy_parts_content.py` (close-up screens and their parts), `soustavy_content.py` (body systems) | `gen_organy.py` |

Not generated (edit directly): `data/sections.js` (menu and UI strings), `data/spoj.js`, `data/soustavy-kviz.js`, `data/zarazeni.js`, `data/hotspots-kostra.js` (use `tools/hotspot-editor.html`).

## Workflow
1. Change the row in the `*_content.py` file. Each row has these fields:
   - `cs`, `la`
   - `nav`: the NAV printed page
   - `level`
   - `kdeJe`, `coDela`, `zajimavost`
   - `sources`: reference ids from `sources/references.md`, each with what was checked
   - `flags`: notes for review, e.g. Lenka's decisions
2. Run the generator from anywhere: `python3 tools/content/gen_organy.py` (or `gen_kostra.py`, `gen_vnejsi.py`). It writes the data file in place.
3. `git diff data/` must show only the change you meant. Running a generator on unchanged content gives a byte-identical file.
4. Run the tests: `python3 tests/run_all.py`.
5. List every new or changed Czech text in the PR for Lenka to proofread.

`refs` in the data files are built from the reference ids found in `sources`. Every id must exist in the `SOURCES` list of a content file. New sources also get a row in `sources/references.md`.

`build_xlsx.py` writes a review spreadsheet for Kostra (needs `openpyxl`). Later sections were reviewed in Claude Docs sheets instead, e.g. "Vnitřní orgány – content review (v0.4)".
