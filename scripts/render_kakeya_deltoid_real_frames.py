from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "specials/kakeya_byleth_lecture/real_frames"
BASE = REAL / "_bases"
FONT_CN = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_CN, size)


def deltoid_points(cx: float, cy: float, scale: float, rotation: float = -math.pi / 2) -> list[tuple[float, float]]:
    pts = []
    for i in range(721):
        t = 2 * math.pi * i / 720 + rotation
        x = 2 * math.cos(t) + math.cos(2 * t)
        y = 2 * math.sin(t) - math.sin(2 * t)
        pts.append((cx + scale * x, cy + scale * y))
    return pts


def point_on_deltoid(cx: float, cy: float, scale: float, t: float, rotation: float = -math.pi / 2) -> tuple[float, float]:
    tt = t + rotation
    return (
        cx + scale * (2 * math.cos(tt) + math.cos(2 * tt)),
        cy + scale * (2 * math.sin(tt) - math.sin(2 * tt)),
    )


def draw_polyline(draw: ImageDraw.ImageDraw, pts: list[tuple[float, float]], fill, width: int) -> None:
    draw.line(pts + [pts[0]], fill=fill, width=width, joint="curve")


def chalk_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, fill=(238, 238, 222, 235)) -> None:
    x, y = xy
    f = font(size)
    for dx, dy, alpha in [(-2, 1, 60), (2, 2, 50), (0, -2, 45)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 255, alpha))
    draw.text((x, y), text, font=f, fill=fill)


def composite_overlay(base_path: Path, out_path: Path, overlay_fn) -> None:
    img = Image.open(base_path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    overlay_fn(draw, overlay)
    glow = overlay.filter(ImageFilter.GaussianBlur(0.35))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, overlay)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out_path, quality=95)


def draw_deltoid(draw, cx, cy, scale, fill_alpha=55, outline=(225, 238, 255, 235), width=5):
    pts = deltoid_points(cx, cy, scale)
    draw.polygon(pts, fill=(83, 168, 223, fill_alpha))
    draw_polyline(draw, pts, outline, width)
    for t in [0, 2 * math.pi / 3, 4 * math.pi / 3]:
        x, y = point_on_deltoid(cx, cy, scale, t)
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(235, 245, 255, 235))
    return pts


def draw_chord(draw, cx, cy, angle, length, color=(228, 70, 65, 245), width=8, alpha=245):
    dx = math.cos(angle) * length / 2
    dy = math.sin(angle) * length / 2
    p1 = (cx - dx, cy - dy)
    p2 = (cx + dx, cy + dy)
    draw.line((p1, p2), fill=color[:3] + (alpha,), width=width)
    for x, y in [p1, p2]:
        draw.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(255, 120, 110, alpha))
    return p1, p2


def sh006() -> None:
    base = BASE / "SH006_blank_board.png"
    cx, cy, scale = 1030, 450, 105

    def start(draw, overlay):
        draw.ellipse((cx - 185, cy - 185, cx + 185, cy + 185), outline=(130, 215, 160, 130), width=4)
        draw.ellipse((cx - 60, cy - 60, cx + 60, cy + 60), outline=(130, 215, 160, 180), width=5)
        draw.line((cx, cy - 185, cx, cy + 185), fill=(130, 215, 160, 90), width=3)
        draw.arc((cx - 185, cy - 185, cx + 185, cy + 185), 300, 360, fill=(130, 215, 160, 210), width=7)
        chalk_text(draw, (cx - 125, cy + 215), "滚动轨迹提示", 34, (200, 235, 205, 220))

    def key(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=75, width=6)

    def end(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=60, width=5)
        chalk_text(draw, (cx + 230, cy - 60), "候选区域", 52)
        draw.rounded_rectangle((cx + 220, cy - 75, cx + 515, cy + 20), radius=18, outline=(236, 236, 220, 210), width=4)

    composite_overlay(base, REAL / "SH006/start.png", start)
    composite_overlay(base, REAL / "SH006/key.png", key)
    composite_overlay(base, REAL / "SH006/end.png", end)


