#!/usr/bin/env python3
"""Compact an asciinema .cast so idle stretches don't drag the playback.

A .cast is: line 1 = JSON header; each following line = [time, "o"|"i", data].
We walk the output events and shrink any gap between consecutive events longer
than --max-gap down to --max-gap (keeping a tiny pause so it doesn't feel glued).
Input ordering and content are preserved; only timestamps move.

Usage:
    python3 compact-cast.py input.cast output.cast --max-gap 0.4

Verify length afterwards:
    python3 -c "import json;print(round(json.loads(open('output.cast').readlines()[-1])[0],1),'s')"
"""
from __future__ import annotations
import argparse
import json
import sys


def compact(in_path: str, out_path: str, max_gap: float) -> None:
    with open(in_path, "r", encoding="utf-8") as fh:
        lines = fh.readlines()
    if not lines:
        sys.exit("empty cast")

    header = json.loads(lines[0])
    # Keep header's "version" etc.; duration will simply be shorter after compaction.

    events = []
    for ln in lines[1:]:
        ln = ln.strip()
        if not ln:
            continue
        events.append(json.loads(ln))

    if not events:
        # header only
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(lines[0])
        return

    out_events = []
    # Re-time from 0, preserving relative gaps but capping them at max_gap.
    prev_t = events[0][0]
    cursor = 0.0
    # first event keeps its own data at t=0 (or its original offset if you prefer)
    cursor = events[0][0]
    out_events.append([round(cursor, 6), events[0][1], events[0][2]])
    for ev in events[1:]:
        gap = ev[0] - prev_t
        if gap < 0:
            gap = 0  # defensive: malformed cast
        gap = min(gap, max_gap)
        cursor += gap
        out_events.append([round(cursor, 6), ev[1], ev[2]])
        prev_t = ev[0]

    # Rewrite the header duration so players report the compacted length.
    header["duration"] = round(cursor, 6)

    with open(out_path, "w", encoding="utf-8") as out:
        out.write(json.dumps(header) + "\n")
        for ev in out_events:
            out.write(json.dumps(ev) + "\n")

    print(
        f"compacted {len(events)} events; "
        f"duration {events[-1][0]:.1f}s -> {cursor:.1f}s "
        f"(max-gap {max_gap}s)",
        file=sys.stderr,
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Compact an asciinema .cast by removing idle gaps.")
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--max-gap", type=float, default=0.4,
                    help="max seconds between two events (default 0.4)")
    args = ap.parse_args()
    compact(args.input, args.output, args.max_gap)


if __name__ == "__main__":
    main()
