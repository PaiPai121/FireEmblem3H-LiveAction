#!/usr/bin/env python3
"""Apply generated v2 storyboard visuals to Golden Deer support packages.

This script intentionally demotes the original composited reference mockups.
Only frames derived from image-generation outputs are surfaced in the v2 viewer.
"""

from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

from build_gdsc_web_panel import main as build_gdsc_web_panel


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
GEN = Path("/Users/zekun/.codex/generated_images/019fa8f8-a16f-7da2-9454-18a56bb99e7c")
PACKAGE = "delivery/video_generation_package_2026-07-28"
OUT_SIZE = (1280, 720)


MAPPING = {
    "EP01_hilda_lorenz/001_GDSC01-SH001": "call_V93JszLbdB2BcrnlJi4BaPWK.png",
    "EP01_hilda_lorenz/002_GDSC01-SH002": "call_t4q5cux2jiaf1ghNWwg15Jym.png",
    "EP01_hilda_lorenz/003_GDSC01-SH003": "call_CfC7rBJJWnGmSS1kyWWyLItD.png",
    "EP01_hilda_lorenz/004_GDSC01-SH004": "call_oFJAbYwZWfQ2XW1dgTKj83jS.png",
    "EP02_hilda_marianne/001_GDSC02-SH001": "call_k8etuF3gcCv7MWp1AliEqFjw.png",
    "EP02_hilda_marianne/002_GDSC02-SH002": "call_wQJcMgemlcxtR7WkMgbcNDFN.png",
    "EP02_hilda_marianne/003_GDSC02-SH003": "call_8Zdc1j4nVlkQje5667cMaNwe.png",
    "EP02_hilda_marianne/004_GDSC02-SH004": "call_gdKlyOVKEVjuNOZPokXWN0Lk.png",
    "EP03_hilda_lysithea/001_GDSC03-SH001": "call_sXr6ddjGpSIHhGszQ9nvvzcz.png",
    "EP03_hilda_lysithea/002_GDSC03-SH002": "call_gYdgBsmSEWu9dIFlNWKq3wsZ.png",
    "EP03_hilda_lysithea/003_GDSC03-SH003": "call_Qd3RN6GsykKzlfrDvlUQW8bT.png",
    "EP03_hilda_lysithea/004_GDSC03-SH004": "call_RFqCKvluoUf7p60ViS8cdfy3.png",
    "EP04_claude_lorenz/001_GDSC04-SH001": "call_i8sPkMCFptBlTIPNjtSorEdq.png",
    "EP04_claude_lorenz/002_GDSC04-SH002": "call_VaCLJRfhrZkMUBAZ7KR0GYLq.png",
    "EP04_claude_lorenz/003_GDSC04-SH003": "call_fFGx5UgU0DfRiVYOV3awJr0D.png",
    "EP04_claude_lorenz/004_GDSC04-SH004": "call_ebrNz6igq8oE0L4Wpn0mTHuJ.png",
}

