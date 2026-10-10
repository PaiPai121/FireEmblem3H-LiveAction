#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
EP_DIR = ROOT / "episodes" / "EP03"
QUEUE_PATH = EP_DIR / "frame_generation_queue.json"
OUT_SIZE = (1280, 720)


def cover_image(path: Path, size=OUT_SIZE) -> Image.Image:
    image = Image.open(path).convert("RGB")
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((math.ceil(image.width * scale), math.ceil(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def make_fog_layer(size=OUT_SIZE, opacity=70) -> Image.Image:
    fog = Image.new("RGBA", size, (205, 213, 207, 0))
    draw = ImageDraw.Draw(fog)
    for y in range(-80, size[1] + 80, 70):
        alpha = opacity + (y % 120) // 4
        draw.ellipse((-220, y, size[0] + 220, y + 180), fill=(210, 218, 212, min(120, alpha)))
    return fog.filter(ImageFilter.GaussianBlur(38))


def infer_background_color(image: Image.Image) -> tuple[int, int, int]:
    sample = Image.new("RGB", (1, 1))
    corners = [
        image.crop((0, 0, max(1, image.width // 8), max(1, image.height // 8))),
        image.crop((image.width - max(1, image.width // 8), 0, image.width, max(1, image.height // 8))),
        image.crop((0, image.height - max(1, image.height // 8), max(1, image.width // 8), image.height)),
        image.crop((image.width - max(1, image.width // 8), image.height - max(1, image.height // 8), image.width, image.height)),
    ]
    colors = []
    for corner in corners:
        sample.paste(corner.resize((1, 1), Image.Resampling.BOX), (0, 0))
        colors.append(sample.getpixel((0, 0)))
    return tuple(sorted(channel)[len(channel) // 2] for channel in zip(*colors))


def subject_mask(image: Image.Image) -> Image.Image:
    bg = Image.new("RGB", image.size, infer_background_color(image))
    diff = ImageChops.difference(image, bg).convert("L")
    diff = ImageOps.autocontrast(diff)
    mask = diff.point(lambda v: 255 if v > 20 else 0)
    mask = mask.filter(ImageFilter.MaxFilter(15))
    mask = mask.filter(ImageFilter.MinFilter(7))
    mask = mask.filter(ImageFilter.GaussianBlur(4))

    # Local selected.png files are approved actor plates with baked-in backgrounds.
    # A deterministic human matte is safer than pretending the whole source image is transparent.
    w, h = image.size
    matte = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(matte)
    draw.ellipse((0.34 * w, 0.03 * h, 0.66 * w, 0.22 * h), fill=245)  # head/hair
    draw.polygon([(0.31 * w, 0.20 * h), (0.69 * w, 0.20 * h), (0.75 * w, 0.58 * h), (0.25 * w, 0.58 * h)], fill=245)
    draw.polygon([(0.26 * w, 0.23 * h), (0.42 * w, 0.25 * h), (0.36 * w, 0.66 * h), (0.15 * w, 0.62 * h)], fill=210)
    draw.polygon([(0.58 * w, 0.25 * h), (0.74 * w, 0.23 * h), (0.85 * w, 0.62 * h), (0.64 * w, 0.66 * h)], fill=210)
    draw.polygon([(0.33 * w, 0.55 * h), (0.50 * w, 0.55 * h), (0.47 * w, 0.98 * h), (0.28 * w, 0.98 * h)], fill=235)
    draw.polygon([(0.50 * w, 0.55 * h), (0.67 * w, 0.55 * h), (0.72 * w, 0.98 * h), (0.53 * w, 0.98 * h)], fill=235)
    matte = matte.filter(ImageFilter.GaussianBlur(9))

    actor_floor = matte.point(lambda v: min(255, int(v * 0.96)))
    actor_gate = matte.point(lambda v: min(255, int(v * 1.5)))
    mask = ImageChops.multiply(ImageChops.lighter(mask, actor_floor), actor_gate)
    mask = ImageEnhance.Contrast(mask).enhance(1.25)
    return mask.filter(ImageFilter.GaussianBlur(1.0))


def character_cutout(path: Path, target_h: int, mirror: bool = False) -> Image.Image:
    image = Image.open(path).convert("RGB")
    if mirror:
        image = ImageOps.mirror(image)
    scale = target_h / image.height
    target_w = max(1, round(image.width * scale))
    image = image.resize((target_w, target_h), Image.Resampling.LANCZOS)
    mask = subject_mask(image)
    # Fade the very bottom into the floor so the source rectangle never reads as a card.
    fade = Image.new("L", image.size, 255)
    fd = ImageDraw.Draw(fade)
    fade_h = max(24, image.height // 9)
    for i in range(fade_h):
        alpha = int(255 * (1 - i / fade_h))
        fd.line((0, image.height - fade_h + i, image.width, image.height - fade_h + i), fill=alpha)
    mask = ImageChops.multiply(mask, fade.filter(ImageFilter.GaussianBlur(6)))
    rgba = image.convert("RGBA")
    rgba.putalpha(mask)
    rgba = ImageEnhance.Contrast(rgba).enhance(1.08)
    rgba = ImageEnhance.Color(rgba).enhance(0.9)
    return rgba


def paste_character(canvas: Image.Image, char: Image.Image, x: int, y: int, depth: float = 1.0) -> None:
    shadow = Image.new("RGBA", char.size, (0, 0, 0, 0))
    shadow_alpha = char.getchannel("A").filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * 0.22 * depth))
    shadow.putalpha(shadow_alpha)
    canvas.alpha_composite(shadow, (x + 10, y + 18))

    foot = Image.new("RGBA", (max(40, char.width), 60), (0, 0, 0, 0))
    fd = ImageDraw.Draw(foot)
    fd.ellipse((0, 12, foot.width, 54), fill=(0, 0, 0, int(72 * depth)))
    foot = foot.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(foot, (x, min(OUT_SIZE[1] - 84, y + char.height - 46)))
    canvas.alpha_composite(char, (x, y))


def fallback_location(metadata: dict) -> Path:
    text = " ".join(str(metadata.get(key, "")) for key in ["location", "scene", "purpose"]).lower()
    if "classroom" in text or "教室" in text:
        return ROOT / "assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png"
    if "cathedral" in text or "council" in text or "大教堂" in text or "教会" in text:
        return ROOT / "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png"
    if "monastery" in text or "修道院" in text or "出征" in text:
        return ROOT / "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png"
    if "village" in text or "村" in text:
        return ROOT / "assets/locations/EP03/act01/FaerghusBorderVillage/FaerghusBorderVillage_reference.png"
    if "chapel" in text or "ruin" in text or "礼拜堂" in text or "废墟" in text:
        return ROOT / "assets/locations/EP03/act01/FogChapelRuins/FogChapelRuins_reference.png"
    if "camp" in text or "rebel" in text or "叛军" in text:
        return ROOT / "assets/locations/EP03/act01/WesternChurchRebelCamp/WesternChurchRebelCamp_reference.png"
    return ROOT / "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png"


def pick_assets(metadata: dict) -> tuple[Path, list[Path]]:
    refs = [ROOT / ref for ref in metadata.get("asset_references", [])]
    location = next((ref for ref in refs if "/locations/" in ref.as_posix() and ref.exists()), None)
    if location is None:
        location = fallback_location(metadata)
    chars = [ref for ref in refs if "/characters/" in ref.as_posix() and ref.exists()]
    return location, chars[:6]


def make_frame(metadata: dict, variant: str) -> Image.Image:
    location, chars = pick_assets(metadata)
    base = cover_image(location).convert("RGBA")
    base = ImageEnhance.Color(base).enhance(0.78)
    base = ImageEnhance.Contrast(base).enhance(0.92)

    if "fog" in metadata.get("location", "").lower() or "battlefield" in metadata.get("location", ""):
        base.alpha_composite(make_fog_layer(opacity=55))

    # Subtle letterbox gives every frame the same film-storyboard surface.
    grade = Image.new("RGBA", OUT_SIZE, (10, 18, 20, 28))
    base.alpha_composite(grade)
    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, OUT_SIZE[0], 48), fill=(0, 0, 0, 190))
    draw.rectangle((0, OUT_SIZE[1] - 48, OUT_SIZE[0], OUT_SIZE[1]), fill=(0, 0, 0, 190))

    if not chars:
        return base.convert("RGB")

    count = len(chars)
    if variant == "start":
        heights = [465, 410, 370, 340, 310, 290]
        xs = [75, 345, 600, 800, 955, 1095]
    elif variant == "key":
        heights = [540, 480, 420, 375, 335, 305]
        xs = [115, 390, 625, 810, 970, 1100]
    else:
        heights = [455, 420, 375, 345, 315, 290]
        xs = [170, 440, 665, 835, 980, 1095]

    if count == 1:
        xs = [480 if variant != "key" else 430]
    elif count == 2:
        xs = [260, 690] if variant != "key" else [210, 700]
    elif count == 3:
        xs = [130, 500, 830] if variant != "key" else [170, 520, 815]
    elif count == 5:
        xs = [70, 335, 575, 795, 1000] if variant != "key" else [100, 360, 590, 790, 1000]
    elif count >= 6:
        xs = [35, 275, 500, 695, 875, 1040] if variant != "key" else [60, 300, 520, 705, 880, 1040]

    for idx, char_path in enumerate(chars):
        h = heights[min(idx, len(heights) - 1)]
        card = character_cutout(char_path, h, mirror=(idx % 2 == 1 and variant != "start"))
        x = xs[min(idx, len(xs) - 1)]
        y = OUT_SIZE[1] - 48 - card.height
        if idx % 2 and variant == "key":
            y += 16
        paste_character(base, card, x, y, depth=max(0.55, 1.0 - idx * 0.1))

    # Direction/action cue without text: a warm key-beat slash or cool end wash.
    overlay = Image.new("RGBA", OUT_SIZE, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    if variant == "key":
        od.polygon([(0, 610), (1280, 420), (1280, 520), (0, 700)], fill=(190, 160, 90, 34))
    elif variant == "end":
        od.rectangle((0, 0, 1280, 720), fill=(70, 85, 96, 26))
    base.alpha_composite(overlay)

    foreground_fog = make_fog_layer(opacity=12 if variant != "key" else 6)
    base.alpha_composite(foreground_fog)
    return base.convert("RGB")


def build_contact_sheet(items: list[tuple[str, Path]], out: Path) -> None:
    thumb_w, thumb_h = 320, 180
    cols = 6
    rows = math.ceil(len(items) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), (15, 18, 17))
    for i, (_, img_path) in enumerate(items):
        img = Image.open(img_path).convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(img, ((i % cols) * thumb_w, (i // cols) * thumb_h))
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, quality=92)


def main() -> None:
    queue = json.loads(QUEUE_PATH.read_text())
    contact_items: list[tuple[str, Path]] = []

    for shot in queue["shots"]:
        metadata_path = EP_DIR / shot["frame_spec"].replace("frame_spec.md", "metadata.json")
        metadata = json.loads(metadata_path.read_text())
        shot_dir = EP_DIR / "storyboards" / shot["id"]
        shot_dir.mkdir(parents=True, exist_ok=True)
        for variant in ["start", "key", "end"]:
            out = shot_dir / f"{variant}_frame.png"
            make_frame(metadata, variant).save(out)
            if variant == "key":
                contact_items.append((shot["id"], out))

    build_contact_sheet(contact_items, EP_DIR / "generated_storyboard_contact_sheet.jpg")
    print(f"generated {len(queue['shots']) * 3} storyboard frames")


if __name__ == "__main__":
    main()
