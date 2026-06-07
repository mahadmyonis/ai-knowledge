"""
ingest_schedule.py — Ingests course schedule JSON into Pinecone.

Reads the pre-scraped JSON file (course_resultsCampusQ.json) and uploads
one vector per course per term, with all sections described in the text field.

Usage:
  py scrapers/active/ingest_schedule.py                        # upload all
  py scrapers/active/ingest_schedule.py --dry-run              # preview, no upload
  py scrapers/active/ingest_schedule.py --term fall            # one term only
  py scrapers/active/ingest_schedule.py --course COMP3008      # one course (debug)

Namespace: "schedule"
"""

import os
import re
import sys
import json
import time
from collections import defaultdict
from dotenv import load_dotenv
from pinecone import Pinecone
from openai import OpenAI

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"))

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("knowledge-base")

NAMESPACE   = "schedule"
EMBED_MODEL = "text-embedding-3-small"
BATCH_SIZE  = 50

JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "Downloads", "course_resultsCampusQ.json")

TERM_SLUGS = {
    "summer 2026": "SU26",
    "fall 2026":   "F26",
    "winter 2027": "W27",
}

def term_slug(term: str) -> str:
    for key, slug in TERM_SLUGS.items():
        if key in term.lower():
            return slug
    return re.sub(r"[^A-Z0-9]", "", term.upper())[:6]


# ── Build display + embed text ────────────────────────────────────────────────

def build_display_text(course_code: str, term: str, sections: list) -> str:
    first = sections[0]
    lines = [
        f"{course_code} — {first['title']} ({first['credits']} credits)",
        f"Term: {term}",
        "",
    ]
    for s in sections:
        status_str = s["status"]
        delivery = s.get("section_info", "")
        # Extract delivery type from section_info
        deliv_m = re.search(r"Section Type\s*[-–]\s*([^\n.]+)", delivery, re.IGNORECASE)
        deliv_str = deliv_m.group(1).strip() if deliv_m else ""

        header = f"Section {s['section']} (CRN {s['crn']}) | {status_str} | {s['type']}"
        if deliv_str:
            header += f" | {deliv_str}"
        lines.append(header)

        if s.get("instructor"):
            lines.append(f"  Instructor: {s['instructor']}")
        if s.get("days") or s.get("time"):
            lines.append(f"  Days: {s.get('days','')}  Time: {s.get('time','')}")
        if s.get("meeting_date"):
            lines.append(f"  Dates: {s['meeting_date']}")
        if s.get("section_info") and not deliv_m:
            lines.append(f"  Info: {s['section_info'][:120]}")
        lines.append("")

    return "\n".join(lines).strip()


def build_embed_text(course_code: str, term: str, sections: list) -> str:
    first = sections[0]
    instructors = list(dict.fromkeys(s["instructor"] for s in sections if s.get("instructor")))
    times = list(dict.fromkeys(
        f"{s.get('days','')} {s.get('time','')}".strip()
        for s in sections if s.get("days") or s.get("time")
    ))
    statuses = list(dict.fromkeys(s["status"] for s in sections))
    open_sections = [s for s in sections if "open" in s["status"].lower()]

    parts = [
        f"{course_code}: {first['title']}",
        f"{term}",
        f"{len(sections)} section(s), {len(open_sections)} open",
        f"Credits: {first['credits']}",
        f"Type: {first['type']}",
    ]
    if instructors:
        parts.append("Instructors: " + ", ".join(instructors))
    if times:
        parts.append("Times: " + "; ".join(times))
    if statuses:
        parts.append("Status: " + ", ".join(statuses))
    return " | ".join(parts)


# ── Upload batch ──────────────────────────────────────────────────────────────

