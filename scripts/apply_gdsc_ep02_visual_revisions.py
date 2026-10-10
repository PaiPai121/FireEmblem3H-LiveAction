#!/usr/bin/env python3
"""Apply EP02 Hilda/Marianne visual revision frames and refresh viewers."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps

from apply_gdsc_timing_frame_repairs import (
    OUT_SIZE,
    PACKAGE,
    ROOT,
    SERIES,
    write_contact_sheet,
    write_episode_viewer,
    write_json,
    write_series_contact_sheet,
)
from build_gdsc_web_panel import main as build_gdsc_web_panel


EPISODE = "EP02_hilda_marianne"
REVISION_ROOT = SERIES / EPISODE / "visual_revisions_2026-08-03"

REVISIONS: dict[str, dict[str, str]] = {
    "004_GDSC02-SH002B": {
        "start_frame.png": "004_GDSC02-SH002B/start_frame.png",
        "key_frame.png": "004_GDSC02-SH002B/key_frame.png",
        "end_frame.png": "004_GDSC02-SH002B/end_frame.png",
    },
    "005_GDSC02-SH003A": {
        "start_frame.png": "005_GDSC02-SH003A/start_frame.png",
        "key_frame.png": "005_GDSC02-SH003A/key_frame.png",
        "end_frame.png": "005_GDSC02-SH003A/end_frame.png",
    },
    "006_GDSC02-SH003B": {
        "start_frame.png": "006_GDSC02-SH003B/start_frame.png",
        "key_frame.png": "006_GDSC02-SH003B/key_frame.png",
        "end_frame.png": "006_GDSC02-SH003B/end_frame.png",
    },
    "007_GDSC02-SH003C": {
        "start_frame.png": "007_GDSC02-SH003C/start_frame.png",
        "key_frame.png": "007_GDSC02-SH003C/key_frame.png",
        "end_frame.png": "007_GDSC02-SH003C/end_frame.png",
    },
    "008_GDSC02-SH004A": {
        "start_frame.png": "008_GDSC02-SH004A/start_frame.png",
        "key_frame.png": "008_GDSC02-SH004A/key_frame.png",
        "end_frame.png": "008_GDSC02-SH004A/end_frame.png",
    },
    "009_GDSC02-SH004B": {
        "start_frame.png": "009_GDSC02-SH004B/start_frame.png",
        "key_frame.png": "009_GDSC02-SH004B/key_frame.png",
        "end_frame.png": "009_GDSC02-SH004B/end_frame.png",
    },
    "010_GDSC02-SH004C": {
        "start_frame.png": "010_GDSC02-SH004C/start_frame.png",
        "key_frame.png": "010_GDSC02-SH004C/key_frame.png",
        "end_frame.png": "010_GDSC02-SH004C/end_frame.png",
    },
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_frame(source: Path, target: Path) -> dict[str, object]:
    image = Image.open(source).convert("RGB")
    source_size = image.size
    source_aspect = image.width / image.height
    target_aspect = OUT_SIZE[0] / OUT_SIZE[1]
    image = ImageOps.fit(image, OUT_SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    image.save(target, quality=96)
    return {
        "source_size": list(source_size),
        "source_aspect": round(source_aspect, 6),
        "target_size": list(OUT_SIZE),
        "target_aspect": round(target_aspect, 6),
        "resize_policy": "aspect_safe_crop_no_stretch",
    }


def apply_revisions() -> list[Path]:
    touched: list[Path] = []
    package = SERIES / EPISODE / PACKAGE
    now = datetime.now().isoformat(timespec="seconds")
    for shot_name, frame_map in REVISIONS.items():
        shot_dir = package / "shots" / shot_name
        if not shot_dir.exists():
            raise FileNotFoundError(shot_dir)
        applied: dict[str, str] = {}
        aspect_report: dict[str, object] = {}
        for frame_name, rel_source in frame_map.items():
            source = REVISION_ROOT / rel_source
            if not source.exists():
                continue
            aspect_report[frame_name] = save_frame(source, shot_dir / frame_name)
            applied[frame_name] = source.relative_to(ROOT).as_posix()
        if not applied:
            continue
        meta = load_json(shot_dir / "metadata.json")
        meta["status"] = "approved_for_video"
        meta["visual_version"] = "v5_dialogue_specific_regenerated_frames"
        meta["visual_status"] = "dialogue_specific_imagegen_frames_applied"
        meta["updated_at"] = now
        meta["visual_revision_2026_08_03"] = {
            "method": "regenerated shot-specific start/key/end storyboard anchors after visual audit rejected copied parent anchors",
            "frame_sources": applied,
            "aspect_policy": "aspect_safe_crop_no_stretch",
            "frame_aspect_report": aspect_report,
            "distortion_review": "requires_manual_visual_review_after_2026_08_04_aspect_gate",
            "audit": "specials/golden_deer_support_comedy/EP02_hilda_marianne/visual_revision_audit_2026-08-03.md",
            "updated_at": now,
        }
        write_json(shot_dir / "metadata.json", meta)
        touched.append(shot_dir)
    return touched


def main() -> int:
    touched = apply_revisions()
    episode_dir = SERIES / EPISODE
    package = episode_dir / PACKAGE
    write_episode_viewer(episode_dir)
    write_contact_sheet(package)
    write_series_contact_sheet()
    build_gdsc_web_panel()
    print(json.dumps({"applied_shots": [p.relative_to(ROOT).as_posix() for p in touched]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
