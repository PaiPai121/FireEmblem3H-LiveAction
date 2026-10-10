#!/usr/bin/env python3
"""Audit exact frame reuse across Golden Deer timing-safe micro-shots."""

from __future__ import annotations

import hashlib
import json
import sys
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"
FRAMES = ("start_frame.png", "key_frame.png", "end_frame.png")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    episode_reports = []
    errors: list[str] = []
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        shots_root = episode_dir / PACKAGE / "shots"
        if not shots_root.exists():
            continue
        by_hash: dict[str, list[str]] = defaultdict(list)
        for shot_dir in sorted(p for p in shots_root.iterdir() if p.is_dir()):
            for frame in FRAMES:
                by_hash[digest(shot_dir / frame)].append(f"{shot_dir.name}/{frame}")
        duplicate_groups = [items for items in by_hash.values() if len(items) > 1]
        repeated_occurrences = sum(len(items) - 1 for items in duplicate_groups)
        episode_reports.append(
            {
                "episode": episode_dir.name,
                "duplicate_groups": duplicate_groups,
                "repeated_occurrences": repeated_occurrences,
            }
        )
        if repeated_occurrences:
            errors.append(f"{episode_dir.name}: {repeated_occurrences} repeated frame occurrence(s)")

    result = {"episodes": episode_reports, "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
