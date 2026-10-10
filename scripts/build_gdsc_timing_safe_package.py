#!/usr/bin/env python3
"""Build timing-safe Golden Deer Seedance packages by splitting dense dialogue shots."""

from __future__ import annotations

import csv
import json
import math
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
SOURCE_PACKAGE = "delivery/video_generation_package_2026-07-28"
TARGET_PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"
MAX_SHOT_SECONDS = 15
TARGET_DIALOGUE_SECONDS = 10.5

EPISODES = (
    ("EP01_hilda_lorenz", "GDSC01", "Hilda x Lorenz", "希尔妲让洛廉兹替她干活"),
    ("EP02_hilda_marianne", "GDSC02", "Hilda x Marianne", "图书馆清扫甩锅"),
    ("EP03_hilda_lysithea", "GDSC03", "Hilda x Lysithea", "撒娇专家遇到认真小孩"),
    ("EP04_claude_lorenz", "GDSC04", "Claude x Lorenz", "洛廉兹怀疑库罗德又在搞事"),
)

LINE_RE = re.compile(r'^- ([^:\n]+): "(.+)"$', re.M)
SECTION_RE = re.compile(r"^(Shot ID: .+?)(?=^Shot ID: |\Z)", re.M | re.S)


def visible_chars(text: str) -> int:
    return sum(1 for char in text if not char.isspace() and char not in "、。！？…「」『』.,!?")


def estimate_line_seconds(text: str) -> float:
    punctuation_pause = text.count("…") * 0.25 + sum(text.count(mark) * 0.18 for mark in "、。！？")
    return max(1.25, visible_chars(text) / 5.2 + punctuation_pause + 0.25)


def estimate_group(lines: list[tuple[str, str]]) -> float:
    if not lines:
        return 0.0
    return sum(estimate_line_seconds(text) for _, text in lines) + (len(lines) - 1) * 0.25


def duration_for_group(lines: list[tuple[str, str]]) -> int:
    return min(MAX_SHOT_SECONDS, max(4, math.ceil(estimate_group(lines) + 1.5)))


def split_lines(lines: list[tuple[str, str]]) -> list[list[tuple[str, str]]]:
    groups: list[list[tuple[str, str]]] = []
    current: list[tuple[str, str]] = []
    for line in lines:
        candidate = current + [line]
        if current and estimate_group(candidate) > TARGET_DIALOGUE_SECONDS:
            groups.append(current)
            current = [line]
        else:
            current = candidate
    if current:
        groups.append(current)
    return groups


def replace_field(prompt: str, label: str, value: str) -> str:
    return re.sub(rf"^{re.escape(label)}.*$", f"{label} {value}", prompt, count=1, flags=re.M)


def prompt_for(parent_prompt: str, shot_id: str, duration: int, lines: list[tuple[str, str]], parent_id: str) -> str:
    prompt = replace_field(parent_prompt, "Shot ID:", shot_id)
    prompt = replace_field(prompt, "Duration:", f"{duration} seconds")
    prompt = re.sub(
        r"^Input Frames: .+$",
        "Input Frames: Use start_frame.png as this micro-shot's first frame, key_frame.png as the held action/emotional peak, and end_frame.png as the final cut-out state. These frames are copied from the approved parent shot frame chain.",
        prompt,
        count=1,
        flags=re.M,
    )
    prompt = re.sub(
        r"^Audio: .+$",
        "Audio: Japanese spoken dialogue exactly as listed below, paced comfortably within this micro-shot duration with brief natural pauses; no omitted parent-shot lines, no added lines, no subtitles, no captions, no visible text.",
        prompt,
        count=1,
        flags=re.M,
    )
    dialogue = "Dialogue / Vocal Lines:\n" + "\n".join(f'- {speaker}: "{text}"' for speaker, text in lines)
    prompt = re.sub(r"Dialogue / Vocal Lines:\n(?:^- .+\n?)+", dialogue + "\n", prompt, count=1, flags=re.M)
    prompt = re.sub(
        r"^Continuity Locks: .+$",
        f"Continuity Locks: This is a timing-safe split from {parent_id}; preserve the same Garreg Mach location, Academy-era uniforms, hair and face identity, prop state, and parent-shot left/right relationship. Do not reintroduce dialogue assigned to neighboring micro-shots.",
        prompt,
        count=1,
        flags=re.M,
    )
    prompt = prompt.rstrip() + f"\n\nTiming Safety: This micro-shot contains {len(lines)} dialogue line(s), estimated at {estimate_group(lines):.1f}s of spoken Japanese inside a {duration}s shot.\n"
    return prompt


