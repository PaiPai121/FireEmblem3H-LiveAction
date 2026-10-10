#!/usr/bin/env python3
from __future__ import annotations

import shutil
from pathlib import Path


ASSETS = [
    (
        "Annette",
        Path("/Users/zekun/.codex/generated_images/019fbdc0-3d85-70b0-8692-9895d23c7b35/call_hYUFVSf1ls4YPVsjJDFP97oq.png"),
        Path("assets/characters/blue_lions/Annette/academy"),
    ),
    (
        "Mercedes",
        Path("/Users/zekun/.codex/generated_images/019fbdc0-3d85-70b0-8692-9895d23c7b35/call_kNQUYxfw9OMhcuxhePiHoPrD.png"),
        Path("assets/characters/blue_lions/Mercedes/academy"),
    ),
]


def promote(name: str, source: Path, base: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(source)

    candidate_dir = base / "candidates_youth_v3_2026-08-09"
    candidate_dir.mkdir(parents=True, exist_ok=True)
    candidate_path = candidate_dir / "candidate_01.png"
    shutil.copyfile(source, candidate_path)

    selected_path = base / "selected.png"
    backup_dir = base / "selected_before_youth_v3_2026-08-09"
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_path = backup_dir / "previous_selected.png"
    if selected_path.exists() and not backup_path.exists():
        shutil.copyfile(selected_path, backup_path)

    shutil.copyfile(candidate_path, selected_path)
    notes = candidate_dir / "notes.md"
    notes.write_text(
        f"# {name} Academy Youth V3 Notes\n\n"
        "Status: promoted_to_selected\n"
        "Date: 2026-08-09\n"
        f"Source generated candidate: {candidate_path}\n"
        f"Previous selected backup: {backup_path}\n\n"
        "Purpose: restore academy-phase teenage/youthful student read before regenerating "
        "Blue Lions support comedy frames. Reject mature adult, over-refined noble portrait, "
        "nun-like, motherly, model-like, or childlike drift.\n",
        encoding="utf-8",
    )


def main() -> int:
    for name, source, base in ASSETS:
        promote(name, source, base)
    print(f"promoted {len(ASSETS)} academy youth_v3 assets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
