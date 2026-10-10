#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path.cwd()
DATE = "2026-08-01"
PACKAGE_DIR = ROOT / "delivery/scene09_v3_monitor_handoff_package_2026-07-27"
PACKAGE_MANIFEST = PACKAGE_DIR / "package_manifest.json"
REVIEW_DIR = ROOT / "production_system/reviews"
REPORT_DIR = ROOT / "production_system/scene09_v3_attrition_package"
OUT_IMAGE = REVIEW_DIR / f"scene09_v3_high_risk_contact_sheet_ascii_{DATE}.jpg"
OUT_JSON = REPORT_DIR / f"scene09_v3_high_risk_contact_sheet_ascii_{DATE}.json"
OUT_MD = REPORT_DIR / f"scene09_v3_high_risk_contact_sheet_ascii_{DATE}.md"
PACKAGE_IMAGE = PACKAGE_DIR / f"high_risk_contact_sheet_ascii_{DATE}.jpg"
PACKAGE_JSON = PACKAGE_DIR / "high_risk_contact_sheet_ascii.json"
PACKAGE_MD = PACKAGE_DIR / "high_risk_contact_sheet_ascii.md"

FONT_CANDIDATES = [
    Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
    Path("/System/Library/Fonts/SFNS.ttf"),
    Path("/System/Library/Fonts/Helvetica.ttc"),
]

HIGH_RISK_SHOTS = [
    {
        "shot": "Shot032",
        "label": "Dedue + Mercedes healer-tank",
        "purpose": "Mercedes heals Dedue from behind; Dedue restores shield line.",
    },
    {
        "shot": "Shot032F",
        "label": "Hubert capture insert",
        "purpose": "Felix and Ashe contain Hubert; nonlethal capture is readable.",
    },
    {
        "shot": "Shot032G",
        "label": "Backline capture insert",
        "purpose": "Claude and Leonie capture Dorothea and Bernadetta.",
    },
    {
        "shot": "Shot034B",
        "label": "Empty faculty objective ruling",
        "purpose": "Byleth and Dimitri face two empty objective markers; Hanneman and Manuela are absent.",
    },
    {
        "shot": "Shot034G",
        "label": "Exhausted core victory",
        "purpose": "Final win stays with Byleth, Dimitri, and Dedue only.",
    },
]


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def load_font(size: int) -> ImageFont.ImageFont:
    for candidate in FONT_CANDIDATES:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_json(path: Path) -> dict:
    return json.loads(path.read_text())


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")


def fit_image(path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(path).convert("RGB")
    return ImageOps.contain(image, size, Image.Resampling.LANCZOS)


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    width_chars: int,
    line_gap: int = 4,
) -> int:
    x, y = xy
    for line in wrap(text, width=width_chars) or [""]:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + line_gap
    return y