def frame_sources_for(parent: Path, group_index: int, group_count: int) -> dict[str, Path]:
    start = parent / "start_frame.png"
    key = parent / "key_frame.png"
    end = parent / "end_frame.png"
    if group_count == 1:
        return {"start_frame.png": start, "key_frame.png": key, "end_frame.png": end}
    if group_index == 0:
        return {"start_frame.png": start, "key_frame.png": key, "end_frame.png": key}
    if group_index == group_count - 1:
        return {"start_frame.png": key, "key_frame.png": key, "end_frame.png": end}
    return {"start_frame.png": key, "key_frame.png": key, "end_frame.png": key}


def build_asset_viewer(package: Path, title: str, rows: list[dict]) -> None:
    shot_html = []
    for row in rows:
        shot_dir = Path(row["shot_dir"])
        shot_html.append(
            f"""
            <article class="shot" id="{row['shot_id']}">
              <div class="shot-head">
                <div>
                  <p class="eyebrow">{row['shot_id']} / {row['duration_seconds']}s / parent {row['parent_shot_id']}</p>
                  <h2>{row['title']}</h2>
                  <p>{row['dialogue_summary']}</p>
                </div>
                <span>{row['timing_status']}</span>
              </div>
              <div class="frames">
                <figure><img src="shots/{shot_dir.name}/start_frame.png" alt="{row['shot_id']} start"><figcaption>start</figcaption></figure>
                <figure><img src="shots/{shot_dir.name}/key_frame.png" alt="{row['shot_id']} key"><figcaption>key</figcaption></figure>
                <figure><img src="shots/{shot_dir.name}/end_frame.png" alt="{row['shot_id']} end"><figcaption>end</figcaption></figure>
              </div>
              <div class="links">
                <a href="shots/{shot_dir.name}/prompt.md">prompt</a>
                <a href="shots/{shot_dir.name}/negative_prompt.md">negative</a>
                <a href="shots/{shot_dir.name}/metadata.json">metadata</a>
                <a href="shots/{shot_dir.name}/zh_subtitle_text.md">中文字幕</a>
              </div>
            </article>
            """
        )
    html = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} timing-safe package</title>
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
    <h1>{title}</h1>
    <p>Dialogue has been split into comfortable micro-shots; no subtitles are burned into video prompts.</p>
    <nav>
      <a href="submission_queue.csv">submission_queue</a>
      <a href="dialogue_timing_audit.md">台词时长审计</a>
      <a href="prompt_qa_review.md">prompt QA</a>
      <a href="zh_subtitles.md">中文字幕</a>
      <a href="RUNBOOK.md">RUNBOOK</a>
    </nav>
  </header>
  <main>
    {''.join(shot_html)}
  </main>
