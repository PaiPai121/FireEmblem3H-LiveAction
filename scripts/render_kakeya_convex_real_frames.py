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


def text(draw, xy, value, size, fill=(238, 238, 225, 235)):
    x, y = xy
    f = font(size)
    for dx, dy, a in [(-2, 1, 60), (2, 2, 50), (0, -2, 45)]:
        draw.text((x + dx, y + dy), value, font=f, fill=(255, 255, 255, a))
    draw.text((x, y), value, font=f, fill=fill)


def composite(base_path: Path, out_path: Path, draw_fn):
    img = Image.open(base_path).convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw_fn(draw)
    glow = layer.filter(ImageFilter.GaussianBlur(0.35))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, layer)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out_path, quality=95)


def polygon(draw, pts, outline=(230, 220, 190, 235), fill=(180, 120, 65, 48), width=7):
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=width, joint="curve")


def eq_triangle(cx, cy, height):
    side = 2 * height / math.sqrt(3)
    return [(cx, cy - height / 2), (cx - side / 2, cy + height / 2), (cx + side / 2, cy + height / 2)]


def draw_triangle(draw, cx, cy, h, show_height=False, ghosts=False):
    pts = eq_triangle(cx, cy, h)
    polygon(draw, pts, outline=(235, 235, 220, 235), fill=(88, 160, 215, 45), width=6)
    if show_height:
        draw.line((cx, cy - h / 2, cx, cy + h / 2), fill=(230, 60, 55, 245), width=8)
        text(draw, (cx + 24, cy - 20), "1", 52)
    if ghosts:
        for angle in [0, math.pi / 6, math.pi / 3, 2 * math.pi / 3, 5 * math.pi / 6]:
            dx, dy = math.cos(angle) * h * 0.36, math.sin(angle) * h * 0.36
            draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=(230, 70, 65, 95), width=5)


def sh011():
    base = BASE / "SH011_training_floor.png"
    concave = [(455, 300), (1240, 300), (1240, 640), (900, 560), (760, 690), (455, 640)]
    hull = [(455, 300), (1240, 300), (1240, 640), (760, 690), (455, 640)]
    tri = eq_triangle(850, 500, 390)

    def start(draw):
        polygon(draw, concave, outline=(170, 105, 55, 245), fill=(150, 90, 45, 35), width=10)
        draw.line((720, 525, 1030, 430), fill=(228, 60, 58, 245), width=8)

    def key(draw):
        polygon(draw, concave, outline=(150, 95, 55, 90), fill=(150, 90, 45, 20), width=6)
        polygon(draw, hull, outline=(235, 220, 170, 245), fill=(235, 200, 95, 42), width=10)
        draw.line((780, 610, 920, 560), fill=(235, 220, 170, 245), width=7)

    def end(draw):
        polygon(draw, hull, outline=(120, 120, 120, 95), fill=(235, 200, 95, 22), width=4)
        polygon(draw, tri, outline=(235, 235, 220, 235), fill=(88, 160, 215, 45), width=8)

    composite(base, REAL / "SH011/start.png", start)
    composite(base, REAL / "SH011/key.png", key)
    composite(base, REAL / "SH011/end.png", end)


def sh012():
    base = BASE / "SH025_delta_diagram_board.png"

    def left_shape():
        return [(330, 330), (600, 300), (700, 480), (575, 650), (335, 620), (255, 470)]

    def right_shape():
        return [(970, 330), (1240, 300), (1335, 480), (1210, 650), (1115, 500), (975, 620), (895, 470)]

    def start(draw):
        polygon(draw, left_shape(), fill=(75, 160, 110, 40), outline=(145, 220, 165, 220), width=5)
        polygon(draw, right_shape(), fill=(160, 95, 85, 35), outline=(230, 160, 140, 220), width=5)
        for p in [(345, 430), (615, 500), (990, 430), (1265, 510)]:
            draw.ellipse((p[0] - 10, p[1] - 10, p[0] + 10, p[1] + 10), fill=(238, 238, 225, 235))

    def key(draw):
        start(draw)
        draw.line((345, 430, 615, 500), fill=(70, 220, 120, 245), width=8)
        draw.line((990, 430, 1115, 462), fill=(228, 65, 60, 245), width=8)
        draw.line((1115, 462, 1265, 510), fill=(228, 65, 60, 245), width=8)

    def end(draw):
        key(draw)
        text(draw, (430, 665), "OK", 58, (120, 230, 145, 235))
        text(draw, (1090, 665), "not convex", 44, (235, 145, 130, 235))

    composite(base, REAL / "SH012/start.png", start)
    composite(base, REAL / "SH012/key.png", key)
    composite(base, REAL / "SH012/end.png", end)


