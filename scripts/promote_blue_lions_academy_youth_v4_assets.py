#!/usr/bin/env python3
from __future__ import annotations

import shutil
from pathlib import Path


ANNETTE_SOURCE = Path("/Users/zekun/.codex/generated_images/019fbdc0-3d85-70b0-8692-9895d23c7b35/call_6194J7wTiqcd0Wme9XmUwtZh.png")
PAIR_SOURCE = Path("/Users/zekun/.codex/generated_images/019fbdc0-3d85-70b0-8692-9895d23c7b35/call_VBAESW1JR9ADVo55jgaqfNC6.png")
ANNETTE_BASE = Path("assets/characters/blue_lions/Annette/academy")
PAIR_DIR = Path("assets/characters/blue_lions/paired_lookdev/Annette_Mercedes")


def main() -> int:
    if not ANNETTE_SOURCE.exists():
        raise FileNotFoundError(ANNETTE_SOURCE)
    if not PAIR_SOURCE.exists():
        raise FileNotFoundError(PAIR_SOURCE)

    candidate_dir = ANNETTE_BASE / "candidates_youth_v4_2026-08-09"
    candidate_dir.mkdir(parents=True, exist_ok=True)
    candidate_path = candidate_dir / "candidate_01.png"
    shutil.copyfile(ANNETTE_SOURCE, candidate_path)

    selected_path = ANNETTE_BASE / "selected.png"
    backup_dir = ANNETTE_BASE / "selected_before_youth_v4_2026-08-09"
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_path = backup_dir / "previous_selected.png"
    if selected_path.exists() and not backup_path.exists():
        shutil.copyfile(selected_path, backup_path)
    shutil.copyfile(candidate_path, selected_path)

    (candidate_dir / "notes.md").write_text(
        "# Annette Academy Youth V4 Notes\n\n"
        "Status: promoted_to_selected\n"
        "Date: 2026-08-09\n"
        f"Source generated candidate: {candidate_path}\n"
        f"Previous selected backup: {backup_path}\n\n"
        "Purpose: push Annette further toward a petite 15-16 academy student read while avoiding childlike drift. "
        "Use with the paired v4 lookdev to keep her significantly shorter than Mercedes.\n",
        encoding="utf-8",
    )

    PAIR_DIR.mkdir(parents=True, exist_ok=True)
    pair_path = PAIR_DIR / "academy_youth_v4_2026-08-09.png"
    shutil.copyfile(PAIR_SOURCE, pair_path)
    pair_path.with_suffix(".md").write_text(
        "# Annette / Mercedes Academy Youth V4 Paired Lookdev\n\n"
        "Status: approved_as_regeneration_anchor\n"
        "Date: 2026-08-09\n\n"
        "Use this as the EP02 age, face, and stronger relative-height anchor. Annette reads 15-16 and significantly shorter; "
        "her head top should sit around Mercedes's lower cheek/chin/neck line when standing beside her. Mercedes remains a youthful older academy classmate.\n",
        encoding="utf-8",
    )

    print("promoted Annette academy youth_v4 and paired lookdev")
    print(candidate_path)
    print(pair_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
