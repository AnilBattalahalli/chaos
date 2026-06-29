#!/usr/bin/env python3
# Usage: python3 scripts/build_learngerman_chunks.py
#
# Reads scripts/data/learngerman/wordlist.tsv (Goethe A1, CC BY-SA 4.0) and
# writes 10 shuffled chunks to static/learngerman/vocab_0.json ... vocab_9.json.
# Re-run any time the source list changes. Output is deterministic (fixed seed).

import csv
import json
import random
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE = REPO_ROOT / "scripts" / "data" / "learngerman" / "wordlist.tsv"
OUT_DIR = REPO_ROOT / "static" / "learngerman"
N_CHUNKS = 10
SEED = 42

FIELDS = ["id", "de_word", "de_sentence", "en_word", "en_sentence",
          "formality", "note", "_audio_unused"]


def load_entries():
    entries = []
    with SOURCE.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        for row in reader:
            if not row or not row[0].strip():
                continue
            row = row + [""] * (len(FIELDS) - len(row))
            entry = {k: row[i].strip() for i, k in enumerate(FIELDS) if k != "_audio_unused"}
            entries.append(entry)
    return entries


def main():
    entries = load_entries()
    random.Random(SEED).shuffle(entries)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("vocab_*.json"):
        old.unlink()

    chunks = [[] for _ in range(N_CHUNKS)]
    for i, entry in enumerate(entries):
        chunks[i % N_CHUNKS].append(entry)

    for i, chunk in enumerate(chunks):
        path = OUT_DIR / f"vocab_{i}.json"
        path.write_text(json.dumps(chunk, ensure_ascii=False), encoding="utf-8")

    total = sum(len(c) for c in chunks)
    print(f"Wrote {N_CHUNKS} chunks, {total} entries total, to {OUT_DIR}")
    for i, chunk in enumerate(chunks):
        print(f"  vocab_{i}.json: {len(chunk)} entries")


if __name__ == "__main__":
    main()
