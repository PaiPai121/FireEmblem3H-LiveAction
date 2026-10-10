#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path


EP_ROOT = Path("episodes/EP03")
QUEUE_PATH = EP_ROOT / "frame_generation_queue.json"
SOURCE_VIDEO = Path(
    "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[00].mp4"
)


def timecode_to_seconds(value):
    parts = [int(part) for part in value.split(":")]
    if len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    return parts[0]


def extract(seconds, out_path):
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


def main():
    queue = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    for shot in queue["shots"]:
        out_path = EP_ROOT / shot["source_reference"]
        extract(timecode_to_seconds(shot["source_timecode"]), out_path)
    print(f"synced {len(queue['shots'])} EP03 source_refs from corrected local video timecodes")


if __name__ == "__main__":
    main()
