#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(".")
EP_ROOT = ROOT / "episodes" / "EP03"
OUT_DIR = EP_ROOT / "production_system" / "reviews" / "local_asset_previs_proof_2026-07-31"


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


def draw_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], width: int, text: str, font: ImageFont.ImageFont) -> None:
    x, y = xy
    draw.rectangle((x, y, x + width, y + 26), fill=(0, 0, 0))
    draw.text((x + 8, y + 6), text[:70], fill=(235, 235, 235), font=font)


def asset_refs(metadata: dict) -> list[Path]:
    refs: list[Path] = []
    for ref in metadata.get("asset_references", []):
        path = ROOT / ref
        if path.exists() and path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
            refs.append(path)
    return refs


def local_frames(shot_id: str) -> list[Path]:
    folder = EP_ROOT / "storyboards" / shot_id
    return [folder / f"{role}_frame.png" for role in ("start", "key", "end")]


def build_sheet(shot_id: str) -> Path | None:
    metadata_path = EP_ROOT / "storyboards" / shot_id / "metadata.json"
    if not metadata_path.exists():
        return None
    metadata = load_json(metadata_path)
    refs = asset_refs(metadata)
    frames = local_frames(shot_id)
    if not refs or not all(frame.exists() for frame in frames):
        return None

    ref_cell = (260, 190)
    frame_cell = (360, 202)
    gutter = 12
    ref_cols = min(max(len(refs), 3), 5)
    ref_rows = math.ceil(len(refs) / ref_cols)
    width = max(ref_cols * ref_cell[0] + (ref_cols + 1) * gutter, 3 * frame_cell[0] + 4 * gutter)
    height = 62 + ref_rows * (ref_cell[1] + gutter) + frame_cell[1] + 3 * gutter
    sheet = Image.new("RGB", (width, height), (10, 10, 10))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    draw.text(
        (gutter, 10),
        f"{shot_id} local asset proof sheet / primary frames are selected.png composited previs",
        fill=(245, 245, 245),
        font=font,
    )
    draw.text(
        (gutter, 30),
        "Top: local asset references. Bottom: local start/key/end previs frames currently used by EP03 web and package.",
        fill=(200, 200, 200),
        font=font,
    )

    y = 58
    for index, ref in enumerate(refs):
        col = index % ref_cols
        row = index // ref_cols
        x = gutter + col * (ref_cell[0] + gutter)
        y_ref = y + row * (ref_cell[1] + gutter)
        sheet.paste(fit_image(ref, ref_cell), (x, y_ref))
        label = "/".join(ref.parts[-6:])
        draw_label(draw, (x, y_ref), ref_cell[0], label, font)

    y_frames = y + ref_rows * (ref_cell[1] + gutter) + gutter
    for index, frame in enumerate(frames):
        x = gutter + index * (frame_cell[0] + gutter)
        sheet.paste(fit_image(frame, frame_cell), (x, y_frames))
        draw_label(draw, (x, y_frames), frame_cell[0], frame.name, font)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{shot_id}_local_asset_previs_proof_2026-07-31.jpg"
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
    print(f"built {len(outputs)} EP03 local asset previs proof sheets")


if __name__ == "__main__":
    main()
