#!/usr/bin/env python3
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "specials" / "kakeya_byleth_lecture" / "real_frames"
FONT_CN = "/System/Library/Fonts/STHeiti Medium.ttc"
OUT_SIZE = (1672, 941)
STAMP = "before_progression_repair_2026-08-01"


PROBLEM_SHOTS = [
    "SH003", "SH004", "SH005", "SH006", "SH007", "SH008", "SH009",
    "SH012", "SH013", "SH014", "SH017", "SH021", "SH022", "SH024",
    "SH025", "SH026", "SH029", "SH030", "SH031", "SH033", "SH034",
]


STAGES = {
    "SH003": ("固定中心", "扫出圆盘", "只是直觉"),
    "SH004": ("旧规则", "划掉固定中心", "中心可移动"),
    "SH005": ("一条单位线段", "方向逐步补齐", "所有方向"),
    "SH006": ("候选出现", "三尖闭合", "只标候选"),
    "SH007": ("取一条切线弦", "切点滑动", "方向不漏"),
    "SH008": ("四段 a", "4a = 1", "a = 1/4"),
    "SH009": ("面积公式", "代入尺度", "A = pi/8 候选"),
    "SH012": ("取两点", "连线测试", "凸 / 非凸"),
    "SH013": ("高为 1", "红剑滑动", "0 到 180 度"),
    "SH014": ("能做到", "危险方向沿高", "凸定理下界"),
    "SH017": ("底边切开", "方向分配", "方向未删"),
    "SH021": ("切分前", "平移后", "方向尺仍满"),
    "SH022": ("第 1 轮", "第 2 轮", "面积 < ε"),
    "SH024": ("线段有长度", "面积为 0", "不是不存在"),
    "SH025": ("单位线段", "加粗成管", "宽度 δ"),
    "SH026": ("小夹角", "大夹角", "α 控制重叠"),
    "SH029": ("面积可为 0", "集合仍复杂", "维数 = 2"),
    "SH030": ("细管重叠", "最大平均", "波包"),
    "SH031": ("平均", "波包", "组合几何"),
    "SH033": ("回到木剑", "方向扇出现", "复杂度不消失"),
    "SH034": ("挂谷针问题", "面积可消失", "方向复杂度仍在"),
}


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_CN, size)


def load(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGB")
    if img.size != OUT_SIZE:
        img = img.resize(OUT_SIZE, Image.Resampling.LANCZOS)
    return img


def save(path: Path, img: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(path, quality=95)


def backup(path: Path) -> None:
    target = path.with_name(f"{path.stem}_{STAMP}{path.suffix}")
    if not target.exists():
        target.write_bytes(path.read_bytes())


def chalk_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, fill=(246, 241, 220, 240)) -> None:
    f = font(size)
    x, y = xy
    for dx, dy, alpha in [(-2, 2, 70), (2, 2, 55), (0, -2, 45)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 255, alpha))
    draw.text((x, y), text, font=f, fill=fill)


def darken(img: Image.Image, amount: float) -> Image.Image:
    return ImageEnhance.Brightness(img).enhance(amount)


def line(draw: ImageDraw.ImageDraw, points, fill, width=7) -> None:
    draw.line(points, fill=fill, width=width, joint="curve")


def sword(draw: ImageDraw.ImageDraw, cx: int, cy: int, length: int, angle: float, color=(224, 54, 54, 235), width=12) -> None:
    dx = math.cos(angle) * length / 2
    dy = math.sin(angle) * length / 2
    line(draw, (cx - dx, cy - dy, cx + dx, cy + dy), color, width)
    for x, y in [(cx - dx, cy - dy), (cx + dx, cy + dy)]:
        draw.ellipse((x - 10, y - 10, x + 10, y + 10), fill=color)


def deltoid(cx: int, cy: int, scale: float) -> list[tuple[float, float]]:
    pts = []
    for i in range(241):
        t = 2 * math.pi * i / 240
        x = cx + scale * (2 * math.cos(t) + math.cos(2 * t))
        y = cy + scale * (2 * math.sin(t) - math.sin(2 * t))
        pts.append((x, y))
    return pts