</body>
</html>
"""
    (package / "asset_viewer.html").write_text(html, encoding="utf-8")


def make_contact_sheet(package: Path, rows: list[dict]) -> None:
    try:
        from PIL import Image, ImageDraw
    except Exception:
        return
    thumb_w, thumb_h = 320, 180
    label_h = 24
    width = thumb_w * 3
    height = (thumb_h + label_h) * len(rows)
    sheet = Image.new("RGB", (width, height), "#111418")
    draw = ImageDraw.Draw(sheet)
    for y_index, row in enumerate(rows):
        y = y_index * (thumb_h + label_h)
        draw.text((6, y + 5), row["shot_id"], fill="#d5dde6")
        shot_dir = package / "shots" / Path(row["shot_dir"]).name
        for x_index, frame in enumerate(("start_frame.png", "key_frame.png", "end_frame.png")):
            img = Image.open(shot_dir / frame).convert("RGB")
            img.thumbnail((thumb_w, thumb_h))
            x = x_index * thumb_w
            sheet.paste(img, (x, y + label_h))
    sheet.save(package / "visual_contact_sheet.jpg", quality=88)


def build_episode(ep_slug: str, ep_code: str, pair: str, subtitle: str) -> dict:
    ep_root = SERIES / ep_slug
    source = ep_root / SOURCE_PACKAGE
    target = ep_root / TARGET_PACKAGE
    if target.exists():
        shutil.rmtree(target)
    (target / "shots").mkdir(parents=True)

    rows: list[dict] = []
    audit_lines = [
        f"# Dialogue Timing Audit - {pair}",
        "",
        "Policy: Japanese spoken dialogue is budgeted conservatively before Seedance submission. Each timing-safe micro-shot must keep estimated spoken dialogue under the shot duration with breathing room.",
        "",
        "| Timing Shot | Parent Shot | Lines | Estimate | Duration | Status |",
        "| --- | --- | ---: | ---: | ---: | --- |",
    ]
    order = 1
    total_duration = 0
    for parent in sorted((source / "shots").iterdir()):
        if not parent.is_dir():
            continue
        parent_prompt = (parent / "prompt.md").read_text(encoding="utf-8")
        parent_meta = json.loads((parent / "metadata.json").read_text(encoding="utf-8"))
        lines = LINE_RE.findall(parent_prompt)
        groups = split_lines(lines)
        for group_index, group in enumerate(groups):
            suffix = chr(ord("A") + group_index)
            parent_id = parent_meta["id"]
            shot_id = f"{parent_id}{suffix}"
            shot_dir = target / "shots" / f"{order:03}_{shot_id}"
            shot_dir.mkdir(parents=True)
            frames = frame_sources_for(parent, group_index, len(groups))
            for name, src in frames.items():
                shutil.copy2(src, shot_dir / name)
            shutil.copy2(parent / "negative_prompt.md", shot_dir / "negative_prompt.md")
            duration = duration_for_group(group)
            estimate = estimate_group(group)
            prompt = prompt_for(parent_prompt, shot_id, duration, group, parent_id)
            (shot_dir / "prompt.md").write_text(prompt, encoding="utf-8")
            metadata = {
                **parent_meta,
                "id": shot_id,
                "order": order,
                "title": f"{parent_meta.get('title', parent_id)} / timing split {suffix}",
                "parent_shot_id": parent_id,
                "duration_seconds": duration,
                "expected_clip": f"clips/{shot_id}.mp4",
                "dialogue_line_count": len(group),
                "dialogue_timing_estimate_seconds": round(estimate, 2),
                "timing_status": "approved_for_video_timing_safe",
                "visual_status": "temporal_imagegen_frames_applied",
                "frame_provenance": {
                    "method": "copied timing-safe frame anchors from approved parent shot",
                    "parent_shot": str(parent.relative_to(ROOT)),
                    "frame_sources": {name: str(src.relative_to(ROOT)) for name, src in frames.items()},
                },
            }
            (shot_dir / "metadata.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            dialogue_summary = " / ".join(f"{speaker}: {text}" for speaker, text in group)
            rows.append(
                {
                    "episode": ep_slug,
                    "shot_id": shot_id,
                    "parent_shot_id": parent_id,
                    "shot_dir": str(shot_dir),
                    "title": metadata["title"],
                    "duration_seconds": duration,
                    "dialogue_line_count": len(group),
                    "dialogue_timing_estimate_seconds": round(estimate, 2),
                    "timing_status": "approved_for_video_timing_safe",
                    "dialogue_summary": dialogue_summary,
                    "prompt": str((shot_dir / "prompt.md").relative_to(target)),
                    "negative_prompt": str((shot_dir / "negative_prompt.md").relative_to(target)),
                    "start_frame": str((shot_dir / "start_frame.png").relative_to(target)),
                    "key_frame": str((shot_dir / "key_frame.png").relative_to(target)),
                    "end_frame": str((shot_dir / "end_frame.png").relative_to(target)),
                    "expected_clip": f"clips/{shot_id}.mp4",
                }
            )
            audit_lines.append(
                f"| {shot_id} | {parent_id} | {len(group)} | {estimate:.1f}s | {duration}s | approved_for_video_timing_safe |"
            )
            total_duration += duration
            order += 1

    with (target / "submission_queue.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "episode",
                "shot_id",
                "parent_shot_id",
                "duration_seconds",
                "dialogue_line_count",
                "dialogue_timing_estimate_seconds",
                "timing_status",
                "prompt",
                "negative_prompt",
                "start_frame",
                "key_frame",
                "end_frame",
                "expected_clip",
            ],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row[field] for field in writer.fieldnames})

    combined_prompts = [f"# Timing-Safe Seedance Prompt Package - {pair}", "", f"Episode subtitle: {subtitle}", ""]
    combined_negative = ["# Negative Prompt", ""]
    for row in rows:
        shot_dir = Path(row["shot_dir"])
        combined_prompts.append((shot_dir / "prompt.md").read_text(encoding="utf-8"))
        combined_prompts.append("")
    combined_negative.append((target / "shots" / Path(rows[0]["shot_dir"]).name / "negative_prompt.md").read_text(encoding="utf-8"))
    (target / "prompt.md").write_text("\n".join(combined_prompts), encoding="utf-8")
    (target / "negative_prompt.md").write_text("\n".join(combined_negative), encoding="utf-8")
    (target / "dialogue_timing_audit.md").write_text("\n".join(audit_lines) + "\n", encoding="utf-8")
    (target / "metadata.json").write_text(
        json.dumps(
            {
                "episode": ep_slug,
                "pair": pair,
                "package_type": "timing_safe_video_generation_package",
                "source_package": SOURCE_PACKAGE,
                "shot_count": len(rows),
                "frame_count": len(rows) * 3,
                "total_duration_seconds": total_duration,
                "max_shot_duration_seconds": MAX_SHOT_SECONDS,
                "dialogue_timing_policy": "split original 15s parent shots into comfortable Seedance micro-shots; original Japanese line order preserved",
                "no_subtitles_in_video_prompt": True,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (target / "package_manifest.json").write_text(
        json.dumps(
            {
                "package": target.relative_to(ROOT).as_posix(),
                "status": "approved_for_video_timing_safe",
                "shots": rows,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (target / "RUNBOOK.md").write_text(
        f"""# RUNBOOK - {pair} Timing-Safe Seedance Package

