#!/usr/bin/env python3
"""One-off converter: Statement of Faith PDF text (pypdf layout mode) -> data/statement-of-faith.json

Usage: python3 tools/pdf-to-statement.py files/CCG-Statement-of-Faith.pdf
Needs: pip install pypdf

Structure produced:
  { "title": str, "sections": [ { "numeral": "I", "title": "Scripture",
      "blocks": [ {"type":"p","text":...} | {"type":"h","text":...} | {"type":"ul"|"ol","items":[...]}
                  | {"type":"sub","letter":"A","title":...,"blocks":[...]} ] } ] }
"""
import sys, re, json
from pypdf import PdfReader

src = sys.argv[1]
reader = PdfReader(src)
pages = []
for p in reader.pages:
    try:
        pages.append(p.extract_text(extraction_mode="layout") or "")
    except Exception:
        pages.append(p.extract_text() or "")

SECTION = re.compile(r"^\s*([IVX]+)\.\s+([A-Z][A-Z ’'&-]+)\s*$")
SUB = re.compile(r"^\s*([A-Z])\.\s+(.+?)\s*$")
BULLET = re.compile(r"^\s*●\s*(.+)$")
NUMBERED_PAIRS = re.compile(r"(\d+)\.\s+(.+?)(?=\s{2,}\d+\.\s|\s*$)")
ENDS_SENTENCE = re.compile(r"[.!?:;)\]”\"']\s*$")

SMALL = {"of", "the", "and", "in", "to", "a", "an", "for", "on", "at", "by"}
def title_case(t):
    words = t.lower().split()
    return " ".join(w if (i and w in SMALL) else w.capitalize() for i, w in enumerate(words)).replace("’s", "’s")

def is_minor_heading(line):
    s = line.strip()
    return (len(s) < 60 and not ENDS_SENTENCE.search(s) and s[:1].isupper()
            and not BULLET.match(s) and not re.match(r"^\d+\.", s)
            and len(s.split()) <= 6)

doc = {"title": "Statement of Faith", "sections": []}
cur_section = None
cur_sub = None
pending_para = None   # list of lines for the paragraph being built
pending_list = None   # {"type":..,"items":[]}
page_boundary = False

def target_blocks():
    if cur_sub is not None: return cur_sub["blocks"]
    if cur_section is not None: return cur_section["blocks"]
    return None

def flush_para():
    global pending_para
    if pending_para:
        text = re.sub(r"\s+", " ", " ".join(pending_para)).strip()
        blocks = target_blocks()
        if blocks is not None and text:
            # Join a paragraph split across a page break
            if blocks and blocks[-1]["type"] == "p" and blocks[-1].get("_open"):
                blocks[-1]["text"] = (blocks[-1]["text"] + " " + text).strip()
                blocks[-1]["_open"] = not ENDS_SENTENCE.search(text)
            else:
                blocks.append({"type": "p", "text": text, "_open": not ENDS_SENTENCE.search(text)})
        pending_para = None

def flush_list():
    global pending_list
    if pending_list and pending_list["items"]:
        blocks = target_blocks()
        if blocks is not None:
            # A lone numbered line that reads like a title ("1. Water Baptism") is a heading, not a list.
            if pending_list["type"] == "ol" and len(pending_list["items"]) == 1:
                n, t = pending_list["items"][0]
                if len(t.split()) <= 6 and not ENDS_SENTENCE.search(t):
                    blocks.append({"type": "h", "text": f"{n}. {t}"})
                    pending_list = None
                    return
            if pending_list["type"] == "ol":
                pending_list["items"] = [t for _, t in sorted(pending_list["items"], key=lambda x: x[0])]
            pending_list.pop("_", None)
            blocks.append(pending_list)
    pending_list = None

for pi, page in enumerate(pages):
    lines = page.split("\n")
    first_content = True
    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            flush_para(); flush_list(); continue
        s = line.strip()
        if pi == 0 and first_content and ("CHRIST" in s.upper() or "STATEMENT OF FAITH" in s.upper()):
            continue  # document title lines
        first_content = False
        m = SECTION.match(line)
        if m:
            flush_para(); flush_list()
            cur_section = {"numeral": m.group(1), "title": title_case(m.group(2)), "blocks": []}
            cur_sub = None
            doc["sections"].append(cur_section); continue
        m = SUB.match(line)
        if m and cur_section is not None and len(m.group(2).split()) <= 8 and not ENDS_SENTENCE.search(m.group(2)) and m.group(2)[0].isupper() and m.group(1) in "ABCDEFGHIJ":
            flush_para(); flush_list()
            cur_sub = {"type": "sub", "letter": m.group(1), "title": m.group(2), "blocks": []}
            cur_section["blocks"].append(cur_sub); continue
        m = BULLET.match(line)
        if m:
            flush_para()
            if not pending_list or pending_list["type"] != "ul": flush_list(); pending_list = {"type": "ul", "items": []}
            pending_list["items"].append(m.group(1).strip()); continue
        pairs = NUMBERED_PAIRS.findall(line)
        if pairs and re.match(r"^\s*\d+\.\s", line):
            flush_para()
            if not pending_list or pending_list["type"] != "ol": flush_list(); pending_list = {"type": "ol", "items": []}
            for n, t in pairs: pending_list["items"].append((int(n), t.strip()))
            continue
        if pending_list and pending_list["type"] == "ol" and not re.match(r"^\s*\d+\.", line):
            flush_list()
        if is_minor_heading(line) and pending_para is None:
            flush_list()
            blocks = target_blocks()
            if blocks is not None: blocks.append({"type": "h", "text": s})
            continue
        if pending_para is None: pending_para = []
        pending_para.append(s)
    flush_para(); flush_list()

def clean(blocks):
    for b in blocks:
        b.pop("_open", None)
        if b["type"] == "sub": clean(b["blocks"])
for sec in doc["sections"]: clean(sec["blocks"])

out = "data/statement-of-faith.json"
json.dump(doc, open(out, "w", encoding="utf8"), indent=2, ensure_ascii=False)
open(out, "a").write("\n")

# Outline for review
def count(blocks):
    n = {"p": 0, "h": 0, "ul": 0, "ol": 0, "sub": 0}
    for b in blocks:
        n[b["type"]] += 1
        if b["type"] == "sub":
            m = count(b["blocks"]); n["p"] += m["p"]
    return n
for sec in doc["sections"]:
    c = count(sec["blocks"])
    subs = [f'{b["letter"]}. {b["title"]}' for b in sec["blocks"] if b["type"] == "sub"]
    print(f'{sec["numeral"]:>4}. {sec["title"]:<18} p={c["p"]:<3} h={c["h"]} ul={c["ul"]} ol={c["ol"]}  subs: {"; ".join(subs)}')
print("sections:", len(doc["sections"]))
