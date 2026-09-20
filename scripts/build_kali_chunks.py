#!/usr/bin/env python3
"""Rebuild static/kali/dict_*.json chunks from the IWN Kannada dictionary source.

Usage: python3 scripts/build_kali_chunks.py [path/to/source.json]
"""
import json
import random
import sys
from pathlib import Path

SOURCE = Path(
    sys.argv[1]
    if len(sys.argv) > 1
    else "/Users/anilbattalahalli/coding/python_stuff/alar_reverse/Kali3/IWN_Ka_En_Mapped.json"
)
OUT_DIR = Path(__file__).resolve().parent.parent / "static" / "kali"
N_CHUNKS = 90
OLD_MAX_CHUNKS = 200  # clean up leftovers from the previous, larger chunk count


def convert(raw_entry):
    root_dict = raw_entry["kannada_root"]
    root_word, root_level = next(iter(root_dict.items()))

    synonyms = []
    for syn in raw_entry.get("kannada_synonyms") or []:
        word, level = next(iter(syn.items()))
        synonyms.append({"word": word, "level": level})

    return {
        "root": root_word,
        "level": root_level,
        "synonyms": synonyms,
        "gloss": raw_entry["english_gloss"],
        "meaning": raw_entry["kannada_meaning"],
        "example": raw_entry["kannada_example"],
    }


def main():
    with SOURCE.open(encoding="utf-8") as f:
        raw = json.load(f)

    entries = [convert(e) for e in raw]
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
