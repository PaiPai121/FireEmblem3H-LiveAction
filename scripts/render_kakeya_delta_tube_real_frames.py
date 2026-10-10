from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "specials/kakeya_byleth_lecture/real_frames"
BASE = REAL / "_bases"
FONT = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def chalk_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, fill=(238, 238, 225, 235)) -> None:
    x, y = xy
    f = font(size)
    for dx, dy, alpha in [(-2, 1, 60), (2, 2, 50), (0, -2, 45)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 255, alpha))
    draw.text((x, y), text, font=f, fill=fill)


def composite(base_path: Path, out_path: Path, draw_fn) -> None:
    img = Image.open(base_path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw_fn(draw)
    glow = overlay.filter(ImageFilter.GaussianBlur(0.35))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, overlay)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out_path, quality=95)


def rot_rect(cx: float, cy: float, length: float, width: float, angle: float) -> list[tuple[float, float]]:
    ux, uy = math.cos(angle), math.sin(angle)
    vx, vy = -math.sin(angle), math.cos(angle)
    return [
        (cx - ux * length / 2 - vx * width / 2, cy - uy * length / 2 - vy * width / 2),
        (cx + ux * length / 2 - vx * width / 2, cy + uy * length / 2 - vy * width / 2),
        (cx + ux * length / 2 + vx * width / 2, cy + uy * length / 2 + vy * width / 2),
        (cx - ux * length / 2 + vx * width / 2, cy - uy * length / 2 + vy * width / 2),
    ]


def draw_tube(draw, cx, cy, length, width, angle, fill=(70, 165, 235, 70), outline=(155, 210, 255, 225), red=True):
    pts = rot_rect(cx, cy, length, width, angle)
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=4)
    ux, uy = math.cos(angle), math.sin(angle)
    p1 = (cx - ux * length / 2, cy - uy * length / 2)
    p2 = (cx + ux * length / 2, cy + uy * length / 2)
    if red:
        draw.line((p1, p2), fill=(228, 62, 58, 245), width=7)
        for x, y in [p1, p2]:
            draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(255, 110, 100, 245))
    return pts


def draw_delta_bracket(draw, x, y1, y2, label="δ"):
    draw.line((x, y1, x, y2), fill=(238, 238, 225, 235), width=4)
    draw.line((x - 22, y1, x + 22, y1), fill=(238, 238, 225, 235), width=4)
    draw.line((x - 22, y2, x + 22, y2), fill=(238, 238, 225, 235), width=4)
    chalk_text(draw, (x + 28, int((y1 + y2) / 2 - 28)), label, 46)


def draw_angle(draw, cx, cy, radius, a0, a1, label="α"):
    box = (cx - radius, cy - radius, cx + radius, cy + radius)
    draw.arc(box, math.degrees(a0), math.degrees(a1), fill=(238, 205, 80, 235), width=5)
    mid = (a0 + a1) / 2
    chalk_text(draw, (int(cx + math.cos(mid) * (radius + 18)), int(cy + math.sin(mid) * (radius + 18) - 25)), label, 40, (238, 220, 120, 235))


def sh025() -> None:
    base = BASE / "SH025_delta_diagram_board.png"
    cx, cy, length, width = 835, 475, 760, 82

    def start(draw):
        draw.line((cx - length / 2, cy, cx + length / 2, cy), fill=(230, 55, 52, 250), width=8)
        for x in [cx - length / 2, cx + length / 2]:
            draw.ellipse((x - 10, cy - 10, x + 10, cy + 10), fill=(255, 112, 100, 245))

    def key(draw):
        draw_tube(draw, cx, cy, length, width, 0)
        draw_delta_bracket(draw, cx + length / 2 + 55, cy - width / 2, cy + width / 2)

    def end(draw):
        draw_tube(draw, cx, cy, length, width, 0)
        draw_delta_bracket(draw, cx + length / 2 + 55, cy - width / 2, cy + width / 2)
        draw.line((cx + 20, cy + 160, cx + 340, cy + 60), fill=(180, 220, 255, 125), width=5)
        draw_angle(draw, cx + 20, cy, 135, 0, -0.32)

    composite(base, REAL / "SH025/start.png", start)
    composite(base, REAL / "SH025/key.png", key)
    composite(base, REAL / "SH025/end.png", end)


