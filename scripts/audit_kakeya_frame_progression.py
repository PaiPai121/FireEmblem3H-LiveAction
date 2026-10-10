#!/usr/bin/env python3
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "specials" / "kakeya_byleth_lecture"
REAL = PROJECT / "real_frames"
OUT_JSON = PROJECT / "production_system" / "reviews" / "frame_progression_audit_2026-08-01.json"
OUT_MD = PROJECT / "production_system" / "reviews" / "frame_progression_audit_2026-08-01.md"


def mean_abs_diff(a: Path, b: Path) -> float:
    ia = Image.open(a).convert("RGB").resize((320, 180), Image.Resampling.BOX)
    ib = Image.open(b).convert("RGB").resize((320, 180), Image.Resampling.BOX)
    diff = ImageChops.difference(ia, ib)
    return round(sum(ImageStat.Stat(diff).mean) / 3.0, 2)


def classify(start_key: float, key_end: float, start_end: float) -> tuple[str, str, str]:
    values = [start_key, key_end, start_end]
    min_pair = min(values)
    avg_pair = round(sum(values) / 3.0, 2)
    if min_pair < 1.0 or avg_pair < 2.0:
        return (
            "low_progression_requires_revision",
            "低帧差，需修订",
            "三帧之间至少有一组变化过弱；一次性送视频模型时，容易生成静态停顿或只做轻微镜头漂移。",
        )
    if min_pair < 2.0 or avg_pair < 4.0:
        return (
            "watch_motion_generation",
            "需运动监看",
            "三帧有变化，但动作锚点偏弱；生成视频时必须重点看是否完成分镜动作。",
        )
    return (
        "progression_clear",
        "变化清楚",
        "三帧差异足够支撑起始、动作峰值和结束状态。",
    )


def main() -> None:
    shots = []
    for i in range(1, 35):
        shot_id = f"SH{i:03d}"
        folder = REAL / shot_id
        start = folder / "start.png"
        key = folder / "key.png"
        end = folder / "end.png"
        missing = [p.name for p in [start, key, end] if not p.exists()]
        if missing:
            shots.append(
                {
                    "id": shot_id,
                    "status": "missing_frames",
                    "zh_status": "缺少帧",
                    "missing": missing,
                    "note_zh": "缺少起始帧、关键帧或结束帧，不能进入运动生成。",
                }
            )
            continue
        start_key = mean_abs_diff(start, key)
        key_end = mean_abs_diff(key, end)
        start_end = mean_abs_diff(start, end)
        status, zh_status, note = classify(start_key, key_end, start_end)
        shots.append(
            {
                "id": shot_id,
                "status": status,
                "zh_status": zh_status,
                "pair_mean_abs_diff": {
                    "start_key": start_key,
                    "key_end": key_end,
                    "start_end": start_end,
                },
                "min_pair_mean_abs_diff": min(start_key, key_end, start_end),
                "average_pair_mean_abs_diff": round((start_key + key_end + start_end) / 3.0, 2),
                "note_zh": note,
            }
        )

    summary = {
        "total_shots": len(shots),
        "low_progression_count": sum(s["status"] == "low_progression_requires_revision" for s in shots),
        "watch_count": sum(s["status"] == "watch_motion_generation" for s in shots),
        "clear_count": sum(s["status"] == "progression_clear" for s in shots),
        "missing_count": sum(s["status"] == "missing_frames" for s in shots),
    }
    status = "motion_anchor_review_required" if summary["low_progression_count"] or summary["watch_count"] else "progression_passed"
    report = {
        "review_id": "KAK-BYLETH-FRAME-PROGRESSION-2026-08-01",
        "created_at": "2026-08-01",
        "status": status,
        "method": "Downsample each start/key/end PNG to 320x180 and compute mean absolute RGB difference for each pair.",
        "thresholds": {
            "low_progression_requires_revision": "min pair < 1.0 or average pair < 2.0",
            "watch_motion_generation": "min pair < 2.0 or average pair < 4.0",
            "progression_clear": "all other complete frame triplets",
        },
        "summary": summary,
        "shots": shots,
        "notes_zh": [
            "这是三帧变化审计，不替代人工视觉审查。",
            "低帧差不一定是重复文件；它表示起始帧、关键帧、结束帧给视频模型的动作锚点太接近。",
            "预算限制下一次性生成全片时，低帧差镜头应先修订三帧或至少加强模型提示词中的动作峰值。",
        ],
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")

    lines = [
        "# Frame Progression Audit: 2026-08-01",
        "",
        f"Status: `{status}`",
        "",
        "This audit checks whether each start/key/end triplet has enough visual change to anchor video motion. It does not replace human visual or math review.",
        "",
        "## Summary",
        "",
        f"- Total shots: {summary['total_shots']}",
        f"- Low progression, revise before one-pass generation: {summary['low_progression_count']}",
        f"- Watch during motion generation: {summary['watch_count']}",
        f"- Progression clear: {summary['clear_count']}",
        f"- Missing: {summary['missing_count']}",
        "",
        "## Shot Results",
        "",
        "| Shot | Status | start-key | key-end | start-end | Note |",
        "| --- | --- | ---: | ---: | ---: | --- |",
    ]
    for shot in shots:
        diffs = shot.get("pair_mean_abs_diff", {})
        lines.append(
            "| {id} | {zh_status} | {sk} | {ke} | {se} | {note} |".format(
                id=shot["id"],
                zh_status=shot["zh_status"],
                sk=diffs.get("start_key", "-"),
                ke=diffs.get("key_end", "-"),
                se=diffs.get("start_end", "-"),
                note=shot["note_zh"],
            )
        )
    OUT_MD.write_text("\n".join(lines) + "\n")
    print(json.dumps({"status": status, "summary": summary, "json": str(OUT_JSON), "md": str(OUT_MD)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
