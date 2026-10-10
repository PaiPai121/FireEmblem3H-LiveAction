#!/usr/bin/env python3
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "specials" / "kakeya_byleth_lecture"
CANDIDATES = PROJECT / "regenerated_frame_candidates"
FONT = "/System/Library/Fonts/STHeiti Medium.ttc"

SH010_BASE = Path("/Users/zekun/.codex/generated_images/019f9f12-75d8-7672-8e23-d4dfe6068244/call_BKDxa7bjVgRaPPyGM8EOtQV4.png")
SH032_BASE = Path("/Users/zekun/.codex/generated_images/019f9f12-75d8-7672-8e23-d4dfe6068244/call_gcy5ny6Vh9Z0FFTwIXnfj2z9.png")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def chalk_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    size: int,
    fill: tuple[int, int, int, int] = (238, 238, 226, 232),
) -> None:
    x, y = xy
    f = font(size)
    for dx, dy, alpha in [(-2, 1, 54), (2, 2, 42), (0, -2, 36), (1, -1, 28)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 245, alpha))
    draw.text((x, y), text, font=f, fill=fill)


def chalk_line(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[float, float]] | tuple[float, float, float, float],
    fill: tuple[int, int, int, int],
    width: int,
) -> None:
    for jitter, alpha in [(2, 38), (-2, 30), (0, fill[3])]:
        if isinstance(points, tuple):
            x1, y1, x2, y2 = points
            draw.line((x1, y1 + jitter, x2, y2 - jitter), fill=(fill[0], fill[1], fill[2], alpha), width=width)
        else:
            shifted = [(x, y + jitter) for x, y in points]
            draw.line(shifted, fill=(fill[0], fill[1], fill[2], alpha), width=width, joint="curve")


def deltoid_points(cx: float, cy: float, scale: float, rotation: float = -math.pi / 2) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    for i in range(480):
        t = 2 * math.pi * i / 480
        x = 2 * math.cos(t) + math.cos(2 * t)
        y = -(2 * math.sin(t) - math.sin(2 * t))
        xr = x * math.cos(rotation) - y * math.sin(rotation)
        yr = x * math.sin(rotation) + y * math.cos(rotation)
        pts.append((cx + scale * xr, cy + scale * yr))
    return pts


def save_with_overlay(base_path: Path, out_path: Path, painter) -> None:
    img = Image.open(base_path).convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    painter(ImageDraw.Draw(layer))
    merged = Image.alpha_composite(img, layer.filter(ImageFilter.GaussianBlur(0.05))).convert("RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    merged.save(out_path, quality=95)


def build_sh010() -> None:
    out = CANDIDATES / "SH010_identity_v3"
    pts = deltoid_points(835, 360, 88)

    def start(draw: ImageDraw.ImageDraw) -> None:
        chalk_text(draw, (560, 170), "三尖线候选", 62)
        chalk_line(draw, pts + [pts[0]], (245, 245, 232, 222), 5)
        chalk_line(draw, (710, 470, 965, 392), (215, 66, 76, 220), 8)

    def key(draw: ImageDraw.ImageDraw) -> None:
        start(draw)
        chalk_text(draw, (1035, 250), "A = π/8", 58)
        chalk_text(draw, (1038, 328), "面积很小", 42, (245, 218, 128, 226))

    def end(draw: ImageDraw.ImageDraw) -> None:
        key(draw)
        chalk_text(draw, (640, 585), "但还没证明“最小”", 52, (245, 218, 128, 232))

    for name, painter in [("start", start), ("key", key), ("end", end)]:
        save_with_overlay(SH010_BASE, out / f"{name}.png", painter)


def build_sh032() -> None:
    out = CANDIDATES / "SH032_identity_v2"

    def start(draw: ImageDraw.ImageDraw) -> None:
        chalk_text(draw, (760, 195), "最后，把问题叫出名字", 58, (238, 238, 226, 190))

    def key(draw: ImageDraw.ImageDraw) -> None:
        chalk_text(draw, (780, 215), "挂谷针", 96)
        chalk_line(draw, (785, 340, 1125, 340), (245, 218, 128, 210), 5)

    def end(draw: ImageDraw.ImageDraw) -> None:
        chalk_text(draw, (720, 205), "挂谷针问题", 100)
        chalk_line(draw, (725, 345, 1270, 345), (245, 218, 128, 220), 6)
        chalk_text(draw, (850, 385), "也叫贝西科维奇集问题", 42, (238, 238, 226, 185))

    for name, painter in [("start", start), ("key", key), ("end", end)]:
        save_with_overlay(SH032_BASE, out / f"{name}.png", painter)


def main() -> None:
    build_sh010()
    build_sh032()
    print("built clean-board identity candidates: SH010_identity_v3, SH032_identity_v2")


if __name__ == "__main__":
    main()