def tube_pair(draw, ox, oy, angle, overlap_len, label_y):
    draw_tube(draw, ox, oy, 470, 58, 0)
    draw_tube(draw, ox, oy, 470, 58, angle, fill=(70, 165, 235, 58), outline=(155, 210, 255, 210))
    # Pedagogical overlap patch; sized to show the qualitative dependence on alpha.
    patch = rot_rect(ox, oy, overlap_len, 54, angle / 2)
    draw.polygon(patch, fill=(238, 178, 52, 150))
    draw.line(patch + [patch[0]], fill=(245, 205, 80, 230), width=3)
    draw_angle(draw, ox - 135, oy - 8, 82, 0, angle)
    draw_delta_bracket(draw, ox + 260, oy - 29, oy + 29)
    chalk_text(draw, (ox - 145, label_y), "重叠区", 30, (238, 210, 125, 220))


def sh026() -> None:
    base = BASE / "SH025_delta_diagram_board.png"

    def start(draw):
        draw_tube(draw, 835, 475, 760, 82, 0)
        draw.line((600, 650, 1080, 420), fill=(170, 215, 255, 110), width=5)
        draw_angle(draw, 600, 475, 120, 0, -0.28)

    def key(draw):
        tube_pair(draw, 510, 465, -0.18, 250, 640)
        tube_pair(draw, 1160, 465, -0.74, 100, 640)

    def end(draw):
        tube_pair(draw, 510, 465, -0.18, 250, 640)
        tube_pair(draw, 1160, 465, -0.74, 100, 640)
        chalk_text(draw, (300, 230), "α 小", 44, (238, 220, 125, 235))
        chalk_text(draw, (960, 230), "α 大", 44, (238, 220, 125, 235))

    composite(base, REAL / "SH026/start.png", start)
    composite(base, REAL / "SH026/key.png", key)
    composite(base, REAL / "SH026/end.png", end)


def sh027() -> None:
    base = BASE / "SH025_delta_diagram_board.png"

    def start(draw):
        tube_pair(draw, 650, 485, -0.38, 170, 660)
        chalk_text(draw, (1130, 380), "δ", 42)
        chalk_text(draw, (440, 318), "α", 42, (238, 220, 125, 235))

    def key(draw):
        tube_pair(draw, 600, 500, -0.38, 170, 670)
        chalk_text(draw, (820, 245), "交叠长度 ≈ δ / sin α", 36)
        chalk_text(draw, (820, 305), "交叠面积 ≈ δ² / sin α", 36)
        chalk_text(draw, (820, 365), "≤ C δ² / α", 40)
        draw.rounded_rectangle((575, 470, 710, 555), radius=14, outline=(245, 205, 80, 235), width=4)
        chalk_text(draw, (1008, 405), "δ", 42, (155, 210, 255, 235))
        chalk_text(draw, (1170, 405), "α", 42, (238, 220, 125, 235))

    def end(draw):
        tube_pair(draw, 600, 500, -0.38, 170, 670)
        chalk_text(draw, (820, 160), "交叠长度 ≈ δ / sin α", 32)
        chalk_text(draw, (820, 214), "交叠面积 ≈ δ² / sin α", 32)
        chalk_text(draw, (820, 268), "重叠 ≤ C δ² / α", 34)

    composite(base, REAL / "SH027/start.png", start)
    composite(base, REAL / "SH027/key.png", key)
    composite(base, REAL / "SH027/end.png", end)