def upload_batch(batch: list, dry_run: bool):
    """batch = list of (course_code, term, sections)"""
    embed_texts = [build_embed_text(c, t, s) for c, t, s in batch]
    response = openai_client.embeddings.create(input=embed_texts, model=EMBED_MODEL)

    vectors = []
    for i, (course_code, term, sections) in enumerate(batch):
        first = sections[0]
        slug = term_slug(term)
        vec_id = re.sub(r"[^A-Z0-9]", "", course_code.upper()) + "_" + slug

        all_crns = [s["crn"] for s in sections]
        all_instructors = list(dict.fromkeys(s["instructor"] for s in sections if s.get("instructor")))
        open_count = sum(1 for s in sections if "open" in s["status"].lower())

        vectors.append({
            "id": vec_id,
            "values": response.data[i].embedding,
            "metadata": {
                "course_code":   course_code,
                "title":         first["title"],
                "credits":       first["credits"],
                "term":          term,
                "section_count": str(len(sections)),
                "open_sections": str(open_count),
                "crns":          ", ".join(all_crns),
                "instructors":   ", ".join(all_instructors),
                "text":          build_display_text(course_code, term, sections),
            },
        })

    if dry_run:
        for v in vectors[:2]:  # show first 2 in dry run
            m = v["metadata"]
            print(f"\n  {v['id']}  |  {m['course_code']}  |  {m['term']}")
            print(f"  sections: {m['section_count']} total, {m['open_sections']} open")
            print(f"  instructors: {m['instructors']}")
            print(f"  --- text ---")
            for line in m["text"].splitlines():
                print(f"  {line}")
    else:
        index.upsert(vectors=vectors, namespace=NAMESPACE)


# ── Main ──────────────────────────────────────────────────────────────────────

def run(dry_run=False, term_filter=None, course_filter=None):
    print("\n" + "=" * 60)
    print(f"SCHEDULE INGEST {'[DRY RUN]' if dry_run else ''}  namespace={NAMESPACE}")
    print("=" * 60)

    # Load JSON
    path = JSON_PATH
    if not os.path.exists(path):
        # Fallback: check Downloads folder directly
        path = r"C:\Users\Mahad\Downloads\course_resultsCampusQ.json"
    print(f"\n[1] Loading {path}")
    with open(path, encoding="utf-8") as f:
        records = json.load(f)
    print(f"    {len(records)} section records loaded")

    # Filter by term if requested
    if term_filter:
        records = [r for r in records if term_filter.lower() in r["term"].lower()]
        print(f"    Filtered to term '{term_filter}': {len(records)} records")

    if course_filter:
        records = [r for r in records if course_filter.upper() in r["course_code"].upper().replace(" ", "")]
        print(f"    Filtered to course '{course_filter}': {len(records)} records")

    # Group by (term, course_code)
    grouped = defaultdict(list)
    for r in records:
        grouped[(r["term"], r["course_code"])].append(r)

    print(f"    {len(grouped)} (term, course) combinations\n")

    # Build batches and upload
    items = list(grouped.items())
    total_vectors = 0

    print(f"[2] {'Previewing' if dry_run else 'Uploading'} {len(items)} vectors...\n")

    for i in range(0, len(items), BATCH_SIZE):
        chunk = items[i:i + BATCH_SIZE]
        batch = [(code, term, secs) for (term, code), secs in chunk]
        upload_batch(batch, dry_run=dry_run)
        total_vectors += len(batch)

        if not dry_run:
            end = min(i + BATCH_SIZE, len(items))
            print(f"  Uploaded {end}/{len(items)} vectors...", flush=True)
            time.sleep(0.3)

        if dry_run:
            break  # just show first batch in dry run

    print(f"\n{'='*60}")
    print(f"{'[DRY RUN] ' if dry_run else ''}DONE — {total_vectors} vectors {'previewed' if dry_run else 'upserted'}")
    if not dry_run:
        print(f"  Namespace: {NAMESPACE}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    dry_run       = "--dry-run" in sys.argv
    term_filter   = None
    course_filter = None

    if "--term" in sys.argv:
        idx = sys.argv.index("--term")
        if idx + 1 < len(sys.argv):
            term_filter = sys.argv[idx + 1]

    if "--course" in sys.argv:
        idx = sys.argv.index("--course")
        if idx + 1 < len(sys.argv):
            course_filter = sys.argv[idx + 1]

    run(dry_run=dry_run, term_filter=term_filter, course_filter=course_filter)
