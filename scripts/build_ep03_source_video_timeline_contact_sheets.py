#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT_ROOT = Path("episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s")
SOURCE_VIDEO = Path(
    "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[00].mp4"
)
FONT_PATH = Path("/System/Library/Fonts/Hiragino Sans GB.ttc")


def font(size=12):
    if FONT_PATH.exists():
        return ImageFont.truetype(str(FONT_PATH), size)
    return ImageFont.load_default()


def tc(seconds):
    seconds = int(seconds)
    return f"{seconds // 3600:02d}:{(seconds % 3600) // 60:02d}:{seconds % 60:02d}"


def duration_seconds():
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(SOURCE_VIDEO),
        ],
        text=True,
        stdout=subprocess.PIPE,
        check=True,
    )
    return float(result.stdout.strip())


def extract(seconds, out_path):
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
            "scale=320:180",
            str(out_path),
        ],
        check=True,
    )


def card(path, label):
    w, h = 320, 216
    label_h = 36
    canvas = Image.new("RGB", (w, h), (12, 12, 12))
    draw = ImageDraw.Draw(canvas)
    image = Image.open(path).convert("RGB")
    image.thumbnail((w, h - label_h), Image.Resampling.LANCZOS)
    canvas.paste(image, ((w - image.width) // 2, label_h + (h - label_h - image.height) // 2))
    draw.rectangle((0, 0, w - 1, label_h - 1), fill=(0, 0, 0))
    draw.text((8, 8), label, fill=(255, 255, 255), font=font(15))
    return canvas


def build_sheet(items, sheet_index):
    cols = 4
    cell_w, cell_h = 320, 216
    header_h = 54
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_w, header_h + rows * cell_h), (0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    draw.text((18, 14), f"EP03 local source timeline every 10s / sheet {sheet_index:02d}", fill=(255, 255, 255), font=font(18))
    for idx, item in enumerate(items):
        sheet.paste(card(item["path"], item["timecode"]), ((idx % cols) * cell_w, header_h + (idx // cols) * cell_h))
    out = OUT_ROOT / f"timeline_10s_sheet_{sheet_index:02d}.jpg"
    sheet.save(out, quality=92)
    return out


def main():
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    duration = duration_seconds()
    items = []
    for seconds in range(0, int(duration), 10):
        path = OUT_ROOT / f"source_{seconds:04d}.jpg"
        extract(seconds, path)
        items.append({"seconds": seconds, "timecode": tc(seconds), "path": path})

    sheets = []
    for idx in range(0, len(items), 24):
        sheets.append(build_sheet(items[idx : idx + 24], len(sheets) + 1))

    index = {
        "version": 1,
        "created_at": "2026-08-01",
        "status": "source_timeline_reference",
        "source_video": str(SOURCE_VIDEO),
        "interval_seconds": 10,
        "frames": [{"seconds": item["seconds"], "timecode": item["timecode"], "path": str(item["path"])} for item in items],
        "sheets": [str(sheet) for sheet in sheets],
    }
    (OUT_ROOT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_ROOT / "index.md").write_text(
        "# EP03 Local Source Timeline 10s Contact Sheets\n\n"
        + "\n".join(f"- `{sheet}`" for sheet in sheets)
        + "\n",
        encoding="utf-8",
    )
    print(f"built {OUT_ROOT} ({len(items)} frames, {len(sheets)} sheets)")


if __name__ == "__main__":
    main()
