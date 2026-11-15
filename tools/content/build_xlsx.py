import sys
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
from kostra_content import ROWS, PARTS, SOURCES
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
wb = Workbook()
ws = wb.active; ws.title = "Kostra"
hdr = ["#", "Part", "Czech name (cs)", "Level", "Kde je?", "Co dělá?", "Zajímavost", "Latin (la)", "NAV page",
       "Sources checked", "Open questions / uncertain", "Proofreader: corrected text", "Proofreader: note", "id"]
ws.append(hdr)
lvl = {"zaklad": "Základ", "zvidave": "Pro zvídavé"}
for i, r in enumerate(ROWS, 1):
    ws.append([i, PARTS[r["part"]], r["cs"], lvl[r["level"]], r["kdeJe"], r["coDela"], r["zajimavost"] or None,
               r["la"], r["nav"], r["sources"], r["flags"] or None, None, None, r["id"]])
widths = [5, 18, 22, 12, 34, 40, 44, 26, 12, 46, 46, 34, 26, 18]
for col, w in zip("ABCDEFGHIJKLMN", widths):
    ws.column_dimensions[col].width = w
for row in ws.iter_rows(min_row=2):
    for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")
for c in ws[1]:
    c.font = Font(bold=True); c.fill = PatternFill("solid", fgColor="F3F3F3")
    c.alignment = Alignment(wrap_text=True, vertical="top")
ws.freeze_panes = "D2"
s2 = wb.create_sheet("Sources")
s2.append(["ID", "Reference", "URL (opened)"])
for s in SOURCES: s2.append(list(s))
for col, w in zip("ABC", [14, 80, 70]): s2.column_dimensions[col].width = w
for c in s2[1]:
    c.font = Font(bold=True); c.fill = PatternFill("solid", fgColor="F3F3F3")
for row in s2.iter_rows(min_row=2):
    for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")
wb.save(os.path.join(HERE, "kostra-review.xlsx"))
z = sum(r["level"]=="zaklad" for r in ROWS)
print(len(ROWS), "rows;", z, "zaklad;", sum(bool(r["flags"]) for r in ROWS), "flagged")
