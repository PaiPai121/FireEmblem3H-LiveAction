#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "specials" / "kakeya_byleth_lecture" / "real_frames"
FONT_CN = "/System/Library/Fonts/STHeiti Medium.ttc"
OUT_SIZE = (1672, 941)
STAMP = "before_end_anchor_boost_2026-08-01"


END_LABELS = {
    "SH003": "结论：圆盘只是固定中心直觉",
    "SH004": "结论：中心可以移动",
    "SH008": "结论：4a = 1，所以 a = 1/4",
    "SH012": "结论：连线不出界才叫凸",
    "SH013": "结论：三角形内可覆盖 0° 到 180°",
    "SH014": "结论：凸区域下界交给凸定理",
    "SH024": "结论：面积为 0，不等于不存在",
    "SH025": "结论：把线段加粗成宽度 δ 的管",
    "SH031": "结论：最大平均、波包、细管重叠相连",
    "SH033": "结论：回到木剑，方向复杂度仍在",
    "SH034": "结论：面积会消失，方向不会消失",
}


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_CN, size)


def backup(path: Path) -> None:
    target = path.with_name(f"{path.stem}_{STAMP}{path.suffix}")
    if not target.exists():
        target.write_bytes(path.read_bytes())


def chalk_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int) -> None:
    f = font(size)
    x, y = xy
    for dx, dy, alpha in [(-2, 2, 80), (2, 2, 60), (0, -2, 50)]:
        draw.text((x + dx, y + dy), text, font=f, fill=(255, 255, 255, alpha))
    draw.text((x, y), text, font=f, fill=(248, 242, 218, 245))


def add_end_anchor(path: Path, label: str) -> None:
    backup(path)
    img = Image.open(path).convert("RGB")
    if img.size != OUT_SIZE:
        img = img.resize(OUT_SIZE, Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", OUT_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = 470, 735, 1505, 878
    draw.rounded_rectangle((x0, y0, x1, y1), radius=24, fill=(24, 28, 31, 205), outline=(246, 228, 170, 205), width=5)
    draw.line((x0 + 34, y0 + 34, x1 - 34, y0 + 34), fill=(246, 228, 170, 175), width=4)
    chalk_text(draw, (x0 + 44, y0 + 55), label, 46 if len(label) <= 19 else 38)
    draw.ellipse((x0 - 20, y0 - 20, x0 + 20, y0 + 20), fill=(235, 190, 82, 235))
    draw.ellipse((x1 - 20, y1 - 20, x1 + 20, y1 + 20), fill=(235, 190, 82, 235))
    glow = layer.filter(ImageFilter.GaussianBlur(1.1))
    out = Image.alpha_composite(img.convert("RGBA"), glow)
    out = Image.alpha_composite(out, layer)
    out.convert("RGB").save(path, quality=95)


def main() -> None:
    for shot, label in END_LABELS.items():
        add_end_anchor(REAL / shot / "end.png", label)
    print({"boosted_end_frames": len(END_LABELS), "shots": list(END_LABELS)})


if __name__ == "__main__":
    main()
