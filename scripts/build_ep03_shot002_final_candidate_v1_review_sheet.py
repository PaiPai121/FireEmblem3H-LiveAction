from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path("episodes/EP03")
SHOT = "Shot002"
OUT = ROOT / "production_system/reviews/shot002_local_asset_final_candidate_v1_review_2026-08-01.jpg"

TILES = [
    ("local video timing/context", ROOT / f"production_system/reviews/local_video_source_frames_2026-08-01/per_shot/{SHOT}/{SHOT}_local_video_source_evidence_2026-08-01.jpg"),
    ("identity plate: Byleth", ROOT / "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg"),
    ("local asset proof", ROOT / f"production_system/reviews/local_asset_previs_proof_2026-07-31/{SHOT}_local_asset_previs_proof_2026-07-31.jpg"),
    ("v3 local previs start", ROOT / f"storyboards/{SHOT}/start_frame.png"),
    ("v3 local previs key", ROOT / f"storyboards/{SHOT}/key_frame.png"),
    ("v3 local previs end", ROOT / f"storyboards/{SHOT}/end_frame.png"),
    ("final candidate v1 start", ROOT / f"storyboards/{SHOT}/local_asset_final_candidate_v1_2026-08-01/start_frame_local_asset_final_candidate_v1_2026-08-01.png"),
    ("final candidate v1 key", ROOT / f"storyboards/{SHOT}/local_asset_final_candidate_v1_2026-08-01/key_frame_local_asset_final_candidate_v1_2026-08-01.png"),
    ("final candidate v1 end", ROOT / f"storyboards/{SHOT}/local_asset_final_candidate_v1_2026-08-01/end_frame_local_asset_final_candidate_v1_2026-08-01.png"),
]

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


def main():
    rows = (len(TILES) + COLS - 1) // COLS
    canvas = Image.new("RGB", (COLS * W + (COLS + 1) * PAD, 92 + rows * (H + LABEL_H + PAD) + PAD), (6, 7, 7))
    draw = ImageDraw.Draw(canvas)
    draw.text((PAD, 18), "Shot002 local asset final candidate v1 review / 2026-08-01", fill=(242, 244, 238), font=font(25))
    draw.text((PAD, 52), "Purpose: compare local context, Byleth identity, v3 layout reference, and generated final candidate triptych.", fill=(198, 205, 199), font=font(13))
    for idx, (label, path) in enumerate(TILES):
        row, col = divmod(idx, COLS)
        x = PAD + col * (W + PAD)
        y = 92 + row * (H + LABEL_H + PAD)
        draw.rectangle((x, y, x + W, y + LABEL_H - 1), fill=(14, 17, 17))
        draw.text((x + 9, y + 8), label, fill=(238, 213, 147), font=font(15))
        canvas.paste(fit_image(path), (x, y + LABEL_H))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT, quality=92)
    print(OUT)


if __name__ == "__main__":
    main()