def draw_perron_tree(draw: ImageDraw.ImageDraw, center=(836, 500), size=300, rounds=2) -> None:
    cx, cy = center
    apex = (cx, cy - size)
    base_y = cy + size * 0.62
    count = 2 ** rounds
    for i in range(count + 1):
        x = cx - size + 2 * size * i / count
        line(draw, (apex[0], apex[1], x, base_y), (105, 225, 150, 125), 5)
    for i in range(count):
        x1 = cx - size + 2 * size * i / count
        x2 = cx - size + 2 * size * (i + 1) / count
        offset = (i - count / 2) * 28
        fill = (90, 150 + (i * 17) % 80, 225, 62)
        outline = (120, 225, 160, 175)
        draw.polygon([(apex[0] + offset, apex[1]), (x1 + offset, base_y), (x2 + offset, base_y)], fill=fill)
        line(draw, (apex[0] + offset, apex[1], x1 + offset, base_y, x2 + offset, base_y, apex[0] + offset, apex[1]), outline, 4)


def stage_panel(draw: ImageDraw.ImageDraw, shot: str, frame: str) -> None:
    labels = STAGES[shot]
    index = {"start": 0, "key": 1, "end": 2}[frame]
    x0, y0 = 64, 62
    draw.rounded_rectangle((x0, y0, x0 + 520, y0 + 112), radius=18, fill=(26, 31, 36, 178), outline=(239, 230, 198, 160), width=3)
    chalk_text(draw, (x0 + 28, y0 + 24), f"{shot} · {labels[index]}", 42)
    for i, label in enumerate(labels):
        x = x0 + 34 + i * 150
        y = y0 + 82
        color = (245, 215, 100, 245) if i == index else (205, 205, 190, 135)
        draw.ellipse((x - 9, y - 9, x + 9, y + 9), fill=color)
        if i < 2:
            line(draw, (x + 14, y, x + 126, y), (205, 205, 190, 95), 4)


def draw_delta_tube(draw: ImageDraw.ImageDraw, cx: int, cy: int, angle: float, length=440, width=54, fill=(70, 160, 235, 82)) -> None:
    ux, uy = math.cos(angle), math.sin(angle)
    vx, vy = -uy, ux
    pts = [
        (cx - ux * length / 2 - vx * width / 2, cy - uy * length / 2 - vy * width / 2),
        (cx + ux * length / 2 - vx * width / 2, cy + uy * length / 2 - vy * width / 2),
        (cx + ux * length / 2 + vx * width / 2, cy + uy * length / 2 + vy * width / 2),
        (cx - ux * length / 2 + vx * width / 2, cy - uy * length / 2 + vy * width / 2),
    ]
    draw.polygon(pts, fill=fill, outline=(120, 205, 246, 205))