def draw_grid(draw, left, top, size, cells, hits, cell_color=(120, 185, 240, 70)):
    for i in range(cells + 1):
        x = left + i * size
        y = top + i * size
        draw.line((x, top, x, top + cells * size), fill=(210, 210, 200, 65), width=2)
        draw.line((left, y, left + cells * size, y), fill=(210, 210, 200, 65), width=2)
    for ix, iy in hits:
        x = left + ix * size
        y = top + iy * size
        draw.rectangle((x + 2, y + 2, x + size - 2, y + size - 2), fill=cell_color)
    # multi-direction strokes
    for angle in [0, 0.35, -0.55, 0.9, -1.05]:
        ux, uy = math.cos(angle), math.sin(angle)
        cx, cy = left + cells * size / 2, top + cells * size / 2
        draw.line((cx - ux * cells * size * 0.38, cy - uy * cells * size * 0.38, cx + ux * cells * size * 0.38, cy + uy * cells * size * 0.38), fill=(110, 210, 160, 180), width=4)


def sh028() -> None:
    base = BASE / "SH025_delta_diagram_board.png"

    def start(draw):
        hits = [(2, 3), (3, 3), (4, 3), (5, 4), (6, 4), (4, 5), (5, 5), (6, 5), (7, 6), (8, 6), (6, 7), (7, 7)]
        draw_grid(draw, 470, 245, 72, 10, hits)

    def key(draw):
        hits = [(i, (i * 3) % 16) for i in range(2, 15)] + [(8, i) for i in range(3, 14)] + [(i, 15 - i) for i in range(3, 14)]
        draw_grid(draw, 430, 180, 48, 16, hits, (120, 185, 240, 58))
        chalk_text(draw, (995, 275), "单条曲线：约 1/δ 格", 34)
        chalk_text(draw, (995, 335), "全方向：接近 1/δ² 格", 34)

    def end(draw):
        hits = [(i, (i * 3) % 16) for i in range(2, 15)] + [(8, i) for i in range(3, 14)] + [(i, 15 - i) for i in range(3, 14)]
        draw_grid(draw, 390, 170, 48, 16, hits, (120, 185, 240, 62))
        chalk_text(draw, (1000, 280), "不是一条普通曲线", 42)
        chalk_text(draw, (1000, 345), "格子数接近二维", 42)

    composite(base, REAL / "SH028/start.png", start)
    composite(base, REAL / "SH028/key.png", key)
    composite(base, REAL / "SH028/end.png", end)


def draw_multidirectional_set(draw, cx, cy):
    for angle in [0, 0.42, -0.6, 1.0, -1.05, 1.45]:
        ux, uy = math.cos(angle), math.sin(angle)
        draw.line((cx - ux * 120, cy - uy * 120, cx + ux * 120, cy + uy * 120), fill=(110, 210, 160, 170), width=4)
    draw.ellipse((cx - 58, cy - 40, cx + 58, cy + 40), outline=(125, 185, 240, 190), width=4)


def sh029() -> None:
    base = BASE / "SH029_theorem_board.png"

    def start(draw):
        draw_multidirectional_set(draw, 840, 475)
        chalk_text(draw, (560, 315), "面积可以为 0", 54)

    def key(draw):
        draw_multidirectional_set(draw, 840, 475)
        chalk_text(draw, (500, 315), "面积可以为 0", 50)
        chalk_text(draw, (1010, 315), "维数 = 2", 58)
        draw.line((780, 390, 1000, 390), fill=(235, 235, 220, 210), width=4)

    def end(draw):
        draw_multidirectional_set(draw, 840, 475)
        chalk_text(draw, (470, 315), "面积可以为 0", 52)
        chalk_text(draw, (1010, 315), "维数 = 2", 60)
        draw.line((760, 390, 1000, 390), fill=(235, 235, 220, 220), width=4)
        chalk_text(draw, (650, 620), "二维结论", 44, (205, 225, 210, 230))

    composite(base, REAL / "SH029/start.png", start)
    composite(base, REAL / "SH029/key.png", key)
    composite(base, REAL / "SH029/end.png", end)


def main() -> None:
    sh025()
    sh026()
    sh027()
    sh028()
    sh029()


if __name__ == "__main__":
    main()
