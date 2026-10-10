from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "specials/kakeya_byleth_lecture/real_frames"
FONT_CN = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_CN, size)


def fit_1672x941(img: Image.Image) -> Image.Image:
    img = img.convert("RGB")
    target = (1672, 941)
    scale = max(target[0] / img.width, target[1] / img.height)
    resized = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
    x = (resized.width - target[0]) // 2
    y = (resized.height - target[1]) // 2
    return resized.crop((x, y, x + target[0], y + target[1]))


def save(out: Path, img: Image.Image) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out, quality=95)


def layer_on(base: Image.Image, draw_fn) -> Image.Image:
    img = fit_1672x941(base).convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw_fn(draw, layer)
    glow = layer.filter(ImageFilter.GaussianBlur(0.45))
    return Image.alpha_composite(Image.alpha_composite(img, glow), layer)


def chalk_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, fill=(236, 236, 222, 232)) -> None:
    f = font(size)
    x, y = xy
    for dx, dy, a in [(-2, 1, 65), (2, 2, 55), (0, -2, 45)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 255, a))
    draw.text((x, y), text, font=f, fill=fill)


def make_stone_base() -> Image.Image:
    clean_topdown = REAL / "SH001/start.png"
    if clean_topdown.exists():
        return Image.open(clean_topdown).convert("RGB")
    source = Image.open(REAL / "SH002/start.png").convert("RGB")
    ground = source.crop((0, 650, source.width, source.height))
    ground = ground.resize((1672, 941), Image.Resampling.BICUBIC)
    ground = ground.filter(ImageFilter.GaussianBlur(0.65))
    vignette = Image.new("RGBA", ground.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(vignette)
    for i in range(80):
        a = int(i * 1.4)
        d.rectangle((i, i, 1672 - i, 941 - i), outline=(0, 0, 0, max(0, 95 - a // 2)))
    return Image.alpha_composite(ground.convert("RGBA"), vignette).convert("RGB")


def draw_training_sword(draw: ImageDraw.ImageDraw, cx: int, cy: int, length: int, angle=0.0, alpha=245, width=32) -> None:
    dx = math.cos(angle) * length / 2
    dy = math.sin(angle) * length / 2
    x1, y1 = cx - dx, cy - dy
    x2, y2 = cx + dx, cy + dy
    shadow = (0, 0, 0, int(alpha * 0.25))
    draw.line((x1 + 6, y1 + 9, x2 + 6, y2 + 9), fill=shadow, width=width + 6)
    draw.line((x1, y1, x2, y2), fill=(117, 79, 48, alpha), width=width)
    draw.line((x1, y1 - 5, x2, y2 - 5), fill=(178, 135, 86, int(alpha * 0.8)), width=max(5, width // 5))
    for x, y in [(x1, y1), (x2, y2)]:
        draw.ellipse((x - 14, y - 14, x + 14, y + 14), fill=(220, 28, 38, alpha))


def draw_glove(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    pts = [(x, y), (x + 72, y + 22), (x + 58, y + 83), (x + 12, y + 104), (x - 42, y + 72), (x - 30, y + 18)]
    draw.polygon(pts, fill=(18, 18, 20, 235))
    draw.line(pts + [pts[0]], fill=(78, 78, 76, 210), width=5)
    draw.line((x + 8, y + 36, x + 77, y + 50), fill=(42, 42, 42, 230), width=10)


def board_base() -> Image.Image:
    path = REAL / "_bases/SH006_blank_board.png"
    return Image.open(path).convert("RGB") if path.exists() else Image.open(REAL / "SH006/key.png").convert("RGB")


def classroom_base() -> Image.Image:
    path = REAL / "SH023/end_base.png"
    if path.exists():
        return Image.open(path).convert("RGB")
    return Image.open(REAL / "SH023/end.png").convert("RGB")


def parchment_base() -> Image.Image:
    path = REAL / "_bases/SH008_parchment.png"
    return Image.open(path).convert("RGB") if path.exists() else board_base()


def sh001() -> None:
    base = make_stone_base()
    marks = (515, 505, 1157, 505)

    def start(draw, _):
        draw.line(marks, fill=(238, 238, 220, 210), width=5)
        for x in [marks[0], marks[2]]:
            draw.ellipse((x - 15, marks[1] - 15, x + 15, marks[1] + 15), fill=(218, 32, 42, 245))

    def key(draw, _):
        start(draw, _)
        draw_glove(draw, 840, 315)
        draw_training_sword(draw, 836, 505, 642, 0)

    def end(draw, _):
        start(draw, _)
        draw_training_sword(draw, 836, 505, 642, 0)

    for name, fn in [("start", start), ("key", key), ("end", end)]:
        save(REAL / "SH001" / f"{name}.png", layer_on(base, fn))


def sh003() -> None:
    base = make_stone_base()
    cx, cy, length = 836, 505, 642

    def start(draw, _):
        draw_training_sword(draw, cx, cy, length, 0)
        draw.ellipse((cx - 11, cy - 11, cx + 11, cy + 11), fill=(245, 230, 160, 245))

    def key(draw, _):
        draw.ellipse((cx - 322, cy - 322, cx + 322, cy + 322), fill=(84, 160, 224, 70), outline=(180, 220, 248, 190), width=6)
        for a in [0, math.pi / 6, math.pi / 3, math.pi / 2, 2 * math.pi / 3, 5 * math.pi / 6]:
            draw_training_sword(draw, cx, cy, length, a, alpha=72, width=18)
        draw_training_sword(draw, cx, cy, length, math.pi / 4, alpha=230, width=26)
        draw.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), fill=(245, 230, 160, 245))

    def end(draw, _):
        key(draw, _)
        chalk_text(draw, (1185, 198), "?", 86, (245, 238, 210, 235))

    for name, fn in [("start", start), ("key", key), ("end", end)]:
        save(REAL / "SH003" / f"{name}.png", layer_on(base, fn))


def sh004() -> None:
    base = board_base()

    def icons(draw, crossed=False, final=False):
        lx, rx, y = 880, 1195, 420
        for x in [lx, rx]:
            draw.line((x - 95, y, x + 95, y), fill=(235, 235, 220, 225), width=7)
            draw.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(245, 220, 105, 240))
        draw.line((rx - 56, y + 65, rx + 38, y + 65), fill=(130, 225, 160, 220), width=6)
        draw.polygon([(rx + 38, y + 65), (rx + 18, y + 52), (rx + 18, y + 78)], fill=(130, 225, 160, 220))
        draw.line((rx + 42, y + 86, rx - 52, y + 86), fill=(130, 225, 160, 170), width=5)
        if crossed:
            draw.line((lx - 120, y - 90, lx + 120, y + 90), fill=(228, 65, 60, 245), width=11)
            draw.line((lx + 120, y - 90, lx - 120, y + 90), fill=(228, 65, 60, 245), width=11)
            draw.ellipse((rx - 135, y - 125, rx + 135, y + 125), outline=(236, 236, 220, 225), width=7)
        if final:
            chalk_text(draw, (1015, 610), "中心可移动", 46)

    for name, crossed, final in [("start", False, False), ("key", True, False), ("end", True, True)]:
        save(REAL / "SH004" / f"{name}.png", layer_on(base, lambda d, l, c=crossed, f=final: icons(d, c, f)))


def sh005() -> None:
    base = board_base()
    cx, cy, length = 1080, 470, 320

    def draw_fan(draw, count: int, final=False):
        for i in range(count):
            a = -math.pi / 2 + i * math.pi / max(1, count - 1)
            alpha = 68 if i < count - 1 else 220
            dx = math.cos(a) * length / 2
            dy = math.sin(a) * length / 2
            draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=(120, 225, 155, alpha), width=6)
        draw.line((cx - length / 2, cy, cx + length / 2, cy), fill=(228, 55, 54, 235), width=9)
        if final:
            chalk_text(draw, (860, 665), "每个方向：一条完整单位线段", 42)

    for name, count, final in [("start", 4, False), ("key", 11, False), ("end", 17, True)]:
        save(REAL / "SH005" / f"{name}.png", layer_on(base, lambda d, l, c=count, f=final: draw_fan(d, c, f)))


def sh010() -> None:
    base = Image.open(REAL / "SH009/end.png").convert("RGB")

    def draw_doubt(draw, intensity: int):
        draw.rounded_rectangle((1010, 245, 1325, 570), radius=18, outline=(235, 235, 220, 180), width=5)
        chalk_text(draw, (1060, 320), "候选", 54)
        chalk_text(draw, (1135, 425), "≠", 72, (238, 185, 115, 235))
        if intensity > 0:
            chalk_text(draw, (1180, 420), "最小", 50)
        if intensity > 1:
            chalk_text(draw, (1338, 360), "?", 78, (245, 238, 210, 240))

    for name, intensity in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH010" / f"{name}.png", layer_on(base, lambda d, l, i=intensity: draw_doubt(d, i)))


def sh024() -> None:
    base = parchment_base()

    def draw_zero(draw, stage: int):
        draw.line((280, 475, 670, 475), fill=(160, 40, 38, 245), width=11)
        for x in [280, 670]:
            draw.ellipse((x - 13, 462, x + 13, 488), fill=(210, 38, 40, 245))
        chalk_text(draw, (285, 555), "线段：有长度，面积为 0", 42, (80, 45, 25, 245))
        if stage >= 1:
            cx, cy = 1130, 475
            for i in range(18):
                a = i * math.pi / 18
                dx = math.cos(a) * 170
                dy = math.sin(a) * 170
                draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=(80, 150, 220, 90), width=5)
            chalk_text(draw, (970, 555), "面积为 0，不是不存在", 42, (80, 45, 25, 245))
        if stage >= 2:
            chalk_text(draw, (625, 230), "谨慎：这是集合的面积，不是运动轨迹消失", 44, (115, 45, 35, 245))

    for name, stage in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH024" / f"{name}.png", layer_on(base, lambda d, l, s=stage: draw_zero(d, s)))


def draw_tube(draw, cx, cy, angle, length=300, width=56, fill=(82, 160, 224, 105), outline=(170, 220, 250, 220)):
    dx, dy = math.cos(angle) * length / 2, math.sin(angle) * length / 2
    nx, ny = -math.sin(angle) * width / 2, math.cos(angle) * width / 2
    pts = [(cx - dx + nx, cy - dy + ny), (cx + dx + nx, cy + dy + ny), (cx + dx - nx, cy + dy - ny), (cx - dx - nx, cy - dy - ny)]
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=4)


def sh030() -> None:
    base = board_base()

    def triptych(draw, stage):
        xs = [585, 965, 1335]
        labels = ["细管重叠", "最大平均", "波包方向"]
        for x, label in zip(xs, labels):
            draw.rounded_rectangle((x - 145, 230, x + 145, 650), radius=14, outline=(210, 210, 195, 155), width=4)
            chalk_text(draw, (x - 92, 670), label, 34)
        if stage >= 0:
            draw_tube(draw, xs[0], 430, 0.2)
            draw_tube(draw, xs[0], 430, -0.55)
        if stage >= 1:
            draw.rectangle((xs[1] - 110, 368, xs[1] + 110, 492), outline=(170, 220, 250, 225), fill=(82, 160, 224, 58), width=5)
            for i in range(9):
                y = 374 + i * 14
                draw.line((xs[1] - 95, y, xs[1] + 95, y + 45), fill=(245, 220, 110, 110), width=3)
        if stage >= 2:
            for i in range(6):
                a = -0.5 + i * 0.18
                draw.line((xs[2] - 110, 560 - i * 32, xs[2] + 110, 325 + i * 10), fill=(125, 225, 160, 145), width=5)
            chalk_text(draw, (610, 160), "多方向细长结构怎样重叠", 44)

    for name, stage in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH030" / f"{name}.png", layer_on(base, lambda d, l, s=stage: triptych(d, s)))


def sh031() -> None:
    base = classroom_base()

    def impact(draw, stage):
        chalk_text(draw, (575, 205), "细管重叠", 42)
        draw_tube(draw, 735, 410, 0.45, length=360, width=50)
        draw_tube(draw, 735, 410, -0.25, length=360, width=50)
        if stage >= 1:
            chalk_text(draw, (1040, 205), "最大平均", 39)
            draw.rectangle((1070, 365, 1325, 505), outline=(170, 220, 250, 225), fill=(82, 160, 224, 55), width=5)
        if stage >= 2:
            chalk_text(draw, (700, 665), "波包", 42)
            for i in range(6):
                draw.arc((620 + i * 22, 590 - i * 9, 930 + i * 22, 730 - i * 9), 195, 345, fill=(125, 225, 160, 175), width=4)

    for name, stage in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH031" / f"{name}.png", layer_on(base, lambda d, l, s=stage: impact(d, s)))


def sh032() -> None:
    base = classroom_base()

    def reveal(draw, stage):
        if stage == 0:
            chalk_text(draw, (700, 360), "最后给它名字", 52)
        elif stage == 1:
            chalk_text(draw, (690, 350), "挂谷针问题", 72)
        else:
            chalk_text(draw, (690, 350), "挂谷针问题", 72)
            draw.rounded_rectangle((640, 320, 1135, 455), radius=20, outline=(238, 238, 220, 210), width=5)

    for name, stage in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH032" / f"{name}.png", layer_on(base, lambda d, l, s=stage: reveal(d, s)))


def sh033() -> None:
    base = make_stone_base()
    cx, cy, length = 836, 505, 642

    def final_floor(draw, stage):
        if stage >= 1:
            for i in range(20):
                a = i * math.pi / 20
                dx = math.cos(a) * length / 2
                dy = math.sin(a) * length / 2
                draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=(115, 225, 155, 60), width=5)
        if stage >= 2:
            for i in range(7):
                y = 320 + i * 46
                draw.line((530, y, 1140, y + ((i % 2) * 50 - 25)), fill=(82, 160, 224, 42), width=12)
        draw_training_sword(draw, cx, cy, length, 0)

    for name, stage in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH033" / f"{name}.png", layer_on(base, lambda d, l, s=stage: final_floor(d, s)))


