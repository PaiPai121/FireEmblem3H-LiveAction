#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


EP_ROOT = Path("episodes/EP03")
OUT_DIR = EP_ROOT / "production_system" / "reviews" / "local_identity_plates_2026-08-01"
QUEUE_PATH = EP_ROOT / "frame_generation_queue.json"
ARTIFACT_MANIFEST_PATH = EP_ROOT / "production_system" / "artifact_manifest.json"
REVIEW_MANIFEST_PATH = EP_ROOT / "production_system" / "review_manifest.json"
CREATED_AT = "2026-08-01"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict | list) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def character_id(asset: str) -> str:
    parts = Path(asset).parts
    try:
        idx = parts.index("characters")
        return parts[idx + 2]
    except (ValueError, IndexError):
        return Path(asset).stem


def faction(asset: str) -> str:
    parts = Path(asset).parts
    try:
        idx = parts.index("characters")
        return parts[idx + 1]
    except (ValueError, IndexError):
        return "characters"


def era(asset: str) -> str:
    parts = Path(asset).parts
    try:
        idx = parts.index("characters")
        return "/".join(parts[idx + 3 : -1]) or "selected"
    except (ValueError, IndexError):
        return "selected"


def safe_slug(asset: str) -> str:
    return "_".join(Path(asset).with_suffix("").parts[-5:]).replace(" ", "_")


def fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    img = image.copy()
    img.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (18, 18, 18))
    x = (size[0] - img.width) // 2
    y = (size[1] - img.height) // 2
    canvas.paste(img, (x, y))
    return canvas


def crop_region(image: Image.Image, box_rel: tuple[float, float, float, float]) -> Image.Image:
    w, h = image.size
    x1, y1, x2, y2 = box_rel
    return image.crop((round(x1 * w), round(y1 * h), round(x2 * w), round(y2 * h)))


def draw_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], width: int, text: str, font: ImageFont.ImageFont) -> None:
    x, y = xy
    draw.rectangle((x, y, x + width, y + 28), fill=(0, 0, 0))
    draw.text((x + 8, y + 8), text[:76], fill=(238, 238, 238), font=font)


def build_asset_index() -> list[dict]:
    queue = load_json(QUEUE_PATH)
    assets: dict[str, dict] = {}
    for shot in queue.get("shots", []):
        metadata_path = EP_ROOT / "storyboards" / shot["id"] / "metadata.json"
        metadata = load_json(metadata_path)
        for asset in metadata.get("asset_references", []):
            if "/characters/" not in asset or not Path(asset).exists():
                continue
            row = assets.setdefault(
                asset,
                {
                    "character_id": character_id(asset),
                    "faction": faction(asset),
                    "era": era(asset),
                    "asset": asset,
                    "shots": [],
                },
            )
            row["shots"].append(shot["id"])
    return sorted(assets.values(), key=lambda item: (item["faction"], item["character_id"], item["era"], item["asset"]))


def build_plate(row: dict) -> dict:
    image = Image.open(row["asset"]).convert("RGB")
    font = ImageFont.load_default()
    cell = (260, 350)
    gutter = 12
    width = 4 * cell[0] + 5 * gutter
    height = cell[1] + 112
    sheet = Image.new("RGB", (width, height), (9, 9, 9))
    draw = ImageDraw.Draw(sheet)
    title = f"{row['character_id']} / {row['faction']} / {row['era']}"
    draw.text((gutter, 10), title, fill=(245, 245, 245), font=font)
    draw.text((gutter, 30), row["asset"], fill=(205, 205, 205), font=font)
    draw.text((gutter, 50), f"EP03 shots: {', '.join(row['shots'])}", fill=(185, 185, 185), font=font)

    crops = [
        ("full source", image),
        ("face identity crop", crop_region(image, (0.24, 0.04, 0.76, 0.42))),
        ("torso / costume topology", crop_region(image, (0.12, 0.22, 0.88, 0.76))),
        ("full silhouette crop", crop_region(image, (0.08, 0.03, 0.92, 0.96))),
    ]
    for idx, (label, crop) in enumerate(crops):
        x = gutter + idx * (cell[0] + gutter)
        y = 88
        sheet.paste(fit(crop, cell), (x, y))
        draw_label(draw, (x, y), cell[0], label, font)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{safe_slug(row['asset'])}_identity_plate_2026-08-01.jpg"
    sheet.save(out, quality=92)
    return {
        **row,
        "plate": str(out),
        "source_size": list(image.size),
        "status": "layout_reference",
    }