def sh013():
    base = BASE / "SH025_delta_diagram_board.png"

    def start(draw):
        draw_triangle(draw, 835, 500, 470)

    def key(draw):
        draw_triangle(draw, 835, 500, 470, show_height=True, ghosts=True)

    def end(draw):
        draw_triangle(draw, 835, 500, 470, show_height=True, ghosts=True)
        text(draw, (1070, 690), "只在凸区域中", 46)

    composite(base, REAL / "SH013/start.png", start)
    composite(base, REAL / "SH013/key.png", key)
    composite(base, REAL / "SH013/end.png", end)


def sh014():
    base = BASE / "SH008_parchment.png"

    def triangle_formula(draw, final=False):
        draw_triangle(draw, 460, 515, 420, show_height=True)
        text(draw, (705, 280), "s = 2 / sqrt(3)", 58, (80, 45, 25, 245))
        if final:
            text(draw, (705, 415), "A = 1 / sqrt(3)", 64, (125, 45, 35, 245))
        else:
            text(draw, (705, 415), "A = s * 1 / 2", 54, (80, 45, 25, 220))

    def start(draw):
        draw_triangle(draw, 460, 515, 420, show_height=True)

    def key(draw):
        triangle_formula(draw, final=False)

    def end(draw):
        triangle_formula(draw, final=True)
        draw.rounded_rectangle((682, 392, 1210, 505), radius=16, outline=(150, 55, 45, 235), width=5)

    composite(base, REAL / "SH014/start.png", start)
    composite(base, REAL / "SH014/key.png", key)
    composite(base, REAL / "SH014/end.png", end)


def sh015():
    base = BASE / "SH025_delta_diagram_board.png"
    pieces_left = [[(320, 420), (430, 350), (520, 455)], [(440, 560), (540, 430), (650, 560)], [(285, 610), (400, 560), (500, 680)]]
    pieces_right = [[(1070, 420), (1180, 350), (1270, 455)], [(1190, 560), (1290, 430), (1400, 560)], [(1035, 610), (1150, 560), (1250, 680)]]

    def draw_pieces(draw, pieces, bright=True):
        for pts in pieces:
            polygon(draw, pts, outline=(235, 205, 90, 230 if bright else 150), fill=(235, 185, 70, 70 if bright else 30), width=5)

    def start(draw):
        draw_pieces(draw, pieces_left)
        draw_pieces(draw, pieces_right)

    def key(draw):
        draw_pieces(draw, pieces_left, bright=False)
        hull = [(285, 350), (650, 350), (650, 680), (285, 680)]
        polygon(draw, hull, outline=(235, 235, 220, 230), fill=(235, 210, 110, 70), width=6)
        draw_pieces(draw, pieces_right)
        text(draw, (305, 705), "convex hull fills gaps", 34)

    def end(draw):
        draw_pieces(draw, pieces_right)
        text(draw, (985, 705), "non-convex keeps gaps", 34)
        draw.line((1170, 450, 880, 505), fill=(235, 235, 220, 180), width=5)

    composite(base, REAL / "SH015/start.png", start)
    composite(base, REAL / "SH015/key.png", key)
    composite(base, REAL / "SH015/end.png", end)


def main():
    sh011()
    sh012()
    sh013()
    sh014()
    sh015()


if __name__ == "__main__":
    main()