V3_FRAME_MAPPING = {
    "EP01_hilda_lorenz/001_GDSC01-SH001/start_frame.png": "call_doOKApQ6EX7yMyKu2UqEsY2B.png",
    "EP01_hilda_lorenz/001_GDSC01-SH001/key_frame.png": "call_YLfQmhthXndV8WEQb3Rg9HUq.png",
    "EP01_hilda_lorenz/001_GDSC01-SH001/end_frame.png": "call_wzPbxZSni197yXoucXiiZxGG.png",
    "EP01_hilda_lorenz/002_GDSC01-SH002/start_frame.png": "call_CxLmd6JeilPCVB5NpZXUqDij.png",
    "EP01_hilda_lorenz/002_GDSC01-SH002/end_frame.png": "call_jD2tg4psWePwew2riW5S1vxH.png",
    "EP01_hilda_lorenz/003_GDSC01-SH003/start_frame.png": "call_MNLDuggIwlpOrXTGDtNDLF6q.png",
    "EP01_hilda_lorenz/003_GDSC01-SH003/end_frame.png": "call_9U3eMCyJnDUhJcGz3xBDzc4F.png",
    "EP01_hilda_lorenz/004_GDSC01-SH004/start_frame.png": "call_k0jAtoylEC5BjkZa7z5o5XlZ.png",
    "EP01_hilda_lorenz/004_GDSC01-SH004/end_frame.png": "call_ZyCUby3YyYJ7EYjCNqnVakMn.png",
    "EP02_hilda_marianne/001_GDSC02-SH001/start_frame.png": "call_vONDuZ4b3bvOg1YUPRapO6S3.png",
    "EP02_hilda_marianne/001_GDSC02-SH001/end_frame.png": "call_tRzHockD3WPbNeRrwczhhXCo.png",
    "EP02_hilda_marianne/002_GDSC02-SH002/start_frame.png": "call_BpKOzl6BCSN9rNaVdsUuSgCb.png",
    "EP02_hilda_marianne/002_GDSC02-SH002/end_frame.png": "call_I78PrPyJoxSsK43cSGr3MWX5.png",
    "EP02_hilda_marianne/003_GDSC02-SH003/start_frame.png": "call_9gP5Nf1BwWXRSOH0KvvuzwXn.png",
    "EP02_hilda_marianne/003_GDSC02-SH003/end_frame.png": "call_sveuYpfPtJMG9xTETYYTceKR.png",
    "EP02_hilda_marianne/004_GDSC02-SH004/start_frame.png": "call_QT6wxMz9lGSU4dEhNfD6zWL3.png",
    "EP02_hilda_marianne/004_GDSC02-SH004/end_frame.png": "call_UTPvxI2L1ByxCHMXH5QJ4bUT.png",
    "EP03_hilda_lysithea/001_GDSC03-SH001/start_frame.png": "call_3gwhKa6czxxB9ZgSHUkA7TFf.png",
    "EP03_hilda_lysithea/001_GDSC03-SH001/end_frame.png": "call_1mQ9mgOcRgaLc6MZD5M6cEwM.png",
    "EP03_hilda_lysithea/002_GDSC03-SH002/start_frame.png": "call_lV3A6MeJq1XbXz0mwL3mOvYC.png",
    "EP03_hilda_lysithea/002_GDSC03-SH002/end_frame.png": "call_lscFd75LT5WkOTtsDotSe3l9.png",
    "EP03_hilda_lysithea/003_GDSC03-SH003/start_frame.png": "call_lOS0KB0A6KxDd10dayZ6jOg6.png",
    "EP03_hilda_lysithea/003_GDSC03-SH003/end_frame.png": "call_cdQAhgcoHu1gvoQDG43tp46l.png",
    "EP03_hilda_lysithea/004_GDSC03-SH004/start_frame.png": "call_Jll9Hrjx4iLL0xOKfj3bTYlu.png",
    "EP03_hilda_lysithea/004_GDSC03-SH004/end_frame.png": "call_fe9dGLD9mjgCJVh3n1EwXmbM.png",
    "EP04_claude_lorenz/001_GDSC04-SH001/start_frame.png": "call_Yrr8dIJ9Z900rrQGf6xt7IKK.png",
    "EP04_claude_lorenz/001_GDSC04-SH001/end_frame.png": "call_oCAo9qdP4PDjPz0T2bdOA2ZJ.png",
    "EP04_claude_lorenz/002_GDSC04-SH002/start_frame.png": "call_KpWBk2BLqsCAdgSCNanK8Pjm.png",
    "EP04_claude_lorenz/002_GDSC04-SH002/end_frame.png": "call_ZPo7snoTWShuLMc7cQ3T8PMP.png",
    "EP04_claude_lorenz/003_GDSC04-SH003/start_frame.png": "call_jCoDCZnwWj47wNXvw1xneuqf.png",
    "EP04_claude_lorenz/003_GDSC04-SH003/end_frame.png": "call_ZtbKhjcAV492wc8V0E7xozZG.png",
    "EP04_claude_lorenz/004_GDSC04-SH004/start_frame.png": "call_a8QDx3L7lCP3Uuz68MfkLImE.png",
    "EP04_claude_lorenz/004_GDSC04-SH004/end_frame.png": "call_ObEAmoRrdH4VaOmGkzbfdGxw.png",
}


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def crop_reframe(img: Image.Image, zoom: float, x_bias: float, y_bias: float) -> Image.Image:
    img = img.convert("RGB")
    src_ratio = img.width / img.height
    dst_ratio = OUT_SIZE[0] / OUT_SIZE[1]
    if src_ratio > dst_ratio:
        crop_h = img.height
        crop_w = int(crop_h * dst_ratio)
    else:
        crop_w = img.width
        crop_h = int(crop_w / dst_ratio)
    crop_w = int(crop_w * zoom)
    crop_h = int(crop_h * zoom)
    max_x = img.width - crop_w
    max_y = img.height - crop_h
    left = int(max_x * x_bias)
    top = int(max_y * y_bias)
    return img.crop((left, top, left + crop_w, top + crop_h)).resize(OUT_SIZE, Image.Resampling.LANCZOS)