def sh007() -> None:
    base = BASE / "SH007_diagram_board.png"
    cx, cy, scale = 835, 455, 165

    def start(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=62)
        draw_chord(draw, cx + 70, cy + 30, 0, 380)
        draw.ellipse((cx - 8, cy - 142, cx + 8, cy - 126), fill=(240, 220, 120, 230))

    def key(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=68)
        draw_chord(draw, cx + 100, cy - 10, -math.pi / 5, 340)
        contact = point_on_deltoid(cx, cy, scale, 0.85)
        draw.ellipse((contact[0] - 10, contact[1] - 10, contact[0] + 10, contact[1] + 10), fill=(240, 220, 120, 240))
        draw.arc((cx - 230, cy - 230, cx + 230, cy + 230), 290, 335, fill=(255, 210, 110, 190), width=5)

    def end(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=58)
        for angle in [0, math.pi / 6, math.pi / 3, 2 * math.pi / 3, 5 * math.pi / 6]:
            draw_chord(draw, cx + 80, cy + 10, angle, 300, alpha=72, width=5)
        draw_chord(draw, cx + 85, cy + 8, 2 * math.pi / 5, 330, alpha=245, width=8)

    composite_overlay(base, REAL / "SH007/start.png", start)
    composite_overlay(base, REAL / "SH007/key.png", key)
    composite_overlay(base, REAL / "SH007/end.png", end)


def sh008() -> None:
    base = BASE / "SH008_parchment.png"
    y = 500
    x1, x2 = 500, 1170
    segment = (x2 - x1) / 4

    def red_chord(draw):
        draw.line((x1, y, x2, y), fill=(190, 34, 38, 245), width=12)
        for x in [x1, x2]:
            draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=(210, 45, 45, 245))

    def start(draw, overlay):
        red_chord(draw)
        for i in range(5):
            x = x1 + segment * i
            draw.line((x, y - 60, x, y + 60), fill=(75, 45, 20, 235), width=5)
        chalk_text(draw, (x1 + 260, y + 95), "a", 58, (80, 45, 25, 235))

    def key(draw, overlay):
        red_chord(draw)
        for i in range(4):
            xa = x1 + segment * i
            xb = x1 + segment * (i + 1)
            draw.line((xa + 8, y - 70, xb - 8, y - 70), fill=(218, 155, 40, 245), width=8)
            chalk_text(draw, (int((xa + xb) / 2 - 14), y - 150), "a", 42, (100, 55, 25, 235))
        for i in range(5):
            x = x1 + segment * i
            draw.line((x, y - 60, x, y + 60), fill=(75, 45, 20, 235), width=5)
        chalk_text(draw, (650, 260), "4a = 1", 74, (80, 45, 25, 245))

    def end(draw, overlay):
        red_chord(draw)
        for i in range(5):
            x = x1 + segment * i
            draw.line((x, y - 60, x, y + 60), fill=(75, 45, 20, 235), width=5)
        chalk_text(draw, (620, 250), "a = 1/4", 82, (80, 45, 25, 245))
        chalk_text(draw, (690, 610), "单位弦长 = 1", 54, (125, 45, 35, 240))

    composite_overlay(base, REAL / "SH008/start.png", start)
    composite_overlay(base, REAL / "SH008/key.png", key)
    composite_overlay(base, REAL / "SH008/end.png", end)


def sh009() -> None:
    base = BASE / "SH009_area_board.png"
    cx, cy, scale = 850, 435, 150

    def start(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=20)
        draw_chord(draw, cx + 65, cy + 18, 0, 345, alpha=245)
        chalk_text(draw, (cx + 270, cy + 110), "a = 1/4", 42)

    def key(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=118, outline=(245, 238, 205, 240))
        draw_chord(draw, cx + 65, cy + 18, 0, 345, alpha=230)
        chalk_text(draw, (cx + 185, cy - 235), "A = π / 8", 62)

    def end(draw, overlay):
        draw_deltoid(draw, cx, cy, scale, fill_alpha=108, outline=(245, 238, 205, 235))
        draw_chord(draw, cx + 65, cy + 18, 0, 345, alpha=220)
        chalk_text(draw, (cx + 185, cy - 235), "A = π / 8", 62)
        draw.rounded_rectangle((cx + 300, cy + 92, cx + 500, cy + 177), radius=16, outline=(236, 236, 220, 220), width=4)
        chalk_text(draw, (cx + 335, cy + 106), "候选", 48, (236, 236, 220, 235))

    composite_overlay(base, REAL / "SH009/start.png", start)
    composite_overlay(base, REAL / "SH009/key.png", key)
    composite_overlay(base, REAL / "SH009/end.png", end)


def main() -> None:
    sh006()
    sh007()
    sh008()
    sh009()


if __name__ == "__main__":
    main()
