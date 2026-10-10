#!/usr/bin/env python3
import json
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


EP_ROOT = Path("episodes/EP03")
QUEUE_PATH = EP_ROOT / "frame_generation_queue.json"
IDENTITY_PLATES_PATH = EP_ROOT / "production_system/reviews/local_identity_plates_2026-08-01/index.json"
OUT_ROOT = EP_ROOT / "production_system/reviews/local_video_source_frames_2026-08-01"
PER_SHOT_ROOT = OUT_ROOT / "per_shot"
SOURCE_VIDEO = Path(
    "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[00].mp4"
)
SOURCE_AUDIO = Path(
    "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[01].mp4"
)
FONT_PATH = Path("/System/Library/Fonts/Hiragino Sans GB.ttc")


def font(size=13):
    if FONT_PATH.exists():
        return ImageFont.truetype(str(FONT_PATH), size)
    return ImageFont.load_default()


def repo_path(value):
    path = Path(value)
    if path.is_absolute() or str(path).startswith("episodes/EP03/"):
        return path
    return EP_ROOT / path


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def timecode_to_seconds(value):
    parts = [int(part) for part in value.split(":")]
    if len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    return parts[0]


def seconds_to_timecode(seconds):
    seconds = max(0, int(round(seconds)))
    return f"{seconds // 3600:02d}:{(seconds % 3600) // 60:02d}:{seconds % 60:02d}"


def run_ffmpeg_extract(seconds, out_path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-ss",
            f"{seconds:.3f}",
            "-i",
            str(SOURCE_VIDEO),
            "-frames:v",
            "1",
            "-vf",
            "scale=852:480",
            str(out_path),
        ],
        check=True,
    )


def fit_text(draw, text, font, width, max_lines=2):
    words = str(text).replace("\n", " ").split()
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), candidate, font=font)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
            if len(lines) == max_lines:
                break
    if current and len(lines) < max_lines:
        lines.append(current)
    return lines