def aspect_safe_frame(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGB")
    return ImageOps.fit(image, OUT_SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def reject_old_frames(shot_dir: Path) -> None:
    rejected = shot_dir / "rejected_mockup_frames"
    rejected.mkdir(exist_ok=True)
    for name in ("start_frame.png", "key_frame.png", "end_frame.png"):
        frame = shot_dir / name
        if frame.exists():
            target = rejected / name
            if not target.exists():
                shutil.copy2(frame, target)


def apply_one(mapping_key: str, generated_name: str) -> Path:
    episode, shot = mapping_key.split("/")
    shot_dir = SERIES / episode / PACKAGE / "shots" / shot
    source = GEN / generated_name
    if not source.exists():
        raise FileNotFoundError(source)

    reject_old_frames(shot_dir)
    shutil.copy2(source, shot_dir / "generated_base_v2.png")
    img = Image.open(source)
    reframes = {
        "start_frame.png": (0.98, 0.44, 0.50),
        "key_frame.png": (1.00, 0.50, 0.50),
        "end_frame.png": (0.96, 0.56, 0.50),
    }
    for filename, args in reframes.items():
        crop_reframe(img, *args).save(shot_dir / filename, quality=96)

    metadata = load_json(shot_dir / "metadata.json")
    metadata["visual_version"] = "v2_imagegen"
    metadata["visual_status"] = "imagegen_base_applied"
    metadata["frame_provenance"] = {
        "source_image": str(source),
        "method": "image_gen generated base frame with cinematic reframes",
        "rejected_previous": "rejected_mockup_frames/",
        "strict_native_three_frame_generation": False,
    }
    metadata["updated_at"] = datetime.now().isoformat(timespec="seconds")
    write_json(shot_dir / "metadata.json", metadata)

    return shot_dir


def apply_v3_temporal_frames() -> None:
    by_shot: dict[Path, dict[str, str]] = {}
    for mapping_key, generated_name in V3_FRAME_MAPPING.items():
        episode, shot, frame = mapping_key.split("/")
        shot_dir = SERIES / episode / PACKAGE / "shots" / shot
        source = GEN / generated_name
        if not source.exists():
            raise FileNotFoundError(source)
        image = aspect_safe_frame(source)
        image.save(shot_dir / frame, quality=96)
        by_shot.setdefault(shot_dir, {})[frame] = str(source)

    for shot_dir, frame_sources in by_shot.items():
        metadata = load_json(shot_dir / "metadata.json")
        metadata["visual_version"] = "v3_temporal"
        metadata["visual_status"] = "temporal_imagegen_frames_applied"
        metadata["temporal_frame_provenance"] = {
            "method": "independent image_gen temporal frame generation",
            "aspect_policy": "aspect_safe_crop_no_stretch",
            "frame_sources": frame_sources,
        }
        metadata["updated_at"] = datetime.now().isoformat(timespec="seconds")
        write_json(shot_dir / "metadata.json", metadata)


def mark_pending() -> None:
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        shots_root = episode_dir / PACKAGE / "shots"
        if not shots_root.exists():
            continue
        for shot_dir in sorted(p for p in shots_root.iterdir() if p.is_dir()):
            key = f"{episode_dir.name}/{shot_dir.name}"
            if key in MAPPING:
                continue
            reject_old_frames(shot_dir)
            for name in ("start_frame.png", "key_frame.png", "end_frame.png"):
                frame = shot_dir / name
                if frame.exists():
                    frame.unlink()
            metadata = load_json(shot_dir / "metadata.json")
            metadata["visual_version"] = "v2_imagegen"
            metadata["visual_status"] = "pending_imagegen_retry"
            metadata["frame_provenance"] = {
                "rejected_previous": "rejected_mockup_frames/",
                "blocker": "image_gen edit endpoint network error; retry required",
            }
            metadata["updated_at"] = datetime.now().isoformat(timespec="seconds")
            write_json(shot_dir / "metadata.json", metadata)


def write_viewer(episode_dir: Path) -> None:
    package = episode_dir / PACKAGE
    shots = sorted(p for p in (package / "shots").iterdir() if p.is_dir())
    cards = []
    for shot in shots:
        meta = load_json(shot / "metadata.json")
        status = meta.get("visual_status", "unknown")
        frame_cells = []
        for name in ("start_frame.png", "key_frame.png", "end_frame.png"):
            if (shot / name).exists():
                frame_cells.append(f'<figure><img src="shots/{shot.name}/{name}" alt="{shot.name} {name}"><figcaption>{name}</figcaption></figure>')
            else:
                frame_cells.append(f'<figure class="missing-frame"><div>missing</div><figcaption>{name}</figcaption></figure>')
        cards.append(
            f"<section class=\"shot\"><h2>{shot.name}</h2><p class=\"status\">{status}</p>"
            f"<div class=\"frames\">{''.join(frame_cells)}</div></section>"
        )
    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{episode_dir.name} v2 Asset Viewer</title>
  <style>
    body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #111; color: #eee; }}
    header {{ padding: 24px 32px; background: #1c1c1c; position: sticky; top: 0; z-index: 2; }}
    h1 {{ margin: 0 0 8px; font-size: 24px; }}
    p {{ margin: 0; color: #bbb; }}
    .shot {{ padding: 24px 32px 28px; border-top: 1px solid #333; }}
    h2 {{ margin: 0 0 6px; font-size: 18px; }}
    .status {{ margin-bottom: 14px; color: #9ad; }}
    .frames {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }}
    figure {{ margin: 0; background: #1a1a1a; border: 1px solid #333; }}
    img {{ width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }}
    figcaption {{ padding: 8px 10px; font-size: 12px; color: #aaa; }}
    .missing-frame div {{ aspect-ratio: 16 / 9; display: grid; place-items: center; color: #777; background: #202020; }}
  </style>
</head>
<body>
  <header>
    <h1>{episode_dir.name} v2 Asset Viewer</h1>
    <p>Old composited mockups are rejected. Visible frames here are image-generation based v2 storyboard frames.</p>
  </header>
  {''.join(cards)}
</body>
</html>
"""
    (package / "asset_viewer.html").write_text(html, encoding="utf-8")
    (episode_dir / "asset_viewer.html").write_text(html.replace("shots/", f"{PACKAGE}/shots/"), encoding="utf-8")


def write_contact_sheet() -> None:
    shots = []
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        shots_root = episode_dir / PACKAGE / "shots"
        if not shots_root.exists():
            continue
        for shot_dir in sorted(p for p in shots_root.iterdir() if p.is_dir()):
            shots.append((episode_dir.name, shot_dir))

    cell_w, cell_h = 320, 180
    label_h = 34
    sheet = Image.new("RGB", (cell_w * 3, (cell_h + label_h) * len(shots)), "#101010")
    draw = ImageDraw.Draw(sheet)
    y = 0
    for episode, shot_dir in shots:
        draw.rectangle((0, y, sheet.width, y + label_h), fill="#181818")
        draw.text((8, y + 9), f"{episode} / {shot_dir.name}", fill="#eeeeee")
        for idx, name in enumerate(("start_frame.png", "key_frame.png", "end_frame.png")):
            x = idx * cell_w
            frame = shot_dir / name
            if frame.exists():
                thumb = Image.open(frame).convert("RGB").resize((cell_w, cell_h), Image.Resampling.LANCZOS)
            else:
                thumb = Image.new("RGB", (cell_w, cell_h), "#242424")
                d = ImageDraw.Draw(thumb)
                d.text((cell_w // 2 - 32, cell_h // 2 - 8), "PENDING", fill="#999999")
            sheet.paste(thumb, (x, y + label_h))
        y += cell_h + label_h
    sheet.save(SERIES / "all_episodes_contact_sheet_v2.jpg", quality=92)
    sheet.save(SERIES / "all_episodes_contact_sheet.jpg", quality=92)


def main() -> None:
    mark_pending()
    for key, generated in MAPPING.items():
        shot_dir = apply_one(key, generated)
        print(f"updated viewer source for {key}: {shot_dir}")
        write_viewer(SERIES / key.split("/")[0])
    apply_v3_temporal_frames()
    for episode_dir in sorted(SERIES.glob("EP*_*/")):
        if (episode_dir / PACKAGE / "shots").exists():
            write_viewer(episode_dir)
    write_contact_sheet()
    build_gdsc_web_panel()
    print("v2 visual pass applied")


if __name__ == "__main__":
    main()
