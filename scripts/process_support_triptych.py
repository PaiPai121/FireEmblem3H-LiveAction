#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFilter


def trim_flat_light_margins(img: Image.Image, threshold=248, contrast=4, padding=0) -> Image.Image:
    gray = img.convert("L")
    px = gray.load()

    def row_is_content(y):
        values = [px[x, y] for x in range(gray.width)]
        return (sum(values) / len(values)) < threshold or (max(values) - min(values)) > contrast

    def col_is_content(x):
        values = [px[x, y] for y in range(gray.height)]
        return (sum(values) / len(values)) < threshold or (max(values) - min(values)) > contrast

    content_rows = [y for y in range(gray.height) if row_is_content(y)]
    content_cols = [x for x in range(gray.width) if col_is_content(x)]
    if not content_rows or not content_cols:
        return img
    left, right = content_cols[0], content_cols[-1] + 1
    top, bottom = content_rows[0], content_rows[-1] + 1
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)
    if (right - left) < img.width * 0.35 or (bottom - top) < img.height * 0.35:
        return img
    return img.crop((left, top, right, bottom))


def trim_dark_margins(img: Image.Image, threshold=15, padding=0) -> Image.Image:
    gray = img.convert("L")
    px = gray.load()
    col_means = [sum(px[x, y] for y in range(gray.height)) / gray.height for x in range(gray.width)]
    row_means = [sum(px[x, y] for x in range(gray.width)) / gray.width for y in range(gray.height)]
    bright_cols = [i for i, value in enumerate(col_means) if value > threshold]
    bright_rows = [i for i, value in enumerate(row_means) if value > threshold]
    if not bright_cols or not bright_rows:
        return img
    left, right = bright_cols[0], bright_cols[-1] + 1
    top, bottom = bright_rows[0], bright_rows[-1] + 1
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)
    if (right - left) < img.width * 0.35 or (bottom - top) < img.height * 0.35:
        return img
    return img.crop((left, top, right, bottom))