def shot_overlay(draw: ImageDraw.ImageDraw, shot: str, frame: str) -> None:
    index = {"start": 0, "key": 1, "end": 2}[frame]
    stage_panel(draw, shot, frame)

    if shot == "SH003":
        cx, cy = 836, 500
        if index >= 1:
            draw.ellipse((cx - 280, cy - 280, cx + 280, cy + 280), fill=(75, 155, 225, 58), outline=(170, 220, 250, 190), width=6)
            for a in [0, math.pi / 5, 2 * math.pi / 5, 3 * math.pi / 5, 4 * math.pi / 5]:
                sword(draw, cx, cy, 520, a, (226, 65, 65, 92), 10)
        sword(draw, cx, cy, 520, 0 if index == 0 else math.pi / 4, (226, 65, 65, 230), 14)
        if index == 2:
            chalk_text(draw, (1120, 655), "固定中心才是圆", 48)

    elif shot == "SH004":
        lx, rx, y = 725, 1085, 515
        for x in [lx, rx]:
            sword(draw, x, y, 230, 0, (238, 238, 220, 230), 10)
            draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=(240, 220, 95, 235))
        if index >= 1:
            line(draw, (lx - 130, y - 95, lx + 130, y + 95), (230, 55, 55, 245), 11)
            line(draw, (lx + 130, y - 95, lx - 130, y + 95), (230, 55, 55, 245), 11)
        if index == 2:
            draw.ellipse((rx - 150, y - 120, rx + 150, y + 120), outline=(126, 225, 160, 230), width=9)

    elif shot == "SH005":
        cx, cy = 1040, 510
        count = [3, 11, 21][index]
        for i in range(count):
            a = -math.pi / 2 + i * math.pi / max(1, count - 1)
            sword(draw, cx, cy, 350, a, (95, 225, 150, 60 if i != count // 2 else 205), 7)
        sword(draw, cx, cy, 350, 0, (232, 62, 62, 235), 11)
        if index == 2:
            chalk_text(draw, (855, 750), "每个方向都有完整单位线段", 44)

    elif shot in {"SH006", "SH007", "SH008", "SH009"}:
        cx, cy = 1060, 505
        pts = deltoid(cx, cy, 92)
        if shot == "SH006":
            draw.line(pts[:80 if index == 0 else 170 if index == 1 else 241], fill=(135, 218, 248, 228), width=7)
            if index == 2:
                draw.polygon(pts, fill=(78, 156, 235, 48), outline=(135, 218, 248, 235))
                chalk_text(draw, (930, 685), "候选区域", 46)
        elif shot == "SH007":
            draw.polygon(pts, fill=(78, 156, 235, 42), outline=(135, 218, 248, 220))
            angle = [0, math.pi / 5, math.pi * 0.78][index]
            sword(draw, cx, cy, 360, angle, (236, 58, 58, 235), 11)
            draw.ellipse((cx + 185 * math.cos(angle) - 10, cy + 120 * math.sin(angle) - 10, cx + 185 * math.cos(angle) + 10, cy + 120 * math.sin(angle) + 10), fill=(245, 220, 95, 240))
            if index == 2:
                chalk_text(draw, (910, 720), "切点走一圈，方向走一圈", 39)
        elif shot == "SH008":
            sword(draw, cx, cy, 440, 0, (236, 58, 58, 235), 12)
            for i in range(index + 2):
                x = cx - 220 + i * 110
                line(draw, (x, cy - 32, x, cy + 32), (245, 220, 95, 230), 5)
                if index >= 1:
                    chalk_text(draw, (x - 18, cy + 45), "a", 30)
            if index >= 1:
                chalk_text(draw, (900, 680), "4a = 1", 56)
            if index == 2:
                chalk_text(draw, (1135, 680), "a = 1/4", 56)
        elif shot == "SH009":
            draw.polygon(pts, fill=(236, 186, 70, 42 + 38 * index), outline=(135, 218, 248, 220))
            if index >= 1:
                chalk_text(draw, (890, 680), "A = 2πa²", 54)
            if index == 2:
                chalk_text(draw, (1160, 680), "A = π/8（候选）", 46)

    elif shot == "SH012":
        x1, x2, y = 570, 1120, 520
        draw.ellipse((x1 - 135, y - 105, x1 + 135, y + 105), outline=(120, 220, 160, 230), width=7)
        draw.polygon([(x2 - 150, y - 110), (x2 + 140, y - 110), (x2 + 45, y), (x2 + 140, y + 110), (x2 - 150, y + 110)], outline=(235, 140, 110, 230), fill=(235, 140, 110, 35))
        if index >= 1:
            line(draw, (x1 - 82, y, x1 + 82, y), (120, 220, 160, 235), 8)
            line(draw, (x2 - 92, y, x2 + 92, y), (230, 62, 62, 235), 8)
        if index == 2:
            chalk_text(draw, (455, 670), "凸：路不出去", 40)
            chalk_text(draw, (980, 670), "非凸：路会出去", 40)

    elif shot in {"SH013", "SH014"}:
        cx, cy = 930, 555
        h = 360
        s = int(2 * h / math.sqrt(3))
        tri = [(cx, cy - h), (cx - s // 2, cy), (cx + s // 2, cy)]
        draw.polygon(tri, fill=(90, 160, 230, 38), outline=(235, 235, 220, 230))
        line(draw, (cx, cy - h, cx, cy), (245, 220, 95, 210), 5)
        if shot == "SH013":
            for a in [-math.pi / 3, 0, math.pi / 3][: index + 1]:
                sword(draw, cx, cy - 130, 270, a, (232, 62, 62, 150 if a != 0 else 230), 10)
            if index == 2:
                chalk_text(draw, (795, 720), "方向只看 0° 到 180°", 42)
        else:
            if index >= 1:
                sword(draw, cx, cy - 180, h, math.pi / 2, (232, 62, 62, 235), 11)
                chalk_text(draw, (1075, 430), "最危险：沿高 = 1", 40)
            if index == 2:
                chalk_text(draw, (795, 720), "凸定理：不能更小", 48)

    elif shot in {"SH017", "SH021", "SH022"}:
        rounds = 1 if index == 0 else 2 if index == 1 else 3
        draw_perron_tree(draw, (900, 545), 300, rounds)
        if shot == "SH017":
            chalk_text(draw, (700, 760), "切分只分配方向，不删除方向", 42)
        elif shot == "SH021":
            line(draw, (570, 790, 1210, 790), (105, 225, 150, 230), 15)
            if index == 2:
                chalk_text(draw, (690, 820), "方向尺没有缺口", 42)
        else:
            if index == 2:
                chalk_text(draw, (725, 790), "并集面积压到 ε 以下", 46)

    elif shot in {"SH024", "SH029", "SH033", "SH034"}:
        if shot == "SH024":
            line(draw, (490, 520, 760, 520), (220, 55, 55, 240), 11)
            if index >= 1:
                chalk_text(draw, (905, 500), "面积 = 0", 58)
            if index == 2:
                chalk_text(draw, (850, 620), "但集合仍存在", 52)
        elif shot == "SH029":
            chalk_text(draw, (780, 440), "面积可以为 0", 58)
            if index >= 1:
                for i in range(9):
                    line(draw, (680 + i * 55, 560, 1120 - i * 32, 720), (95, 225, 150, 75), 5)
            if index == 2:
                chalk_text(draw, (865, 690), "维数 = 2", 68)
        elif shot == "SH033":
            cx, cy = 900, 535
            sword(draw, cx, cy, 460, 0, (220, 55, 55, 235), 12)
            if index >= 1:
                for i in range(19):
                    a = i * math.pi / 18
                    sword(draw, cx, cy, 420, a, (95, 225, 150, 54), 5)
            if index == 2:
                chalk_text(draw, (720, 760), "方向复杂度仍在", 52)
        else:
            chalk_text(draw, (700, 390), "挂谷针问题", 78)
            if index >= 1:
                chalk_text(draw, (650, 535), "面积可以小到消失", 56)
            if index == 2:
                chalk_text(draw, (620, 665), "方向复杂度不会消失", 60)

    elif shot in {"SH025", "SH026"}:
        cx, cy = 890, 535
        if shot == "SH025":
            sword(draw, cx, cy, 500, math.radians(-12), (225, 55, 55, 230), 8)
            if index >= 1:
                draw_delta_tube(draw, cx, cy, math.radians(-12), width=44 + 30 * index)
            if index == 2:
                chalk_text(draw, (1015, 650), "宽度 δ", 58)
        else:
            angle = [math.radians(8), math.radians(24), math.radians(50)][index]
            draw_delta_tube(draw, cx, cy, 0, width=58)
            draw_delta_tube(draw, cx, cy, angle, width=58, fill=(85, 205, 165, 76))
            draw.ellipse((cx - 55, cy - 36, cx + 75, cy + 45), fill=(235, 183, 72, 120))
            chalk_text(draw, (1050, 675), "夹角 α", 56)
            if index == 2:
                chalk_text(draw, (690, 745), "α 越大，重叠越短", 44)

    elif shot in {"SH030", "SH031"}:
        xs = [520, 850, 1180]
        labels = STAGES[shot]
        for i, x in enumerate(xs):
            active = i <= index
            alpha = 215 if active else 86
            draw.rounded_rectangle((x - 125, 410, x + 125, 670), radius=18, fill=(38, 45, 52, 115 if active else 55), outline=(235, 230, 198, alpha), width=4)
            if i == 0:
                draw_delta_tube(draw, x, 535, -0.25, 220, 38, (75, 160, 235, 90 if active else 38))
                draw_delta_tube(draw, x, 535, 0.35, 220, 38, (95, 225, 150, 90 if active else 38))
            elif i == 1:
                for r in [42, 78, 114]:
                    draw.ellipse((x - r, 535 - r, x + r, 535 + r), outline=(95, 225, 150, alpha), width=4)
            else:
                for k in range(5):
                    line(draw, (x - 100, 625 - k * 32, x + 95, 440 + k * 30), (120, 190, 245, 75 if active else 34), 5)
            chalk_text(draw, (x - 92, 690), labels[i], 34, (246, 241, 220, alpha))


def repair_shot(shot: str) -> None:
    folder = REAL / shot
    for frame in ("start", "key", "end"):
        path = folder / f"{frame}.png"
        if not path.exists():
            raise FileNotFoundError(path)
        backup(path)
        base = load(path)
        if frame == "start":
            base = darken(base, 0.94)
        layer = Image.new("RGBA", OUT_SIZE, (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        shot_overlay(draw, shot, frame)
        glow = layer.filter(ImageFilter.GaussianBlur(0.65))
        out = Image.alpha_composite(base.convert("RGBA"), glow)
        out = Image.alpha_composite(out, layer)
        save(path, out)


def main() -> None:
    for shot in PROBLEM_SHOTS:
        repair_shot(shot)
    print({"repaired_shots": len(PROBLEM_SHOTS), "shots": PROBLEM_SHOTS})


if __name__ == "__main__":
    main()
