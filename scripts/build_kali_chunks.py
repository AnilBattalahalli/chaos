#!/usr/bin/env python3
"""Rebuild static/kali/dict_*.json chunks from the Alar Dravidian-split source.

Usage: python3 scripts/build_kali_chunks.py [path/to/source_dir]
"""
import json
import random
import sys
from pathlib import Path

SOURCE_DIR = Path(
    sys.argv[1]
    if len(sys.argv) > 1
    else "/Users/anilbattalahalli/coding/python_stuff/alar_reverse/aaLahuDuku/alar_drav_splits"
)
OUT_DIR = Path(__file__).resolve().parent.parent / "static" / "kali"
N_CHUNKS = 100
OLD_MAX_CHUNKS = 100  # clean up leftovers from the previous chunk count (90)

DEFAULT_LEVEL = 1  # a small number of source entries have no level classified

POS_ABBR = {
    "noun": "n.",
    "verb": "v.",
    "adjective": "adj.",
    "adverb": "adv.",
    "interjection": "interj.",
    "pronoun": "pron.",
    "conjunction": "conj.",
    "preposition": "prep.",
}


def convert(raw_entry):
    pos_raw = (raw_entry.get("pos") or "").strip().lower()
    return {
        "word": raw_entry["word"],
        "pronunciation": raw_entry.get("pronunciation") or None,
        "pos": POS_ABBR.get(pos_raw),  # None for garbled/rare source values -> just omitted in the UI
        "level": raw_entry.get("level") if raw_entry.get("level") is not None else DEFAULT_LEVEL,
        "definition": raw_entry["definition"],
        "example": raw_entry["kannada_example"],
        "example_en": raw_entry["english_translation"],
    }


def main():
    entries = []
    for path in sorted(SOURCE_DIR.glob("alar_drav_*.json")):
        with path.open(encoding="utf-8") as f:
            entries.extend(convert(e) for e in json.load(f))

    random.shuffle(entries)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chunk_size = -(-len(entries) // N_CHUNKS)  # ceil division

    for i in range(N_CHUNKS):
        chunk = entries[i * chunk_size : (i + 1) * chunk_size]
        out_path = OUT_DIR / f"dict_{i}.json"
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(chunk, f, ensure_ascii=False, separators=(",", ":"))

    removed = 0
    for i in range(N_CHUNKS, OLD_MAX_CHUNKS):
        stale = OUT_DIR / f"dict_{i}.json"
        if stale.exists():
            stale.unlink()
            removed += 1

    print(f"Wrote {N_CHUNKS} chunks ({len(entries)} entries) to {OUT_DIR}")
    if removed:
        print(f"Removed {removed} stale chunk files (dict_{N_CHUNKS}..{OLD_MAX_CHUNKS - 1})")


if __name__ == "__main__":
    main()
