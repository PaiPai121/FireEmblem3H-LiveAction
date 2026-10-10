#!/usr/bin/env python3
"""Apply true imagegen frame repairs to Golden Deer timing-safe micro-shots."""

from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps
from PIL import ImageChops, ImageStat

from build_gdsc_web_panel import main as build_gdsc_web_panel


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"
SOURCE_PACKAGE = "delivery/video_generation_package_2026-07-28"
GEN = Path("/Users/zekun/.codex/generated_images/019fa8f8-a16f-7da2-9454-18a56bb99e7c")
OUT_SIZE = (1280, 720)
MIN_FRAME_RMS = 1.0

# mapping key: "EP_slug/shot_id/frame_name"
# value: generated image filename under GEN
REPAIRS: dict[str, str] = {
    "EP01_hilda_lorenz/001_GDSC01-SH001A/end_frame.png": "call_nuHfvM9S9NwoTI0zLJwoK1tD.png",
    "EP01_hilda_lorenz/002_GDSC01-SH001B/start_frame.png": "call_CAID2LqdCE2k7YwacmLeAb63.png",
    "EP01_hilda_lorenz/002_GDSC01-SH001B/key_frame.png": "call_gcqo5ErF07pzQK9oW1Rv9cZn.png",
    "EP01_hilda_lorenz/004_GDSC01-SH002B/start_frame.png": "call_2dQGh2HfHubIC8Icy3MUvNAw.png",
    "EP01_hilda_lorenz/004_GDSC01-SH002B/key_frame.png": "call_Hld1cGvPGas0pmmmrQvI9Pd6.png",
    "EP01_hilda_lorenz/004_GDSC01-SH002B/end_frame.png": "call_EeFSGu2mye34vgLcMgEXNyit.png",
    "EP01_hilda_lorenz/005_GDSC01-SH002C/start_frame.png": "call_5vvgohVF3I9lwX8vW2E3SD45.png",
    "EP01_hilda_lorenz/005_GDSC01-SH002C/key_frame.png": "call_OrF87CyGHYsztG4dF7BVSmKi.png",
    "EP01_hilda_lorenz/005_GDSC01-SH002C/end_frame.png": "call_KPT9k1Y2GqkiFNV5ihouKzIq.png",
    "EP01_hilda_lorenz/007_GDSC01-SH003B/start_frame.png": "call_A28gu8rAsyRyrLqb9YYl4PHN.png",
    "EP01_hilda_lorenz/007_GDSC01-SH003B/key_frame.png": "call_AWgvgf5x2Z4OGQTUP3M5qvQo.png",
    "EP01_hilda_lorenz/007_GDSC01-SH003B/end_frame.png": "call_bH1dFul4XOP9zLySdxbmUYZl.png",
    "EP01_hilda_lorenz/008_GDSC01-SH003C/start_frame.png": "call_rJpsj1g7tiZU0aBRq3ZAfnBE.png",
    "EP01_hilda_lorenz/008_GDSC01-SH003C/key_frame.png": "call_xQyD60wtaLATTTCecWq1kmJR.png",
    "EP01_hilda_lorenz/008_GDSC01-SH003C/end_frame.png": "call_CD97CKol8RHd3DpzyB5Q4xdN.png",
    "EP01_hilda_lorenz/010_GDSC01-SH004B/start_frame.png": "call_cx0HnuX0zpAWJfpoXZtpisck.png",
    "EP01_hilda_lorenz/010_GDSC01-SH004B/key_frame.png": "call_a32TtZvzOMFeNDQHubSunpS7.png",
    "EP01_hilda_lorenz/010_GDSC01-SH004B/end_frame.png": "call_lzlur2XYIwcehWrxJIk8yVT4.png",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def save_resized(source: Path, target: Path) -> dict[str, object]:
    image = Image.open(source).convert("RGB")
    source_size = image.size
    source_aspect = image.width / image.height
    target_aspect = OUT_SIZE[0] / OUT_SIZE[1]
    image = ImageOps.fit(image, OUT_SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    image.save(target, quality=96)
    return {
        "source_size": list(source_size),
        "source_aspect": round(source_aspect, 6),
        "target_size": list(OUT_SIZE),
        "target_aspect": round(target_aspect, 6),
        "resize_policy": "aspect_safe_crop_no_stretch",
    }


def frame_rms(a: Path, b: Path) -> float:
    img_a = Image.open(a).convert("RGB")
    img_b = Image.open(b).convert("RGB")
    diff = ImageChops.difference(img_a, img_b)
    stat = ImageStat.Stat(diff)
    return sum(value * value for value in stat.rms) ** 0.5


def duplicate_pairs(shot_dir: Path) -> set[str]:
    pairs = {
        "start_key": frame_rms(shot_dir / "start_frame.png", shot_dir / "key_frame.png"),
        "key_end": frame_rms(shot_dir / "key_frame.png", shot_dir / "end_frame.png"),
        "start_end": frame_rms(shot_dir / "start_frame.png", shot_dir / "end_frame.png"),
    }
    return {name for name, value in pairs.items() if value < MIN_FRAME_RMS}


def write_episode_viewer(episode_dir: Path) -> None:
    package = episode_dir / PACKAGE
    shots = sorted(p for p in (package / "shots").iterdir() if p.is_dir())
    cards = []
    completed = 0
    for shot in shots:
        meta = load_json(shot / "metadata.json")
        status = meta.get("visual_status", "unknown")
        if status in {
            "temporal_imagegen_frames_applied",
            "timing_repaired_imagegen_frames_applied",
            "dialogue_specific_imagegen_frames_applied",
        }:
            completed += 1
        frame_cells = []
        for name in ("start_frame.png", "key_frame.png", "end_frame.png"):
            frame_cells.append(
                f'<figure><img src="shots/{shot.name}/{name}" alt="{shot.name} {name}"><figcaption>{name}</figcaption></figure>'
            )
        cards.append(
            f"""
            <article class="shot" id="{shot.name}">
              <div class="shot-head">
                <div>
                  <p class="eyebrow">{shot.name} / {meta.get("duration_seconds", "?")}s</p>
                  <h2>{meta.get("title", shot.name)}</h2>
                  <p>{meta.get("dialogue_summary", "")}</p>
                </div>
                <span>{status}</span>
              </div>
              <div class="frames">{''.join(frame_cells)}</div>
              <div class="links">
                <a href="shots/{shot.name}/prompt.md.html">prompt</a>
                <a href="shots/{shot.name}/negative_prompt.md.html">negative</a>
                <a href="shots/{shot.name}/metadata.json.html">metadata</a>
                <a href="shots/{shot.name}/zh_subtitle_text.md.html">中文字幕</a>
              </div>
            </article>
            """
        )
    html = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{episode_dir.name} timing-safe repaired viewer</title>
  <style>
    :root {{ color-scheme: dark; --bg:#101215; --panel:#181c21; --line:#303742; --ink:#eef3f8; --muted:#9eaab7; --accent:#e0b34d; --ok:#7fd6a4; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }}
    header {{ position:sticky; top:0; z-index:5; padding:20px clamp(16px,4vw,40px); border-bottom:1px solid var(--line); background:rgba(16,18,21,.94); backdrop-filter:blur(14px); }}
    main {{ padding:20px clamp(16px,4vw,40px) 44px; display:grid; gap:14px; }}
    h1,h2,p {{ margin-top:0; }}
    .eyebrow {{ margin-bottom:6px; color:var(--accent); font-size:12px; font-weight:900; text-transform:uppercase; }}
    nav,.links {{ display:flex; flex-wrap:wrap; gap:8px; }}
    a {{ border:1px solid var(--line); border-radius:8px; padding:8px 10px; color:var(--ink); background:#1d2229; text-decoration:none; font-weight:800; font-size:13px; }}
    .shot {{ border:1px solid var(--line); border-radius:8px; background:var(--panel); padding:12px; }}
    .shot-head {{ display:flex; justify-content:space-between; gap:12px; align-items:start; }}
    .shot-head p {{ color:var(--muted); }}
    .shot-head span {{ border-radius:999px; padding:5px 9px; color:#132015; background:var(--ok); font-size:11px; font-weight:900; white-space:nowrap; }}
    .frames {{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin:10px 0; }}
    figure {{ margin:0; border:1px solid var(--line); border-radius:8px; overflow:hidden; background:#111; }}
    img {{ display:block; width:100%; aspect-ratio:16/9; object-fit:cover; }}
    figcaption {{ padding:7px 9px; color:var(--muted); font-size:12px; font-weight:800; }}
    @media (max-width:760px) {{ .shot-head {{ display:grid; }} .frames {{ grid-template-columns:1fr; }} }}
  </style>
</head>
<body>
  <header>
    <p class="eyebrow">Seedance timing-safe video_generation_package</p>
    <h1>{episode_dir.name}</h1>
    <p>Completed {completed}/{len(shots)} shot frame chains. No subtitles are burned into video frames.</p>
    <nav>
      <a href="__SERIES_INDEX__">金鹿系列面板</a>
      <a href="__PKG_PREFIX__submission_queue.csv.html">submission_queue</a>
      <a href="__PKG_PREFIX__prompt_qa_review.md.html">prompt QA</a>
      <a href="__PKG_PREFIX__zh_subtitles.md.html">中文字幕 sidecar</a>
      <a href="__PKG_PREFIX__RUNBOOK.md.html">RUNBOOK</a>
    </nav>
  </header>
  <main>{''.join(cards)}</main>
</body>
</html>
"""
    package_html = html.replace("__SERIES_INDEX__", "../../../index.html").replace("__PKG_PREFIX__", "")
    episode_html = (
        html.replace("__SERIES_INDEX__", "../index.html")
        .replace("__PKG_PREFIX__", f"{PACKAGE}/")
        .replace('src="shots/', f'src="{PACKAGE}/shots/')
        .replace('href="shots/', f'href="{PACKAGE}/shots/')
    )
    (package / "asset_viewer.html").write_text(package_html, encoding="utf-8")
    (episode_dir / "asset_viewer.html").write_text(episode_html, encoding="utf-8")


def write_contact_sheet(package: Path) -> None:
    shots = sorted(p for p in (package / "shots").iterdir() if p.is_dir())
    thumb_w, thumb_h = 320, 180
    label_h = 28
    sheet = Image.new("RGB", (thumb_w * 3, (thumb_h + label_h) * len(shots)), "#111418")
    draw = ImageDraw.Draw(sheet)
    for y_index, shot in enumerate(shots):
        y = y_index * (thumb_h + label_h)
        draw.rectangle((0, y, sheet.width, y + label_h), fill="#181c21")
        draw.text((6, y + 8), shot.name, fill="#d5dde6")
        for x_index, frame in enumerate(("start_frame.png", "key_frame.png", "end_frame.png")):
            img = Image.open(shot / frame).convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            sheet.paste(img, (x_index * thumb_w, y + label_h))
    sheet.save(package / "visual_contact_sheet.jpg", quality=90)


def write_series_contact_sheet() -> None:
    rows: list[Path] = []
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        shots_root = episode_dir / PACKAGE / "shots"
        if shots_root.exists():
            rows.extend(sorted(p for p in shots_root.iterdir() if p.is_dir()))
    thumb_w, thumb_h = 320, 180
    label_h = 28
    sheet = Image.new("RGB", (thumb_w * 3, (thumb_h + label_h) * len(rows)), "#101215")
    draw = ImageDraw.Draw(sheet)
    for y_index, shot in enumerate(rows):
        y = y_index * (thumb_h + label_h)
        draw.rectangle((0, y, sheet.width, y + label_h), fill="#181c21")
        draw.text((6, y + 8), f"{shot.parents[3].name} / {shot.name}", fill="#d5dde6")
        for x_index, frame in enumerate(("start_frame.png", "key_frame.png", "end_frame.png")):
            img = Image.open(shot / frame).convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            sheet.paste(img, (x_index * thumb_w, y + label_h))
    sheet.save(SERIES / "all_episodes_contact_sheet_timing_safe.jpg", quality=90)
    sheet.save(SERIES / "all_episodes_contact_sheet.jpg", quality=90)


def restore_parent_frame_chains() -> dict[Path, dict[str, dict[str, object]]]:
    """Repair duplicated anchors using the approved parent shot's real imagegen chain."""
    repaired: dict[Path, dict[str, dict[str, object]]] = {}
    explicit_targets = {"/".join(key.split("/")[:3]) for key in REPAIRS}
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        shots_root = episode_dir / PACKAGE / "shots"
        if not shots_root.exists():
            continue
        for shot_dir in sorted(p for p in shots_root.iterdir() if p.is_dir()):
            pairs = duplicate_pairs(shot_dir)
            if not pairs:
                continue
            meta = load_json(shot_dir / "metadata.json")
            parent_id = meta.get("parent_shot_id")
            if not parent_id:
                continue
            parent_dir = episode_dir / SOURCE_PACKAGE / "shots" / f"{meta.get('order', 0):03d}_{parent_id}"
            if not parent_dir.exists():
                parent_matches = sorted((episode_dir / SOURCE_PACKAGE / "shots").glob(f"*_{parent_id}"))
                if not parent_matches:
                    continue
                parent_dir = parent_matches[0]
            replacements: dict[str, Path] = {}
            if "start_key" in pairs or "start_end" in pairs:
                replacements["start_frame.png"] = parent_dir / "start_frame.png"
            if "key_end" in pairs or "start_end" in pairs:
                replacements["end_frame.png"] = parent_dir / "end_frame.png"
            for frame, source in replacements.items():
                repair_key = f"{episode_dir.name}/{shot_dir.name}/{frame}"
                if repair_key in explicit_targets:
                    continue
                aspect_report = save_resized(source, shot_dir / frame)
                shot_report = repaired.setdefault(shot_dir, {"frame_sources": {}, "frame_aspect_report": {}})
                shot_report["frame_sources"][frame] = str(source)
                shot_report["frame_aspect_report"][frame] = aspect_report
    return repaired


def apply_repairs() -> list[Path]:
    touched: set[Path] = set()
    now = datetime.now().isoformat(timespec="seconds")
    by_shot = restore_parent_frame_chains()
    for key, generated_name in REPAIRS.items():
        episode, shot_id, frame = key.split("/")
        shot_dir = SERIES / episode / PACKAGE / "shots" / shot_id
        source = GEN / generated_name
        if not source.exists():
            raise FileNotFoundError(source)
        if frame not in {"start_frame.png", "key_frame.png", "end_frame.png"}:
            raise ValueError(f"unsupported frame name: {frame}")
        aspect_report = save_resized(source, shot_dir / frame)
        shot_report = by_shot.setdefault(shot_dir, {"frame_sources": {}, "frame_aspect_report": {}})
        shot_report["frame_sources"][frame] = str(source)
        shot_report["frame_aspect_report"][frame] = aspect_report

    for shot_dir, repair_report in by_shot.items():
        meta = load_json(shot_dir / "metadata.json")
        repair = meta.setdefault("timing_frame_repair", {})
        repair["method"] = "restored real imagegen frame anchors from the approved parent chain, with explicit regenerated frames where mapped; no copied duplicate frame anchors"
        repair.setdefault("frame_sources", {}).update(repair_report["frame_sources"])
        repair["aspect_policy"] = "aspect_safe_crop_no_stretch"
        repair["frame_aspect_report"] = repair_report["frame_aspect_report"]
        repair["updated_at"] = now
        meta["visual_version"] = "v4_timing_safe_micro_frames"
        meta["visual_status"] = "timing_repaired_imagegen_frames_applied"
        meta["updated_at"] = now
        write_json(shot_dir / "metadata.json", meta)
        touched.add(shot_dir)
    return sorted(touched)


def main() -> None:
    touched = apply_repairs()
    episode_dirs = {p for p in SERIES.glob("EP*_*/") if (p / PACKAGE / "shots").exists()}
    for episode_dir in sorted(episode_dirs):
        package = episode_dir / PACKAGE
        write_episode_viewer(episode_dir)
        write_contact_sheet(package)
    write_series_contact_sheet()
    build_gdsc_web_panel()
    print(json.dumps({"repaired_shots": [str(p.relative_to(ROOT)) for p in touched]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
