#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"
EPISODE = SERIES / "EP02_annette_mercedes_c"
PACKAGE = EPISODE / "delivery" / "video_generation_package_2026-08-02_EP02_annette_mercedes_c_timing_safe_v2"

ANNETTE_LOCK = (
    "Academy-era Annette youth_v4: very petite short 15-16 year old orange-haired magic student, "
    "round youthful face, bright hardworking eyes, fresh natural skin, compact shoulders and small student frame, Blue Lions uniform, energetic and easily flustered; "
    "when standing beside Mercedes her head must sit clearly lower, around Mercedes's lower cheek, chin, or upper neck line, "
    "never the same height as Mercedes, never stretched tall, never mature adult, never glamorous model."
)
MERCEDES_LOCK = (
    "Academy-era Mercedes youth_v4: taller 18-year-old blonde healer student, visibly taller than Annette by about 25-30 cm, "
    "soft youthful refined face, warm eyes, side-swept bangs, black-gold hair ribbon, white high collar, beige cape and blue-black Blue Lions uniform, "
    "gentle senior-schoolmate presence, never elderly, motherly, adult noblewoman, or nun-like."
)
HEIGHT_NOTE = (
    "Relative height lock v4: Annette is very petite and significantly shorter than Mercedes in every two-shot; "
    "Mercedes remains the taller academy senior. Annette's head top should sit around Mercedes's lower cheek, chin, or upper neck line. Reject if Annette appears the same height as Mercedes or only slightly shorter."
)
YOUTH_NOTE = (
    "Academy youth_v4 lock: both characters must read as school-phase teenage students. Annette reads 15-16, very petite and earnest; "
    "Mercedes reads 18, gentle older classmate. Reject childlike Annette, mature adult actress, adult noble portrait, motherly/nun-like, heavy makeup, "
    "sharp cheekbones, eye bags, weathered skin, or glamorous editorial styling."
)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def shot_dir(shot_id: str) -> Path:
    matches = sorted((PACKAGE / "shots").glob(f"*_{shot_id}"))
    if len(matches) != 1:
        raise RuntimeError(f"expected one shot dir for {shot_id}, found {len(matches)}")
    return matches[0]


def apply_prompt_locks() -> None:
    shot_prompts = []
    for prompt_path in sorted((PACKAGE / "shots").glob("*/prompt.md")):
        text = prompt_path.read_text(encoding="utf-8")
        text = replace_identity_line(text, "Annette", ANNETTE_LOCK)
        text = replace_identity_line(text, "Mercedes", MERCEDES_LOCK)
        text = replace_or_insert_section(text, "Relative Height Lock:", HEIGHT_NOTE)
        text = replace_or_insert_section(text, "Academy Youth Lock:", YOUTH_NOTE)
        write_text(prompt_path, text)
        shot_prompts.append(text)
        meta_path = prompt_path.with_name("metadata.json")
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        meta["relative_height_lock"] = HEIGHT_NOTE
        meta["academy_youth_lock"] = YOUTH_NOTE
        meta["annette_height_status"] = "blocked_needs_revision_pending_regenerated_frames"
        write_json(meta_path, meta)
        storyboard = EPISODE / "storyboards" / meta["shot_id"]
        root_storyboard = SERIES / "storyboards" / meta["shot_id"]
        for target in [storyboard, root_storyboard]:
            if target.exists():
                shutil.copyfile(prompt_path, target / "prompt.md")
                shutil.copyfile(meta_path, target / "metadata.json")
    write_text(PACKAGE / "prompt.md", "\n\n".join(shot_prompts))
    manifest = json.loads((PACKAGE / "package_manifest.json").read_text(encoding="utf-8"))
    manifest["relative_height_lock"] = HEIGHT_NOTE
    manifest["academy_youth_lock"] = YOUTH_NOTE
    manifest["visual_revision_notes"] = "EP02 height repair: Annette regenerated as visibly shorter than Mercedes after viewer audit."
    write_json(PACKAGE / "package_manifest.json", manifest)


def replace_or_insert_section(text: str, heading: str, body: str) -> str:
    insertion = f"{heading}\n{body}\n\n"
    if heading not in text:
        return text.replace("Shot Purpose:\n", insertion + "Shot Purpose:\n")

    start = text.index(heading)
    after_heading = start + len(heading)
    rest = text[after_heading:]
    next_section = rest.find("\n\n")
    if next_section == -1:
        return text[:start] + insertion.rstrip() + "\n"
    end = after_heading + next_section + 2
    return text[:start] + insertion + text[end:]


def replace_identity_line(text: str, name: str, replacement: str) -> str:
    lines = text.splitlines()
    in_identity_lock = False
    for index, line in enumerate(lines):
        if line == "Identity Lock:":
            in_identity_lock = True
            continue
        if in_identity_lock and line and not line.startswith("- "):
            in_identity_lock = False
        if in_identity_lock and line.startswith(f"- {name}: "):
            lines[index] = f"- {name}: {replacement}"
    return "\n".join(lines) + ("\n" if text.endswith("\n") else "")