def feather_mask(size, feather=56) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 255)
    px = mask.load()
    feather = min(feather, max(1, width // 4))
    for x in range(feather):
        alpha = int(255 * (x + 1) / feather)
        for y in range(height):
            px[x, y] = min(px[x, y], alpha)
            px[width - 1 - x, y] = min(px[width - 1 - x, y], alpha)
    return mask


def reflected_side_fill(foreground: Image.Image, left_width: int, right_width: int, size) -> Image.Image:
    width, height = size
    canvas = Image.new("RGB", size)
    strip = max(24, min(120, foreground.width // 5))
    if left_width > 0:
        left = foreground.crop((0, 0, strip, foreground.height)).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        left = left.resize((left_width, height), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(14))
        canvas.paste(left, (0, 0))
    if right_width > 0:
        right = foreground.crop((foreground.width - strip, 0, foreground.width, foreground.height)).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        right = right.resize((right_width, height), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(14))
        canvas.paste(right, (width - right_width, 0))
    if left_width == 0 or right_width == 0:
        cover = ImageOps.fit(foreground, size, method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(10))
        canvas.paste(cover)
    return canvas


def clean_panel_frame(img: Image.Image, max_size=(1280, 720)) -> Image.Image:
    img = trim_flat_light_margins(img.convert("RGB"))
    img = trim_dark_margins(img)
    return ImageOps.contain(img, max_size, method=Image.Resampling.LANCZOS)


def fit_16x9(img: Image.Image, size=(1280, 720)) -> Image.Image:
    img = trim_dark_margins(img.convert("RGB"))
    foreground = ImageOps.contain(img, size, method=Image.Resampling.LANCZOS)
    x = (size[0] - foreground.width) // 2
    y = (size[1] - foreground.height) // 2
    background = reflected_side_fill(foreground, x, size[0] - x - foreground.width, size)
    if y > 0:
        top = foreground.crop((0, 0, foreground.width, min(48, foreground.height))).resize((foreground.width, y), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(12))
        bottom = foreground.crop((0, max(0, foreground.height - 48), foreground.width, foreground.height)).resize((foreground.width, size[1] - y - foreground.height), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(12))
        background.paste(top, (x, 0))
        background.paste(bottom, (x, y + foreground.height))
    background.paste(foreground, (x, y), feather_mask(foreground.size))
    return background


def split_triptych(input_path: Path, shot_dir: Path, storyboard_dir: Path) -> None:
    shot_dir.mkdir(parents=True, exist_ok=True)
    storyboard_dir.mkdir(parents=True, exist_ok=True)
    img = trim_flat_light_margins(Image.open(input_path).convert("RGB"))
    raw = shot_dir / "raw_triptych.png"
    img.save(raw)

    w, h = img.size
    names = ["start_frame.png", "key_frame.png", "end_frame.png"]
    for i, name in enumerate(names):
        left = int(round(w * i / 3))
        right = int(round(w * (i + 1) / 3))
        panel = img.crop((left, 0, right, h))
        frame = fit_16x9(clean_panel_frame(panel))
        frame.save(shot_dir / name)
        frame.save(storyboard_dir / name)


def make_contact_sheet(package_dir: Path) -> None:
    shots_dir = package_dir / "shots"
    shot_dirs = sorted([p for p in shots_dir.iterdir() if p.is_dir()])
    thumbs = []
    labels = []
    for shot_dir in shot_dirs:
        for frame_name in ["start_frame.png", "key_frame.png", "end_frame.png"]:
            frame_path = shot_dir / frame_name
            if frame_path.exists():
                thumb = ImageOps.contain(Image.open(frame_path).convert("RGB"), (320, 180), Image.Resampling.LANCZOS)
                cell = Image.new("RGB", (320, 180), (246, 248, 250))
                cell.paste(thumb, ((320 - thumb.width) // 2, (180 - thumb.height) // 2))
                thumbs.append(cell)
                labels.append(f"{shot_dir.name}\n{frame_name.replace('_frame.png', '')}")
    if not thumbs:
        return
    cols = 3
    rows = (len(thumbs) + cols - 1) // cols
    label_h = 42
    sheet = Image.new("RGB", (cols * 320, rows * (180 + label_h)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, thumb in enumerate(thumbs):
        x = (i % cols) * 320
        y = (i // cols) * (180 + label_h)
        sheet.paste(thumb, (x, y))
        draw.rectangle((x, y + 180, x + 319, y + 180 + label_h), fill=(246, 248, 250))
        draw.text((x + 8, y + 186), labels[i], fill=(32, 36, 42))
    sheet.save(package_dir / "visual_contact_sheet.jpg", quality=92)


def validate_links(package_dir: Path) -> dict:
    html = package_dir / "asset_viewer.html"
    missing = []
    if html.exists():
        text = html.read_text()
        import re
        for attr in re.findall(r'(?:src|href)="([^"]+)"', text):
            if attr.startswith("http"):
                continue
            attr_path = attr.split("#", 1)[0]
            if not attr_path:
                continue
            if not (package_dir / attr_path).exists():
                missing.append(attr)
    return {"package": str(package_dir), "missing_links": missing, "ok": not missing}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path)
    parser.add_argument("--shot-dir", type=Path)
    parser.add_argument("--storyboard-dir", type=Path)
    parser.add_argument("--contact-sheet", type=Path)
    parser.add_argument("--validate-viewer", type=Path)
    args = parser.parse_args()

    if args.input:
        if not args.shot_dir or not args.storyboard_dir:
            raise SystemExit("--input requires --shot-dir and --storyboard-dir")
        split_triptych(args.input, args.shot_dir, args.storyboard_dir)
    if args.contact_sheet:
        make_contact_sheet(args.contact_sheet)
    if args.validate_viewer:
        print(json.dumps(validate_links(args.validate_viewer), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