def build_atlas(rows: list[dict]) -> str:
    font = ImageFont.load_default()
    thumb = (280, 190)
    gutter = 12
    cols = 3
    rows_count = math.ceil(len(rows) / cols)
    width = cols * thumb[0] + (cols + 1) * gutter
    height = rows_count * (thumb[1] + 36) + (rows_count + 1) * gutter + 44
    atlas = Image.new("RGB", (width, height), (8, 8, 8))
    draw = ImageDraw.Draw(atlas)
    draw.text((gutter, 10), "EP03 local selected/reference identity plates / 2026-08-01", fill=(245, 245, 245), font=font)
    draw.text((gutter, 30), "Use these plates as face, hair, body, and wardrobe topology truth for regeneration.", fill=(205, 205, 205), font=font)
    for idx, row in enumerate(rows):
        plate = Image.open(row["plate"]).convert("RGB")
        x = gutter + (idx % cols) * (thumb[0] + gutter)
        y = 58 + (idx // cols) * (thumb[1] + 36 + gutter)
        atlas.paste(fit(plate, thumb), (x, y))
        label = f"{row['character_id']} / {len(row['shots'])} shots"
        draw_label(draw, (x, y + thumb[1]), thumb[0], label, font)
    out = OUT_DIR / "EP03_local_identity_plate_atlas_2026-08-01.jpg"
    atlas.save(out, quality=92)
    return str(out)


def build_markdown(rows: list[dict], atlas: str) -> str:
    lines = [
        "# EP03 Local Identity Plates",
        "",
        f"Created: {CREATED_AT}",
        "Decision: layout_reference",
        "",
        "These plates are local asset truth references for keyframe regeneration. They do not approve any generated frame.",
        "",
        f"Atlas: `{atlas}`",
        "",
        "| Character | Faction | Era | Shots | Source Asset | Plate |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for row in rows:
        lines.append(
            f"| {row['character_id']} | {row['faction']} | {row['era']} | {', '.join(row['shots'])} | `{row['asset']}` | `{row['plate']}` |"
        )
    return "\n".join(lines) + "\n"


def build_viewer(rows: list[dict], atlas: str) -> str:
    cards = []
    for row in rows:
        cards.append(
            f"""
      <article>
        <button type=\"button\" data-preview=\"/{row['plate']}\">
          <img src=\"/{row['plate']}\" alt=\"{row['character_id']} identity plate\">
        </button>
        <h2>{row['character_id']}</h2>
        <p>{row['faction']} / {row['era']}</p>
        <p>{len(row['shots'])} shots: {', '.join(row['shots'])}</p>
        <a href=\"/{row['asset']}\" target=\"_blank\" rel=\"noreferrer\">source</a>
      </article>
"""
        )
    return f"""<!doctype html>
<html lang=\"zh-CN\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>EP03 Local Identity Plates</title>
  <style>
    :root {{ color-scheme: dark; font-family: Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; background:#111514; color:#eef2ee; }}
    body {{ margin:0; background:#111514; }}
    header {{ position:sticky; top:0; z-index:2; padding:24px 32px; border-bottom:1px solid rgba(255,255,255,.14); background:rgba(17,21,20,.94); backdrop-filter:blur(14px); }}
    h1,h2,p {{ margin:0; }}
    header p {{ margin-top:8px; color:#adbbb4; }}
    main {{ padding:24px 32px 48px; display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }}
    article {{ border:1px solid rgba(255,255,255,.14); border-radius:8px; padding:12px; background:#18201d; }}
    button {{ display:block; width:100%; padding:0; border:0; background:#0b0e0d; cursor:pointer; }}
    img {{ display:block; width:100%; aspect-ratio:16/10; object-fit:cover; }}
    h2 {{ margin-top:10px; font-size:20px; }}
    article p {{ margin-top:6px; color:#cfd9d2; }}
    a {{ display:inline-block; margin-top:10px; color:#9fd3ff; text-decoration:none; border:1px solid rgba(255,255,255,.14); border-radius:5px; padding:7px 9px; background:rgba(255,255,255,.04); }}
    dialog {{ max-width:min(1100px,92vw); border:1px solid rgba(255,255,255,.2); background:#080908; padding:0; }}
    dialog img {{ width:100%; height:auto; aspect-ratio:auto; }}
  </style>
</head>
<body>
  <header>
    <h1>EP03 Local Identity Plates</h1>
    <p>Local face, hair, body, and wardrobe topology truth references for identity-locked regeneration. Atlas: <a href=\"/{atlas}\" target=\"_blank\">open atlas</a></p>
  </header>
  <main>{''.join(cards)}
  </main>
  <dialog id=\"preview\"><img alt=\"\"><button id=\"close\">close</button></dialog>
  <script>
    const dialog = document.querySelector('#preview');
    const img = dialog.querySelector('img');
    document.addEventListener('click', (event) => {{
      const button = event.target.closest('[data-preview]');
      if (!button) return;
      img.src = button.dataset.preview;
      dialog.showModal();
    }});
    document.querySelector('#close').addEventListener('click', () => dialog.close());
  </script>
</body>
</html>
"""


def upsert(items: list[dict], key: str, row: dict) -> None:
    for idx, item in enumerate(items):
        if item.get(key) == row.get(key):
            items[idx] = row
            return
    items.append(row)


def update_manifests(rows: list[dict], atlas: str) -> None:
    artifact_manifest = load_json(ARTIFACT_MANIFEST_PATH)
    review_manifest = load_json(REVIEW_MANIFEST_PATH)
    plate_paths = [row["plate"].replace(f"{EP_ROOT}/", "") for row in rows]
    paths = [
        "production_system/reviews/local_identity_plates_2026-08-01/index.json",
        "production_system/reviews/local_identity_plates_2026-08-01/index.md",
        "production_system/reviews/local_identity_plates_2026-08-01/viewer.html",
        atlas.replace(f"{EP_ROOT}/", ""),
        *plate_paths,
    ]
    artifact_id = "EP03-LOCAL-IDENTITY-PLATES-2026-08-01"
    upsert(
        artifact_manifest["artifacts"],
        "id",
        {
            "id": artifact_id,
            "type": "asset_character",
            "stage": "asset_review",
            "status": "layout_reference",
            "created_by": "asset-identity-qa-agent",
            "created_at": CREATED_AT,
            "paths": paths,
            "source_refs": ["frame_generation_queue.json", "production_system/video_delivery_manifest.json"],
            "depends_on": ["EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31"],
            "continuity": {
                "previous": "",
                "next": "",
                "in": "identity plates establish local character truth before regeneration",
                "out": "identity plates feed identity-locked keyframe regeneration prompts",
            },
            "risk_flags": ["identity_drift", "layout_reference_only"],
            "notes": "Local EP03 character identity plates: full source, face crop, torso/costume topology, and silhouette crop for every character asset used in EP03 metadata.",
        },
    )
    upsert(
        review_manifest["reviews"],
        "review_id",
        {
            "artifact_id": artifact_id,
            "review_id": "review-2026-08-01-ep03-local-identity-plates",
            "reviewer_role": "asset-identity-qa-agent",
            "reviewer": "codex",
            "created_at": CREATED_AT,
            "decision": "layout_reference",
            "blocking_issues": [
                "Identity plates are reference truth only; they do not approve regenerated keyframes.",
                "Face crops are heuristic crops from existing local images and must be checked visually before use as final proof.",
            ],
            "required_revisions": [
                "Use the plates as mandatory references in regenerated keyframe prompts.",
                "After regeneration, compare output faces and costumes against these plates before any promotion.",
            ],
            "rubric": {
                "local_asset_traceability": "pass",
                "coverage": "pass",
                "final_keyframe_readiness": "fail",
                "video_readiness": "blocked_needs_revision",
            },
            "reviewed_paths": paths,
        },
    )
    write_json(ARTIFACT_MANIFEST_PATH, artifact_manifest)
    write_json(REVIEW_MANIFEST_PATH, review_manifest)


def main() -> None:
    rows = [build_plate(row) for row in build_asset_index()]
    atlas = build_atlas(rows)
    write_json(OUT_DIR / "index.json", {"created_at": CREATED_AT, "atlas": atlas, "plates": rows})
    (OUT_DIR / "index.md").write_text(build_markdown(rows, atlas), encoding="utf-8")
    (OUT_DIR / "viewer.html").write_text(build_viewer(rows, atlas), encoding="utf-8")
    update_manifests(rows, atlas)
    print(f"built {len(rows)} EP03 local identity plates")


if __name__ == "__main__":
    main()
