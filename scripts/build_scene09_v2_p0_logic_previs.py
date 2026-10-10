#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, "/tmp/codex_pillow")

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "episodes/EP02/generated/scene09_v2_logic_previs_2026-07-21"
BG = ROOT / "assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png"

ASSETS = {
    "Byleth": "assets/characters/protagonist/Byleth/professor/selected.png",
    "Dimitri": "assets/characters/blue_lions/Dimitri/academy/selected.png",
    "Dedue": "assets/characters/blue_lions/Dedue/academy/selected.png",
    "Mercedes": "assets/characters/blue_lions/Mercedes/academy/selected.png",
    "Annette": "assets/characters/blue_lions/Annette/academy/selected.png",
    "Ashe": "assets/characters/blue_lions/Ashe/academy/selected.png",
    "Felix": "assets/characters/blue_lions/Felix/academy/selected.png",
    "Ingrid": "assets/characters/blue_lions/Ingrid/academy/selected.png",
    "Ferdinand": "assets/characters/black_eagles/Ferdinand/academy/selected.png",
    "Hubert": "assets/characters/black_eagles/Hubert/academy/selected.png",
    "Hanneman": "assets/characters/church_of_seiros/Hanneman/academy/selected.png",
    "Manuela": "assets/characters/church_of_seiros/Manuela/academy/selected.png",
    "Claude": "assets/characters/golden_deer/Claude/academy/selected.png",
}

HOUSE = {
    "Byleth": (230, 230, 230),
    "Dimitri": (45, 105, 210),
    "Dedue": (45, 105, 210),
    "Mercedes": (45, 105, 210),
    "Annette": (45, 105, 210),
    "Ashe": (45, 105, 210),
    "Felix": (45, 105, 210),
    "Ingrid": (45, 105, 210),
    "Ferdinand": (195, 45, 45),
    "Hubert": (195, 45, 45),
    "Hanneman": (220, 220, 220),
    "Manuela": (220, 220, 220),
    "Claude": (220, 175, 45),
}


def font(size=24):
    for path in (
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


FONT = font(23)
SMALL = font(18)
TITLE = font(34)


def load_bg():
    image = Image.open(BG).convert("RGBA")
    image = image.resize((1672, 941), Image.Resampling.LANCZOS)
    overlay = Image.new("RGBA", image.size, (10, 18, 24, 74))
    return Image.alpha_composite(image, overlay)


def portrait(name, size=(118, 150)):
    src = Image.open(ROOT / ASSETS[name]).convert("RGB")
    w, h = src.size
    crop = src.crop((int(w * 0.13), int(h * 0.02), int(w * 0.87), int(h * 0.64)))
    crop.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    x = (size[0] - crop.width) // 2
    y = (size[1] - crop.height) // 2
    canvas.paste(crop.convert("RGBA"), (x, y))
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=16, fill=255)
    canvas.putalpha(mask)
    return canvas


def draw_label(draw, xy, text, fill=(245, 246, 240), anchor="mm", fnt=SMALL):
    x, y = xy
    bbox = draw.textbbox((x, y), text, font=fnt, anchor=anchor)
    pad = 5
    draw.rounded_rectangle(
        (bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad),
        radius=7,
        fill=(12, 16, 18, 210),
    )
    draw.text((x, y), text, font=fnt, fill=fill, anchor=anchor)


def place(canvas, draw, name, xy, scale=1.0, facing=None):
    base = portrait(name)
    if scale != 1.0:
        base = base.resize((int(base.width * scale), int(base.height * scale)), Image.Resampling.LANCZOS)
    x, y = xy
    left = int(x - base.width / 2)
    top = int(y - base.height / 2)
    border = HOUSE.get(name, (220, 220, 220))
    draw.rounded_rectangle(
        (left - 4, top - 4, left + base.width + 4, top + base.height + 4),
        radius=20,
        fill=(10, 12, 16, 170),
        outline=border + (255,),
        width=5,
    )
    canvas.alpha_composite(base, (left, top))
    draw_label(draw, (x, top + base.height + 18), name)
    if facing:
        arrow(draw, (x, top - 6), facing, border, width=4)


def arrow(draw, start, end, color, width=6):
    sx, sy = start
    ex, ey = end
    draw.line((sx, sy, ex, ey), fill=color + (235,), width=width)
    dx, dy = ex - sx, ey - sy
    length = max((dx * dx + dy * dy) ** 0.5, 1)
    ux, uy = dx / length, dy / length
    px, py = -uy, ux
    head = 17
    p1 = (ex - ux * head + px * head * 0.55, ey - uy * head + py * head * 0.55)
    p2 = (ex - ux * head - px * head * 0.55, ey - uy * head - py * head * 0.55)
    draw.polygon((end, p1, p2), fill=color + (235,))