def split_sheet(raw_path: Path, out_dir: Path) -> dict[str, float]:
    out_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(raw_path, out_dir / "raw_widescreen_sheet.png")
    sheet = Image.open(raw_path).convert("RGB")
    w, h = sheet.size
    panels = []
    if h >= w:
        panel_h = h // 3
        for i in range(3):
            panels.append(sheet.crop((0, i * panel_h, w, (i + 1) * panel_h)))
    else:
        panel_w = w // 3
        for i in range(3):
            panels.append(sheet.crop((i * panel_w, 0, (i + 1) * panel_w, h)))
    frames = []
    for panel, name in zip(panels, ["start_frame.png", "key_frame.png", "end_frame.png"]):
        frame = ImageOps.fit(panel, (1280, 720), Image.Resampling.LANCZOS)
        frame.save(out_dir / name, quality=94)
        frames.append(frame)
    return {
        "start_key": round(mean_abs_diff(frames[0], frames[1]), 2),
        "key_end": round(mean_abs_diff(frames[1], frames[2]), 2),
        "start_end": round(mean_abs_diff(frames[0], frames[2]), 2),
    }


def mean_abs_diff(a: Image.Image, b: Image.Image) -> float:
    diff = ImageChops.difference(a, b).convert("L")
    hist = diff.histogram()
    total = sum(index * count for index, count in enumerate(hist))
    pixels = diff.size[0] * diff.size[1]
    return total / pixels


def apply_shot(shot_id: str, raw_path: Path) -> None:
    sdir = shot_dir(shot_id)
    diffs = split_sheet(raw_path, sdir)
    meta_path = sdir / "metadata.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["visual_status"] = "height_repaired_widescreen_sheet_frames_applied"
    meta["frame_source"] = "raw_widescreen_sheet.png regenerated for EP02 Annette/Mercedes relative height repair"
    meta["anchor_mean_abs_diff"] = diffs
    meta["no_artificial_side_fill"] = True
    meta["relative_height_lock"] = HEIGHT_NOTE
    meta["annette_height_status"] = "height_repaired_pending_manual_visual_review"
    write_json(meta_path, meta)
    for target in [EPISODE / "storyboards" / shot_id, SERIES / "storyboards" / shot_id]:
        target.mkdir(parents=True, exist_ok=True)
        for name in ["raw_widescreen_sheet.png", "start_frame.png", "key_frame.png", "end_frame.png", "prompt.md", "negative_prompt.md", "metadata.json"]:
            shutil.copyfile(sdir / name, target / name)
    update_package_manifest(shot_id)
    contact_sheet()


def update_package_manifest(shot_id: str | None = None) -> None:
    manifest = json.loads((PACKAGE / "package_manifest.json").read_text(encoding="utf-8"))
    manifest["relative_height_lock"] = HEIGHT_NOTE
    manifest["visual_revision_notes"] = "EP02 height repair: Annette regenerated as visibly shorter than Mercedes after viewer audit."
    if shot_id:
        repaired = set(manifest.get("height_repaired_shots", []))
        repaired.add(shot_id)
        manifest["height_repaired_shots"] = sorted(repaired)
    write_json(PACKAGE / "package_manifest.json", manifest)


def contact_sheet() -> None:
    paths = []
    for sdir in sorted((PACKAGE / "shots").iterdir()):
        if sdir.is_dir():
            for frame in ["start_frame.png", "key_frame.png", "end_frame.png"]:
                paths.append((sdir.name, frame, sdir / frame))
    cell_w, cell_h, label_h, cols = 320, 180, 36, 3
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_w, rows * (cell_h + label_h)), (245, 248, 252))
    draw = ImageDraw.Draw(sheet)
    for i, (shot, frame, path) in enumerate(paths):
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + label_h)
        thumb = ImageOps.fit(Image.open(path).convert("RGB"), (cell_w, cell_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x, y))
        draw.rectangle((x, y + cell_h, x + cell_w, y + cell_h + label_h), fill=(20, 28, 38))
        draw.text((x + 8, y + cell_h + 9), f"{shot} {frame}", fill=(235, 240, 248))
    sheet.save(PACKAGE / "visual_contact_sheet.jpg", quality=92)


def main() -> int:
    if len(sys.argv) == 1:
        apply_prompt_locks()
        update_package_manifest()
        print(json.dumps({"updated": "prompt_locks", "package": str(PACKAGE.relative_to(ROOT))}, ensure_ascii=False, indent=2))
        return 0
    if len(sys.argv) != 3:
        raise SystemExit("usage: repair_blue_lions_ep02_height.py [SHOT_ID RAW_SHEET_PATH]")
    apply_prompt_locks()
    apply_shot(sys.argv[1], Path(sys.argv[2]))
    print(json.dumps({"updated": sys.argv[1], "raw": sys.argv[2]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
