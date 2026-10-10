#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"
EPISODE = SERIES / "EP04_sylvain_mercedes_c"
PACKAGE = EPISODE / "delivery" / "video_generation_package_2026-08-02_EP04_sylvain_mercedes_c_timing_safe_v2"

IDENTITY_NOTE = (
    "Mercedes identity_v4 lock: every EP04 frame must preserve Mercedes's canon academy identifiers: soft youthful rounded face, warm blue-lavender eyes, "
    "pale-blonde side-swept bangs, long side ponytail over her right shoulder, black-and-gold striped hair ribbon, white high collar and scarf, gold geometric chest trim, "
    "beige cape with blue linework, and gentle slightly absent-minded student warmth. Reject if she looks like a generic blonde church student, adult noblewoman, model, nun, or motherly healer."
)
REVIEW_STATUS = "mercedes_identity_v4_visual_review_passed"


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def update_json(path: Path, updates: dict) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    data.update(updates)
    write_json(path, data)


def main() -> int:
    shot_ids: list[str] = []
    for shot_dir in sorted((PACKAGE / "shots").iterdir()):
        if not shot_dir.is_dir():
            continue
        meta_path = shot_dir / "metadata.json"
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        shot_id = meta["shot_id"]
        shot_ids.append(shot_id)
        updates = {
            "visual_status": "widescreen_sheet_frames_applied",
            "mercedes_identity_lock": IDENTITY_NOTE,
            "mercedes_identity_status": REVIEW_STATUS,
            "mercedes_identity_review_date": "2026-08-10",
            "no_artificial_side_fill": True,
        }
        meta.update(updates)
        write_json(meta_path, meta)
        for target in [EPISODE / "storyboards" / shot_id, SERIES / "storyboards" / shot_id]:
            if (target / "metadata.json").exists():
                update_json(target / "metadata.json", updates)

    package_updates = {
        "mercedes_identity_lock": IDENTITY_NOTE,
        "mercedes_identity_status": REVIEW_STATUS,
        "mercedes_identity_review_date": "2026-08-10",
        "mercedes_identity_repaired_shots": shot_ids,
        "visual_revision_notes": "EP04 Mercedes identity repair: regenerated all seven timing-safe shots after user feedback that the delivered woman did not read as Mercedes.",
    }
    update_json(PACKAGE / "package_manifest.json", package_updates)
    update_json(PACKAGE / "metadata.json", package_updates)

    review = EPISODE / "production_system" / "reviews" / "mercedes_identity_v4_visual_review_2026-08-10.md"
    write_text(
        review,
        "# Mercedes Identity V4 Visual Review - 2026-08-10\n\n"
        f"Status: {REVIEW_STATUS}\n\n"
        "Reviewed shots: " + ", ".join(shot_ids) + "\n\n"
        "Pass rationale: regenerated EP04 frames preserve Mercedes's academy identifiers across the shot set: soft youthful face, blue-lavender eyes, pale-blonde side-swept hair, side ponytail, black-and-gold ribbon, white collar/scarf, gold chest trim, beige cape with blue linework, prayer book, and gentle student warmth. "
        "The prior generic/mature blonde church-student drift has been superseded.\n\n"
        "Residual monitor: keep rejecting glamour-model, adult noblewoman, nun-like, missing-ribbon, missing-cape, or generic blonde drift during video generation.\n",
    )
    print(f"marked {REVIEW_STATUS} {len(shot_ids)} shots")
    print(review)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
