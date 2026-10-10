#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


EP_ROOT = Path("episodes/EP03")
OUT_DIR = EP_ROOT / "production_system" / "reviews" / "identity_lock_comparison_2026-07-31"
CANDIDATE_SUFFIX = "imagegen_candidate_2026-07-29"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def fit_image(path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (18, 18, 18))
    x = (size[0] - image.width) // 2
    y = (size[1] - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def draw_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.ImageFont) -> None:
    x, y = xy
    draw.rectangle((x, y, x + 360, y + 26), fill=(0, 0, 0))
    draw.text((x + 8, y + 6), text[:54], fill=(235, 235, 235), font=font)


def has_candidates(shot_id: str) -> bool:
    folder = EP_ROOT / "storyboards" / shot_id
    return all(
        (folder / f"{role}_frame_{CANDIDATE_SUFFIX}.png").exists()
        for role in ("start", "key", "end")
    )


def character_refs(metadata: dict) -> list[Path]:
    refs = []
    for ref in metadata.get("asset_references", []):
        if "/characters/" in ref and ref.endswith(".png"):
            path = Path(ref)
            if path.exists():
                refs.append(path)
    return refs


def build_sheet(shot_id: str) -> Path | None:
    metadata_path = EP_ROOT / "storyboards" / shot_id / "metadata.json"
    if not metadata_path.exists() or not has_candidates(shot_id):
        return None

    metadata = load_json(metadata_path)
    refs = character_refs(metadata)
    if not refs:
        return None

    candidate_paths = [
        EP_ROOT / "storyboards" / shot_id / f"{role}_frame_{CANDIDATE_SUFFIX}.png"
        for role in ("start", "key", "end")
    ]

    cell = (360, 250)
    gutter = 12
    cols = max(len(refs), len(candidate_paths))
    width = cols * cell[0] + (cols + 1) * gutter
    height = 2 * cell[1] + 3 * gutter + 72
    sheet = Image.new("RGB", (width, height), (10, 10, 10))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    draw.text(
        (gutter, 10),
        f"{shot_id} local selected.png identity comparison / current imagegen candidates are blocked_needs_revision",
        fill=(245, 245, 245),
        font=font,
    )
    draw.text(
        (gutter, 30),
        "Top: local character assets. Bottom: generated start/key/end candidates. Use this to reject face, age, hair, and wardrobe drift.",
        fill=(200, 200, 200),
        font=font,
    )

    y_top = 58
    for index, ref in enumerate(refs):
        x = gutter + index * (cell[0] + gutter)
        sheet.paste(fit_image(ref, cell), (x, y_top))
        label = "/".join(ref.parts[-5:])
        draw_label(draw, (x, y_top), label, font)

    y_bottom = y_top + cell[1] + gutter
    for index, candidate in enumerate(candidate_paths):
        x = gutter + index * (cell[0] + gutter)
        sheet.paste(fit_image(candidate, cell), (x, y_bottom))
        draw_label(draw, (x, y_bottom), candidate.name, font)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{shot_id}_identity_comparison_2026-07-31.jpg"
    sheet.save(out_path, quality=92)
    return out_path


def main() -> None:
    queue = load_json(EP_ROOT / "frame_generation_queue.json")
    outputs = []
    for shot in queue.get("shots", []):
        out = build_sheet(shot["id"])
        if out:
            outputs.append(str(out))
    index_path = OUT_DIR / "index.json"
    index_path.write_text(json.dumps({"sheets": outputs}, indent=2) + "\n", encoding="utf-8")
    print(f"built {len(outputs)} EP03 identity comparison sheets")


if __name__ == "__main__":
    main()
