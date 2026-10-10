#!/usr/bin/env python3
"""Strict visual delivery gate for Golden Deer support comedy packages."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageStat
from PIL import ImageChops


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"
REQUIRED_FRAMES = ("start_frame.png", "key_frame.png", "end_frame.png")
MIN_FRAME_RMS = 1.0
APPROVED_VISUAL_STATUSES = {
    "imagegen_base_applied",
    "temporal_imagegen_frames_applied",
    "timing_repaired_imagegen_frames_applied",
    "dialogue_specific_imagegen_frames_applied",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def image_ok(path: Path) -> tuple[bool, str]:
    try:
        img = Image.open(path).convert("RGB")
    except Exception as exc:  # noqa: BLE001
        return False, f"cannot_open:{exc}"
    if img.size != (1280, 720):
        return False, f"wrong_size:{img.size}"
    stat = ImageStat.Stat(img)
    if sum(stat.var) < 50:
        return False, "near_blank"
    return True, "ok"


def frame_rms(a: Path, b: Path) -> float:
    img_a = Image.open(a).convert("RGB")
    img_b = Image.open(b).convert("RGB")
    diff = ImageChops.difference(img_a, img_b)
    stat = ImageStat.Stat(diff)
    return sum(value * value for value in stat.rms) ** 0.5


def main() -> int:
    errors: list[str] = []
    checked = 0
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        shots_root = episode_dir / PACKAGE / "shots"
        if not shots_root.exists():
            continue
        for shot_dir in sorted(p for p in shots_root.iterdir() if p.is_dir()):
            checked += 1
            meta_path = shot_dir / "metadata.json"
            if not meta_path.exists():
                errors.append(f"{shot_dir}: missing metadata.json")
                continue
            meta = load_json(meta_path)
            status = meta.get("visual_status")
            if status not in APPROVED_VISUAL_STATUSES:
                errors.append(f"{shot_dir}: visual_status={status}")
            provenance = meta.get("frame_provenance") or {}
            temporal_provenance = meta.get("temporal_frame_provenance") or {}
            timing_repair = meta.get("timing_frame_repair") or {}
            visual_revision = meta.get("visual_revision_2026_08_03") or {}
            if (
                "source_image" not in provenance
                and "frame_sources" not in provenance
                and "frame_sources" not in temporal_provenance
                and "frame_sources" not in timing_repair
                and "frame_sources" not in visual_revision
            ):
                errors.append(f"{shot_dir}: missing source_image provenance")
            if (shot_dir / "rejected_mockup_frames").exists() and status not in APPROVED_VISUAL_STATUSES:
                errors.append(f"{shot_dir}: rejected mockups exist but no v2 replacement")
            for frame in REQUIRED_FRAMES:
                path = shot_dir / frame
                if not path.exists():
                    errors.append(f"{shot_dir}: missing {frame}")
                    continue
                ok, reason = image_ok(path)
                if not ok:
                    errors.append(f"{shot_dir}/{frame}: {reason}")
            if all((shot_dir / frame).exists() for frame in REQUIRED_FRAMES):
                pairs = {
                    "start_key": frame_rms(shot_dir / "start_frame.png", shot_dir / "key_frame.png"),
                    "key_end": frame_rms(shot_dir / "key_frame.png", shot_dir / "end_frame.png"),
                    "start_end": frame_rms(shot_dir / "start_frame.png", shot_dir / "end_frame.png"),
                }
                duplicate_pairs = [name for name, value in pairs.items() if value < MIN_FRAME_RMS]
                if duplicate_pairs:
                    errors.append(f"{shot_dir}: duplicate frame anchors {duplicate_pairs}")

    result = {"checked_shots": checked, "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
