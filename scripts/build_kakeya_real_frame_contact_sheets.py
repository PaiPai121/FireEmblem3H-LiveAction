#!/usr/bin/env python3
from pathlib import Path
import json
import math

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "specials" / "kakeya_byleth_lecture"
REAL = PROJECT / "real_frames"
MANIFEST = PROJECT / "frame_generation_manifest.json"
OUT_DIR = PROJECT / "production_system" / "reviews" / "real_frame_contact_sheets_2026-07-28"


def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def fit_text(draw, text, max_width, base_font, fill, xy):
    words = str(text).replace("_", " ").split()
    lines = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textbbox((0, 0), trial, font=base_font)[2] <= max_width or not current:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    x, y = xy
    for line in lines[:3]:
        draw.text((x, y), line, font=base_font, fill=fill)
        y += base_font.size + 4


def thumb(path, size):
    img = Image.open(path).convert("RGB")
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text())
    shots = manifest["shots"]

    title_font = font(28, bold=True)
    meta_font = font(14)
    label_font = font(16, bold=True)
    small_font = font(12)

    frame_size = (300, 169)
    left_w = 120
    gap = 12
    margin = 24
    header_h = 76
    row_h = frame_size[1] + 64
    per_sheet = 9
    sheet_paths = []

    for batch_index in range(math.ceil(len(shots) / per_sheet)):
        batch = shots[batch_index * per_sheet : (batch_index + 1) * per_sheet]
        sheet_w = margin * 2 + left_w + gap + frame_size[0] * 3 + gap * 2
        sheet_h = header_h + margin + row_h * len(batch) + margin
        sheet = Image.new("RGB", (sheet_w, sheet_h), "#0e1218")
        draw = ImageDraw.Draw(sheet)
        draw.text((margin, 20), f"Kakeya Byleth real frame audit sheet {batch_index + 1}", font=title_font, fill="#f4f7fb")
        draw.text((margin, 52), "Each row is one shot: start / key / end. These are real_frames, not storyboard layout PNGs.", font=meta_font, fill="#aeb8c6")

        for row_index, shot in enumerate(batch):
            y = header_h + margin + row_index * row_h
            x = margin
            draw.rounded_rectangle((x, y, x + left_w - 8, y + frame_size[1]), radius=6, fill="#171d26", outline="#2c3542")
            draw.text((x + 12, y + 12), shot["id"], font=label_font, fill="#f4f7fb")
            draw.text((x + 12, y + 40), shot["review_status"], font=small_font, fill="#ffcc66")
            fit_text(draw, shot["source"], left_w - 24, small_font, "#aeb8c6", (x + 12, y + 64))

            for col, frame in enumerate(["start", "key", "end"]):
                frame_path = REAL / shot["id"] / f"{frame}.png"
                fx = margin + left_w + gap + col * (frame_size[0] + gap)
                draw.rounded_rectangle((fx - 2, y - 2, fx + frame_size[0] + 2, y + frame_size[1] + 2), radius=5, fill="#242c38")
                sheet.paste(thumb(frame_path, frame_size), (fx, y))
                draw.text((fx, y + frame_size[1] + 8), frame, font=label_font, fill="#f4f7fb")
                rel = frame_path.relative_to(PROJECT)
                draw.text((fx, y + frame_size[1] + 30), str(rel), font=small_font, fill="#aeb8c6")

        out = OUT_DIR / f"kakeya_real_frames_contact_sheet_{batch_index + 1:02d}.jpg"
        sheet.save(out, "JPEG", quality=92, optimize=True)
        sheet_paths.append(str(out.relative_to(PROJECT)))

    summary = {
        "project_id": "KAK-BYLETH-LECTURE",
        "created_at": "2026-07-31",
        "legacy_directory_date": "2026-07-28",
        "source_manifest": str(MANIFEST.relative_to(PROJECT)),
        "sheets": sheet_paths,
        "shot_count": len(shots),
        "frame_count": len(shots) * 3,
        "purpose": "Human visual QA contact sheets for real start/key/end frames.",
    }
    (OUT_DIR / "contact_sheet_manifest.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
