#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"
EPISODE = SERIES / "EP04_sylvain_mercedes_c"
PACKAGE = EPISODE / "delivery" / "video_generation_package_2026-08-02_EP04_sylvain_mercedes_c_timing_safe_v2"

SYLVAIN_LOCK = (
    "Academy-era Sylvain: 19-year-old red-haired Blue Lions noble student, tousled warm red hair, relaxed charm with tired clever eyes, "
    "dark academy uniform with tan lapels and gold trim, easy teasing posture, never modern playboy, never oily, never middle-aged."
)
MERCEDES_LOCK = (
    "Academy-era Mercedes identity_v4: 18-year-old gentle blonde healer student from Fire Emblem: Three Houses, soft rounded youthful face, "
    "large warm blue-lavender eyes, pale-blonde side-swept bangs, long side ponytail gathered at her right shoulder with a clearly visible black-and-gold striped ribbon, "
    "white high collar and white neck scarf, gold geometric chest trim, beige shoulder cape with blue linework over the blue-black Blue Lions academy uniform, "
    "warm slightly absent-minded older-classmate presence; must read as Mercedes, not a generic blonde church girl. "
    "Reject sharp mature face, adult noblewoman, glamor model, nun-like or motherly styling, missing hair ribbon, missing beige cape, loose generic blonde hair, heavy makeup, or aged skin."
)
IDENTITY_NOTE = (
    "Mercedes identity_v4 lock: every EP04 frame must preserve Mercedes's canon academy identifiers: soft youthful rounded face, warm blue-lavender eyes, "
    "pale-blonde side-swept bangs, long side ponytail over her right shoulder, black-and-gold striped hair ribbon, white high collar and scarf, gold geometric chest trim, "
    "beige cape with blue linework, and gentle slightly absent-minded student warmth. Reject if she looks like a generic blonde church student, adult noblewoman, model, nun, or motherly healer."
)
DOWNGRADE_REASON = (
    "User feedback on 2026-08-10: EP04 Sylvain/Mercedes frames do not read as Mercedes. Prior approval downgraded because the delivered woman drifted into a generic/mature blonde church student, "
    "with unstable Mercedes hair ribbon, beige cape, face shape, and youthful student identity."
)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


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


def shot_dir(shot_id: str) -> Path:
    matches = sorted((PACKAGE / "shots").glob(f"*_{shot_id}"))
    if len(matches) != 1:
        raise RuntimeError(f"expected one shot dir for {shot_id}, found {len(matches)}")
    return matches[0]


def sync_to_storyboards(sdir: Path, meta: dict) -> None:
    shot_id = meta["shot_id"]
    for target in [EPISODE / "storyboards" / shot_id, SERIES / "storyboards" / shot_id]:
        target.mkdir(parents=True, exist_ok=True)
        for name in [
            "raw_widescreen_sheet.png",
            "start_frame.png",
            "key_frame.png",
            "end_frame.png",
            "prompt.md",
            "negative_prompt.md",
            "metadata.json",
        ]:
            source = sdir / name
            if source.exists():
                shutil.copyfile(source, target / name)


def apply_prompt_locks() -> None:
    shot_prompts = []
    for prompt_path in sorted((PACKAGE / "shots").glob("*/prompt.md")):
        text = prompt_path.read_text(encoding="utf-8")
        text = replace_identity_line(text, "Sylvain", SYLVAIN_LOCK)
        text = replace_identity_line(text, "Mercedes", MERCEDES_LOCK)
        text = replace_or_insert_section(text, "Mercedes Identity Lock:", IDENTITY_NOTE)
        write_text(prompt_path, text)
        shot_prompts.append(text)

        meta_path = prompt_path.with_name("metadata.json")
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        meta["mercedes_identity_lock"] = IDENTITY_NOTE
        meta["mercedes_identity_status"] = "blocked_needs_revision_pending_regenerated_frames"
        meta["visual_status"] = "blocked_needs_revision"
        meta["downgrade_reason"] = DOWNGRADE_REASON
        write_json(meta_path, meta)
        sync_to_storyboards(prompt_path.parent, meta)

    write_text(PACKAGE / "prompt.md", "\n\n".join(shot_prompts))
    manifest = json.loads((PACKAGE / "package_manifest.json").read_text(encoding="utf-8"))
    manifest["mercedes_identity_lock"] = IDENTITY_NOTE
    manifest["mercedes_identity_status"] = "blocked_needs_revision_pending_regenerated_frames"
    manifest["downgrade_reason"] = DOWNGRADE_REASON
    manifest["mercedes_identity_repaired_shots"] = sorted(set(manifest.get("mercedes_identity_repaired_shots", [])))
    write_json(PACKAGE / "package_manifest.json", manifest)

    package_meta = json.loads((PACKAGE / "metadata.json").read_text(encoding="utf-8"))
    package_meta["mercedes_identity_lock"] = IDENTITY_NOTE
    package_meta["mercedes_identity_status"] = "blocked_needs_revision_pending_regenerated_frames"
    write_json(PACKAGE / "metadata.json", package_meta)

    review = EPISODE / "production_system" / "reviews" / "mercedes_identity_reaudit_2026-08-10.md"
    write_text(
        review,
        "# Mercedes Identity Re-Audit - 2026-08-10\n\n"
        f"Status: blocked_needs_revision\n\n{DOWNGRADE_REASON}\n\n"
        "Required fix: regenerate EP04 shot frames with Mercedes identity_v4 lock before any approval is restored.\n",
    )


def mean_abs_diff(a: Image.Image, b: Image.Image) -> float:
    diff = ImageChops.difference(a, b).convert("L")
    hist = diff.histogram()
    total = sum(index * count for index, count in enumerate(hist))
    return total / (diff.size[0] * diff.size[1])


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


def apply_shot(shot_id: str, raw_path: Path) -> None:
    apply_prompt_locks()
    sdir = shot_dir(shot_id)
    diffs = split_sheet(raw_path, sdir)
    meta_path = sdir / "metadata.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["visual_status"] = "mercedes_identity_v4_frames_applied_pending_manual_visual_review"
    meta["frame_source"] = "raw_widescreen_sheet.png regenerated for EP04 Mercedes identity_v4 repair"
    meta["anchor_mean_abs_diff"] = diffs
    meta["no_artificial_side_fill"] = True
    meta["mercedes_identity_lock"] = IDENTITY_NOTE
    meta["mercedes_identity_status"] = "identity_v4_repaired_pending_manual_visual_review"
    write_json(meta_path, meta)
    sync_to_storyboards(sdir, meta)

    manifest = json.loads((PACKAGE / "package_manifest.json").read_text(encoding="utf-8"))
    repaired = set(manifest.get("mercedes_identity_repaired_shots", []))
    repaired.add(shot_id)
    manifest["mercedes_identity_repaired_shots"] = sorted(repaired)
    manifest["mercedes_identity_status"] = "identity_v4_repair_in_progress"
    write_json(PACKAGE / "package_manifest.json", manifest)
    contact_sheet()


def main() -> int:
    if len(sys.argv) == 1:
        apply_prompt_locks()
        contact_sheet()
        print(json.dumps({"updated": "ep04_mercedes_identity_locks", "package": str(PACKAGE.relative_to(ROOT))}, ensure_ascii=False, indent=2))
        return 0
    if len(sys.argv) != 3:
        raise SystemExit("usage: repair_blue_lions_ep04_mercedes_identity.py [SHOT_ID RAW_SHEET_PATH]")
    apply_shot(sys.argv[1], Path(sys.argv[2]))
    print(json.dumps({"updated": sys.argv[1], "raw": sys.argv[2]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