def lane(draw, points, color, width=8):
    draw.line(points, fill=color + (135,), width=width, joint="curve")


def title(draw, shot, phase, subtitle):
    draw.rounded_rectangle((26, 22, 740, 92), radius=14, fill=(8, 10, 14, 210))
    draw.text((48, 38), f"{shot} {phase}", fill=(255, 255, 255), font=TITLE)
    draw.text((258, 47), subtitle, fill=(222, 226, 222), font=SMALL)


def legend(draw):
    draw_label(draw, (1445, 38), "N / NE objective platform", fill=(255, 255, 255))
    arrow(draw, (1448, 82), (1550, 44), (235, 235, 235), width=4)


def save_frame(name, phase, subtitle, painter):
    canvas = load_bg()
    draw = ImageDraw.Draw(canvas, "RGBA")
    title(draw, name, phase, subtitle)
    legend(draw)
    painter(canvas, draw)
    out = OUT_DIR / f"{name}_{phase.lower()}_logic_previs.png"
    canvas.convert("RGB").save(out, quality=94)
    return out


def shot032_start(canvas, draw):
    lane(draw, [(250, 720), (610, 650), (835, 520), (940, 350)], (45, 105, 210))
    lane(draw, [(890, 255), (870, 410), (855, 530)], (195, 45, 45))
    place(canvas, draw, "Ferdinand", (835, 355), facing=(830, 505))
    place(canvas, draw, "Hubert", (990, 360), facing=(880, 520))
    place(canvas, draw, "Dedue", (835, 565), scale=1.08, facing=(830, 385))
    place(canvas, draw, "Dimitri", (690, 625), facing=(815, 460))
    place(canvas, draw, "Mercedes", (1110, 715), facing=(900, 565))
    arrow(draw, (990, 415), (865, 535), (70, 35, 95), width=8)
    draw_label(draw, (1015, 458), "dark pressure")
    draw_label(draw, (640, 500), "Dimitri starts to turn")
    draw_label(draw, (835, 735), "shield dips, Dedue remains standing")


def shot032_key(canvas, draw):
    lane(draw, [(250, 720), (610, 650), (835, 520), (980, 330)], (45, 105, 210))
    lane(draw, [(890, 255), (870, 410), (855, 530)], (195, 45, 45))
    place(canvas, draw, "Ferdinand", (835, 355), facing=(830, 505))
    place(canvas, draw, "Hubert", (990, 360), facing=(880, 520))
    place(canvas, draw, "Dedue", (835, 545), scale=1.08, facing=(830, 365))
    place(canvas, draw, "Dimitri", (690, 610), facing=(815, 430))
    place(canvas, draw, "Mercedes", (1110, 715), facing=(900, 545))
    arrow(draw, (1080, 665), (875, 540), (245, 250, 255), width=9)
    draw_label(draw, (1030, 625), "short white heal from cover")
    draw_label(draw, (830, 735), "shield line closes again")


def shot032a_start(canvas, draw):
    lane(draw, [(240, 720), (610, 690), (960, 610)], (45, 105, 210))
    lane(draw, [(210, 520), (600, 600), (1080, 650)], (220, 175, 45))
    place(canvas, draw, "Claude", (310, 470), facing=(700, 600))
    place(canvas, draw, "Annette", (905, 700), facing=(420, 560))
    place(canvas, draw, "Mercedes", (1070, 710), facing=(900, 675))
    place(canvas, draw, "Ashe", (675, 620), facing=(320, 500))
    arrow(draw, (330, 510), (830, 675), (220, 175, 45), width=6)
    draw_label(draw, (610, 548), "Golden Deer arrow lane cuts support")


def shot032a_key(canvas, draw):
    lane(draw, [(240, 720), (610, 690), (960, 610)], (45, 105, 210))
    lane(draw, [(210, 520), (600, 600), (1080, 650)], (220, 175, 45))
    place(canvas, draw, "Claude", (300, 455), facing=(675, 595))
    place(canvas, draw, "Annette", (905, 700), facing=(420, 560))
    place(canvas, draw, "Mercedes", (1070, 710), facing=(900, 675))
    place(canvas, draw, "Ashe", (660, 590), facing=(330, 475))
    for y in (570, 610, 650):
        draw.arc((470, y - 60, 980, y + 80), 188, 348, fill=(210, 210, 185, 160), width=10)
    arrow(draw, (680, 565), (330, 475), (45, 105, 210), width=6)
    draw_label(draw, (760, 520), "Annette dust cover opens Ashe angle")


