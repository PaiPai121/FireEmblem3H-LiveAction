#!/usr/bin/env python3
"""Project-specific delivery contract checks for Golden Deer support comedy."""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE_NAME = "delivery/video_generation_package_2026-07-31_timing_safe"
APPROVED_VISUAL_STATUSES = {
    "imagegen_base_applied",
    "temporal_imagegen_frames_applied",
    "timing_repaired_imagegen_frames_applied",
    "dialogue_specific_imagegen_frames_applied",
}
EPISODES = (
    "EP01_hilda_lorenz",
    "EP02_hilda_marianne",
    "EP03_hilda_lysithea",
    "EP04_claude_lorenz",
)
REQUIRED_PACKAGE_FILES = (
    "asset_viewer.html",
    "prompt.md",
    "negative_prompt.md",
    "metadata.json",
    "submission_queue.csv",
    "RUNBOOK.md",
    "model_target_profile.md",
    "clip_qa_checklist.md",
    "prompt_qa_review.md",
    "zh_subtitles.md",
    "zh_subtitles.srt",
    "dialogue_timing_audit.md",
)
REQUIRED_SCRIPT_FIELDS = (
    "Support Pair",
    "Support Rank",
    "Source",
    "Dialogue Policy",
)
FRAME_NAMES = ("start_frame.png", "key_frame.png", "end_frame.png")
BAD_TOKENS = re.compile(r"\b(TODO|TBD|PLACEHOLDER|FIXME|INSERT|REPLACE_ME)\b|<[^>\n]+>", re.I)
VIEWER_SRC = re.compile(r'<img\s+[^>]*src="([^"]+)"', re.I)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def check_episode(episode: str) -> list[str]:
    errors: list[str] = []
    ep_root = SERIES / episode
    package = ep_root / PACKAGE_NAME
    if not package.exists():
        return [f"{episode}: missing package {PACKAGE_NAME}"]

    for filename in REQUIRED_PACKAGE_FILES:
        if not (package / filename).exists():
            errors.append(f"{episode}: missing {filename}")

    script = (ep_root / "script.md").read_text(encoding="utf-8") if (ep_root / "script.md").exists() else ""
    for field in REQUIRED_SCRIPT_FIELDS:
        if field not in script:
            errors.append(f"{episode}: script.md missing {field}")
    script_lower = script.lower()
    if "original support line" not in script_lower or "action bridge" not in script_lower:
        errors.append(f"{episode}: script.md does not mark original lines and action bridges")

    viewer = package / "asset_viewer.html"
    if viewer.exists():
        html = viewer.read_text(encoding="utf-8")
        if 'class="missing-frame"' in html:
            errors.append(f"{episode}: viewer still contains missing-frame cells")
        for src in VIEWER_SRC.findall(html):
            if src.startswith(("http:", "https:", "data:")):
                continue
            if not (package / src).exists():
                errors.append(f"{episode}: broken viewer image src {src}")

    queue = package / "submission_queue.csv"
    if queue.exists():
        with queue.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
        if len(rows) < 4:
            errors.append(f"{episode}: submission_queue rows={len(rows)}")

    metadata = load_json(package / "metadata.json") if (package / "metadata.json").exists() else {}
    total_duration = metadata.get("total_duration_seconds") or metadata.get("duration_seconds")
    if not total_duration or total_duration < 60:
        errors.append(f"{episode}: total duration is {total_duration}, expected at least 60")

    shots_root = package / "shots"
    shots = sorted(p for p in shots_root.iterdir() if p.is_dir()) if shots_root.exists() else []
    if len(shots) < 4:
        errors.append(f"{episode}: shot count={len(shots)}")

    for shot in shots:
        meta_path = shot / "metadata.json"
        if not meta_path.exists():
            errors.append(f"{shot}: missing metadata.json")
            continue
        meta = load_json(meta_path)
        if meta.get("duration_seconds", 0) > 15:
            errors.append(f"{shot}: duration >15")
        if meta.get("visual_status") not in APPROVED_VISUAL_STATUSES:
            errors.append(f"{shot}: visual_status={meta.get('visual_status')}")
        provenance = meta.get("frame_provenance") or {}
        temporal_provenance = meta.get("temporal_frame_provenance") or {}
        timing_repair = meta.get("timing_frame_repair") or {}
        if "source_image" not in provenance and "frame_sources" not in temporal_provenance and "frame_sources" not in timing_repair:
            errors.append(f"{shot}: missing imagegen source provenance")
        for frame in FRAME_NAMES:
            if not (shot / frame).exists():
                errors.append(f"{shot}: missing {frame}")
        prompt = (shot / "prompt.md").read_text(encoding="utf-8") if (shot / "prompt.md").exists() else ""
        negative = (shot / "negative_prompt.md").read_text(encoding="utf-8") if (shot / "negative_prompt.md").exists() else ""
        if "Dialogue / Vocal Lines:" not in prompt:
            errors.append(f"{shot}: prompt missing Dialogue / Vocal Lines")
        if not re.search(r'^- [^:\n]+: ".+"', prompt, re.M):
            errors.append(f"{shot}: prompt has no executable quoted dialogue lines")
        if BAD_TOKENS.search(prompt) or BAD_TOKENS.search(negative):
            errors.append(f"{shot}: unresolved placeholder token")
        if "no subtitles" not in prompt.lower() or "no captions" not in prompt.lower():
            errors.append(f"{shot}: prompt missing no-subtitle/no-caption instruction")

    return errors


def main() -> int:
    errors: list[str] = []
    for episode in EPISODES:
        errors.extend(check_episode(episode))
    result = {"episodes": len(EPISODES), "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
