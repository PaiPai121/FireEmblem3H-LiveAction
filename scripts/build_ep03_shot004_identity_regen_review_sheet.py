#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path("episodes/EP03/production_system/reviews/shot004_identity_locked_regen_review_2026-08-01.jpg")

ITEMS = [
    ("Ashe identity plate", Path("episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg")),
    ("Byleth selected.png", Path("assets/characters/protagonist/Byleth/professor/selected.png")),
    ("Dimitri selected.png", Path("assets/characters/blue_lions/Dimitri/academy/selected.png")),
    ("Shot004 local proof", Path("episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot004_local_asset_previs_proof_2026-07-31.jpg")),
    ("regen start candidate", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/start_frame_identity_locked_regen_2026-08-01.png")),
    ("regen key candidate", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/key_frame_identity_locked_regen_2026-08-01.png")),
    ("regen end candidate", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/end_frame_identity_locked_regen_2026-08-01.png")),
]


def fit(image_path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(image_path).convert("RGB")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (18, 18, 18))
    x = (size[0] - image.width) // 2
    y = (size[1] - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()
    cell = (420, 236)
    gutter = 12
    cols = 2
    rows = 4
    width = cols * cell[0] + (cols + 1) * gutter
    height = rows * cell[1] + (rows + 1) * gutter + 72
    sheet = Image.new("RGB", (width, height), (8, 8, 8))
    draw = ImageDraw.Draw(sheet)
    draw.text((gutter, 12), "Shot004 identity-locked regeneration review / 2026-08-01", fill=(245, 245, 245), font=font)
    draw.text(
        (gutter, 34),
        "Top/local references and proof are identity truth; regen frames are candidates only and remain blocked pending revision.",
        fill=(205, 205, 205),
        font=font,
    )

    for index, (label, image_path) in enumerate(ITEMS):
        row = index // cols
        col = index % cols
        x = gutter + col * (cell[0] + gutter)
        y = 72 + gutter + row * (cell[1] + gutter)
        sheet.paste(fit(image_path, cell), (x, y))
        draw.rectangle((x, y, x + cell[0], y + 26), fill=(0, 0, 0))
        draw.text((x + 8, y + 7), label, fill=(240, 240, 240), font=font)

    sheet.save(OUT, quality=92)
    print(OUT)


if __name__ == "__main__":
    main()
