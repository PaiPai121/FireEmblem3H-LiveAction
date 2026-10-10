#!/usr/bin/env python3
"""Build the Golden Deer support comedy web panel and main-site data."""

from __future__ import annotations

import json
from pathlib import Path

from build_gdsc_utf8_text_viewers import main as build_utf8_text_viewers
from build_gdsc_utf8_text_viewers import viewer_path


ROOT = Path(__file__).resolve().parents[1]
SERIES_ROOT = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"

EPISODES = [
    {
        "id": "EP01",
        "slug": "EP01_hilda_lorenz",
        "title": "Hilda x Lorenz C/C+",
        "subtitle": "希尔妲让洛廉兹替她干活",
        "pair": "Hilda & Lorenz",
        "rank": "C/C+ excerpt",
    },
    {
        "id": "EP02",
        "slug": "EP02_hilda_marianne",
        "title": "Hilda x Marianne C",
        "subtitle": "图书馆清扫甩锅",
        "pair": "Hilda & Marianne",
        "rank": "C excerpt",
    },
    {
        "id": "EP03",
        "slug": "EP03_hilda_lysithea",
        "title": "Hilda x Lysithea C",
        "subtitle": "撒娇专家遇到认真小孩",
        "pair": "Hilda & Lysithea",
        "rank": "C excerpt",
    },
    {
        "id": "EP04",
        "slug": "EP04_claude_lorenz",
        "title": "Claude x Lorenz C",
        "subtitle": "洛廉兹怀疑库罗德又在搞事",
        "pair": "Claude & Lorenz",
        "rank": "C excerpt",
    },
]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def doc_rel(path: Path) -> str:
    return rel(viewer_path(path))


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def episode_package(ep: dict) -> Path:
    return SERIES_ROOT / ep["slug"] / PACKAGE


def collect_episode(ep: dict) -> dict:
    package = episode_package(ep)
    package_metadata = load_json(package / "metadata.json")
    shots_root = package / "shots"
    shots = sorted(p for p in shots_root.iterdir() if p.is_dir())
    v3 = 0
    v2 = 0
    shot_rows = []
    for shot in shots:
        meta = load_json(shot / "metadata.json")
        visual_status = meta.get("visual_status", "")
        if visual_status in {
            "temporal_imagegen_frames_applied",
            "timing_repaired_imagegen_frames_applied",
            "dialogue_specific_imagegen_frames_applied",
        }:
            v3 += 1
        elif visual_status == "imagegen_base_applied":
            v2 += 1
        shot_rows.append(
            {
                "id": shot.name,
                "title": meta.get("title", shot.name),
                "duration": meta.get("duration_seconds", 15),
                "visual_status": visual_status,
                "start": rel(shot / "start_frame.png"),
                "key": rel(shot / "key_frame.png"),
                "end": rel(shot / "end_frame.png"),
                "prompt": doc_rel(shot / "prompt.md"),
                "negative": doc_rel(shot / "negative_prompt.md"),
                "zhSubtitle": doc_rel(shot / "zh_subtitle_text.md"),
                "metadata": doc_rel(shot / "metadata.json"),
            }
        )
    return {
        **ep,
        "language": "Japanese original",
        "dialoguePolicy": "excerpted; exact Japanese source lines, silent action bridges only; timing-safe micro-shot split",
        "shots": len(shots),
        "frames": len(shots) * 3,
        "durationSeconds": package_metadata.get("total_duration_seconds", 0),
        "v3Shots": v3,
        "v2Shots": v2,
        "status": "approved_for_video" if v3 + v2 == len(shots) else "visual_incomplete",
        "packageRoot": rel(package),
        "viewer": rel(package / "asset_viewer.html"),
        "episodeViewer": rel(SERIES_ROOT / ep["slug"] / "asset_viewer.html"),
        "contactSheet": rel(package / "visual_contact_sheet.jpg"),
        "queue": doc_rel(package / "submission_queue.csv"),
        "runbook": doc_rel(package / "RUNBOOK.md"),
        "promptQa": doc_rel(package / "prompt_qa_review.md"),
        "zhSubtitles": doc_rel(package / "zh_subtitles.md"),
        "zhSrt": doc_rel(package / "zh_subtitles.srt"),
        "manifest": doc_rel(package / "package_manifest.json"),
        "script": doc_rel(SERIES_ROOT / ep["slug"] / "script.md"),
        "sourceAudit": doc_rel(SERIES_ROOT / ep["slug"] / "source_audit.md"),
        "shotRows": shot_rows,
    }


