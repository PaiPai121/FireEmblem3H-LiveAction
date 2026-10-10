#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


EP_ROOT = Path("episodes/EP03")
OUT = EP_ROOT / "production_system/reviews/shot004_local_source_locked_regen_v2_review_2026-08-01.jpg"

ITEMS = [
    (
        "local source exact / corrected 00:03:40",
        EP_ROOT / "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot004/local_video_exact.jpg",
    ),
    (
        "local source evidence board",
        EP_ROOT / "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot004/Shot004_local_video_source_evidence_2026-08-01.jpg",
    ),
    (
        "Ashe identity plate",
        EP_ROOT / "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg",
    ),
    (
        "Byleth identity plate",
        EP_ROOT / "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
    ),
    (
        "Dimitri identity plate",
        EP_ROOT / "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg",
    ),
    (
        "current local selected.png previs",
        EP_ROOT / "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot004_local_asset_previs_proof_2026-07-31.jpg",
    ),
    (
        "v2 start candidate",
        EP_ROOT / "storyboards/Shot004/local_source_locked_regen_v2_2026-08-01/start_frame_local_source_locked_regen_v2_2026-08-01.png",
    ),
    (
        "v2 key candidate",
        EP_ROOT / "storyboards/Shot004/local_source_locked_regen_v2_2026-08-01/key_frame_local_source_locked_regen_v2_2026-08-01.png",
    ),
    (
        "v2 end candidate",
        EP_ROOT / "storyboards/Shot004/local_source_locked_regen_v2_2026-08-01/end_frame_local_source_locked_regen_v2_2026-08-01.png",
    ),
]


def load_font(size: int) -> ImageFont.ImageFont:
    for font_path in (
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/PingFang.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
    ):
        if Path(font_path).exists():
            return ImageFont.truetype(font_path, size)
    return ImageFont.load_default()


def fit(image_path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(image_path).convert("RGB")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (18, 18, 18))
    x = (size[0] - image.width) // 2
    y = (size[1] - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def main() -> None:
    missing = [str(path) for _, path in ITEMS if not path.exists()]
    if missing:
        raise SystemExit("missing review inputs:\n" + "\n".join(missing))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    title_font = load_font(24)
    body_font = load_font(16)
    label_font = load_font(15)
    cell = (520, 292)
    gutter = 14
    cols = 3
    rows = 3
    header_h = 104
    width = cols * cell[0] + (cols + 1) * gutter
    height = header_h + rows * cell[1] + (rows + 1) * gutter
    sheet = Image.new("RGB", (width, height), (8, 8, 8))
    draw = ImageDraw.Draw(sheet)
    draw.text((gutter, 14), "Shot004 local-source-locked regeneration v2 review / 2026-08-01", fill=(245, 245, 245), font=title_font)
    draw.text(
        (gutter, 52),
        "Audit basis: corrected local source frame at 00:03:40 + local selected.png identity plates. Generated frames remain candidates until QA gates pass.",
        fill=(205, 205, 205),
        font=body_font,
    )
    draw.text(
        (gutter, 76),
        "Blocking policy: visual pass here is still-frame only; it does not mean video_generation_package or approved_for_video.",
        fill=(238, 201, 116),
        font=body_font,
    )

    for index, (label, image_path) in enumerate(ITEMS):
        row = index // cols
        col = index % cols
        x = gutter + col * (cell[0] + gutter)
        y = header_h + gutter + row * (cell[1] + gutter)
        sheet.paste(fit(image_path, cell), (x, y))
        draw.rectangle((x, y, x + cell[0], y + 28), fill=(0, 0, 0))
        draw.text((x + 8, y + 7), label, fill=(240, 240, 240), font=label_font)

    sheet.save(OUT, quality=92)
    print(OUT)


if __name__ == "__main__":
    main()
