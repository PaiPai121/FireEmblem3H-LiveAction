#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PACKAGE_DIR = ROOT / "delivery/scene09_v3_monitor_handoff_package_2026-07-27"
MANIFEST_PATH = PACKAGE_DIR / "package_manifest.json"
OUT_DIR = ROOT / "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27"


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def contain(path: Path, size: tuple[int, int]) -> Image.Image:
    if not path.exists():
        img = Image.new("RGB", size, "#371717")
        draw = ImageDraw.Draw(img)
        draw.rectangle((0, 0, size[0] - 1, size[1] - 1), outline="#ff6565", width=3)
        draw.text((24, size[1] // 2 - 12), "MISSING", fill="#ffd0d0", font=load_font(24, True))
        return img
    with Image.open(path) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        thumb = ImageOps.contain(source, size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, "#0e1116")
    canvas.paste(thumb, ((size[0] - thumb.width) // 2, (size[1] - thumb.height) // 2))
    return canvas


def safe(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[: limit - 1] + "..."


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text())
    shots = [shot for shot in manifest["shots"] if shot["status"] == "monitor_required"]
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    per_sheet = 10
    thumb_size = (360, 203)
    label_h = 58
    row_h = thumb_size[1] + label_h + 22
    margin = 28
    gutter = 12
    cols = 3
    sheet_w = margin * 2 + cols * thumb_size[0] + (cols - 1) * gutter
    header_h = 96

    title_font = load_font(28, True)
    shot_font = load_font(18, True)
    small_font = load_font(13)
    tiny_font = load_font(11)

    outputs: list[str] = []
    for batch_index in range(math.ceil(len(shots) / per_sheet)):
        batch = shots[batch_index * per_sheet : (batch_index + 1) * per_sheet]
        sheet_h = header_h + margin + len(batch) * row_h + margin
        sheet = Image.new("RGB", (sheet_w, sheet_h), "#0b0f14")
        draw = ImageDraw.Draw(sheet)
        draw.text((margin, 22), f"EP02 Scene09 V3 monitor-only contact sheet {batch_index + 1}", fill="#f2f4f8", font=title_font)
        draw.text(
            (margin, 58),
            "Each row is one shot: START / KEY / END. Use for triage only; inspect full-size frames before promotion.",
            fill="#aeb7c5",
            font=small_font,
        )

        for row_index, shot in enumerate(batch):
            y = header_h + margin + row_index * row_h
            draw.text(
                (margin, y - 20),
                f"{shot['order']:02d} {shot['shot']}  visible: {safe(', '.join(shot.get('visible_named_only', [])), 96)}",
                fill="#f6f8fb",
                font=shot_font,
            )
            for col_index, (kind, field) in enumerate(
                [("START", "start_frame"), ("KEY", "key_frame"), ("END", "end_frame")]
            ):
                x = margin + col_index * (thumb_size[0] + gutter)
                package_frame = PACKAGE_DIR / shot["package_dir"] / f"{field}.png"
                frame = contain(package_frame, thumb_size)
                sheet.paste(frame, (x, y))
                draw.rectangle((x, y, x + thumb_size[0] - 1, y + thumb_size[1] - 1), outline="#2f3948", width=1)
                draw.rectangle((x, y, x + 58, y + 20), fill="#0b0f14")
                draw.text((x + 6, y + 4), kind, fill="#ffffff", font=tiny_font)
                draw.text(
                    (x + 6, y + thumb_size[1] + 5),
                    safe(str(package_frame.relative_to(ROOT)), 55),
                    fill="#aeb7c5",
                    font=tiny_font,
                )

        out = OUT_DIR / f"monitor_contact_sheet_part{batch_index + 1}.png"
        sheet.save(out, "PNG", optimize=True)
        outputs.append(str(out.relative_to(ROOT)))

    index = {
        "source_manifest": str(MANIFEST_PATH.relative_to(ROOT)),
        "source_package": str(PACKAGE_DIR.relative_to(ROOT)),
        "frame_source_policy": "package-local start_frame.png/key_frame.png/end_frame.png are rendered, not upstream source candidates",
        "monitor_shots": len(shots),
        "outputs": outputs,
    }
    (OUT_DIR / "index.json").write_text(json.dumps(index, indent=2) + "\n")
    print(json.dumps(index, indent=2))


if __name__ == "__main__":
    main()
