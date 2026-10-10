#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path("episodes/EP03/production_system/reviews/shot017_identity_locked_probe_2026-08-01.jpg")

ITEMS = [
    ("Ashe selected.png", Path("assets/characters/blue_lions/Ashe/academy/selected.png")),
    ("Byleth selected.png", Path("assets/characters/protagonist/Byleth/professor/selected.png")),
    ("local proof sheet", Path("episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/Shot017_local_asset_previs_proof_2026-07-31.jpg")),
    ("old blocked imagegen key", Path("episodes/EP03/storyboards/Shot017/key_frame_imagegen_candidate_2026-07-29.png")),
    ("new identity-locked probe", Path("episodes/EP03/storyboards/Shot017/key_frame_identity_locked_probe_2026-08-01.png")),
]


def fit(path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (18, 18, 18))
    x = (size[0] - image.width) // 2
    y = (size[1] - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()
    cell = (390, 230)
    gutter = 12
    width = 2 * cell[0] + 3 * gutter
    height = 3 * cell[1] + 4 * gutter + 64
    sheet = Image.new("RGB", (width, height), (8, 8, 8))
    draw = ImageDraw.Draw(sheet)
    draw.text((gutter, 10), "Shot017 identity-locked probe review / 2026-08-01", fill=(245, 245, 245), font=font)
    draw.text((gutter, 30), "Compare local selected.png references against old blocked imagegen and new probe.", fill=(205, 205, 205), font=font)

    for index, (label, path) in enumerate(ITEMS):
        row = index // 2
        col = index % 2
        x = gutter + col * (cell[0] + gutter)
        y = 64 + row * (cell[1] + gutter)
        sheet.paste(fit(path, cell), (x, y))
        draw.rectangle((x, y, x + cell[0], y + 26), fill=(0, 0, 0))
        draw.text((x + 8, y + 7), label, fill=(240, 240, 240), font=font)

    sheet.save(OUT, quality=92)
    print(OUT)


if __name__ == "__main__":
    main()
