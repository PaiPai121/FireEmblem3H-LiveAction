#!/usr/bin/env python3
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "specials" / "kakeya_byleth_lecture"
CANDIDATES = PROJECT / "regenerated_frame_candidates"
FONT = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def chalk_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, fill=(232, 232, 218, 232)) -> None:
    x, y = xy
    f = font(size)
    for dx, dy, alpha in [(-2, 1, 60), (2, 2, 50), (0, -2, 45)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 245, alpha))
    draw.text((x, y), text, font=f, fill=fill)


def deltoid_points(cx: float, cy: float, scale: float, rotation: float = -math.pi / 2) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    for i in range(420):
        t = 2 * math.pi * i / 420
        # Three-cusped hypocycloid. The negative y keeps screen coordinates upright after rotation.
        x = 2 * math.cos(t) + math.cos(2 * t)
        y = -(2 * math.sin(t) - math.sin(2 * t))
        xr = x * math.cos(rotation) - y * math.sin(rotation)
        yr = x * math.sin(rotation) + y * math.cos(rotation)
        pts.append((cx + scale * xr, cy + scale * yr))
    return pts


def board_patch(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color=(36, 49, 45, 238)) -> None:
    draw.rounded_rectangle(box, radius=10, fill=color)
    # Subtle chalk smudges so the repaired board does not read as a UI rectangle.
    x1, y1, x2, y2 = box
    for i in range(18):
        y = y1 + 18 + i * max(7, (y2 - y1 - 36) // 18)
        draw.line((x1 + 25, y, x2 - 25, y + (i % 3 - 1) * 4), fill=(255, 255, 255, 10), width=2)


def fix_sh010() -> None:
    shot_dir = CANDIDATES / "SH010_identity_v2"
    for frame in ["start", "key", "end"]:
        path = shot_dir / f"{frame}.png"
        img = Image.open(path).convert("RGBA")
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        board_patch(draw, (560, 125, 1210, 520), (35, 51, 46, 228))

        pts = deltoid_points(785, 330, 78)
        for width, alpha in [(8, 42), (5, 96), (3, 235)]:
            draw.line(pts + [pts[0]], fill=(245, 245, 232, alpha), width=width, joint="curve")
        chalk_text(draw, (995, 210), "A = π/8", 50)
        chalk_text(draw, (1012, 292), "候选", 48)

        merged = Image.alpha_composite(img, layer.filter(ImageFilter.GaussianBlur(0.08))).convert("RGB")
        merged.save(path, quality=95)


def clean_board_from_start() -> Image.Image:
    return Image.open(CANDIDATES / "SH032_identity_v1" / "start.png").convert("RGB")


def fix_sh032() -> None:
    shot_dir = CANDIDATES / "SH032_identity_v1"
    clean = clean_board_from_start()
    # Board-only region; avoids covering Byleth or students while replacing model-garbled title areas.
    patch_box = (620, 150, 1420, 365)
    texture = clean.crop(patch_box).filter(ImageFilter.GaussianBlur(0.15))
    for frame in ["key", "end"]:
        path = shot_dir / f"{frame}.png"
        img = Image.open(path).convert("RGBA")
        base = img.convert("RGB")
        base.paste(texture, patch_box)
        img = base.convert("RGBA")
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        chalk_text(draw, (735, 205), "挂谷针问题", 92)
        merged = Image.alpha_composite(img, layer.filter(ImageFilter.GaussianBlur(0.08))).convert("RGB")
        merged.save(path, quality=95)


def main() -> None:
    fix_sh010()
    fix_sh032()
    print("fixed SH010 deltoid board and SH032 title board overlays")


if __name__ == "__main__":
    main()
