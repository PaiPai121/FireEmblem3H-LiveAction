#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path("episodes/EP03/production_system/reviews/shot002_identity_locked_regen_v2_review_2026-08-01.jpg")

ITEMS = [
    ("Byleth identity plate", Path("episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg")),
    ("Shot002 local proof", Path("episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot002_local_asset_previs_proof_2026-07-31.jpg")),
    ("v1 key blocked", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/key_frame_identity_locked_regen_2026-08-01.png")),
    ("v2 start candidate", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/start_frame_identity_locked_regen_v2_2026-08-01.png")),
    ("v2 key candidate", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/key_frame_identity_locked_regen_v2_2026-08-01.png")),
    ("v2 end candidate", Path("episodes/EP03/delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/end_frame_identity_locked_regen_v2_2026-08-01.png")),
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
    cell = (430, 242)
    gutter = 12
    cols = 2
    rows = 3
    width = cols * cell[0] + (cols + 1) * gutter
    height = rows * cell[1] + (rows + 1) * gutter + 74
    sheet = Image.new("RGB", (width, height), (8, 8, 8))
    draw = ImageDraw.Draw(sheet)
    draw.text((gutter, 12), "Shot002 identity-locked regeneration v2 review / 2026-08-01", fill=(245, 245, 245), font=font)
    draw.text(
        (gutter, 34),
        "V2 moves Byleth to a wide silhouette read and clarifies enter/pause/turn frame chain.",
        fill=(205, 205, 205),
        font=font,
    )

    for index, (label, image_path) in enumerate(ITEMS):
        row = index // cols
        col = index % cols
        x = gutter + col * (cell[0] + gutter)
        y = 74 + gutter + row * (cell[1] + gutter)
        sheet.paste(fit(image_path, cell), (x, y))
        draw.rectangle((x, y, x + cell[0], y + 26), fill=(0, 0, 0))
        draw.text((x + 8, y + 7), label, fill=(240, 240, 240), font=font)

    sheet.save(OUT, quality=92)
    print(OUT)


if __name__ == "__main__":
    main()