def main() -> None:
    manifest = read_json(PACKAGE_MANIFEST)
    shots = {shot["shot"]: shot for shot in manifest.get("shots", [])}
    missing = [item["shot"] for item in HIGH_RISK_SHOTS if item["shot"] not in shots]
    if missing:
        raise SystemExit(f"Missing high-risk shots: {', '.join(missing)}")

    title_font = load_font(24)
    label_font = load_font(18)
    small_font = load_font(14)
    tiny_font = load_font(12)

    thumb_size = (392, 221)
    left_w = 320
    gap = 16
    pad = 18
    row_h = 310
    header_h = 72
    width = left_w + pad * 2 + gap * 3 + thumb_size[0] * 3
    height = header_h + row_h * len(HIGH_RISK_SHOTS) + pad
    sheet = Image.new("RGB", (width, height), (19, 22, 27))
    draw = ImageDraw.Draw(sheet)
    draw.text((pad, pad), f"Scene09 V3 high-risk full-size frame contact sheet / {DATE}", font=title_font, fill=(235, 238, 242))
    draw.text((pad, pad + 34), "ASCII labels only; full-size PNGs and SHA-256 values are recorded in the companion report.", font=small_font, fill=(170, 178, 190))

    report_rows = []
    for row_index, item in enumerate(HIGH_RISK_SHOTS):
        shot = shots[item["shot"]]
        y0 = header_h + row_index * row_h
        draw.rectangle((0, y0, width, y0 + row_h - 1), fill=(26, 30, 36) if row_index % 2 else (22, 25, 31))
        visible = ", ".join(shot.get("visible_named_only", [])) or "none"
        text_y = y0 + pad
        draw.text((pad, text_y), item["shot"], font=label_font, fill=(235, 238, 242))
        text_y += 28
        text_y = draw_wrapped(draw, (pad, text_y), item["label"], small_font, (215, 221, 230), 32)
        text_y += 4
        text_y = draw_wrapped(draw, (pad, text_y), f"Visible: {visible}", tiny_font, (175, 184, 196), 40)
        text_y += 4
        draw_wrapped(draw, (pad, text_y), f"Check: {item['purpose']}", tiny_font, (154, 165, 180), 40)

        frame_rows = []
        for frame_index, frame_kind in enumerate(["start", "key", "end"]):
            frame_path = PACKAGE_DIR / shot["package_dir"] / f"{frame_kind}_frame.png"
            x = left_w + pad + gap + frame_index * (thumb_size[0] + gap)
            y = y0 + 42
            if frame_path.exists():
                thumb = fit_image(frame_path, thumb_size)
                bx = x + (thumb_size[0] - thumb.width) // 2
                by = y + (thumb_size[1] - thumb.height) // 2
                sheet.paste(thumb, (bx, by))
                draw.rectangle((x, y, x + thumb_size[0], y + thumb_size[1]), outline=(82, 91, 106), width=1)
                digest = sha256(frame_path)
                with Image.open(frame_path) as img:
                    size = img.size
            else:
                draw.rectangle((x, y, x + thumb_size[0], y + thumb_size[1]), fill=(52, 21, 25), outline=(150, 75, 82))
                draw.text((x + 18, y + 90), "MISSING FRAME", font=label_font, fill=(255, 210, 210))
                digest = ""
                size = (0, 0)
            draw.text((x, y0 + 16), frame_kind, font=small_font, fill=(210, 216, 226))
            draw.text((x, y + thumb_size[1] + 8), digest[:16] if digest else "missing", font=tiny_font, fill=(145, 156, 170))
            frame_rows.append({
                "frame": frame_kind,
                "path": rel(frame_path),
                "exists": frame_path.exists(),
                "width": size[0],
                "height": size[1],
                "sha256": digest,
            })
        report_rows.append({
            "shot": item["shot"],
            "label": item["label"],
            "purpose": item["purpose"],
            "visible_named_only": shot.get("visible_named_only", []),
            "frames": frame_rows,
        })

    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    PACKAGE_DIR.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT_IMAGE, quality=94)
    sheet.save(PACKAGE_IMAGE, quality=94)

    problems = []
    for row in report_rows:
        for frame in row["frames"]:
            if not frame["exists"]:
                problems.append(f"{row['shot']} {frame['frame']}: missing frame")
            if frame["exists"] and (frame["width"] < 1280 or frame["height"] < 720):
                problems.append(f"{row['shot']} {frame['frame']}: low resolution {frame['width']}x{frame['height']}")

    report = {
        "date": DATE,
        "decision": "high_risk_contact_sheet_ascii_passed" if not problems else "high_risk_contact_sheet_ascii_failed",
        "image": rel(OUT_IMAGE),
        "package_image": rel(PACKAGE_IMAGE),
        "rows": report_rows,
        "problems": problems,
        "notes": [
            "All labels are ASCII-only to avoid unreadable tofu-box labels in review screenshots.",
            "The sheet is a visual triage artifact; full-size frame evidence remains authoritative.",
        ],
    }
    write_json(OUT_JSON, report)
    write_json(PACKAGE_JSON, {
        **report,
        "production_report_json": rel(OUT_JSON),
        "production_report_md": rel(OUT_MD),
    })

    md_lines = [
        "# Scene09 V3 High-Risk Contact Sheet ASCII",
        "",
        f"Date: {DATE}",
        f"Decision: `{report['decision']}`",
        "",
        f"- Production image: `{rel(OUT_IMAGE)}`",
        f"- Package image: `{rel(PACKAGE_IMAGE)}`",
        "",
        "## Rows",
        "",
    ]
    for row in report_rows:
        md_lines.extend([
            f"### {row['shot']} - {row['label']}",
            "",
            f"- Visible named-only: {', '.join(row['visible_named_only']) or 'none'}",
            f"- Check: {row['purpose']}",
            "",
        ])
        for frame in row["frames"]:
            md_lines.append(f"- {frame['frame']}: `{frame['path']}` ({frame['width']}x{frame['height']}, sha256 `{frame['sha256']}`)")
        md_lines.append("")
    md_lines.extend([
        "## Problems",
        "",
    ])
    md_lines.extend([f"- {problem}" for problem in problems] if problems else ["- none"])
    md_lines.append("")
    OUT_MD.write_text("\n".join(md_lines))
    PACKAGE_MD.write_text("\n".join(md_lines))

    print(json.dumps({
        "decision": report["decision"],
        "rows": len(report_rows),
        "image": rel(OUT_IMAGE),
        "package_image": rel(PACKAGE_IMAGE),
        "problems": len(problems),
    }, indent=2))
    raise SystemExit(1 if problems else 0)


if __name__ == "__main__":
    main()