def build_series_panel(episodes: list[dict]) -> None:
    total_shots = sum(ep["shots"] for ep in episodes)
    total_frames = sum(ep["frames"] for ep in episodes)
    total_seconds = sum(ep["durationSeconds"] for ep in episodes)
    v3_shots = sum(ep["v3Shots"] for ep in episodes)
    cards = []
    for ep in episodes:
        shot_sections = []
        for shot in ep["shotRows"]:
            status = shot["visual_status"]
            shot_sections.append(
                f"""
                <article class="shot-row" id="{shot['id']}">
                  <div class="shot-meta">
                    <p class="eyebrow">{shot['id']} / {shot['duration']}s</p>
                    <h3>{shot['title']}</h3>
                    <span class="status">{status}</span>
                  </div>
                  <div class="frames">
                    <figure><img src="../../{shot['start']}" alt="{shot['id']} start"><figcaption>start</figcaption></figure>
                    <figure><img src="../../{shot['key']}" alt="{shot['id']} key"><figcaption>key</figcaption></figure>
                    <figure><img src="../../{shot['end']}" alt="{shot['id']} end"><figcaption>end</figcaption></figure>
                  </div>
                  <div class="links">
                    <a href="../../{shot['prompt']}">prompt</a>
                    <a href="../../{shot['negative']}">negative</a>
                    <a href="../../{shot['zhSubtitle']}">中文字幕</a>
                    <a href="../../{shot['metadata']}">metadata</a>
                  </div>
                </article>
                """
            )
        cards.append(
            f"""
            <section class="episode" id="{ep['id']}">
              <div class="episode-head">
                <div>
                  <p class="eyebrow">Golden Deer / {ep['id']} / {ep['rank']}</p>
                  <h2>{ep['title']}</h2>
                  <p>{ep['subtitle']}</p>
                </div>
                <div class="episode-actions">
                  <a href="../../{ep['viewer']}">打开单集面板</a>
                  <a href="../../{ep['queue']}">submission_queue</a>
                  <a href="../../{ep['runbook']}">RUNBOOK</a>
                  <a href="../../{ep['promptQa']}">prompt QA</a>
                  <a href="../../{ep['zhSubtitles']}">中文字幕</a>
                  <a href="../../{ep['zhSrt']}">SRT</a>
                  <a href="../../{ep['script']}">script.md</a>
                </div>
              </div>
              <dl class="meta-grid">
                <div><dt>Support Pair</dt><dd>{ep['pair']}</dd></div>
                <div><dt>Support Rank</dt><dd>{ep['rank']}</dd></div>
                <div><dt>Language</dt><dd>{ep['language']}</dd></div>
                <div><dt>Visual Stage</dt><dd>{ep['v3Shots']} v3 / {ep['v2Shots']} v2</dd></div>
              </dl>
              <div class="shot-list">
                {''.join(shot_sections)}
              </div>
            </section>
            """
        )

    html = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>金鹿支援喜剧小剧场</title>
  <style>
    :root {{ color-scheme: dark; --bg:#101215; --panel:#181c21; --line:#303742; --ink:#eef3f8; --muted:#9eaab7; --accent:#e0b34d; --ok:#7fd6a4; }}
    * {{ box-sizing: border-box; }}
    body {{ margin:0; background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }}
    header {{ position:sticky; top:0; z-index:5; padding:20px clamp(16px,4vw,40px); border-bottom:1px solid var(--line); background:rgba(16,18,21,.94); backdrop-filter:blur(14px); }}
    h1,h2,h3,p {{ margin-top:0; }}
    h1 {{ margin-bottom:8px; font-size:clamp(24px,4vw,40px); }}
    header p {{ margin-bottom:14px; color:var(--muted); }}
    .eyebrow {{ margin-bottom:6px; color:var(--accent); font-size:12px; font-weight:900; text-transform:uppercase; }}
    nav {{ display:flex; flex-wrap:wrap; gap:8px; }}
    nav a,.episode-actions a,.links a {{ border:1px solid var(--line); border-radius:8px; padding:8px 10px; color:var(--ink); text-decoration:none; background:#1d2229; font-size:13px; font-weight:800; }}
    main {{ padding:22px clamp(16px,4vw,40px) 44px; }}
    .stats,.meta-grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin:0 0 20px; }}
    .stats div,.meta-grid div {{ border:1px solid var(--line); border-radius:8px; padding:12px; background:var(--panel); }}
    .stats strong {{ display:block; font-size:26px; }}
    .stats span,dt {{ color:var(--muted); font-size:12px; font-weight:900; }}
    dd {{ margin:4px 0 0; font-weight:800; }}
    .episode {{ margin-top:22px; border-top:1px solid var(--line); padding-top:22px; }}
    .episode-head {{ display:flex; justify-content:space-between; gap:18px; align-items:start; margin-bottom:14px; }}
    .episode-head p {{ color:var(--muted); margin-bottom:0; }}
    .episode-actions,.links {{ display:flex; flex-wrap:wrap; gap:8px; }}
    .shot-list {{ display:grid; gap:14px; }}
    .shot-row {{ border:1px solid var(--line); border-radius:8px; background:var(--panel); padding:12px; }}
    .shot-meta {{ display:flex; justify-content:space-between; gap:12px; align-items:start; margin-bottom:10px; }}
    .shot-meta h3 {{ margin-bottom:0; font-size:17px; }}
    .status {{ border-radius:999px; padding:5px 9px; color:#132015; background:var(--ok); font-size:11px; font-weight:900; white-space:nowrap; }}
    .frames {{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin-bottom:10px; }}
    figure {{ margin:0; border:1px solid var(--line); border-radius:8px; overflow:hidden; background:#111; }}
    img {{ display:block; width:100%; aspect-ratio:16/9; object-fit:cover; }}
    figcaption {{ padding:7px 9px; color:var(--muted); font-size:12px; font-weight:800; }}
    @media (max-width:760px) {{ .episode-head,.shot-meta {{ display:grid; }} .frames {{ grid-template-columns:1fr; }} }}
  </style>
</head>
<body>
  <header>
    <p class="eyebrow">Seedance video_generation_package / Golden Deer support comedy</p>
    <h1>金鹿支援喜剧小剧场</h1>
    <p>四集 timing-safe Seedance 包；每镜头不超过 15 秒；无字幕烧录；日文原支援台词节选；中文字幕作为外置 sidecar。</p>
    <nav>
      <a href="../../index.html#supportComedy">返回主站支援喜剧标签</a>
      <a href="../../{doc_rel(SERIES_ROOT / 'full_package_review_2026-08-04.md')}">完整视觉 Review</a>
      <a href="../../{doc_rel(SERIES_ROOT / 'full_package_review_2026-08-04.json')}">Review JSON</a>
      <a href="../../{doc_rel(SERIES_ROOT / 'aspect_geometry_audit_2026-08-04.md')}">比例/扁图 Audit</a>
      <a href="../../{doc_rel(SERIES_ROOT / 'prompt_qa_summary.md')}">prompt QA 总审核</a>
      <a href="../../{doc_rel(SERIES_ROOT / 'zh_subtitle_index.md')}">中文字幕索引</a>
      {''.join(f'<a href="#{ep["id"]}">{ep["id"]} {ep["subtitle"]}</a>' for ep in episodes)}
    </nav>
  </header>
  <main>
    <section class="stats">
      <div><strong>{len(episodes)}</strong><span>集数</span></div>
      <div><strong>{total_shots}</strong><span>镜头</span></div>
      <div><strong>{total_frames}</strong><span>交付帧</span></div>
      <div><strong>{total_seconds}s</strong><span>总时长</span></div>
      <div><strong>{v3_shots}</strong><span>v3 temporal 镜头</span></div>
    </section>
    {''.join(cards)}
  </main>
</body>
</html>
"""
    (SERIES_ROOT / "index.html").write_text(html, encoding="utf-8")


def main() -> None:
    build_utf8_text_viewers()
    episodes = [collect_episode(ep) for ep in EPISODES]
    build_series_panel(episodes)
    (SERIES_ROOT / "web_panel_manifest.json").write_text(
        json.dumps(
            {
                "series": "golden_deer_support_comedy",
                "viewer": rel(SERIES_ROOT / "index.html"),
                "episodes": episodes,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    build_utf8_text_viewers()
    print(f"built {SERIES_ROOT / 'index.html'}")


if __name__ == "__main__":
    main()
