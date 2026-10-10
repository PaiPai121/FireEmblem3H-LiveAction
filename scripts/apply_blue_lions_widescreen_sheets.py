#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps, ImageStat


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"


def ensure(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def split_sheet(sheet_path: Path, shot_dir: Path) -> list[float]:
    img = Image.open(sheet_path).convert("RGB")
    w, h = img.size
    frames = []
    for idx, name in enumerate(["start_frame.png", "key_frame.png", "end_frame.png"]):
        top = round(h * idx / 3)
        bottom = round(h * (idx + 1) / 3)
        panel = img.crop((0, top, w, bottom))
        frame = ImageOps.fit(panel, (1280, 720), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        frame.save(shot_dir / name, quality=94)
        frames.append(frame.resize((160, 90), Image.Resampling.LANCZOS))
    diffs = []
    for a, b in [(0, 1), (1, 2), (0, 2)]:
        diff = ImageChops.difference(frames[a], frames[b])
        diffs.append(round(sum(ImageStat.Stat(diff).mean) / 3, 2))
    return diffs


def build_contact_sheet(package_dir: Path) -> None:
    cells = []
    labels = []
    for shot_dir in sorted((package_dir / "shots").iterdir()):
        if not shot_dir.is_dir():
            continue
        for frame in ["start_frame.png", "key_frame.png", "end_frame.png"]:
            path = shot_dir / frame
            thumb = ImageOps.fit(Image.open(path).convert("RGB"), (320, 180), Image.Resampling.LANCZOS)
            cells.append(thumb)
            labels.append(f"{shot_dir.name} {frame}")
    cols = 3
    rows = math.ceil(len(cells) / cols)
    label_h = 36
    sheet = Image.new("RGB", (cols * 320, rows * (180 + label_h)), (20, 28, 38))
    draw = ImageDraw.Draw(sheet)
    for idx, cell in enumerate(cells):
        x = (idx % cols) * 320
        y = (idx // cols) * (180 + label_h)
        sheet.paste(cell, (x, y))
        draw.rectangle((x, y + 180, x + 320, y + 180 + label_h), fill=(16, 21, 29))
        draw.text((x + 8, y + 189), labels[idx], fill=(235, 240, 248))
    sheet.save(package_dir / "visual_contact_sheet.jpg", quality=92)


def update_metadata(shot_dir: Path, diffs: list[float]) -> None:
    meta_path = shot_dir / "metadata.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["visual_status"] = "widescreen_sheet_frames_applied"
    meta["frame_source"] = "raw_widescreen_sheet.png generated as three stacked horizontal widescreen frames"
    meta["anchor_mean_abs_diff"] = {
        "start_key": diffs[0],
        "key_end": diffs[1],
        "start_end": diffs[2],
    }
    meta["no_artificial_side_fill"] = True
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sync_storyboards(package_dir: Path, shot_dir: Path) -> None:
    episode_slug = package_dir.parents[1].name
    shot_id = shot_dir.name.split("_", 1)[1]
    for storyboard in [SERIES / episode_slug / "storyboards" / shot_id, SERIES / "storyboards" / shot_id]:
        ensure(storyboard)
        for name in ["start_frame.png", "key_frame.png", "end_frame.png", "metadata.json"]:
            src = shot_dir / name
            if src.exists():
                (storyboard / name).write_bytes(src.read_bytes())


def main() -> None:
    changed = []
    for package_dir in sorted(SERIES.glob("EP*/delivery/*_timing_safe_v2")):
        package_changed = False
        for shot_dir in sorted((package_dir / "shots").iterdir()):
            if not shot_dir.is_dir():
                continue
            sheet = shot_dir / "raw_widescreen_sheet.png"
            if not sheet.exists():
                continue
            diffs = split_sheet(sheet, shot_dir)
            update_metadata(shot_dir, diffs)
            sync_storyboards(package_dir, shot_dir)
            package_changed = True
            changed.append({"shot": shot_dir.name, "diffs": diffs})
        if package_changed:
            build_contact_sheet(package_dir)
    print(json.dumps({"changed": changed}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