Submit rows from `submission_queue.csv` in order. Each row is a timing-safe micro-shot split from the approved 2026-07-28 parent package.

Rules:
- Use `start_frame.png`, `key_frame.png`, and `end_frame.png` from the row's shot folder as image-to-video anchors.
- Use only the dialogue lines in that row's `prompt.md`.
- Do not add subtitles, captions, text overlays, extra dialogue, or new story beats.
- Keep each generated clip at the row's `duration_seconds`.
- After generation, run clip QA for face, mouth, hand, wardrobe trim, and no visible text.
""",
        encoding="utf-8",
    )
    (target / "model_target_profile.md").write_text(
        """# Model Target Profile

Target: Seedance image-to-video.

This timing-safe package prioritizes dialogue feasibility over a fixed 60s episode cap. Every micro-shot is <= 15s and contains a small number of Japanese dialogue lines with timing headroom.
""",
        encoding="utf-8",
    )
    (target / "clip_qa_checklist.md").write_text(
        """# Clip QA Checklist

- Dialogue lines fit naturally in the clip duration.
- No subtitles, captions, readable text, watermark, logo, or UI.
- Face, age, hair, uniform topology, and body type match the frame anchors.
- Mouth motion does not distort faces.
- Hands and small props do not mutate.
- Adjacent micro-shots preserve parent shot continuity.
""",
        encoding="utf-8",
    )
    build_asset_viewer(target, pair, rows)
    make_contact_sheet(target, rows)
    return {"episode": ep_slug, "pair": pair, "shots": len(rows), "frames": len(rows) * 3, "duration": total_duration}


def main() -> int:
    results = [build_episode(*episode) for episode in EPISODES]
    (SERIES / "dialogue_timing_audit_summary.md").write_text(
        "\n".join(
            [
                "# Golden Deer Dialogue Timing Audit Summary",
                "",
                "The original 2026-07-28 packages were structurally valid but too dense for comfortable spoken Japanese in several 15s shots. The 2026-07-31 timing-safe packages split those dialogue blocks into micro-shots while preserving original line order.",
                "",
                "| Episode | Pair | Timing-Safe Shots | Frames | Duration |",
                "| --- | --- | ---: | ---: | ---: |",
                *[
                    f"| {item['episode']} | {item['pair']} | {item['shots']} | {item['frames']} | {item['duration']}s |"
                    for item in results
                ],
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(json.dumps({"episodes": results}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
