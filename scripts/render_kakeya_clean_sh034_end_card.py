#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "specials" / "kakeya_byleth_lecture" / "real_frames"
FONT_CN = "/System/Library/Fonts/STHeiti Medium.ttc"
OUT_SIZE = (1672, 941)
STAMP = "before_clean_end_card_2026-08-01"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_CN, size)


def backup(path: Path) -> None:
    target = path.with_name(f"{path.stem}_{STAMP}{path.suffix}")
    if not target.exists():
        target.write_bytes(path.read_bytes())


def chalk_text(draw: ImageDraw.ImageDraw, center: tuple[int, int], text: str, size: int, fill=(82, 45, 34, 245)) -> None:
    f = font(size)
    bbox = draw.textbbox((0, 0), text, font=f)
    x = center[0] - (bbox[2] - bbox[0]) // 2
    y = center[1] - (bbox[3] - bbox[1]) // 2
    draw.text((x + 3, y + 4), text, font=f, fill=(255, 255, 255, 90))
    draw.text((x, y), text, font=f, fill=fill)


def parchment() -> Image.Image:
    base_path = REAL / "_bases" / "SH008_parchment.png"
    if base_path.exists():
        img = Image.open(base_path).convert("RGB").resize(OUT_SIZE, Image.Resampling.LANCZOS)
    else:
        img = Image.new("RGB", OUT_SIZE, (223, 191, 136))
    layer = Image.new("RGBA", OUT_SIZE, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rectangle((140, 70, 1532, 870), outline=(95, 58, 40, 95), width=4)
    d.rectangle((170, 100, 1502, 840), outline=(95, 58, 40, 55), width=2)
    vignette = Image.new("RGBA", OUT_SIZE, (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    for i in range(90):
        vd.rectangle((i, i, OUT_SIZE[0] - i, OUT_SIZE[1] - i), outline=(55, 28, 20, max(0, 90 - i)))
    return Image.alpha_composite(Image.alpha_composite(img.convert("RGBA"), layer), vignette).convert("RGB")


def draw_stage(frame: str) -> Image.Image:
    img = parchment().convert("RGBA")
    layer = Image.new("RGBA", OUT_SIZE, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.line((430, 585, 1242, 585), fill=(110, 68, 44, 160), width=5)

    cx, cy = 836, 520
    if frame == "start":
        for i in range(15):
            angle = i * 3.14159 / 14
            dx = int(300 * __import__("math").cos(angle))
            dy = int(190 * __import__("math").sin(angle))
            d.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=(77, 137, 122, 34), width=9)
        d.line((cx - 330, cy, cx + 330, cy), fill=(127, 50, 45, 95), width=13)
    elif frame == "key":
        d.ellipse((cx - 390, cy - 250, cx + 390, cy + 250), fill=(85, 132, 186, 44), outline=(85, 132, 186, 88), width=9)
        d.line((cx - 390, cy + 255, cx + 390, cy + 255), fill=(85, 132, 186, 88), width=10)
    else:
        for i in range(23):
            angle = i * 3.14159 / 22
            dx = int(335 * __import__("math").cos(angle))
            dy = int(215 * __import__("math").sin(angle))
            d.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=(127, 40, 54, 42), width=8)
        d.ellipse((cx - 360, cy - 225, cx + 360, cy + 225), outline=(127, 40, 54, 82), width=7)

    if frame == "start":
        chalk_text(d, (836, 355), "挂谷针问题", 86, (74, 42, 34, 245))
        chalk_text(d, (836, 500), "一把针，所有方向", 58, (116, 65, 47, 230))
    elif frame == "key":
        chalk_text(d, (836, 340), "面积可以小到消失", 76, (74, 42, 34, 245))
        chalk_text(d, (836, 505), "但方向还在", 74, (139, 45, 54, 240))
    else:
        chalk_text(d, (836, 330), "面积会消失", 74, (74, 42, 34, 245))
        chalk_text(d, (836, 470), "方向不会消失", 86, (139, 45, 54, 245))
        chalk_text(d, (836, 690), "二维挂谷针问题", 52, (74, 42, 34, 230))

    d.rounded_rectangle((535, 765, 1137, 842), radius=18, outline=(109, 70, 44, 150), width=4)
    labels = {"start": "开场问题", "key": "核心反转", "end": "最终命题"}
    chalk_text(d, (836, 803), labels[frame], 34, (92, 55, 40, 225))
    glow = layer.filter(ImageFilter.GaussianBlur(0.7))
    return Image.alpha_composite(Image.alpha_composite(img, glow), layer).convert("RGB")


def main() -> None:
    folder = REAL / "SH034"
    for frame in ("start", "key", "end"):
        path = folder / f"{frame}.png"
        backup(path)
        draw_stage(frame).save(path, quality=95)
    print({"rendered": "SH034", "frames": ["start", "key", "end"]})


if __name__ == "__main__":
    main()
