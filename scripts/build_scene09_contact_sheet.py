#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
QUEUE_PATH = ROOT / "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json"
QA_PATH = ROOT / "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/qa_manifest.json"
ANIMATIC_PATH = ROOT / "episodes/EP02/scene09_animatic_timing_plan_2026-07-19.json"
OUT_PATH = ROOT / "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/scene09_start_key_contact_sheet_2026-07-19.png"


def scene09_shot(shot: str) -> bool:
    return re.match(r"^Shot0?(25|26|27|28|29|30|31|32|33|34|35|36)[A-Z]?$", shot) is not None


def fallback_order(shot: str) -> tuple[float, str]:
    match = re.match(r"^Shot(\d+)([A-Z])?$", shot)
    if not match:
        return (999.0, shot)
    base = int(match.group(1))
    suffix = match.group(2)
    suffix_value = 0 if not suffix else (ord(suffix) - 64) / 10
    return (base + suffix_value, shot)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def fit_text(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[: max(0, limit - 1)] + "..."


def thumb(path: Path, size: tuple[int, int]) -> Image.Image:
    if not path.exists():
        img = Image.new("RGB", size, "#2b1416")
        draw = ImageDraw.Draw(img)
        draw.rectangle((0, 0, size[0] - 1, size[1] - 1), outline="#d74b4b", width=2)
        draw.text((16, size[1] // 2 - 8), "MISSING", fill="#ffd5d5", font=load_font(18, True))
        return img
    with Image.open(path) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        contained = ImageOps.contain(source, size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, "#101214")
    x = (size[0] - contained.width) // 2
    y = (size[1] - contained.height) // 2
    canvas.paste(contained, (x, y))
    return canvas


def main() -> None:
    queue = json.loads(QUEUE_PATH.read_text())
    qa = json.loads(QA_PATH.read_text()).get("shots", {})
    by_shot = {item["shot"]: item for item in queue if scene09_shot(item["shot"])}

    ordered_shots: list[str]
    if ANIMATIC_PATH.exists():
        animatic = json.loads(ANIMATIC_PATH.read_text())
        ordered_shots = [row["shot"] for row in animatic.get("rows", []) if row.get("shot") in by_shot]
        extras = sorted([shot for shot in by_shot if shot not in set(ordered_shots)], key=fallback_order)
        ordered_shots.extend(extras)
    else:
        ordered_shots = sorted(by_shot, key=fallback_order)

    rows = [by_shot[shot] for shot in ordered_shots]

    card_w = 470
    card_h = 176
    cols = 4
    margin = 28
    gutter = 12
    header_h = 92
    thumb_size = (222, 125)
    sheet_w = margin * 2 + cols * card_w + (cols - 1) * gutter
    sheet_h = header_h + margin + math.ceil(len(rows) / cols) * (card_h + gutter) + margin

    sheet = Image.new("RGB", (sheet_w, sheet_h), "#0d1014")
    draw = ImageDraw.Draw(sheet)
    title_font = load_font(30, True)
    label_font = load_font(18, True)
    small_font = load_font(14)
    tiny_font = load_font(12)

    draw.text((margin, 24), "EP02 Scene09 Mock Battle - Current Start/Key Contact Sheet", fill="#f2f4f8", font=title_font)
    draw.text(
        (margin, 60),
        "Generated from current official PNGs; use this for local visual review before video generation.",
        fill="#aab2c0",
        font=small_font,
    )

    for index, item in enumerate(rows):
        row = index // cols
        col = index % cols
        x = margin + col * (card_w + gutter)
        y = header_h + margin + row * (card_h + gutter)
        shot = item["shot"]
        shot_qa = qa.get(shot, {})
        status = shot_qa.get("status", item.get("status", ""))
        border = "#3f8cff" if "pass" in status else "#9b6a2d"

        draw.rounded_rectangle((x, y, x + card_w, y + card_h), radius=6, fill="#171b22", outline=border, width=2)
        draw.text((x + 12, y + 10), f"{shot}  {fit_text(item.get('title', ''), 32)}", fill="#f7f8fb", font=label_font)
        draw.text((x + 12, y + 34), f"QA: {status or 'unknown'}", fill="#aab2c0", font=tiny_font)

        start_path = ROOT / item["output_start_frame"]
        key_path = ROOT / item["output_keyframe"]
        start = thumb(start_path, thumb_size)
        key = thumb(key_path, thumb_size)
        sx, sy = x + 12, y + 48
        kx, ky = x + 236, y + 48
        sheet.paste(start, (sx, sy))
        sheet.paste(key, (kx, ky))
        draw.rectangle((sx, sy, sx + thumb_size[0] - 1, sy + thumb_size[1] - 1), outline="#303846")
        draw.rectangle((kx, ky, kx + thumb_size[0] - 1, ky + thumb_size[1] - 1), outline="#303846")
        draw.text((sx + 6, sy + 6), "START", fill="#ffffff", font=tiny_font)
        draw.text((kx + 6, ky + 6), "KEY", fill="#ffffff", font=tiny_font)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT_PATH, "PNG", optimize=True)
    print(OUT_PATH.relative_to(ROOT))
    print(f"shots={len(rows)} size={sheet_w}x{sheet_h}")


if __name__ == "__main__":
    main()
