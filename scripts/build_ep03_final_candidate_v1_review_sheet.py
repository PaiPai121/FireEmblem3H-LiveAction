import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path("episodes/EP03")
PROJECT = Path(".")
STAMP = "2026-08-02"
W, H = 420, 236
PAD = 18
LABEL_H = 34
COLS = 3


def font(size):
    for name in ("Arial.ttf", "Helvetica.ttc"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def fit_image(path):
    img = Image.open(path).convert("RGB")
    img.thumbnail((W, H), Image.Resampling.LANCZOS)
    tile = Image.new("RGB", (W, H), (12, 14, 14))
    tile.paste(img, ((W - img.width) // 2, (H - img.height) // 2))
    return tile


def find_shot(path, shot_id):
    if not path.exists():
        return {}
    data = json.loads(path.read_text())
    shots = data if isinstance(data, list) else data.get("shots", [])
    for shot in shots:
        if shot.get("id") == shot_id or shot.get("shot_id") == shot_id:
            return shot
    return {}


def read_delivery_shot(shot_id):
    manifest = json.loads((ROOT / "production_system/video_delivery_manifest.json").read_text())
    for shot in manifest.get("shots", []):
        if shot.get("id") == shot_id or shot.get("shot_id") == shot_id:
            package_shot = find_shot(ROOT / "delivery/complete_script_shot_asset_package_2026-08-01/shots.json", shot_id)
            queue_shot = find_shot(ROOT / "frame_generation_queue.json", shot_id)
            return {**package_shot, **queue_shot, **shot}
    raise KeyError(f"{shot_id} not found in video delivery manifest")


def project_path(value):
    if not value:
        return None
    path = Path(value)
    if value.startswith("episodes/EP03/"):
        return PROJECT / value
    if value.startswith("assets/"):
        return PROJECT / value
    if value.startswith("storyboards/") or value.startswith("production_system/"):
        return ROOT / value
    return path


def add_if_exists(tiles, label, value):
    path = project_path(value)
    if path and path.exists():
        tiles.append((label, path))


def main():
    if len(sys.argv) < 2:
        raise SystemExit("usage: build_ep03_final_candidate_v1_review_sheet.py Shot020 [previousShotId]")

    shot_id = sys.argv[1]
    previous_shot_id = sys.argv[2] if len(sys.argv) > 2 else None
    shot_lower = shot_id.lower()
    shot = read_delivery_shot(shot_id)
    out = ROOT / f"production_system/reviews/{shot_lower}_local_asset_final_candidate_v1_review_{STAMP}.jpg"

    tiles = []
    if previous_shot_id:
        previous_end = ROOT / f"storyboards/{previous_shot_id}/local_asset_final_candidate_v1_{STAMP}/end_frame_local_asset_final_candidate_v1_{STAMP}.png"
        add_if_exists(tiles, f"{previous_shot_id} end continuity", str(previous_end))
    add_if_exists(tiles, "local video source/evidence", shot.get("local_video_source_evidence"))
    add_if_exists(tiles, "local asset proof", shot.get("local_asset_proof_sheet"))
    add_if_exists(tiles, "identity comparison", shot.get("identity_comparison"))

    for ref in shot.get("asset_references", []):
        if "locations/" in ref:
            add_if_exists(tiles, f"location: {Path(ref).parent.name}", ref)
        elif "props/" in ref:
            add_if_exists(tiles, f"prop: {Path(ref).parent.name}", ref)
        elif "characters/" in ref:
            parts = Path(ref).parts
            label = "character"
            if len(parts) >= 3:
                label = f"character: {parts[-3]}"
            add_if_exists(tiles, label, ref)

    add_if_exists(tiles, "legacy candidate contact", f"storyboards/{shot_id}/imagegen_frameset_contact_sheet_2026-07-29.jpg")
    add_if_exists(tiles, "final candidate v1 start", f"storyboards/{shot_id}/local_asset_final_candidate_v1_{STAMP}/start_frame_local_asset_final_candidate_v1_{STAMP}.png")
    add_if_exists(tiles, "final candidate v1 key", f"storyboards/{shot_id}/local_asset_final_candidate_v1_{STAMP}/key_frame_local_asset_final_candidate_v1_{STAMP}.png")
    add_if_exists(tiles, "final candidate v1 end", f"storyboards/{shot_id}/local_asset_final_candidate_v1_{STAMP}/end_frame_local_asset_final_candidate_v1_{STAMP}.png")

    if len(tiles) < 6:
        raise FileNotFoundError(f"Too few review inputs for {shot_id}: {len(tiles)}")

    rows = (len(tiles) + COLS - 1) // COLS
    canvas = Image.new("RGB", (COLS * W + (COLS + 1) * PAD, 92 + rows * (H + LABEL_H + PAD) + PAD), (6, 7, 7))
    draw = ImageDraw.Draw(canvas)
    draw.text((PAD, 18), f"{shot_id} local asset final candidate v1 review / {STAMP}", fill=(242, 244, 238), font=font(25))
    chars = ", ".join(shot.get("characters", []))
    draw.text((PAD, 52), f"Still-frame QA: local refs, source evidence, START/KEY/END chain. Characters: {chars[:92]}", fill=(198, 205, 199), font=font(13))
    for idx, (label, path) in enumerate(tiles):
        row, col = divmod(idx, COLS)
        x = PAD + col * (W + PAD)
        y = 92 + row * (H + LABEL_H + PAD)
        draw.rectangle((x, y, x + W, y + LABEL_H - 1), fill=(14, 17, 17))
        draw.text((x + 9, y + 8), label[:42], fill=(238, 213, 147), font=font(15))
        canvas.paste(fit_image(path), (x, y + LABEL_H))
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, quality=92)
    print(out)


if __name__ == "__main__":
    main()
