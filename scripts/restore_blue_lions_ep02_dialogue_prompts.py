#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


SERIES = Path("specials/blue_lions_support_comedy")
EPISODE = SERIES / "EP02_annette_mercedes_c"
PACKAGE = EPISODE / "delivery/video_generation_package_2026-08-02_EP02_annette_mercedes_c_timing_safe_v2"


def restore_prompt(prompt_path: Path, metadata_path: Path) -> tuple[str, str]:
    meta = json.loads(metadata_path.read_text(encoding="utf-8"))
    dialogue_lines = [
        f"- {line['speaker']}: {line['text']}"
        for line in meta.get("dialogue", [])
        if line.get("speaker") and line.get("text")
    ]
    if not dialogue_lines:
        raise RuntimeError(f"{metadata_path} has no dialogue lines")

    text = prompt_path.read_text(encoding="utf-8")
    start_marker = "Every spoken line for this clip, in order:"
    end_marker = "Timing:"
    if start_marker not in text or end_marker not in text:
        raise RuntimeError(f"{prompt_path} is missing prompt dialogue markers")

    before = text.split(start_marker, 1)[0]
    after = text.split(end_marker, 1)[1]
    restored = before + start_marker + "\n" + "\n".join(dialogue_lines) + "\n\n" + end_marker + after
    prompt_path.write_text(restored, encoding="utf-8")
    return str(meta["shot_id"]), restored


def main() -> int:
    restored_prompts: list[str] = []
    restored_ids: list[str] = []
    for shot_dir in sorted((PACKAGE / "shots").glob("*")):
        if not shot_dir.is_dir():
            continue
        shot_id, prompt_text = restore_prompt(shot_dir / "prompt.md", shot_dir / "metadata.json")
        restored_ids.append(shot_id)
        restored_prompts.append(prompt_text)
        for target in [
            EPISODE / "storyboards" / shot_id / "prompt.md",
            SERIES / "storyboards" / shot_id / "prompt.md",
        ]:
            if target.exists():
                target.write_text(prompt_text, encoding="utf-8")

    (PACKAGE / "prompt.md").write_text("\n\n".join(restored_prompts), encoding="utf-8")
    print(f"restored prompt dialogue for {len(restored_ids)} EP02 shots")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