def thumb_with_label(path, title, subtitle, size=(280, 188)):
    width, height = size
    canvas = Image.new("RGB", size, (14, 14, 14))
    draw = ImageDraw.Draw(canvas)
    label_font = font(13)
    small_font = font(10)
    label_h = 44
    try:
        image = Image.open(path).convert("RGB")
        image.thumbnail((width, height - label_h), Image.Resampling.LANCZOS)
        canvas.paste(image, ((width - image.width) // 2, label_h + ((height - label_h - image.height) // 2)))
    except Exception:
        draw.rectangle((0, label_h, width - 1, height - 1), outline=(90, 30, 30), fill=(28, 18, 18))
        draw.text((10, label_h + 18), "missing", fill=(245, 160, 160), font=label_font)
    draw.rectangle((0, 0, width - 1, label_h - 1), fill=(0, 0, 0))
    draw.text((8, 5), str(title)[:44], fill=(255, 255, 255), font=label_font)
    draw.text((8, 24), str(subtitle)[:58], fill=(190, 190, 190), font=small_font)
    return canvas


def build_sheet(shot, shot_dir, local_frames, identity_plates):
    width = 1200
    cell_w, cell_h = 280, 188
    gap = 14
    margin = 26
    title_h = 92
    rows = 3 + math.ceil(max(1, len(identity_plates)) / 4)
    height = title_h + rows * cell_h + (rows - 1) * gap + margin
    sheet = Image.new("RGB", (width, height), (4, 4, 4))
    draw = ImageDraw.Draw(sheet)
    title_font = font(16)
    body_font = font(12)
    draw.text((margin, 14), f"{shot['id']} local video source evidence / {shot['beat']} / {shot['source_timecode']}", fill=(255, 255, 255), font=title_font)
    draw.text((margin, 40), "Layer 1: original local video frames. Layer 2: source_ref/current local previs. Layer 3: local selected/reference identity plates.", fill=(210, 210, 210), font=body_font)
    draw.text((margin, 62), "These are provenance and identity-gate assets, not approved final cinematic frames.", fill=(245, 190, 120), font=body_font)

    x0 = margin
    y = title_h
    cards = [
        thumb_with_label(local_frames["minus"], "local video t-2s", seconds_to_timecode(timecode_to_seconds(shot["source_timecode"]) - 2)),
        thumb_with_label(local_frames["exact"], "local video exact", shot["source_timecode"]),
        thumb_with_label(local_frames["plus"], "local video t+2s", seconds_to_timecode(timecode_to_seconds(shot["source_timecode"]) + 2)),
        thumb_with_label(repo_path(shot["source_reference"]), "current source_ref", shot["source_reference"]),
        thumb_with_label(repo_path(shot["output_frames"]["start"]), "current local previs start", shot["output_frames"]["start"]),
        thumb_with_label(repo_path(shot["output_frames"]["key"]), "current local previs key", shot["output_frames"]["key"]),
        thumb_with_label(repo_path(shot["output_frames"]["end"]), "current local previs end", shot["output_frames"]["end"]),
        thumb_with_label(EP_ROOT / f"production_system/reviews/local_asset_previs_proof_2026-07-31/{shot['id']}_local_asset_previs_proof_2026-07-31.jpg", "local asset proof", f"{shot['id']} proof"),
    ]
    for i, card in enumerate(cards):
        sheet.paste(card, (x0 + (i % 4) * (cell_w + gap), y + (i // 4) * (cell_h + gap)))

    y += 2 * (cell_h + gap)
    if identity_plates:
        for i, plate in enumerate(identity_plates):
            card = thumb_with_label(repo_path(plate["plate"]), f"identity plate: {plate['character_id']}", plate["asset"])
            sheet.paste(card, (x0 + (i % 4) * (cell_w + gap), y + (i // 4) * (cell_h + gap)))
    else:
        card = thumb_with_label(Path("__missing_identity_plate__"), "identity plate", "none found")
        sheet.paste(card, (x0, y))

    out = shot_dir / f"{shot['id']}_local_video_source_evidence_2026-08-01.jpg"
    sheet.save(out, quality=92)
    return out


def build_viewer(index):
    links = []
    for item in index["shots"]:
        links.append(
            f"""<article class=\"shot\"><h2>{item['shot_id']} / {item['beat']}</h2><p><strong>Source timecode:</strong> {item['source_timecode']}</p><a href=\"/{item['evidence_sheet']}\"><img src=\"/{item['evidence_sheet']}\" alt=\"{item['shot_id']} local source evidence\"></a></article>"""
        )
    html = f"""<!doctype html>
<html lang=\"zh-CN\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>EP03 Local Video Source Evidence</title>
<style>
body{{margin:0;background:#090909;color:#eee;font-family:Arial,'PingFang SC',sans-serif;}}
header{{padding:24px 28px;border-bottom:1px solid #333;background:#111;position:sticky;top:0;z-index:1;}}
h1{{font-size:22px;margin:0 0 8px;}}
p{{color:#bbb;line-height:1.5;}}
main{{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px;padding:22px;}}
.shot{{border:1px solid #2c2c2c;background:#151515;padding:14px;border-radius:6px;}}
h2{{font-size:15px;margin:0 0 8px;}}
img{{width:100%;display:block;border:1px solid #333;background:#000;}}
a{{color:#b8d7ff;}}
</style>
</head>
<body>
<header>
<h1>EP03 Local Video Source Evidence / 2026-08-01</h1>
<p>36 shots mapped to local raw video frames from {SOURCE_VIDEO}. These boards are provenance assets and identity-gate references, not final cinematic frames.</p>
</header>
<main>
{''.join(links)}
</main>
</body>
</html>
"""
    (OUT_ROOT / "viewer.html").write_text(html, encoding="utf-8")


def main():
    queue = load_json(QUEUE_PATH)["shots"]
    plates = load_json(IDENTITY_PLATES_PATH)["plates"]
    plate_by_asset = {plate["asset"]: plate for plate in plates}
    PER_SHOT_ROOT.mkdir(parents=True, exist_ok=True)

    index = {
        "version": 1,
        "created_at": "2026-08-01",
        "status": "source_evidence_only",
        "source_video": str(SOURCE_VIDEO),
        "source_audio": str(SOURCE_AUDIO),
        "notes": [
            "Frames are extracted from local raw game footage and may contain UI, subtitles, or watermarks.",
            "These frames are provenance and layout evidence only.",
            "Future AI/live-action keyframes must be audited against this layer plus local selected/reference identity plates.",
        ],
        "shots": [],
    }

    for shot in queue:
        shot_dir = PER_SHOT_ROOT / shot["id"]
        shot_dir.mkdir(parents=True, exist_ok=True)
        center = timecode_to_seconds(shot["source_timecode"])
        frame_paths = {
            "minus": shot_dir / "local_video_t_minus_2s.jpg",
            "exact": shot_dir / "local_video_exact.jpg",
            "plus": shot_dir / "local_video_t_plus_2s.jpg",
        }
        for label, offset in [("minus", -2), ("exact", 0), ("plus", 2)]:
            run_ffmpeg_extract(max(0, center + offset), frame_paths[label])

        metadata = load_json(EP_ROOT / f"storyboards/{shot['id']}/metadata.json")
        identity_plates = [
            plate_by_asset[asset]
            for asset in metadata.get("asset_references", [])
            if asset in plate_by_asset
        ]
        evidence_sheet = build_sheet(shot, shot_dir, frame_paths, identity_plates)
        index["shots"].append(
            {
                "shot_id": shot["id"],
                "order": shot["order"],
                "beat": shot["beat"],
                "source_timecode": shot["source_timecode"],
                "local_video_frames": {key: str(value) for key, value in frame_paths.items()},
                "source_reference": str(EP_ROOT / shot["source_reference"]),
                "local_previs_frames": {key: str(EP_ROOT / value) for key, value in shot["output_frames"].items()},
                "local_asset_proof_sheet": str(EP_ROOT / f"production_system/reviews/local_asset_previs_proof_2026-07-31/{shot['id']}_local_asset_previs_proof_2026-07-31.jpg"),
                "identity_plates": identity_plates,
                "evidence_sheet": str(evidence_sheet),
                "status": "source_evidence_only",
            }
        )

    (OUT_ROOT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# EP03 Local Video Source Evidence",
        "",
        "Created: 2026-08-01",
        "Decision: source_evidence_only",
        "",
        f"Source video: `{SOURCE_VIDEO}`",
        f"Source audio: `{SOURCE_AUDIO}`",
        "",
        "These boards are provenance and identity-gate assets. They are not final cinematic frames.",
        "",
        "## Shot Evidence Boards",
        "",
    ]
    for item in index["shots"]:
        lines.append(f"- {item['shot_id']} / {item['beat']} / {item['source_timecode']}: `{item['evidence_sheet']}`")
    (OUT_ROOT / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    build_viewer(index)
    print(f"built {OUT_ROOT} ({len(index['shots'])} shots)")


if __name__ == "__main__":
    main()