def sh015() -> None:
    base_path = REAL / "_bases/SH025_delta_diagram_board.png"
    base = Image.open(base_path).convert("RGB") if base_path.exists() else board_base()
    left_pieces = [
        [(350, 385), (515, 310), (620, 440)],
        [(460, 585), (620, 430), (760, 610)],
        [(305, 660), (455, 560), (620, 720)],
    ]
    right_pieces = [
        [(1010, 385), (1175, 310), (1280, 440)],
        [(1120, 585), (1280, 430), (1420, 610)],
        [(965, 660), (1115, 560), (1280, 720)],
    ]
    hull = [(285, 300), (780, 300), (805, 735), (285, 735)]

    def piece(draw, pts, alpha=205, fill_alpha=52):
        draw.polygon(pts, fill=(238, 200, 78, fill_alpha))
        draw.line(pts + [pts[0]], fill=(248, 225, 105, alpha), width=6, joint="curve")

    def draw_set(draw, pieces, alpha=205):
        for pts in pieces:
            piece(draw, pts, alpha=alpha)

    def start(draw, _):
        draw_set(draw, left_pieces)
        draw_set(draw, right_pieces)

    def key(draw, _):
        draw.polygon(hull, fill=(235, 215, 100, 70))
        draw.line(hull + [hull[0]], fill=(238, 238, 220, 235), width=7, joint="curve")
        for pts in left_pieces:
            draw.line(pts + [pts[0]], fill=(248, 225, 105, 155), width=5, joint="curve")
        draw_set(draw, right_pieces)
        chalk_text(draw, (360, 750), "凸包会填满空隙", 44)
        chalk_text(draw, (1095, 750), "非凸保留空隙", 44)

    def end(draw, _):
        draw_set(draw, right_pieces)
        chalk_text(draw, (1035, 750), "碎片进入 Perron 构造", 44)
        draw.line((960, 520, 820, 520), fill=(235, 235, 220, 180), width=6)
        draw.polygon([(820, 520), (850, 505), (850, 535)], fill=(235, 235, 220, 180))

    for name, fn in [("start", start), ("key", key), ("end", end)]:
        save(REAL / "SH015" / f"{name}.png", layer_on(base, fn))


def sh034() -> None:
    base = parchment_base()

    def card(draw, stage):
        if stage >= 0:
            chalk_text(draw, (430, 305), "面积可以小到消失", 74, (80, 45, 25, 245))
        if stage >= 1:
            chalk_text(draw, (455, 445), "方向复杂度不会消失", 74, (115, 45, 35, 245))
        if stage >= 2:
            draw.line((410, 590, 1250, 590), fill=(130, 85, 45, 210), width=5)
            chalk_text(draw, (665, 640), "二维挂谷针问题", 48, (80, 45, 25, 230))

    for name, stage in [("start", 0), ("key", 1), ("end", 2)]:
        save(REAL / "SH034" / f"{name}.png", layer_on(base, lambda d, l, s=stage: card(d, s)))


def main() -> None:
    sh001()
    sh003()
    sh004()
    sh005()
    sh010()
    sh015()
    sh024()
    sh030()
    sh031()
    sh032()
    sh033()
    sh034()


if __name__ == "__main__":
    main()