def shot033b_start(canvas, draw):
    lane(draw, [(310, 725), (730, 570), (980, 375), (1190, 250)], (45, 105, 210))
    lane(draw, [(860, 315), (905, 480), (970, 600)], (195, 45, 45))
    place(canvas, draw, "Byleth", (805, 610), facing=(1190, 285))
    place(canvas, draw, "Ashe", (660, 600), facing=(1160, 260))
    place(canvas, draw, "Ingrid", (930, 630), facing=(1250, 295))
    place(canvas, draw, "Felix", (810, 480), facing=(935, 385))
    place(canvas, draw, "Ferdinand", (955, 365), facing=(820, 500))
    place(canvas, draw, "Hanneman", (1240, 210), facing=(980, 420))
    place(canvas, draw, "Manuela", (1370, 250), facing=(1080, 420))
    draw_label(draw, (1115, 355), "platform window opens")


def shot033b_key(canvas, draw):
    lane(draw, [(310, 725), (730, 570), (980, 375), (1190, 250)], (45, 105, 210))
    place(canvas, draw, "Byleth", (805, 610), facing=(1190, 285))
    place(canvas, draw, "Ashe", (660, 600), facing=(1160, 260))
    place(canvas, draw, "Ingrid", (930, 630), facing=(1250, 295))
    place(canvas, draw, "Felix", (810, 480), facing=(935, 385))
    place(canvas, draw, "Ferdinand", (955, 365), facing=(820, 500))
    place(canvas, draw, "Hanneman", (1240, 210), facing=(980, 420))
    place(canvas, draw, "Manuela", (1370, 250), facing=(1080, 420))
    arrow(draw, (820, 560), (1190, 285), (245, 245, 235), width=8)
    arrow(draw, (660, 545), (1165, 250), (45, 105, 210), width=5)
    arrow(draw, (930, 570), (1270, 290), (45, 105, 210), width=5)
    arrow(draw, (810, 420), (960, 365), (45, 105, 210), width=5)
    draw_label(draw, (970, 512), "Byleth: cut teachers")
    draw_label(draw, (1188, 320), "Ashe / Ingrid / Felix peel into routes")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    specs = [
        ("Shot032", "start", "Dedue shield strain before Mercedes heal", shot032_start),
        ("Shot032", "key", "short heal restores shield line", shot032_key),
        ("Shot032A", "start", "Golden Deer arrow lane pins support", shot032a_start),
        ("Shot032A", "key", "Annette dust cover lets Ashe recover angle", shot032a_key),
        ("Shot033B", "start", "objective window opens but routes not yet cut", shot033b_start),
        ("Shot033B", "key", "Byleth orders separate teacher-cut routes", shot033b_key),
    ]
    for shot, phase, subtitle, painter in specs:
        out = save_frame(shot, phase, subtitle, painter)
        manifest.append({
            "shot": shot,
            "phase": phase,
            "path": str(out.relative_to(ROOT)),
            "status": "logic_previs_only_not_final_keyframe",
            "uses_selected_character_assets": True,
            "purpose": subtitle,
        })
    make_contact_sheet([ROOT / item["path"] for item in manifest])
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf8")
    print(f"wrote {len(manifest)} logic previs frames to {OUT_DIR}")


def make_contact_sheet(paths):
    thumb_w, thumb_h = 520, 293
    pad = 28
    label_h = 38
    sheet = Image.new("RGB", (pad * 4 + thumb_w * 3, pad * 3 + (thumb_h + label_h) * 2), (18, 20, 23))
    d = ImageDraw.Draw(sheet)
    for index, path in enumerate(paths):
        row = index // 3
        col = index % 3
        x = pad + col * (thumb_w + pad)
        y = pad + row * (thumb_h + label_h + pad)
        img = Image.open(path).convert("RGB")
        img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        frame = Image.new("RGB", (thumb_w, thumb_h), (8, 10, 12))
        frame.paste(img, ((thumb_w - img.width) // 2, (thumb_h - img.height) // 2))
        sheet.paste(frame, (x, y + label_h))
        d.text((x, y), path.stem.replace("_logic_previs", ""), fill=(242, 242, 235), font=FONT)
    sheet.save(OUT_DIR / "contact_sheet_scene09_v2_p0_logic_previs.png", quality=94)


if __name__ == "__main__":
    main()
